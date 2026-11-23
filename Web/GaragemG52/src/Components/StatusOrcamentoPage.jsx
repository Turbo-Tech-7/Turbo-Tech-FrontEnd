import { useState } from "react"
import { Link } from "react-router-dom"
import buscarpecas from "../assets/buscarpecas.png"
import "./css/StatusOrcamentoPage.css"
import { useBuscarServico } from "../hooks/useBuscarServico"
import { servicoService } from "../services/servicoService"
import { clienteService } from "../services/clienteService"
import { veiculoService } from "../services/veiculoService"

const TAMANHO_PAGINA = 7

const extrairLista = (resposta) => {
  const dados = resposta && Object.prototype.hasOwnProperty.call(resposta, "data")
    ? resposta.data
    : resposta
  if (Array.isArray(dados?.content)) return dados.content
  if (Array.isArray(dados)) return dados
  return dados ? [dados] : []
}

const extrairPagina = (resposta) => {
  const dados = resposta && Object.prototype.hasOwnProperty.call(resposta, "data")
    ? resposta.data
    : resposta

  return {
    content: Array.isArray(dados?.content) ? dados.content : [],
    totalPages: Number(dados?.totalPages) || 0,
  }
}

const normalizarPlaca = (valor) =>
  String(valor ?? "").replace(/[^A-Za-z0-9]/g, "").toUpperCase()

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
  const [orcamento, setOrcamentos] = useState([])
  const [servicosFiltrados, setServicosFiltrados] = useState([])
  const [paginaAtual, setPaginaAtual] = useState(0)
  const [totalPaginas, setTotalPaginas] = useState(0)
  const [paginacaoLocal, setPaginacaoLocal] = useState(false)
  const [carregandoServicos, setCarregandoServicos] = useState(false)
  const [mensagem, setMensagem] = useState("")
  const { buscarPorPlaca } = useBuscarServico()
  const servicoApi = servicoService()
  const clienteApi = clienteService()
  const veiculoApi = veiculoService()

  const enriquecerServicos = async (servicos) => {
    if (!servicos.length) return []

    const [respostaVeiculos, respostaClientes] = await Promise.all([
      veiculoApi.listar(),
      clienteApi.listarClientes(),
    ])
    const veiculos = extrairLista(respostaVeiculos)
    const clientes = extrairLista(respostaClientes)

    return servicos.map((servico) => {
      const veiculoId = servico.veiculoId ?? servico.veiculo?.id
      const veiculo = servico.veiculo ?? veiculos.find(
        (item) => String(item.id) === String(veiculoId)
      ) ?? null
      const placaServico = normalizarPlaca(
        veiculo?.placa ?? servico.placa ?? servico.placaVeiculo
      )
      const clienteVeiculo = servico.clienteVeiculo ?? servico.cliente ?? clientes.find((cliente) => {
        const mesmoCliente =
          servico.clienteVeiculoId != null &&
          String(cliente.id) === String(servico.clienteVeiculoId)
        const mesmoVeiculo =
          cliente.veiculoId != null &&
          String(cliente.veiculoId) === String(veiculoId)
        const mesmaPlaca = placaServico &&
          normalizarPlaca(cliente.placaVeiculo ?? cliente.veiculo?.placa) === placaServico

        return mesmoCliente || mesmoVeiculo || mesmaPlaca
      }) ?? null

      return { ...servico, veiculo, clienteVeiculo }
    })
  }

  const buscarOrcamento = async (event) => {
    event.preventDefault()
    setMensagem("")
    setCarregandoServicos(true)

    const placaNormalizada = normalizarPlaca(placa)
    if (placaNormalizada && placaNormalizada.length !== 7) {
      setMensagem("Informe uma placa válida ou deixe o campo em branco.")
      setCarregandoServicos(false)
      return
    }

    let servicosEncontrados = []
    const temFiltroContato = Boolean(email.trim() || normalizarTelefone(telefone))
    let usarPaginacaoLocal = Boolean(placaNormalizada || temFiltroContato)
    let paginasDaApi = 0

    try {
      if (placaNormalizada && !temFiltroContato) {
        const resultado = await buscarPorPlaca(placaNormalizada)
        servicosEncontrados = Array.isArray(resultado?.servicos)
          ? resultado.servicos.map((servico) => ({
              ...servico,
              veiculo: resultado.veiculo,
              clienteVeiculo: resultado.clienteVeiculo,
            }))
          : []
      } else {
        const respostaInicial = await servicoApi.listar(0, TAMANHO_PAGINA)
        if (respostaInicial?.error) {
          setMensagem("Não foi possível carregar os serviços.")
          setMostrarResultado(false)
          return
        }

        const paginaInicial = extrairPagina(respostaInicial)
        paginasDaApi = paginaInicial.totalPages
        let listaCompleta = paginaInicial.content

        if (temFiltroContato && paginasDaApi > 1) {
          const respostasRestantes = await Promise.all(
            Array.from({ length: paginasDaApi - 1 }, (_, index) =>
              servicoApi.listar(index + 1, TAMANHO_PAGINA)
            )
          )

          if (respostasRestantes.some((resposta) => resposta?.error)) {
            setMensagem("Não foi possível carregar todos os serviços para aplicar o filtro.")
            setMostrarResultado(false)
            return
          }

          listaCompleta = [
            ...listaCompleta,
            ...respostasRestantes.flatMap((resposta) => extrairPagina(resposta).content),
          ]
        }

        usarPaginacaoLocal = temFiltroContato || Boolean(placaNormalizada)
        servicosEncontrados = await enriquecerServicos(listaCompleta)
      }

      servicosEncontrados = filtrarServicosPorContato(servicosEncontrados, email, telefone, placa)
      if (!servicosEncontrados.length) {
        setMensagem("Nenhum serviço encontrado para os dados informados.")
        setMostrarResultado(false)
        return
      }

      setMensagem("")
      setPaginacaoLocal(usarPaginacaoLocal)
      setServicosFiltrados(servicosEncontrados)
      setPaginaAtual(0)
      setTotalPaginas(usarPaginacaoLocal
        ? Math.ceil(servicosEncontrados.length / TAMANHO_PAGINA)
        : paginasDaApi
      )
      setOrcamentos(usarPaginacaoLocal
        ? servicosEncontrados.slice(0, TAMANHO_PAGINA)
        : servicosEncontrados
      )
      setStatusPorServico(
        Object.fromEntries(servicosEncontrados.map((servico) => [servico.id, servico.status || "ABERTO"]))
      )
      setAcaoSelecionadaPorServico({})
      setModalAprovarId(null)
      setModalCancelarId(null)
      setMostrarResultado(true)
    } catch (err) {
      setMensagem(err?.message || "Não foi possível carregar os serviços.")
      setMostrarResultado(false)
    } finally {
      setCarregandoServicos(false)
    }
  }

  const mudarPagina = async (pagina) => {
    if (carregandoServicos || pagina < 0 || pagina >= totalPaginas || pagina === paginaAtual) return

    setCarregandoServicos(true)

    try {
      if (paginacaoLocal) {
        const inicio = pagina * TAMANHO_PAGINA
        setOrcamentos(servicosFiltrados.slice(inicio, inicio + TAMANHO_PAGINA))
        setPaginaAtual(pagina)
        return
      }

      const resposta = await servicoApi.listar(pagina, TAMANHO_PAGINA)
      if (resposta?.error) {
        setMensagem("Não foi possível carregar esta página de serviços.")
        return
      }

      const servicosPagina = await enriquecerServicos(extrairPagina(resposta).content)
      setOrcamentos(servicosPagina)
      setServicosFiltrados(servicosPagina)
      setPaginaAtual(pagina)
      setStatusPorServico((anterior) => ({
        ...anterior,
        ...Object.fromEntries(servicosPagina.map((servico) => [servico.id, servico.status || "ABERTO"])),
      }))
    } catch (err) {
      setMensagem(err?.message || "Não foi possível carregar esta página de serviços.")
    } finally {
      setCarregandoServicos(false)
    }
  }

  const paginasVisiveis = totalPaginas <= 5
    ? Array.from({ length: totalPaginas }, (_, index) => index)
    : paginaAtual < 3
      ? [...Array.from({ length: 5 }, (_, index) => index), " reticencias "]
      : paginaAtual >= totalPaginas - 3
        ? [" reticencias ", ...Array.from({ length: 5 }, (_, index) => totalPaginas - 5 + index)]
        : [0, " reticencias-inicio ", paginaAtual - 1, paginaAtual, paginaAtual + 1, " reticencias-fim ", totalPaginas - 1]

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

  const filtrarServicosPorContato = (servicos, emailInput, telefoneInput, placaInput) => {
    const temEmail = normalizarEmail(emailInput).length > 0
    const temTelefone = normalizarTelefone(telefoneInput).length > 0

    return servicos.filter((servico) => {
      const cliente = servico.clienteVeiculo ?? servico.cliente ?? {}
      const emailCliente = normalizarEmail(
        cliente.email ?? cliente.emailCliente ?? cliente.emailUsuario ?? servico.email
      )
      const telefoneCliente = normalizarTelefone(
        cliente.telefone ?? cliente.telefoneCliente ?? cliente.telefoneUsuario ?? servico.telefone
      )
      const placaServico = normalizarPlaca(
        servico.veiculo?.placa ?? servico.placa ?? servico.placaVeiculo
      )

      return (!temEmail || emailCliente === normalizarEmail(emailInput)) &&
        (!temTelefone || telefoneCliente === normalizarTelefone(telefoneInput)) &&
        (!normalizarPlaca(placaInput) || placaServico === normalizarPlaca(placaInput))
    })
  }

  const getDadosCliente = (servico = null) => {
    const cliente =
      servico?.clienteVeiculo ??
      servico?.cliente ??
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
    setAcaoSelecionadaPorServico((prev) => ({
      ...prev,
      [servicoId]: "",
    }))
  }

  const confirmarCancelamento = async (servicoId) => {
    try {
      const resposta = await servicoApi.atualizarStatus(servicoId, "CANCELADO")

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
            <p>Todos os campos são opcionais. Sem filtros, serão exibidos todos os serviços.</p>
          </div>

          <form
            className="sop_form"
            onSubmit={buscarOrcamento}
          >

            <label htmlFor="placa">
              Placa do veículo
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

            <button type="submit" disabled={carregandoServicos}>
              {carregandoServicos ? "Buscando..." : "Realizar procura"}
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

          {carregandoServicos && <p className="sop_pagination__loading">Carregando serviços...</p>}

          <div className="sop_results__list">
            {orcamento.map((servico, index) => {
              const cliente = servico.clienteVeiculo ?? servico.cliente ?? {}
              const nomeCliente = cliente.nomeCliente || cliente.nome || "Cliente"
              const placaVeiculo = servico.veiculo?.placa || servico.placa || servico.placaVeiculo || "—"
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
          </div>

          {totalPaginas > 1 && (
            <nav className="sop_pagination" aria-label="Paginação dos serviços">
              <button
                type="button"
                className="sop_pagination__step"
                onClick={() => mudarPagina(paginaAtual - 1)}
                disabled={paginaAtual === 0 || carregandoServicos}
                aria-label="Página anterior"
                title="Página anterior"
              >
                ‹
              </button>

              {paginasVisiveis.map((pagina, index) => (
                typeof pagina === "string"
                  ? <span className="sop_pagination__ellipsis" key={`${pagina}-${index}`}>…</span>
                  : <button
                      type="button"
                      className={`sop_pagination__number ${pagina === paginaAtual ? "is-active" : ""}`}
                      key={pagina}
                      onClick={() => mudarPagina(pagina)}
                      disabled={carregandoServicos}
                      aria-current={pagina === paginaAtual ? "page" : undefined}
                      aria-label={`Página ${pagina + 1}`}
                    >
                      {pagina + 1}
                    </button>
              ))}

              <button
                type="button"
                className="sop_pagination__step"
                onClick={() => mudarPagina(paginaAtual + 1)}
                disabled={paginaAtual >= totalPaginas - 1 || carregandoServicos}
                aria-label="Próxima página"
                title="Próxima página"
              >
                ›
              </button>
            </nav>
          )}

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
                <strong>
                  {servicoSelecionado.veiculo?.placa ||
                    servicoSelecionado.placa ||
                    servicoSelecionado.placaVeiculo ||
                    "—"}
                </strong>
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
                const cliente = servicoAtual?.clienteVeiculo ?? servicoAtual?.cliente ?? {}
                const nomeCliente = cliente.nomeCliente || cliente.nome || "Cliente"
                const placaVeiculo = servicoAtual?.veiculo?.placa ||
                  servicoAtual?.placa ||
                  servicoAtual?.placaVeiculo ||
                  "—"
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
        (() => {
          const servicoAtual = orcamento.find((servico) => servico.id === modalCancelarId)
          const cliente = servicoAtual?.clienteVeiculo ?? servicoAtual?.cliente ?? {}
          const nomeCliente = cliente.nomeCliente || cliente.nome || "Cliente"
          const placaVeiculo = servicoAtual?.veiculo?.placa ||
            servicoAtual?.placa ||
            servicoAtual?.placaVeiculo ||
            "—"
          const codigoServico = String(servicoAtual?.id || "#0000").slice(0, 4)
          const problema = servicoAtual?.descricaoProblema || "—"

          return (
            <div className="sop_modal_overlay">

          <div className="sop_modal">

            <div className="sop_modal_icon sop_modal_icon_cancelar">
              ×
            </div>

            <h2>
              Cancelar Serviço?
            </h2>

            <p className="sop_modal_subtitle">
              Confirme o cancelamento deste serviço
            </p>

            <div className="sop_modal_cliente">
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
            </div>

            <div className="sop_modal_aviso">
              Ao confirmar, o serviço será marcado como cancelado.
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
              >
                Confirmar cancelamento
              </button>

            </div>

          </div>

            </div>
          )
          }
        )()

      )}

    </main>
  )
}

export default StatusOrcamentoPage
