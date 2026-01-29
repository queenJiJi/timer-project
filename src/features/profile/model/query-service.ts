import { profileAPI } from "@/features/profile/api/api-service";

export const profileQueryKeys = {
  all: ["profile"] as const,
  me: () => [...profileQueryKeys.all, "me"] as const,
};

export const profileQueryOptions = {
  me: () => ({
    queryKey: profileQueryKeys.me(),
    queryFn: () => profileAPI.getProfile(),
  }),
};
