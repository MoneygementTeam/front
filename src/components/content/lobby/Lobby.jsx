import React, { useState, useEffect } from "react";
import { STEPS } from "../../../data/constants";
import { usePlayersStore } from "../../../store/PlayersStore";
import { isValidText } from "../../../utils";
import styled, { keyframes } from "styled-components";
import { MainCanvas } from "../canvas/MainCanvas";
import { socket } from "../../../sockets/clientSocket";
import { useModalStore } from "../../../store/ModalStore.js";
import { useTranslation } from "react-i18next";
import logoImage from "/moneygement_logo.png"; // 로고 이미지 import
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { CONTRACT_ADDRESS, mode, NODE_URL } from "../aptos/Aptos.js";
import ConnectWalletModal from "../modal/ConnectWalletModal";

const NETWORK_STR = Network.DEVNET;
const config = new AptosConfig({ network: NETWORK_STR });
const aptosClient = new Aptos(config);

const autoCmRefresh = 10000;

const OPENING_DURATION = 2000; // 2 seconds

export const Lobby = () => {
  const [currentStep, setCurrentStep] = useState(STEPS.OPENING);
  const [tempNickName, setTempNickname] = useState("");
  const [tempJobPosition, setTempJobPosition] = useState("");
  const { setSelectedCharacterGlbNameIndex, selectedCharacterGlbNameIndex, setCharacterSelectFinished } = usePlayersStore();
  const { setIsModalOpen } = useModalStore();
  const { t } = useTranslation();

    // wallet
    const wallet = useWallet();
    const [expireTime, setExpireTime] = useState();
    const [currentSupply, setCurrentSupply] = useState();
    const [maxSupply, setMaxSupply] = useState();
    const [collectionName, setColectionName] = useState();
    const [whiteList, setWhitelist] = useState([]);
    const [isWhitelistOnly, setIsWhitelistOnly] = useState();
    const [mintFee, setMintFee] = useState();
    const [isAptosShowModal, setIsAptosShowModal] = useState(false);

  useEffect(() => {
    if (currentStep === STEPS.OPENING) {
      const timer = setTimeout(() => {
        setCurrentStep(STEPS.NICK_NAME);
      }, OPENING_DURATION);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

    useEffect(() => {
        if (!wallet.autoConnect && wallet.wallet?.adapter) {
            wallet.connect();
        }
    }, [wallet.autoConnect, wallet.wallet, wallet.connect]);

    useEffect(() => {
        console.log("wallet", wallet);
        getCandyMachineResourceData();
    }, [wallet]);

  const handleCharacterSwitch = () => {
    console.log('Current index:', selectedCharacterGlbNameIndex);
    let newIndex = (selectedCharacterGlbNameIndex + 1) % 3;
    console.log('New index:', newIndex);
    setSelectedCharacterGlbNameIndex(newIndex);
  };

    async function getCandyMachineResourceData() {
        const response = await axios.get(
            `${NODE_URL}/accounts/${CONTRACT_ADDRESS}/resources`
        );
        const resources = response.data;

        for (const resource of resources) {
            if (resource.type === `${CONTRACT_ADDRESS}::minting::ModuleData`) {
                setExpireTime(resource.data.expiration_timestamp);
                setCurrentSupply(resource.data.current_supply);
                setMaxSupply(resource.data.maximum_supply);
                setColectionName(resource.data.collection_name);
                setWhitelist(resource.data.whitelist_addr);
                setIsWhitelistOnly(resource.data.whitelist_only);

                if (
                    wallet.account?.publicKey?.toString() ==
                    resource.data.public_key.bytes
                ) {
                    setCanMint(!canMint);
                    console.log("this is admin");
                }
                if (
                    resource.data.presale_status == false &&
                    resource.data.publicsale_status == false
                ) {
                    setMinting(false);
                    setCanMint(!canMint);
                }
                if (resource.data.presale_status && resource.data.publicsale_status) {
                    setMintFee(resource.data.public_price);
                } else if (resource.data.presale_status == true) {
                    setMintFee(resource.data.per_sale_price);
                } else {
                    setMintFee(resource.data.public_price);
                }
            }
        }
    }

    function nextPage() {
        socket.emit("initialize", {
            tempNickName,
            tempJobPosition,
            selectedCharacterGlbNameIndex,
            myRoom: { object: [] },
        });
        setIsModalOpen(true);
        setCharacterSelectFinished(true);
    }

  if (!socket) return null;

  return (
    <LoginContainer>
        {isAptosShowModal && (
            <ConnectWalletModal
                show={isAptosShowModal}
                onConnect={() => setIsAptosShowModal(false)}
                callback={() => nextPage()}
            />
        )}
      <StarryBackground />
      <Saturn />
      <Jupiter />
      <UFO />
      <ContentWrapper className={currentStep !== STEPS.OPENING ? 'fade-in' : ''}>
        {currentStep === STEPS.OPENING && (
          <OpeningTitleWrapper>
          <LogoBackground />
          <OpeningTitle>{t('opening.greeting')}</OpeningTitle>
        </OpeningTitleWrapper>
        )}
        {currentStep === STEPS.NICK_NAME && (
          <>
            <LoginTitle>{t('opening.whats_your_id')}</LoginTitle>
            <Input
              autoFocus
              placeholder={t('opening.whats_your_id')}
              value={tempNickName}
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
              onClick={() => setCurrentStep(STEPS.JOB_POSITION)}
            >
              {t('opening.button_go')}
            </NextBtn>
          </>
        )}
        {currentStep === STEPS.JOB_POSITION && (
          <>
            <LoginTitle>{t('opening.whats_your_nickname')}</LoginTitle>
            <Input
              autoFocus
              placeholder={t('opening.whats_your_nickname')}
              value={tempJobPosition}
              onChange={(e) => setTempJobPosition(e.target.value)}
              onKeyUp={(e) => {
                if (!isValidText(tempJobPosition)) return;
                if (e.key === "Enter") {
                  setCurrentStep(STEPS.CHARACTER);
                }
              }}
            />
            <NextBtn
              disabled={!isValidText(tempJobPosition)}
              className={isValidText(tempJobPosition) ? "valid" : "disabled"}
              onClick={() => setCurrentStep(STEPS.CHARACTER)}
            >
              {t('opening.button_go')}
            </NextBtn>
            <PrevBtn onClick={() => {
              setCurrentStep(STEPS.NICK_NAME);
              setTempNickname("");
            }}>
              {t('opening.button_back')}
            </PrevBtn>
          </>
        )}
        {currentStep === STEPS.CHARACTER && (
          <>
            <LoginTitle>{t('opening.choose_your_character')}</LoginTitle>
            <CharacterCanvasContainer>
              <CharacterTunningWrapper>
                <CharacterCanvasWrapper>
                  <MainCanvas />
                </CharacterCanvasWrapper>
              </CharacterTunningWrapper>
              <NextBtn
                className={!tempNickName || !tempJobPosition ? "disabled" : "valid"}
                onClick={() => {
                  if (!tempNickName || !tempJobPosition) return;
                  setIsAptosShowModal(true);
                }}
              >
                {t('opening.button_go')}
              </NextBtn>
              <PrevBtn onClick={handleCharacterSwitch}>
                {t('opening.button_another')}
              </PrevBtn>
              <PrevBtn onClick={() => setCurrentStep(STEPS.JOB_POSITION)}>
                {t('opening.button_back')}
              </PrevBtn>
            </CharacterCanvasContainer>
          </>
        )}
      </ContentWrapper>
    </LoginContainer>
  );
};

const twinkle = keyframes`
  0% { opacity: 0.5; }
  50% { opacity: 1; }
  100% { opacity: 0.5; }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const ufoMove = keyframes`
  0% { transform: translate(0, 0); }
  25% { transform: translate(50vw, -20vh); }
  50% { transform: translate(100vw, 0); }
  75% { transform: translate(50vw, 20vh); }
  100% { transform: translate(0, 0); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(to bottom, #000033, #000066);
`;

const StarryBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      radial-gradient(white, rgba(255,255,255,.2) 2px, transparent 40px),
      radial-gradient(white, rgba(255,255,255,.15) 1px, transparent 30px),
      radial-gradient(white, rgba(255,255,255,.1) 2px, transparent 40px);
    background-size: 550px 550px, 350px 350px, 250px 250px;
    background-position: 0 0, 40px 60px, 130px 270px;
    animation: ${twinkle} 4s infinite linear;
  }
`;

const Saturn = styled.div`
  position: absolute;
  width: 100px;
  height: 60px;
  border-radius: 50%;
  background-color: #ffcc00;
  box-shadow: 0 0 20px #ffcc00;
  overflow: hidden;
  z-index: 2;
  top: 20%;
  right: 10%;
  animation: ${float} 10s infinite ease-in-out;

  &::after {
    content: '';
    position: absolute;
    width: 120px;
    height: 20px;
    background-color: rgba(255, 204, 0, 0.3);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-20deg);
  }
`;

const Jupiter = styled.div`
  position: absolute;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #ff9900;
  box-shadow: 0 0 20px #ff9900;
  z-index: 2;
  bottom: 15%;
  left: 15%;
  animation: ${float} 15s infinite ease-in-out;
`;

const UFO = styled.div`
  position: absolute;
  width: 60px;
  height: 30px;
  background-color: #cccccc;
  border-radius: 50% 50% 0 0;
  z-index: 3;
  animation: ${ufoMove} 20s infinite linear;

  &::before {
    content: '';
    position: absolute;
    width: 30px;
    height: 15px;
    background-color: #666666;
    border-radius: 50%;
    top: -10px;
    left: 15px;
  }

  &::after {
    content: '';
    position: absolute;
    width: 10px;
    height: 10px;
    background-color: #00ff00;
    border-radius: 50%;
    bottom: 5px;
    left: 25px;
    box-shadow: 0 0 10px #00ff00;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 4;
  transition: opacity 0.5s ease-in-out;

  &.fade-in {
    animation: ${fadeIn} 0.5s ease-in-out;
  }
`;

const OpeningTitleWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const LogoBackground = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;  // 로고 크기에 맞게 조정
  height: 300px; // 로고 크기에 맞게 조정
  background-image: url(${logoImage});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  opacity: 0.6;  // 투명도 조정
`;

const OpeningTitle = styled.h1`
  font-size: 48px;
  color: white;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.7);
  z-index: 1;
  text-align: center;
  position: relative;
`;

const LoginTitle = styled.div`
  font-size: 22px;
  font-weight: 700;
  color: white;
  margin-bottom: 20px;
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
  width: 40%;
  height: 100%;
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
  background-color: rgba(255, 255, 255, 0.8);
  margin-bottom: 20px;
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
  color: #ffffff;
  background-color: rgba(102, 102, 102, 0.5);
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background-color: rgba(102, 102, 102, 0.7);
  }
`;