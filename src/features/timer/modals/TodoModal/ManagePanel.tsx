import { useEffect, useMemo, useState } from "react";
import CodeSymbol from "@/assets/code-symbol.png";
import coloredEdit from "@/assets/colored-edit.png";
import Edit from "@/assets/edit-icon.png";
import Delete from "@/assets/delete-icon.png";
import Check from "@/assets/check-icon.png";
import { Button } from "@/shared/ui";
import { clamp } from "@/lib/utils";
import type { Task } from "./types";
import { useTimerStore } from "../../model/timerStore";
import { useShallow } from "zustand/shallow";
import useUpdateTasksMutation from "../../model/useUpdateTasksMutation";

type Props = {
  open: boolean;
  onClose: () => void;
};

const MAX_LEN = 30;

export default function ManagePanel({ open, onClose }: Props) {
  const { storeTasks, setTasks, studyLogId } = useTimerStore(
    useShallow((s) => ({
      storeTasks: s.tasks,
      setTasks: s.setTasks,
      studyLogId: s.studyLogId,
    })),
  );

  const updateTasksMutation = useUpdateTasksMutation();

  const [mode, setMode] = useState<"view" | "edit">("view"); // 한일들토글하는 보기용과 편집용 구분

  // draft state: 모달 내부 편집용
  const [taskInput, setTaskInput] = useState("");
  const [draftTasks, setDraftTasks] = useState<Task[]>([]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [isComposing, setIsComposing] = useState(false);

  useEffect(() => {
    // 모달 열릴 때 store->draft 복사
    if (!open) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDraftTasks(storeTasks);
    setTaskInput("");
    setEditingId(null);
    setEditingValue("");
    setMode("view");
  }, [open, storeTasks]);

  // 할일 완료 토글(view 모드에서)
  const toggleCompleted = (id: string) => {
    setDraftTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, isCompleted: !t.isCompleted } : t,
      ),
    );
  };

  // 할일 추가(edit 모드에서)
  const addTask = () => {
    const v = taskInput.trim();
    if (!v) return;
    setDraftTasks((prev) => [
      ...prev,
      { id: crypto.randomUUID(), content: v, isCompleted: false },
    ]);
    setTaskInput("");
  };

  // 수정 시작
  const startEdit = (t: Task) => {
    setEditingId(t.id);
    setEditingValue(t.content);
  };

  // 수정사항 저장
  const saveEdit = (id: string) => {
    const v = editingValue.trim();
    if (!v) return;
    setDraftTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, content: v } : t)),
    );
    setEditingId(null);
    setEditingValue("");
  };

  // 할일 제거
  const removeTask = (id: string) => {
    setDraftTasks((prev) => prev.filter((t) => t.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setEditingValue("");
    }
  };

  // 저장 가능한지 확인
  const canSave = useMemo(() => {
    if (draftTasks.length === 0) return false;
    return draftTasks.every((t) => t.content.trim().length > 0);
  }, [draftTasks]);

  // 업데이트 저장
  const handleSave = async () => {
    if (!canSave) return;

    // 로컬 store 반영
    setTasks(
      draftTasks.map((t) => ({
        ...t,
        content: t.content.trim(),
      })),
    );
    // 서버 반영
    if (studyLogId) {
      await updateTasksMutation.mutateAsync({
        studyLogId,
        body: {
          tasks: draftTasks.map((t) => ({
            content: t.content.trim(),
            isCompleted: !!t.isCompleted,
          })),
        },
      });
    }

    onClose();
  };

  // view 모드 UI
  const ViewMode = (
    <div>
      <div className="mt-7 flex items-center justify-between">
        <div className="text-[20px] font-bold text-[#394252]">할 일 목록</div>

        <button
          type="button"
          className="flex items-center gap-2 text-[14px] text-[#4B5563]"
          onClick={() => setMode("edit")}
        >
          <img src={coloredEdit} alt="editIcon" />할 일 수정
        </button>
      </div>

      <div className="mt-3 h-[460px] overflow-y-auto overflow-x-hidden space-y-3 no-scrollbar">
        {draftTasks.map((t) => (
          <div
            key={t.id}
            className={`flex items-center justify-between rounded-md px-6 py-[26px]
              ${t.isCompleted ? "bg-[#9CA3AF]" : "bg-mainColor"}`}
          >
            <div className="flex items-center gap-3">
              <img src={CodeSymbol} className="w-[42px]" />
              <div className="text-[16px] font-semibold text-white">
                {t.content}
              </div>
            </div>

            {/* 완료 체크 토글 */}
            <button
              type="button"
              aria-label="toggle complete"
              className="h-6 w-6 rounded border border-white/70 flex items-center justify-center"
              onClick={() => toggleCompleted(t.id)}
            >
              {t.isCompleted ? (
                <span className="text-white text-[14px]">✓</span>
              ) : null}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-9 flex justify-end gap-4">
        <Button
          size="md"
          className="bg-transparent text-mainColor h-12 text-[18px] font-semibold"
          onClick={onClose}
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
          저장하기
        </Button>
      </div>
    </div>
  );

  // edit 모드 UI
  const EditMode = (
    <div>
      <div className="mt-7 flex items-center justify-between">
        <div className="text-[20px] font-bold text-[#394252]">할 일 목록</div>
      </div>

      <div className="mt-3 h-[460px] overflow-y-auto overflow-x-hidden space-y-3 no-scrollbar">
        {draftTasks.map((t) => {
          const isEditing = editingId === t.id;

          return (
            <div
              key={t.id}
              className="flex items-center justify-between rounded-md bg-mainColor px-6 py-[26px]"
            >
              <div className="flex items-center gap-3">
                <img src={CodeSymbol} className="w-[42px]" />
                {isEditing ? (
                  <input
                    value={editingValue}
                    onChange={(e) =>
                      setEditingValue(clamp(e.target.value, MAX_LEN))
                    }
                    className="bg-mainColor text-[16px] text-white font-semibold outline-none"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveEdit(t.id);
                    }}
                  />
                ) : (
                  <div className="text-[16px] font-semibold text-white">
                    {t.content}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4">
                {isEditing ? (
                  <button
                    type="button"
                    className="opacity-90 hover:opacity-100"
                    onClick={() => saveEdit(t.id)}
                    aria-label="save task"
                  >
                    <img src={Check} className="h-6 w-6" />
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      className="opacity-90 hover:opacity-100"
                      onClick={() => startEdit(t)}
                      aria-label="edit task"
                    >
                      <img src={Edit} className="h-6 w-6" />
                    </button>
                    <button
                      type="button"
                      className="opacity-90 hover:opacity-100"
                      onClick={() => removeTask(t.id)}
                      aria-label="delete task"
                    >
                      <img src={Delete} className="h-6 w-6" />
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-9 flex justify-end gap-4">
        <Button
          size="md"
          className="bg-transparent text-mainColor h-12 text-[18px] font-semibold"
          onClick={() => setMode("view")}
        >
          취소
        </Button>

        <Button
          size="md"
          className={`h-12 px-4 py-[13px] font-semibold text-[18px]
            ${canSave ? "bg-mainColor/10 text-mainColor" : "bg-[#E5E7EB] text-[#969DA8]"}`}
          onClick={handleSave}
          disabled={!canSave || updateTasksMutation.isPending}
        >
          변경 사항 저장하기
        </Button>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex items-center gap-3 rounded-md bg-[#F0F2F5] py-[18px] px-6">
        <input
          className="flex-1 bg-transparent text-[16px] text-[#4B5563] outline-none placeholder:text-[#CCD0D6]"
          value={taskInput}
          onChange={(e) => setTaskInput(clamp(e.target.value, MAX_LEN))}
          placeholder="할 일을 추가해 주세요."
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (isComposing) return;
              e.preventDefault();
              addTask();
            }
          }}
        />
        <button
          type="button"
          onClick={addTask}
          className={`text-[16px] font-bold ${
            taskInput ? "text-mainColor" : "text-[#CCD0D6] cursor-not-allowed"
          }`}
        >
          추가
        </button>
      </div>
      {mode === "view" ? ViewMode : EditMode}
    </div>
  );
}
