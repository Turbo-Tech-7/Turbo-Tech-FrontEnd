import { createContext, useEffect, useState } from "react";

export const ClienteContext = createContext()

export function ClienteContextProvider ({children}){

    const [Cliente, setCliente] = useState(
        () => {
        const CacheCliente = localStorage.getItem("CacheCliente")

        return CacheCliente ? JSON.parse(CacheCliente) : {
            placaVeiculo:null,
            nomeCliente:null,
            telefoneCliente:null,
            emailCliente:null
        }
        }
    )

    const [Placa, setPlaca] = useState(Cliente.placaVeiculo ||"")
    const [Nome, setNome] = useState( Cliente.nomeCliente ||"")
    const [Telefone, setTelefone] = useState(Cliente.telefoneCliente ||"")
    const [Email, setEmail] = useState(Cliente.emailCliente ||"")

    function atualizarPlaca (Placa){
        setPlaca(Placa)

        setCliente(
            {...Cliente, placaVeiculo:Placa}
        )
    }  
    function atualizarNome (Nome){
        setNome(Nome)

        setCliente(
            {...Cliente, nomeCliente:Nome}
        )
    }
    function atualizarTelefone (Telefone){
        setTelefone(Telefone)

        setCliente(
            {...Cliente, telefoneCliente:Telefone}
        )
    }
    function atualizarEmail (Email){
        setEmail(Email)

        setCliente(
            {...Cliente, emailCliente:Email}
        )
    }  


    console.log(Cliente)

    useEffect(() => {
        localStorage.setItem("CacheCliente", JSON.stringify(Cliente))
    }, [Cliente])

    return(
        <ClienteContext.Provider 
        value={{Placa, Nome, Telefone, Email, atualizarPlaca, atualizarNome, atualizarTelefone, atualizarEmail, Cliente}}>
            {children}
        </ClienteContext.Provider>
    )
}