// CardCadastrarCliente.jsx
import { Link } from "react-router-dom"
import userIcon from "../assets/user.png"
import "./css/CardCadastrarCliente.css"
import cccazul from "../assets/ccc-azul.png"

const CardCadastrarCliente = () => {
  return (
    <div className="ccc_container">

      <div className="ccc_top_bar">
        <div className="ccc_top_left">
          <img src={cccazul} alt="" className="ccc_top_icon" />
          <div>
            <h3>Cadastrar Cliente</h3>
            <p>Criar novo cadastro de cliente</p>
          </div>
        </div>

        <Link to="/criar-orcamento" className="ccc_link">
          Voltar
        </Link>
      </div>

      <div className="ccc_card">

        <div className="ccc_icon">
          <img src={userIcon} alt="" />
        </div>

        <h2 className="ccc_title">Cadastrar Cliente</h2>

        <div className="ccc_form">

          <div className="ccc_grid">
            <div className="ccc_input_group">
              <label>Placa do Veículo</label>
              <input placeholder="Ex: ABC-1234" />
            </div>

            <div className="ccc_input_group">
              <label>Nome do Cliente</label>
              <input placeholder="Ex: João Silva" />
            </div>

            <div className="ccc_input_group">
              <label>Telefone</label>
              <input placeholder="Ex: (11)98765-4321" />
            </div>

            <div className="ccc_input_group">
              <label>Modelo do Veículo</label>
              <input placeholder="Ex: Corolla 2022" />
            </div>
          </div>

          <div className="ccc_input_group">
            <label>Email</label>
            <input placeholder="Ex: joao@gmail.com" />
          </div>

          <button className="ccc_button">
            Cadastrar Cliente
          </button>

        </div>

      </div>
    </div>
  )
}

export default CardCadastrarCliente