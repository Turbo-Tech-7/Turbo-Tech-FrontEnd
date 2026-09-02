import { useState } from "react"
import { Link } from "react-router-dom"
import buscarpecas from "../assets/buscarpecas.png"
import "./css/StatusOrcamentoPage.css"

const StatusOrcamentoPage = () => {
  const [placa, setPlaca] = useState("")
  const [telefone, setTelefone] = useState("")
  const [numero, setNumero] = useState("")
  const [mostrarResultado, setMostrarResultado] = useState(false)

  const [status, setStatus] = useState("aberto")
  const [acaoSelecionada, setAcaoSelecionada] = useState("")
  const [modalFinalizar, setModalFinalizar] = useState(false)
  const [modalCancelar, setModalCancelar] = useState(false)
  const [motivoCancelamento, setMotivoCancelamento] = useState("")

  const buscarOrcamento = (event) => {
    event.preventDefault()
    setMostrarResultado(true)
  }

  const statusTexto = {
    aberto: "Aberto",
    finalizado: "Finalizado",
    cancelado: "Cancelado"
  }

  const selecionarStatus = (event) => {
    const valor = event.target.value

    setAcaoSelecionada(valor)

    if (valor === "finalizado") {
      setModalFinalizar(true)
    }

    if (valor === "cancelado") {
      setModalCancelar(true)
    }
  }

  const fecharModalFinalizar = () => {
    setModalFinalizar(false)
    setAcaoSelecionada("")
  }

  const confirmarFinalizacao = () => {
    setStatus("finalizado")
    setModalFinalizar(false)
    setAcaoSelecionada("")
  }

  const fecharModalCancelar = () => {
    setModalCancelar(false)
    setMotivoCancelamento("")
    setAcaoSelecionada("")
  }

  const confirmarCancelamento = () => {
    if (!motivoCancelamento) return

    setStatus("cancelado")
    setModalCancelar(false)
    setAcaoSelecionada("")
  }

  return (
    <main className="sop_page">

      <header className="sop_top-bar">

        <div className="sop_top-bar__title">

          <div className="sop_top-bar__icon">
            <img src={buscarpecas} alt="" />
          </div>

          <div>
            <h1>Status dos orçamentos</h1>
            <p>Buscar um orçamento de serviço</p>
          </div>

        </div>

        <Link to="/home" className="sop_back">
          Voltar
        </Link>

      </header>

      {!mostrarResultado ? (

        <section className="sop_card" aria-labelledby="sop-title">

          <div className="sop_card__icon">
            <img src={buscarpecas} alt="" />
          </div>

          <div className="sop_card__header">

            <h2 id="sop-title">
              Buscar Orçamento
            </h2>

            <p>
              Preencha pelo menos um campo
            </p>

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

            <label htmlFor="numero">
              Número do orçamento
            </label>

            <input
              id="numero"
              value={numero}
              onChange={(event) =>
                setNumero(event.target.value)
              }
              placeholder="0001"
            />

            <button type="submit">
              Realizar procura
            </button>

          </form>

        </section>

      ) : (

        <section
          className="sop_results"
          aria-labelledby="sop-results-title"
        >

          <div className="sop_results__icon">
            <img src={buscarpecas} alt="" />
          </div>

          <h2 id="sop-results-title">
            Status dos orçamentos
          </h2>

          <div className="sop_status">

            <span>
              Situação: {statusTexto[status]}
            </span>

            <span
              className={`sop_status-dot sop_status-dot--${status}`}
            />

          </div>

          <article className="sop_budget">

            <div className="sop_budget__info">

              <strong>
                #0001 - João Silva
              </strong>

              <span>
                ABC-1234
              </span>

            </div>

            <Link
              className="sop_view"
              to="/visualizar-orcamento"
            >
              Visualizar
            </Link>

            {status === "aberto" && (
              <select
                className="sop_status-select"
                value={acaoSelecionada}
                onChange={selecionarStatus}
              >

                <option value="" disabled>
                  Status
                </option>

                <option value="finalizado">
                  Finalizar orçamento
                </option>

                <option value="cancelado">
                  Cancelar orçamento
                </option>

              </select>
            )}

          </article>

        </section>

      )}

      {modalFinalizar && (

        <div className="sop_modal_overlay">

          <div className="sop_modal">

            <div className="sop_modal_icon">
              ✓
            </div>

            <h2>
              Finalizar orçamento?
            </h2>

            <p className="sop_modal_subtitle">
              Confirme a finalização do serviço
            </p>

            <div className="sop_modal_cliente">

              <div>
                <span>Cliente</span>
                <strong>João Silva</strong>
              </div>

              <div>
                <span>E-mail</span>
                <strong>joaosilva@gmail.com</strong>
              </div>

            </div>

            <div className="sop_modal_aviso">
              Ao confirmar, o cliente receberá um e-mail informando que o veículo está pronto para retirada.
            </div>

            <div className="sop_modal_actions">

              <button
                className="sop_modal_btn sop_modal_btn_secundario"
                onClick={fecharModalFinalizar}
              >
                Voltar
              </button>

              <button
                className="sop_modal_btn sop_modal_btn_confirmar"
                onClick={confirmarFinalizacao}
              >
                Confirmar finalização
              </button>

            </div>

          </div>

        </div>

      )}

      {modalCancelar && (

        <div className="sop_modal_overlay">

          <div className="sop_modal">

            <div className="sop_modal_icon sop_modal_icon_cancelar">
              ×
            </div>

            <h2>
              Cancelar orçamento?
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
                onClick={fecharModalCancelar}
              >
                Voltar
              </button>

              <button
                className="sop_modal_btn sop_modal_btn_cancelar"
                onClick={confirmarCancelamento}
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