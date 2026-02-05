// modals/TodoModal/panels/ManagePanel.tsx
import { useState } from "react";
import CodeSymbol from "@/assets/code-symbol.png";
import Edit from "@/assets/edit-icon.png";
import Delete from "@/assets/delete-icon.png";
import Check from "@/assets/check-icon.png";
import { Button } from "@/shared/ui";
import { clamp } from "@/lib/utils";
import type { Task } from "./types";

type Props = {
  onClose: () => void;
  onSubmit?: () => void;
};

const MAX_LEN = 30;

export default function ManagePanel({ onClose, onSubmit }: Props) {
  // TODO: 퍼블리싱용 더미 (나중에 props로 교체)
  const [taskInput, setTaskInput] = useState("");
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", content: "프론트엔드 문제 1개 풀어보기" },
    { id: "2", content: "온라인 강의 Chapter 3 듣기" },
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");

  const addTask = () => {
    const v = taskInput.trim();
    if (!v) return;
    setTasks((prev) => [...prev, { id: crypto.randomUUID(), content: v }]);
    setTaskInput("");
  };

  const startEdit = (t: Task) => {
    setEditingId(t.id);
    setEditingValue(t.content);
  };

  const saveEdit = (id: string) => {
    const v = editingValue.trim();
    if (!v) return;
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, content: v } : t)),
    );
    setEditingId(null);
    setEditingValue("");
  };

  const removeTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div>
      <div className="flex items-center gap-3 rounded-md bg-[#F0F2F5] py-[18px] px-6">
        <input
          className="flex-1 bg-transparent text-[16px] text-[#4B5563] outline-none placeholder:text-[#CCD0D6]"
          value={taskInput}
          onChange={(e) => setTaskInput(clamp(e.target.value, MAX_LEN))}
          placeholder="할 일을 추가해 주세요."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
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

      <div className="mt-7 text-[14px] text-[#4B5563]">할 일 목록</div>

      <div className="mt-3 h-[460px] overflow-y-auto overflow-x-hidden space-y-3 no-scrollbar">
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
          onClick={onClose}
        >
          취소
        </Button>

        <Button
          size="md"
          className="h-12 px-4 py-[13px] font-semibold text-[18px] bg-mainColor/10 text-mainColor"
          onClick={() => onSubmit?.()}
        >
          변경 사항 저장하기
        </Button>
      </div>
    </div>
  );
}
