import { Link, useLocation, useNavigate } from "react-router-dom"
import BuscarOrcamentosImg from "../assets/BuscarOrcamentos.png"
import "./css/BuscarOrcamentosPage.css"

const formatarData = (dataStr) => {
  if (!dataStr) return ""

  try {
    return new Date(dataStr).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  } catch {
    return dataStr
  }
}

function ListaOrcamentosPage() {
  const location = useLocation()
  const navigate = useNavigate()

  const resultados = location.state?.resultados || []
  const filtro = location.state?.filtro || ""

  const abrirOrcamento = (orcamento) => {
    navigate("/visualizar-orcamento", {
      state: { Orcamento: orcamento },
    })
  }

  console.log(resultados)

  return (
    <div className="bop_container">
      <div className="bop_top_bar">
        <div className="bop_top_left">
          <div className="bop_top_icon">
            <img src={BuscarOrcamentosImg} alt="Buscar Orçamentos" />
          </div>

          <div>
            <h3>Consulta de Orçamentos</h3>
            <p>{filtro}</p>
          </div>
        </div>

        <Link to="/buscar-orcamentos" className="bop_link">
          Voltar
        </Link>
      </div>

      <div className="bop_results_card">
        <h3 className="bop_results_title">
          Orçamentos Encontrados
        </h3>

        {resultados.length === 0 && (
          <p className="bop_empty">
            Nenhum orçamento encontrado.
          </p>
        )}

        {resultados.map((o) => (
          <div
            key={o.id}
            className="bop_result_item"
            onClick={() => abrirOrcamento(o)}
          >
            <div className="bop_result_left">
              <span className="bop_result_id">
                #{String(o.id).slice(-4).padStart(4, "0")}
              </span>

              <span className="bop_result_date">
                {formatarData(o.dataOrcamento)}
              </span>
            </div>

            <div className="bop_result_right">
              <span className="bop_result_placa">
                {o.veiculo?.placa ||
                  o.clienteVeiculo?.placaVeiculo ||
                  "—"}
              </span>

              <span className="bop_result_cliente">
                {o.nomeCliente ||
                  o.clienteVeiculo?.nomeCliente ||
                  "—"}
              </span>

              <span
                className={`bop_status_badge bop_status_${o.status}`}
              >
                {o.statusDescricao || o.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ListaOrcamentosPage