import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import BuscarClientesImg from "../assets/BuscarClientes.png"
import { useFetch } from "../hooks/useFetch"
import "./css/BuscarClientesPage.css"

const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080"

const BuscarClientesPage = () => {
  const { httpConfig, loading } = useFetch(BASE_URL)

  const navigate = useNavigate()

  const [nome, setNome] = useState("")
  const [placa, setPlaca] = useState("")
  const [mensagem, setMensagem] = useState("")

  const exibirMensagem = (msg) => {
    setMensagem(msg)

    setTimeout(() => {
      setMensagem("")
    }, 4000)
  }

  const buscar = async () => {
    let res = null

    if (nome.trim()) {
      res = await httpConfig(
        "GET",
        "clientes-veiculos/buscar-nome",
        null,
        {
          nome: nome.trim(),
        }
      )
    }

    else if (placa.trim()) {
      res = await httpConfig(
        "GET",
        "clientes-veiculos/buscar-placa",
        null,
        {
          placa: placa.trim().toUpperCase(),
        }
      )
    }

    else {
      res = await httpConfig("GET", "clientes-veiculos")
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

      {mensagem && (
        <div className="bcp_mensagem">
          {mensagem}
        </div>
      )}

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