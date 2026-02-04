import { request } from "@/shared/api/request";
import type {
  DeleteTimerResponse,
  GetTimerResponse,
  StartTimerRequest,
  StartTimerResponse,
} from "./types";

export const timerAPI = {
  // 타이머 정보 조회
  getTimer() {
    return request<GetTimerResponse>("/api/timers", {
      method: "GET",
      auth: true,
    });
  },

  // 타이머 시작(오늘의 목표 생성 포함)
  startTimer(body: StartTimerRequest) {
    return request<StartTimerResponse>("/api/timers", {
      method: "POST",
      auth: true,
      body: JSON.stringify(body),
    });
  },

  // 타이머 삭제/초기화
  deleteTimer(timerId: string) {
    return request<DeleteTimerResponse>(`/api/timers/${timerId}`, {
      method: "DELETE",
      auth: true,
    });
  },
};
