import { useQuery } from "@tanstack/react-query";
import { tokenStorage } from "@/shared/auth/tokenStorage";
import { timerQueryOptions } from "./query-service";
import { HttpError } from "@/shared/api/request";

export default function useGetActiveTimer() {
  const hasToken = !!tokenStorage.getAccessToken();
  const base = timerQueryOptions.active();

  return useQuery({
    ...base,
    enabled: hasToken,
    retry: false,
    staleTime: 1000 * 10, // 10초 정도는 stale 아니게
    refetchOnWindowFocus: false, // 다른탭갔다 왔을때 리셋방지
    gcTime: 1000 * 60 * 5,
    queryFn: async () => {
      try {
        return await base.queryFn();
      } catch (e) {
        if (e instanceof HttpError && e.status === 404) return null; // 활성타이머 없음
        throw e; // 진짜 에러
      }
    },
  });
}
