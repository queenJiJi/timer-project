import type { TimerRunState } from "../model/timerStore";
import todoIcon from "@/assets/todo-icon.png";
import resetIcon from "@/assets/reset-icon.png";

type Props = {
  timerState: TimerRunState;
  onOpenTodo: () => void;
  onReset: () => void;
};

export default function TimerActionButtons({
  timerState,
  onOpenTodo,
  onReset,
}: Props) {
  if (timerState === "idle") return null; // 처음 재생버튼이 눌려있지 않다면 보이지않음

  return (
    <div className="mt-20 flex items-center justify-center gap-6">
      <button type="button" aria-label="할 일 목록" onClick={onOpenTodo}>
        <img src={todoIcon} alt="todoicon" />
      </button>
      <button type="button" aria-label="초기화" onClick={onReset}>
        <img src={resetIcon} alt="reseticon" />
      </button>
    </div>
  );
}
