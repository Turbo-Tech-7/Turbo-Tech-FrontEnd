import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import cadeado from "../assets/cadeado.png"
import "./css/RecuperarSenhaEmail.css"
import { codigoValido } from "../hooks/utils"

function useRecuperarSenhaCodigo() {
  const [codigo, setCodigo] = useState(["", "", "", "", "", ""])
  const [mensagem, setMensagem] = useState("")
  const navigate = useNavigate()

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

  const handleSubmit = (e) => {
    e.preventDefault()
    const codigoFinal = codigo.join("")

    if (!codigoValido(codigoFinal)) {
      setMensagem("Preencha todos os 6 dígitos")
      return
    }

    setMensagem("Código validado")
    setTimeout(() => navigate("/recuperar-senha/nova", { state: { codigo: codigoFinal } }), 800)
  }

  return {
    codigo,
    mensagem,
    handleChange,
    handleKeyDown,
    handlePaste,
    handleSubmit,
  }
}

const RecuperarSenhaCodigo = () => {
  const {
    codigo,
    mensagem,
    handleChange,
    handleKeyDown,
    handlePaste,
    handleSubmit,
  } = useRecuperarSenhaCodigo()

  return (
    <div className="login_container">
      <div className="recuperar_card">

        <div className="icon_user">
          <img src={cadeado} alt="cadeado" />
        </div>

        <div className="login_header">
          <h2>Recuperar senha</h2>
          <p>Código de verificação enviado para homeroxxxxx@gmail.com</p>
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

export default RecuperarSenhaCodigo