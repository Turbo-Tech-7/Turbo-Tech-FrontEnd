// CardCadastrarCliente.jsx
import { Link, useNavigate } from "react-router-dom"
import { useFetch } from "../hooks/useFetch"
import userIcon from "../assets/user.png"
import "./css/CardCadastrarCliente.css"
import cccazul from "../assets/ccc-azul.png"
import { useEffect, useState } from "react"


const CardCadastrarCliente = () => {
  const url = "http://localhost:8080"

  
  
  const { data, httpConfig, error, loading } = useFetch(url)

  const navigate = useNavigate();

  const [Placa, setPlaca] = useState("")
  const [Nome, setNome] = useState("")
  const [Telefone, setTelefone] = useState("")
  const [Email, setEmail] = useState("")


  const [mensagem, setMensagem] = useState("")

 

  async function handleSubmit(){ 

    setMensagem("")
    //Java utils

    if(Placa.length != 7){
      console.log("Placa invalida")
      return 
    }

    try {
      let Cliente = {
            placaVeiculo:Placa,
            nomeCliente:Nome,
            telefoneCliente:Telefone,
            emailCliente:Email
        }

        let respostaClienteVeiculo = await httpConfig("POST", `clientes-veiculos`, Cliente)

        let dataClienteVeiculo = respostaClienteVeiculo.data

        if (respostaClienteVeiculo.status == 201) {
            setMensagem("Cadastro realizado com sucesso!");
            setTimeout(() => { navigate("/criar-orcamento-cliente", {state:{
            DadosCliente:{
            nome:dataClienteVeiculo.nomeCliente,
            telefone:dataClienteVeiculo.telefoneCliente,
            placa:dataClienteVeiculo.placaVeiculo,
            email:dataClienteVeiculo.emailCliente,
            idClienteVeiculo:dataClienteVeiculo.id
            }
            }})}, 2500)
        } else {
            setMensagem("Erro ao cadastrar");
            console.log("Erro do cliente:", error)
        }
    } catch (error) {
      console.log(error)
    }

  }
  async function procurarCliente(params){
    console.log("Entrou na função")
    try {
      if(!params) return
      const placaNormalized = params.replace(/[^A-Za-z0-9]/g, "")
      if(placaNormalized.length === 7){
          const res = await httpConfig("GET", "clientes-veiculos/buscar-placa", null, {placa: placaNormalized})
          console.log(res.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

   useEffect(() => {

  procurarCliente(Placa)

}, [Placa])

  return (
    <div className="ccc_container">

      <div className="ccc_top_bar">
        <div className="ccc_top_left">
          <img src={cccazul} alt="" className="ccc_top_icon" />
          <div>
            <h3>Cadastrar Cliente</h3>
            <p>Criar novo cadastro de cliente</p>
          </div>
        </div>

        <Link to="/criar-orcamento" className="ccc_link">
          Voltar
        </Link>
      </div>

      <div className="ccc_card">

        <div className="ccc_icon">
          <img src={userIcon} alt="" />
        </div>

        <h2 className="ccc_title">Cadastrar Cliente</h2>

        <div className="ccc_form">

          <div className="ccc_grid">
            <div className="ccc_input_group">
              <label>Placa do Veículo</label>
              <input onChange={(e) => {
                setPlaca(e.target.value)
              }} placeholder="Ex: ABC-1234" />
            </div>

            <div className="ccc_input_group">
              <label>Nome do Cliente</label>
              <input onChange={(e) => {setNome(e.target.value)}} placeholder="Ex: João Silva" />
            </div>

            <div className="ccc_input_group">
              <label>Telefone</label>
              <input onChange={(e) => {setTelefone(e.target.value)}} placeholder="Ex: (11)98765-4321" />
            </div>
          </div>

          <div className="ccc_input_group">
            <label>Email</label>
            <input onChange={(e) => {setEmail(e.target.value)}} placeholder="Ex: joao@gmail.com" />
          </div>

          {loading ? <p id="carregando">Carregando...</p> : ""}
          {mensagem ? <p id="mensagem">{mensagem}</p> : ""}
          <button className="ccc_button" onClick={handleSubmit}>
            Cadastrar Cliente
          </button>

        </div>

      </div>
    </div>
  )
}

export default CardCadastrarCliente