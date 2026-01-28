import { useMutation } from "@tanstack/react-query";
import { authAPI } from "../api/api-service";
import { tokenStorage } from "@/shared/auth/tokenStorage";

export default function UseLogoutMutation() {
  return useMutation({
    mutationFn: () => authAPI.logout(),
    onSettled: () => {
      tokenStorage.clearTokens(); // 성공/실패 상관없이 로컬 토큰은 지워주기
    },
  });
}
