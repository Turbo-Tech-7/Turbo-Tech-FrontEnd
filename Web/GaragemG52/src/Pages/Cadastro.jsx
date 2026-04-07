
import Forms from "../Components/forms"
import user from "../assets/user.png"
import "./CSS/Cadastro.css"

const Cadastro = () => {
  return (
    <div className="login_cadastro">

      <div className="login_card cadastro_card">

        <div className="login_header">
          <div className="icon_user">
            <img src={user} alt="User" />

          </div>

          <h2>Criar Conta</h2>
          <p>Preencha os dados para cadastrar</p>
        </div>

        <Forms ambiente="cadastro" />

      </div>

    </div>
  )
}

export default Cadastro