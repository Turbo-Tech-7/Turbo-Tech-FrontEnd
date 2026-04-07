//Pages
import Login from "./Pages/Login"
import Cadastro from "./Pages/Cadastro"

//Component
import Forms from './Components/forms'
import QuadroMensagem from './Components/quadroMensagem'

//Style

//Hook
import { BrowserRouter, Routes, Route } from 'react-router-dom'

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
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/" element={<Home />} />
          <Route path="/recuperar-senha" element={<RecuperarSenha />} />
          <Route path="/recuperar-senha/verificar" element={<RecuperarSenhaVerificar />} />
          <Route path="/recuperar-senha/nova" element={<RecuperarNovaSenha />} />
          <Route path="/verificar-conta" element={<VerificarConta />} />
        </Routes>
      </BrowserRouter>


    </main>
  )
}

export default App
