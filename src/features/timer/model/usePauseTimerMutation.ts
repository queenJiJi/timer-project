import { useMutation } from "@tanstack/react-query";
import type { PauseTimerRequest } from "../api/types";
import { timerAPI } from "../api/api-service";

export default function usePauseTimerMutation() {
  return useMutation({
    mutationFn: async (vars: { timerId: string; body: PauseTimerRequest }) => {
      return timerAPI.pauseTimer(vars.timerId, vars.body);
    },
  });
}
