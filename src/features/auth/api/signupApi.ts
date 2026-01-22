import type { DupCheckRespoonse, SignupRequest, SignupResponse } from "./types";

const API_BASE = "https://devtime.prokit.app";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: {
      "Content-type": "application/json",
      ...(options?.headers ?? {}),
    },
    ...options,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    //ignore
  }

  if (!res.ok) {
    throw new Error(data?.message ?? "요청에 실패했습니다.");
  }

  return data as T;
}

export const signupAPI = {
  // 이메일 중복확인
  checkEmail(email: string) {
    const params = new URLSearchParams({ email });
    return request<DupCheckRespoonse>(
      `/api/signup/check-email?${params.toString()}`,
      { method: "GET" }
    );
  },

  // 닉네임 중복확인
  checkNickname(nickname: string) {
    const params = new URLSearchParams({ nickname });
    return request<DupCheckRespoonse>(
      `/api/signup/check-nickname?${params.toString()}`,
      {
        method: "GET",
      }
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
