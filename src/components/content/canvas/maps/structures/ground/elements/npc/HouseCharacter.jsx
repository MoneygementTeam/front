import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';
import { Textboard } from "../../3dUls/Textboard";
import { useAnimatedText } from "../../../../../../../hooks/useAnimatedText";

export const HouseCharacter = ({ position, onAppear }) => {
  const ref = useRef(null);
  const nameRef = useRef(null);
  const chatRef = useRef(null);
  const [text, setText] = useState("집값이 오르고 있어요!");
  const { displayText } = useAnimatedText(text);

  const { scene, animations } = useGLTF('/models/HouseCharacter.glb');
  const { actions } = useAnimations(animations, ref);
  const [currentAnimation, setCurrentAnimation] = useState('Idle');
  const [targetPosition, setTargetPosition] = useState(() => new Vector3(position.x, position.y, position.z));

  const fixedYPosition = useMemo(() => position.y + 1, [position.y]); // Y 위치를 1만큼 올림

  useEffect(() => {
    if (!ref.current) return;
    nameRef.current.position.set(
      ref.current.position.x,
      fixedYPosition + 3, // 이름 텍스트의 Y 위치
      ref.current.position.z
    );
    chatRef.current.position.set(
      ref.current.position.x,
      fixedYPosition + 3.5, // 대화 텍스트의 Y 위치
      ref.current.position.z
    );
    scene.traverse((object) => {
      if (object.isMesh) {
        object.castShadow = true;
        object.receiveShadow = true;
      }
    });
    actions[currentAnimation]?.play();
    onAppear();
    return () => {
      actions[currentAnimation]?.stop();
    };
  }, [scene, actions, currentAnimation, onAppear, fixedYPosition]);

  useEffect(() => {
    const interval = setInterval(() => {
      const random = Math.random();
      if (random < 0.6) {
        setCurrentAnimation('Walk');
        const newTarget = new Vector3(
          ref.current.position.x + (Math.random() - 0.5) * 5,
          fixedYPosition,
          ref.current.position.z + (Math.random() - 0.5) * 5
        );
        setTargetPosition(newTarget);
      } else if (random < 0.8) {
        setCurrentAnimation('Idle');
      } else {
        setCurrentAnimation('Wave');
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [fixedYPosition]);

  useFrame((state, delta) => {
    if (!ref.current || !nameRef.current || !chatRef.current) return;
    
    if (currentAnimation === 'Walk') {
      ref.current.position.lerp(new Vector3(targetPosition.x, fixedYPosition, targetPosition.z), 0.01);
      ref.current.lookAt(targetPosition.x, fixedYPosition, targetPosition.z);
    }

    // 이름과 대화 텍스트가 항상 카메라를 향하도록 설정
    nameRef.current.lookAt(state.camera.position);
    chatRef.current.lookAt(state.camera.position);

    // 이름과 대화 텍스트의 위치를 캐릭터 위치에 맞춰 업데이트
    nameRef.current.position.set(
      ref.current.position.x,
      fixedYPosition + 3,
      ref.current.position.z
    );
    chatRef.current.position.set(
      ref.current.position.x,
      fixedYPosition + 3.5,
      ref.current.position.z
    );
  });

  return (
    <>
      <Textboard ref={chatRef} text={displayText} />
      <Textboard ref={nameRef} text="집지기" isNpc />
      <primitive
        ref={ref}
        object={scene}
        position={[position.x, fixedYPosition, position.z]}
        scale={1}
        castShadow
        receiveShadow
      />
    </>
  );
};