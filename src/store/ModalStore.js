import { create } from 'zustand';

export const useModalStore = create((set) => ({
  asset:100000,
  isQuizModalOpen: false,
  setIsQuizModalOpen: (value) => set({ isQuizModalOpen: value }),

  rewardPopup: { isOpen: false, title: '', subTitle: '' },
  setRewardPopup: (popup) => set({ rewardPopup: popup }),

  isAssetModalOpen: true,
  setIsAssetModalOpen: (value) => set({ isAssetModalOpen: value }),
}));
