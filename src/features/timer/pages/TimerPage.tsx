import { useMemo, useState } from "react";
import TimerView from "../components/TimerView";
import type { TimerState } from "../components/TimerControls";

export default function TimerPage() {
  // TODO: 나중에 zustand/store + 실제 타이머 로직으로 교체
  const [timerState, setTimerState] = useState<TimerState>("idle");

  const { hh, mm, ss } = useMemo(() => {
    // TODO: 실제 타이머 값 연결
    return { hh: "00", mm: "00", ss: "00" };
  }, []);

  return (
    <TimerView
      hh={hh}
      mm={mm}
      ss={ss}
      timerState={timerState}
      onPlay={() => setTimerState("running")}
      onPause={() => setTimerState("paused")}
      onStop={() => setTimerState("idle")}
      title={
        <h1 className="text-[72px] font-bold tracking-[0.08em] text-mainColor/30">
          오늘도 열심히 달려봐요!
        </h1>
      }
    />
  );
}
