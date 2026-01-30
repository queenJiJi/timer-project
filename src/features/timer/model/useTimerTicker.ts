import { useEffect } from "react";
import { useTimerStore } from "./timerStore";

export default function useTimerTicker() {
  const timerState = useTimerStore((s) => s.timerState);
  const tick = useTimerStore((s) => s.tick);

  useEffect(() => {
    if (timerState !== "running") return;

    const id = window.setInterval(() => {
      tick(Date.now());
    }, 1000);

    return () => window.clearInterval(id);
  }, [timerState, tick]);
}
