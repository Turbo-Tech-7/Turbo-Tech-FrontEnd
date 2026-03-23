//hooks
import { useState } from "react"
import { useFetch } from "../hooks/useFetch"
import { utilsJS } from "../hooks/utils"
import {Link} from "react-router-dom"

const forms = (prop) => {
    
const url = "http://localhost:3000"

const { httpConfig, error} = useFetch(url)
const {utilsJSCongfig} = utilsJS()

//Dados usuario - Login
const [email, setEmail] = useState("")
const [senha, setSenha] = useState("")

//Dados usuario - Cadastro
const [confirmarSenha, setConfirmarSenha] = useState("")
const [nome, setNome] = useState("")

const handleSubmitLogin = async (e) => {
    e.preventDefault()

    let credenciais = `usuario?email=${email}&senha=${senha}`

    let resposta = await httpConfig(null, "GET", credenciais)
    
    if (resposta && resposta.length > 0) {
        console.log("Login realizado com sucesso!");
        console.log("Dados do usuário:", resposta[0]);
        
    } else {
        console.log("Usuário ou senha incorretos.");
    }

}

const handleSubmitCadastro = async (e) => {
    e.preventDefault()

    let usuarios = await httpConfig("", "GET", "usuario")
    // let veiculos = await httpConfig("", "GET", "veiculo")


    const emailExiste = usuarios.some(
    user => user.email.toLowerCase() === email.toLowerCase()    
)

    if(emailExiste){
        console.log("Email já cadastrado")
        return
    }

    // const veiculoExiste = veiculos.some(vec => vec.placa.toLowerCase()=== placa.toLocaleLowerCase())

    // const telefoneExiste = usuarios.some(
    // user => user.telefone?.replace(/\D/g, "") === telefone  
    // )

    let id = "1"

    if(usuarios.length > 0){
        id = (Number( usuarios[usuarios.length - 1].id) + 1).toString()
    }

    if(!utilsJSCongfig("verificarEmail",email)){
        console.log("Email invalido")
        return false
    }
    // if(!utilsJSCongfig("verificarPlaca",placa)){
    //     console.log("Placa invalida")
    //     return false
    // }
    // if(!utilsJSCongfig("verificarTelefone",telefone)){
    //     console.log("Telefone invalido")        
    // return false
    // }

    if(senha !== confirmarSenha){
        console.log("Senha diferentes")
        return false
    }
    
    // if(veiculoExiste){
    //     console.log("Veiculo já cadastrado")
    //     return
    // }
    // if(telefoneExiste){
    //     console.log("Telefone já cadastrado")
    //     return
    // }


    const usuario = {
        id,
        nome,
        email,
        senha
    }

    // const veiculo = {
    //     id,
    //     nome,
    //     placa
    // } 

    // const trabalho  ={
    //     id,
    //     placa,
    //     servico
    // }

    try {
        await Promise.all([
            httpConfig(usuario, "POST", "usuario"),
            // httpConfig(veiculo, "POST", "veiculo"),
            // httpConfig(trabalho, "POST", "servico")
        ]);

        setNome("");
        setEmail("");
        setSenha("");
        setConfirmarSenha("");
        // setplaca("");
        // setservico("");
        // setTelefone("");
        console.log("Todos os dados enviados com sucesso!");
        
    } catch (error) {
        console.error("Erro ao enviar dados:", error);
    }


}

function formLogin() {
  return (
    <form id="form_login" className="form" onSubmit={handleSubmitLogin}>
    <div id="div_dados">
     <div className="div_label">
      <label for="input_email">Email</label>
        <input
        id="input_email"
        type="text" 
        onChange={(e) => setEmail(e.target.value)}/>
    </div>

    <div className="div_label">
      <label for="input_senha">Senha</label>
        <input
        id="input_senha"
        type="password"
        onChange={(e) => setSenha(e.target.value)}/>
    </div>
    <div id="div_button">
      <input type="submit" value="Login" id="button_submit"/>
    </div>

    <div id="div_action">
        <Link to="/">Esqueci minha senha</Link>
        <Link to="/cadastro">Não tenho uma conta</Link>
    </div>

    </div>

    </form>
  )
}
function formCadastro() {
    
    return (

        
    <form id="form_cadastro" className="form" onSubmit={handleSubmitCadastro}>
    <div id="div_dados">
     <div className="div_label">
      <label for="input_email">Email</label>
        <input
        id="input_email"
        type="text" 
        onChange={(e) => setEmail(e.target.value)}/>
    </div>
    <div className="div_label">
      <label for="input_nome">Nome</label>
        <input
        id="input_nome"
        type="text" 
        onChange={(e) => setNome(e.target.value)}/>
    </div>

    <div className="div_label">
      <label for="input_senha">Senha</label>
        <input
        id="input_senha"
        type="password"
        onChange={(e) => setSenha(e.target.value)}/>
    </div>

    <div className="div_label">
      <label for="input_confirmarSenha">Confirmar Senha</label>
        <input
        id="input_confirmarSenha"
        type="password"
        onChange={(e) => setConfirmarSenha(e.target.value)}/>
    </div>

    <div id="div_button">
      <input type="submit" value="cadastrar" id="button_submit"/>
    </div>

    <div id="div_action">
        <Link to="/">Já tenho conta</Link>
    </div>

    </div>

    </form>

    )
}

return (
    <div id="main">

        {prop.ambiente == "login" ? <h1>login</h1> : <h1>Cadastro</h1>}

        { prop.ambiente == "login" ? (
            formLogin()
        ) : (
            formCadastro()
        )}
        <br />
    </div>
  )
}

export default forms