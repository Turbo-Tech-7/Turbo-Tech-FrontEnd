import React from 'react'
import './css/CardBuscarOrcamentos.css'
import BuscarOrcamentos from '../assets/BuscarOrcamentos.png'

function CardBuscarOrcamentos() {
  return (
    <>
      <div className='container_menu1'>
        <div className='div_img1'>
          <div className='fund_BuscarOrcamentos'>
            <img src={BuscarOrcamentos} alt="BuscarOrcamentos" />
          </div>
          <div className='doc'>
            <h2>Buscar Orçamentos</h2>
            <p>Consultar orçamentos existentes</p>
          </div>
        </div>


      </div>
    </>
  )
}

export default CardBuscarOrcamentos
