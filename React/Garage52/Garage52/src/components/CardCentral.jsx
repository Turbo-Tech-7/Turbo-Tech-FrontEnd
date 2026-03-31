import React from 'react'
import './css/CardCentral.css'
import engrenagem from '../assets/engrenagem.png';
import sair from '../assets/sair.png'

function CardCentral() {
  return (
    <div className='container'>
      
      <div className='container_2'>
        <img className='img_engrenagem' src={engrenagem} alt="Engrenagem" />

        <div className='gestao'>
          <h2>Central de Gestão</h2>
          <p>Boas vindas Rodolfo</p>
        </div>
      </div>

      <div className='logout'>
        <p>Sair</p>
        <img className='img_sair' src={sair} alt="Sair" />
      </div>

    </div>
  )
}

export default CardCentral;