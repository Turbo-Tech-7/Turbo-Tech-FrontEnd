import React from 'react'
import './css/CardMudarOrcamento.css'
import buscarpecas from '../assets/buscarpecas.png'

function MudarOrcamento() {
  return (
      <div className='card-mudar-orcamento'>
        <div className='card-mudar-orcamento__content'>
          <div className='card-mudar-orcamento__icon'>
            <img  src={buscarpecas} alt="criardoc" />
          </div>
          <div className='card-mudar-orcamento__text'>
            <h2>Status dos Orçamentos</h2>
            <p>Busque um orçamento e atualize seu status</p>
          </div>
        </div>


      </div>
  )
}

export default MudarOrcamento
