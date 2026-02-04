import type React from "react";
import TimeCard from "./TimeCard";
import TimerControls from "./TimerControls";
import doubledotIcon from "@/assets/doubledot-icon.png";
import type { TimerRunState } from "../model/timerStore";
import TimerActionButtons from "./TimerActionButtons";

type Props = {
  hh: string;
  mm: string;
  ss: string;
  timerState: TimerRunState;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  onOpenTodo: () => void;
  onReset: () => void;
};

export default function TimerView({
  hh,
  mm,
  ss,
  timerState,
  onPlay,
  onPause,
  onStop,
  title,
  subtitle,
  onOpenTodo,
  onReset,
}: Props) {
  return (
    <main className="mx-auto flex w-full max-w-[1200px] flex-col items-center px-10 pt-[96px]">
      {title}
      {subtitle}

      {/* Timer */}
      <div className="mt-20 flex items-start gap-10">
        <TimeCard label="HOURS" value={hh} />

        <img src={doubledotIcon} className="pt-[93px]" />

        <TimeCard label="MINUTES" value={mm} />
        <img src={doubledotIcon} className="pt-[93px]" />

        <TimeCard label="SECONDS" value={ss} />
      </div>

      <div className="flex items-center justify-center gap-[134px]">
        {/* Controls */}
        <TimerControls
          timerState={timerState}
          onPlay={onPlay}
          onPause={onPause}
          onStop={onStop}
        />

        {/* TimerActions - Todo,reset */}
        <TimerActionButtons
          timerState={timerState}
          onOpenTodo={onOpenTodo}
          onReset={onReset}
        />
      </div>
    </main>
  );
}
