import { Floor } from "./elements/Floor";
import { Swing } from "./elements/Swing";
import { JungleGym } from "./elements/JungleGym";
import { Tree } from "./elements/Tree";
import { PineTrees } from "./elements/PineTrees";
import { Dinosaur } from "./elements/npc/Dinosaur";
import { Zombie } from "./elements/npc/Zombie";
import { ShibaInu } from "./elements/npc/Sihibainu";
import { WoodChest } from "./elements/WoodChest";
import { Key } from "./elements/Key";
import { Steak } from "./elements/Steak";
import { Cloud, Clouds } from "@react-three/drei";
import { HouseCharacter } from './elements/npc/HouseCharacter';
import { useRecoilValue, useSetRecoilState } from "recoil";
import { PlayerCompletedQuestsAtom, PlayersAtom, MeAtom } from "../../../../../../store/PlayersAtom";
import { RewardPopupAtom } from "../../../../../../store/ModalAtom";
import React, { useState, useEffect } from 'react';
import { Vector3 } from 'three';

export const GroundElements = () => {
  const playerCompletedQuests = useRecoilValue(PlayerCompletedQuestsAtom);
  const setRewardPopup = useSetRecoilState(RewardPopupAtom);
  const players = useRecoilValue(PlayersAtom);
  const me = useRecoilValue(MeAtom);
  const [showHouseCharacter, setShowHouseCharacter] = useState(false);
  const [houseCharacterPosition, setHouseCharacterPosition] = useState(new Vector3(0, 0, 0));

  useEffect(() => {
    if (playerCompletedQuests.includes("houseInvestment") && !showHouseCharacter && me) {
      const player = players.find(p => p.id === me.id);
      if (player) {
        // 플레이어 위치에서 약간 옆으로 이동한 위치 계산
        const offset = new Vector3(2, 0, 2); // 예: x와 z 방향으로 2 단위씩 이동
        const characterPosition = new Vector3(player.position.x, 0, player.position.z).add(offset);
        setHouseCharacterPosition(characterPosition);
        setShowHouseCharacter(true);
      } else {
        setHouseCharacterPosition(new Vector3(0, 0, 0));
        setShowHouseCharacter(true);
      }
    }
  }, [playerCompletedQuests, showHouseCharacter, players, me]);

  const handleHouseCharacterAppear = () => {
    setRewardPopup({
      isOpen: true,
      title: "새 캐릭터 획득!",
      subTitle: "House Character를 획득했습니다!"
    });
  };

  return (
    <>
      <Floor />

      <Dinosaur />
      <Zombie />


      <WoodChest />
      <Key />


      <Swing />
      <Clouds>
        <Cloud
          segments={100}
          volume={5}
          scale={2}
          concentrate={"random"}
          opacity={0.5}
          fade={10}
          speed={2}
          position={[-20, 0, -20]}
        />
        <Cloud
          segments={100}
          volume={5}
          scale={2}
          concentrate={"random"}
          opacity={0.1}
          fade={10}
          speed={2}
          position={[20, 0, -20]}
          color={"skyblue"}
        />
      </Clouds>
      {showHouseCharacter && (
        <HouseCharacter
          position={houseCharacterPosition}
          onAppear={handleHouseCharacterAppear}
        />
      )}
    </>
  );
};
