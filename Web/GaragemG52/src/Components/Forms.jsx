//hooks
import { useEffect, useState } from "react"

import { useFetch } from "../hooks/useFetch"
import { verificarEmail, verificarTelefone, senhaValida, senhasIguais, nomeValido, verificarCep } from "../hooks/utils"
import { Link, useNavigate } from "react-router-dom"
import "./css/Forms.css"
import { removeAuthToken } from "../services/authStorage"
import { authService } from "../services/authService"

function useLoginForm() {
    const { httpConfig, loading } = useFetch()
    const navigate = useNavigate();
    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")
    const [mensagem, setMensagem] = useState("")

    useEffect(() => {
        removeAuthToken();
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setMensagem("")

        const resposta = await authService.login(httpConfig, { email, senha })

        if (resposta.status == 200) {
            setMensagem("Login realizado com sucesso!")
            setTimeout(() => { navigate("/verificar-conta", { state: { email: email } }) }, 2500)
        } else {
            setMensagem("Usuário ou senha incorretos.")
        }
    }

    return { email, setEmail, senha, setSenha, mensagem, setMensagem, loading, handleSubmit }
}

function useCadastroForm() {
    const { httpConfig, loading } = useFetch()
    const navigate = useNavigate();
    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")
    const [confirmarSenha, setConfirmarSenha] = useState("")
    const [name, setName] = useState("")
    const [telefone, setTelefone] = useState("")
    const [cep, setCep] = useState("")
    const [mensagem, setMensagem] = useState("")

    useEffect(() => {
        removeAuthToken();
    }, [])

    const handleSubmit = async (e) => {
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
            return
        }

        const usuario = { name, email, telefone, cep, senha }

        try {
            const res = await authService.register(httpConfig, usuario)

            if (res.status == 201) {
                setName("")
                setEmail("")
                setSenha("")
                setConfirmarSenha("")
                setTelefone("")
                setCep("")
                setMensagem("Cadastro realizado")
                setTimeout(() => { navigate("/") }, 4000)
            }
        } catch (error) {
            console.error("Erro ao enviar dados:", error)
            setMensagem("Erro ao enviar os dados:", error)
        }
    }

    return {
        email,
        setEmail,
        senha,
        setSenha,
        confirmarSenha,
        setConfirmarSenha,
        name,
        setName,
        telefone,
        setTelefone,
        cep,
        setCep,
        mensagem,
        setMensagem,
        loading,
        handleSubmit,
    }
}

function LoginForm() {
    const { email, setEmail, senha, setSenha, mensagem, loading, handleSubmit } = useLoginForm()

    return (
        <div className="form_wrapper">
            <form id="form_login" className="form" onSubmit={handleSubmit}>
                <div id="div_dados">
                    <div className="div_label">
                        <label htmlFor="input_email">Email</label>
                        <input
                            id="input_email"
                            type="text"
                            placeholder="  seu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="div_label">
                        <label htmlFor="input_senha">Senha</label>
                        <input
                            id="input_senha"
                            type="password"
                            placeholder="  ********"
                            value={senha}
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
            <br />
        </div>
    )
}

function CadastroForm() {
    const {
        email,
        setEmail,
        senha,
        setSenha,
        confirmarSenha,
        setConfirmarSenha,
        name,
        setName,
        telefone,
        setTelefone,
        cep,
        setCep,
        mensagem,
        loading,
        handleSubmit,
    } = useCadastroForm()

    return (
        <div className="form_wrapper">
            <form id="form_cadastro" className="form" onSubmit={handleSubmit}>
                <div id="div_dados">

                    <div className="div_label">
                        <label htmlFor="input_email">Email</label>
                        <input
                            id="input_email"
                            type="text"
                            placeholder="  seu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="div_label">
                        <label htmlFor="input_nome">Nome</label>
                        <input
                            id="input_nome"
                            type="text"
                            placeholder="  João Silva"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="div_label">
                        <label htmlFor="input_telefone">Telefone</label>
                        <input
                            id="input_telefone"
                            type="text"
                            placeholder="  (xx) xxxxx-xxxx"
                            value={telefone}
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
                            value={cep}
                            onChange={(e) => setCep(e.target.value)}
                        />
                    </div>

                    <div className="div_label">
                        <label htmlFor="input_senha">Senha</label>
                        <input
                            id="input_senha"
                            type="password"
                            placeholder="  ********"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                        />
                    </div>

                    <div className="div_label">
                        <label htmlFor="input_confirmarSenha">Confirmar Senha</label>
                        <input
                            id="input_confirmarSenha"
                            type="password"
                            placeholder="  ********"
                            value={confirmarSenha}
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
            <br />
        </div>
    )
}

const Forms = ({ ambiente = "login" }) => {
    if (ambiente === "login") {
        return <LoginForm />
    }

    return <CadastroForm />
}

export default Forms