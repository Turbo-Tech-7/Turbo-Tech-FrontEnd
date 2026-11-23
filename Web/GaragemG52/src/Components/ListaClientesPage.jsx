import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import BuscarClientesImg from "../assets/BuscarClientes.png"
import { useClienteService } from "../services/clienteService"
import "./css/BuscarClientesPage.css"

function ListaClientesPage() {
  const location = useLocation()

  const { remover: removerCliente, loading } = useClienteService()

  const [resultados, setResultados] = useState(
    location.state?.resultados || []
  )

  const [mensagem, setMensagem] = useState("")
  const [modalCliente, setModalCliente] = useState(null)
  const [clienteVisualizado, setClienteVisualizado] = useState(null)

  const filtro = location.state?.filtro || ""

  const exibirMensagem = (msg) => {
    setMensagem(msg)
    setTimeout(() => setMensagem(""), 4000)
  }

  const confirmarExclusao = (cliente) => {
    setModalCliente(cliente)
  }

  const visualizarCliente = (cliente) => {
    setClienteVisualizado(cliente)
  }

  const cancelarExclusao = () => {
    setModalCliente(null)
  }

  const excluir = async () => {
    if (!modalCliente) return

    const res = await removerCliente(modalCliente.id)

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
                  Telefone: {c.telefoneCliente || "Não informado"}
                </span>

                <span className="bcp_result_info">
                  Email: {c.emailCliente || "Não informado"}
                </span>

              </div>

              <div className="bcp_result_right">
                <span className="bcp_result_placa">
                  {c.placaVeiculo || "—"}
                </span>

                <button
                  type="button"
                  className="bcp_btn_visualizar"
                  onClick={() => visualizarCliente(c)}
                >
                  Visualizar
                </button>

                <button
                  type="button"
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

      {clienteVisualizado && (
        <div
          className="bcp_modal_overlay bcp_profile_overlay"
          onClick={() => setClienteVisualizado(null)}
        >
          <section
            className="bcp_profile_modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="bcp_profile_title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="bcp_profile_header">
              <div>
                <h3 id="bcp_profile_title">Perfil do Cliente</h3>
                <p>Informações pessoais e do veículo</p>
              </div>
              <button
                type="button"
                className="bcp_profile_close"
                onClick={() => setClienteVisualizado(null)}
                aria-label="Fechar perfil do cliente"
              >
                ×
              </button>
            </div>

            <div className="bcp_profile_section">
              <h4>Dados pessoais</h4>
              <div className="bcp_profile_row">
                <span>Nome</span>
                <strong>{clienteVisualizado.nomeCliente || "Não informado"}</strong>
              </div>
              <div className="bcp_profile_row">
                <span>Email</span>
                <strong>{clienteVisualizado.emailCliente || "Não informado"}</strong>
              </div>
              <div className="bcp_profile_row">
                <span>Telefone</span>
                <strong>{clienteVisualizado.telefoneCliente || "Não informado"}</strong>
              </div>
            </div>

            <div className="bcp_profile_section">
              <h4>Veículo</h4>
              <div className="bcp_profile_row">
                <span>Placa</span>
                <strong>
                  {clienteVisualizado.placaVeiculo || clienteVisualizado.veiculo?.placa || "Não informado"}
                </strong>
              </div>
              <div className="bcp_profile_row">
                <span>Modelo</span>
                <strong>
                  {clienteVisualizado.modeloVeiculo ||
                    [clienteVisualizado.veiculo?.marca, clienteVisualizado.veiculo?.modelo]
                      .filter(Boolean)
                      .join(" ") ||
                    "Não informado"}
                </strong>
              </div>
              <div className="bcp_profile_row">
                <span>Ano</span>
                <strong>{clienteVisualizado.veiculo?.ano || "Não informado"}</strong>
              </div>
              <div className="bcp_profile_row">
                <span>Cor</span>
                <strong>{clienteVisualizado.veiculo?.cor || "Não informado"}</strong>
              </div>
            </div>

            <button
              type="button"
              className="bcp_profile_done"
              onClick={() => setClienteVisualizado(null)}
            >
              Fechar
            </button>
          </section>
        </div>
      )}

      {modalCliente && (
        <div
          className="bcp_modal_overlay"
          onClick={cancelarExclusao}
        >
          <div className="bcp_modal" onClick={(event) => event.stopPropagation()}>
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