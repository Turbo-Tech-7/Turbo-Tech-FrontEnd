import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import BuscarOrcamentosImg from "../assets/BuscarOrcamentos.png"
import { useFetch } from "../hooks/useFetch"
import "./css/BuscarOrcamentosPage.css"

const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080"

const STATUS_OPCOES = [
  { value: "", label: "Todos os status" },
  { value: "ABERTO", label: "Aberto" },
  { value: "FINALIZADO", label: "Finalizado" },
  { value: "CANCELADO", label: "Cancelado" },
]

const BuscarOrcamentosPage = () => {
  const { httpConfig, loading } = useFetch(BASE_URL)

  const navigate = useNavigate()

  const [status, setStatus] = useState("")

  const buscar = async () => {
    let res = null

    if (status) {
      res = await httpConfig(
        "GET",
        "orcamentos/por-status",
        null,
        { status }
      )
    }

    else {
      res = await httpConfig("GET", "orcamentos")
    }

    navigate("/lista-orcamentos", {
      state: {
        resultados: res?.data || [],
        filtro: status
          ? `Status: ${status}`
          : "Todos os Orçamentos",
      },
    })
  }

  return (
    <div className="bop_container">
      <div className="bop_top_bar">
        <div className="bop_top_left">
          <div className="bop_top_icon">
            <img
              src={BuscarOrcamentosImg}
              alt="Buscar Orçamentos"
            />
          </div>

          <div>
            <h3>Buscar Orçamentos</h3>
            <p>Consultar orçamentos existentes</p>
          </div>
        </div>

        <Link to="/home" className="bop_link">
          Voltar
        </Link>
      </div>

      <div className="bop_card">
        <div className="bop_card_icon">
          <img src={BuscarOrcamentosImg} alt="ícone" />
        </div>

        <div className="bop_card_header">
          <h2>Buscar Orçamentos</h2>
          <p>Selecione um status ou liste todos</p>
        </div>

        <div className="bop_form">
          <div className="bop_field">
            <label>Status do Orçamento</label>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {STATUS_OPCOES.map((op) => (
                <option key={op.value} value={op.value}>
                  {op.label}
                </option>
              ))}
            </select>
          </div>

          <button
            className="bop_btn"
            onClick={buscar}
            disabled={loading}
          >
            {loading ? "Buscando..." : "Realizar Busca"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default BuscarOrcamentosPage