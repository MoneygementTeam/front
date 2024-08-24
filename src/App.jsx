import React, { useState, useEffect } from 'react';
import { RecoilRoot, useRecoilState } from "recoil";
import { IsModalOpenAtom } from "./store/ModalAtom";
import "./App.css";
import { ClientSocketControls } from "./components/utilComponents/ClientSocketControls";
import { Content } from "./components/content/Content";
import CustomModal from "./components/content/modal/Modal";
import RewardPopup from "./components/content/modal/RewardPopup";
import RankingModal from "./components/content/modal/RankingModal";
import rankingData from './assets/rankingData.json';

function AppContent() {
  const [isModalOpen, setIsModalOpen] = useRecoilState(IsModalOpenAtom);
  const [isRewardPopupOpen, setIsRewardPopupOpen] = useState(false);
  const [isRankingModalOpen, setIsRankingModalOpen] = useState(false);
  const [rewardInfo, setRewardInfo] = useState({ title: '', subTitle: '' });
  const [userRank, setUserRank] = useState(7); // 예시로 사용자 랭킹을 7로 설정

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'q') {
        handleOpenRewardPopup("숨겨진 캐릭터 발견!!", "q 캐릭터 획득!!");
      } else if (event.key === 'r') {
        setIsRankingModalOpen(true);
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

      <CustomModal
        title="경제 위기 모험!"
        page={1}
        investmentOptions={["원자재", "코인", "주식", "부동산"]}
        Money={1000000}
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
    <RecoilRoot>
      <AppContent />
    </RecoilRoot>
  );
}

export default App;