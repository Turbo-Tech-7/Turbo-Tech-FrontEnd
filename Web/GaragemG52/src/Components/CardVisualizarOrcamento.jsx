import { Link, useLocation } from "react-router-dom"
import { useState } from "react"
import criardoc from "../assets/criardoc.png"
import "./css/CardVisualizarOrcamento.css"
import { useFetch } from "../hooks/useFetch"

const CardVisualizarOrcamento = () => {
  const url = "http://localhost:8080"
  
  const location = useLocation()
  
  const { data, httpConfig, error, loading } = useFetch(url)

  const [mensagem, setMensagem] = useState()

  const [mostrarAviso, setMostrarAviso] = useState(false)
  const [mensagemAviso, setMensagemAviso] = useState("")
  
  const mostrarMensagem = (mensagem) => {
    setMensagemAviso(mensagem)
    setMostrarAviso(true)
    
    setTimeout(() => {
      setMostrarAviso(false)
    }, 5000)
  }
  
  let dadosOrcamentos = location.state
  const [Orcamento, setOrcamento] = useState(
    dadosOrcamentos
  )

  console.log(Orcamento)
  
  let maoDeObra = Number(Orcamento.Orcamento.DadosValor.maoDeObra)

  async function gerarPDF() {
  try {
    const res = await httpConfig(
      "GET",
      `orcamentos/${Orcamento.Orcamento.idOrcamento}/pdf`
    );

    console.log(res);

    if (res.status === 200) {
      // cria URL temporária do PDF
      const pdfUrl = window.URL.createObjectURL(res.data);

      // cria link invisível para download
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = `orcamento-${Orcamento.Orcamento.idOrcamento}.pdf`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // limpa memória
      window.URL.revokeObjectURL(pdfUrl);

      setMensagem("Baixando PDF com sucesso!");
    } else {
      setMensagem("Erro ao baixar PDF");
      console.log("Erro do cliente:", error);
    }

  } catch (err) {
    setMensagem("Erro ao baixar PDF");
    console.log("Erro ao gerar PDF:", err);
  }
}

  return (
    <div className="cvo_container">

      <div className="cvo_top_bar">
        <div className="cvo_top_left">
          <img src={criardoc} className="cvo_icon" />

          <div>
            <h3>Visualização de Orçamento</h3>
            <p>Detalhes do orçamento</p>
          </div>
        </div>

        <Link to="/home" className="cvo_link">
          Voltar
        </Link>
      </div>

      {
        mostrarAviso && (
          <div className="cvo_alert">
            <strong>Ação realizada!</strong>
            <p>{mensagemAviso}</p>
          </div>
        )
      }

      <div className="cvo_card">

        <div className="cvo_header_card">

          <div className="cvo_header_text">
            <h2>Orçamento #0001</h2>
            <p>15 de dezembro 2025</p>
            <span>Status: Aberto</span>
          </div>

          <button className="cvo_edit">
            Editar
          </button>

        </div>

        <div className="cvo_box">

          <h4>ℹ Informações do Cliente</h4>

          <div className="cvo_row">
            <span>Placa do Veículo</span>
            <span>{Orcamento.Orcamento.DadosCliente.placa
 || ""}</span>
          </div>

          <div className="cvo_row">
            <span>Nome do Cliente</span>
            <span>{Orcamento.Orcamento.DadosCliente.nome || ""}</span>
          </div>

          <div className="cvo_row">
            <span>Telefone</span>
            <span>{Orcamento.Orcamento.DadosCliente.telefone || ""}</span>
          </div>

          <div className="cvo_row">
            <span>Email</span>
            <span>{Orcamento.Orcamento.DadosCliente.email || ""}</span>
          </div>

          <div className="cvo_row">
            <span>Modelo do Veículo</span>
            <span>{Orcamento.Orcamento.DadosCliente.modelo || ""}</span>
          </div>

        </div>

        <div className="cvo_box">

          <h4>ℹ Detalhes do Serviço</h4>

          <div className="cvo_row">
            <span>Peça/Material</span>
            <div style={{
              display: "flex",
              flexDirection: "column",
              }}>
  
              {Orcamento.Orcamento.itens[0]?.map(item => (
                <span key={item.id}>
                  {item.nome} (R$ {Number(item.valor).toFixed(2)}) - Fornecedor: <a href={item.fornecedor}>Link</a> - Quantidade: {item.quantidade}
                </span>
              ))}

            </div>
          </div>

          <div className="cvo_row">
            <span>Valor da Peça(s)</span>
            <span>R$ {Number(Orcamento.Orcamento.DadosValor.totalPecas).toFixed(2)}</span>
          </div>

          <div className="cvo_row">
            <span>Valor da Mão de obra</span>
            <span>R$ {Number(Orcamento.Orcamento.DadosValor.maoDeObra).toFixed(2)}</span>
          </div>

          <div className="cvo_row total">
            <span>Total:</span>
            <span>R$ {Number(maoDeObra + Orcamento.Orcamento.DadosValor.totalPecas).toFixed(2)}</span>
          </div>

        </div>
        {loading ? <p id="carregando">Carregando...</p> : ""}
        {mensagem ? <p id="mensagem">{mensagem}</p> : ""}
        <div className="cvo_actions">

          <button
            className="cvo_button"
            onClick={() =>
              gerarPDF()
            }
          >
            Gerar PDF
          </button>

          <button
            className="cvo_button"
            onClick={() =>
              mostrarMensagem("O orçamento foi enviado por email para João Silva.")
            }
          >
            Enviar para cliente
          </button>

        </div>

        <Link
          to="/cancelar-orcamento"
          className="cvo_button full"
        >
          Cancelar Orçamento
        </Link>

      </div>
    </div>
  )
}

export default CardVisualizarOrcamento