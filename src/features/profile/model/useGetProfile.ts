import { useQuery } from "@tanstack/react-query";
import { profileQueryOptions } from "./query-service";
import { useAuthStore } from "@/shared/auth/authStore";

export default function useGetProfile() {
  const isAuthed = useAuthStore((s) => s.isAuthed);

  return useQuery({
    ...profileQueryOptions.me(),
    enabled: isAuthed, // 인증 상태 확인 후 호출
    staleTime: 1000 * 60 * 5, // 5분 캐싱
    retry: false,
  });
}
