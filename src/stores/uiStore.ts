import { create } from "zustand";

interface XpPopNotification {
  id: string;
  amount: number;
  action: string;
}

interface UiState {
  // XP pop notifications
  xpPops: XpPopNotification[];
  addXpPop: (amount: number, action?: string) => void;
  removeXpPop: (id: string) => void;
  
  // Level up modal
  levelUpModal: { show: boolean; newLevel: number };
  showLevelUp: (level: number) => void;
  hideLevelUp: () => void;
  
  // Pack opening modal
  packModal: { show: boolean; packId: string | null };
  openPack: (packId: string) => void;
  closePackModal: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  xpPops: [],
  addXpPop: (amount, action = "") =>
    set((s) => ({
      xpPops: [...s.xpPops, { id: crypto.randomUUID(), amount, action }],
    })),
  removeXpPop: (id) =>
    set((s) => ({ xpPops: s.xpPops.filter((p) => p.id !== id) })),

  levelUpModal: { show: false, newLevel: 0 },
  showLevelUp: (newLevel) => set({ levelUpModal: { show: true, newLevel } }),
  hideLevelUp: () => set({ levelUpModal: { show: false, newLevel: 0 } }),

  packModal: { show: false, packId: null },
  openPack: (packId) => set({ packModal: { show: true, packId } }),
  closePackModal: () => set({ packModal: { show: false, packId: null } }),
}));
