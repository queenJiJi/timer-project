import { useEffect, useMemo, useState } from "react";
import TimerView from "../components/TimerView";
import useGetActiveTimer from "../model/useGetTimer";
import { useTimerStore } from "../model/timerStore";
import { msToHMS } from "../lib/calculateTimer";
import { useAuthStore } from "@/shared/auth/authStore";
import { AlertModal } from "@/shared/ui/Modal";
import { useNavigate } from "react-router-dom";

export default function TimerPage() {
  const navigate = useNavigate();
  const isLoggedin = useAuthStore((s) => s.isAuthed);

  const { data, isFetched } = useGetActiveTimer();

  const timerState = useTimerStore((s) => s.timerState);
  const setTimerState = useTimerStore((s) => s.setTimerState);
  const totalMs = useTimerStore((s) => s.totalMs);
  const timerId = useTimerStore((s) => s.timerId);

  const hydrateFromServer = useTimerStore((s) => s.hydrateFromServer);
  const reset = useTimerStore((s) => s.reset);

  const [loginModalOpen, setLoginModalOpen] = useState(false);

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

  const onPlay = () => {
    if (!isLoggedin) {
      setLoginModalOpen(true);
      return;
    }

    setTimerState("running"); // 로그인 상태면 타이머 시작가능
  };
  return (
    <>
      <TimerView
        hh={hh}
        mm={mm}
        ss={ss}
        timerState={timerState}
        onPlay={onPlay}
        onPause={() => setTimerState("paused")}
        onStop={() => setTimerState("idle")}
        title={
          <h1 className="text-[72px] font-bold tracking-[0.08em] text-mainColor/30">
            {isLoggedin ? "오늘도 열심히 달려봐요!" : "WELCOME"}
          </h1>
        }
        subtitle={
          !isLoggedin ? (
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
