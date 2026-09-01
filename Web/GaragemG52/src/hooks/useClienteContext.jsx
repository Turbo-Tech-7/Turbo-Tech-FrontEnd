import { useContext } from "react";
import { ClienteContext } from "../context/clienteContextDefinition";

export function useClienteContext () {
    const context = useContext(ClienteContext)

    if(!context){
        throw new Error("useClienteContext deve ser usado dentro de ClienteContextProvider")
    }

    return context
}


