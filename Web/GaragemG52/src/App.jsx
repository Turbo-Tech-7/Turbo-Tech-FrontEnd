//Pages
import Login from "./Pages/Login"
import Cadastro from "./Pages/Cadastro"
import CriarOrcamento from "./pages/CriarOrcamento"
import CadastrarCliente from "./pages/CadastrarCliente"
import CriarOrcamentoCliente from "./pages/CriarOrcamentoCliente"
//Component
import Forms from './Components/forms'
import QuadroMensagem from './Components/quadroMensagem'

//Style

//Hook
import { BrowserRouter, Routes, Route} from 'react-router-dom'

import Redirecionar from "./Components/Redirecionar.jsx"
import { Component } from 'react'
import './App.css'
import Home from "./Pages/Home.jsx"
import RecuperarSenha from "./Pages/RecuperarSenha.jsx"
import RecuperarSenhaVerificar from "./Pages/RecuperarSenhaVerificar"
import RecuperarNovaSenha from "./Pages/RecuperarNovaSenha"   
import VerificarConta from "./Pages/VerificarConta"

function App() {

  return (
    <main>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Redirecionar link="login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/home" element={<Home />} />
          <Route path="/recuperar-senha" element={<RecuperarSenha />} />
          <Route path="/recuperar-senha/verificar" element={<RecuperarSenhaVerificar />} />
          <Route path="/recuperar-senha/nova" element={<RecuperarNovaSenha />} />
          <Route path="/verificar-conta" element={<VerificarConta />} />
          <Route path="/criar-orcamento" element={<CriarOrcamento />} />
          <Route path="/cadastrar-cliente" element={<CadastrarCliente />} />
          <Route path="/criar-orcamento-cliente" element={<CriarOrcamentoCliente />} />
        
          
        </Routes>
      </BrowserRouter>


    </main>
  )
}

export default App
