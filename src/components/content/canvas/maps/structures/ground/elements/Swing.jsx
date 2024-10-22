import { useGLTF } from "@react-three/drei";
import { useEffect, useMemo } from "react";
import _ from "lodash-es";
import { Vector3 } from "three";
import { usePlayersStore } from "../../../../../../../store/PlayersStore"; // Zustand 상태 가져오기

const name = "ground-swing";
const scale = 0.04;

export const Swing = () => {
  const { setPlayGroundStructuresBoundingBox } = usePlayersStore(); // Zustand 상태 사용
  const { scene } = useGLTF("/models/Swing.glb");
  const position = useMemo(() => new Vector3(8, 0, 8), []);

  useEffect(() => {
    scene.traverse((mesh) => {
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    });
    const mesh = scene.children[0];
  }, [position, scene, setPlayGroundStructuresBoundingBox]);

  return (
    <primitive
      visible
      name={name}
      scale={[scale, scale, scale]}
      position={position}
      object={scene}
    />
  );
};
