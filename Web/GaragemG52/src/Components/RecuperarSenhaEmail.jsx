import { Link, useNavigate } from "react-router-dom"
import cadeado from "../assets/cadeado.png"
import "./css/RecuperarSenhaEmail.css"
import { verificarEmail } from "../hooks/utils"
import { useState } from "react"
import { useAuthService } from "../services/authService"

function useRecuperarSenhaEmail() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("")
  const [mensagem, setMensagem] = useState("")
  const { forgotPassword, loading } = useAuthService()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMensagem("")

    if (!verificarEmail(email)) {
      setMensagem("Email invalido")
      return
    }

    try {
      const res = await forgotPassword(email)

      if (res.status == 200) {
        setMensagem("Email Encontrado")

        setTimeout(() => {
          navigate("/recuperar-senha/verificar", {
            state: { email }
          })
        }, 2000)
      }
    } catch (error) {
      console.error("Erro ao enviar dados:", error)
      setMensagem("Erro ao enviar os dados:")
    }
  }

  return { email, setEmail, mensagem, loading, handleSubmit }
}

const RecuperarSenhaEmail = () => {
  const { email, setEmail, mensagem, loading, handleSubmit } = useRecuperarSenhaEmail()

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

        <form className="form" onSubmit={handleSubmit}>
          <div id="div_dados">
            <div className="div_label">
              <label>Email</label>
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div id="div_button">
            {mensagem ? <span id="mensagem">{mensagem}</span> : ""}
            {loading ? <p id="carregando">Carregando...</p> : ""}
            <button id="button_submit" type="submit">
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