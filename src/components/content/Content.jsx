import React, { useState, useEffect } from "react";
import { usePlayersStore } from "../../store/PlayersStore";
import { useModalStore } from "../../store/ModalStore"; 
import { MainCanvas } from "./canvas/MainCanvas";
import { CanvasLayout } from "./canvasLayout/Layout";
import { Lobby } from "./lobby/Lobby";
import { Button } from "@mui/material";
import { AssetModal } from "./modal/AssetModal";
import { ToastContainer } from "react-toastify";
import { useTranslation } from "react-i18next";
import NFTModal from "./modal/NFTModal"; // NFTModal 추가

export const Content = () => {
  const { characterSelectFinished, me, asset } = usePlayersStore(); 
  const { isModalOpen, setIsModalOpen } = useModalStore();
  const [isRewardPopupOpen, setIsRewardPopupOpen] = useState(false);
  const [isNFTModalOpen, setIsNFTModalOpen] = useState(false); // NFTModal 상태
  const [nftItems, setNftItems] = useState([]); // NFT 리스트 상태
  const {t} = useTranslation();
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const { i18n } = useTranslation();

  useEffect(() => {
    const handleResize = () => {
      const aspectRatio = 16 / 9; // 고정 가로 비율 16:9
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      let newWidth, newHeight;

      if (windowWidth / windowHeight > aspectRatio) {
        newWidth = windowHeight * aspectRatio;
        newHeight = windowHeight;
      } else {
        newWidth = windowWidth;
        newHeight = windowWidth / aspectRatio;
      }

      setDimensions({ width: newWidth, height: newHeight });
    };

    // 초기에 화면 크기 조정
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleOpenNFTModal = () => {
    // NFT 항목 예시로 설정 (실제로는 서버나 상태에서 가져올 수 있음)
    setNftItems(["NFT-house", "NFT-monster"]);
    setIsNFTModalOpen(true); // NFT Modal 열기
  };

  const handleInvestmentDecision = (investmentInfo) => {
    setIsModalOpen(false);
    setIsRewardPopupOpen(true);
  };

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  if (characterSelectFinished && me) {
    return (
      <CanvasLayout>
        <div
          className="game-container"
          style={{
            width: `${dimensions.width}px`,
            height: `${dimensions.height}px`,
            position: "relative",
          }}
        >
          {/* Three.js Canvas */}
          <MainCanvas />

          {/* UI Layer */}
          <div
            className="ui-layer"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: 10,
              pointerEvents: "none", // 이벤트 전달을 막지 않음 (Canvas로 전달됨)
            }}
          >
            {/* Right Top - Language Change Buttons */}
            <div
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                pointerEvents: "auto", // 클릭 가능
              }}
            >
              <Button variant="contained" onClick={() => changeLanguage("en")}>
                EN
              </Button>
              <Button variant="contained" onClick={() => changeLanguage("ko")}>
                한
              </Button>
            </div>

            {/* 보상보기 버튼 */}
            <div
              style={{
                position: "absolute",
                bottom: "10px",
                left: "10px",
                pointerEvents: "auto", // 클릭 가능한 영역
              }}
            >
              <Button
                variant="contained"
                color="secondary"
                onClick={handleOpenNFTModal} // 보상 보기 시 NFT Modal 열기
              >
                {t('ui.walletButton')}
              </Button>
            </div>

            <div
              style={{
                position: "absolute",
                bottom: "120px", 
                left: "10px",
                pointerEvents: "auto",
                transform: `scale(${dimensions.width / 1920})`, // 화면 크기에 맞게 스케일 조정
                transformOrigin: "bottom left",
              }}
            >
              <AssetModal />
            </div>

            {/* NFT Modal - 보상 보기 버튼 클릭 시 열림 */}
            <NFTModal
              isOpen={isNFTModalOpen}
              onClose={() => setIsNFTModalOpen(false)}
              nftItems={nftItems} // NFT 목록 전달
            />

            {/* Toast Notification */}
            <ToastContainer position="top-right" autoClose={3000} />
          </div>
        </div>
      </CanvasLayout>
    );
  }

  return <Lobby />;
};
