import { useState } from "react"
import "./css/ModalConfirmarCarro.css"

const ModalConfirmarCarro = ({ 
  dadosCarro, 
  onConfirmar, 
  onCancelar, 
  loading = false 
}) => {
  const [confirmado, setConfirmado] = useState(false)

  const handleConfirmar = () => {
    setConfirmado(true)
    onConfirmar(dadosCarro)
  }

  if (!dadosCarro) return null

  return (
    <div className="modal_overlay">
      <div className="modal_container">
        <div className="modal_header">
          <h2>Confirme os dados do veículo</h2>
          <p>Verifique se todos os dados estão corretos antes de continuar</p>
        </div>

        <div className="modal_content">
          <div className="dados_card">
            <div className="dado_item">
              <label>Placa:</label>
              <p>{dadosCarro.placa}</p>
            </div>

            <div className="dado_item">
              <label>Marca/Modelo:</label>
              <p>{dadosCarro.nomeveiculo || "N/A"}</p>
            </div>

            <div className="dado_item">
              <label>Cilindradas:</label>
              <p>{dadosCarro.cilindradas || "N/A"}</p>
            </div>

            <div className="dado_item">
              <label>Cor:</label>
              <p>{dadosCarro.cor || "N/A"}</p>
            </div>

            <div className="dado_item">
              <label>Tipo de Combustível:</label>
              <p>{dadosCarro.tipoCombustivel || "N/A"}</p>
            </div>

            <div className="dado_item">
              <label>Ano:</label>
              <p>{dadosCarro.ano || "N/A"}</p>
            </div>
          </div>
        </div>

        <div className="modal_footer">
          <button 
            className="btn_cancelar"
            onClick={onCancelar}
            disabled={loading || confirmado}
          >
            ❌ Refazer busca
          </button>

          <button 
            className="btn_confirmar"
            onClick={handleConfirmar}
            disabled={loading || confirmado}
          >
            {loading ? "Carregando..." : confirmado ? "✓ Confirmado!" : "✔ Confirmar"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ModalConfirmarCarro
