import { useFetch } from "../hooks/UseFetch";

const useDashboardService = () => {
  const { httpConfig, loading, error, data } = useFetch();

  return {
    loading,
    error,
    data,
    buscarVisaoGeral: async (filtro = "MES") => httpConfig("GET", "dashboard/visao-geral", null, { filtro }),
    buscarRelatorioFinanceiro: async (filtro = "MES") => httpConfig("GET", "dashboard/relatorio-financeiro", null, { filtro }),
    buscarRelatorioOrcamentos: async (filtro = "mes") => httpConfig("GET", "dashboard/orcamentos", null, { filtro }),
    buscarRelatorioPecas: async (filtro = "mes") => httpConfig("GET", "dashboard/pecas", null, { filtro }),
    buscarRelatorioClientes: async (filtro = "mes") => httpConfig("GET", "dashboard/clientes", null, { filtro }),
  };
};

export { useDashboardService };
export const dashboardService = useDashboardService;
