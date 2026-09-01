import { Link, useLocation, useNavigate } from "react-router-dom"
import { useState } from "react"
import cadeado from "../assets/cadeado.png"
import "./css/RecuperarSenhaEmail.css"
import { useFetch } from "../hooks/useFetch"
import { codigoValido } from "../hooks/utils"
import { setAuthToken } from "../services/authStorage"
import { authService } from "../services/authService"

function useVerificarConta() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email
  const [mensagem, setMensagem] = useState("")
  const { httpConfig, loading } = useFetch()
  const [codigo, setCodigo] = useState(["", "", "", "", "", ""])

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return

    const novoCodigo = [...codigo]
    novoCodigo[index] = value
    setCodigo(novoCodigo)

    if (value && index < 5) {
      document.getElementById(`input-${index + 1}`)?.focus()
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (codigo[index] === "") {
        if (index > 0) {
          document.getElementById(`input-${index - 1}`)?.focus()
        }
      } else {
        const novoCodigo = [...codigo]
        novoCodigo[index] = ""
        setCodigo(novoCodigo)
      }
    }
  }

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text").replace(/\D/g, "")

    if (!paste) return

    const novoCodigo = paste.slice(0, 6).split("")

    while (novoCodigo.length < 6) {
      novoCodigo.push("")
    }

    setCodigo(novoCodigo)

    const lastIndex = novoCodigo.findLastIndex((n) => n !== "")
    if (lastIndex >= 0) {
      document.getElementById(`input-${lastIndex}`)?.focus()
    }
  }

  const handleSubmit = async (e) => {
    setMensagem("")
    e.preventDefault()

    const codigoString = codigo.join("")

    if (!codigoValido(codigoString)) {
      setMensagem("Preencha todos os 6 dígitos")
      return
    }

    const resposta = await authService.verifyLoginCode(httpConfig, codigoString)
    const data = resposta.data
    const status = resposta.status

    if (status == 200) {
      setMensagem("Validação confirmada")
      setAuthToken(data.token)
      setTimeout(() => { navigate("/home") }, 2500)
      return
    }

    if (status == 500) {
      setMensagem("Codigo incorreto")
    }
  }

  return {
    email,
    codigo,
    mensagem,
    loading,
    handleChange,
    handleKeyDown,
    handlePaste,
    handleSubmit,
  }
}

const CardVerificarConta = () => {
  const {
    email,
    codigo,
    mensagem,
    loading,
    handleChange,
    handleKeyDown,
    handlePaste,
    handleSubmit,
  } = useVerificarConta()

  return (
    <div className="login_container">
      <div className="recuperar_card">

        <div className="icon_user">
          <img src={cadeado} alt="cadeado" />
        </div>

        <div className="login_header">
          <h2>Verificar conta</h2>
          <p>Código de verificação enviado para {email}</p>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <div id="div_dados">

            <div className="div_label_codigo">
              <label>Código</label>

              <div className="codigo_container" onPaste={handlePaste}>

                {codigo.slice(0, 3).map((num, index) => (
                  <input
                    key={index}
                    id={`input-${index}`}
                    maxLength="1"
                    value={num}
                    onChange={(e) => handleChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="codigo_input"
                  />
                ))}

                <span className="codigo_traco">-</span>

                {codigo.slice(3, 6).map((num, index) => (
                  <input
                    key={index + 3}
                    id={`input-${index + 3}`}
                    maxLength="1"
                    value={num}
                    onChange={(e) => handleChange(e.target.value, index + 3)}
                    onKeyDown={(e) => handleKeyDown(e, index + 3)}
                    className="codigo_input"
                  />
                ))}

              </div>
            </div>

          </div>

          <div id="div_button">
            {loading ? <p id="carregando">Carregando...</p> : ""}
            {mensagem ? <p id="mensagem">{mensagem}</p> : ""}
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

export default CardVerificarConta