const ACCESS = "accessToken";
const REFRESH = "refreshToken";

export const tokenStorage = {
  getAccess() {
    return localStorage.getItem(ACCESS);
  },
  getRefresh() {
    return localStorage.getItem(REFRESH);
  },
  setTokens(tokens: { accessToken: string; refreshToken: string }) {
    localStorage.setItem(ACCESS, tokens.accessToken);
    localStorage.setItem(REFRESH, tokens.refreshToken);
  },
  clearTokens() {
    localStorage.removeItem(ACCESS);
    localStorage.removeItem(REFRESH);
  },
};
