//Hook
import { useEffect, useState } from "react"

//Router
import { Link, useLocation, useNavigate } from "react-router-dom"

//Imagens
import criardoc from "../assets/criardoc.png"

// Style
import "./css/CardVisualizarOrcamento.css"

// Hook personalizado
import { useOrcamentoService } from "../services/orcamentoService"
import { useOrcamentoContext } from "../hooks/useOrcamentoContext"
import { useClienteContext } from "../hooks/useClienteContext"

const normalizarUrlHttp = (valor) => {
  try {
    const url = new URL(valor)
    return url.protocol === "http:" || url.protocol === "https:" ? url.href : null
  } catch {
    return null
  }
}

const CardVisualizarOrcamento = () => {

  const location = useLocation()
  const navigate = useNavigate()

  const {
    Orcamento,
    OrcamentoSelecionado,
    setOrcamentoSelecionado,
    Descricao,
    MaoDeObra,
    Pecas,
    IdOrcamento,
    totalPecas,
  } = useOrcamentoContext()
  const { Placa, Nome, Telefone, Email, Modelo, Cliente } = useClienteContext()

  const orcamentoDoContexto = {
    ...Orcamento,
    id: Orcamento.id ?? IdOrcamento,
    nomeCliente: Orcamento.nomeCliente ?? Nome,
    telefoneCliente: Orcamento.telefoneCliente ?? Telefone,
    emailCliente: Orcamento.emailCliente ?? Email,
    descricaoServico: Orcamento.descricaoServico ?? Descricao,
    valorMaoDeObra: Orcamento.valorMaoDeObra ?? MaoDeObra,
    itens: Orcamento.itens ?? Pecas,
    veiculo: Orcamento.veiculo ?? {
      placa: Placa,
      marca: Modelo,
    },
    clienteVeiculo: Orcamento.clienteVeiculo ?? Cliente,
  }
  const orcamentoInicial = location.state?.Orcamento ??
    (Orcamento.idOrcamento ? orcamentoDoContexto : OrcamentoSelecionado ?? orcamentoDoContexto)
  const [orcamentoAtual, setOrcamentoAtual] = useState(orcamentoInicial)
  const [rascunho, setRascunho] = useState(null)
  const [editando, setEditando] = useState(false)
  const [salvando, setSalvando] = useState(false)


  const { gerarPdf, enviarPdfPorEmail, atualizarOrçamento, error, loading } = useOrcamentoService()

  const [mensagem, setMensagem] = useState()

  const [mostrarAviso, setMostrarAviso] = useState(false)
  const [mensagemAviso, setMensagemAviso] = useState("")
  const resultados = orcamentoAtual
  const itens = Array.isArray(resultados.itens) ? resultados.itens : []
  const itensRascunho = rascunho?.itens ?? []
  const valorMaoDeObra = Number(editando ? rascunho.valorMaoDeObra : resultados.valorMaoDeObra ?? MaoDeObra) || 0
  const valorPecas = (editando ? itensRascunho : itens).reduce(
    (soma, item) => soma + (Number(item.valor) || 0) * (Number(item.quantidade) || 0),
    0
  )
  const valorTotal = valorPecas + valorMaoDeObra

  useEffect(() => {
    if (location.state?.Orcamento) {
      setOrcamentoAtual(location.state.Orcamento)
    }
  }, [location.state])

  useEffect(() => {
    setOrcamentoSelecionado(orcamentoAtual)
  }, [orcamentoAtual, setOrcamentoSelecionado])

  const iniciarEdicao = () => {
    const cliente = resultados.clienteVeiculo ?? {}
    const veiculo = resultados.veiculo ?? {}

    setMensagem("")
    setRascunho({
      nomeCliente: resultados.nomeCliente ?? cliente.nomeCliente ?? Nome ?? "",
      telefoneCliente: resultados.telefoneCliente ?? cliente.telefoneCliente ?? Telefone ?? "",
      emailCliente: resultados.emailCliente ?? cliente.emailCliente ?? Email ?? "",
      placa: veiculo.placa ?? cliente.placaVeiculo ?? Placa ?? "",
      marca: veiculo.marca ?? "",
      modelo: veiculo.modelo ?? cliente.modeloVeiculo ?? Modelo ?? "",
      ano: veiculo.ano ?? "",
      cor: veiculo.cor ?? "",
      descricaoServico: resultados.descricaoServico ?? Descricao ?? "",
      valorMaoDeObra: resultados.valorMaoDeObra ?? MaoDeObra ?? 0,
      itens: itens.map((item) => ({
        ...item,
        nomePeca: item.nomePeca ?? "",
        fornecedor: item.fornecedor ?? "",
        valor: item.valor ?? 0,
        quantidade: item.quantidade ?? 1,
      })),
    })
    setEditando(true)
  }

  const atualizarRascunho = (campo, valor) => {
    setRascunho((atual) => ({ ...atual, [campo]: valor }))
  }

  const atualizarItem = (index, campo, valor) => {
    setRascunho((atual) => ({
      ...atual,
      itens: atual.itens.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [campo]: valor } : item
      ),
    }))
  }

  const adicionarItem = () => {
    setRascunho((atual) => ({
      ...atual,
      itens: [
        ...atual.itens,
        {
          pecaId: null,
          nomePeca: "",
          fornecedor: "",
          valor: "",
          quantidade: 1,
        },
      ],
    }))
  }

  const removerItem = (indexRemover) => {
    setRascunho((atual) => ({
      ...atual,
      itens: atual.itens.filter((_, index) => index !== indexRemover),
    }))
  }

  const cancelarEdicao = () => {
    setRascunho(null)
    setEditando(false)
    setMensagem("")
  }

  const salvarEdicao = async (event) => {
    event.preventDefault()
    const id = resultados.id ?? IdOrcamento

    if (!id) {
      setMensagem("Não foi possível identificar o orçamento para atualizar.")
      return
    }

    const valorMaoDeObraAtualizado = Number(rascunho.valorMaoDeObra)
    const itensValidos = rascunho.itens.every((item) =>
      String(item.valor).trim() !== "" &&
      Number.isFinite(Number(item.valor)) &&
      Number(item.valor) >= 0 &&
      String(item.quantidade).trim() !== "" &&
      Number.isInteger(Number(item.quantidade)) &&
      Number(item.quantidade) > 0
    )

    if (
      String(rascunho.valorMaoDeObra).trim() === "" ||
      !Number.isFinite(valorMaoDeObraAtualizado) ||
      valorMaoDeObraAtualizado < 0 ||
      !itensValidos
    ) {
      setMensagem("Informe valores válidos para mão de obra, peças e quantidades.")
      return
    }

    const linksFornecedorValidos = rascunho.itens.every((item) =>
      !item.fornecedor.trim() || normalizarUrlHttp(item.fornecedor)
    )

    if (!linksFornecedorValidos) {
      setMensagem("Informe links de fornecedor válidos, iniciados por http:// ou https://.")
      return
    }

    const itensAtualizados = rascunho.itens.map((item) => ({
      ...item,
      nomePeca: item.nomePeca.trim() || null,
      fornecedor: item.fornecedor.trim() || null,
      valor: Number(item.valor),
      quantidade: Number(item.quantidade),
    }))
    const veiculoAtualizado = {
      ...(resultados.veiculo ?? {}),
      placa: rascunho.placa.trim(),
      marca: rascunho.marca.trim(),
      modelo: rascunho.modelo.trim(),
      ano: rascunho.ano === "" ? null : Number(rascunho.ano),
      cor: rascunho.cor.trim(),
    }
    const clienteAtualizado = {
      ...(resultados.clienteVeiculo ?? {}),
      nomeCliente: rascunho.nomeCliente.trim(),
      telefoneCliente: rascunho.telefoneCliente.trim(),
      emailCliente: rascunho.emailCliente.trim(),
      placaVeiculo: rascunho.placa.trim(),
      modeloVeiculo: [rascunho.marca.trim(), rascunho.modelo.trim()].filter(Boolean).join(" "),
    }
    const corpoAtualizado = {
      ...resultados,
      nomeCliente: rascunho.nomeCliente.trim(),
      telefoneCliente: rascunho.telefoneCliente.trim(),
      emailCliente: rascunho.emailCliente.trim(),
      descricaoServico: rascunho.descricaoServico.trim(),
      valorMaoDeObra: valorMaoDeObraAtualizado,
      valorTotal: itensAtualizados.reduce(
        (soma, item) => soma + item.valor * item.quantidade,
        valorMaoDeObraAtualizado
      ),
      itens: itensAtualizados,
      veiculo: veiculoAtualizado,
      clienteVeiculo: clienteAtualizado,
    }

    setSalvando(true)
    setMensagem("")

    try {
      const resposta = await atualizarOrçamento(corpoAtualizado, id)
      if (resposta?.error || (resposta?.status && resposta.status >= 400)) {
        setMensagem("Não foi possível salvar as alterações do orçamento.")
        return
      }

      setOrcamentoAtual(corpoAtualizado)
      setOrcamentoSelecionado(corpoAtualizado)
      setRascunho(null)
      setEditando(false)
      setMensagem("Orçamento atualizado com sucesso.")
    } catch (err) {
      setMensagem(err?.message || "Erro ao atualizar o orçamento.")
    } finally {
      setSalvando(false)
    }
  }
  
  const mostrarMensagem = (mensagem) => {
    setMensagemAviso(mensagem)
    setMostrarAviso(true)
    
    setTimeout(() => {
      setMostrarAviso(false)
    }, 5000)
  }

  async function gerarPDF() {
  try {
    const res = await gerarPdf(IdOrcamento)

    if (res.status === 200) {
      // cria URL temporária do PDF
      const pdfUrl = window.URL.createObjectURL(res.data);

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
      const res = await enviarPdfPorEmail(IdOrcamento)

    if(res.status == 200){
      setMensagem("O orçamento foi enviado por email para " + Email)
    }
    } catch (err) {
    setMensagem("Erro ao mandar PDF");
    console.log("Erro ao mandar PDF:", err);
    }
 }

 function CancelarOrcamento(){
    setOrcamentoSelecionado(resultados)
    navigate("/cancelar-orcamento", { state: { Orcamento: resultados } })
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
            <h2>Orçamento #{String(resultados.id).slice(-4).padStart(4, "0")}</h2>
            <span>
              Status {String(resultados.statusDescricao || resultados.status || "-")
                .toLocaleLowerCase("pt-BR")
                .replace(/^./, (letra) => letra.toLocaleUpperCase("pt-BR"))}
            </span>
          </div>

          <div className="cvo_header_actions">
            {!editando && (
              <button
                type="button"
                className="cvo_edit"
                onClick={() => navigate("/buscar-orcamentos")}
              >
                Voltar à busca
              </button>
            )}
            <button
              type="button"
              className="cvo_edit"
              onClick={editando ? cancelarEdicao : iniciarEdicao}
            >
              {editando ? "Descartar alterações" : "Editar orçamento"}
            </button>
          </div>

        </div>

        <div className="cvo_box">

          <h4>ℹ Informações do Cliente</h4>

          <div className="cvo_row">
            <span>Placa do Veículo</span>
            {editando ? (
              <input
                className="cvo_input"
                aria-label="Placa do veículo"
                value={rascunho.placa}
                onChange={(event) => atualizarRascunho("placa", event.target.value.toUpperCase())}
              />
            ) : (
              <span>{resultados.veiculo?.placa || resultados.clienteVeiculo?.placaVeiculo || Placa || "-"}</span>
            )}
          </div>

          <div className="cvo_row">
            <span>Nome do Cliente</span>
            {editando ? (
              <input
                className="cvo_input"
                aria-label="Nome do cliente"
                value={rascunho.nomeCliente}
                onChange={(event) => atualizarRascunho("nomeCliente", event.target.value)}
              />
            ) : (
              <span>{resultados.nomeCliente || resultados.clienteVeiculo?.nomeCliente || Nome || "-"}</span>
            )}
          </div>

          <div className="cvo_row">
            <span>Telefone</span>
            {editando ? (
              <input
                className="cvo_input"
                aria-label="Telefone do cliente"
                value={rascunho.telefoneCliente}
                onChange={(event) => atualizarRascunho("telefoneCliente", event.target.value)}
              />
            ) : (
              <span>{resultados.telefoneCliente || resultados.clienteVeiculo?.telefoneCliente || Telefone || "-"}</span>
            )}
          </div>

          <div className="cvo_row">
            <span>Email</span>
            {editando ? (
              <input
                className="cvo_input"
                type="email"
                aria-label="Email do cliente"
                value={rascunho.emailCliente}
                onChange={(event) => atualizarRascunho("emailCliente", event.target.value)}
              />
            ) : (
              <span>{resultados.emailCliente || resultados.clienteVeiculo?.emailCliente || Email || "-"}</span>
            )}
          </div>

          <div className="cvo_row">
            <span>Marca / modelo</span>
            {editando ? (
              <div className="cvo_input_group">
                <input
                  className="cvo_input"
                  aria-label="Marca do veículo"
                  value={rascunho.marca}
                  onChange={(event) => atualizarRascunho("marca", event.target.value)}
                  placeholder="Marca"
                />
                <input
                  className="cvo_input"
                  aria-label="Modelo do veículo"
                  value={rascunho.modelo}
                  onChange={(event) => atualizarRascunho("modelo", event.target.value)}
                  placeholder="Modelo"
                />
              </div>
            ) : (
              <span>
                {[resultados.veiculo?.marca, resultados.veiculo?.modelo]
                  .filter(Boolean)
                  .join(" ") || resultados.clienteVeiculo?.modeloVeiculo || Modelo || "-"}
              </span>
            )}
          </div>

          {(editando || resultados.veiculo?.ano || resultados.veiculo?.cor) && (
            <>
              <div className="cvo_row">
                <span>Ano</span>
                {editando ? (
                  <input
                    className="cvo_input"
                    type="number"
                    aria-label="Ano do veículo"
                    value={rascunho.ano}
                    onChange={(event) => atualizarRascunho("ano", event.target.value)}
                  />
                ) : (
                  <span>{resultados.veiculo?.ano || "-"}</span>
                )}
              </div>

              <div className="cvo_row">
                <span>Cor</span>
                {editando ? (
                  <input
                    className="cvo_input"
                    aria-label="Cor do veículo"
                    value={rascunho.cor}
                    onChange={(event) => atualizarRascunho("cor", event.target.value)}
                  />
                ) : (
                  <span>{resultados.veiculo?.cor || "-"}</span>
                )}
              </div>
            </>
          )}
        </div>

        <div className="cvo_box">

          <h4>ℹ Detalhes do Serviço</h4>

          <div className="cvo_row">
            <span>Descrição do serviço</span>
            {editando ? (
              <textarea
                className="cvo_input cvo_textarea"
                aria-label="Descrição do serviço"
                value={rascunho.descricaoServico}
                onChange={(event) => atualizarRascunho("descricaoServico", event.target.value)}
              />
            ) : (
              <span>{resultados.descricaoServico || "-"}</span>
            )}
          </div>

          <div className="cvo_parts">
            <div className="cvo_parts_header">
              <h5>Peças / materiais</h5>
              {editando && (
                <button
                  type="button"
                  className="cvo_add_part"
                  onClick={adicionarItem}
                  aria-label="Adicionar peça ou material"
                  title="Adicionar peça ou material"
                >
                  +
                </button>
              )}
            </div>
            {(editando ? itensRascunho : itens).length ? (
              (editando ? itensRascunho : itens).map((item, index) => (
                <div className="cvo_part" key={item.pecaId || item.id || index}>
                  {editando ? (
                    <>
                      <button
                        type="button"
                        className="cvo_remove_part"
                        onClick={() => removerItem(index)}
                        aria-label={`Remover peça ou material ${index + 1}`}
                        title="Remover peça ou material"
                      >
                        −
                      </button>
                      <label>
                        Peça/material
                        <input
                          className="cvo_input"
                          value={item.nomePeca}
                          onChange={(event) => atualizarItem(index, "nomePeca", event.target.value)}
                        />
                      </label>
                      <label>
                        Valor unitário (R$)
                        <input
                          className="cvo_input"
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.valor}
                          onChange={(event) => atualizarItem(index, "valor", event.target.value)}
                        />
                      </label>
                      <label>
                        Link do fornecedor
                        <input
                          className="cvo_input"
                          type="url"
                          placeholder="https://..."
                          value={item.fornecedor}
                          onChange={(event) => atualizarItem(index, "fornecedor", event.target.value)}
                        />
                      </label>
                      <label>
                        Quantidade
                        <input
                          className="cvo_input"
                          type="number"
                          min="1"
                          step="1"
                          value={item.quantidade}
                          onChange={(event) => atualizarItem(index, "quantidade", event.target.value)}
                        />
                      </label>
                    </>
                  ) : (
                    <>
                      <strong>{item.nomePeca || "Peça/material"}</strong>
                      <span><strong>Valor:</strong> R$ {Number(item.valor || 0).toFixed(2)}</span>
                      <span>
                        <strong>Fornecedor:</strong> {item.fornecedor ? (
                          normalizarUrlHttp(item.fornecedor) ? (
                            <a href={normalizarUrlHttp(item.fornecedor)} target="_blank" rel="noreferrer">
                              Acessar link
                            </a>
                          ) : item.fornecedor
                        ) : "não informado"}
                      </span>
                      <span><strong>Quantidade:</strong> {item.quantidade ?? 0}</span>
                    </>
                  )}
                </div>
              ))
            ) : (
              <span>Nenhuma peça ou material informado.</span>
            )}
          </div>

          <div className="cvo_row">
            <span>Valor da Peça(s)</span>
            <span>R$ {editando ? valorPecas.toFixed(2) : (valorPecas || Number(totalPecas) || 0).toFixed(2)}</span>
          </div>

          <div className="cvo_row">
            <span>Valor da mão de obra</span>
            {editando ? (
              <input
                className="cvo_input"
                type="number"
                min="0"
                step="0.01"
                aria-label="Valor da mão de obra"
                value={rascunho.valorMaoDeObra}
                onChange={(event) => atualizarRascunho("valorMaoDeObra", event.target.value)}
              />
            ) : (
              <span>R$ {valorMaoDeObra.toFixed(2)}</span>
            )}
          </div>

          <div className="cvo_row total">
            <span>Total:</span>
            <span>R$ {valorTotal.toFixed(2)}</span>
          </div>

        </div>
        {loading ? <p id="carregando">Carregando...</p> : ""}
        {mensagem ? <p id="mensagem" role="status">{mensagem}</p> : ""}
        {editando ? (
          <div className="cvo_actions">
            <button
              type="button"
              className="cvo_button cvo_button_secondary"
              onClick={cancelarEdicao}
              disabled={salvando}
            >
              Cancelar edição
            </button>
            <button
              type="button"
              className="cvo_button"
              onClick={salvarEdicao}
              disabled={salvando}
            >
              {salvando ? "Salvando..." : "Salvar alterações"}
            </button>
          </div>
        ) : (
          <>
          <div className="cvo_actions">

          <button
            type="button"
            className="cvo_button"
            onClick={() =>
              gerarPDF()
            }
          >
            Gerar PDF
          </button>

          <button
            type="button"
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
          </>
        )}

      </div>
    </div>
  )
}

export default CardVisualizarOrcamento