import { authAPI } from "@/features/auth/api/api-service";
import { tokenStorage } from "../auth/tokenStorage";

const API_BASE = import.meta.env.VITE_API_BASE;

type RequestOptions = RequestInit & {
  auth?: boolean; // 필요할 떄만 Authorization 추가(기본은 false이며, auth가 필요한 부분에선 auth:true로 받을것)
  _retry?: boolean; // 무한 재시도 방지
};

export async function request<T>(
  url: string,
  options: RequestOptions = {},
): Promise<T> {
  const { auth = false, _retry = false, headers, ...rest } = options;
  const accessToken = tokenStorage.getAccessToken();
  const hasBody = rest.body !== undefined && rest.body != null;

  const res = await fetch(`${API_BASE}${url}`, {
    headers: {
      ...(hasBody ? { "Content-type": "application/json" } : {}),
      ...(auth && accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : {}),
      ...(headers ?? {}),
    },
    ...rest,
  });
  let data = null;
  try {
    data = await res.json();
  } catch {
    // JSON할 body 없거나 파싱 실패 -> 그냥 data = null 유지
  }

  // accessToken 만료(401)이고, 아직 재시도 안했으면 refresh 후 1회 재시도
  if (res.status === 401 && auth && !_retry) {
    const refreshToken = tokenStorage.getRefreshToken();
    if (!refreshToken) {
      tokenStorage.clearTokens();
      throw new Error("세션이 만료되었습니다. 다시 로그인해 주세요.");
    }

    try {
      const refreshRes = await authAPI.refresh({ refreshToken });
      // refresh API응답이 accessToken만 준다고했으니, refreshToken은 기존 걸 유지
      tokenStorage.setTokens({
        accessToken: refreshRes.accessToken,
        refreshToken,
      });

      //새 accessToken으로 원 요청 재시도
      return request<T>(url, { ...options, _retry: true });
    } catch {
      tokenStorage.clearTokens();
      throw new Error("세션이 만료되었습니다. 다시 로그인해 주세요.");
    }
  }

  if (!res.ok) {
    throw new Error(data?.message ?? "요청에 실패했습니다.");
  }

  return data as T;
}
