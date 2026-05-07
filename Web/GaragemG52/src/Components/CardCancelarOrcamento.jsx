import { Link, useNavigate } from "react-router-dom"
import cancel from "../assets/DeleteFile.png"
import cancelB from "../assets/Delete_File_Branco.png"
import "./css/CardCancelarOrcamento.css"

const CardCancelarOrcamento = () => {

  const navigate = useNavigate()

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

          <select className="cco_select" defaultValue="">

            <option value="" disabled>
              Motivo do cancelamento
            </option>

            <option value="cliente-desistiu">
              Cliente desistiu do serviço
            </option>

            <option value="demora-peca">
              Demora na entrega da peça
            </option>

            <option value="valor-elevado">
              Valor do orçamento elevado
            </option>

            <option value="outros">
              Outros motivos
            </option>

          </select>

          <button className="cco_button">
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