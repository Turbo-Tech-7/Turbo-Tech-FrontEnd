//Componentes
import Forms from "../Components/forms"

//Style
import "./CSS/Login.css"

const Login = () => {
  return (
    <div className="login_container">

      <div className="login_card">

        <div className="login_header">
          <div className="icon_user">
            {/* <img src={userIcon} alt="User Icon" /> */}
          </div>

          <h2>Boas Vindas Usuário</h2>
          <p>Faça login para continuar</p>
        </div>

        <Forms ambiente="login"/>

      </div>

    </div>
  )
}

export default Login