//hooks
import { useEffect, useState } from "react"

import { useFetch } from "../hooks/useFetch"
import { verificarEmail, verificarTelefone, senhaValida, senhasIguais, nomeValido, verificarCep } from "../hooks/utils"
import { Link, useNavigate } from "react-router-dom"
import "./css/Forms.css"

const Forms = (prop) => {

    const { data, httpConfig, error, loading } = useFetch()

    const navigate = useNavigate();

    // Dados usuario - Login
    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")

    // Dados usuario - Cadastro
    const [confirmarSenha, setConfirmarSenha] = useState("")
    const [name, setName] = useState("")
    const [telefone, setTelefone] = useState("")
    const [cep, setCep] = useState("")

    //Processos em segundo plano
    const [mensagem, setMensagem] = useState("")


    useEffect(() => {
        sessionStorage.removeItem('token');
    }, [])


    const handleSubmitLogin = async (e) => {
        e.preventDefault()
        setMensagem("");
        let credenciais = {
            email,
            senha
        }

        let resposta = await httpConfig("POST", "auth/login", credenciais)

        if (resposta.status == 200) {
            setMensagem("Login realizado com sucesso!");
            setTimeout(() => { navigate("/verificar-conta", { state: { email: email } }) }, 2500)
        } else {
            setMensagem("Usuário ou senha incorretos.");
            console.log("Erro do cliente:", error)
        }
    }

    const handleSubmitCadastro = async (e) => {
        e.preventDefault()
        
        if (cep && !verificarCep(cep)) {
            setMensagem("CEP inválido")
            return
        }

        if (!verificarEmail(email)) {
            setMensagem("Email invalido")
            return
        }

        if (!nomeValido(name)) {
            setMensagem("Nome deve ter pelo menos 3 caracteres")
            return
        }

        if (!verificarTelefone(telefone)) {
            setMensagem("Telefone inválido")
            return
        }

        if (!senhaValida(senha)) {
            setMensagem("Senha deve ter no mínimo 6 caracteres")
            return
        }

        if (!senhasIguais(senha, confirmarSenha)) {
            setMensagem("Senhas diferentes")
            return false
        }

        const usuario = {
            name,
            email,
            telefone,
            cep,
            senha
        }

        try {

            const res = await httpConfig("POST", "auth/register", usuario)

            if (res.status == 201) {
                setName("");
                setEmail("");
                setSenha("");
                setConfirmarSenha("");
                setTelefone("");
                setCep("");
                setMensagem("Cadastro realizado")


                console.log("Cadastro realizado")
                setTimeout(() => { navigate("/") }, 4000)
            }

        } catch (error) {
            console.error("Erro ao enviar dados:", error);
            setMensagem("Erro ao enviar os dados:", error)
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
                        {loading ? <p id="carregando">Carregando...</p> : ""}
                        {mensagem ? <p id="mensagem">{mensagem}</p> : ""}
                        <input type="submit" value="Login" id="button_submit" />
                    </div>

                    <div id="div_action">
                        <Link to="/recuperar-senha">Esqueci minha senha</Link>
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
                            onChange={(e) => setName(e.target.value)}
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
                        {loading ? <p id="carregando">Carregando...</p> : ""}
                        {mensagem ? <p id="mensagem">{mensagem}</p> : ""}
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
        <div className="form_wrapper" onLoad={() => setMensagem()}>
            {prop.ambiente === "login" ? formLogin() : formCadastro()}
            <br />
        </div>
    )
}

export default Forms