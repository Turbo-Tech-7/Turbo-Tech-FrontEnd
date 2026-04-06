//Componentes
import Forms from "../Components/forms"

//Style
import "./CSS/Cadastro.css"

const Cadastro = () => {
  return (
    <div className="login_container">

      <div className="login_card cadastro_card">

        <div className="login_header">
          <div className="icon_user">
            {/* pode colocar imagem depois */}
          </div>

          <h2>Criar Conta</h2>
          <p>Preencha os dados para cadastrar</p>
        </div>

        <Forms ambiente="cadastro"/>

      </div>

    </div>
  )
}

export default Cadastro