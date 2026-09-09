import { useFetch } from "../hooks/UseFetch";

const useVeiculoService = () => {
  const { httpConfig, loading, error, data } = useFetch();

  return {
    loading,
    error,
    data,
    criar: async (placa) => httpConfig("POST", "veiculos/criar", null, null, placa),
    buscarPorId: async (id) => httpConfig("GET", "veiculos", null, null, id),
    buscarPorPlaca: async (placa) => httpConfig("GET", "veiculos/buscar-placa", null, { placa }),
    listar: async () => httpConfig("GET", "veiculos"),
    atualizar: async (id, veiculo) => httpConfig("PUT", "veiculos", veiculo, null, id),
    remover: async (id) => httpConfig("DELETE", "veiculos", null, null, id),
  };
};

export { useVeiculoService };
export const veiculoService = useVeiculoService;
