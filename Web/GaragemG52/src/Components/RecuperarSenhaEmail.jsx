import { Link, useNavigate } from "react-router-dom"
import cadeado from "../assets/cadeado.png"
import  "./css/RecuperarSenhaEmail.css"
import { verificarEmail} from "../hooks/utils"
import { useState } from "react"
import { useFetch } from "../hooks/useFetch"

const RecuperarSenhaEmail = () => {

  const url = "http://localhost:8080"
  const { data, httpConfig, error, loading } = useFetch(url)

  const navigate = useNavigate();

  const [email,setEmail] = useState("")
  const [mensagem, setMensagem] = useState("")

  const handleSubmit = async (e) =>{

    setMensagem("")

    e.preventDefault()
    if (!verificarEmail(email)) {
        setMensagem("Email invalido")
        return
    }

    try {

            const res = await httpConfig("POST", "auth/forgot-password",null, { email })

            if (res.status == 200) {
                setMensagem("Email Encontrado")

                setTimeout(() => { navigate("/recuperar-senha/nova", {
                  state: {email:email}
                }) }, 2000)
            }

        } catch (error) {
            console.error("Erro ao enviar dados:", error);
            setMensagem("Erro ao enviar os dados:", error)
        }


  }

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
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div id="div_button">
            {mensagem ? <spam id="mensagem">{mensagem}</spam> : ""}
            {loading ? <p id="carregando">Carregando...</p> : ""}
            <button id="button_submit" onClick={handleSubmit}>
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