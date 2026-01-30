import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { profileQueryOptions } from "./query-service";
import { useAuthStore } from "@/shared/auth/authStore";
import { tokenStorage } from "@/shared/auth/tokenStorage";

export default function useGetProfile() {
  const isAuthed = useAuthStore((s) => s.isAuthed);
  const setAuthed = useAuthStore((s) => s.setAuthed);

  const query = useQuery({
    ...profileQueryOptions.me(),
    enabled: isAuthed,
    staleTime: 1000 * 60 * 5, // 5분 캐싱
    retry: false,
  });

  useEffect(() => {
    // 프로필 조회 성공 => authed 유지
    if (query.status === "success") {
      setAuthed(true);
    }
    //401/실패 => 토큰 정리 + authed false
    if (query.status === "error") {
      tokenStorage.clearTokens();
      setAuthed(false);
    }
  }, [query.status, setAuthed]);

  return query;
}
