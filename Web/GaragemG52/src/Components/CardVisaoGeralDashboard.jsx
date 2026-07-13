import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { useFetch } from "../hooks/useFetch"
import './css/CardVisaoGeralDashboard.css'
import VisaoGeralIcon from '../assets/VisaoGeral.png'

function PieChart({ data, colors }) {
  const size = 200
  const cx = size / 2
  const cy = size / 2
  const r = 78
  const innerR = 38

  const entries = Object.entries(data).filter(([, v]) => v > 0)
  const total = entries.reduce((s, [, v]) => s + v, 0)

  if (total === 0 || entries.length === 0) {
    return (
      <svg viewBox={`0 0 ${size} ${size}`} className="vg_pie_svg">
        <circle cx={cx} cy={cy} r={r} fill="#F0F0F0" />
        <circle cx={cx} cy={cy} r={innerR} fill="white" />
        <text x={cx} y={cy + 4} textAnchor="middle" fontSize="11" fill="#ccc">Sem dados</text>
      </svg>
    )
  }

  // Caso especial: apenas 1 fatia (círculo completo)
  if (entries.length === 1) {
    const [label, value] = entries[0]
    return (
      <svg viewBox={`0 0 ${size} ${size}`} className="vg_pie_svg">
        <circle cx={cx} cy={cy} r={r} fill={colors[0]} stroke="white" strokeWidth="2" />
        <circle cx={cx} cy={cy} r={innerR} fill="white" />
        <title>{label}: {value}</title>
      </svg>
    )
  }

  let startAngle = -Math.PI / 2
  const slices = entries.map(([label, value], i) => {
    const angle = (value / total) * 2 * Math.PI
    const endAngle = startAngle + angle
    const x1 = cx + r * Math.cos(startAngle)
    const y1 = cy + r * Math.sin(startAngle)
    const x2 = cx + r * Math.cos(endAngle)
    const y2 = cy + r * Math.sin(endAngle)
    const ix1 = cx + innerR * Math.cos(endAngle)
    const iy1 = cy + innerR * Math.sin(endAngle)
    const ix2 = cx + innerR * Math.cos(startAngle)
    const iy2 = cy + innerR * Math.sin(startAngle)
    const large = angle > Math.PI ? 1 : 0
    const d = `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${ix1} ${iy1} A ${innerR} ${innerR} 0 ${large} 0 ${ix2} ${iy2} Z`
    const slice = { label, value, d, color: colors[i % colors.length] }
    startAngle = endAngle
    return slice
  })

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="vg_pie_svg">
      {slices.map((s, i) => (
        <path key={i} d={s.d} fill={s.color} stroke="white" strokeWidth="2">
          <title>{s.label}: {s.value}</title>
        </path>
      ))}
    </svg>
  )
}

function LineChart({ data }) {
  const w = 860, h = 190
  const padL = 55, padR = 30, padT = 20, padB = 40

  if (!data || data.length === 0) {
    return (
      <svg viewBox={`0 0 ${w} ${h}`} className="vg_line_svg">
        <text x={w / 2} y={h / 2} textAnchor="middle" fontSize="13" fill="#ccc">Sem dados</text>
      </svg>
    )
  }

  const maxVal = Math.max(...data.map(d => d.valor), 1)
  const minVal = 0

  const xScale = i => padL + (i / (data.length - 1 || 1)) * (w - padL - padR)
  const yScale = v => padT + (1 - (v - minVal) / (maxVal - minVal)) * (h - padT - padB)

  const points = data.map((d, i) => `${xScale(i)},${yScale(d.valor)}`).join(" ")
  const fillPoints = [
    `${xScale(0)},${h - padB}`,
    ...data.map((d, i) => `${xScale(i)},${yScale(d.valor)}`),
    `${xScale(data.length - 1)},${h - padB}`
  ].join(" ")

  const ticks = 4
  const yTicks = Array.from({ length: ticks + 1 }, (_, i) =>
    minVal + (maxVal - minVal) * (i / ticks)
  )

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="vg_line_svg">
      {/* Grid lines */}
      {yTicks.map((t, i) => (
        <g key={i}>
          <line x1={padL} y1={yScale(t)} x2={w - padR} y2={yScale(t)}
            stroke="#EAEEF8" strokeWidth="1" />
          <text x={padL - 8} y={yScale(t) + 4} textAnchor="end"
            fontSize="11" fill="#bbb">
            {t >= 1000 ? `${(t / 1000).toFixed(0)}k` : t.toFixed(0)}
          </text>
        </g>
      ))}
      {/* Area fill */}
      <polygon points={fillPoints} fill="#4361EE" opacity="0.08" />
      {/* Line */}
      <polyline points={points} fill="none" stroke="#4361EE" strokeWidth="2.5"
        strokeLinejoin="round" strokeLinecap="round" />
      {/* Dots e labels */}
      {data.map((d, i) => (
        <g key={i}>
          <circle cx={xScale(i)} cy={yScale(d.valor)} r="5"
            fill="white" stroke="#4361EE" strokeWidth="2.5" />
          {(data.length <= 12 || i % Math.ceil(data.length / 12) === 0) && (
            <text x={xScale(i)} y={h - 10} textAnchor="middle"
              fontSize="10" fill="#bbb">
              {d.periodo?.slice(5) || d.periodo}
            </text>
          )}
        </g>
      ))}
    </svg>
  )
}

