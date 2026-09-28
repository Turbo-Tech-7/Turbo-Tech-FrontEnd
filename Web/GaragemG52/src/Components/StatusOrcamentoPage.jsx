import { useState } from "react"
import { Link } from "react-router-dom"
import buscarpecas from "../assets/buscarpecas.png"
import "./css/StatusOrcamentoPage.css"
import { useBuscarServico } from "../hooks/useBuscarServico"
import { servicoService } from "../services/servicoService"

const StatusOrcamentoPage = () => {
  const [placa, setPlaca] = useState("")
  const [telefone, setTelefone] = useState("")
  const [email, setEmail] = useState("")
  const [mostrarResultado, setMostrarResultado] = useState(false)
  const [statusPorServico, setStatusPorServico] = useState({})
  const [acaoSelecionadaPorServico, setAcaoSelecionadaPorServico] = useState({})
  const [modalAprovarId, setModalAprovarId] = useState(null)
  const [modalCancelarId, setModalCancelarId] = useState(null)
  const [modalVisualizar, setModalVisualizar] = useState(false)
  const [servicoSelecionado, setServicoSelecionado] = useState(null)
  const [motivoCancelamento, setMotivoCancelamento] = useState("")
  const [orcamento, setOrcamentos] = useState([])
  const [resultadoBusca, setResultadoBusca] = useState(null)
  const [mensagem, setMensagem] = useState("")
  const { buscarPorPlaca, buscarPoIdVeiculo, error } = useBuscarServico()
  const servicoApi = servicoService()


  const buscarOrcamento = async (event) => {
    event.preventDefault()

    if (placa.length !== 7) {
      setMensagem("Placa obrigatória")
      return
    }

    const resultado = await buscarPorPlaca(placa)
    const resultadoFiltrado = filtrarResultadoPorContato(resultado, email, telefone)
    const servicosEncontrados = Array.isArray(resultadoFiltrado?.servicos)
      ? resultadoFiltrado.servicos
      : []

    if (!servicosEncontrados.length) {
      setMensagem(
        email || telefone
          ? "Nenhum serviço encontrado para os dados informados"
          : error || "Nenhum serviço encontrado"
      )
      setMostrarResultado(false)
      return
    }

    setMensagem("")
    setResultadoBusca(resultadoFiltrado)
    setOrcamentos(servicosEncontrados)
    setStatusPorServico(
      Object.fromEntries(servicosEncontrados.map((servico) => [servico.id, servico.status || "ABERTO"]))
    )
    setAcaoSelecionadaPorServico({})
    setModalAprovarId(null)
    setModalCancelarId(null)

    const dadosVeiculo = await buscarPoIdVeiculo(servicosEncontrados[0].veiculoId)
    console.log(dadosVeiculo)
    setMostrarResultado(true)
  }

  const statusTexto = {
    aberto: "Aberto",
    finalizado: "Finalizado",
    cancelado: "Cancelado",
    ABERTO: "Aberto",
    FINALIZADO: "Finalizado",
    CANCELADO: "Cancelado",
  }

  const formatarTelefone = (valor) => {
    if (!valor) return "Telefone não informado"

    const apenasNumeros = String(valor).replace(/\D/g, "")

    if (apenasNumeros.length !== 11) {
      return String(valor)
    }

    return `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2, 3)} ${apenasNumeros.slice(3, 7)}-${apenasNumeros.slice(7, 11)}`
  }

  const normalizarEmail = (valor) => String(valor ?? "").trim().toLowerCase()
  const normalizarTelefone = (valor) => String(valor ?? "").replace(/\D/g, "")

  const filtrarResultadoPorContato = (resultado, emailInput, telefoneInput) => {
    if (!resultado) return resultado

    const temEmail = normalizarEmail(emailInput).length > 0
    const temTelefone = normalizarTelefone(telefoneInput).length > 0

    if (!temEmail && !temTelefone) return resultado

    const cliente = resultado?.clienteVeiculo ?? {}
    const emailCliente = normalizarEmail(cliente.email ?? cliente.emailCliente ?? cliente.emailUsuario)
    const telefoneCliente = normalizarTelefone(cliente.telefone ?? cliente.telefoneCliente ?? cliente.telefoneUsuario)

    const emailOk = !temEmail || emailCliente === normalizarEmail(emailInput)
    const telefoneOk = !temTelefone || telefoneCliente === normalizarTelefone(telefoneInput)

    if (emailOk && telefoneOk) return resultado

    return {
      ...resultado,
      clienteVeiculo: null,
      servicos: [],
    }
  }

  const getDadosCliente = (servico = null) => {
    const cliente =
      servico?.clienteVeiculo ??
      servico?.cliente ??
      resultadoBusca?.clienteVeiculo ??
      {}

    const nome = cliente.nomeCliente || cliente.nome || "Cliente"
    const email = cliente.email || cliente.emailCliente || cliente.emailUsuario || "Email não informado"
    const telefone = formatarTelefone(
      cliente.telefone || cliente.telefoneCliente || cliente.telefoneUsuario
    )

    return { nome, email, telefone }
  }

  const motivosCancelamentoTexto = {
    "cliente-desistiu": "Cliente desistiu",
    "demora-peca": "Demora na peça",
    "preco-alto": "Preço alto",
    outros: "Outros",
  }

  const getStatusAtual = (servico) => {
    const statusAtual = statusPorServico[servico?.id] ?? servico?.status ?? "ABERTO"
    return String(statusAtual).toLowerCase()
  }

  const selecionarStatus = (event, servicoId) => {
    const valor = event.target.value

    setAcaoSelecionadaPorServico((prev) => ({
      ...prev,
      [servicoId]: valor,
    }))

    if (valor === "FINALIZADO") {
      setModalAprovarId(servicoId)
    }

    if (valor === "CANCELADO") {
      setModalCancelarId(servicoId)
    }
  }

  const fecharModalAprovar = (servicoId) => {
    setModalAprovarId(null)
    setAcaoSelecionadaPorServico((prev) => ({
      ...prev,
      [servicoId]: "",
    }))
  }

  const abrirModalVisualizacao = (servico) => {
    setServicoSelecionado(servico)
    setModalVisualizar(true)
  }

  const fecharModalVisualizacao = () => {
    setModalVisualizar(false)
    setServicoSelecionado(null)
  }

  const confirmarAprovacao = async (servicoId) => {
    try {
      const resposta = await servicoApi.atualizarStatus(servicoId, "FINALIZADO")

      if (resposta?.status && resposta.status >= 400) {
        setMensagem("Não foi possível finalizar o serviço.")
        return
      }

      setStatusPorServico((prev) => ({
        ...prev,
        [servicoId]: "FINALIZADO",
      }))
      setMensagem("")
    } catch (err) {
      setMensagem(err?.message || "Erro ao finalizar o serviço.")
      return
    } finally {
      setModalAprovarId(null)
      setAcaoSelecionadaPorServico((prev) => ({
        ...prev,
        [servicoId]: "",
      }))
    }
  }

  const fecharModalCancelar = (servicoId) => {
    setModalCancelarId(null)
    setMotivoCancelamento("")
    setAcaoSelecionadaPorServico((prev) => ({
      ...prev,
      [servicoId]: "",
    }))
  }

  const confirmarCancelamento = async (servicoId) => {
    if (!motivoCancelamento) return

    try {
      const resposta = await servicoApi.atualizarStatus(
        servicoId,
        "CANCELADO",
        motivoCancelamento
      )

      if (resposta?.status && resposta.status >= 400) {
        setMensagem("Não foi possível cancelar o serviço.")
        return
      }

      setStatusPorServico((prev) => ({
        ...prev,
        [servicoId]: "CANCELADO",
      }))
      setMensagem("")
    } catch (err) {
      setMensagem(err?.message || "Erro ao cancelar o serviço.")
      return
    } finally {
      setModalCancelarId(null)
      setMotivoCancelamento("")
      setAcaoSelecionadaPorServico((prev) => ({
        ...prev,
        [servicoId]: "",
      }))
    }
  }

  return (
    <main className="sop_page">

      <header className="sop_top-bar">

        <div className="sop_top-bar__title">

          <div className="sop_top-bar__icon">
            <img src={buscarpecas} alt="" />
          </div>

          <div>
            <h1>Status dos Serviços</h1>
            <p>Busque um serviço e atualize seu status</p>
          </div>

        </div>

        <Link to="/home" className="sop_back">
          Voltar
        </Link>

      </header>

      {!mostrarResultado ? (

        <section className="sop_card">

          <div className="sop_card__icon">
            <img src={buscarpecas} alt="" />
          </div>

          <div className="sop_card__header">
            <h2>Buscar Serviço</h2>
            <p>Preencha os demais para uma melhor busca</p>
          </div>

          <form
            className="sop_form"
            onSubmit={buscarOrcamento}
          >

            <label htmlFor="placa">
              Placa do veículo (Obrigatório)
            </label>

            <input
              id="placa"
              value={placa}
              onChange={(event) =>
                setPlaca(event.target.value.toUpperCase())
              }
              placeholder="ABC-1234"
            />

            <label htmlFor="telefone">
              Telefone
            </label>

            <input
              id="telefone"
              value={telefone}
              onChange={(event) =>
                setTelefone(event.target.value)
              }
              placeholder="(XX) X XXXX-XXXX"
            />

            <label htmlFor="email">
              Email do cliente
            </label>

            <input
              id="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="email@gmail.com"
            />

            <button type="submit">
              Realizar procura
            </button>
              {mensagem ? <p>{mensagem}</p> : ""}
          </form>

        </section>

      ) : (

        <section className="sop_results">

          <div className="sop_results__icon">
            <img src={buscarpecas} alt="" />
          </div>

          <h2>
            Status dos Serviços
          </h2>

          <div className="sop_back" style={{cursor:"pointer"}} onClick={()=> setMostrarResultado(false)}>
          Voltar
          </div>


          {orcamento.map((servico, index) => {
            const nomeCliente = resultadoBusca?.clienteVeiculo?.nomeCliente || "Cliente"
            const placaVeiculo = resultadoBusca?.veiculo?.placa || "—"
            const statusAtual = getStatusAtual(servico)
            const acaoAtual = acaoSelecionadaPorServico[servico.id] || ""

            return (
              <article className="sop_budget" key={servico?.id || `${placaVeiculo}-${index}`}>
                <div className="sop_budget__info">
                  <strong>
                    #{String(servico?.id || index + 1).slice(0, 4)} - {nomeCliente}
                  </strong>

                  <span>
                    {placaVeiculo}
                  </span>
                </div>

                <div className="sop_status-group">
                  <span>{statusTexto[statusAtual] || statusTexto.ABERTO}</span>
                  <span className={`sop_status-dot sop_status-dot--${statusAtual}`} />
                </div>

                <button
                  type="button"
                  className="sop_view"
                  onClick={() => abrirModalVisualizacao(servico)}
                >
                  Visualizar
                </button>

                {statusAtual === "aberto" && (
                  <select
                    className="sop_status-select"
                    value={acaoAtual}
                    onChange={(event) => selecionarStatus(event, servico.id)}
                  >
                    <option value="" disabled>
                      Status
                    </option>

                    <option value="FINALIZADO">
                      Finalizar orçamento
                    </option>

                    <option value="CANCELADO">
                      Cancelar orçamento
                    </option>
                  </select>
                )}
              </article>
            )
          })}
          

        </section>

        

      )}

      {modalVisualizar && servicoSelecionado && (() => {
        const dadosCliente = getDadosCliente(servicoSelecionado)

        return (
          <div className="sop_modal_overlay">

            <div className="sop_modal sop_modal_visualizar">

              <div className="sop_modal_icon">
                i
              </div>

              <h2>
                Dados do serviço
              </h2>

              <div className="sop_modal_visualizar__info">
                <div>
                  <span>Cliente</span>
                  <strong>{dadosCliente.nome}</strong>
                  <small>{dadosCliente.email}</small>
                  <small>{dadosCliente.telefone}</small>
                </div>

              <div>
                <span>Placa</span>
                <strong>{resultadoBusca?.veiculo?.placa || "—"}</strong>
              </div>

              <div>
                <span>Problema</span>
                <strong>{servicoSelecionado.descricaoProblema || "—"}</strong>
              </div>

              <div>
                <span>Data de entrada</span>
                <strong>
                  {servicoSelecionado.dataEntrada
                    ? new Date(servicoSelecionado.dataEntrada).toLocaleString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "—"}
                </strong>
              </div>

                {String(servicoSelecionado.status || "").toUpperCase() === "CANCELADO" && (
                  <div>
                    <span>Motivo do cancelamento</span>
                    <strong>
                      {motivosCancelamentoTexto[servicoSelecionado.motivoCancelamento] ||
                      servicoSelecionado.motivoCancelamento ||
                      "Não informado"}
                    </strong>
                  </div>
                )}
              </div>

              <div className="sop_modal_actions">
                <button
                  className="sop_modal_btn sop_modal_btn_secundario"
                  onClick={fecharModalVisualizacao}
                >
                  Fechar
                </button>
              </div>

            </div>

          </div>
        )
      })()}

      {modalAprovarId && (() => {
        const servicoAtual = orcamento.find((servico) => servico.id === modalAprovarId)
        return servicoAtual
      })() && (

        <div className="sop_modal_overlay">

          <div className="sop_modal">

            <div className="sop_modal_icon">
              ✓
            </div>

            <h2>
              Aprovar Serviço?
            </h2>

            <p className="sop_modal_subtitle">
              Confirme a alteração do status
            </p>

            <div className="sop_modal_cliente">
              {(() => {
                const servicoAtual = orcamento.find((servico) => servico.id === modalAprovarId)
                const nomeCliente = resultadoBusca?.clienteVeiculo?.nomeCliente || "Cliente"
                const placaVeiculo = resultadoBusca?.veiculo?.placa || "—"
                const codigoServico = String(servicoAtual?.id || "#0000").slice(0, 4)
                const problema = servicoAtual?.descricaoProblema || "—"

                return (
                  <>
                    <div>
                      <span>Cliente</span>
                      <strong>{nomeCliente}</strong>
                    </div>

                    <div>
                      <span>Serviço</span>
                      <strong>#{codigoServico}</strong>
                    </div>

                    <div>
                      <span>Placa</span>
                      <strong>{placaVeiculo}</strong>
                    </div>

                    <div>
                      <span>Problema</span>
                      <strong>{problema}</strong>
                    </div>
                  </>
                )
              })()}

            </div>

            <div className="sop_modal_aviso">
              Ao confirmar, o serviço será marcado como aprovado.
            </div>

            <div className="sop_modal_actions">

              <button
                className="sop_modal_btn sop_modal_btn_secundario"
                onClick={() => fecharModalAprovar(modalAprovarId)}
              >
                Voltar
              </button>

              <button
                className="sop_modal_btn sop_modal_btn_confirmar"
                onClick={() => confirmarAprovacao(modalAprovarId)}
              >
                Confirmar aprovação
              </button>

            </div>

          </div>

        </div>

      )}

      {modalCancelarId && orcamento.find((servico) => servico.id === modalCancelarId) && (

        <div className="sop_modal_overlay">

          <div className="sop_modal">

            <div className="sop_modal_icon sop_modal_icon_cancelar">
              ×
            </div>

            <h2>
              Cancelar Serviço?
            </h2>

            <p className="sop_modal_subtitle">
              Informe o motivo do cancelamento
            </p>

            <div className="sop_motivos">

              <button
                className={`sop_motivo_btn ${
                  motivoCancelamento === "cliente-desistiu"
                    ? "selecionado"
                    : ""
                }`}
                onClick={() =>
                  setMotivoCancelamento("cliente-desistiu")
                }
              >
                Cliente desistiu
              </button>

              <button
                className={`sop_motivo_btn ${
                  motivoCancelamento === "demora-peca"
                    ? "selecionado"
                    : ""
                }`}
                onClick={() =>
                  setMotivoCancelamento("demora-peca")
                }
              >
                Demora na peça
              </button>

              <button
                className={`sop_motivo_btn ${
                  motivoCancelamento === "preco-alto"
                    ? "selecionado"
                    : ""
                }`}
                onClick={() =>
                  setMotivoCancelamento("preco-alto")
                }
              >
                Preço alto
              </button>

              <button
                className={`sop_motivo_btn ${
                  motivoCancelamento === "outros"
                    ? "selecionado"
                    : ""
                }`}
                onClick={() =>
                  setMotivoCancelamento("outros")
                }
              >
                Outros
              </button>

            </div>

            <div className="sop_modal_actions">

              <button
                className="sop_modal_btn sop_modal_btn_secundario"
                onClick={() => fecharModalCancelar(modalCancelarId)}
              >
                Voltar
              </button>

              <button
                className="sop_modal_btn sop_modal_btn_cancelar"
                onClick={() => confirmarCancelamento(modalCancelarId)}
                disabled={!motivoCancelamento}
              >
                Confirmar cancelamento
              </button>

            </div>

          </div>

        </div>

      )}

    </main>
  )
}

export default StatusOrcamentoPage
