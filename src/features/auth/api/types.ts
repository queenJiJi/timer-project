export type DupCheckRespoonse = {
  success: boolean;
  available: boolean;
  message: string;
};

export type SignupRequest = {
  email: string;
  nickname: string;
  password: string;
  confirmPassword: string;
};

export type SignupResponse = {
  success: boolean;
  message: string;
};
