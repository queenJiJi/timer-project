import { tokenStorage } from "../auth/tokenStorage";

const API_BASE = "https://devtime.prokit.app";

type RequestOptions = RequestInit & {
  auth?: boolean; // 필요할 떄만 Authorization 추가
};

export async function request<T>(
  url: string,
  options?: RequestOptions,
): Promise<T> {
  const headers = new Headers(options?.headers);
  if (!headers.has("Content-type")) {
    headers.set("Content-type", "application/json");
  }

  if (options?.auth) {
    const accessToken = tokenStorage.getAccess(); // auth 옵션이면 accesstoken을 붙이기
    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
  }
  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers,
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
