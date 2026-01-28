import { useMutation } from "@tanstack/react-query";
import { authAPI } from "../api/api-service";
import type { LoginResponse, LoginRequest } from "./../api/types";

export function useLoginMutations() {
  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: (body) => authAPI.login(body),
  });
}
