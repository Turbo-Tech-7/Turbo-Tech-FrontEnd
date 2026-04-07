import { useState } from "react"
import cadeado from "../assets/cadeado.png"
import "./css/RecuperarSenhaEmail.css"

const RecuperarSenhaNova = () => {
  const [senha, setSenha] = useState("")
  const [confirmarSenha, setConfirmarSenha] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()

    if (senha !== confirmarSenha) {
      alert("As senhas não coincidem")
      return
    }

    console.log("Nova senha:", senha)
  }

  return (
    <div className="login_container">
      <div className="recuperar_card">

        <div className="icon_user">
          <img src={cadeado} alt="cadeado" />
        </div>

        <div className="login_header">
          <h2>Recuperar senha</h2>
          <p>Insira uma nova senha para homeroxxxxx@gmail.com</p>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <div id="div_dados">

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
            <button id="button_submit">
              Validar
            </button>
          </div>

        </form>

      </div>
    </div>
  )
}

export default RecuperarSenhaNova