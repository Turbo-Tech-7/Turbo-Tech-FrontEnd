import { useEffect, useState } from "react";
import { readCache, writeCache } from "../services/cacheStorage";
import { ClienteContext } from "./clienteContextDefinition";

export function ClienteContextProvider ({children}){

    const [Cliente, setCliente] = useState(
        () => {
        const CacheCliente = readCache("CacheCliente")

        return CacheCliente ? CacheCliente : {
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
    const [Modelo, setModelo] = useState(Cliente.modeloCliente || "")
    const [Id, setId] = useState(Cliente.idClienteVeiculo || "")

    function atualizarPlaca (Placa){
        setPlaca(Placa)
        setCliente((clienteAtual) => ({ ...clienteAtual, placaVeiculo: Placa }))
    }  
    function atualizarNome (Nome){
        setNome(Nome)
        setCliente((clienteAtual) => ({ ...clienteAtual, nomeCliente: Nome }))
    }
    function atualizarTelefone (Telefone){
        setTelefone(Telefone)
        setCliente((clienteAtual) => ({ ...clienteAtual, telefoneCliente: Telefone }))
    }
    function atualizarEmail (Email){
        setEmail(Email)
        setCliente((clienteAtual) => ({ ...clienteAtual, emailCliente: Email }))
    }  
    function atualizarId (Id){
        setId(Id)
        setCliente((clienteAtual) => ({ ...clienteAtual, idClienteVeiculo: Id }))
    } 
    function atualizarModelo (Modelo){
        setModelo(Modelo)
        setCliente((clienteAtual) => ({ ...clienteAtual, modeloCliente: Modelo }))
    } 
    function atualizarCliente(cliente){
        setCliente(cliente)
    }
    function limparCliente(){
        const clienteLimpo = {
            placaVeiculo: "",
            nomeCliente: "",
            telefoneCliente: "",
            emailCliente: "",
            modeloCliente: "",
            idClienteVeiculo: ""
        }

        setCliente(clienteLimpo)
        setPlaca("")
        setModelo("")
        setNome("")
        setTelefone("")
        setEmail("")
        setId("")
    }  

    useEffect(() => {
        writeCache("CacheCliente", Cliente)
    }, [Cliente])

    return(
        <ClienteContext.Provider
            value={{
                Placa,
                Nome,
                Telefone,
                Email,
                Id,
                Modelo,
                Cliente,
                atualizarModelo,
                atualizarCliente,
                atualizarId,
                atualizarPlaca,
                atualizarNome,
                atualizarTelefone,
                atualizarEmail,
                limparCliente,
            }}
        >
            {children}
        </ClienteContext.Provider>
    )
}