//Hook
import { useState } from "react"

//Router
import { Link, useNavigate } from "react-router-dom"

//Imagens
import criardoc from "../assets/criardoc.png"

// Style
import "./css/CardVisualizarOrcamento.css"

// Hook personalizado
import { useFetch } from "../hooks/useFetch"
import { useOrcamentoContext } from "../hooks/useOrcamentoContext"
import { useClienteContext } from "../hooks/useClienteContext"

const CardVisualizarOrcamento = () => {

  const navigate = useNavigate()
  
  const { Descricao, MaoDeObra, Pecas, IdOrcamento , totalPecas, total } = useOrcamentoContext()
  const {Placa, Nome, Telefone, Email, Id, Cliente} = useClienteContext()


  const { data, httpConfig, error, loading } = useFetch()

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

  async function gerarPDF() {
  try {
    const res = await httpConfig(
      "GET",
      `orcamentos/${IdOrcamento}/pdf`
    );

    if (res.status === 200) {
      // cria URL temporária do PDF
      const pdfUrl = window.URL.createObjectURL(data);

      // cria link invisível para download
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = `orcamento-${IdOrcamento}.pdf`;

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

 async function mandarPDF() {
    try {
      const res = await httpConfig(
      "POST",
      `orcamentos/${IdOrcamento}/pdf/email`
    );

    if(res.status == 200){
      setMensagem("O orçamento foi enviado por email para " + Email)
    }
    } catch (err) {
    setMensagem("Erro ao mandar PDF");
    console.log("Erro ao mandar PDF:", err);
    }
 }

 function CancelarOrcamento(){
    setTimeout(() => { navigate("/cancelar-orcamento")}, 2500)
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
            <h2>Orçamento</h2>
            <span>Status: Aberto</span>
          </div>

          <button className="cvo_edit">
            Voltar
          </button>

        </div>

        <div className="cvo_box">

          <h4>ℹ Informações do Cliente</h4>

          <div className="cvo_row">
            <span>Placa do Veículo</span>
            <span>{Placa || "-"}</span>
          </div>

          <div className="cvo_row">
            <span>Nome do Cliente</span>
            <span>{Nome || "-"}</span>
          </div>

          <div className="cvo_row">
            <span>Telefone</span>
            <span>{Telefone || "-"}</span>
          </div>

          <div className="cvo_row">
            <span>Email</span>
            <span>{Email || "-"}</span>
          </div>

          <div className="cvo_row">
            <span>Modelo do Veículo</span>
            <span>{"-"}</span>
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
  
              {Pecas ? Pecas?.[0]?.map(item => (
                <span key={item.id}>
                  {item.nome} (R$ {Number(item.valor).toFixed(2)}) - Fornecedor: <a href={item.fornecedor}>Link</a> - Quantidade: {item.quantidade}
                </span>
              )) : "-"}

            </div>
          </div>

          <div className="cvo_row">
            <span>Valor da Peça(s)</span>
            <span>R$ {totalPecas ? Number(totalPecas).toFixed(2) : 0}</span>
          </div>

          <div className="cvo_row">
            <span>Valor da Mão de obra</span>
            <span>R$ {MaoDeObra ? Number(MaoDeObra).toFixed(2) : 0}</span>
          </div>

          <div className="cvo_row total">
            <span>Total:</span>
            <span>R$ {total ? Number(total).toFixed(2) : 0}</span>
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
            onClick={() =>{
              mostrarMensagem("O orçamento foi enviado por email para " + Email)
              mandarPDF()
            }
            }
          >
            Enviar para cliente
          </button>

        </div>

        <button
          type="button"
          className="cvo_button full"
          onClick={() => CancelarOrcamento()}
        >
          Cancelar Orçamento
        </button>

      </div>
    </div>
  )
}

export default CardVisualizarOrcamento