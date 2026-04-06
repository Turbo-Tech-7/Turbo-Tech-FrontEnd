import React from 'react'
import './css/CardCentral.css'
import engrenagem from '../assets/engrenagem.png';
import sair from '../assets/sair.png'
import { Navigate, NavLink } from 'react-router-dom'


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


      <NavLink to="/login" className="logout_link">
        <p>Sair</p>
        <img className='img_sair' src={sair} alt="Sair" />
      </NavLink>

    </div>
  )
}

export default CardCentral;