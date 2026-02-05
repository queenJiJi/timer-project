// modals/TodoModal/panels/StopPanel.tsx
import { useState } from "react";
import { Button } from "@/shared/ui";
import { clamp } from "@/lib/utils";
import type { Task } from "./types";

type Props = {
  onClose: () => void;
  onSubmit?: () => void;
};

const REVIEW_MAX = 200;

export default function StopPanel({ onClose, onSubmit }: Props) {
  // TODO: 퍼블리싱용 더미 (나중에 store/props로 교체)
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", content: "프론트엔드 문제 1개 풀어보기", isCompleted: false },
    { id: "2", content: "온라인 강의 Chapter 3 듣기", isCompleted: true },
    { id: "3", content: "프로젝트 코드 리팩토링하기", isCompleted: true },
  ]);

  const [review, setReview] = useState("");

  const toggle = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, isCompleted: !t.isCompleted } : t,
      ),
    );
  };

  return (
    <div>
      <div className="text-[22px] font-bold text-secondColor">
        오늘도 수고하셨어요!
      </div>
      <div className="mt-1 text-[13px] text-[#6B7280]">
        완료한 일을 체크하고, 오늘의 학습을 정리해 주세요.
      </div>

      <div className="mt-6 text-[14px] text-[#4B5563]">할 일 목록</div>
      <div className="mt-3 max-h-[280px] overflow-y-auto space-y-3 no-scrollbar">
        {tasks.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => toggle(t.id)}
            className={`w-full rounded-md px-5 py-4 flex items-center justify-between ${
              t.isCompleted ? "bg-[#E5E7EB]" : "bg-mainColor"
            }`}
          >
            <div
              className={`text-[15px] font-semibold ${
                t.isCompleted ? "text-[#4B5563]" : "text-white"
              }`}
            >
              {t.content}
            </div>

            <div
              className={`h-5 w-5 rounded border ${
                t.isCompleted ? "bg-white border-white" : "border-white"
              }`}
            />
          </button>
        ))}
      </div>

      <div className="mt-6 text-[14px] text-[#4B5563]">학습 회고</div>
      <textarea
        value={review}
        onChange={(e) => setReview(clamp(e.target.value, REVIEW_MAX))}
        placeholder="오늘 학습은 어땠나요? (최대 200자)"
        className="mt-2 w-full min-h-[110px] resize-none rounded-md bg-[#F3F4F6] px-4 py-3 text-[14px] text-[#374151] outline-none placeholder:text-[#9CA3AF]"
      />

      <div className="mt-8 flex justify-end gap-4">
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
          공부 완료하기
        </Button>
      </div>
    </div>
  );
}
