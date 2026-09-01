export const authService = {
  async login(httpConfig, credentials) {
    return httpConfig("POST", "auth/login", credentials);
  },

  async resetPassword(httpConfig, payload) {
    return httpConfig("POST", "auth/reset-password", payload);
  },

  async register(httpConfig, usuario) {
    return httpConfig("POST", "auth/register", usuario);
  },

  async forgotPassword(httpConfig, email) {
    return httpConfig("POST", "auth/forgot-password", null, { email });
  },

  async verifyLoginCode(httpConfig, codigo) {
    return httpConfig("POST", "auth/login/verify", { codigo });
  },
};
