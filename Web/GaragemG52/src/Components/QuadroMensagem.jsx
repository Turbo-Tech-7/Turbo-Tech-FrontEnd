//hooks
import { useState } from "react"
import { useUsuarioService } from "../services/usuarioService"
import { useVeiculoService } from "../services/veiculoService"
import { useServicoService } from "../services/servicoService"

//CSS


const QuadroMensagem = () => {

    //Dado da respota

    const [dados, setDados] = useState({ usuario: null, veiculo: null, servico: null });

    const { listarUsuarios, remover: removerUsuario } = useUsuarioService()
    const { listar: listarVeiculos, remover: removerVeiculo } = useVeiculoService()
    const { listar: listarServicos, remover: removerServico } = useServicoService()

  async function getData() {

    try {
        const [resUsuario, resVeiculo, resServico] = await Promise.all([
            listarUsuarios(),
            listarVeiculos(),
            listarServicos(),
        ])

        setDados({
            usuario: resUsuario.data || [],
            veiculo: resVeiculo.data || [],
            servico: resServico.data || []
        })
        
        console.log("Dados carregados com sucesso!");
    } catch (error) {
        console.error("Erro ao buscar dados:", error);
    }
}

    const deleteCard = async (id) => {
        await Promise.all([
            removerUsuario(id),
            removerVeiculo(id),
            removerServico(id),
        ])
        getData()
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

export default QuadroMensagem