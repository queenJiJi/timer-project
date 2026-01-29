import { create } from "zustand";

type AuthState = {
  isAuthed: boolean;
  setAuthed: (v: boolean) => void;
};
export const useAuthStore = create<AuthState>((set) => ({
  isAuthed: false,
  setAuthed: (v) => set({ isAuthed: v }),
}));
