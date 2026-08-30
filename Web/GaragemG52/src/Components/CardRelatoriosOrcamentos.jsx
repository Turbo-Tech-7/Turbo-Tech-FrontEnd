import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import relatorios from "../assets/relatorios.png"
import { useFetch } from "../hooks/useFetch"

import {
  PieChart,
  Pie,
  ResponsiveContainer,
  Tooltip,
} from "recharts"

import "./css/CardRelatoriosOrcamentos.css"
import { getApiBaseUrl } from "../config/api"

const BASE_URL = getApiBaseUrl()

const COLORS_STATUS       = ["#4361EE", "#22C55E", "#FF4D4D"]
const COLORS_CANCELAMENTO = ["#F59E0B", "#EF4444", "#8B5CF6", "#6B7280"]

const FILTRO_MAP = {
  mes: "mes",
  ano: "ano",
}

const fmt = (n) => Number(n ?? 0).toLocaleString("pt-BR")

const CardRelatoriosOrcamentos = () => {
  const [filtro, setFiltro] = useState("mes")
  const { httpConfig, loading, error } = useFetch(BASE_URL)

  const [totais, setTotais] = useState({
    totalOrcamentos: 0,
    totalCancelados: 0,
    totalConcluidos: 0,
    totalAbertos: 0,
  })
  const [statusData, setStatusData]       = useState([])
  const [cancelamentoData, setCancelamentoData] = useState([])

  const carregarDados = async (f) => {
    const { data } = await httpConfig("GET", "dashboard/orcamentos", null, {
      filtro: FILTRO_MAP[f],
    })

    if (!data) return

    setTotais({
      totalOrcamentos: data.totalOrcamentos,
      totalCancelados: data.totalCancelados,
      totalConcluidos: data.totalConcluidos,
      totalAbertos:    data.totalAbertos,
    })

    // statusOrcamentos → [{ status, quantidade }]
    if (data.statusOrcamentos?.length) {
      setStatusData(
        data.statusOrcamentos.map((s, i) => ({
          name:  s.status,
          value: s.quantidade,
          fill:  COLORS_STATUS[i % COLORS_STATUS.length],
        }))
      )
    }

    // motivosCancelamentos → [{ motivo, quantidade }]
    if (data.motivosCancelamentos?.length) {
      setCancelamentoData(
        data.motivosCancelamentos.map((m, i) => ({
          name:  m.motivo,
          value: m.quantidade,
          fill:  COLORS_CANCELAMENTO[i % COLORS_CANCELAMENTO.length],
        }))
      )
    }
  }

  useEffect(() => {
    // O efeito dispara a busca inicial e a atualização do filtro.
    carregarDados(filtro)
    // A função de busca usa o cliente HTTP do hook e não deve recriar este efeito.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtro])

  const handleFiltroChange = (e) => {
    const val = e.target.value === "Último ano" ? "ano" : "mes"
    setFiltro(val)
  }

  return (
    <div className="cro_container">

      <div className="cro_top_bar">
        <div className="cro_top_left">
          <img src={relatorios} className="cro_top_icon" alt="" />
          <div>
            <h3>Relatório de orçamentos</h3>
            <p>Acompanhe seus orçamentos</p>
          </div>
        </div>
        <Link to="/home" className="cro_link">Voltar</Link>
      </div>

      <div className="cro_nav">
        <div className="cro_nav_links">
          <Link to="/relatorio-financeiro" className="cro_nav_item">Financeiro</Link>
          <span className="active">Orçamentos</span>
          <span>Peças</span>
          <span>Clientes</span>
        </div>

        <select className="cro_select" onChange={handleFiltroChange}>
          <option>Este mês</option>
          <option>Último ano</option>
        </select>
      </div>

      {loading && (
        <div className="cro_feedback cro_loading">
          <span className="cro_spinner" /> Carregando dados...
        </div>
      )}

      {error && !loading && (
        <div className="cro_feedback cro_error">
          Não foi possível carregar os dados. Tente novamente.
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="cro_cards">
            <div className="cro_card_small">
              <div className="cro_card_icon">📄</div>
              <span>Total de orçamentos</span>
              <strong>{fmt(totais.totalOrcamentos)}</strong>
            </div>

            <div className="cro_card_small">
              <div className="cro_card_icon cancel">❌</div>
              <span>Total Cancelado</span>
              <strong>{fmt(totais.totalCancelados)}</strong>
            </div>

            <div className="cro_card_small">
              <div className="cro_card_icon success">✔</div>
              <span>Orçamentos Concluídos</span>
              <strong>{fmt(totais.totalConcluidos)}</strong>
            </div>

            <div className="cro_card_small">
              <div className="cro_card_icon open">⏳</div>
              <span>Orçamentos Abertos</span>
              <strong>{fmt(totais.totalAbertos)}</strong>
            </div>
          </div>

          <div className="cro_graphs">

            <div className="cro_graph_card">
              <h4>Status dos Orçamentos</h4>
              <div className="cro_graph_content">
                <div className="cro_chart">
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={statusData} dataKey="value" outerRadius={80} />
                      <Tooltip formatter={(v) => fmt(v)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="cro_legenda">
                  {statusData.map((entry, index) => (
                    <div key={index}>
                      <span
                        className="cro_dot"
                        style={{ background: COLORS_STATUS[index % COLORS_STATUS.length] }}
                      />
                      <p>{entry.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="cro_graph_card">
              <h4>Motivos cancelamentos</h4>
              <div className="cro_graph_content">
                <div className="cro_chart">
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={cancelamentoData} dataKey="value" outerRadius={80} />
                      <Tooltip formatter={(v) => fmt(v)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="cro_legenda">
                  {cancelamentoData.map((entry, index) => (
                    <div key={index}>
                      <span
                        className="cro_dot"
                        style={{ background: COLORS_CANCELAMENTO[index % COLORS_CANCELAMENTO.length] }}
                      />
                      <p>{entry.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </>
      )}

    </div>
  )
}

export default CardRelatoriosOrcamentos