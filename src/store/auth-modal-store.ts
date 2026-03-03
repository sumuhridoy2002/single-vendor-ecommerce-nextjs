import { create } from "zustand";

interface AuthModalState {
  open: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  setOpen: (open: boolean) => void;
}

export const useAuthModalStore = create<AuthModalState>((set) => ({
  open: false,
  openAuthModal: () => set({ open: true }),
  closeAuthModal: () => set({ open: false }),
  setOpen: (open) => set({ open }),
}));
