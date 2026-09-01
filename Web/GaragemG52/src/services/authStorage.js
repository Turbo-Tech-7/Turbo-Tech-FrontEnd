const AUTH_TOKEN_KEY = "token";

export const getAuthToken = () => sessionStorage.getItem(AUTH_TOKEN_KEY);

export const setAuthToken = (token) => {
  if (!token) {
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
    return;
  }

  sessionStorage.setItem(AUTH_TOKEN_KEY, token);
};

export const removeAuthToken = () => {
  sessionStorage.removeItem(AUTH_TOKEN_KEY);
};
