import { request } from "@/shared/api/request";
import type { GetProfileResponse } from "./types";

// 사용자 프로필 관리
export const profileAPI = {
  // 프로필 조회
  getProfile() {
    return request<GetProfileResponse>("/api/profile", {
      method: "GET",
      auth: true,
    });
  },
};
