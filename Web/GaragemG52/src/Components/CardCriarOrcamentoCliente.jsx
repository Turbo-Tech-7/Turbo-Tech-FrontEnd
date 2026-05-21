import { Link, useLocation } from "react-router-dom"
import { useRef, useState } from "react"
import { useFetch } from "../hooks/useFetch"
import criardoc from "../assets/criardoc.png"
import "./css/CardCriarOrcamentoCliente.css"

const CardCriarOrcamentoCliente = () => {
  const location = useLocation()
  const url = "http://localhost:8080"

  const[resLista, setResLista] = useState([])

  let dadosCliente = location.state?.DadosCliente
  const [Cliente, setCliente] = useState(
    dadosCliente || {
            placa:"",
            nome:"",
            telefone:"",
            email:""
        }
  )

  const { data, httpConfig, error, loading } = useFetch(url)
  const descricaoRef = useRef();
  const queixaRef = useRef();
  const pecaRef = useRef();

  const [maoDeObra, setMaoDeObra] = useState("")

  const [pecas, setPecas] = useState([
  ])

  const adicionarPeca = (peca) => {
  const index = pecas.findIndex(item => item.id === peca.idPeca)

  if (index !== -1) {
    const novasPecas = [...pecas]
    novasPecas[index].quantidade += 1
    setPecas(novasPecas)
  } else {
    setPecas([
      ...pecas,
      {
        id: peca.idPeca,
        nome: peca.nomePeca,
        descricao: peca.descricaoPeca,
        valor: peca.precoPeca,
        quantidade: 1
      }
    ])
  }
}

  const removerPeca = (id) => {
  const novasPecas = pecas.map((peca) => {
    if (peca.id === id) {
      return {
        ...peca,
        quantidade: peca.quantidade - 1
      }
    }
    return peca
  }).filter((peca) => peca.quantidade > 0)

  setPecas(novasPecas)
}

  const atualizarPeca = (index, campo, valor) => {

    const novasPecas = [...pecas]

    novasPecas[index][campo] = valor

    setPecas(novasPecas)
  }

  const totalPecas = pecas.reduce((acc, item) => {
  return acc + ((parseFloat(item.valor) || 0) * item.quantidade)
}, 0)

  const valorMao = parseFloat(maoDeObra) || 0

  const total = totalPecas + valorMao

  async function buscarPeca(nomePeca) {
      const res = await httpConfig("GET", `pecas/buscar-nome`, null, `nomePeca=${nomePeca}`)

      console.log(res.data)
      setResLista(res.data)
  }

  async function enviarOrçamento(e) {
    e.preventDefault()



  }

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

            <input
              type="text"
              placeholder="ABC-1234"
              value={Cliente.placa || ""}
              onChange={(e) =>
                setCliente({
                  ...Cliente,
                  placa: e.target.value
                })
              }
            />

            <input
              type="text"
              placeholder="João Silva"
              value={Cliente.nome || ""}
              onChange={(e) =>
                setCliente({
                  ...Cliente,
                  nome: e.target.value
                })
              }
            />

            <input
              type="text"
              placeholder="(11) 98765-4321"
              value={Cliente.telefone || ""}
              onChange={(e) =>
                setCliente({
                  ...Cliente,
                  telefone: e.target.value
                })
              }
            />

            <input
              type="text"
              placeholder="exemplo@gmail.com"
              value={Cliente.email || ""}
              onChange={(e) =>
                setCliente({
                  ...Cliente,
                  email: e.target.value
                })
              }
            />

          </div>

        </div>

        <div className="cocc_section">

          <div className="cocc_section_header">
            <span className="cocc_number">2</span>
            <h4>Dados do Serviço</h4>
          </div>

          <input
                  placeholder="Queixa do cliente"
                  ref={queixaRef}
          />
          <input
                  placeholder="Descrição do Serviço"
                  ref={descricaoRef}
          />

                <input
                  placeholder="Buscar peças"
                  ref={pecaRef}
                />

                
                <button 
                className="cocc_button"
                onClick={()=>buscarPeca(pecaRef.current.value)}
                > 
                  Buscar peça
                </button>


              {resLista?.length > 0
                  ? resLista.map((item) => (
                      <div className="cocc_peca_box_center" key={item.idPeca}>
                        <span>
                          <strong>Peça</strong>: {item.nomePeca} || 
                          <strong> Valor</strong>: R${item.precoPeca}
                        </span>
                        <button className="cocc_add_button" onClick={() => {adicionarPeca(item)}}>Adicionar Peça</button>
                      </div>
                    ))
                  : null
                }

          {
            pecas.map((item, index) => (
              <div key={item.id} className="cocc_peca_box">

                <div className="cocc_peca_top">
                  <span className="cocc_peca_title">
                    Peça {index + 1} || Quantidade {item.quantidade}
                  </span>
                      <button
                        className="cocc_remove_button"
                        onClick={() => removerPeca(item.id)}
                      >
                        −
                      </button>
                </div>
                <div>
                  <span>
                    <strong>Peça</strong>: {item.nome} <br /> 
                    <strong> Valor</strong>: R${item.valor}
                  </span>
                </div>
              </div>
            ))
          }

          

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

        <button onClick={(e) => enviarOrçamento(e)} className="cocc_button">
          Criar Orçamento
        </button>


      </div>
    </div>
  )
}

export default CardCriarOrcamentoCliente