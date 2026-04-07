import { Link } from "react-router-dom"
import cadeado from "../assets/cadeado.png"
import  "./css/RecuperarSenhaEmail.css"


const RecuperarSenhaEmail = () => {
  return (
    <div className="login_container">
      <div className="recuperar_card">

   
       <div className="icon_user">
                   <img src={cadeado} alt="cadeado" />
       
                 </div>

        
        <div className="login_header">
          <h2>Recuperar senha</h2>
          <p>Insira o Email para recuperação de conta</p>
        </div>

        {/* Form */}
        <form className="form">
          <div id="div_dados">

            <div className="div_label">
              <label>Email</label>
              <input 
                type="email" 
                placeholder="seu@email.com"
              />
            </div>

          </div>

          <div id="div_button">
            <button id="button_submit">
              Validar
            </button>
          </div>

          <div id="div_action">
            <Link to="/login">Voltar</Link>
          </div>
        </form>

      </div>
    </div>
  )
}

export default RecuperarSenhaEmail