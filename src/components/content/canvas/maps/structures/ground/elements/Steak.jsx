import { useGLTF } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import { Vector3 } from "three";
import { uniq } from "lodash-es";
import { useRecoilState } from "recoil";
import { PlayerInventoryAtom } from "../../../../../../../store/PlayersAtom";

const name = "ground-steak";
export const Steak = () => {
  const ref = useRef(null);
  const [, setPlayerInventory] = useRecoilState(PlayerInventoryAtom);

  const { scene } = useGLTF("/models/Steak.glb");
  const position = useMemo(() => new Vector3(-8, 0, -2), []);

  useEffect(() => {
    scene.traverse((mesh) => {
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    });
  }, [position, scene]);

  return (
    <primitive
      ref={ref}
      onClick={(e) => {
        e.stopPropagation();
        alert("고기를 얻었습니다!");
        setPlayerInventory((prev) => uniq([...prev, "food"]));
        if (ref.current) {
          ref.current.visible = false;
        }
      }}
      visible
      name={name}
      scale={1}
      position={position}
      object={scene}
    />
  );
};
