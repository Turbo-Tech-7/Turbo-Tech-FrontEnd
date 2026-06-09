import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import BuscarClientesImg from "../assets/BuscarClientes.png"
import { useFetch } from "../hooks/useFetch"
import "./css/BuscarClientesPage.css"

const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080"

function ListaClientesPage() {
  const location = useLocation()

  const { httpConfig, loading } = useFetch(BASE_URL)

  const [resultados, setResultados] = useState(
    location.state?.resultados || []
  )

  const [mensagem, setMensagem] = useState("")
  const [modalCliente, setModalCliente] = useState(null)

  const filtro = location.state?.filtro || ""

  const exibirMensagem = (msg) => {
    setMensagem(msg)
    setTimeout(() => setMensagem(""), 4000)
  }

  const confirmarExclusao = (cliente) => {
    setModalCliente(cliente)
  }

  const cancelarExclusao = () => {
    setModalCliente(null)
  }

  const excluir = async () => {
    if (!modalCliente) return

    const res = await httpConfig(
      "DELETE",
      `clientes-veiculos/${modalCliente.id}`
    )

    setModalCliente(null)

    if (res?.status === 204 || res?.status === 200) {
      exibirMensagem("Cliente removido com sucesso.")

      setResultados((prev) =>
        prev.filter((c) => c.id !== modalCliente.id)
      )
    } else {
      exibirMensagem("Erro ao remover cliente.")
    }
  }

  return (
    <div className="bcp_container">
      {/* TOAST */}
      {mensagem && (
        <div className="bcp_mensagem">
          {mensagem}
        </div>
      )}

      {/* TOP BAR */}
      <div className="bcp_top_bar">
        <div className="bcp_top_left">
          <div className="bcp_top_icon">
            <img
              src={BuscarClientesImg}
              alt="Buscar Clientes"
            />
          </div>

          <div>
            <h3>Consulta de Clientes</h3>
            <p>{filtro}</p>
          </div>
        </div>

        <Link
          to="/buscar-clientes"
          className="bcp_link"
        >
          Voltar
        </Link>
      </div>

      {/* RESULTS */}
      <div className="bcp_results_card">
        <h3 className="bcp_results_title">
          Clientes Encontrados
        </h3>

        {loading && (
          <p className="bcp_loading">
            Carregando...
          </p>
        )}

        {!loading && resultados.length === 0 && (
          <p className="bcp_empty">
            Nenhum cliente encontrado.
          </p>
        )}

        {!loading &&
          resultados.map((c) => (
            <div
              key={c.id}
              className="bcp_result_item"
            >
              <div className="bcp_result_left">
                <span className="bcp_result_nome">
                  {c.nomeCliente || "—"}
                </span>

                <span className="bcp_result_info">
                  {c.telefoneCliente ||
                    "Sem telefone"}

                  {c.emailCliente
                    ? ` • ${c.emailCliente}`
                    : ""}
                </span>

                <span className="bcp_result_info">
                  {c.modeloVeiculo || ""}
                </span>
              </div>

              <div className="bcp_result_right">
                <span className="bcp_result_placa">
                  {c.placaVeiculo || "—"}
                </span>

                <button
                  className="bcp_btn_excluir"
                  onClick={() =>
                    confirmarExclusao(c)
                  }
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* MODAL */}
      {modalCliente && (
        <div className="bcp_modal_overlay">
          <div className="bcp_modal">
            <h3>Remoção de Cliente</h3>

            <p>
              confirmar exclusão do cliente?
            </p>

            <p
              style={{
                fontSize: 12,
                color: "#aaa",
              }}
            >
              Selecione uma opção para
              continuar
            </p>

            <button
              className="bcp_modal_btn confirm"
              onClick={excluir}
              disabled={loading}
            >
              <span className="bcp_modal_icon">
                ✓
              </span>

              Sim, confirmar exclusão
            </button>

            <button
              className="bcp_modal_btn danger"
              onClick={cancelarExclusao}
            >
              <span className="bcp_modal_icon">
                ✕
              </span>

              Não, cancelar exclusão
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ListaClientesPage