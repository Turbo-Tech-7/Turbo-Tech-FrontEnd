import { createContext,useContext,useEffect,useState } from "react";
import { ClienteContext } from "./ClienteContext";

export const OrcamentoContext = createContext()

export function OrcamentoContextProvider ({children}){
    
    const { Id } = useContext(ClienteContext)

    const [Orcamento, setOrcamento] = useState(
        () => {
        const CacheOrcamento = localStorage.getItem("CacheOrcamento")

        return CacheOrcamento ? JSON.parse(CacheOrcamento) : {
            idOrcamento:null,
            clienteVeiculoId: null,
            descricaoServico: null,
            valorMaoDeObra: null,
            itens: null
        }
        }
    )

    const [IdCliente, setIdCliente] = useState(Id || "")
    const [IdOrcamento, setIdOrcamento] = useState(Orcamento.idOrcamento || "")
    const [Descricao, setDescricao] = useState(Orcamento.descricaoServico || "")
    const [MaoDeObra, setMaoDeObra] = useState(Orcamento.valorMaoDeObra || 0)
    const [Pecas, setPecas] = useState(Orcamento.pecas || [])

    function adicionarPeca(peca){
    const index = Pecas.findIndex(item => item.id === peca.idPeca)

    if (index !== -1) {
      const novasPecas = [...Pecas]
      novasPecas[index].quantidade += 1
      setPecas(novasPecas)
    } else {
      setPecas([
        ...Pecas,
        {
          id: peca.idPeca,
          nomePeca: peca.nomePeca,
          descricao: peca.descricaoPeca,
          valor: peca.precoPeca,
          quantidade: 1,
          fornecedor: peca.fornecedor,
        }
      ])
    }
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
    }

    function atualizarDescricao(Descricao){
        setDescricao(Descricao)

        setOrcamento(
            {...Orcamento,descricaoServico: Descricao }
        )
    }

    function atualizarMaoDeObra(MaoDeObra){
        setMaoDeObra(MaoDeObra)

        setOrcamento(
            {...Orcamento,valorMaoDeObra: MaoDeObra }
        )
    }

    function atualizarIdOrcamento(IdOrcamento){
        setIdOrcamento(IdOrcamento)

        setOrcamento(
            {...Orcamento,idOrcamento: IdOrcamento }
        )
    }

    function totalPecas(){
       return Pecas.reduce((acc, item) => {return acc + ((parseFloat(item.valor) || 0) * item.quantidade)}, 0)
    } 

    function total(){
        return totalPecas + MaoDeObra
    }

    function limparOrcamento(){
        setIdOrcamento("")
        setDescricao("")
        setMaoDeObra(0)
        setPecas([])
    }
    
    useEffect(() => {
        localStorage.setItem("CacheOrcamento", JSON.stringify(Orcamento))
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