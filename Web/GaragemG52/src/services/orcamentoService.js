import { useFetch } from "../hooks/UseFetch"

const useOrcamentoService = () => {

  
  const { httpConfig, loading, error, data} = useFetch()

    return {
    loading,
    error,
    data,

    criar: async (orcamento) => {
      return httpConfig("POST", "orcamentos", orcamento);
    },

    listarOrçamentos: async () => {
      return httpConfig("GET", "orcamentos");
    },

    listarOrçamentosPorId: async (id) => {
      return httpConfig("GET", "orcamentos", null, null, id);
    },

    listarOrçamentosPorVeiculo: async (veiculoId) => {
      return httpConfig("GET", "orcamentos/por-veiculo",null,{veiculoId});
    },

    listarOrçamentosPorStatus: async (status) => {
      return httpConfig("GET", "orcamentos/por-status", null, { status });
    },
    
    atualizarOrçamento: async (orçamento, id) => {
      return httpConfig("PUT", "orcamentos", orçamento, null, id);
    },
    
    cancelarOrçamento: async (motivo, id) => {
      return httpConfig("PATCH", `orcamentos/${id}/cancelar`, motivo);
    },

    deletarOrçamento: async (id) => {
      return httpConfig("DELETE", `orcamentos`, null, null, id);
    },

    gerarPdf: async (id) => {
      return httpConfig("GET", "orcamentos", null, null, `${id}/pdf`);
    },

    enviarPdfPorEmail: async (id) => {
      return httpConfig("POST", "orcamentos", null, null, `${id}/pdf/email`);
    },

  }
};

export { useOrcamentoService };
export const orcamentoService = useOrcamentoService;
