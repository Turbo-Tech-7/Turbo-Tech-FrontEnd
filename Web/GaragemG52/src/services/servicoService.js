import { useFetch } from "../hooks/UseFetch";

const useServicoService = () => {
  const { httpConfig, loading, error, data } = useFetch();

  return {
    loading,
    error,
    data,
    criar: async (servico) => httpConfig("POST", "servicos", servico),
    buscarPorId: async (id) => httpConfig("GET", "servicos", null, null, id),
    listar: async (page = 0, size = 7) =>
      httpConfig("GET", "servicos", null, { page, size }),
    listarPorVeiculo: async (veiculoId) => httpConfig("GET", "servicos/por-veiculo", null, { veiculoId }),
    atualizarStatus: async (id, status, motivoCancelamento = null) =>
      httpConfig(
        "PATCH",
        "servicos",
        null,
        motivoCancelamento
          ? { status, motivoCancelamento }
          : { status },
        `${id}/status`
      ),
    remover: async (id) => httpConfig("DELETE", "servicos", null, null, id),
  };
};

export { useServicoService };
export const servicoService = useServicoService;
