import { useGLTF } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import { Vector3 } from "three";
import { Textboard } from "../../3dUls/Textboard";
import { useAnimatedText } from "../../../../../../../hooks/useAnimatedText";
import { useFrame, useThree } from "@react-three/fiber";
import { usePlayersStore } from '../../../../../../../../store/PlayersStore'; // Zustand 상태 가져오기
import { useModalStore } from '../../../../../../../../store/ModalStore'; // Zustand 상태 가져오기
import { useTranslation } from "react-i18next";

const name = "ground-npc-dinosaur";
const text = "개천에서 용나고 싶니? 크앙~~";

export const Dinosaur = () => {
  const ref = useRef(null);
  const nameRef = useRef(null);
  const chatRef = useRef(null);
  const { scene } = useGLTF("/models/CuteRedDino.glb");
  const position = useMemo(() => new Vector3(0, 0, -5), []);
  
  const [isPlayerNear, setIsPlayerNear] = useState(false);
  const { players, me } = usePlayersStore();
  const { setIsQuizModalOpen } = useModalStore();
  const { scene: threeScene } = useThree();

  const { t } = useTranslation();
  const text = t('monster.dino_say', "개천에서 용나고 싶니? 크앙~~");
  const dinosaurName = t('monster.dino', "퀴즈공룡");
  const { displayText } = useAnimatedText(text);

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

  useEffect(() => {
    const checkPlayerProximity = () => {
      if (me && ref.current) {
        const playerObject = threeScene.getObjectByName(me.id);
        if (playerObject) {
          const distance = ref.current.position.distanceTo(playerObject.position);
          setIsPlayerNear(distance < 5); // 5 units as an example proximity
        }
      }
    };

    const intervalId = setInterval(checkPlayerProximity, 1000); // Check every second

    return () => clearInterval(intervalId);
  }, [me, threeScene]);

  useFrame(() => {
    if (!chatRef.current) return;
    if (!nameRef.current) return;
    chatRef.current.lookAt(10000, 10000, 10000);
    nameRef.current.lookAt(10000, 10000, 10000);
  });

  const handleClick = (event) => {
    if (isPlayerNear) {
      event.stopPropagation();
      setIsQuizModalOpen(true);
    }
  };

  return (
    <>
      <Textboard ref={chatRef} text={displayText} />
      <Textboard ref={nameRef} text={dinosaurName} isNpc />
      <primitive
        ref={ref}
        visible
        name={name}
        scale={2}
        position={position}
        object={scene}
        onClick={handleClick}
      />
    </>
  );
};

useGLTF.preload("/models/CuteRedDino.glb");
