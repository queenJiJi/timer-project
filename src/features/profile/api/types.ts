export type GetProfileResponse = {
  email: string;
  nickname: string;
  profile: {
    career: string;
    purpose: string;
    goal: string;
    techStacks: string[];
    profileImage: string;
  };
};
