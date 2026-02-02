import { useEffect, useMemo } from "react";
import TimerView from "../components/TimerView";
import useGetActiveTimer from "../model/useGetTimer";
import { useTimerStore } from "../model/timerStore";
import { msToHMS } from "../lib/calculateTimer";

export default function TimerPage() {
  const { data, isFetched } = useGetActiveTimer();

  const timerState = useTimerStore((s) => s.timerState);
  const setTimerState = useTimerStore((s) => s.setTimerState);

  const totalMs = useTimerStore((s) => s.totalMs);
  const timerId = useTimerStore((s) => s.timerId);

  const hydrateFromServer = useTimerStore((s) => s.hydrateFromServer);
  const reset = useTimerStore((s) => s.reset);

  useEffect(() => {
    if (!isFetched) return; // 아직 결과 확정전이라면 아무것도 하지 않음
    if (data) {
      hydrateFromServer(data); // GET 성공 시 => store에 반영 및 세팅
      return;
    }
    // 서버에 activetimer 없더라도(404/null) 이미 타이머가 클라이언트에서 돌고있거나(혹은 paused), timerId가 있으면 유지
    const hasLocalTimer = timerId !== null || timerState !== "idle";
    if (hasLocalTimer) return;
    reset(); // 진짜아무것도 없을 때 reset
  }, [data, isFetched, hydrateFromServer, reset, timerId, timerState]);

  const { hh, mm, ss } = useMemo(() => msToHMS(totalMs), [totalMs]);

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
