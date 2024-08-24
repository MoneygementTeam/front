import { useGLTF } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import { Vector3 } from "three";
import { Textboard } from "../../3dUls/Textboard";
import { useAnimatedText } from "../../../../../../../hooks/useAnimatedText";
import { useFrame } from "@react-three/fiber";

const name = "ground-npc-dinosaur";
const text = "나는 무서운 육식 공룡이야..! 크아앙~   ";
export const Dinosaur = () => {
  const ref = useRef(null);
  const nameRef = useRef(null);
  const chatRef = useRef(null);
  const { displayText } = useAnimatedText(text);
  const { scene } = useGLTF("/models/CuteRedDino.glb");
  const position = useMemo(() => new Vector3(0, 0, -5), []);

  useEffect(() => {
    if (!ref.current) return;
    if (!chatRef.current) return;
    if (!nameRef.current) return;
    chatRef.current.position.set(
      ref.current.position.x,
      ref.current.position.y + 4.5,
      ref.current.position.z
    );
    nameRef.current.position.set(
      ref.current.position.x,
      ref.current.position.y + 4,
      ref.current.position.z
    );
    scene.traverse((mesh) => {
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    });
  }, [position, scene]);
  useFrame(() => {
    if (!chatRef.current) return;
    if (!nameRef.current) return;
    chatRef.current.lookAt(10000, 10000, 10000);
    nameRef.current.lookAt(10000, 10000, 10000);
  });

  return (
    <>
      <Textboard ref={chatRef} text={displayText} />
      <Textboard ref={nameRef} text="디노" isNpc />
      <primitive
        ref={ref}
        visible
        name={name}
        scale={2}
        position={position}
        object={scene}
      />
    </>
  );
};
