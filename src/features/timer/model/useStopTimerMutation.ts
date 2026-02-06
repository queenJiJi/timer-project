import { useMutation } from "@tanstack/react-query";
import { timerAPI } from "../api/api-service";
import type { StopTimerRequest } from "../api/types";

export default function useStopTimerMutation() {
  return useMutation({
    mutationFn: ({
      timerId,
      body,
    }: {
      timerId: string;
      body: StopTimerRequest;
    }) => timerAPI.stopTimer(timerId, body),
  });
}
