import { request } from "@/shared/api/request";
import type {
  LoginResponse,
  LogoutResponse,
  RefreshResponse,
  DupCheckRespoonse,
  LoginRequest,
  RefreshRequest,
  SignupRequest,
  SignupResponse,
} from "./types";

export const signupAPI = {
  // 이메일 중복확인
  checkEmail(email: string) {
    const params = new URLSearchParams({ email });
    return request<DupCheckRespoonse>(
      `/api/signup/check-email?${params.toString()}`,
      { method: "GET" },
    );
  },

  // 닉네임 중복확인
  checkNickname(nickname: string) {
    const params = new URLSearchParams({ nickname });
    return request<DupCheckRespoonse>(
      `/api/signup/check-nickname?${params.toString()}`,
      {
        method: "GET",
      },
    );
  },

  // 회원 가입
  signup(body: SignupRequest) {
    return request<SignupResponse>(`/api/signup`, {
      method: "POST",
      body: JSON.stringify(body),
    });
  },
};

export const authAPI = {
  // 로그인
  login(body: LoginRequest) {
    return request<LoginResponse>(`/api/auth/login`, {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  // 로그아웃
  logout() {
    return request<LogoutResponse>(`/api/auth/logout`, { method: "POST" });
  },

  // 토큰 리프레시
  refresh(body: RefreshRequest) {
    return request<RefreshResponse>(`/api/auth/refresh`, {
      method: "POST",
      body: JSON.stringify(body),
    });
  },
};
