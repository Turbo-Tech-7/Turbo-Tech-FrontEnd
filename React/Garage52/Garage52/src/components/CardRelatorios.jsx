import React from 'react'
import './css/CardRelatorios.css'
import Relatorios from '../assets/Relatorios.png'

function CardRelatorios() {
  return (
    <>
      <div className='container_menu1'>
        <div className='div_img1'>
          <div className='fund_relatorios'>
            <img  src={Relatorios} alt="Relatorios" />
          </div>
          <div className='doc'>
            <h2>Relatórios</h2>
            <p>Relatórios financeiros e operacionais</p>
          </div>
        </div>


      </div>
    </>
  )
}

export default CardRelatorios
