import type { DupCheckRespoonse, SignupRequest, SignupResponse } from "./types";

const API_BASE = "https://devtime.prokit.app";

// 이메일 중복확인
export async function checkEmail(email: string): Promise<DupCheckRespoonse> {
  const url = `${API_BASE}/api/signup/check-email?email=${encodeURIComponent(
    email
  )}`;

  const res = await fetch(url, { method: "GET" });
  const data: DupCheckRespoonse = await res.json();

  if (!res.ok) {
    throw new Error(data?.message ?? "이메일 중복확인 실패");
  }
  return data;
}

// 닉네임 중복확인
export async function checkNickname(
  nickname: string
): Promise<DupCheckRespoonse> {
  const url = `${API_BASE}/api/signup/check-nickname?nickname=${encodeURIComponent(
    nickname
  )}`;

  const res = await fetch(url, { method: "GET" });
  const data: DupCheckRespoonse = await res.json();

  if (!res.ok) {
    throw new Error(data?.message ?? "닉네임 중복확인 실패");
  }

  return data;
}

// 회원 가입
export async function signup(body: SignupRequest): Promise<SignupResponse> {
  const url = `${API_BASE}/api/signup`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const data: SignupResponse = await res.json();

  if (!res.ok) {
    throw new Error(data?.message ?? "회원가입 실패");
  }
  return data;
}
