import { useState } from "react"
import cadeado from "../assets/cadeado.png"
import "./css/RecuperarSenhaEmail.css"
import { useLocation, useNavigate } from "react-router-dom"
import { senhaValida, senhasIguais, codigoValido } from "../hooks/utils"
import { useAuthService } from "../services/authService"

function useRecuperarSenhaNova() {
  const { resetPassword, loading } = useAuthService()
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email

  const [senha, setSenha] = useState("")
  const [codigo, setCodigo] = useState("")
  const [confirmarSenha, setConfirmarSenha] = useState("")
  const [mensagem, setMensagem] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!codigoValido(codigo)) {
      setMensagem("Código inválido")
      return
    }
    if (!senhaValida(senha)) {
      setMensagem("Senha deve ter no mínimo 6 caracteres")
      return
    }
    if (!senhasIguais(senha, confirmarSenha)) {
      setMensagem("As senhas não coincidem")
      return
    }

    try {
      const res = await resetPassword(codigo, senha)

      if (res.status == 200) {
        setMensagem("Senha atualizada")
        setTimeout(() => { navigate("/") }, 2000)
      }
    } catch (error) {
      console.error("Erro ao enviar dados:", error)
      setMensagem("Erro ao enviar os dados:")
    }
  }

  return {
    email,
    senha,
    setSenha,
    codigo,
    setCodigo,
    confirmarSenha,
    setConfirmarSenha,
    mensagem,
    loading,
    handleSubmit,
  }
}

const RecuperarSenhaNova = () => {
  const {
    email,
    senha,
    setSenha,
    codigo,
    setCodigo,
    confirmarSenha,
    setConfirmarSenha,
    mensagem,
    loading,
    handleSubmit,
  } = useRecuperarSenhaNova()

  return (
    <div className="login_container">
      <div className="recuperar_card">

        <div className="icon_user">
          <img src={cadeado} alt="cadeado" />
        </div>

        <div className="login_header">
          <h2>Nova senha</h2>
          <p>Insira uma nova senha para {email}</p>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <div id="div_dados">
            <div className="div_label">
              <label>Código</label>
              <input 
                type="text"
                placeholder="Código de verificação"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
              />
            </div>

            <div className="div_label">
              <label>Senha</label>
              <input 
                type="password"
                placeholder="Digite sua nova senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            </div>


            <div className="div_label">
              <label>Confirmar senha</label>
              <input 
                type="password"
                placeholder="Confirme sua senha"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
              />
            </div>

          </div>

          <div id="div_button">
            {loading ? <p id="carregando">Carregando...</p> : ""}
            {mensagem ? <p id="mensagem">{mensagem}</p> : ""}
            <button id="button_submit" type="submit">
              Validar
            </button>
          </div>

        </form>

      </div>
    </div>
  )
}

export default RecuperarSenhaNova