import React from 'react'
import './css/CardBuscarClientes.css'
import BuscarClientes from '../assets/BuscarClientes.png'

function CardBuscarClientes() {
  return (
    <>
      <div className='container_menu1'>
        <div className='div_img1'>
          <div className='fund_BuscarClientes'>
            <img src={BuscarClientes} alt="BuscarClientes" />
          </div>
          <div className='doc'>
            <h2>Buscar Clientes</h2>
            <p>Consultar clientes existentes</p>
          </div>
        </div>


      </div>
    </>
  )
}

export default CardBuscarClientes
