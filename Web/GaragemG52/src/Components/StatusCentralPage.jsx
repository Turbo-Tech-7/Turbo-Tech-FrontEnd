import { Link } from "react-router-dom"
import buscarpecas from "../assets/buscarpecas.png"
import "./css/StatusCentralPage.css"

const StatusCentralPage = () => {
  return (
    <main className="scp_page">

      <header className="scp_top-bar">

        <div className="scp_top-bar__title">

          <div className="scp_top-bar__icon">
            <img src={buscarpecas} alt="" />
          </div>

          <div>
            <h1>Gerenciar Status</h1>
            <p>Consulte e atualize orçamentos e serviços</p>
          </div>

        </div>

        <Link to="/home" className="scp_back">
          Voltar
        </Link>

      </header>

      <section className="scp_card">

        <div className="scp_card__icon">
          <img src={buscarpecas} alt="" />
        </div>

        <div className="scp_card__header">
          <h2>O que deseja consultar?</h2>
          <p>Selecione uma opção para continuar</p>
        </div>

        <div className="scp_options">

          <Link
            to="/status-orcamento"
            className="scp_option"
          >
            <div className="scp_option__icon">
              📄
            </div>

            <div className="scp_option__text">
              <strong>Status de Orçamentos</strong>
              <span>Consulte um orçamento e atualize seu status</span>
            </div>

            <div className="scp_option__arrow">
              ›
            </div>
          </Link>

          <Link
            to="/status-servico"
            className="scp_option"
          >
            <div className="scp_option__icon">
              🔧
            </div>

            <div className="scp_option__text">
              <strong>Status de Serviços</strong>
              <span>Consulte um serviço e acompanhe seu andamento</span>
            </div>

            <div className="scp_option__arrow">
              ›
            </div>
          </Link>

        </div>

      </section>

    </main>
  )
}

export default StatusCentralPage
