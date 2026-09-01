export const orcamentoService = {
  async criar(httpConfig, orcamento) {
    return httpConfig("POST", "orcamentos", orcamento);
  },

  async listar(httpConfig) {
    return httpConfig("GET", "orcamentos");
  },
};
