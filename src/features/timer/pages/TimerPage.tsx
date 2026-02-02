import { useEffect, useMemo, useState } from "react";
import TimerView from "../components/TimerView";
import useGetActiveTimer from "../model/useGetTimer";
import { useTimerStore } from "../model/timerStore";
import { msToHMS } from "../lib/calculateTimer";
import { useAuthStore } from "@/shared/auth/authStore";
import { AlertModal } from "@/shared/ui/Modal";
import { useNavigate } from "react-router-dom";
import { useShallow } from "zustand/shallow";
import useStartTimerMutation from "../model/useStartTimerMutation";

export default function TimerPage() {
  const navigate = useNavigate();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  const { data, isFetched } = useGetActiveTimer();

  const {
    timerState,
    totalMs,
    timerId,
    hydrateFromServer,
    startFromServer,
    reset,
    play,
    pause,
    stop,
  } = useTimerStore(
    useShallow((s) => ({
      timerState: s.timerState,
      totalMs: s.totalMs,
      timerId: s.timerId,
      hydrateFromServer: s.hydrateFromServer,
      startFromServer: s.startFromServer,
      reset: s.reset,
      play: s.play,
      pause: s.pause,
      stop: s.stop,
    })),
  );

  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const startTimerMutation = useStartTimerMutation();

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

  const onPlay = async () => {
    if (!isLoggedIn) {
      // 로그인 안했다면 로그인 유도 모달 띄우기
      setLoginModalOpen(true);
      return;
    }
    // 로그인 상태면
    if (timerState !== "idle") {
      // 이미 running/paused이면 그냥 play(재개)
      play(); // 타이머 시작
      return;
    }

    // Idle이면 모달-> POST-> 성공하면 startFromServer로 store세팅
    const body = { todayGoal: "공부", tasks: ["코테 3문항"] }; //TODO: 모달에서 실제 값 받아서 넣기
    const res = await startTimerMutation.mutateAsync(body);
    startFromServer(res); // 서버에서 timerId 받아서 store 세팅 -> running 시작
  };

  return (
    <>
      <TimerView
        hh={hh}
        mm={mm}
        ss={ss}
        timerState={timerState}
        onPlay={onPlay}
        onPause={pause}
        onStop={stop}
        title={
          <h1 className="text-[72px] font-bold tracking-[0.08em] text-mainColor/30">
            {isLoggedIn ? "오늘도 열심히 달려봐요!" : "WELCOME"}
          </h1>
        }
        subtitle={
          !isLoggedIn ? (
            <p className="mt-[10px] text-[14px] text-secondColor">
              DevTime과 함께하는 건강한 집중 루틴!
            </p>
          ) : null
        }
      />

      <AlertModal
        open={loginModalOpen}
        title="로그인이 필요합니다."
        description="DevTime을 사용하려면 로그인이 필요합니다. 로그인 페이지로 이동할까요?"
        cancelButton
        cancelText="취소"
        confirmText="로그인하기"
        align="left"
        buttonSize="md"
        onCancel={() => setLoginModalOpen(false)}
        onConfirm={() => {
          setLoginModalOpen(false);
          navigate("/auth/login");
        }}
      />
    </>
  );
}
