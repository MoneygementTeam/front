import { atom, selector } from "recoil";

// 모든 플레이어들
export const PlayersAtom = atom({
  key: "PlayersAtom",
  default: [],
});

// 내 socket 정보
export const MeAtom = atom({
  key: "MeAtom",
  default: undefined,
});

// 캐릭터 선택이 완료되었는지,
export const CharacterSelectFinishedAtom = atom({
  key: "CharacterSelectFinishedAtom",
  default: false,
});

// 현재 선택된 캐릭터 종류
export const SelectedCharacterGlbNameIndexAtom = atom({
  key: "SelectedCharacterGlbNameIndexAtom",
  default: 0,
});

// 현재 완료된 퀘스트 목록
export const PlayerCompletedQuestsAtom = atom({
  key: "PlayerQuestsAtom",
  default: [],
});

// 현재 플레이어의 인벤토리
export const PlayerInventoryAtom = atom({
  key: "PlayerInventoryAtom",
  default: [],
});

// 운동장에 배치된 오브젝트들의 경계선 정보
export const PlayGroundStructuresBoundingBoxAtom = atom({
  key: "PlayGroundStructuresBoundingBoxAtom",
  default: [],
});

// 운동장에 배치된 오브젝트들의 경계선 꼭짓점 정보
export const PlayerGroundStructuresFloorPlaneCornersSelector = selector({
  key: "PlayerGroundStructuresFloorPlaneCornersSelector",
  get: ({ get }) => {
    const pb = get(PlayGroundStructuresBoundingBoxAtom);
    return pb.map((item) => {
      return {
        name: item.name,
        corners: [
          {
            x: item.box.max.x + item.position.x,
            z: item.box.max.z + item.position.z,
          },
          {
            x: item.box.max.x + item.position.x,
            z: item.box.min.z + item.position.z,
          },
          {
            x: item.box.min.x + item.position.x,
            z: item.box.min.z + item.position.z,
          },
          {
            x: item.box.min.x + item.position.x,
            z: item.box.max.z + item.position.z,
          },
        ],
        position: item.position,
      };
    });
  },
});
