import { useGLTF } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import { Vector3 } from "three";
import gsap from "gsap";
import {
  PlayerCompletedQuestsAtom,
  PlayerInventoryAtom,
} from "../../../../../../../store/PlayersAtom";
import { useRecoilState } from "recoil";

const name = "ground-wood-chest";
export const WoodChest = () => {
  const ref = useRef(null);

  const [playerInventory, setPlayerInventory] =
    useRecoilState(PlayerInventoryAtom);
  const [playerCompletedQuests, setPlayerCompletedQuests] = useRecoilState(
    PlayerCompletedQuestsAtom
  );

  const { scene } = useGLTF("/models/Wood Chest.glb");
  const position = useMemo(() => new Vector3(8, 0, 0), []);
  useEffect(() => {
    scene.traverse((mesh) => {
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    });
  }, [position, scene]);

  useEffect(() => {
    if (ref.current)
      gsap.to(ref.current.scale, {
        yoyo: true,
        repeat: -1,
        x: 1.1,
        y: 1.1,
        z: 1.1,
      });
  }, []);
  if (playerCompletedQuests.includes("treasure")) return null;
  return (
    <>
      <rectAreaLight
        args={["yellow", 50, 5, 5]}
        position={[position.x, 0, position.z]}
        rotation-x={Math.PI / 2}
      />
      <primitive
        ref={ref}
        onClick={(e) => {
          e.stopPropagation();
          if (playerInventory.includes("key")) {
            alert("조기 퇴근권을 획득했습니다. 야근좀비의 퇴근을 도와주세요.!");
            setPlayerInventory((prev) => [
              ...prev.filter((item) => item !== "key"),
              "ticket",
            ]);
            setPlayerCompletedQuests((prev) => [...prev, "treasure"]);
          } else {
            alert("열쇠가 필요합니다!");
          }
          // 키를 안가졌을 때는 키 가져오라고 보여주고, 키 가졌을땐 보물 획득
        }}
        name={name}
        scale={1}
        position={position}
        object={scene}
      />
    </>
  );
};
