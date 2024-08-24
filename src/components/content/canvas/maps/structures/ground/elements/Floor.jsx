import React from "react";
import { useLoader } from "@react-three/fiber";
import { RepeatWrapping, TextureLoader } from "three";
import { groundMapSize } from "../../../../../../../data/constants";
import { socket } from "../../../../../../../sockets/clientSocket";

export const Floor = () => {
  const sandTexture = useLoader(TextureLoader, "/sand.jpg");
  sandTexture.wrapS = RepeatWrapping;
  sandTexture.wrapT = RepeatWrapping;
  sandTexture.repeat.x = 5;
  sandTexture.repeat.y = 5;

  return (
    <mesh
      castShadow
      receiveShadow
      rotation-x={-Math.PI / 2}
      position-y={-0.001}
      onPointerUp={(e) => {
        socket.emit("move", [e.point.x, 0, e.point.z]);
      }}
    >
      <planeGeometry args={[groundMapSize, groundMapSize]} />
      <meshStandardMaterial map={sandTexture} />
    </mesh>
  );
};
