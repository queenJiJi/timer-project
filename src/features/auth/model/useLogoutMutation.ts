import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authAPI } from "../api/api-service";
import { tokenStorage } from "@/shared/auth/tokenStorage";
import { profileQueryKeys } from "@/features/profile/model/query-service";
import { useAuthStore } from "@/shared/auth/authStore";
import { useTimerStore } from "@/features/timer/model/timerStore";
import { timerQueryKeys } from "@/features/timer/model/query-service";

export default function useLogoutMutation() {
  const queryClient = useQueryClient();
  const setLoggedIn = useAuthStore((s) => s.setLoggedIn);
  const resetTimer = useTimerStore((s) => s.reset);
  return useMutation({
    mutationFn: () => authAPI.logout(),
    onSettled: () => {
      tokenStorage.clearTokens(); // 성공/실패 상관없이 로컬 토큰은 지워주기
      setLoggedIn(false); // 상태 업데이트
      resetTimer(); // 타이머 스토어 초기화
      queryClient.removeQueries({
        queryKey: profileQueryKeys.all, // 사용자 관련 쿼리 캐시 제거
      });
      queryClient.removeQueries({
        queryKey: timerQueryKeys.all, // 타이머 관련 쿼리 캐시 제거
      });
    },
  });
}
