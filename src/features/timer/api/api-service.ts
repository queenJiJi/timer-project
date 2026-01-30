import { request } from "@/shared/api/request";
import type { GetTimerResponse } from "./types";

export const timerAPI = {
  // 타이머 정보 조회
  getTimer() {
    return request<GetTimerResponse>("/api/timers", {
      method: "GET",
      auth: true,
    });
  },
};
