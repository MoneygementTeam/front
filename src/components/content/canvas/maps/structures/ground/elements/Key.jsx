import { useGLTF } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import { Vector3 } from "three";
import gsap from "gsap";
import {
  PlayerCompletedQuestsAtom,
  PlayerInventoryAtom,
} from "../../../../../../../store/PlayersAtom";
import { useRecoilState, useRecoilValue } from "recoil";
import { uniq } from "lodash-es";

const name = "ground-key";
export const Key = () => {
  const ref = useRef(null);
  const [playerInventory, setPlayerInventory] =
    useRecoilState(PlayerInventoryAtom);
  const playerCompletedQuests = useRecoilValue(PlayerCompletedQuestsAtom);

  const { scene } = useGLTF("/models/Key.glb");
  const position = useMemo(() => new Vector3(22, 1, -18), []);
  useEffect(() => {
    scene.traverse((mesh) => {
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    });
    if (ref.current)
      gsap.to(ref.current.rotation, {
        duration: 3,
        repeat: -1,
        repeatDelay: 0,
        y: Math.PI * 6,
      });
  }, [position, scene]);

  if (
    playerCompletedQuests.includes("treasure") ||
    playerInventory.includes("key")
  ) {
    return null;
  }
  return (
    <>
      <rectAreaLight
        args={["yellow", 30, 5, 5]}
        position={[position.x, 0, position.z]}
        rotation-x={Math.PI / 2}
      />
      <primitive
        onClick={(e) => {
          e.stopPropagation();
          alert("열쇠를 얻었습니다!");
          setPlayerInventory((prev) => uniq([...prev, "key"]));
        }}
        ref={ref}
        visible
        name={name}
        scale={1}
        position={position}
        rotation-z={Math.PI / 2.5}
        object={scene}
      />
    </>
  );
};
