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

  const buscar = async () => {
    let res = null

    if (nome.trim()) {
      res = await buscarPorNome(nome.trim())
      console.log("Pesquisa por nome")
    }
    else if (placa.trim()) {
      res = await buscarPorPlaca(placa.trim().toUpperCase())
      console.log(res)
      console.log("Pesquisa por placa")
    }

    else {
      res = listarClientes()
    }

    const lista = res?.data
      ? Array.isArray(res.data)
        ? res.data
        : [res.data]
      : []

    navigate("/lista-clientes", {
      state: {
        resultados: lista,

        filtro: nome.trim()
          ? `Nome: ${nome}`
          : placa.trim()
          ? `Placa: ${placa}`
          : "Todos os Clientes",
      },
    })
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
          <p>Preencha pelo menos um campo</p>
        </div>

        <div className="bcp_form">

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
            className="bcp_btn"
            onClick={buscar}
            disabled={loading}
          >
            {loading
              ? "Buscando..."
              : "Realizar Busca"}
          </button>

        </div>
      </div>
    </div>
  )
}

export default BuscarClientesPage