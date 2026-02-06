import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { profileQueryKeys, profileQueryOptions } from "./query-service";
import { useAuthStore } from "@/shared/auth/authStore";
import { tokenStorage } from "@/shared/auth/tokenStorage";

export default function useGetProfile() {
  const queryClient = useQueryClient();

  const setLoggedIn = useAuthStore((s) => s.setLoggedIn);
  const hasToken = !!tokenStorage.getAccessToken();

  const query = useQuery({
    ...profileQueryOptions.me(),
    enabled: hasToken,
    staleTime: 1000 * 60 * 5, // 5분 캐싱
    retry: false,
  });

  useEffect(() => {
    // 프로필 조회 성공 => authed 유지
    if (query.status === "success") {
      setLoggedIn(true);
    }
    //401/실패 => 토큰 정리 + authed false
    if (query.status === "error") {
      tokenStorage.clearTokens();
      setLoggedIn(false);
      queryClient.removeQueries({
        queryKey: profileQueryKeys.all, // 사용자 관련 쿼리 캐시 제거
      });
    }
  }, [query.status, setLoggedIn, queryClient]);

  return query;
}
