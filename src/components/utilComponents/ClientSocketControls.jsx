import { useEffect } from "react";
import { socket } from "../../sockets/clientSocket";
import { useRecoilState, useSetRecoilState } from "recoil";
import { MeAtom, PlayersAtom } from "../../store/PlayersAtom";

export const ClientSocketControls = () => {
  const setPlayers = useSetRecoilState(PlayersAtom);
  const [me, setMe] = useRecoilState(MeAtom);
  useEffect(() => {
    const handleConnect = () => {
      console.info("연결됨");
    };
    const handleDisconnect = () => {
      console.info("연결이 끊김");
    };
    const handleInitialize = (value) => {
      console.log(value);
      setMe(value);
      console.info("초기화됨");
    };
    const handleEnter = () => {
      console.info("입장함");
    };
    const handleExit = () => {
      console.info("퇴장함");
    };
    const handlePlayers = (value) => {
      setPlayers(value);
      const newMe = value.find((p) => p && me && p?.id === me?.id);
      console.log("newMe", newMe);
      if (newMe) {
        setMe(newMe);
      }
    };
    const handleNewText = () => {
      console.info("새로운 텍스트");
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("initialize", handleInitialize);
    socket.on("enter", handleEnter);
    socket.on("exit", handleExit);
    socket.on("players", handlePlayers);
    socket.on("newText", handleNewText);
    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("initialize", handleInitialize);
      socket.off("enter", handleEnter);
      socket.off("exit", handleExit);
      socket.off("players", handlePlayers);
      socket.off("newText", handleNewText);
    };
  }, [me, setMe, setPlayers]);
  return null;
};
