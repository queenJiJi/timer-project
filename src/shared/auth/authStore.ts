import { create } from "zustand";
import { tokenStorage } from "./tokenStorage";

type AuthState = {
  isAuthed: boolean;
  setAuthed: (v: boolean) => void;
};
export const useAuthStore = create<AuthState>((set) => ({
  isAuthed: !!tokenStorage.getAccessToken(),
  setAuthed: (v) => set({ isAuthed: v }),
}));
