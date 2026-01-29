import { useEffect, useState } from "react";
import TimerView from "@/features/timer/components/TimerView";
import type { TimerState } from "@/features/timer/components/TimerControls";
import { AlertModal } from "@/shared/ui/Modal";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();
  const [timerState, setTimerState] = useState<TimerState>("idle");
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [modal, setModal] = useState<{
    open: boolean;
  }>({ open: false });

  useEffect(() => {
    const handleClick = () => {
      if (!isClicked) {
        setIsClicked(true);
        setModal({ open: true });
      }
    };

    // 전체 document에 클릭 이벤트 리스너 추가
    document.addEventListener("click", handleClick);
    return () => {
      // 컴포넌트 언마운트 시 리스너 제거
      document.removeEventListener("click", handleClick);
    };
  }, [isClicked]);

  return (
    <>
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
      <AlertModal
        open={modal.open}
        title="로그인이 필요합니다."
        description="DevTime을 사용하려면 로그인이 필요합니다. 로그인 페이지로 이동할까요?"
        onConfirm={() => {
          setModal({ open: false });
          navigate("/auth/login", { replace: true });
        }}
        onCancel={() => {
          setModal({ open: false });
          location.reload();
        }}
        cancelButton={true}
        cancelText="취소"
        confirmText="로그인하기"
        buttonWidth="w-[110px]"
        buttonHeight="h-12"
        align="left"
        buttonSize="md"
      />
    </>
  );
}
