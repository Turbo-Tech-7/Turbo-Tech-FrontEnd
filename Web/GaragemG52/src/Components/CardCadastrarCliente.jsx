// Hooks
import { useCallback, useEffect, useState } from "react"

//Router
import { Link, useNavigate } from "react-router-dom"

//Styles
import "./css/CardCadastrarCliente.css"

//Imagens
import userIcon from "../assets/user.png"
import cccazul from "../assets/ccc-azul.png"

// Hooks personalizados
import { verificarPlacaFormatada, nomeValido, verificarTelefone, verificarEmail } from "../hooks/utils"
import { useClienteContext } from "../hooks/useClienteContext"
import { useFetch } from "../hooks/useFetch"

function useCadastroCliente() {
  const { Placa, Nome, Telefone, Email, atualizarId, atualizarPlaca, atualizarNome, atualizarTelefone, atualizarEmail, Cliente } = useClienteContext()
  const { httpConfig, error, loading } = useFetch()
  const navigate = useNavigate()
  const [mensagem, setMensagem] = useState("")

  async function validarCliente() {
    if (!verificarPlacaFormatada(Placa)) {
      setMensagem("Placa inválida")
      return false
    }
    if (!nomeValido(Nome)) {
      setMensagem("Nome inválido")
      return false
    }
    if (!verificarTelefone(Telefone)) {
      setMensagem("Telefone inválido")
      return false
    }
    if (!verificarEmail(Email)) {
      setMensagem("Email inválido")
      return false
    }

    return true
  }

  async function handleSubmit() {
    setMensagem("")

    const ok = await validarCliente()
    if (!ok) return

    try {
      const resClienteVeiculo = await httpConfig("POST", "clientes-veiculos", Cliente)
      const dataReq = resClienteVeiculo.data

      atualizarId(dataReq.id)

      if (resClienteVeiculo.status == 201) {
        setMensagem("Cadastro realizado com sucesso!")
        setTimeout(() => { navigate("/criar-orcamento-cliente") }, 2000)
      } else {
        setMensagem("Erro ao cadastrar Cliente")
        console.log("Erro do cliente:", error)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const procurarCliente = useCallback(async (params) => {
    try {
      if (!params) return
      const placaNormalized = params.replace(/[^A-Za-z0-9]/g, "")
      if (placaNormalized.length === 7) {
        await httpConfig("GET", "clientes-veiculos/buscar-placa", null, { placa: placaNormalized })
      }
    } catch (error) {
      console.log(error)
    }
  }, [httpConfig])

  useEffect(() => {
    procurarCliente(Placa)
  }, [Placa, procurarCliente])

  return {
    Placa,
    Nome,
    Telefone,
    Email,
    atualizarPlaca,
    atualizarNome,
    atualizarTelefone,
    atualizarEmail,
    mensagem,
    loading,
    handleSubmit,
  }
}

const CardCadastrarCliente = () => {
  const {
    Placa,
    Nome,
    Telefone,
    Email,
    atualizarPlaca,
    atualizarNome,
    atualizarTelefone,
    atualizarEmail,
    mensagem,
    loading,
    handleSubmit,
  } = useCadastroCliente()

  return (
    <div className="ccc_container">

      <div className="ccc_top_bar">
        <div className="ccc_top_left">
          <img src={cccazul} alt="" className="ccc_top_icon" />
          <div>
            <h3>Cadastrar Cliente</h3>
            <p>Criar novo cadastro de cliente</p>
          </div>
        </div>

        <Link to="/criar-orcamento" className="ccc_link">
          Voltar
        </Link>
      </div>

      <div className="ccc_card">

        <div className="ccc_icon">
          <img src={userIcon} alt="" />
        </div>

        <h2 className="ccc_title">Cadastrar Cliente</h2>

        <div className="ccc_form">

          <div className="ccc_grid">
            <div className="ccc_input_group">
              <label>Placa do Veículo</label>
              <input onChange={(e) => {
                atualizarPlaca(e.target.value)
              }}
                placeholder="Ex: ABC-1234"
                value={Placa || ""}
              />
            </div>

            <div className="ccc_input_group">
              <label>Nome do Cliente</label>
              <input value={Nome || ""} onChange={(e) => { atualizarNome(e.target.value) }} placeholder="Ex: João Silva" />
            </div>

            <div className="ccc_input_group">
              <label>Telefone</label>
              <input value={Telefone || ""} onChange={(e) => { atualizarTelefone(e.target.value) }} placeholder="Ex: (11)98765-4321" />
            </div>

            <div className="ccc_input_group">
              <label>Email</label>
              <input value={Email || ""} onChange={(e) => { atualizarEmail(e.target.value) }} placeholder="Ex: joao@gmail.com" />
            </div>
          </div>

          {loading ? <p id="carregando">Carregando...</p> : ""}
          {mensagem ? <p id="mensagem">{mensagem}</p> : ""}

          <button className="ccc_button" onClick={handleSubmit}>
            Cadastrar Cliente
          </button>

        </div>

      </div>
    </div>
  )
}

export default CardCadastrarCliente