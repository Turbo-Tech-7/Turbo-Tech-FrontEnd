import { Link, useNavigate } from "react-router-dom"
import criardoc from "../assets/criardoc.png"
import '../Components/css/CriarOrcamento.css'
import criarOrcamentoicon from "../assets/Criarorcamento-branco.png"

const CriarOrcamentoPg1 = () => {
  const navigate = useNavigate()

  return (
    <div className="login_container">

      {/* Topo */}
      <div className="top_bar">
        <div className="top_bar_left">
          <img src={criardoc} alt="icone" className="top_icon" />
          <div>
            <h3>Criar Orçamento</h3>
            <p>Criar novo orçamento de serviço</p>
          </div>
        </div>

        <Link to="/home" className="top_bar_link">
          Voltar
        </Link>
      </div>

      {/* Card */}
      <div className="recuperar_card">

        <div className="icon_criar">
          <img  src={criarOrcamentoicon} alt="icone" />
        </div>

        <div className="login_header">
          <h2>O cliente já possui cadastro?</h2>
          <p>Selecione uma opção para continuar</p>
        </div>

        <div className="form">
          <div id="div_dados">

            <button 
              className="option_button"
              onClick={() => navigate("/criar-orcamento-cliente")}
            >
              ✔ Sim, buscar cliente
            </button>

            <button 
              className="option_button"
              onClick={() => navigate("/cadastrar-cliente")}
            >
              👤 Não, cadastrar cliente
            </button>

          </div>
        </div>

      </div>
    </div>
  )
}

export default CriarOrcamentoPg1