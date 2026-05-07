import { Link } from "react-router-dom"
import { useState } from "react"
import criardoc from "../assets/criardoc.png"
import "./css/CardCriarOrcamentoCliente.css"

const CardCriarOrcamentoCliente = () => {

  const [maoDeObra, setMaoDeObra] = useState("")

  const [pecas, setPecas] = useState([
    {
      descricao: "",
      peca: "",
      fornecedor: "",
      valor: ""
    }
  ])

  const adicionarPeca = () => {
    setPecas([
      ...pecas,
      {
        descricao: "",
        peca: "",
        fornecedor: "",
        valor: ""
      }
    ])
  }

  const removerPeca = (index) => {

    if (pecas.length === 1) return

    const novasPecas = pecas.filter((_, i) => i !== index)

    setPecas(novasPecas)
  }

  const atualizarPeca = (index, campo, valor) => {

    const novasPecas = [...pecas]

    novasPecas[index][campo] = valor

    setPecas(novasPecas)
  }

  const totalPecas = pecas.reduce((acc, item) => {
    return acc + (parseFloat(item.valor) || 0)
  }, 0)

  const valorMao = parseFloat(maoDeObra) || 0

  const total = totalPecas + valorMao

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

        <div className="cocc_section">

          <div className="cocc_section_header">
            <span className="cocc_number">2</span>
            <h4>Dados do Serviço</h4>
          </div>

          {
            pecas.map((item, index) => (
              <div key={index} className="cocc_peca_box">

                <div className="cocc_peca_top">

                  <span className="cocc_peca_title">
                    Peça {index + 1}
                  </span>

                  {
                    pecas.length > 1 && (
                      <button
                        className="cocc_remove_button"
                        onClick={() => removerPeca(index)}
                      >
                        −
                      </button>
                    )
                  }

                </div>

                <input
                  placeholder="Descrição do Serviço"
                  value={item.descricao}
                  onChange={(e) =>
                    atualizarPeca(index, "descricao", e.target.value)
                  }
                />

                <input
                  placeholder="Peças Compradas/Utilizadas"
                  value={item.peca}
                  onChange={(e) =>
                    atualizarPeca(index, "peca", e.target.value)
                  }
                />

                <div className="cocc_grid">

                  <input
                    placeholder="Fornecedor"
                    value={item.fornecedor}
                    onChange={(e) =>
                      atualizarPeca(index, "fornecedor", e.target.value)
                    }
                  />

                  <input
                    type="number"
                    placeholder="Valor da peça/material"
                    value={item.valor}
                    onChange={(e) =>
                      atualizarPeca(index, "valor", e.target.value)
                    }
                  />

                </div>

              </div>
            ))
          }

          <button
            className="cocc_add_button"
            onClick={adicionarPeca}
          >
            + Adicionar peça
          </button>

        </div>

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
              <strong>R$ {totalPecas.toFixed(2)}</strong>
            </div>

            <div>
              <span>Mão de Obra</span>
              <strong>R$ {valorMao.toFixed(2)}</strong>
            </div>

            <div>
              <span>Total</span>
              <strong>R$ {total.toFixed(2)}</strong>
            </div>

          </div>

        </div>

        <Link to="/visualizar-orcamento" className="cocc_button">
          Criar Orçamento
        </Link>

      </div>
    </div>
  )
}

export default CardCriarOrcamentoCliente