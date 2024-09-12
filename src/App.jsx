import React, { useState, useEffect, useTransition } from 'react';
import { useModalStore } from "./store/ModalStore"; // Zustand 상태 가져오기
import { usePlayersStore } from "./store/PlayersStore"; // Zustand 상태 가져오기
import "./App.css";
import { ClientSocketControls } from "./components/utilComponents/ClientSocketControls";
import { Content } from "./components/content/Content";
import CustomModal from "./components/content/modal/Modal";
import RewardPopup from "./components/content/modal/RewardPopup";
import RankingModal from "./components/content/modal/RankingModal";
import rankingData from './assets/rankingData.json';
import { toast, ToastContainer } from "react-toastify";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AssetModal } from "./components/content/modal/AssetModal.jsx";
import { useTranslation } from 'react-i18next';
import { initI18n } from './data/i18n.js';
import "./index.css";
import { PetraWallet } from "petra-plugin-wallet-adapter";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";

const queryClient = new QueryClient()
initI18n();

function AppContent() {
  const { isQuizModalOpen, setIsQuizModalOpen } = useModalStore();
  const { asset } = usePlayersStore();
  const [isRewardPopupOpen, setIsRewardPopupOpen] = useState(false);
  const [isRankingModalOpen, setIsRankingModalOpen] = useState(false);
  const [rewardInfo, setRewardInfo] = useState({ title: '', subTitle: '' });
  const [userRank, setUserRank] = useState(7); // 예시로 사용자 랭킹을 7로 설정
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const { t, i18n } = useTranslation();

  useEffect(() => {
    const handleResize = () => {
      const aspectRatio = 16 / 9; // 고정 가로 비율 16:9
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      let newWidth, newHeight;
      
      if (windowWidth / windowHeight > aspectRatio) {
        // 세로가 더 긴 경우, 가로에 맞춰 세로를 조정
        newWidth = windowHeight * aspectRatio;
        newHeight = windowHeight;
      } else {
        // 가로가 더 긴 경우, 세로에 맞춰 가로를 조정
        newWidth = windowWidth;
        newHeight = windowWidth / aspectRatio;
      }
      
      setDimensions({ width: newWidth, height: newHeight });
    };

    // 초기에 화면 크기 조정
    handleResize();
    // 창 크기 변화 감지
    window.addEventListener('resize', handleResize);


    const detectAndSetLanguage = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        const countryCode = data.country_code.toLowerCase();
        
        // 국가 코드에 따라 언어 설정
        if (countryCode === 'kr') {
          i18n.changeLanguage('ko');
        } else {
          i18n.changeLanguage('en');
        }
      } catch (error) {
        console.error('Error detecting country:', error);
        // 오류 발생 시 기본 언어 사용
        i18n.changeLanguage('en');
      }

      detectAndSetLanguage();
    };

    const handleKeyPress = (event) => {
      if (event.key === 'q') {
        handleOpenRewardPopup(t('reward.new_monster_reveal'), t('reward.got_item', { item: "Q "}));
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [i18n]);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const handleOpenRewardPopup = (title, subTitle) => {
    setRewardInfo({ title, subTitle });
    setIsRewardPopupOpen(true);
  };

  const handleCloseRewardPopup = () => {
    setIsRewardPopupOpen(false);
  };

  const handleInvestmentDecision = (investmentInfo) => {
    setIsQuizModalOpen(false);
    handleOpenRewardPopup("투자 성공!", `${investmentInfo.amount}원을 투자했습니다.`);
  };

  return (
    <>
    <div
      className="game-container"
      style={{
        width: `${dimensions.width}px`,
        height: `${dimensions.height}px`,
      }}
    >
      {/* <button onClick={() => changeLanguage('en')}>English</button>
      <button onClick={() => changeLanguage('ko')}>한국어</button> */}
      <Content />
      <ClientSocketControls />

      {/* <AssetModal /> */}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <CustomModal
        isOpen={isQuizModalOpen}
        title={t('quizModal.title')}
        page={1}
        investmentOptions={[t('quizModal.invest_option1'), t('quizModal.invest_option2'), t('quizModal.invest_option3'), t('quizModal.invest_option4')]}
        Money={asset}
        onInvestmentDecision={handleInvestmentDecision}
      />

      <RewardPopup
        isOpen={isRewardPopupOpen}
        onClose={handleCloseRewardPopup}
        title={rewardInfo.title}
        subTitle={rewardInfo.subTitle}
      />

      <RankingModal
        isOpen={isRankingModalOpen}
        onClose={() => setIsRankingModalOpen(false)}
        rankingData={rankingData}
        userRank={userRank}
      />

      {/* <button onClick={() => setIsQuizModalOpen(true)}>경제 위기 모험 시작</button>
      <button onClick={() => setIsRankingModalOpen(true)}>랭킹 보기</button> */}
      </div>
    </>
  );
}

function App() {
  const wallets = [new PetraWallet()];

  return (
    <QueryClientProvider client={queryClient}>
      <AptosWalletAdapterProvider
          plugins={wallets}
          autoConnect={false}
          onError={(error) => {
            console.log("AptosWalletAdapterProvider Error :: ", error);
          }}
      >
        <AppContent />
      </AptosWalletAdapterProvider>
    </QueryClientProvider>
  );
}

export default App;
