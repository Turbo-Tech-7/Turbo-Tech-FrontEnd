import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import BuscarClientesImg from "../assets/BuscarClientes.png"
import { clienteService } from "../services/clienteService"
import "./css/BuscarClientesPage.css"

const BuscarClientesPage = () => {
  const {buscarPorNome, buscarPorPlaca, listarClientes, loading} = clienteService()

  const navigate = useNavigate()

  const [nome, setNome] = useState("")
  const [placa, setPlaca] = useState("")
  const [mensagem, setMensagem] = useState("")

  const buscar = async (event) => {
    event.preventDefault()
    setMensagem("")

    try {
      let res
      let filtro

      if (nome.trim()) {
        res = await buscarPorNome(nome.trim())
        filtro = `Nome: ${nome.trim()}`
      } else if (placa.trim()) {
        res = await buscarPorPlaca(placa.trim().toUpperCase())
        filtro = `Placa: ${placa.trim().toUpperCase()}`
      } else {
        res = await listarClientes()
        filtro = "Todos os Clientes"
      }

      if (res?.error) {
        setMensagem("Não foi possível buscar os clientes. Tente novamente.")
        return
      }

      const dados = res?.data ?? res
      const lista = Array.isArray(dados)
        ? dados
        : dados
          ? [dados]
          : []

      navigate("/lista-clientes", {
        state: {
          resultados: lista,
          filtro,
        },
      })
    } catch (error) {
      console.error("Erro ao buscar clientes:", error)
      setMensagem("Ocorreu um erro ao buscar os clientes.")
    }
  }

  return (
    <div className="bcp_container">

      <div className="bcp_top_bar">
        <div className="bcp_top_left">

          <div className="bcp_top_icon">
            <img
              src={BuscarClientesImg}
              alt="Buscar Clientes"
            />
          </div>

          <div>
            <h3>Buscar Clientes</h3>
            <p>Consultar clientes existentes</p>
          </div>

        </div>

        <Link
          to="/home"
          className="bcp_link"
        >
          Voltar
        </Link>
      </div>

      <div className="bcp_card">

        <div className="bcp_card_icon">
          <img
            src={BuscarClientesImg}
            alt="ícone"
          />
        </div>

        <div className="bcp_card_header">
          <h2>Buscar Cliente</h2>
          <p>Busque por nome ou placa, ou deixe os campos vazios para listar todos</p>
        </div>

        <form className="bcp_form" onSubmit={buscar}>

          <div className="bcp_field">
            <label>Placa do Veículo</label>

            <input
              type="text"
              placeholder="EX: ABC-1234"
              value={placa}
              onChange={(e) =>
                setPlaca(e.target.value)
              }
              maxLength={8}
            />
          </div>

          <div className="bcp_field">
            <label>Nome do Cliente</label>

            <input
              type="text"
              placeholder="EX: João Silva"
              value={nome}
              onChange={(e) =>
                setNome(e.target.value)
              }
            />
          </div>

          <button
            type="submit"
            className="bcp_btn"
            disabled={loading}
          >
            {loading
              ? "Buscando..."
              : "Realizar Busca"}
          </button>

          {mensagem && <p className="bcp_search_error" role="alert">{mensagem}</p>}
        </form>
      </div>
    </div>
  )
}

export default BuscarClientesPage