import { create } from "zustand";
import type { GetTimerResponse } from "../api/types";
import { sumSplitTimes } from "../lib/calculateTimer";

export type TimerRunState = "idle" | "running" | "paused";

type TimerStore = {
  timerId: string | null;
  studyLogId: string | null;

  timerState: TimerRunState;

  baseMs: number; // splitTimes 합
  totalMs: number; // 화면에 뿌릴 ms
  lastUpdateTime: string | null; // 서버값
  lastTickAt: number | null; // 클라이언트 tick 기준

  hydrateFromServer: (data: GetTimerResponse) => void;
  setTimerState: (s: TimerRunState) => void;
  tick: (now: number) => void;
  reset: () => void;
};

export const useTimerStore = create<TimerStore>((set, get) => ({
  timerId: null,
  studyLogId: null,

  timerState: "idle",

  baseMs: 0,
  totalMs: 0,
  lastUpdateTime: null,
  lastTickAt: null,

  hydrateFromServer: (data) => {
    const baseMs = sumSplitTimes(data);
    set({
      timerId: data.timerId,
      studyLogId: data.studyLogId,
      baseMs,
      totalMs: baseMs,
      lastUpdateTime: data.lastUpdateTime ?? null,
      timerState: "paused",
      lastTickAt: null,
    });
  },

  setTimerState: (s) => {
    const now = Date.now();
    set({
      timerState: s,
      // running 시작/재개할 때 tick 기준점을 now로 잡아서 계산
      lastTickAt: s === "running" ? now : null,
    });
  },

  tick: (now) => {
    const { timerState, lastTickAt, totalMs } = get();

    if (timerState !== "running") return;
    if (lastTickAt == null) {
      // 첫 tick이라면 기준점만 잡고 종료
      set({ lastTickAt: now });
      return;
    }

    const delta = now - lastTickAt;
    if (delta <= 0) return;
    set({
      totalMs: totalMs + delta,
      lastTickAt: now,
    });
  },

  reset: () =>
    set({
      timerId: null,
      studyLogId: null,
      timerState: "idle",
      baseMs: 0,
      totalMs: 0,
      lastUpdateTime: null,
      lastTickAt: null,
    }),
}));
