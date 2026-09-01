import { getRoboBaseUrl } from "../config/api";

const BASE_URL = getRoboBaseUrl();

export const buscarCarroNoRobo = async (placa) => {
  const response = await fetch(`${BASE_URL}/api/veiculo/buscar-robo`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ placa }),
  });

  return response;
};

export const fecharRobo = async () => {
  const response = await fetch(`${BASE_URL}/api/robo/fechar`, {
    method: "POST",
  });

  return response;
};

export const buscarPecasNoRobo = async (listaPecas) => {
  const response = await fetch(`${BASE_URL}/api/pecas/buscar-robo`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pecas: listaPecas }),
  });

  return response;
};
