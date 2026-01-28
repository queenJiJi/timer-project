import { useQuery } from "@tanstack/react-query";
import { authQueryOptions } from "./query-service";

export function useCheckEmailQuery(email: string) {
  return useQuery({ ...authQueryOptions.checkEmail(email), enabled: false }); // enabled:false를 통해 타이핑중에 자동으로 요청되는 것 방지
}

export function useCheckNicknameQuery(nickname: string) {
  return useQuery({
    ...authQueryOptions.checkNickname(nickname),
    enabled: false,
  });
}
