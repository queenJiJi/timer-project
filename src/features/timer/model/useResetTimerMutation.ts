import { useMutation, useQueryClient } from "@tanstack/react-query";
import { timerAPI } from "../api/api-service";
import { timerQueryKeys } from "./query-service";

export default function useResetTimerMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (timerId: string) => {
      return await timerAPI.deleteTimer(timerId);
    },
    onSuccess: async () => {
      // 서버가 지운 뒤, active timer 캐시를 즉시 null로 (hydrate 부활 방지)
      qc.setQueryData(timerQueryKeys.active(), null);
      // 혹시 모를 재동기화
      await qc.invalidateQueries({ queryKey: timerQueryKeys.active() });
    },
  });
}
