import { useEffect, useMemo, useState } from "react";
import { useTimerStore } from "../../model/timerStore";
import { useShallow } from "zustand/shallow";
import useUpdateTasksMutation from "../../model/useUpdateTasksMutation";
import { useTaskDraft } from "../../model/useTaskDraft";
import { Button } from "@/shared/ui";
import TaskEditor from "./TaskEditor";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function ManagePanel({ open, onClose }: Props) {
  const { storeTasks, setTasks, studyLogId } = useTimerStore(
    useShallow((s) => ({
      storeTasks: s.tasks,
      setTasks: s.setTasks,
      studyLogId: s.studyLogId,
    })),
  );

  const updateTasksMutation = useUpdateTasksMutation();
  const [mode, setMode] = useState<"view" | "edit">("view"); // 한일들 토글하는 보기용과 편집용 구분
  const [isComposing, setIsComposing] = useState(false);

  const d = useTaskDraft({ open, initialTasks: storeTasks });

  useEffect(() => {
    if (!open) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMode("view");
    setIsComposing(false);
  }, [open]);

  // 저장 가능한지 확인
  const canSave = useMemo(
    () =>
      d.draftTasks.length > 0 &&
      d.draftTasks.every((t) => t.content.trim().length > 0),
    [d.draftTasks],
  );

  // 업데이트 저장
  const handleSave = async () => {
    if (!canSave) return;

    // 로컬 store 반영
    setTasks(d.draftTasks);

    // 서버 반영
    if (studyLogId) {
      await updateTasksMutation.mutateAsync({
        studyLogId,
        body: {
          tasks: d.draftTasks.map((t) => ({
            content: t.content.trim(),
            isCompleted: !!t.isCompleted,
          })),
        },
      });
    }
    onClose();
  };

  const FooterButtonUI = (
    <div className="mt-9 flex justify-end gap-4">
      <Button
        size="md"
        className="bg-transparent text-mainColor h-12 text-[18px] font-semibold"
        onClick={() => {
          if (mode === "edit") {
            // edit에서 "취소"는 view로 돌아가기
            setMode("view");
            d.resetEditing();
            return;
          }
          onClose();
        }}
        disabled={updateTasksMutation.isPending}
      >
        취소
      </Button>

      <Button
        size="md"
        className={`h-12 px-6 font-semibold text-[18px]
          ${canSave ? "bg-mainColor/10 text-mainColor" : "bg-[#E5E7EB] text-[#969DA8]"}`}
        onClick={handleSave}
        disabled={!canSave || updateTasksMutation.isPending}
      >
        {mode === "view" ? "저장하기" : "변경 사항 저장하기"}
      </Button>
    </div>
  );

  return (
    <TaskEditor
      mode={mode}
      onChangeMode={setMode}
      taskInput={d.taskInput}
      onChangeTaskInput={d.setTaskInput}
      onAddTask={() => {
        d.addTask(d.taskInput);
      }}
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
      footerButtons={FooterButtonUI}
    />
  );
}
