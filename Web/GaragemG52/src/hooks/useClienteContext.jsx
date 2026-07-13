import { useContext } from "react";
import { ClienteContext } from "../context/ClienteContext";

export function useClienteContext () {
    const context = useContext(ClienteContext)

    if(!context){
        console.log("Contexto não encontrado")
    }

    return context
}


