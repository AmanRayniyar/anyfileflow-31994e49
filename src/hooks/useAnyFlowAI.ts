import { create } from 'zustand';

interface AnyFlowAIStore {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export const useAnyFlowAI = create<AnyFlowAIStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));
