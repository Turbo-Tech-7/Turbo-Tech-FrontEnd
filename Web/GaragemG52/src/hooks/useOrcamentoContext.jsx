import { useContext } from "react";
import { OrcamentoContext } from "../context/OrcamentoContext";

export const useOrcamentoContext = () => {
    const context = useContext(OrcamentoContext)

    if(!context){
        console.log("Contexto não encontrado")
    }

    return context;
}



