//hooks
import { useState } from "react"
import { useFetch } from "../hooks/useFetch"

//CSS


const quadroMensagem = () => {

    //Dado da respota

    const [dados, setDados] = useState({ usuario: null, veiculo: null, servico: null });

    const url = "http://localhost:3000"

    const {httpConfig} = useFetch(url)

  async function getData() {

    try {
        const resUsuario = await httpConfig("", "GET", "usuario");
        const resVeiculo = await httpConfig("", "GET", "veiculo");
        const resServico = await httpConfig("", "GET", "servico");

        setDados({
            usuario: resUsuario,
            veiculo: resVeiculo,
            servico: resServico
        })
        
        console.log("Dados carregados com sucesso!");
    } catch (error) {
        console.error("Erro ao buscar dados:", error);
    }
}

    const deleteCard = (id) => {
        httpConfig(id, "DELETE", "usuario")
        httpConfig(id, "DELETE", "veiculo")
        httpConfig(id, "DELETE", "servico")
        getData(Event)
    }

  return (
    <main>
        <div id="div_mensagem">
        <button onClick={() => getData()}>Buscas serviços</button>
     
    <ul>
    {dados.usuario && dados.usuario.map((user) => {
        const veiculoRelacionado = dados.veiculo?.find((v) => v.id === user.id);
        
        const servicoRelacionado = dados.servico?.find((s) => s.id === user.id);

        return (
            <li key={user.id}>
                <div id="div_dados">
                <h2>Dados do Cliente</h2>
                <p><strong>Nome:</strong> {user.nome}</p>
                <p><strong>Veículo (Placa):</strong> {veiculoRelacionado?.placa}</p>
                <p><strong>Serviço:</strong> {servicoRelacionado?.servico || "Nenhum serviço"}</p>
                </div>
                <div id="div_botao">
                    <button onClick={(e) => {
                        e.stopPropagation();
                        deleteCard(user.id)}} className="buttonDelete">X</button>
                </div>
            </li>
        );
    })}
</ul>

        </div>
    </main>
  )
}

export default quadroMensagem