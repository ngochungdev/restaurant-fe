export const getAccessToken = () => localStorage.getItem("token") || null;

export const getRefreshToken = () => localStorage.getItem("refreshToken") || null;

export const setAuthTokens = ({ accessToken, refreshToken }) => {
  if (accessToken) {
    localStorage.setItem("token", accessToken);
  }

  if (refreshToken) {
    localStorage.setItem("refreshToken", refreshToken);
  }
};

export const clearAuthTokens = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
};
