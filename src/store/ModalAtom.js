import { atom } from "recoil";

export const IsModalOpenAtom = atom({
  key: "IsModalOpenAtom",
  default: false,
});
export const RewardPopupAtom = atom({
  key: 'RewardPopupAtom',
  default: { isOpen: false, title: '', subTitle: '' },
});