import type { GetTimerResponse } from "../api/types";

export function pad2(n: number) {
  return String(n).padStart(2, "0");
}

export function msToHMS(totalMs: number) {
  // 총 타이머 시간 계산
  const totalSec = Math.floor(totalMs / 1000);
  const hh = Math.floor(totalSec / 3600);
  const mm = Math.floor((totalSec % 3600) / 60);
  const ss = totalSec % 60;

  return { hh: pad2(hh), mm: pad2(mm), ss: pad2(ss) };
}

export function sumSplitTimes(data: GetTimerResponse) {
  return (data.splitTimes ?? []).reduce(
    (acc, cur) => acc + (cur.timeSpent ?? 0),
    0,
  );
}

export function calExtraMs(data: GetTimerResponse) {
  const last = data.lastUpdateTime ? Date.parse(data.lastUpdateTime) : NaN;
  const extraMs = Number.isFinite(last) ? Math.max(0, Date.now() - last) : 0;

  return extraMs;
}
