// Hooks
import { useRef, useState } from "react"

// Router
import { Link, useNavigate } from "react-router-dom"

// imagens
import criardoc from "../assets/criardoc.png"

// Style
import "./css/CardCriarOrcamentoCliente.css"

// Robo de python
import ModalConfirmarCarro from "./ModalConfirmarCarro"
import ListaPecasEncontradas from "./ListaPecasEncontradas"

// Hooks persoinalizados
import { useFetch } from "../hooks/useFetch"
import { descricaoValida, valorPositivo } from "../hooks/utils"
import { useClienteContext } from "../hooks/useClienteContext"
import { useOrcamentoContext } from "../hooks/useOrcamentoContext"

const CardCriarOrcamentoCliente = () => {
  const navigate = useNavigate();

  const url = "http://localhost:8080"

  const {data, httpConfig, error, loading } = useFetch(url)
  const [mensagem, setMensagem] = useState("")

  const {Placa, Nome, Telefone, Email, Id,atualizarId, atualizarPlaca, atualizarNome, atualizarTelefone, atualizarEmail, Cliente} = useClienteContext()

  const {Orcamento, Descricao, MaoDeObra, Pecas, atualizarDescricao, atualizarMaoDeObra, atualizarIdOrcamento, adicionarPeca, removerPeca, totalPecas, total } = useOrcamentoContext()

  const [textoPecas, setTextoPecas] = useState("");
  
  // Estados para robô de busca de carro
  const [showModalCarro, setShowModalCarro] = useState(false)
  const [dadosCarroBuscado, setDadosCarroBuscado] = useState(null)
  const [carroConfirmado, setCarroConfirmado] = useState(false)
  const [loadingCarro, setLoadingCarro] = useState(false)
  
  // Estados para robô de busca de peças
  const [pecasEncontradas, setPecasEncontradas] = useState([])
  const [loadingPecas, setLoadingPecas] = useState(false)
  const [buscandoPecas, setBuscandoPecas] = useState(false)

  const pecaRef = useRef()
  // ============================================================================
  // 🤖 FUNÇÕES DO ROBÔ (API FLASK - localhost:5000)
  // ============================================================================

  // Buscar dados do carro via robô
  async function buscarCarroComRobo(placa) {
    try {
      setLoadingCarro(true)
      const placaNormalized = placa.replace(/[^A-Za-z0-9]/g, "").toUpperCase()
      
      if (placaNormalized.length !== 7) {
        setMensagem("Placa deve ter 7 caracteres")
        setLoadingCarro(false)
        return
      }
      
      // Chamar API Flask (robô)
      const res = await fetch("http://localhost:5000/api/veiculo/buscar-robo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ placa: placaNormalized })
      })
      
      const data = await res.json()
      
      if (res.ok && data.status === 200) {
        setDadosCarroBuscado(data)
        setShowModalCarro(true)
        setMensagem("")
      } else {
        setMensagem(data.error || "Erro ao buscar dados do carro")
      }
    } catch (error) {
      setMensagem("❌ Servidor Flask não está respondendo! Certifique-se que está rodando em localhost:5000")
      console.error("Erro ao buscar carro:", error)
    } finally {
      setLoadingCarro(false)
    }
  }

