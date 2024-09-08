import { create } from 'zustand';

export const useModalStore = create((set) => ({
  isModalOpen: false,
  setIsModalOpen: (value) => set({ isModalOpen: value }),

  rewardPopup: { isOpen: false, title: '', subTitle: '' },
  setRewardPopup: (popup) => set({ rewardPopup: popup }),

  isAssetModalOpen: false,
  setIsAssetModalOpen: (value) => set({ isAssetModalOpen: value }),
}));
