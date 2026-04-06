import React from 'react'
import './css/CardBuscarPecas.css'
import buscarpecas from '../assets/buscarpecas.png'

function CardBuscarPecas() {
  return (
    <>
      <div className='container_menu1'>
        <div className='div_img1'>
          <div className='fund_buscar'>
            <img  src={buscarpecas} alt="criardoc" />
          </div>
          <div className='doc'>
            <h2>Buscar Peças</h2>
            <p>Consulta rápida para compra de peças</p>
          </div>
        </div>


      </div>
    </>
  )
}

export default CardBuscarPecas
