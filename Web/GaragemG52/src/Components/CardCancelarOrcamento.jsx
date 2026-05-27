import { Link, useLocation, useNavigate } from "react-router-dom"
import cancel from "../assets/DeleteFile.png"
import cancelB from "../assets/Delete_File_Branco.png"
import "./css/CardCancelarOrcamento.css"
import { useFetch } from "../hooks/useFetch"
import { useEffect, useRef, useState } from "react"

const CardCancelarOrcamento = () => {
  
  const [mensagem, setMensagem] = useState()
  const url = "http://localhost:8080"

  const motivoRef = useRef();

  const navigate = useNavigate()
  const location = useLocation()

  const { data, httpConfig, error, loading } = useFetch(url)

  let dadosOrcamentos = location.state
  const [Orcamento, setOrcamento] = useState(
    dadosOrcamentos
  )

  useEffect(() => {console.log(motivoRef)},[motivoRef])

  async function cancelarOrçamento(){
    try {

      const motivo = motivoRef.current.value

      if(!motivo){
        setMensagem("Escolha um motivo")
        return
      } 

      const Motivo = {motivo:motivo}
      
      const res = await httpConfig("PATCH", `orcamentos/${Orcamento.idOrcamento}/cancelar`, Motivo)

      console.log(res.data)

      setMensagem("Orçamento cancelado")

      setTimeout(() => {
        navigate("/home")
      },2000)
    
    } catch (error) {
      console.log(error)
    }

  }

  return (
    <div className="cco_container">

      <div className="cco_top_bar">

        <div className="cco_top_left">
          <img src={cancel} className="cco_top_icon" />

          <div>
            <h3>Confirmar Cancelamento</h3>
            <p>Confirmar cancelamento no orçamento de serviço</p>
          </div>
        </div>

        

      </div>

      <div className="cco_card">

        <div className="cco_icon">
          <img src={cancelB} />
        </div>

        <div className="cco_header">
          <h2>Confirmar Cancelamento</h2>
          <p>Selecione uma opção para continuar</p>
        </div>

        <div className="cco_content">

          <select className="cco_select" defaultValue="" ref={motivoRef}>

            <option value="" disabled>
              Motivo do cancelamento
            </option>

            <option value="CLIENTE_DESISTIU">
              Cliente desistiu do serviço
            </option>

            <option value="DEMORA_NA_PECA">
              Demora na entrega da peça
            </option>

            <option value="PRECO_ALTO">
              Valor do orçamento elevado
            </option>

            <option value="OUTROS">
              Outros motivos
            </option>

          </select>

          {loading ? <p id="carregando">Carregando...</p> : ""}
          {mensagem ? <p id="mensagem">{mensagem}</p> : ""}

          <button className="cco_button" onClick={() => cancelarOrçamento()}>
            ✔ Confirmar cancelamento
          </button>

          <button
            className="cco_button cancel"
            onClick={() => navigate("/visualizar-orcamento")}
          >
            ✖ Voltar para orçamento
          </button>

        </div>

      </div>

    </div>
  )
}

export default CardCancelarOrcamento