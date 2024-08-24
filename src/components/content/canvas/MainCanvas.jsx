import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { RootMap } from "./maps/RootMap";

export const MainCanvas = () => {
  const aspectRatio = window.outerWidth / window.outerHeight;
  return (
    <Canvas
      id="canvas"
      gl={{ antialias: true }}
      shadows
      camera={{
        fov: 45,  // 시야각을 넓힘
        aspect: aspectRatio,
        near: 0.1,
        far: 1000,
        position: [30, 30, 30],  // 카메라 위치를 더 멀리 이동
      }}
    >
      <ambientLight name="ambientLight" intensity={5} />
      <directionalLight
        castShadow
        intensity={10}
        position={[0, 50, -50]}
        shadow-normalBias={0.1}
        shadow-camera-left={-50}  // 그림자 영역 확장
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
        shadow-camera-near={0.1}
        shadow-camera-far={200}
      />
      <OrbitControls />
      <RootMap />
    </Canvas>
  );
};