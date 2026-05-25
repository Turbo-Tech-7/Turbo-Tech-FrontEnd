import { Link } from "react-router-dom"
import criardoc from "../assets/criardoc.png"
import relatorios from "../assets/relatorios.png"

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip
} from "recharts"

import "./css/CardRelatoriosOrcamentos.css"

const statusData = [
  { name: "Abertos", value: 40 },
  { name: "Cancelados", value: 20 },
  { name: "Concluídos", value: 40 }
]

const cancelamentoData = [
  { name: "Demora na peça", value: 25 },
  { name: "Cliente desistiu", value: 35 },
  { name: "Preço alto", value: 20 },
  { name: "Outros", value: 20 }
]

const COLORS_STATUS = [
  "#4361EE",
  "#FF4D4D",
  "#22C55E"
]

const COLORS_CANCELAMENTO = [
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#6B7280"
]

const CardRelatoriosOrcamentos = () => {
  return (
    <div className="cro_container">

      <div className="cro_top_bar">

        <div className="cro_top_left">
          <img src={relatorios} className="cro_top_icon" />

          <div>
            <h3>Relatório de orçamentos</h3>
            <p>Acompanhe seus orçamentos</p>
          </div>
        </div>

        <Link to="/home" className="cro_link">
          Voltar
        </Link>

      </div>

      <div className="cro_nav">

        <div className="cro_nav_links">

          <Link to="/relatorio-financeiro" className="cro_nav_item">
            Financeiro
          </Link>

          <span className="active">
            Orçamentos
          </span>

          <span>Peças</span>

          <span>Clientes</span>

        </div>

        <select className="cro_select">
          <option>Este mês</option>
          <option>Últimos 3 meses</option>
          <option>Último ano</option>
        </select>

      </div>

      <div className="cro_cards">

        <div className="cro_card_small">

          <div className="cro_card_icon">
            📄
          </div>

          <span>Total de orçamentos</span>

          <strong>342</strong>
        </div>

        <div className="cro_card_small">

          <div className="cro_card_icon cancel">
            ❌
          </div>

          <span>Total Cancelado</span>

          <strong>34</strong>
        </div>

        <div className="cro_card_small">

          <div className="cro_card_icon success">
            ✔
          </div>

          <span>Orçamentos Concluídos</span>

          <strong>241</strong>
        </div>

        <div className="cro_card_small">

          <div className="cro_card_icon open">
            ⏳
          </div>

          <span>Orçamentos Abertos</span>

          <strong>67</strong>
        </div>

      </div>

      <div className="cro_graphs">

        <div className="cro_graph_card">

          <h4>Status dos Orçamentos</h4>

          <div className="cro_graph_content">

            <div className="cro_chart">

              <ResponsiveContainer width="100%" height={220}>
                <PieChart>

                  <Pie
                    data={statusData}
                    dataKey="value"
                    outerRadius={80}
                  >

                    {statusData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={COLORS_STATUS[index % COLORS_STATUS.length]}
                      />
                    ))}

                  </Pie>

                  <Tooltip />

                </PieChart>
              </ResponsiveContainer>

            </div>

            <div className="cro_legenda">

              <div>
                <span
                  className="cro_dot"
                  style={{ background: "#4361EE" }}
                ></span>

                <p>Abertos</p>
              </div>

              <div>
                <span
                  className="cro_dot"
                  style={{ background: "#FF4D4D" }}
                ></span>

                <p>Cancelados</p>
              </div>

              <div>
                <span
                  className="cro_dot"
                  style={{ background: "#22C55E" }}
                ></span>

                <p>Concluídos</p>
              </div>

            </div>

          </div>

        </div>

        <div className="cro_graph_card">

          <h4>Motivos cancelamentos</h4>

          <div className="cro_graph_content">

            <div className="cro_chart">

              <ResponsiveContainer width="100%" height={220}>
                <PieChart>

                  <Pie
                    data={cancelamentoData}
                    dataKey="value"
                    outerRadius={80}
                  >

                    {cancelamentoData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={COLORS_CANCELAMENTO[index % COLORS_CANCELAMENTO.length]}
                      />
                    ))}

                  </Pie>

                  <Tooltip />

                </PieChart>
              </ResponsiveContainer>

            </div>

            <div className="cro_legenda">

              <div>
                <span
                  className="cro_dot"
                  style={{ background: "#F59E0B" }}
                ></span>

                <p>Demora na peça</p>
              </div>

              <div>
                <span
                  className="cro_dot"
                  style={{ background: "#EF4444" }}
                ></span>

                <p>Cliente desistiu</p>
              </div>

              <div>
                <span
                  className="cro_dot"
                  style={{ background: "#8B5CF6" }}
                ></span>

                <p>Preço alto</p>
              </div>

              <div>
                <span
                  className="cro_dot"
                  style={{ background: "#6B7280" }}
                ></span>

                <p>Outros</p>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

export default CardRelatoriosOrcamentos