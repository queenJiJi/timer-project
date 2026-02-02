import { timerAPI } from "../api/api-service";

export const timerQueryKeys = {
  all: ["timer"] as const,
  active: () => [...timerQueryKeys.all, "active"] as const,
};

export const timerQueryOptions = {
  active: () => ({
    queryKey: timerQueryKeys.active(),
    queryFn: () => timerAPI.getTimer(),
  }),
};
