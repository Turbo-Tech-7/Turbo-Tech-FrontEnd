import { useFetch } from "../hooks/UseFetch";

const useFornecedorService = () => {
  const { httpConfig, loading, error, data } = useFetch();

  return {
    loading,
    error,
    data,
    criar: async (fornecedor) => httpConfig("POST", "fornecedores", fornecedor),
    buscarPorId: async (id) => httpConfig("GET", "fornecedores", null, null, id),
    listar: async () => httpConfig("GET", "fornecedores"),
    buscarPorNome: async (nome) => httpConfig("GET", "fornecedores/buscar-nome", null, { nome }),
    atualizar: async (id, fornecedor) => httpConfig("PUT", "fornecedores", fornecedor, null, id),
    remover: async (id) => httpConfig("DELETE", "fornecedores", null, null, id),
  };
};

export { useFornecedorService };
export const fornecedorService = useFornecedorService;
