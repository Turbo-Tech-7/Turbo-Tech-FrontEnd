import { useState } from 'react'
import './App.css'
import CardCentral from './components/CardCentral'
import CardCriarOrcamento from './components/CardCriarOrcamento'
import CardBuscarPecas from './components/CardBuscarPecas'
import CardRelatorios from './components/CardRelatorios'
import CardBuscarOrcamentos from './components/CardBuscarOrcamentos'
import CardBuscarClientes from './components/CardBuscarClientes'
import CardVisaoGeral from './components/CardVisaoGeral'

function App() {


  return (
    <>
      <div className='header' >
        <CardCentral />
      </div>
      <div className='menu'>
        <CardCriarOrcamento />
        <CardBuscarPecas />
        <CardRelatorios />
        <CardBuscarOrcamentos />
        <CardBuscarClientes />
        <CardVisaoGeral />
      </div>

    </>
  )
}

export default App
