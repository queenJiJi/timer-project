import type { SplitTime } from "../api/types";

type Bucket = { timeSpent: number; repMs: number }; // repMs = 그 날짜를 대표하는 "범위 안" 시각

const DAY = 24 * 60 * 60 * 1000;

function dayKeyLocal(ms: number) {
  const d = new Date(ms);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`; // KST 로컬 기준 날짜 키
}

function startOfDayLocal(ms: number) {
  const d = new Date(ms);
  return new Date(
    d.getFullYear(),
    d.getMonth(),
    d.getDate(),
    0,
    0,
    0,
    0,
  ).getTime();
}

export function normalizeSplitTimesForRequest(params: {
  splitTimes: SplitTime[];
  rangeStartMs: number; // timer startTime(ms)
  rangeEndMs: number; // stop or now(ms)
}) {
  const { splitTimes, rangeStartMs, rangeEndMs } = params;

  return splitTimes
    .filter((s) => (s.timeSpent ?? 0) > 0)
    .map((s) => {
      const ms = new Date(s.date).getTime();

      // 이 splitTime의 "로컬 날짜" 범위
      const dayStart = startOfDayLocal(ms);
      const dayEnd = dayStart + DAY;

      // 날짜 범위 ∩ 타이머 start~end 범위
      const lo = Math.max(dayStart, rangeStartMs);
      const hi = Math.min(dayEnd - 1, rangeEndMs);

      // date를 반드시 lo~hi 안으로
      const repMs = Math.min(Math.max(ms, lo), hi);

      return { ...s, date: new Date(repMs).toISOString() };
    });
}

export function addRangeToSplitTimes(params: {
  splitTimes: SplitTime[];
  startMs: number;
  endMs: number;
}): SplitTime[] {
  const { splitTimes, startMs, endMs } = params;
  if (endMs <= startMs) return splitTimes;

  // dayKey -> { timeSpent, repMs }
  const map = new Map<string, Bucket>();

  // 기존 splitTimes도 dayKey로 합치되, repMs는 "기존 date"를 그대로 사용
  for (const s of splitTimes) {
    const ms = new Date(s.date).getTime();
    const key = dayKeyLocal(ms);
    const prev = map.get(key);
    if (!prev) map.set(key, { timeSpent: s.timeSpent, repMs: ms });
    else
      map.set(key, {
        timeSpent: prev.timeSpent + s.timeSpent,
        repMs: prev.repMs,
      });
  }

  let cur = startMs;

  while (cur < endMs) {
    const dayStart = startOfDayLocal(cur);
    const nextDayStart = dayStart + 24 * 60 * 60 * 1000;

    const sliceEnd = Math.min(nextDayStart, endMs);
    const delta = sliceEnd - cur;

    const key = dayKeyLocal(cur);
    const prev = map.get(key);

    // repMs는 반드시 "실제 구간 안"의 값이어야 하므로 cur을 repMs로 사용(처음만)
    if (!prev) map.set(key, { timeSpent: delta, repMs: cur });
    else map.set(key, { timeSpent: prev.timeSpent + delta, repMs: prev.repMs });

    cur = sliceEnd;
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, v]) => ({
      date: new Date(v.repMs).toISOString(), // 항상 start~end 범위 안의 timestamp
      timeSpent: v.timeSpent,
    }));
}
