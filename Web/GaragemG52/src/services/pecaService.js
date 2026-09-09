import { useFetch } from "../hooks/UseFetch";

const usePecaService = () => {
  const { httpConfig, loading, error, data } = useFetch();

  return {
    loading,
    error,
    data,
    buscarPorNome: async (nomePeca, pageable = {}) => httpConfig(
      "GET",
      "pecas/buscar-nome",
      null,
      { nomePeca, ...pageable },
    ),
    buscarPorValor: async (precoPeca) => httpConfig("GET", "pecas/buscar-valor", null, { precoPeca }),
  };
};

export { usePecaService };
export const pecaService = usePecaService;
