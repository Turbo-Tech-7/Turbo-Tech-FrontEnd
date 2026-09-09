import { useFetch } from "../hooks/UseFetch"

const useAuthService = () => {

  const { httpConfig, loading, error, data} = useFetch()

  return {
    loading,
    error,
    data,
    
    login: async (credentials) => {
      return httpConfig("POST", "auth/login", credentials);
    },
    
    register: async (usuario) => {
      return httpConfig("POST", "auth/register", usuario);
    },

    verifyLoginCode: async (codigo) => {
      return httpConfig("POST", "auth/login/verify", { codigo });
    },

    forgotPassword: async (email) => {
      return httpConfig("POST", "auth/forgot-password", null, { email });
    },

    resetPassword: async (token, novaSenha) => {
      return httpConfig("POST", "auth/reset-password", null, { token, novaSenha });
    },
  }
};

export { useAuthService };
export const authService = useAuthService;
