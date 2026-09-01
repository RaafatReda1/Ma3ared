import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Center } from '@react-three/drei';
import * as THREE from 'three';
import { PocketWatch } from '../PocketWatch/PocketWatch';

// Non-linear easing function for smooth dwelling at cardinal angles (0°, 90°, 180°, 270°, 360°)
function smoothStep(t) {
  return t * t * (3 - 2 * t);
}

function WatchRotator({ isHeroMode = false }) {
  const groupRef = useRef();
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    if (isHeroMode) {
      // In Hero mode: gentle floating & subtle slow rotation
      timeRef.current += delta * 0.4;
      groupRef.current.rotation.y = Math.sin(timeRef.current * 0.5) * 0.35;
      groupRef.current.rotation.x = Math.sin(timeRef.current * 0.8) * 0.08;
      groupRef.current.position.y = Math.sin(timeRef.current * 1.2) * 0.08;
      return;
    }

    // In Intro mode: 1 full majestic 360° rotation cycle across ~5.5 seconds
    timeRef.current += delta * (1.0 / 5.5);
    const raw = timeRef.current % 1; // 0..1 over 5.5s

    // 4 cardinal stages: Face (0°) -> Side (90°) -> Back (180°) -> Other Side (270°) -> Face (360°)
    const quarter = Math.floor(raw * 4);
    const localT = (raw * 4) % 1;
    const eased = smoothStep(smoothStep(localT)); // double-smoothstep for silky cinematic deceleration

    const fromAngle = quarter * (Math.PI / 2);
    const toAngle = (quarter + 1) * (Math.PI / 2);
    const angle = fromAngle + (toAngle - fromAngle) * eased;

    groupRef.current.rotation.y = angle;

    // Subtle 3D dynamic tilt
    groupRef.current.rotation.x = Math.sin(raw * Math.PI * 2) * 0.09;
    groupRef.current.rotation.z = Math.cos(raw * Math.PI * 2) * 0.04;
  });

  return (
    <group ref={groupRef}>
      <Center>
        <group scale={isHeroMode ? 4.6 : 5}>
          <PocketWatch animateHands={isHeroMode} />
        </group>
      </Center>
    </group>
  );
}

export default function WatchScene({ isHeroMode = false }) {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{
        antialias: true,
        alpha: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 5,
      }}
      camera={{ position: [0, 0.2, 5.2], fov: 42 }}
      style={{ width: '100%', height: '100%' }}
    >
      {/* Studio Lighting Setup */}
      {/* 1. Warm Ambient Base */}
      <ambientLight intensity={0.9} color="#fff8ea" />

      {/* 2. Key Golden Light from Top-Left */}
      <directionalLight position={[3, 5, 4]} intensity={2.2} color="#ffe2b0" />

      {/* 3. Cool Accent Fill Light from Bottom-Right */}
      <directionalLight position={[-4, -2, 3]} intensity={0.9} color="#9ec2ff" />

      {/* 4. Direct Clock Face Spotlight */}
      <pointLight position={[0, 0.5, 4.5]} intensity={1.6} color="#ffffff" distance={12} />

      {/* 5. Gold Rim Backlight for Casing Definition */}
      <pointLight position={[0, 4, -4]} intensity={1.4} color="#f3c87e" distance={14} />

      <WatchRotator isHeroMode={isHeroMode} />
    </Canvas>
  );
}
