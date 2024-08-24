import React, { useState, useEffect } from 'react';
import { RecoilRoot, useRecoilState } from "recoil";
import { IsModalOpenAtom } from "./store/ModalAtom"; // Recoil atom import 추가
import "./App.css";
import { ClientSocketControls } from "./components/utilComponents/ClientSocketControls";
import { Content } from "./components/content/Content";
import CustomModal from "./components/content/modal/Modal";
import RewardPopup from "./components/content/modal/RewardPopup";

function AppContent() {
  const [isModalOpen, setIsModalOpen] = useRecoilState(IsModalOpenAtom);
  const [isRewardPopupOpen, setIsRewardPopupOpen] = useState(false);
  const [rewardInfo, setRewardInfo] = useState({ title: '', subTitle: '' });

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

      {/* CustomModal을 열기 위한 버튼 */}
      <button onClick={() => setIsModalOpen(true)}>경제 위기 모험 시작</button>
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