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
import { descricaoValida, valorPositivo } from "../hooks/utils"
import { useClienteContext } from "../hooks/useClienteContext"
import { useOrcamentoContext } from "../hooks/useOrcamentoContext"
import { useClienteService } from "../services/clienteService"
import { useOrcamentoService } from "../services/orcamentoService"
import {
  buscarCarroNoRobo,
  fecharRobo,
  buscarPecasNoRobo,
} from "../services/roboService"

function useRoboBusca({ atualizarCliente, Cliente, adicionarPeca, setMensagem }) {
  const [showModalCarro, setShowModalCarro] = useState(false)
  const [dadosCarroBuscado, setDadosCarroBuscado] = useState(null)
  const [carroConfirmado, setCarroConfirmado] = useState(false)
  const [loadingCarro, setLoadingCarro] = useState(false)
  const [pecasEncontradas, setPecasEncontradas] = useState([])
  const [loadingPecas, setLoadingPecas] = useState(false)
  const [buscandoPecas, setBuscandoPecas] = useState(false)

  const buscarCarroComRobo = async (placa) => {
    try {
      setLoadingCarro(true)
      const placaNormalized = placa.replace(/[^A-Za-z0-9]/g, "").toUpperCase()

      if (placaNormalized.length !== 7) {
        setMensagem("Placa deve ter 7 caracteres")
        setLoadingCarro(false)
        return
      }

      const res = await buscarCarroNoRobo(placaNormalized)
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

  const confirmarDadosCarro = (dados) => {
    setCarroConfirmado(true)
    atualizarCliente({
      ...Cliente,
      placa: dados.placa,
    })
    setShowModalCarro(false)
  }

  const buscarPecasComRobo = async (listaPecas) => {
    try {
      setBuscandoPecas(true)
      setLoadingPecas(true)

      const res = await buscarPecasNoRobo(listaPecas)
      const data = await res.json()

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

  const adicionarPecaDoRobo = (peca) => {
    adicionarPeca(peca)
    setMensagem(`✅ ${peca.nomePeca} adicionado ao orçamento!`)
  }

  return {
    showModalCarro,
    setShowModalCarro,
    dadosCarroBuscado,
    carroConfirmado,
    loadingCarro,
    pecasEncontradas,
    loadingPecas,
    buscandoPecas,
    buscarCarroComRobo,
    confirmarDadosCarro,
    buscarPecasComRobo,
    adicionarPecaDoRobo,
  }
}

function useClienteLookup({ buscarPorPlaca, atualizarPlaca, atualizarNome, atualizarTelefone, atualizarEmail, atualizarId, setMensagem }) {
  const buscarCliente = async (params) => {
    try {
      const placaNormalized = params.replace(/[^A-Za-z0-9]/g, "")

      if (placaNormalized.length !== 7) return

      const res = await buscarPorPlaca(placaNormalized)

      const dadosCliente = res?.data
      if (Array.isArray(dadosCliente) && dadosCliente.length > 0) {
        const cliente = dadosCliente[0]
        atualizarPlaca(cliente.placaVeiculo)
        atualizarNome(cliente.nomeCliente)
        atualizarTelefone(cliente.telefoneCliente)
        atualizarEmail(cliente.emailCliente)
        atualizarId(cliente.id)
      } else {
        console.log("⚠️ Cliente não encontrado ou servidor não respondeu")
      }
    } catch (error) {
      setMensagem("❌ Não foi possível buscar o cliente pelo veículo.")
      console.log("❌ Erro ao buscar cliente:", error)
    }
  }

  return { buscarCliente }
}

function useOrcamentoSubmit({ criar, Descricao, MaoDeObra, Orcamento, atualizarIdOrcamento, navigate, setMensagem, error }) {
  const enviarOrçamento = async (e) => {
    e.preventDefault()

    if (!descricaoValida(Descricao)) {
      setMensagem("Descrição deve ter pelo menos 5 caracteres")
      return
    }
    if (!valorPositivo(MaoDeObra)) {
      setMensagem("Valor de mão de obra inválido")
      return
    }

    const res = await criar(Orcamento)
    const idCriado = res?.data?.id

    if (idCriado) {
      atualizarIdOrcamento(idCriado)
    }

    if (res?.status === 201) {
      setMensagem("Orçamento cadastrado com sucesso!")
      setTimeout(() => {
        navigate("/visualizar-orcamento")
      }, 2500)
    } else {
      setMensagem("Erro ao cadastrar")
      console.log("Erro do cliente:", error)
    }
  }

  return { enviarOrçamento }
}

const CardCriarOrcamentoCliente = () => {
  const navigate = useNavigate();

  const { buscarPorPlaca } = useClienteService()
  const { criar, error, loading } = useOrcamentoService()
  const [mensagem, setMensagem] = useState("")

  const { Placa, Nome, Telefone, Email, Id, atualizarCliente, atualizarId, atualizarPlaca, atualizarNome, atualizarTelefone, atualizarEmail, Cliente } = useClienteContext()

  const { Orcamento, Descricao, MaoDeObra, Pecas, atualizarDescricao, atualizarMaoDeObra, atualizarIdOrcamento, adicionarPeca, removerPeca, totalPecas, total } = useOrcamentoContext()

  const pecasLista = Array.isArray(Pecas) ? Pecas : []
  const valorMaoDeObra = Number(MaoDeObra || 0)
  const valorTotalPecas = Number(totalPecas() || 0)
  const valorTotal = Number(total() || 0)

  const [textoPecas, setTextoPecas] = useState("");

  const { showModalCarro, setShowModalCarro, dadosCarroBuscado, carroConfirmado, loadingCarro, pecasEncontradas, loadingPecas, buscandoPecas, buscarCarroComRobo, confirmarDadosCarro, buscarPecasComRobo, adicionarPecaDoRobo } = useRoboBusca({
    atualizarCliente,
    Cliente,
    adicionarPeca,
    setMensagem,
  })

  const { buscarCliente } = useClienteLookup({
    buscarPorPlaca,
    atualizarPlaca,
    atualizarNome,
    atualizarTelefone,
    atualizarEmail,
    atualizarId,
    setMensagem,
  })

  const { enviarOrçamento } = useOrcamentoSubmit({
    criar,
    Descricao,
    MaoDeObra,
    Orcamento,
    atualizarIdOrcamento,
    navigate,
    setMensagem,
    error,
  })

  const pecaRef = useRef()

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
              disabled={loadingCarro || !Placa || Placa.length < 7}
            >
              {loadingCarro ? "⏳ Buscando..." : "🤖 Buscar Carro"}
            </button>

            <input
              type="text"
              placeholder="João Silva"
              value={Nome || ""}
              onChange={(e) =>
                atualizarNome(e.target.value)
              }
            />

            <input
              type="text"
              placeholder="(11) 98765-4321"
              value={Telefone || ""}
              onChange={(e) =>
                atualizarTelefone(e.target.value)
              }
            />

            <input
              type="text"
              placeholder="exemplo@gmail.com"
              value={Email || ""}
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
            pecasLista.map((item, index) => (
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
              <strong>R$ {valorTotalPecas.toFixed(2)}</strong>
            </div>

            <div>
              <span>Mão de Obra</span>
              <strong>R$ {valorMaoDeObra.toFixed(2)}</strong>
            </div>

            <div>
              <span>Total</span>
              <strong>R$ {valorTotal.toFixed(2)}</strong>
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