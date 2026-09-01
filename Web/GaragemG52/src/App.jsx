import Login from "./Pages/Login"
import Cadastro from "./Pages/Cadastro"
import CriarOrcamento from "./Pages/CriarOrcamento"
import CadastrarCliente from "./Pages/CadastrarCliente"
import CriarOrcamentoCliente from "./Pages/CriarOrcamentoCliente"
import VisualizarOrcamento from "./Pages/VisualizarOrcamento"
import CancelarOrcamento from "./Pages/CancelarOrcamento"
import RelatorioOrcamentos from "./Pages/RelatorioOrcamentos"
import RelatorioFinanceiro from "./Pages/RelatorioFinanceiro"
import PrivateRoute from "./Components/Routes/PrivateRoute.jsx"

import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Redirecionar from "./Components/Redirecionar.jsx"
import './App.css'
import Home from "./Pages/Home.jsx"
import RecuperarSenha from "./Pages/RecuperarSenha.jsx"
import RecuperarSenhaVerificar from "./Pages/RecuperarSenhaVerificar"
import RecuperarNovaSenha from "./Pages/RecuperarNovaSenha"
import VerificarConta from "./Pages/VerificarConta"
import VisaoGeral from "./Pages/VisaoGeral"
import BuscarOrcamentos from "./Pages/BuscarOrcamento.jsx"
import ListaOrcamento from "./Pages/ListaOrcamento.jsx"
import BuscarCliente from "./Pages/BuscarClientes.jsx"
import ListarClientes from "./Pages/ListaClientes.jsx"
import StatusOrcamento from "./Pages/StatusOrcamento"

function App() {

  return (
    <main>

      <BrowserRouter>
        <Routes>

          {/* Rotas públicas */}
          <Route path="/" element={<Redirecionar link="login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />

          <Route
            path="/recuperar-senha"
            element={<RecuperarSenha />}
          />

          <Route
            path="/recuperar-senha/verificar"
            element={<RecuperarSenhaVerificar />}
          />

          <Route
            path="/recuperar-senha/nova"
            element={<RecuperarNovaSenha />}
          />

          <Route
            path="/verificar-conta"
            element={<VerificarConta />}
          />

          {/* Rotas protegidas */}
          <Route element={<PrivateRoute />}>

            <Route path="/home" element={<Home />} />
            <Route path="/criar-orcamento" element={<CriarOrcamento />} />
            <Route path="/cadastrar-cliente" element={<CadastrarCliente />} />

            <Route
              path="/criar-orcamento-cliente"
              element={<CriarOrcamentoCliente />}
            />

            <Route
              path="/visualizar-orcamento"
              element={<VisualizarOrcamento />}
            />

            <Route
              path="/cancelar-orcamento"
              element={<CancelarOrcamento />}
            />

            <Route path="/visao-geral" element={<VisaoGeral />} />

            <Route
              path="/lista-orcamentos"
              element={<ListaOrcamento />}
            />

            <Route
              path="/buscar-orcamentos"
              element={<BuscarOrcamentos />}
            />

            <Route
              path="/relatorio-orcamentos"
              element={<RelatorioOrcamentos />}
            />

            <Route
              path="/relatorio-financeiro"
              element={<RelatorioFinanceiro />}
            />

            <Route
              path="/buscar-clientes"
              element={<BuscarCliente />}
            />

            <Route
              path="/lista-clientes"
              element={<ListarClientes />}
            />

            <Route
              path="/status-orcamento"
              element={<StatusOrcamento />}
            />

          </Route>

        </Routes>
      </BrowserRouter>

    </main>
  )
}

export default App