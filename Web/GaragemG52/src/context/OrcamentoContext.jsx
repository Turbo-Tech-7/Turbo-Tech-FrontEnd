import { useContext, useEffect, useState } from "react";
import { ClienteContext } from "./clienteContextDefinition";
import { readCache, writeCache } from "../services/cacheStorage";
import { calcularTotal, calcularTotalPecas } from "../domain/orcamentoTotais";
import { OrcamentoContext } from "./orcamentoContextDefinition";

export function OrcamentoContextProvider ({children}){
    
    const { Id } = useContext(ClienteContext)

    const [Orcamento, setOrcamento] = useState(
        () => {
        const CacheOrcamento = readCache("CacheOrcamento")

        return CacheOrcamento ? CacheOrcamento : {
            idOrcamento:null,
            clienteVeiculoId: null,
            descricaoServico: null,
            valorMaoDeObra: null,
            itens: null
        }
        }
    )

    const [IdOrcamento, setIdOrcamento] = useState(Orcamento.idOrcamento || "")
    const [Descricao, setDescricao] = useState(Orcamento.descricaoServico || "")
    const [MaoDeObra, setMaoDeObra] = useState(Orcamento.valorMaoDeObra || 0)
    const [Pecas, setPecas] = useState(Orcamento.pecas || Orcamento.itens || [])

    function adicionarPeca(peca){
    const index = Pecas.findIndex(item => item.id === peca.idPeca)
        let novasPecas

    if (index !== -1) {
            novasPecas = [...Pecas]
      novasPecas[index].quantidade += 1
    } else {
            novasPecas = [
        ...Pecas,
        {
          id: peca.idPeca,
          nomePeca: peca.nomePeca,
          descricao: peca.descricaoPeca,
          valor: peca.precoPeca,
          quantidade: 1,
          fornecedor: peca.fornecedor,
        }
            ]
    }
        setPecas(novasPecas)
        setOrcamento((orcamentoAtual) => ({ ...orcamentoAtual, pecas: novasPecas }))
        return (`✅ ${peca.nomePeca} adicionado ao orçamento!`)
    }

    function removerPeca (id) {
    const novasPecas = Pecas.map((peca) => {
      if (peca.id === id) {
        return {
          ...peca,
          quantidade: peca.quantidade - 1
        }
      }
      return peca
    }).filter((peca) => peca.quantidade > 0)

    setPecas(novasPecas)
    setOrcamento((orcamentoAtual) => ({ ...orcamentoAtual, pecas: novasPecas }))
    }

    function atualizarDescricao(Descricao){
        setDescricao(Descricao)
        setOrcamento((orcamentoAtual) => ({ ...orcamentoAtual, descricaoServico: Descricao }))
    }

    function atualizarMaoDeObra(MaoDeObra){
        setMaoDeObra(MaoDeObra)
        setOrcamento((orcamentoAtual) => ({ ...orcamentoAtual, valorMaoDeObra: MaoDeObra }))
    }

    function atualizarIdOrcamento(IdOrcamento){
        setIdOrcamento(IdOrcamento)
        setOrcamento((orcamentoAtual) => ({ ...orcamentoAtual, idOrcamento: IdOrcamento }))
    }

    function totalPecas(){
       return calcularTotalPecas(Pecas)
    } 

    function total(){
        return calcularTotal(Pecas, MaoDeObra)
    }

    function limparOrcamento(){
        const orcamentoLimpo = {
            idOrcamento: "",
            clienteVeiculoId: null,
            descricaoServico: "",
            valorMaoDeObra: 0,
            itens: []
        }

        setOrcamento(orcamentoLimpo)
        setIdOrcamento("")
        setDescricao("")
        setMaoDeObra(0)
        setPecas([])
    }
    
    useEffect(() => {
        writeCache("CacheOrcamento", Orcamento)
    }, [Orcamento])
    
    return(
        <OrcamentoContext.Provider value={{
            Orcamento,
            Descricao,
            MaoDeObra,
            Pecas,
            IdOrcamento,
            atualizarDescricao,
            atualizarMaoDeObra,
            atualizarIdOrcamento,
            adicionarPeca,
            removerPeca,
            totalPecas,
            total,
            limparOrcamento,
        }}>
            {children}
        </OrcamentoContext.Provider>
    )
}