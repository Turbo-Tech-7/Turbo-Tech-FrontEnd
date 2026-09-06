import { useFetch } from "../hooks/UseFetch";

const useUsuarioService = () => {
  const { httpConfig, loading, error, data } = useFetch();

  return {
    loading,
    error,
    data,
    listarUsuarios: async () => httpConfig("GET", "users"),
    buscarPorId: async (id) => httpConfig("GET", "users", null, null, id),
    buscarPorEmail: async (email) => httpConfig("GET", "users/findByEmail", null, { email }),
    atualizar: async (id, usuario) => httpConfig("PUT", "users", usuario, null, id),
    remover: async (id) => httpConfig("DELETE", "users", null, null, id),
  };
};

export { useUsuarioService };
export const usuarioService = useUsuarioService;
