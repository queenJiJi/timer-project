import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { StartTimerRequest } from "../api/types";
import { timerAPI } from "../api/api-service";
import { timerQueryKeys } from "./query-service";

export default function useStartTimerMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (body: StartTimerRequest) => timerAPI.startTimer(body),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: timerQueryKeys.active() });
    },
  });
}
