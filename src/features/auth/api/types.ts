export type DupCheckResponse = {
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

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  success: boolean;
  message: string;
  accessToken: string;
  refreshToken: string;
  isFirstLogin: boolean;
  isDuplicateLogin: boolean;
};

export type LogoutResponse = {
  success: boolean;
  message: string;
};

export type RefreshRequest = {
  refreshToken: string;
};

export type RefreshResponse = {
  success: boolean;
  accessToken: string;
};
