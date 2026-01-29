import { tokenStorage } from "@/shared/auth/tokenStorage";
import { useQuery } from "@tanstack/react-query";
import { profileQueryOptions } from "./query-service";

export default function useGetProfile() {
  const hasToken = !!tokenStorage.getAccessToken();

  return useQuery({
    ...profileQueryOptions.me(),
    enabled: hasToken, // 토큰 유무 확인 후 호출
    staleTime: 1000 * 60 * 5, // 5분 캐싱
  });
}
