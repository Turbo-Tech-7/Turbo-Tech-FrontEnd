import { useFetch } from "../hooks/UseFetch"

const useClienteService = () => {

  const { httpConfig, loading, error, data} = useFetch()

  return {
    loading,
    error,
    data,

    listarClientes: async () => {
      return httpConfig("GET", "clientes-veiculos");
    },

    buscarPorId: async (id) => {
      return httpConfig("GET", "clientes-veiculos", null, null, id);
    },

    buscarPorPlaca: async (placa) => {
      return httpConfig("GET", "clientes-veiculos/buscar-placa", null, { placa });
    },

    buscarPorNome: async (nome) => {
      return httpConfig("GET", "clientes-veiculos/buscar-nome", null, { nome });
    },

    criar: async (cliente) => {
      return httpConfig("POST", "clientes-veiculos", cliente);
    },

    remover: async (id) => {
      return httpConfig("DELETE", `clientes-veiculos`, null, null, id);
    }

    }
  
};

export { useClienteService };
export const clienteService = useClienteService;
