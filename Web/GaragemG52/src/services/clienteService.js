export const clienteService = {
  async listar(httpConfig) {
    return httpConfig("GET", "clientes-veiculos");
  },

  async buscarPorPlaca(httpConfig, placa) {
    return httpConfig("GET", "clientes-veiculos/buscar-placa", null, { placa });
  },

  async buscarPorNome(httpConfig, nome) {
    return httpConfig("GET", "clientes-veiculos/buscar-nome", null, { nome });
  },

  async criar(httpConfig, cliente) {
    return httpConfig("POST", "clientes-veiculos", cliente);
  },

  async remover(httpConfig, id) {
    return httpConfig("DELETE", `clientes-veiculos/${id}`);
  },
};
