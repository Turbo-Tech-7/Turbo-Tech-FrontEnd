import { useEffect, useState } from "react"
import {
BarChart,
Bar,
XAxis,
YAxis,
CartesianGrid,
Tooltip,
ResponsiveContainer,
LineChart,
Line,
Legend,
} from "recharts"
import { Link } from "react-router-dom"
import { useFetch } from "../hooks/useFetch"
import relatorios from "../assets/relatorios.png"
import "./css/CardRelatorioFinanceiro.css"

import { getApiBaseUrl } from "../config/api"

const BASE_URL = getApiBaseUrl()

const FILTRO_OPTIONS = [
{ label: "Hoje", value: "DIA" },
{ label: "Este mês", value: "MES" },
{ label: "Este ano", value: "ANO" },
]

const formatCurrency = (value) =>
value != null
? value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
: "R$ —"

const CardRelatorioFinanceiro = () => {
const { httpConfig, loading, error } = useFetch(BASE_URL)

const [filtro, setFiltro] = useState("MES")
const [relatorio, setRelatorio] = useState(null)

const fetchRelatorio = async (filtroSelecionado) => {
const { data } = await httpConfig(
"GET",
"dashboard/relatorio-financeiro",
null,
{ filtro: filtroSelecionado }
)
if (data) setRelatorio(data)
}

useEffect(() => {
// O efeito dispara a busca inicial e a atualização do filtro.
fetchRelatorio(filtro)
// A função de busca usa o cliente HTTP do hook e não deve recriar este efeito.
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [filtro])

const faturamentoVsCancelamentoData = (relatorio?.faturamentoVsCancelamento ?? []).map((item) => ({
name: item.periodo,
Faturamento: item.faturamento ?? 0,
Cancelado: item.cancelado ?? 0,
}))

const evolucaoData = (relatorio?.evolucaoFaturamento ?? []).map((item) => ({
name: item.periodo,
valor: item.valor ?? 0,
}))

return (
<div className="crf_container">

<div className="crf_top_bar">
<div className="crf_top_left">
<img src={relatorios} className="crf_icon" alt="Relatórios" />
<div>
<h3>Relatório Financeiro</h3>
<p>Acompanhe o faturamento e cancelamento</p>
</div>
</div>
<Link to="/home" className="crf_link">Voltar</Link>
</div>

<div className="crf_navbar">
<div className="crf_tabs">
<button className="active">Financeiro</button>

<Link to="/relatorio-orcamentos" className="crf_tab_link">
<button>Orçamentos</button>
</Link>

<button>Peças</button>
<button>Clientes</button>
</div>

<select
className="crf_select"
value={filtro}
onChange={(e) => setFiltro(e.target.value)}
>
{FILTRO_OPTIONS.map((opt) => (
<option key={opt.value} value={opt.value}>
{opt.label}
</option>
))}
</select>
</div>

{loading && (
<div className="crf_feedback">Carregando dados...</div>
)}

{error && !loading && (
<div className="crf_feedback crf_feedback--error">
Erro ao carregar dados: {error}
</div>
)}

{!loading && !error && (
<>
<div className="crf_cards">
<div className="crf_info_card">
<div className="crf_card_icon">💰</div>
<div>
<span>Faturamento Total</span>
<br />
<strong>{formatCurrency(relatorio?.faturamentoTotal)}</strong>
</div>
</div>

<div className="crf_info_card">
<div className="crf_card_icon">✖</div>
<div>
<span>Total Cancelado</span>
<br />
<strong>{formatCurrency(relatorio?.totalCancelado)}</strong>
</div>
</div>

<div className="crf_info_card">
<div className="crf_card_icon">📈</div>
<div>
<span>Faturamento Líquido</span>
<br />
<strong>{formatCurrency(relatorio?.faturamentoLiquido)}</strong>
</div>
</div>
</div>

<div className="crf_graphs">

<div className="crf_graph_box">
<h4>Faturamento vs Cancelamento</h4>

<ResponsiveContainer width="100%" height={250}>
<BarChart data={faturamentoVsCancelamentoData}>
<CartesianGrid strokeDasharray="3 3" />
<XAxis dataKey="name" />
<YAxis tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
<Tooltip
formatter={(value, name) => [formatCurrency(value), name]}
/>
<Legend />
<Bar dataKey="Faturamento" fill="#4361EE" radius={[6, 6, 0, 0]} />
<Bar dataKey="Cancelado" fill="#EF4444" radius={[6, 6, 0, 0]} />
</BarChart>
</ResponsiveContainer>

<div className="crf_legend">
<div className="crf_legend_item">
<span className="crf_color" style={{ background: "#4361EE" }} />
<p>Faturamento</p>
</div>
<div className="crf_legend_item">
<span className="crf_color" style={{ background: "#EF4444" }} />
<p>Cancelado</p>
</div>
</div>
</div>

<div className="crf_graph_box">
<h4>Evolução do Faturamento</h4>

<ResponsiveContainer width="100%" height={250}>
<LineChart data={evolucaoData}>
<CartesianGrid strokeDasharray="3 3" />
<XAxis dataKey="name" />
<YAxis tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
<Tooltip formatter={(value) => [formatCurrency(value), "Faturamento"]} />
<Line
type="monotone"
dataKey="valor"
stroke="#10B981"
strokeWidth={3}
dot={{ r: 4 }}
activeDot={{ r: 6 }}
/>
</LineChart>
</ResponsiveContainer>

<div className="crf_legend">
<div className="crf_legend_item">
<span className="crf_color" style={{ background: "#10B981" }} />
<p>Crescimento do faturamento</p>
</div>
</div>
</div>

</div>
</>
)}

</div>
)
}

export default CardRelatorioFinanceiro
