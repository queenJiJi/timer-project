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
import {
  TodoModal,
  type StartBody,
  type TodoModalMode,
} from "../modals/TodoModal";
import useResetTimerMutation from "../model/useResetTimerMutation";
import { useQueryClient } from "@tanstack/react-query";
import { timerQueryKeys } from "../model/query-service";
import useTimerPolling from "../model/useTimerPolling";
import usePauseTimerMutation from "../model/usePauseTimerMutation";

export default function TimerPage() {
  useTimerPolling();
  const navigate = useNavigate();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const [todoModalOpen, setTodoModalOpen] = useState(false);
  const [todoModalMode, setTodoModalMode] = useState<TodoModalMode>("start");

  const { data, isFetched } = useGetActiveTimer();

  const {
    timerState,
    totalMs,
    timerId,
    hydrateFromServer,
    startFromServer,
    setTasks,
    reset,
    play,
    pause,
    // stop,
  } = useTimerStore(
    useShallow((s) => ({
      timerState: s.timerState,
      totalMs: s.totalMs,
      timerId: s.timerId,
      hydrateFromServer: s.hydrateFromServer,
      startFromServer: s.startFromServer,
      setTasks: s.setTasks,
      reset: s.reset,
      play: s.play,
      pause: s.pause,
      // stop: s.stop,
    })),
  );
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);

  const startTimerMutation = useStartTimerMutation();
  const updateTimerMutation = usePauseTimerMutation();
  const resetTimerMutation = useResetTimerMutation();
  const qc = useQueryClient();

  const openStartModal = () => {
    setTodoModalMode("start");
    setTodoModalOpen(true);
  };

  const openManageModal = () => {
    setTodoModalMode("manage");
    setTodoModalOpen(true);
  };

  const openStopModal = () => {
    setTodoModalMode("stop");
    setTodoModalOpen(true);
  };

  const onReset = () => setResetModalOpen(true);

  useEffect(() => {
    if (!isFetched) return; // 아직 결과 확정전이라면 아무것도 하지 않음
    if (data) {
      if (timerState === "idle") hydrateFromServer(data); // GET 성공 시 => store에 반영 및 세팅(단 첫 클릭 시)
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
    // Idle이면 ToDo 모달 오픈-> POST-> 성공하면 startFromServer로 store세팅
    openStartModal();
  };

  const onPause = async () => {
    pause(); // 내부에서 flushRunningSegment 수행

    if (!timerId) return;
    await updateTimerMutation.mutateAsync({
      timerId,
      body: { splitTimes: useTimerStore.getState().splitTimes },
    });
  };

  const onStop = () => {
    openStopModal();
  };

  const onTodoSubmit = async (body: StartBody) => {
    // 먼저 로컬 tasks store에 저장
    setTasks(
      body.tasks.map((content) => ({
        id: crypto.randomUUID(),
        content,
        isCompleted: false,
      })),
    );

    const res = await startTimerMutation.mutateAsync(body);
    startFromServer(res);
    setTodoModalOpen(false); // 서버에서 timerId 받아서 store 세팅 -> running 시작
  };

  return (
    <>
      <TimerView
        hh={hh}
        mm={mm}
        ss={ss}
        timerState={timerState}
        onPlay={onPlay}
        onPause={onPause}
        onStop={onStop}
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
        onOpenTodo={openManageModal} // manage모드 todomodal로 열림
        onReset={onReset}
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

      <TodoModal
        open={todoModalOpen}
        mode={todoModalMode}
        onClose={() => setTodoModalOpen(false)}
        onSubmitStart={onTodoSubmit}
      />

      <AlertModal
        open={resetModalOpen}
        title="기록을 초기화 하시겠습니까?"
        description="진행되던 타이머 기록은 삭제되고, 복구가 불가능합니다. 계속 초기화 할까요?"
        cancelButton
        cancelText="취소"
        confirmText="초기화하기"
        align="left"
        buttonSize="md"
        onCancel={() => setResetModalOpen(false)}
        onConfirm={async () => {
          setResetModalOpen(false);

          if (!timerId) {
            //timerId 없으면 서버에 지울 게 없으니 로컬만 초기화
            qc.setQueryData(timerQueryKeys.active(), null);
            reset();
            return;
          }

          try {
            await resetTimerMutation.mutateAsync(timerId); // 서버 타이머 삭제
            qc.setQueryData(timerQueryKeys.active(), null); //캐시 삭제
            reset(); // 로컬(store) 초기화
          } catch (e) {
            console.error(e);
          }
          reset();
        }}
      />
    </>
  );
}
