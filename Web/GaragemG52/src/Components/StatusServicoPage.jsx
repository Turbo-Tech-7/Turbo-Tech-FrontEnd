import { useState } from "react"
import { Link } from "react-router-dom"
import buscarpecas from "../assets/buscarpecas.png"
import "./css/StatusServicoPage.css"

const StatusServicoPage = () => {
  const [placa, setPlaca] = useState("")
  const [telefone, setTelefone] = useState("")
  const [numero, setNumero] = useState("")
  const [mostrarResultado, setMostrarResultado] = useState(false)
  const [status, setStatus] = useState("em-andamento")
  const [acaoSelecionada, setAcaoSelecionada] = useState("")
  const [modalFinalizar, setModalFinalizar] = useState(false)
  const [modalCancelar, setModalCancelar] = useState(false)
  const [motivoCancelamento, setMotivoCancelamento] = useState("")

  const buscarServico = (event) => {
    event.preventDefault()
    setMostrarResultado(true)
  }

  const statusTexto = {
    "em-andamento": "Em andamento",
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
    <main className="ssp_page">

      <header className="ssp_top-bar">

        <div className="ssp_top-bar__title">

          <div className="ssp_top-bar__icon">
            <img src={buscarpecas} alt="" />
          </div>

          <div>
            <h1>Status dos Serviços</h1>
            <p>Busque um serviço e atualize seu status</p>
          </div>

        </div>

        <Link to="/status" className="ssp_back">
          Voltar
        </Link>

      </header>

      {!mostrarResultado ? (

        <section className="ssp_card">

          <div className="ssp_card__icon">
            <img src={buscarpecas} alt="" />
          </div>

          <div className="ssp_card__header">
            <h2>Buscar Serviço</h2>
            <p>Preencha pelo menos um campo</p>
          </div>

          <form
            className="ssp_form"
            onSubmit={buscarServico}
          >

            <label htmlFor="servico-placa">
              Placa do veículo
            </label>

            <input
              id="servico-placa"
              value={placa}
              onChange={(event) =>
                setPlaca(event.target.value.toUpperCase())
              }
              placeholder="ABC-1234"
            />

            <label htmlFor="servico-telefone">
              Telefone
            </label>

            <input
              id="servico-telefone"
              value={telefone}
              onChange={(event) =>
                setTelefone(event.target.value)
              }
              placeholder="(XX) X XXXX-XXXX"
            />

            <label htmlFor="servico-numero">
              Número do serviço
            </label>

            <input
              id="servico-numero"
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

        <section className="ssp_results">

          <div className="ssp_results__icon">
            <img src={buscarpecas} alt="" />
          </div>

          <h2>
            Status dos Serviços
          </h2>

          <div className="ssp_status">

            <span>
              Situação: {statusTexto[status]}
            </span>

            <span
              className={`ssp_status-dot ssp_status-dot--${status}`}
            />

          </div>

          <article className="ssp_service">

            <div className="ssp_service__info">

              <strong>
                #0001 - João Silva
              </strong>

              <span>
                ABC-1234
              </span>

            </div>

            <Link
              className="ssp_view"
              to="/visualizar-orcamento"
            >
              Visualizar
            </Link>

            {status === "em-andamento" && (
              <select
                className="ssp_status-select"
                value={acaoSelecionada}
                onChange={selecionarStatus}
              >

                <option value="" disabled>
                  Status
                </option>

                <option value="finalizado">
                  Finalizar serviço
                </option>

                <option value="cancelado">
                  Cancelar serviço
                </option>

              </select>
            )}

          </article>

        </section>

      )}

      {modalFinalizar && (

        <div className="ssp_modal_overlay">

          <div className="ssp_modal">

            <div className="ssp_modal_icon">
              ✓
            </div>

            <h2>
              Finalizar serviço?
            </h2>

            <p className="ssp_modal_subtitle">
              Confirme a finalização do serviço
            </p>

            <div className="ssp_modal_cliente">

              <div>
                <span>Cliente</span>
                <strong>João Silva</strong>
              </div>

              <div>
                <span>E-mail</span>
                <strong>joaosilva@gmail.com</strong>
              </div>

            </div>

            <div className="ssp_modal_aviso">
              Ao confirmar, o cliente receberá um e-mail informando que o veículo está pronto para retirada.
            </div>

            <div className="ssp_modal_actions">

              <button
                className="ssp_modal_btn ssp_modal_btn_secundario"
                onClick={fecharModalFinalizar}
              >
                Voltar
              </button>

              <button
                className="ssp_modal_btn ssp_modal_btn_confirmar"
                onClick={confirmarFinalizacao}
              >
                Confirmar finalização
              </button>

            </div>

          </div>

        </div>

      )}

      {modalCancelar && (

        <div className="ssp_modal_overlay">

          <div className="ssp_modal">

            <div className="ssp_modal_icon ssp_modal_icon_cancelar">
              ×
            </div>

            <h2>
              Cancelar serviço?
            </h2>

            <p className="ssp_modal_subtitle">
              Informe o motivo do cancelamento
            </p>

            <div className="ssp_motivos">

              <button
                className={`ssp_motivo_btn ${
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
                className={`ssp_motivo_btn ${
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
                className={`ssp_motivo_btn ${
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
                className={`ssp_motivo_btn ${
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

            <div className="ssp_modal_actions">

              <button
                className="ssp_modal_btn ssp_modal_btn_secundario"
                onClick={fecharModalCancelar}
              >
                Voltar
              </button>

              <button
                className="ssp_modal_btn ssp_modal_btn_cancelar"
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

export default StatusServicoPage
