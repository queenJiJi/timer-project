import { signupAPI } from "../api/api-service";

export const authQueryKeys = {
  all: ["auth"] as const,

  //email을 입력으로 받는 '중복확인'용 캐시 키
  checkEmail: (email: string) =>
    [...authQueryKeys.all, "checkEmail", email] as const,
  //nickname을 입력으로 받는 '중복확인'용 캐시 키
  checkNickname: (nickname: string) =>
    [...authQueryKeys.all, "checkNickname", nickname] as const,
};

export const authQueryOptions = {
  checkEmail: (email: string) => ({
    queryKey: authQueryKeys.checkEmail(email),
    queryFn: () => signupAPI.checkEmail(email),
  }),
  checkNickname: (nickname: string) => ({
    queryKey: authQueryKeys.checkNickname(nickname),
    queryFn: () => signupAPI.checkNickname(nickname),
  }),
};
