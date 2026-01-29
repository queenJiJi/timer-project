import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authAPI } from "../api/api-service";
import { tokenStorage } from "@/shared/auth/tokenStorage";
import { profileQueryKeys } from "@/features/profile/model/query-service";

export default function useLogoutMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => authAPI.logout(),
    onSettled: () => {
      tokenStorage.clearTokens(); // 성공/실패 상관없이 로컬 토큰은 지워주기
      queryClient.removeQueries({
        queryKey: profileQueryKeys.all, // 사용자관련 캐시 제거
      });
    },
  });
}
