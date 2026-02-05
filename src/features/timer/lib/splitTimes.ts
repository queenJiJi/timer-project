import type { SplitTime } from "../api/types";

function startOfDayUTC(ms: number) {
  const d = new Date(ms);
  return Date.UTC(
    d.getUTCFullYear(),
    d.getUTCMonth(),
    d.getUTCDate(),
    0,
    0,
    0,
    0,
  );
}

export function addRangeToSplitTimes(params: {
  splitTimes: SplitTime[];
  startMs: number;
  endMs: number;
}): SplitTime[] {
  const { splitTimes, startMs, endMs } = params;
  if (endMs <= startMs) return splitTimes;

  const map = new Map<string, number>();
  for (const s of splitTimes)
    map.set(s.date, (map.get(s.date) ?? 0) + s.timeSpent);

  let cur = startMs;

  while (cur < endMs) {
    const dayStart = startOfDayUTC(cur);
    const nextDayStart = dayStart + 24 * 60 * 60 * 1000;
    const sliceEnd = Math.min(nextDayStart, endMs);
    const delta = sliceEnd - cur; // ms

    const key = new Date(dayStart).toISOString();
    map.set(key, (map.get(key) ?? 0) + delta);

    cur = sliceEnd;
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, timeSpent]) => ({ date, timeSpent }));
}
