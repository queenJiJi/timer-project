import { useEffect, useMemo, useState } from "react";
import { Button } from "@/shared/ui";
import { clamp } from "@/lib/utils";
import useStopTimerMutation from "../../model/useStopTimerMutation";
import { useQueryClient } from "@tanstack/react-query";
import { useTimerStore } from "../../model/timerStore";
import { useShallow } from "zustand/shallow";
import { useTaskDraft } from "../../model/useTaskDraft";
import { timerQueryKeys } from "../../model/query-service";
import TaskEditor from "./TaskEditor";

type Props = {
  open: boolean;
  onClose: () => void;
};
const MIN_REVIEW_LEN = 15;
const MAX_REVIEW_LEN = 500;

export default function StopPanel({ open, onClose }: Props) {
  const qc = useQueryClient();
  const stopMutation = useStopTimerMutation();

  const { storeTasks, setTasks, timerId, flushRunningSegment, reset } =
    useTimerStore(
      useShallow((s) => ({
        storeTasks: s.tasks,
        setTasks: s.setTasks,
        timerId: s.timerId,
        splitTimes: s.splitTimes ?? [],
        flushRunningSegment: s.flushRunningSegment,
        reset: s.reset,
      })),
    );

  const [mode, setMode] = useState<"view" | "edit">("view");
  const [isComposing, setIsComposing] = useState(false);

  const d = useTaskDraft({ open, initialTasks: storeTasks });

  const [review, setReview] = useState("");

  useEffect(() => {
    if (!open) return;
    setMode("view");
    setIsComposing(false);
    setReview("");
    d.resetEditing();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const canSaveTasks = useMemo(() => {
    if (d.draftTasks.length === 0) return false;
    return d.draftTasks.every((t) => t.content.trim().length > 0);
  }, [d.draftTasks]);

  const reviewTrimmed = review.trim();
  const reviewLen = reviewTrimmed.length;
  const reviewOk = reviewLen >= MIN_REVIEW_LEN && reviewLen <= MAX_REVIEW_LEN;

  const canSubmit =
    canSaveTasks && reviewOk && !!timerId && !stopMutation.isPending;

  // 공부 완료하기 버튼 클릭 시
  const handleComplete = async () => {
    if (!timerId) return;
    if (!canSaveTasks) return;
    if (!reviewOk) return;

    // 로컬 store 반영(최종 tasks)
    const finalTasks = d.draftTasks.map((t) => ({
      ...t,
      content: t.content.trim(),
    }));
    setTasks(finalTasks);

    flushRunningSegment(); // 마지막 구간 반영
    const finalSplitTimes = useTimerStore.getState().splitTimes;

    // 서버에 반영
    await stopMutation.mutateAsync({
      timerId,
      body: {
        splitTimes: finalSplitTimes,
        review: reviewTrimmed,
        tasks: finalTasks.map((t) => ({
          content: t.content,
          isCompleted: !!t.isCompleted,
        })),
      },
    });

    // 성공 시: 타이머 초기 상태 + activeTimer 캐시 제거
    qc.setQueryData(timerQueryKeys.active(), null);
    reset();
    onClose();
  };

  const footerButtonUI = (
    <div className="mt-9 flex justify-end gap-4">
      <Button
        size="md"
        className="bg-[#F9FAFB] text-mainColor h-12 text-[18px] font-semibold"
        onClick={onClose}
        disabled={stopMutation.isPending}
      >
        취소
      </Button>

      <Button
        size="md"
        className={`h-12 px-6 font-semibold text-[18px]
            ${canSubmit ? "bg-mainColor/10 text-mainColor" : "bg-[#E5E7EB] text-[#969DA8]"}`}
        onClick={handleComplete}
        disabled={!canSubmit}
      >
        공부 완료하기
      </Button>
    </div>
  );

  return (
    <div>
      {/* 상단 헤더 */}
      <div className="mb-9">
        <div className="text-[20px] font-bold text-[#394252]">
          오늘도 수고하셨어요!
        </div>
        <div className="mt-2 text-[16px] text-[#717887]">
          완료한 할 일을 체크하고, 오늘의 학습 회고를 작성해 주세요.
        </div>
      </div>
      {/* tasks 영역 */}
      <TaskEditor
        mode={mode}
        onChangeMode={setMode}
        taskInput={d.taskInput}
        onChangeTaskInput={d.setTaskInput}
        onAddTask={() => d.addTask(d.taskInput)}
        isComposing={isComposing}
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={() => setIsComposing(false)}
        tasks={d.draftTasks}
        onToggleCompleted={(id) => {
          if (mode !== "view") return;
          d.toggleTask(id);
        }}
        editingId={d.editingId}
        editingValue={d.editingValue}
        onChangeEditingValue={d.setEditingValue}
        onStartEdit={(t) => {
          if (mode !== "edit") return;
          d.startEdit(t);
        }}
        onSaveEdit={(id) => {
          if (mode !== "edit") return;
          d.saveEdit(id);
        }}
        onRemoveTask={(id) => {
          if (mode !== "edit") return;
          d.removeTask(id);
        }}
        footerButtons={null}
      />
      {/* 학습 회고 */}
      <div className="mt-9">
        <div className="text-[14px] text-[#4B5563]">학습 회고</div>
        <textarea
          value={review}
          onChange={(e) => setReview(clamp(e.target.value, MAX_REVIEW_LEN))}
          placeholder="오늘 학습에 대한 회고를 최소 15자 이상 작성해 주세요."
          className="mt-2 h-[110px] w-full resize-none rounded-md bg-[#F3F4F6] p-4 text-[16px] text-[#4B5563] outline-none placeholder:text-[#CCD0D6]"
        />
      </div>
      {/* 하단 버튼 */}
      {footerButtonUI}
    </div>
  );
}
