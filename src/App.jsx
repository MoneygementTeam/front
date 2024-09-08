import React, { useState, useEffect } from 'react';
import { useModalStore } from "./store/ModalAtom"; // Zustand 상태 가져오기
import { usePlayersStore } from "./store/PlayersAtom"; // Zustand 상태 가져오기
import "./App.css";
import { ClientSocketControls } from "./components/utilComponents/ClientSocketControls";
import { Content } from "./components/content/Content";
import CustomModal from "./components/content/modal/Modal";
import RewardPopup from "./components/content/modal/RewardPopup";
import RankingModal from "./components/content/modal/RankingModal";
import rankingData from './assets/rankingData.json';
import { toast, ToastContainer } from "react-toastify";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import { API_SERVER } from "./client/RequestQueryClient.js";
import { AssetModal } from "./components/content/modal/AssetModal.jsx";

const queryClient = new QueryClient()

function AppContent() {
  const { isModalOpen, setIsModalOpen } = useModalStore();
  const { asset } = usePlayersStore(); // Zustand에서 상태 사용
  const [isRewardPopupOpen, setIsRewardPopupOpen] = useState(false);
  const [isRankingModalOpen, setIsRankingModalOpen] = useState(false);
  const [rewardInfo, setRewardInfo] = useState({ title: '', subTitle: '' });
  const [userRank, setUserRank] = useState(7); // 예시로 사용자 랭킹을 7로 설정

  useEffect(() => {

    const handleKeyPress = (event) => {
      if (event.key === 'q') {
        handleOpenRewardPopup("숨겨진 캐릭터 발견!!", "q 캐릭터 획득!!");
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  const handleOpenRewardPopup = (title, subTitle) => {
    setRewardInfo({ title, subTitle });
    setIsRewardPopupOpen(true);
  };

  const handleCloseRewardPopup = () => {
    setIsRewardPopupOpen(false);
  };

  const handleInvestmentDecision = (investmentInfo) => {
    setIsModalOpen(false);
    handleOpenRewardPopup("투자 성공!", `${investmentInfo.amount}원을 투자했습니다.`);
  };

  return (
    <>
      <Content />
      <ClientSocketControls />

      <AssetModal />

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
        title="경제 위기 모험!"
        page={1}
        investmentOptions={["원자재", "코인", "주식", "부동산"]}
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

      <button onClick={() => setIsModalOpen(true)}>경제 위기 모험 시작</button>
      <button onClick={() => setIsRankingModalOpen(true)}>랭킹 보기</button>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;
