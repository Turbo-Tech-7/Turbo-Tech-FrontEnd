import React from 'react'
import './css/CardVisaoGeral.css'
import VisaoGeral from '../assets/VisaoGeral.png'

function CardVisaoGeral() {
  return (
    <>
      <div className='container_menu1'>
        <div className='div_img1'>
          <div className='fund_VisaoGeral'>
            <img src={VisaoGeral} alt="VisaoGeral" />
          </div>
          <div className='doc'>
            <h2>Visão Geral</h2>
            <p>Gráfico e KPIs com métricas do sistema</p>
          </div>
        </div>


      </div>
    </>
  )
}

export default CardVisaoGeral
