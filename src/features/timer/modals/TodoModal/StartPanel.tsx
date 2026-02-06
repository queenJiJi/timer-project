import { useMemo, useState } from "react";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/shared/ui";
import { clamp } from "@/lib/utils";
import { MAX_TASK_LEN } from "./types";
import useStartTimerMutation from "../../model/useStartTimerMutation";
import { useTimerStore } from "../../model/timerStore";
import { useShallow } from "zustand/shallow";
import { useTaskDraft } from "../../model/useTaskDraft";
import TaskEditor from "./TaskEditor";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function StartPanel({ open, onClose }: Props) {
  const startTimerMutation = useStartTimerMutation();

  const { setTasks, startFromServer, play } = useTimerStore(
    useShallow((s) => ({
      setTasks: s.setTasks,
      startFromServer: s.startFromServer,
      play: s.play,
    })),
  );

  const [todayGoal, setTodayGoal] = useState<string>("");
  const [isComposing, setIsComposing] = useState(false);
  const emptyTasks = useMemo(() => [], []);
  const d = useTaskDraft({ open, initialTasks: emptyTasks });

  // 취소 버튼
  const handleCancel = () => {
    setTodayGoal("");
    d.setTaskInput("");
    d.setDraftTasks([]);
    d.resetEditing();
    onClose();
  };

  // 제출 가능 상태 확인
  const canSubmit = useMemo(() => {
    const goalOk = todayGoal.trim().length > 0;
    const hasTask = d.draftTasks.length >= 1;
    const noEmpty = d.draftTasks.every((t) => t.content.trim().length > 0);
    return goalOk && hasTask && noEmpty && !startTimerMutation.isPending;
  }, [todayGoal, d.draftTasks, startTimerMutation.isPending]);

  // 시작하기(=모달 제출) 버튼
  const handleStart = async () => {
    if (!canSubmit) return;

    // 1) 로컬 store 저장
    const tasks = d.draftTasks.map((t) => ({
      id: crypto.randomUUID(),
      content: t.content.trim(),
      isCompleted: false,
    }));
    setTasks(tasks);

    // 2) 서버 타이머 시작
    const res = await startTimerMutation.mutateAsync({
      todayGoal: todayGoal.trim(),
      tasks: tasks.map((t) => t.content),
    });

    // 3) store 타이머 세팅 + running
    startFromServer(res);
    play();

    // 4) 모달 닫기
    onClose();
  };

  const footerButtonUI = (
    <div className="mt-9 flex justify-end gap-4">
      <Button
        size="md"
        className="bg-[#F9FAFB] text-mainColor h-12 text-[18px] font-semibold"
        onClick={handleCancel}
        disabled={startTimerMutation.isPending}
      >
        취소
      </Button>

      <Button
        size="md"
        className={`h-12 px-6 font-semibold text-[18px]
            ${canSubmit ? "bg-mainColor/10 text-mainColor" : "bg-[#E5E7EB] text-[#969DA8]"}`}
        onClick={handleStart}
        disabled={!canSubmit}
      >
        타이머 시작하기
      </Button>
    </div>
  );

  return (
    <>
      <DialogHeader className="space-y-0 mb-9">
        <DialogTitle className="sr-only">오늘의 목표</DialogTitle>
        <input
          value={todayGoal}
          onChange={(e) => setTodayGoal(clamp(e.target.value, MAX_TASK_LEN))}
          placeholder="오늘의 목표"
          className="
              w-full
              bg-transparent
              text-[46px] font-extrabold text-secondColor
              outline-none
              placeholder:text-[#CCD0D6]
            "
        />
      </DialogHeader>
      <TaskEditor
        mode="edit"
        taskInput={d.taskInput}
        onChangeTaskInput={d.setTaskInput}
        onAddTask={() => d.addTask(d.taskInput)}
        isComposing={isComposing}
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={() => setIsComposing(false)}
        tasks={d.draftTasks}
        onToggleCompleted={() => {}}
        editingId={d.editingId}
        editingValue={d.editingValue}
        onChangeEditingValue={d.setEditingValue}
        onStartEdit={d.startEdit}
        onSaveEdit={d.saveEdit}
        onRemoveTask={d.removeTask}
        footerButtons={footerButtonUI}
      />
    </>
  );
}
