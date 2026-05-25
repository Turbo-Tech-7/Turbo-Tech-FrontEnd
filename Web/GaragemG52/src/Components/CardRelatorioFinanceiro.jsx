import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts"

import { Link } from "react-router-dom"
import criardoc from "../assets/criardoc.png"
import "./css/CardRelatorioFinanceiro.css"
import relatorios from "../assets/relatorios.png"


const faturamentoData = [
  { name: "Jan", valor: 4000 },
  { name: "Fev", valor: 3000 },
  { name: "Mar", valor: 5000 },
  { name: "Abr", valor: 7000 },
]

const evolucaoData = [
  { name: "1", valor: 2000 },
  { name: "2", valor: 4500 },
  { name: "3", valor: 3000 },
  { name: "4", valor: 5200 },
  { name: "5", valor: 1000 },
]

const CardRelatorioFinanceiro = () => {
  return (
    <div className="crf_container">

      <div className="crf_top_bar">

        <div className="crf_top_left">
          <img src={relatorios} className="crf_icon" />

          <div>
            <h3>Relatório Financeiro</h3>
            <p>Acompanhe o faturamento e cancelamento</p>
          </div>
        </div>

        <Link to="/home" className="crf_link">
          Voltar
        </Link>

      </div>

      <div className="crf_navbar">

        <div className="crf_tabs">

          <button className="active">
            Financeiro
          </button>

          <Link
            to="/relatorio-orcamentos"
            className="crf_tab_link"
          >
            <button>
              Orçamentos
            </button>
          </Link>

          <button>
            Peças
          </button>

          <button>
            Clientes
          </button>

        </div>

        <select className="crf_select">
          <option>Este mês</option>
          <option>Últimos 3 meses</option>
          <option>Último ano</option>
        </select>

      </div>

      <div className="crf_cards">

        <div className="crf_info_card">
          <div className="crf_card_icon">💰</div>

          <div>
            <span>Faturamento Total</span>
            <br />
            <strong>R$ 87.650,00</strong>
          </div>
        </div>

        <div className="crf_info_card">
          <div className="crf_card_icon">✖</div>

          <div>
            <span>Total Cancelado</span>
            <br />
            <strong>R$ 2.650,00</strong>
          </div>
        </div>

        <div className="crf_info_card">
          <div className="crf_card_icon">📈</div>

          <div>
            <span>Faturamento Líquido</span>
            <br />
            <strong>R$ 67.650,00</strong>
          </div>
        </div>

      </div>

      <div className="crf_graphs">

        <div className="crf_graph_box">

          <h4>Faturamento vs cancelamento</h4>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={faturamentoData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />

              <Bar
                dataKey="valor"
                fill="#4361EE"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>

          <div className="crf_legend">

            <div className="crf_legend_item">
              <span
                className="crf_color"
                style={{ background: "#4361EE" }}
              ></span>

              <p>Faturamento mensal</p>
            </div>

          </div>

        </div>

        <div className="crf_graph_box">

          <h4>Evolução do Faturamento</h4>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={evolucaoData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />

              <Line
                type="monotone"
                dataKey="valor"
                stroke="#10B981"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>

          <div className="crf_legend">

            <div className="crf_legend_item">
              <span
                className="crf_color"
                style={{ background: "#10B981" }}
              ></span>

              <p>Crescimento do faturamento</p>
            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

export default CardRelatorioFinanceiro