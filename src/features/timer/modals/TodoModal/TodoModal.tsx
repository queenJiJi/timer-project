import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CodeSymbol from "@/assets/code-symbol.png";
import Edit from "@/assets/edit-icon.png";
import Delete from "@/assets/delete-icon.png";
import Check from "@/assets/check-icon.png";
import { Button } from "@/shared/ui";
import { clamp } from "@/lib/utils";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (body: { todayGoal: string; tasks: string[] }) => void;
};

type Task = {
  id: string;
  content: string;
};

const MAX_LEN = 30;

export default function TodoModal({ open, onClose, onSubmit }: Props) {
  const [todayGoal, setTodayGoal] = useState<string>("");
  const [taskInput, setTaskInput] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>([]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<string>("");

  const [isComposing, setIsComposing] = useState(false);

  // 할 일 추가
  const addTask = () => {
    if (!taskInput) return;
    const v = taskInput.trim();
    if (!v) return;
    setTasks((prev) => [...prev, { id: crypto.randomUUID(), content: v }]);
    setTaskInput("");
  };

  // 할 일 수정
  const startEdit = (t: Task) => {
    setEditingId(t.id);
    setEditingValue(t.content);
  };

  // 수정된 할 일 저장
  const saveEdit = (id: string) => {
    const v = editingValue?.trim();
    if (!v) return;

    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, content: v } : t)),
    );
    setEditingId(null);
    setEditingValue("");
  };

  // 할 일 삭제
  const removeTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id != id));
  };

  // 초기화
  const resetLocal = () => {
    setTodayGoal("");
    setTaskInput("");
    setTasks([]);
  };

  // 취소 버튼
  const handleCancel = () => {
    resetLocal();
    onClose();
  };

  // 제출 가능 상태 확인
  const canSubmit = useMemo(() => {
    const goalOk = todayGoal.trim().length > 0;
    const hasTask = tasks.length >= 1;
    const noEmpty = tasks.every((t) => t.content.trim().length > 0);
    return goalOk && hasTask && noEmpty;
  }, [todayGoal, tasks]);

  // 시작하기(=모달 제출) 버튼
  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({
      todayGoal: todayGoal.trim(),
      tasks: tasks.map((t) => t.content.trim()),
    });
  };

  return (
    <Dialog open={open}>
      <DialogContent
        className="max-w-[640px] rounded-lg px-9 py-12"
        showCloseButton={false}
        // 바깥눌러도 닫히지 않게
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="space-y-0">
          <DialogTitle className="sr-only">오늘의 목표</DialogTitle>
          <input
            value={todayGoal}
            onChange={(e) => setTodayGoal(clamp(e.target.value, MAX_LEN))}
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

        {/* 할 일 목록 */}
        <div className="mt-9">
          <div className="text-[14px] text-[#4B5563]">할 일 목록</div>

          {/* 입력 + 추가 */}
          <div className="mt-2 flex items-center gap-3 rounded-md bg-[#F0F2F5] py-[18px] px-6">
            <input
              className="flex-1 bg-transparent text-[16px] text-[#4B5563] outline-none placeholder:text-[#CCD0D6] "
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
              className={`text-[16px] font-bold
                ${taskInput ? "text-mainColor" : "text-[#CCD0D6] cursor-not-allowed"}`}
            >
              추가
            </button>
          </div>

          {/* 추가된 할일 목록 */}
          <div className="mt-9 h-[460px] overflow-y-auto overflow-x-hidden space-y-3 no-scrollbar">
            {tasks.map((t) => {
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
                      <div className="text-[16px] font-semibold text-white ">
                        {t.content}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    {isEditing ? (
                      <>
                        {/* 저장(체크) */}
                        <button
                          type="button"
                          className="opacity-90 hover:opacity-100"
                          onClick={() => saveEdit(t.id)}
                          aria-label="save task"
                        >
                          <img src={Check} className="h-6 w-6" />
                        </button>
                      </>
                    ) : (
                      <>
                        {/* 수정 */}
                        <button
                          type="button"
                          className="opacity-90 hover:opacity-100"
                          onClick={() => startEdit(t)}
                          aria-label="edit task"
                        >
                          <img src={Edit} className="h-6 w-6" />
                        </button>
                        {/* 삭제 */}
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

          {/* 하단 버튼 */}
          <div className="mt-9 flex justify-end gap-4">
            <Button
              size="md"
              className="bg-[#F9FAFB] text-mainColor h-12 text-[18px] font-semibold"
              onClick={handleCancel}
            >
              취소
            </Button>

            <Button
              size="md"
              className={`w-[146px] h-12 px-4 py-[13px] font-semibold text-[18px]
                ${canSubmit ? "bg-mainColor/10 text-mainColor" : "bg-[#E5E7EB] text-[#969DA8]"}`}
              onClick={handleSubmit}
              disabled={!canSubmit}
            >
              타이머 시작하기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
