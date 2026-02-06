import { create } from "zustand";
import type {
  GetTimerResponse,
  SplitTime,
  StartTimerResponse,
} from "../api/types";
import { calExtraMs, sumSplitTimes } from "../lib/calculateTimer";
import type { Task } from "../modals/TodoModal";
import { addRangeToSplitTimes } from "../lib/splitTimes";

export type TimerRunState = "idle" | "running" | "paused";

type TimerStore = {
  timerId: string | null;
  studyLogId: string | null;

  timerState: TimerRunState;

  baseMs: number; // splitTimes 합
  totalMs: number; // 화면에 뿌릴 ms
  lastUpdateTime: string | null; // 서버값
  lastTickAt: number | null; // 클라이언트 tick 기준

  startTime: string | null;
  splitTimes: SplitTime[];
  segmentStartAtMs: number | null;

  flushRunningSegment: () => void; // running 구간을 splitTimes에 누적
  setSplitTimes: (v: SplitTime[]) => void;

  tasks: Task[];

  hydrateFromServer: (data: GetTimerResponse) => void;
  startFromServer: (data: StartTimerResponse) => void;

  setTasks: (tasks: Task[]) => void; // StartPanel submit때 작성된 tasks저장

  play: () => void;
  pause: () => void;
  stop: () => void;

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

  startTime: null,
  splitTimes: [],
  segmentStartAtMs: null,
  setSplitTimes: (v) => set({ splitTimes: v }),

  flushRunningSegment: () => {
    const { timerState, segmentStartAtMs, splitTimes } = get();
    if (timerState !== "running") return;
    if (segmentStartAtMs == null) return;

    const now = Date.now();
    const next = addRangeToSplitTimes({
      splitTimes,
      startMs: segmentStartAtMs,
      endMs: now,
    });

    set({
      splitTimes: next,
      segmentStartAtMs: now, // flush 후 기준점을 now로 갱신
    });
  },

  tasks: [],

  hydrateFromServer: (data) => {
    // 이미 존재하는 타이머 상태 복원
    const baseMs = sumSplitTimes(data);
    const serverTotal = baseMs + calExtraMs(data);

    const current = get(); // 현재 store값
    const mergedTotal =
      current.timerId === data.timerId
        ? Math.max(current.totalMs, serverTotal)
        : serverTotal;

    const now = Date.now();
    const isPaused = current.timerState === "paused";
    const startMs = data.startTime ? Date.parse(data.startTime) : now;
    const serverLast = data.lastUpdateTime
      ? Date.parse(data.lastUpdateTime)
      : now;

    set({
      timerId: data.timerId,
      studyLogId: data.studyLogId,
      baseMs,
      totalMs: mergedTotal,
      startTime: data.startTime ?? null,
      lastUpdateTime: data.lastUpdateTime ?? null,
      splitTimes: data.splitTimes ?? [],
      timerState: isPaused ? "paused" : "running",
      lastTickAt: isPaused ? null : now,
      segmentStartAtMs: isPaused ? null : Math.max(serverLast, startMs),
    });
  },

  startFromServer: (data) => {
    // 새로운 타이머 시작 = 서버에서 시작생성 성공 시 세팅
    const now = Date.now();
    set({
      timerId: data.timerId,
      studyLogId: data.studyLogId,
      baseMs: 0,
      totalMs: 0,
      startTime: data.startTime,
      lastUpdateTime: data.startTime,
      timerState: "running",
      lastTickAt: now,

      splitTimes: [],
      segmentStartAtMs: now,
    });
  },

  setTasks: (tasks) => set({ tasks }),

  play: () => {
    const now = Date.now();
    set({
      timerState: "running",
      lastTickAt: now,
      segmentStartAtMs: now, // resume 시점부터 새 구간 시작
    });
  },

  pause: () => {
    get().flushRunningSegment(); // pause 직전까지 누적
    set({
      timerState: "paused",
      lastTickAt: null,
      segmentStartAtMs: null, // pause동안 구간 없음
    });
  },
  stop: () => {
    set({
      timerState: "idle",
      lastTickAt: null,
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
      startTime: null,
      lastUpdateTime: null,
      lastTickAt: null,
      tasks: [],

      splitTimes: [],
      segmentStartAtMs: null,
    }),
}));
