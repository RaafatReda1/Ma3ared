import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, Center } from "@react-three/drei";
import { Suspense } from "react";
import * as THREE from "three";
import { PocketWatch } from "./PocketWatch";

const PocketWatchReactComponent = () => {
  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0,
        }}
        camera={{ position: [0, 0, 8], fov: 45 }}
      >
        <Suspense fallback={null}>
          <Stage
            environment="city"
            intensity={1.0}
            adjustCamera={1.2}
            shadows={{ type: "contact", opacity: 0.5, blur: 2 }}
          >
            <Center>
              <PocketWatch />
            </Center>
          </Stage>
        </Suspense>

        {/* CONTROLS */}
        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.05}
          target={[0, 0, 0]}
          minDistance={0.1}
          maxDistance={2000}
          autoRotate={false}
        />
      </Canvas>
    </div>
  );
};

export default PocketWatchReactComponent;
