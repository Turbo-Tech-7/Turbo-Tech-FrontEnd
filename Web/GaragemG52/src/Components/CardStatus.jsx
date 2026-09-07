import React from "react"
import "./css/CardStatus.css"
import buscarpecas from "../assets/buscarpecas.png"

function CardStatus() {
  return (
    <div className="card-status">
      <div className="card-status__content">

        <div className="card-status__icon">
          <img src={buscarpecas} alt="Status" />
        </div>

        <div className="card-status__text">
          <h2>Gerenciar Status</h2>
          <p>Consulte e atualize orçamentos e serviços</p>
        </div>

      </div>
    </div>
  )
}

export default CardStatus
