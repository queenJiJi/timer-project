import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authAPI } from "../api/api-service";
import { tokenStorage } from "@/shared/auth/tokenStorage";
import { profileQueryKeys } from "@/features/profile/model/query-service";
import { useAuthStore } from "@/shared/auth/authStore";

export default function useLogoutMutation() {
  const queryClient = useQueryClient();
  const setLoggedIn = useAuthStore((s) => s.setLoggedIn);
  return useMutation({
    mutationFn: () => authAPI.logout(),
    onSettled: () => {
      tokenStorage.clearTokens(); // 성공/실패 상관없이 로컬 토큰은 지워주기
      setLoggedIn(false); // 상태 업데이트
      queryClient.removeQueries({
        queryKey: profileQueryKeys.all, // 사용자 관련 쿼리 캐시 제거
      });
    },
  });
}
