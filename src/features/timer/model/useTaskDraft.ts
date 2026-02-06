import { useEffect, useState } from "react";
import type { Task } from "../modals/TodoModal";

export function useTaskDraft(params: { open: boolean; initialTasks: Task[] }) {
  const { open, initialTasks } = params;
  // draft state: 모달 내부 편집용
  const [taskInput, setTaskInput] = useState("");
  const [draftTasks, setDraftTasks] = useState<Task[]>([]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");

  useEffect(() => {
    // 모달 열릴 때 store->draft 복사
    if (!open) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDraftTasks(initialTasks);
    setTaskInput("");
    setEditingId(null);
    setEditingValue("");
  }, [open, initialTasks]);

  // 할일 완료 토글(view 모드에서)
  const toggleTask = (id: string) => {
    setDraftTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, isCompleted: !t.isCompleted } : t,
      ),
    );
  };

  // 할일 추가(edit 모드에서)
  const addTask = (content: string) => {
    const v = content.trim();
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

  // 초기화
  const resetEditing = () => {
    setEditingId(null);
    setEditingValue("");
  };

  return {
    draftTasks,
    setDraftTasks,
    taskInput,
    setTaskInput,
    editingId,
    editingValue,
    setEditingValue,

    addTask,
    toggleTask,
    startEdit,
    saveEdit,
    removeTask,
    resetEditing,
  };
}
