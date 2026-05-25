import { Link, useLocation } from "react-router-dom"
import { useState } from "react"
import criardoc from "../assets/criardoc.png"
import "./css/CardVisualizarOrcamento.css"

const CardVisualizarOrcamento = () => {

  const location = useLocation()

  const [mostrarAviso, setMostrarAviso] = useState(false)
  const [mensagemAviso, setMensagemAviso] = useState("")

  const mostrarMensagem = (mensagem) => {
    setMensagemAviso(mensagem)
    setMostrarAviso(true)

    setTimeout(() => {
      setMostrarAviso(false)
    }, 5000)
  }

  let dadosCliente = location.state?.DadosCliente
  const [Cliente, setCliente] = useState(
    dadosCliente || {
            placa:"",
            nome:"",
            telefone:"",
            email:""
        }
  )

  return (
    <div className="cvo_container">

      <div className="cvo_top_bar">
        <div className="cvo_top_left">
          <img src={criardoc} className="cvo_icon" />

          <div>
            <h3>Visualização de Orçamento</h3>
            <p>Detalhes do orçamento</p>
          </div>
        </div>

        <Link to="/home" className="cvo_link">
          Voltar
        </Link>
      </div>

      {
        mostrarAviso && (
          <div className="cvo_alert">
            <strong>Ação realizada!</strong>
            <p>{mensagemAviso}</p>
          </div>
        )
      }

      <div className="cvo_card">

        <div className="cvo_header_card">

          <div className="cvo_header_text">
            <h2>Orçamento #0001</h2>
            <p>15 de dezembro 2025</p>
            <span>Status: Aberto</span>
          </div>

          <button className="cvo_edit">
            Editar
          </button>

        </div>

        <div className="cvo_box">

          <h4>ℹ Informações do Cliente</h4>

          <div className="cvo_row">
            <span>Placa do Veículo</span>
            <span>{Cliente.placa || ""}</span>
          </div>

          <div className="cvo_row">
            <span>Nome do Cliente</span>
            <span>{Cliente.nome || ""}</span>
          </div>

          <div className="cvo_row">
            <span>Telefone</span>
            <span>{Cliente.telefone || ""}</span>
          </div>

          <div className="cvo_row">
            <span>Email</span>
            <span>{Cliente.email || ""}</span>
          </div>

          <div className="cvo_row">
            <span>Modelo do Veículo</span>
            <span>{Cliente.modelo || ""}</span>
          </div>

        </div>

        <div className="cvo_box">

          <h4>ℹ Detalhes do Serviço</h4>

          <div className="cvo_row">
            <span>Peça/Material</span>
            <div style={{
              display: "flex",
              flexDirection: "column",
              }}>
              <span>Pastilha de freio (R$ XX,XX)</span>
              <span>Pastilha de freio (R$ XX,XX)</span>
              <span>Pastilha de freio (R$ XX,XX)</span>
              <span>Pastilha de freio (R$ XX,XX)</span>
              <span>Pastilha de freio (R$ XX,XX)</span>
              <span>Pastilha de freio (R$ XX,XX)</span>
              <span>Pastilha de freio (R$ XX,XX)</span>

            </div>
          </div>

          <div className="cvo_row">
            <span>Fornecedor</span>
            <span>Bosch</span>
          </div>

          <div className="cvo_row">
            <span>Valor da Peça(s)</span>
            <span>R$ 450,00</span>
          </div>

          <div className="cvo_row">
            <span>Valor da Mão de obra</span>
            <span>R$ 450,00</span>
          </div>

          <div className="cvo_row total">
            <span>Total:</span>
            <span>R$ 900,00</span>
          </div>

        </div>

        <div className="cvo_actions">

          <button
            className="cvo_button"
            onClick={() =>
              mostrarMensagem("O PDF do orçamento foi baixado no computador.")
            }
          >
            Gerar PDF
          </button>

          <button
            className="cvo_button"
            onClick={() =>
              mostrarMensagem("O orçamento foi enviado por email para João Silva.")
            }
          >
            Enviar para cliente
          </button>

        </div>

        <Link
          to="/cancelar-orcamento"
          className="cvo_button full"
        >
          Cancelar Orçamento
        </Link>

      </div>
    </div>
  )
}

export default CardVisualizarOrcamento