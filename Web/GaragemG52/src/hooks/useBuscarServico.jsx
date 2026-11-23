import { useCallback, useState } from "react"
import { clienteService } from "../services/clienteService"
import { servicoService } from "../services/servicoService"
import { veiculoService } from "../services/veiculoService"

const normalizarPlaca = (value) =>
  String(value ?? "").replace(/[^A-Za-z0-9]/g, "").toUpperCase()

const extrairLista = (resposta) => {
  if (!resposta) return []

  if (Array.isArray(resposta)) return resposta
  if (Array.isArray(resposta.data)) return resposta.data
  if (resposta.data !== undefined && resposta.data !== null) return [resposta.data]

  return [resposta]
}

const extrairPrimeiro = (resposta) => extrairLista(resposta)[0] ?? null

const normalizarCliente = (cliente) => {
  if (!cliente) return null

  const email = cliente.email ?? cliente.emailCliente ?? cliente.emailUsuario ?? null
  const telefone = cliente.telefone ?? cliente.telefoneCliente ?? cliente.telefoneUsuario ?? null

  return {
    ...cliente,
    email,
    telefone,
    emailCliente: email,
    telefoneCliente: telefone,
  }
}

export function useBuscarServico() {
  const veiculoApi = veiculoService()
  const servicoApi = servicoService()
  const clienteApi = clienteService()

  const [servicos, setServicos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const montarResultado = (veiculo, listaServicos, clienteVeiculo) => {
    const clienteNormalizado = normalizarCliente(clienteVeiculo)

    return {
      veiculo,
      servicos: listaServicos,
      clienteVeiculo: clienteNormalizado,
      placa: normalizarPlaca(veiculo?.placa ?? clienteNormalizado?.placaVeiculo),
      veiculoId: veiculo?.id ?? clienteNormalizado?.veiculoId ?? null,
    }
  }

  const buscarPorPlaca = useCallback(async (placa) => {
    const placaNormalizada = normalizarPlaca(placa)

    if (!placaNormalizada || placaNormalizada.length !== 7) {
      setError("Placa obrigatória")
      setServicos([])
      return null
    }

    setLoading(true)
    setError("")

    try {
      const respostaVeiculo = await veiculoApi.buscarPorPlaca(placaNormalizada)
      const veiculo = extrairPrimeiro(respostaVeiculo)

      if (!veiculo?.id) {
        setServicos([])
        setError("Veículo não encontrado")
        return null
      }

      const respostaCliente = await clienteApi.buscarPorPlaca(placaNormalizada)
      const clientes = extrairLista(respostaCliente)
      const clienteVeiculo =
        clientes.find((cliente) => normalizarPlaca(cliente?.placaVeiculo) === placaNormalizada) ??
        clientes[0] ??
        null

      const respostaServicos = await servicoApi.listarPorVeiculo(veiculo.id)
      const listaServicos = extrairLista(respostaServicos)
      const resultado = montarResultado(veiculo, listaServicos, clienteVeiculo)

      setServicos(listaServicos)
      return resultado
    } catch (err) {
      setServicos([])
      setError(err?.message || "Erro ao buscar serviço")
      return null
    } finally {
      setLoading(false)
    }
  }, [clienteApi, servicoApi, veiculoApi])

  const buscarPoIdVeiculo = useCallback(async (idVeiculo) => {
    if (!idVeiculo) {
      setError("Veículo obrigatório")
      setServicos([])
      return null
    }

    setLoading(true)
    setError("")

    try {
      const respostaVeiculo = await veiculoApi.buscarPorId(idVeiculo)
      const veiculo = extrairPrimeiro(respostaVeiculo)

      if (!veiculo?.id) {
        setServicos([])
        setError("Veículo não encontrado")
        return null
      }

      const placaNormalizada = normalizarPlaca(veiculo.placa)
      const respostaCliente = await clienteApi.buscarPorPlaca(placaNormalizada)
      const clientes = extrairLista(respostaCliente)
      const clienteVeiculo =
        clientes.find((cliente) => normalizarPlaca(cliente?.placaVeiculo) === placaNormalizada) ??
        clientes[0] ??
        null

      const respostaServicos = await servicoApi.listarPorVeiculo(veiculo.id)
      const listaServicos = extrairLista(respostaServicos)
      const resultado = montarResultado(veiculo, listaServicos, clienteVeiculo)

      setServicos(listaServicos)
      return resultado
    } catch (err) {
      setServicos([])
      setError(err?.message || "Erro ao buscar serviço")
      return null
    } finally {
      setLoading(false)
    }
  }, [clienteApi, servicoApi, veiculoApi])

  return { servicos, loading, error, buscarPorPlaca, buscarPoIdVeiculo }
}
