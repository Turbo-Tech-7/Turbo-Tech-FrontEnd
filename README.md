# Garagem G52

Aplicacao web da Garagem G52, desenvolvida com React 19 e Vite. O sistema oferece autenticacao, cadastro e consulta de clientes e veiculos, criacao e acompanhamento de orcamentos e visualizacao de relatorios.

Este README documenta somente o diretorio `Web/GaragemG52`.

## Arquitetura em camadas

O projeto organiza suas responsabilidades em camadas. O fluxo normal de uma funcionalidade e:

```text
Pagina (Pages)
  -> Componentes de tela (Components)
    -> Hooks e contextos (hooks/context)
      -> Servicos (services)
        -> API principal ou servico externo
```

As regras de calculo que nao dependem de React ficam em `domain`. Os arquivos CSS acompanham as paginas e os componentes que estilizam.

## Estrutura do diretorio

```text
GaragemG52/
|-- data/
|   `-- db.json
|-- public/
|-- src/
|   |-- App.jsx
|   |-- main.jsx
|   |-- App.css
|   |-- index.css
|   |-- assets/
|   |-- Components/
|   |   |-- css/
|   |   `-- Routes/
|   |-- config/
|   |-- context/
|   |-- domain/
|   |-- hooks/
|   |-- Pages/
|   |   `-- CSS/
|   `-- services/
|-- .envExample
|-- eslint.config.js
|-- index.html
|-- package.json
`-- vite.config.js
```

## Responsabilidade de cada camada

### Arquivos da raiz

- `package.json`: define os comandos, as dependencias e as informacoes do projeto.
- `vite.config.js`: configura o Vite, utilizado no desenvolvimento e na geracao da versao de producao.
- `eslint.config.js`: define as regras de verificacao estatica do JavaScript e do React.
- `index.html`: documento HTML que fornece o elemento `#root` onde o React e montado.
- `.envExample`: modelo das variaveis de ambiente utilizadas pela aplicacao.

### Inicializacao e composicao da aplicacao

- `src/main.jsx`: ponto de entrada. Cria a raiz do React, carrega os estilos globais e envolve a aplicacao com `ClienteContextProvider` e `OrcamentoContextProvider`.
- `src/App.jsx`: organiza as rotas com `react-router-dom` e separa as rotas publicas das rotas protegidas por `PrivateRoute`.
- `src/App.css` e `src/index.css`: contem os estilos globais e os estilos da composicao principal.

### `src/Pages`

Representa as telas acessiveis pelas rotas, como login, cadastro, pagina inicial, busca de clientes, lista de orcamentos, criacao de orcamento e relatorios.

As paginas organizam a tela e conectam os componentes ao fluxo de navegacao. A logica visual e interativa mais especifica fica nos componentes importados por elas.

`src/Pages/CSS` concentra os estilos associados as paginas.

### `src/Components`

Contem componentes de interface reutilizaveis ou especializados em uma etapa de um fluxo. Exemplos: cartoes de cadastro e consulta, formularios, janelas modais, listas, mensagens e componentes do painel de indicadores.

Os componentes podem consumir hooks, contextos e servicos para executar operacoes. Eles devem concentrar a apresentacao e a interacao da tela, evitando duplicar regras de acesso a API.

- `Components/Routes/PrivateRoute.jsx`: controla o acesso as rotas autenticadas.
- `Components/css`: concentra os estilos dos componentes.
- `Components/Redirecionar.jsx`: componente auxiliar para redirecionamentos de navegacao.

### `src/context`

Mantem o estado compartilhado entre paginas e componentes, evitando a passagem manual de propriedades por varios niveis.

- `ClienteContext.jsx`: guarda os dados do cliente e do veiculo em andamento, disponibiliza atualizadores e permite limpar o cadastro atual. O estado e persistido no armazenamento local do navegador com a chave `CacheCliente`.
- `OrcamentoContext.jsx`: guarda a descricao, a mao de obra e as pecas do orcamento, disponibiliza operacoes para adicionar e remover itens e calcula os totais. O estado e persistido com a chave `CacheOrcamento`.
- `clienteContextDefinition.js` e `orcamentoContextDefinition.js`: definem os objetos de contexto consumidos pelos provedores e hooks.

