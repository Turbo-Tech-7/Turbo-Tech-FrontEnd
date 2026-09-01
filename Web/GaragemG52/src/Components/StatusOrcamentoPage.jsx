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

  const buscarOrcamento = (event) => {
    event.preventDefault()
    setMostrarResultado(true)
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
        <Link to="/home" className="sop_back">Voltar</Link>
      </header>

      {!mostrarResultado ? (
        <section className="sop_card" aria-labelledby="sop-title">
        <div className="sop_card__icon">
          <img src={buscarpecas} alt="" />
        </div>
        <div className="sop_card__header">
          <h2 id="sop-title">Buscar Orçamento</h2>
          <p>Preencha pelo menos um campo</p>
        </div>

        <form className="sop_form" onSubmit={buscarOrcamento}>
          <label htmlFor="placa">Placa do veículo</label>
          <input id="placa" value={placa} onChange={(event) => setPlaca(event.target.value.toUpperCase())} placeholder="ABC-1234" />

          <label htmlFor="telefone">Telefone</label>
          <input id="telefone" value={telefone} onChange={(event) => setTelefone(event.target.value)} placeholder="(XX) X XXXX-XXXX" />

          <label htmlFor="numero">Número do orçamento</label>
          <input id="numero" value={numero} onChange={(event) => setNumero(event.target.value)} placeholder="0001" />

          <button type="submit">Realizar procura</button>
        </form>
        </section>
      ) : (
        <section className="sop_results" aria-labelledby="sop-results-title">
          <div className="sop_results__icon">
            <img src={buscarpecas} alt="" />
          </div>
          <h2 id="sop-results-title">Status dos orçamentos</h2>

          <article className="sop_budget">
            <div className="sop_budget__info">
              <strong>#0001 - João Silva</strong>
              <span>ABC-1234</span>
            </div>

            {/* A integração deve substituir este destino pelo orçamento selecionado. */}
            <a className="sop_view" href="#visualizar-orcamento">Visualizar</a>

            <select
              className="sop_status-select"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              aria-label="Status do orçamento"
            >
              <option value="aberto">Aberto</option>
              <option value="fechado">Fechado</option>
              <option value="cancelado">Cancelado</option>
            </select>

            <span className={`sop_status-dot sop_status-dot--${status}`} aria-label={`Status: ${status}`} />
          </article>
        </section>
      )}
    </main>
  )
}

export default StatusOrcamentoPage
