import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, Center } from "@react-three/drei";
import * as THREE from "three";
import { PocketWatch } from "./PocketWatch";

const PocketWatchReactComponent = () => {
  return (
    <div className="w-full sm:h-full h-[60%] absolute">
      <Canvas
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.3,
        }}
        camera={{ position: [0, 0, 5], fov: 45 }}
      >
        <Suspense fallback={null}>
          <Stage
            environment="dawn"
            intensity={1.2}
            adjustCamera={false}
            shadows={false}
          >
            <Center>
              <group scale={5}>

              <PocketWatch />
              </group>
            </Center>
          </Stage>
        </Suspense>

        <OrbitControls
          enableRotate={false}
          enableZoom={false}
          enablePan={false}
          makeDefault
          enableDamping
          dampingFactor={0.05}
          target={[0, 0, 0]}
        />
      </Canvas>
    </div>
  );
};

export default PocketWatchReactComponent;