// fechar navegador
function fecharRobo() {
    fetch("http://localhost:5000/api/robo/fechar", {
        method: "POST"
    })
    .then(res => res.json())
    .then(data => {
        console.log(data);
        alert(data.message);
    })
    .catch(err => {
        console.error(err);
    });
}


  // Confirmar dados do carro do robô
  function confirmarDadosCarro(dados) {
    setCarroConfirmado(true)
    setCliente({
      ...Cliente,
      placa: dados.placa,
    })
    setShowModalCarro(false)
  }

  // Buscar peças via robô
  async function buscarPecasComRobo(listaPecas) {
    try {
      setBuscandoPecas(true)
      setLoadingPecas(true)
      
      // Chamar API Flask (robô)
      const res = await fetch("http://localhost:5000/api/pecas/buscar-robo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pecas: listaPecas })
      })
      
      const data = await res.json()

      console.log(data)
      
      if (res.ok && data.status === 200) {
        setPecasEncontradas(data.pecas || [])
        setMensagem(`✅ ${data.total} peças encontradas!`)
      } else {
        setMensagem(data.error || "Nenhuma peça encontrada")
        setPecasEncontradas([])
      }
    } catch (error) {
      setMensagem("❌ Servidor Flask não está respondendo! Certifique-se que está rodando em localhost:5000")
      console.error("Erro ao buscar peças:", error)
      setPecasEncontradas([])
    } finally {
      setLoadingPecas(false)
      setBuscandoPecas(false)
    }
  }

  // Adicionar peça encontrada pelo robô
  const adicionarPecaDoRobo = (peca) => {
      adicionarPeca(peca)
      setMensagem(`✅ ${peca.nomePeca} adicionado ao orçamento!`)
    }
  

  async function enviarOrçamento(e) {
    e.preventDefault()

    if (!descricaoValida(Descricao)) {
      setMensagem("Descrição deve ter pelo menos 5 caracteres")
      return
    }
    if (!valorPositivo(MaoDeObra)) {
      setMensagem("Valor de mão de obra inválido")
      return
    }

    const res = await httpConfig("POST", "orcamentos", Orcamento)

    atualizarIdOrcamento(data.id)
    
    if (res.status == 201) {
      setMensagem("Orçamento cadastrado com sucesso!");

      setTimeout(() => {
        navigate("/visualizar-orcamento")}, 2500)

    } else {
      setMensagem("Erro ao cadastrar");
      console.log("Erro do cliente:", error)
    }

  }

  async function buscarCliente(params) {

    try {

      const placaNormalized = params.replace(/[^A-Za-z0-9]/g, "")

      if (placaNormalized.length !== 7) return

      const res = await httpConfig(
        "GET",
        "clientes-veiculos/buscar-placa",
        null,
        { placa: placaNormalized }
      )

      // Verificar se a resposta e os dados existem
      if (res && data && data.length > 0) {
        
        atualizarPlaca(data[0].placaVeiculo)
        atualizarNome(data[0].nomeCliente)
        atualizarTelefone(data[0].telefoneCliente)
        atualizarEmail(data[0].emailCliente)
        atualizarId(data[0].id)
       
      } else {
        console.log("⚠️ Cliente não encontrado ou servidor não respondeu")
      }

    } catch (error) {
      console.log("❌ Erro ao buscar cliente:", error)
    }
  }

  return (
    <>
      {/* Modal de confirmação do carro */}
      {showModalCarro && (
        <ModalConfirmarCarro
          dadosCarro={dadosCarroBuscado}
          onConfirmar={confirmarDadosCarro}
          onCancelar={() => setShowModalCarro(false)}
          loading={loadingCarro}
        />
      )}

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
              value={Placa || ""}
              onChange={(e) => {
                atualizarPlaca(e.target.value)
                buscarCliente(e.target.value)
              }
              }
            />

            <button 
              className="cocc_button_robo"
              onClick={() => buscarCarroComRobo(Cliente.placa)}
              disabled={loadingCarro || !Cliente.placa || Cliente.placa.length < 7}
            >
              {loadingCarro ? "⏳ Buscando..." : "🤖 Buscar Carro"}
            </button>

            <input
              type="text"
              placeholder="João Silva"
              value={Cliente.nome || ""}
              onChange={(e) =>
                atualizarNome(e.target.value)
              }
            />

            <input
              type="text"
              placeholder="(11) 98765-4321"
              value={Cliente.telefone || ""}
              onChange={(e) =>
                atualizarTelefone(e.target.value)
              }
            />

            <input
              type="text"
              placeholder="exemplo@gmail.com"
              value={Cliente.email || ""}
              onChange={(e) =>
                atualizarEmail(e.target.value)
              }
            />

          </div>

          {carroConfirmado && (
            <div className="carro_confirmado">
              ✅ Dados do carro confirmados!
            </div>
          )}

        </div>

        <div className="cocc_section">

          <div className="cocc_section_header">
            <span className="cocc_number">2</span>
            <h4>Dados do Serviço</h4>
          </div>

          <input
            placeholder="Descrição do Serviço"
            onChange={(e) => {atualizarDescricao(e.target.value)}}
          />

          <div className="cocc_buscar_pecas">
            <label>🔍 Buscar peças (separadas por vírgula)</label>
            <div className="cocc_input_button">
              <input
                placeholder="Ex: pneu, óleo, filtro"
                value={textoPecas}
                onChange={(e) => setTextoPecas(e.target.value)}
                ref={pecaRef}
              />  
              
              <button
                className="cocc_button_robo"
                onClick={() => {
                  const pecas = textoPecas
                    .split(",")
                    .map(p => p.trim())
                    .filter(p => p);

                  if (pecas.length > 0) {
                    buscarPecasComRobo(pecas);
                  }
                }}
                disabled={loadingPecas || !textoPecas.trim()}
              >
                {loadingPecas ? "⏳ Buscando..." : "🤖 Buscar"}
              </button>
            </div>
            
            {buscandoPecas && (
              <div className="buscando_pecas">
                ⏳ Conectando ao robô de busca de peças... isso pode demorar alguns segundos
              </div>
            )}
          </div>

          {/* Lista de peças encontradas pelo robô */}
          {pecasEncontradas.length > 0 && (
            <ListaPecasEncontradas 
              pecas={pecasEncontradas}
              onAdicionar={adicionarPecaDoRobo}
              loading={loadingPecas}
            />
          )}

          {/* Peças adicionadas */}
          {
            Pecas.map((item, index) => (
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
                    <strong>Peça</strong>: {item.nomePeca} <br /> 
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
            value={MaoDeObra}
            onChange={(e) => atualizarMaoDeObra(e.target.value)}
          />

          <div className="cocc_totais">

            <div>
              <span>Peças/Materiais</span>
              <strong>R$ {totalPecas.toFixed(2)}</strong>
            </div>

            <div>
              <span>Mão de Obra</span>
              <strong>R$ {MaoDeObra.toFixed(2)}</strong>
            </div>

            <div>
              <span>Total</span>
              <strong>R$ {total.toFixed(2)}</strong>
            </div>

          </div>

        </div>
          {loading ? <p id="carregando">Carregando...</p> : ""}
          {mensagem ? <p id="mensagem">{mensagem}</p> : ""}
        <button onClick={(e) => {enviarOrçamento(e); fecharRobo()}} className="cocc_button">
          Criar Orçamento
        </button>


      </div>
      </div>
    </>
  )
}

export default CardCriarOrcamentoCliente