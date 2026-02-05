import CodeSymbol from "@/assets/code-symbol.png";
import coloredEdit from "@/assets/colored-edit.png";
import Edit from "@/assets/edit-icon.png";
import Delete from "@/assets/delete-icon.png";
import Check from "@/assets/check-icon.png";
import { MAX_TASK_LEN, type Task } from "./types";
import { clamp } from "@/lib/utils";

type Mode = "view" | "edit";
type Props = {
  mode: Mode;
  onChangeMode?: (m: Mode) => void;

  // 할일 작성
  taskInput: string;
  onChangeTaskInput: (v: string) => void;
  onAddTask: () => void;
  isComposing: boolean;
  onCompositionStart: () => void;
  onCompositionEnd: () => void;

  //할일 목록
  tasks: Task[];

  // 할일 토글
  onToggleCompleted: (id: string) => void;

  // 수정/삭제
  editingId: string | null;
  editingValue: string;
  onChangeEditingValue: (v: string) => void;
  onStartEdit: (t: Task) => void;
  onSaveEdit: (id: string) => void;
  onRemoveTask: (id: string) => void;

  // 하단의 버튼들
  footerButtons?: React.ReactNode;
};

export default function TaskEditor({
  mode,
  onChangeMode,
  taskInput,
  onChangeTaskInput,
  onAddTask,
  isComposing,
  onCompositionStart,
  onCompositionEnd,
  tasks,
  onToggleCompleted,
  editingId,
  editingValue,
  onChangeEditingValue,
  onStartEdit,
  onSaveEdit,
  onRemoveTask,
  footerButtons,
}: Props) {
  return (
    <div>
      <div className="flex items-center gap-3 rounded-md bg-[#F0F2F5] py-[18px] px-6">
        <input
          className="flex-1 bg-transparent text-[16px] text-[#4B5563] outline-none placeholder:text-[#CCD0D6]"
          value={taskInput}
          onChange={(e) =>
            onChangeTaskInput(clamp(e.target.value, MAX_TASK_LEN))
          }
          placeholder="할 일을 추가해 주세요."
          onCompositionStart={onCompositionStart}
          onCompositionEnd={onCompositionEnd}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (isComposing) return;
              e.preventDefault();
              onAddTask();
            }
          }}
        />
        <button
          type="button"
          onClick={onAddTask}
          className={`text-[16px] font-bold ${
            taskInput.trim()
              ? "text-mainColor"
              : "text-[#CCD0D6] cursor-not-allowed"
          }`}
        >
          추가
        </button>
      </div>

      {/* view mode */}
      {mode === "view" ? (
        <div>
          <div className="mt-7 flex items-center justify-between ">
            <div className="text-[20px] font-bold text-[#394252]">
              할 일 목록
            </div>

            <button
              type="button"
              className="flex items-center gap-2 text-[14px] text-[#4B5563]"
              onClick={() => onChangeMode?.("edit")}
            >
              <img src={coloredEdit} alt="editIcon" />할 일 수정
            </button>
          </div>

          <div className="mt-3 h-[460px] overflow-y-auto overflow-x-hidden space-y-3 no-scrollbar">
            {tasks.map((t) => (
              <div
                key={t.id}
                className={`flex items-center justify-between rounded-md px-6 py-[26px]
                ${t.isCompleted ? "bg-[#969DA8]" : "bg-mainColor"}`}
              >
                <div className="flex items-center gap-3">
                  <img src={CodeSymbol} className="w-[42px]" />
                  <div className="text-[16px] font-semibold text-white">
                    {t.content}
                  </div>
                </div>

                <button
                  type="button"
                  aria-label="toggle complete"
                  className="h-6 w-6 rounded border border-white/70 flex items-center justify-center"
                  onClick={() => onToggleCompleted(t.id)}
                >
                  {t.isCompleted ? <img src={Check} /> : null}
                </button>
              </div>
            ))}
          </div>
          {footerButtons}
        </div>
      ) : (
        // edit mode
        <div>
          <div className="mt-7 flex items-center justify-between">
            <div className="text-[20px] font-bold text-[#394252]">
              할 일 목록
            </div>
          </div>

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
                          onChangeEditingValue(
                            clamp(e.target.value, MAX_TASK_LEN),
                          )
                        }
                        className="bg-mainColor text-[16px] text-white font-semibold outline-none"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") onSaveEdit(t.id);
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
                        onClick={() => onSaveEdit(t.id)}
                        aria-label="save task"
                      >
                        <img src={Check} className="h-6 w-6" />
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="opacity-90 hover:opacity-100"
                          onClick={() => onStartEdit(t)}
                          aria-label="edit task"
                        >
                          <img src={Edit} className="h-6 w-6" />
                        </button>

                        <button
                          type="button"
                          className="opacity-90 hover:opacity-100"
                          onClick={() => onRemoveTask(t.id)}
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

          {footerButtons}
        </div>
      )}
    </div>
  );
}
