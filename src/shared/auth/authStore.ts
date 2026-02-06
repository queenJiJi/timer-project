import { create } from "zustand";
import { tokenStorage } from "./tokenStorage";

type AuthState = {
  isLoggedIn: boolean;
  setLoggedIn: (v: boolean) => void;
};
export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: !!tokenStorage.getAccessToken(),
  setLoggedIn: (v) => set({ isLoggedIn: v }),
}));
