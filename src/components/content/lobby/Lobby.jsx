import { useState } from "react";
import { STEPS } from "../../../data/constants";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  CharacterSelectFinishedAtom,
  ErrorToastAtom,
  SelectedCharacterGlbNameIndexAtom,
} from "../../../store/PlayersAtom";
import { isValidText } from "../../../utils";
import styled from "styled-components";
import { MainCanvas } from "../canvas/MainCanvas";
import { socket } from "../../../sockets/clientSocket";
import { API_SERVER } from "../../../client/RequestQueryClient.js";
import axios from "axios";
import { toast } from "react-toastify";
import { setSession } from "../../../store/SessionStore.js";
import {IsAssetModalAtom, IsModalOpenAtom} from "../../../store/ModalAtom.js";

export const Lobby = () => {
  const [currentStep, setCurrentStep] = useState(STEPS.NICK_NAME);
  const [tempNickName, setTempNickname] = useState();
  const [tempJobPosition, setTempJobPosition] = useState();
  const [selectedCharacterGlbNameIndex, setSelectedCharacterGlbNameIndex] =
    useRecoilState(SelectedCharacterGlbNameIndexAtom);
  const setCharacterSelectFinished = useSetRecoilState(
    CharacterSelectFinishedAtom
  );
  const [isErrorToastOpen, setIsErrorToastOpen] =
    useRecoilState(ErrorToastAtom);
  const [isModalOpen, setIsModalOpen] = useRecoilState(IsAssetModalAtom);

  if (!socket) return null;
  return (
    <LoginContainer>
      {currentStep === STEPS.NICK_NAME && (
        <>
          <LoginTitle>아이디를 입력해주세요</LoginTitle>
          <Input
            autoFocus
            placeholder="아이디를 입력해주세요."
            onChange={(e) => setTempNickname(e.target.value)}
            onKeyUp={(e) => {
              if (!isValidText(tempNickName)) return;
              if (e.key === "Enter") {
                setCurrentStep(STEPS.JOB_POSITION);
              }
            }}
          />
          <NextBtn
            disabled={!isValidText(tempNickName)}
            className={isValidText(tempNickName) ? "valid" : "disabled"}
            onClick={() => {
              setCurrentStep(STEPS.JOB_POSITION);
            }}
          >
            이대로 진행할래요
          </NextBtn>
        </>
      )}
      {currentStep === STEPS.JOB_POSITION && (
        <>
          <>
            <LoginTitle>게임내에서 사용할 내 이름이예요</LoginTitle>
            <Input
              autoFocus
              placeholder="이름을 입력해주세요"
              onChange={(e) => setTempJobPosition(e.target.value)}
              onKeyUp={(e) => {
                if (!isValidText(tempJobPosition)) return;
                if (e.key === "Enter") {
                  setCurrentStep((prev) => prev + 1);
                }
              }}
            />
            <NextBtn
              disabled={!isValidText(tempJobPosition)}
              className={isValidText(tempJobPosition) ? "valid" : "disabled"}
              onClick={async () => {
                setCurrentStep((prev) => prev + 1);
              }}
            >
              이대로 진행할래요
            </NextBtn>
            <PrevBtn
              onClick={() => {
                setCurrentStep((prev) => prev - 1);
                setTempNickname();
              }}
            >
              이전으로 돌아갈래요
            </PrevBtn>
          </>
        </>
      )}
      {currentStep === STEPS.CHARACTER && (
        <>
          <LoginTitle>게임내에서 사용할 내 아바타를 고를시간이에요</LoginTitle>
          <CharacterCanvasContainer>
            <CharacterTunningWrapper>
              <CharacterCanvasWrapper>
                <MainCanvas />
              </CharacterCanvasWrapper>
            </CharacterTunningWrapper>

            <NextBtn
              className={
                !tempNickName || !tempJobPosition ? "disabled" : "valid"
              }
              onClick={async () => {
                if (!tempNickName || !tempJobPosition) return;

                socket.emit("initialize", {
                  tempNickName,
                  tempJobPosition,
                  selectedCharacterGlbNameIndex,
                  myRoom: { object: [] },
                });
                setIsModalOpen(true);
                setCharacterSelectFinished(true);
              }}
              onKeyUp={(e) => {
                if (!tempNickName || !tempJobPosition) return;
                if (e.key === "Enter") {
                  socket.emit("initialize", {
                    tempNickName,
                    tempJobPosition,
                    selectedCharacterGlbNameIndex,
                    myRoom: { object: [] },
                  });
                  setCharacterSelectFinished(true);
                }
              }}
            >
              이 모습으로 진행할래요
            </NextBtn>
            <PrevBtn
              onClick={() => {
                setSelectedCharacterGlbNameIndex((prev) => {
                  if (prev === undefined) return 1;
                  if (prev === 2) return 0;
                  return prev + 1;
                });
              }}
            >
              다른 케릭터도 볼래요
            </PrevBtn>
            <PrevBtn
              onClick={() => {
                setCurrentStep((prev) => prev - 1);
              }}
            >
              이전으로 돌아갈래요
            </PrevBtn>
          </CharacterCanvasContainer>
        </>
      )}
      {currentStep === STEPS.FINISH && <></>}
    </LoginContainer>
  );
};

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
  width: 100%;
  height: 100%;
  background-color: #85e6ff;
`;

const LoginTitle = styled.div`
  font-size: 22px;
  font-weight: 700;
`;

const CharacterCanvasContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
  width: 1200px;
  height: 80%;
`;

const CharacterTunningWrapper = styled.div`
  width: 100%;
  height: 80%;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const CharacterCanvasWrapper = styled.div`
  flex: 2;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const Input = styled.input`
  font-size: 24px;
  border: none;
  outline: none;
  padding: 12px 10px;
  border-radius: 8px;
  width: 200px;
  font-size: 18px;
`;

const NextBtn = styled.button`
  padding: 10px;
  width: 200px;
  font-size: 14px;
  border-radius: 8px;
  border: none;
  outline: none;
  font-weight: 600;
  transition-duration: 0.2s;
  &.valid {
    background-color: #6731a1;
    color: #fff;
    cursor: pointer;

    &:hover {
      background-color: #340070;
      color: #fff;
    }
  }

  &.disabled {
    background-color: #8aceff;
    color: #ededed;
    cursor: not-allowed;
  }
`;

const PrevBtn = styled.button`
  padding: 10px;
  width: 200px;
  font-size: 14px;
  border-radius: 8px;
  border: none;
  outline: none;
  font-weight: 600;
  color: #666666;
  cursor: pointer;
`;
