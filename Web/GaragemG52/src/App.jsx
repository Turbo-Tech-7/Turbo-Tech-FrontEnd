//Pages
import Login from "./Pages/Login"
import Cadastro from "./Pages/Cadastro"

//Component
import Forms from './Components/forms'
import QuadroMensagem from './Components/quadroMensagem'

//Style

//Hook
import {BrowserRouter, Routes, Route} from 'react-router-dom'

import { Component } from 'react'
import './App.css'

function App() {

  return (
    <main>

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}/>
        <Route path="/cadastro" element={<Cadastro />}/>
      </Routes>
    </BrowserRouter>

      
    </main>
  )
}

export default App
