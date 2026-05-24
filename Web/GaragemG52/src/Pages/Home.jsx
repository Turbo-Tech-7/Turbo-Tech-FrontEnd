import { Link } from "react-router-dom"
import './css/Home.css'

import CardCentral from '../Components/CardCentral'
import CardCriarOrcamento from '../Components/CardCriarOrcamento'
import CardBuscarPecas from '../Components/CardBuscarPecas'
import CardRelatorios from '../Components/CardRelatorios'
import CardBuscarOrcamentos from '../Components/CardBuscarOrcamentos'
import CardBuscarClientes from '../Components/CardBuscarClientes'
import CardVisaoGeral from '../Components/CardVisaoGeral'

function Home() {
  return (
    <>
      <div className='header'>
        <CardCentral />
      </div>

      <div className='menu'>
        <Link to="/criar-orcamento" >
          <CardCriarOrcamento />
        </Link>

        <CardBuscarPecas />
        <CardRelatorios />
        <CardBuscarOrcamentos />
        <CardBuscarClientes />
        <Link to="/visao-geral">
          <CardVisaoGeral />
        </Link>
      </div>
    </>
  )
}

export default Home