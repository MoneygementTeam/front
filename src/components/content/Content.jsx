import { useRecoilState, useRecoilValue } from "recoil";
import { CharacterSelectFinishedAtom, MeAtom } from "../../store/PlayersAtom";
import { MainCanvas } from "./canvas/MainCanvas";
import { CanvasLayout } from "./canvasLayout/Layout";
import { Lobby } from "./lobby/Lobby";
import { getSession } from "../../store/SessionStore";
import { socket } from "../../sockets/clientSocket";
import { useEffect } from "react";

export const Content = () => {
  const [characterSelectFinished, setCharacterSelectFinished] = useRecoilState(
    CharacterSelectFinishedAtom
  );
  const [me, setMe] = useRecoilState(MeAtom);
  if (characterSelectFinished && me) {
    return (
      <CanvasLayout>
        <MainCanvas />
      </CanvasLayout>
    );
  }

  return <Lobby />;
};
