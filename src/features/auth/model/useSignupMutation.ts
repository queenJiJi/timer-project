import { useMutation } from "@tanstack/react-query";
import type { SignupRequest } from "../api/types";
import { signupAPI } from "../api/api-service";

export function useSignupMutation() {
  return useMutation({
    mutationFn: (body: SignupRequest) => signupAPI.signup(body),
  });
}
