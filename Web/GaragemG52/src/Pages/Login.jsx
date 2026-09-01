//Componentes
import Forms from "../Components/Forms"
import user from "../assets/user.png"
//Style
import "./CSS/Login.css"

const Login = () => {
  return (
    <div className="login_container">

      <div className="login_card">

        <div className="login_header">
          <div className="icon_user">
             <img src={user} alt="User" />
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