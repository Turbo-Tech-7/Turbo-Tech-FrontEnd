import { Link } from "react-router-dom"
import { useState } from "react"
import criardoc from "../assets/criardoc.png"
import "./css/CardCriarOrcamentoCliente.css"

const CardCriarOrcamentoCliente = () => {

  const [peca, setPeca] = useState("")
  const [maoDeObra, setMaoDeObra] = useState("")

  const valorPeca = parseFloat(peca) || 0
  const valorMao = parseFloat(maoDeObra) || 0
  const total = valorPeca + valorMao

  return (
    <div className="cocc_container">

      <div className="cocc_top_bar">
        <div className="cocc_top_left">
          <img src={criardoc} alt="" className="cocc_top_icon" />
          <div>
            <h3>Criar Orçamento</h3>
            <p>Criar novo orçamento de serviço</p>
          </div>
        </div>

        <Link to="/criar-orcamento" className="cocc_link">
          Voltar
        </Link>
      </div>

      <div className="cocc_card">

        {/* 1 */}
        <div className="cocc_section">
          <div className="cocc_section_header">
            <span className="cocc_number">1</span>
            <h4>Informações do Cliente</h4>
          </div>

          <div className="cocc_grid">
            <input placeholder="ABC-1234" />
            <input placeholder="João Silva" />
            <input placeholder="(11) 98765-4321" />
            <input placeholder="Corolla 2022" />
          </div>
        </div>

        {/* 2 */}
        <div className="cocc_section">
          <div className="cocc_section_header">
            <span className="cocc_number">2</span>
            <h4>Dados do Serviço</h4>
          </div>

          <input placeholder="Descrição do Serviço" />
          <input placeholder="Peças Compradas/Utilizadas" />

          <div className="cocc_grid">
            <input placeholder="Fornecedor" />
            <input 
              type="number"
              placeholder="Valor da peça/material"
              value={peca}
              onChange={(e) => setPeca(e.target.value)}
            />
          </div>
        </div>

        {/* 3 */}
        <div className="cocc_section">
          <div className="cocc_section_header">
            <span className="cocc_number">3</span>
            <h4>Mão de obra</h4>
          </div>

          <input 
            type="number"
            placeholder="Valor da Mão de Obra"
            value={maoDeObra}
            onChange={(e) => setMaoDeObra(e.target.value)}
          />

          <div className="cocc_totais">
            <div>
              <span>Peças/Materiais</span>
              <strong> R$ {valorPeca.toFixed(2)}</strong>
            </div>
            <div>
              <span>Mão de Obra</span>
              <strong> R$ {valorMao.toFixed(2)}</strong>
            </div>
            <div>
              <span>Total</span>
              <strong> R$ {total.toFixed(2)}</strong>
            </div>
          </div>
        </div>

        <button className="cocc_button">
          Criar Orçamento
        </button>

      </div>
    </div>
  )
}

export default CardCriarOrcamentoCliente