Essa camada deve ser usada para estados de negocio compartilhados entre telas. Estados exclusivamente visuais, como abrir uma janela modal ou controlar um filtro, permanecem no componente ou hook local.

### `src/hooks`

Reune logica reutilizavel do React e integracoes comuns:

- `UseFetch.jsx`: executa requisicoes HTTP, monta a URL e os parametros de consulta, envia o token de autorizacao, interpreta respostas JSON, texto, PDF e arquivos binarios e disponibiliza `data`, `error`, `loading` e `httpConfig`.
- `useClienteContext.jsx` e `useOrcamentoContext.jsx`: encapsulam o consumo dos contextos e verificam se foram usados dentro dos provedores corretos.
- `utils.jsx`: contem funcoes utilitarias e validacoes compartilhadas pelos fluxos.

### `src/services`

E a camada de acesso a dados e de comunicacao com as APIs. Os servicos encapsulam os enderecos e as operacoes dos recursos para que paginas e componentes nao precisem conhecer detalhes de URL, verbo HTTP ou autenticacao.

- `authService.js`: login, cadastro, verificacao de codigo e recuperacao de senha.
- `clienteService.js`: consulta, busca, cadastro e remocao de clientes e veiculos.
- `orcamentoService.js`: operacoes de orcamentos.
- `dashboardService.js`: dados da visao geral e dos indicadores.
- `fornecedorService.js`, `pecaService.js`, `servicoService.js`, `usuarioService.js` e `veiculoService.js`: operacoes das respectivas entidades.
- `roboService.js`: integra o frontend ao servico externo de busca automatizada de veiculos e pecas.
- `authStorage.js`: leitura e armazenamento do token de autenticacao.
- `cacheStorage.js`: leitura, escrita e limpeza de dados no armazenamento local do navegador.

Em geral, os servicos que acessam a API utilizam `UseFetch`, que centraliza cabecalhos, token, conversao do corpo da requisicao e tratamento da resposta.

### `src/config`

- `api.js`: centraliza os enderecos dos servicos. A API principal usa `VITE_BACK_URL` e, por padrao, `http://localhost:8080`. O servico do robo usa `VITE_ROBO_URL` e, por padrao, `http://localhost:5000`.

### `src/domain`

- `orcamentoTotais.js`: contem as regras puras para calcular o total das pecas e o total geral do orcamento.

Essa camada nao deve depender de React, do navegador ou de requisicoes HTTP. Ela e o local adequado para regras de negocio deterministicas que possam ser testadas isoladamente.

### `src/assets` e `public`

- `src/assets`: imagens e outros recursos importados diretamente pelos componentes React.
- `public`: arquivos disponibilizados pelo Vite sem processamento pelo pacote final. Atualmente contem o icone padrao do Vite.

### `data`

`data/db.json` e um arquivo local de dados de apoio ou simulacao. Ele nao substitui a API principal configurada em `src/config/api.js`; seu uso depende de alguma ferramenta ou fluxo local que o consuma.

## Rotas

As rotas sao declaradas em `src/App.jsx`.

- Publicas: login, cadastro, recuperacao de senha e verificacao de conta.
- Protegidas: pagina inicial, clientes, veiculos, orcamentos, cancelamento, status, visao geral e relatorios.

As rotas protegidas ficam dentro de `PrivateRoute`, que impede o acesso quando nao existe uma autenticacao valida.

## Configuracao do ambiente

Crie um arquivo `.env` neste diretorio com os enderecos dos servicos quando eles forem diferentes dos valores padrao:

```env
VITE_BACK_URL=http://localhost:8080
VITE_ROBO_URL=http://localhost:5000
```

O prefixo `VITE_` e necessario para que o Vite disponibilize as variaveis ao frontend.

## Como executar

Dentro de `Web/GaragemG52`:

```bash
npm install
npm run dev
```

Comandos disponiveis:

```bash
npm run dev      # inicia o servidor de desenvolvimento
npm run build    # gera a versao de producao em dist/
npm run preview  # disponibiliza localmente a versao gerada
npm run lint     # executa a verificacao do ESLint
```

Para que todas as funcionalidades funcionem, a API principal deve estar disponivel no endereco de `VITE_BACK_URL`. As funcionalidades do robo tambem dependem do servico configurado em `VITE_ROBO_URL`.
