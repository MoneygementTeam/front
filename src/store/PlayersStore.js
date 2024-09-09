import { create } from 'zustand';

export const usePlayersStore = create((set, get) => ({

  players: [],
  setPlayers: (players) => set({ players }),

  errorToast: false,
  setErrorToast: (value) => set({ errorToast: value }),

  asset: 1000000,
  setAsset: (value) => set({ asset: value }),

  me: undefined,
  setMe: (me) => set({ me }),

  characterSelectFinished: false,
  setCharacterSelectFinished: (value) => set({ characterSelectFinished: value }),

  selectedCharacterGlbNameIndex: 0,
  setSelectedCharacterGlbNameIndex: (index) => set({ selectedCharacterGlbNameIndex: index }),

  playerCompletedQuests: [],
  setPlayerCompletedQuests: (quests) => set({ playerCompletedQuests: quests }),

  playerInventory: [],
  setPlayerInventory: (inventory) => set({ playerInventory: inventory }),

  playGroundStructuresBoundingBox: [],
  setPlayGroundStructuresBoundingBox: (boundingBoxes) => set({ playGroundStructuresBoundingBox: boundingBoxes }),

  playerGroundStructuresFloorPlaneCorners: [],
  setPlayerGroundStructuresFloorPlaneCorners: (corners) => set({ playerGroundStructuresFloorPlaneCorners: corners }),

  getPlayerGroundStructuresFloorPlaneCorners: () => {
    const pb = get().playGroundStructuresBoundingBox;
    return pb.map((item) => {
      return {
        name: item.name,
        corners: [
          { x: item.box.max.x + item.position.x, z: item.box.max.z + item.position.z },
          { x: item.box.max.x + item.position.x, z: item.box.min.z + item.position.z },
          { x: item.box.min.x + item.position.x, z: item.box.min.z + item.position.z },
          { x: item.box.min.x + item.position.x, z: item.box.max.z + item.position.z },
        ],
        position: item.position,
      };
    });
  },
}));
