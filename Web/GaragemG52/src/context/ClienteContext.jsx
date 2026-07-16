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
            emailCliente:null,
            modeloCliente:null,
            idClienteVeiculo:null
        }
        }
    )

    const [Placa, setPlaca] = useState(Cliente.placaVeiculo || "")
    const [Nome, setNome] = useState( Cliente.nomeCliente || "")
    const [Telefone, setTelefone] = useState(Cliente.telefoneCliente || "")
    const [Email, setEmail] = useState(Cliente.emailCliente || "")
    const [Modelo, setModelo] = useState(Cliente.Modelo || "")
    const [Id, setId] = useState(Cliente.idClienteVeiculo || "")

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
    function atualizarId (Id){
        setId(Id)

        setCliente(
            {...Cliente, idClienteVeiculo:Id}
        )
    } 
    function atualizarModelo (Modelo){
        setModelo(Modelo)

        setCliente(
            {...Cliente, modelo:Modelo}
        )
    } 
    function limparCliente(){
        setPlaca("")
        setModelo("")
        setNome("")
        setTelefone("")
        setEmail("")
        setId("")
    }  

    useEffect(() => {
        localStorage.setItem("CacheCliente", JSON.stringify(Cliente))
    }, [Cliente])

    return(
        <ClienteContext.Provider 
        value={Placa, Nome, Telefone, Email, Id, Modelo, Cliente, atualizarModelo, atualizarId, atualizarPlaca, atualizarNome, atualizarTelefone, atualizarEmail, limparCliente}>
            {children}
        </ClienteContext.Provider>
    )
}