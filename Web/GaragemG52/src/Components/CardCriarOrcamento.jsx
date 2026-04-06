import React from 'react'
import './css/CardCriarOrcamento.css'
import criardoc from '../assets/criardoc.png'

function CardCriarOrcamento() {
  return (
    <>
      <div className='container_menu1'>
        <div className='div_img1'>
          <div className='fund_img'>
            <img className='img_orcamento'  src={criardoc} alt="criardoc" />
          </div>
          <div className='doc'>
            <h2>Criar Orçamento</h2>
            <p>Criar novo orçamento de
              serviço</p>
          </div>
        </div>


      </div>
    </>
  )
}

export default CardCriarOrcamento
