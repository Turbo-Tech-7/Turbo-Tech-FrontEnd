import { useState } from "react"
import "./css/ListaPecasEncontradas.css"

const ListaPecasEncontradas = ({ pecas, onAdicionar, loading = false }) => {
  const [filtro, setFiltro] = useState("")

  if (!pecas || pecas.length === 0) {
    return (
      <div className="lista_vazia">
        <p>Nenhuma peça encontrada. Busque novamente!</p>
      </div>
    )
  }

  const pecasFiltradas = pecas.filter(peca =>
    peca.nomePeca?.toLowerCase().includes(filtro.toLowerCase())
  )

  return (
    <div className="lista_pecas_container">
      <div className="lista_header">
        <h3>🔧 Peças Encontradas (Top 5 Mais Baratas)</h3>
        <input
          type="text"
          placeholder="Filtrar peças..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="filtro_input"
        />
      </div>

      <div className="pecas_grid">
        {pecasFiltradas.map((peca, index) => (
          <div key={index} className="peca_card">
            <div className="peca_header">
              <h4>{peca.nomePeca}</h4>
              <span className="peca_id">#{index + 1}</span>
            </div>

            <div className="peca_descricao">
              <p>{peca.descricaoPeca || "Sem descrição"}</p>
            </div>

            <div className="peca_info">
              <div className="info_item">
                <label>Fornecedor:</label>
                <span>{peca.fornecedor || "peca.ai"}</span>
              </div>

              <div className="info_item">
                <label>Preço:</label>
                <span className="preco">
                  R$ {peca.precoPeca?.toFixed(2) || "0.00"}
                </span>
              </div>
            </div>

            <div className="peca_footer">
              <a
                href={peca.linkPeca}
                target="_blank"
                rel="noopener noreferrer"
                className="link_externo"
              >
                Ver detalhes →
              </a>

              <button
                className="btn_adicionar"
                onClick={() => onAdicionar(peca)}
                disabled={loading}
              >
                + Adicionar
              </button>
            </div>
          </div>
        ))}
      </div>

      {pecasFiltradas.length === 0 && (
        <div className="lista_vazia">
          <p>Nenhuma peça corresponde ao filtro</p>
        </div>
      )}
    </div>
  )
}

export default ListaPecasEncontradas
