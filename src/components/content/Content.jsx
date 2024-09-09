import { usePlayersStore } from "../../store/PlayersStore"; // Zustand 상태 가져오기
import { MainCanvas } from "./canvas/MainCanvas";
import { CanvasLayout } from "./canvasLayout/Layout";
import { Lobby } from "./lobby/Lobby";
import { useEffect } from "react";

export const Content = () => {
  const { characterSelectFinished, setCharacterSelectFinished, me, setMe } = usePlayersStore(); // Zustand에서 상태 사용

  if (characterSelectFinished && me) {
    return (
      <CanvasLayout>
        <MainCanvas />
      </CanvasLayout>
    );
  }

  return <Lobby />;
};
