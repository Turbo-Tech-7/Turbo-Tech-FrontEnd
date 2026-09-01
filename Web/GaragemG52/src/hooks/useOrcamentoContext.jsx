import { useContext } from "react";
import { OrcamentoContext } from "../context/orcamentoContextDefinition";

export const useOrcamentoContext = () => {
    const context = useContext(OrcamentoContext)

    if(!context){
        throw new Error("useOrcamentoContext deve ser usado dentro de OrcamentoContextProvider")
    }

    return context;
}



