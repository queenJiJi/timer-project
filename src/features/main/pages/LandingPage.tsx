import { useState } from "react";
import TimerView from "@/features/timer/components/TimerView";
import type { TimerState } from "@/features/timer/components/TimerControls";

export default function LandingPage() {
  const [timerState, setTimerState] = useState<TimerState>("idle");

  // TODO: 랜딩에서는 실제로는 클릭 시 "로그인 필요" 모달 뜨게 바꾸면 됨
  return (
    <TimerView
      hh="00"
      mm="00"
      ss="00"
      timerState={timerState}
      onPlay={() => setTimerState("running")}
      onPause={() => setTimerState("paused")}
      onStop={() => setTimerState("idle")}
      title={
        <h1 className="text-[72px] font-bold tracking-[0.08em] text-secondColor">
          WELCOME
        </h1>
      }
      subtitle={
        <p className="mt-[10px] text-[14px] text-secondColor">
          DevTime과 함께하는 건강한 집중 루틴!
        </p>
      }
    />
  );
}