function Legend({ data, colors }) {
  const entries = Object.entries(data).filter(([, v]) => v > 0)
  if (entries.length === 0) return <div className="vg_legend_empty">Sem registros</div>
  return (
    <div className="vg_legend">
      {entries.map(([label, value], i) => (
        <div key={i} className="vg_legend_item">
          <span className="vg_legend_dot" style={{ background: colors[i % colors.length] }} />
          <span className="vg_legend_label">{label}</span>
          <span className="vg_legend_val">{value}</span>
        </div>
      ))}
    </div>
  )
}

const BASE_URL = "http://localhost:8080"
const STATUS_COLORS = ["#4361EE", "green", "red", "#FFD6A5", "#FFAFCC"]
const CANCEL_COLORS = ["#FF6B6B", "#FFB347", "#FFD93D", "#6BCB77", "#4D96FF"]

function CardVisaoGeralDashboard() {
  const [filtro, setFiltro] = useState("mes")
  const [filtroOpen, setFiltroOpen] = useState(false)
  const [dados, setDados] = useState(null)
  const [erro, setErro] = useState(null)
  const dropdownRef = useRef(null)

  const { httpConfig, loading } = useFetch(BASE_URL)

  const filtroLabels = { dia: "Dia", mes: "Mês", ano: "Ano" }

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setFiltroOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  useEffect(() => {
    const fetchDados = async () => {
      setErro(null)
      const resposta = await httpConfig("GET", "dashboard/visao-geral", null, { filtro })
      if (resposta.status === 200) {
        setDados(resposta.data)
      } else {
        setErro("Não foi possível carregar os dados do dashboard.")
      }
    }
    fetchDados()
  }, [filtro])

  const fmt = (val) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val ?? 0)

  return (
    <div className="vg_container">

      <div className="vg_top_bar">
        <div className="vg_top_left">
          <img src={VisaoGeralIcon} alt="ícone" className="vg_top_icon" />
          <div>
            <h3>Visão Geral</h3>
            <p>Gráficos e KPIs com métricas do sistema</p>
          </div>
        </div>
        <Link to="/home" className="vg_link">Voltar</Link>
      </div>

      <div className="vg_content">

        <div className="vg_kpi_bar">
          <div className="vg_kpi">
            <span className="vg_kpi_icon vg_kpi_icon--blue">📋</span>
            <div>
              <div className="vg_kpi_val">{loading ? "—" : dados?.orcamentosFechados ?? 0}</div>
              <div className="vg_kpi_label">Orçamentos Fechados</div>
            </div>
          </div>

          <div className="vg_kpi">
            <span className="vg_kpi_icon vg_kpi_icon--cyan">👤</span>
            <div>
              <div className="vg_kpi_val">{loading ? "—" : dados?.clientesCadastrados ?? 0}</div>
              <div className="vg_kpi_label">Clientes Cadastrados</div>
            </div>
          </div>

          <div className="vg_kpi">
            <span className="vg_kpi_icon vg_kpi_icon--green">💰</span>
            <div>
              <div className="vg_kpi_val vg_kpi_val--sm">{loading ? "—" : fmt(dados?.faturamentoTotal)}</div>
              <div className="vg_kpi_label">Faturamento</div>
            </div>
          </div>

          <div className="vg_filtro_wrap" ref={dropdownRef}>
            <button
              className="vg_filtro_btn"
              onClick={() => setFiltroOpen(o => !o)}
            >
              <span className="vg_filtro_icon">▼ Filtrar</span>
              <span className="vg_filtro_selected">{filtroLabels[filtro]}</span>
            </button>
            {filtroOpen && (
              <div className="vg_filtro_dropdown">
                {Object.entries(filtroLabels).map(([key, label]) => (
                  <button
                    key={key}
                    className={`vg_filtro_option ${filtro === key ? "active" : ""}`}
                    onClick={() => { setFiltro(key); setFiltroOpen(false) }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {erro && <div className="vg_erro">{erro}</div>}

        {loading && (
          <div className="vg_loading">
            <div className="vg_spinner" />
            <p>Carregando dados...</p>
          </div>
        )}

        {!loading && dados && (
          <>
            <div className="vg_charts_row">
              <div className="vg_chart_card">
                <div className="vg_chart_title">Status dos Orçamentos</div>
                <div className="vg_chart_body">
                  <PieChart data={dados.statusOrcamentos ?? {}} colors={STATUS_COLORS} />
                  <Legend data={dados.statusOrcamentos ?? {}} colors={STATUS_COLORS} />
                </div>
              </div>

              <div className="vg_chart_card">
                <div className="vg_chart_title">Motivos de Cancelamento</div>
                <div className="vg_chart_body">
                  <PieChart data={dados.motivosCancelamento ?? {}} colors={CANCEL_COLORS} />
                  <Legend data={dados.motivosCancelamento ?? {}} colors={CANCEL_COLORS} />
                </div>
              </div>
            </div>

            <div className="vg_chart_card vg_chart_card--wide">
              <div className="vg_chart_title">Evolução do Faturamento</div>
              <LineChart data={dados.evolucaoFaturamento ?? []} />
            </div>
          </>
        )}

      </div>
    </div>
  )
}

export default CardVisaoGeralDashboard