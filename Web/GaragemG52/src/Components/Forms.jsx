//hooks
import { useState } from "react"
import { useFetch } from "../hooks/useFetch"
import { utilsJS } from "../hooks/utils"
import { Link } from "react-router-dom"
import "./css/Forms.css"

const Forms = (prop) => {

    const url = "http://localhost:3000"

    const { httpConfig, error } = useFetch(url)
    const { utilsJSCongfig } = utilsJS()

    // Dados usuario - Login
    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")

    // Dados usuario - Cadastro
    const [confirmarSenha, setConfirmarSenha] = useState("")
    const [nome, setNome] = useState("")
    const [telefone, setTelefone] = useState("")
    const [cep, setCep] = useState("")

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

        const emailExiste = usuarios.some(
            user => user.email.toLowerCase() === email.toLowerCase()
        )

        if (emailExiste) {
            console.log("Email já cadastrado")
            return
        }

        let id = "1"
        if (usuarios.length > 0) {
            id = (Number(usuarios[usuarios.length - 1].id) + 1).toString()
        }

        if (!utilsJSCongfig("verificarEmail", email)) {
            console.log("Email invalido")
            return false
        }

        if (senha !== confirmarSenha) {
            console.log("Senhas diferentes")
            return false
        }

        const usuario = {
            id,
            nome,
            email,
            senha,
            telefone,
            cep
        }

        try {
            await httpConfig(usuario, "POST", "usuario")

            setNome("");
            setEmail("");
            setSenha("");
            setConfirmarSenha("");
            setTelefone("");
            setCep("");
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
                        <label htmlFor="input_email">Email</label>
                        <input
                            id="input_email"
                            type="text"
                            placeholder="  seu@email.com"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="div_label">
                        <label htmlFor="input_senha">Senha</label>
                        <input
                            id="input_senha"
                            type="password"
                            placeholder="  ********"
                            onChange={(e) => setSenha(e.target.value)}
                        />
                    </div>

                    <div id="div_button">
                        <input type="submit" value="Login" id="button_submit" />
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
                        <label htmlFor="input_email">Email</label>
                        <input
                            id="input_email"
                            type="text"
                            placeholder="  seu@email.com"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="div_label">
                        <label htmlFor="input_nome">Nome</label>
                        <input
                            id="input_nome"
                            type="text"
                            placeholder="  João Silva"
                            onChange={(e) => setNome(e.target.value)}
                        />
                    </div>

                    <div className="div_label">
                        <label htmlFor="input_telefone">Telefone</label>
                        <input
                            id="input_telefone"
                            type="text"
                            placeholder="  (xx) xxxxx-xxxx"
                            onChange={(e) => setTelefone(e.target.value)}
                        />
                    </div>

                    <div className="div_label">
                        <label htmlFor="input_cep">
                            CEP <span style={{ fontSize: "0.8em", color: "#888" }}>(Opcional)</span>
                        </label>
                        <input
                            id="input_cep"
                            type="text"
                            placeholder="  00000-000"
                            onChange={(e) => setCep(e.target.value)}
                        />
                    </div>

                    <div className="div_label">
                        <label htmlFor="input_senha">Senha</label>
                        <input
                            id="input_senha"
                            type="password"
                            placeholder="  ********"
                            onChange={(e) => setSenha(e.target.value)}
                        />
                    </div>

                    <div className="div_label">
                        <label htmlFor="input_confirmarSenha">Confirmar Senha</label>
                        <input
                            id="input_confirmarSenha"
                            type="password"
                            placeholder="  ********"
                            onChange={(e) => setConfirmarSenha(e.target.value)}
                        />
                    </div>

                    <div id="div_button">
                        <input type="submit" value="Cadastrar" id="button_submit" />
                    </div>

                    <div id="div_action">
                        <Link to="/">Já tenho conta</Link>
                    </div>

                </div>
            </form>
        )
    }

    return (
        <div className="form_wrapper">
            {prop.ambiente === "login" ? formLogin() : formCadastro()}
            <br />
        </div>
    )
}

export default Forms