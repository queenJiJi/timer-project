import { useEffect, useRef } from "react";
import { useShallow } from "zustand/shallow";
import { useTimerStore } from "./timerStore";
import usePauseTimerMutation from "./usePauseTimerMutation";

const TEN_MIN = 10 * 60 * 1000;

export default function useTimerPolling() {
  const updateMutation = usePauseTimerMutation();
  const { timerId, timerState, flushRunningSegment } = useTimerStore(
    useShallow((s) => ({
      timerId: s.timerId,
      timerState: s.timerState,
      splitTimes: s.splitTimes,
      flushRunningSegment: s.flushRunningSegment,
    })),
  );

  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    // running일 때만 폴링
    if (!timerId || timerState !== "running") {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = window.setInterval(async () => {
      // 지금까지 running 구간 누적
      flushRunningSegment();

      // 최신 splitTimes 전송
      await updateMutation.mutateAsync({
        timerId,
        body: { splitTimes: useTimerStore.getState().splitTimes },
      });
    }, TEN_MIN);

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [timerId, timerState, flushRunningSegment, updateMutation]);
}
