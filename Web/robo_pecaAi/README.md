# 🤖 API do Robô de Busca - Peca.ai

Servidor Flask que fornece endpoints para buscar dados de carros e peças no site peca.ai

## 📋 Requisitos

- Python 3.8+
- Chrome/Chromium instalado
- Arquivo `.env` com credenciais do peca.ai

## 🚀 Instalação

### 1. Instalar dependências

```bash
pip install -r requirements.txt
```

### 2. Configurar .env

Crie um arquivo `.env` na raiz do projeto com suas credenciais:

```env
EMAIL_PECA_AI=seu_email@email.com
SENHA_PECA_AI=sua_senha
```

### 3. Iniciar o servidor

```bash
python api_server.py
```

O servidor rodará em: `http://localhost:5000`

## 📡 Endpoints

### 1. Buscar dados do carro

**Endpoint:** `POST /api/veiculo/buscar-robo`

**Request:**
```json
{
  "placa": "ABC1234"
}
```

**Response (Success - 200):**
```json
{
  "status": 200,
  "placa": "ABC1234",
  "nomeveiculo": "Volkswagen Gol",
  "cilindradas": "1600cc",
  "cor": "Branco",
  "tipoCombustivel": "Gasolina",
  "ano": "2019",
  "timestamp": "2024-06-08T10:30:00"
}
```

**Response (Error - 400):**
```json
{
  "status": 400,
  "error": "Placa inválida. Deve ter 7 caracteres."
}
```

---

### 2. Buscar peças

**Endpoint:** `POST /api/pecas/buscar-robo`

**Request:**
```json
{
  "pecas": ["pneu", "óleo", "filtro"]
}
```

**Response (Success - 200):**
```json
{
  "status": 200,
  "total": 15,
  "pecas": [
    {
      "idPeca": 1,
      "nomePeca": "Pneu Firestone 195/65 R15",
      "descricaoPeca": "Aro 15 - Modelo X",
      "precoPeca": 250.00,
      "fornecedor": "peca.ai",
      "linkPeca": "https://peca.ai/..."
    },
    {
      "idPeca": 2,
      "nomePeca": "Óleo Mobil 5W-30",
      "descricaoPeca": "Sintético - 1 Litro",
      "precoPeca": 35.50,
      "fornecedor": "peca.ai",
      "linkPeca": "https://peca.ai/..."
    }
  ],
  "timestamp": "2024-06-08T10:35:00"
}
```

**Response (Error - 400):**
```json
{
  "status": 400,
  "error": "Nenhuma peça foi fornecida.",
  "pecas": []
}
```

---

### 3. Health Check

**Endpoint:** `GET /api/health`

**Response:**
```json
{
  "status": "online",
  "service": "Robô de Busca - peca.ai",
  "timestamp": "2024-06-08T10:40:00"
}
```

---

## 🔗 Integrando com o Frontend

No seu código React, chame os endpoints assim:

```javascript
// Buscar carro
const buscarCarroComRobo = async (placa) => {
  const res = await fetch('http://localhost:5000/api/veiculo/buscar-robo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ placa })
  })
  return res.json()
}

// Buscar peças
const buscarPecasComRobo = async (pecas) => {
  const res = await fetch('http://localhost:5000/api/pecas/buscar-robo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pecas })
  })
  return res.json()
}
```

## ⚡ Modo Manual

Para testar o robô sem o servidor Flask, execute:

```bash
python robo_envio.py
```

Isso abrirá um modo interativo onde você pode digitar a placa e as peças.

## 🐛 Troubleshooting

### "Credenciais não configuradas"
- Verifique se o arquivo `.env` existe na pasta `robo_pecaAi/`
- Verifique se as variáveis `EMAIL_PECA_AI` e `SENHA_PECA_AI` estão corretas

### "Placa não encontrada"
- Verifique se a placa está no formato correto (7 caracteres)
- Tente acessar manualmente o site peca.ai para confirmar que a placa existe

### "Timeout na busca"
- O robô pode estar demorando. Aumente o tempo em `WebDriverWait(driver, 20)` no código
- Verifique sua conexão com a internet

## 📝 Notas Importantes

- ⏳ A busca por carro e peças pode demorar 30-60 segundos
- 🔐 Nunca commit o arquivo `.env` com suas credenciais!
- 🌐 O servidor rodará em `localhost:5000` por padrão
- 🔄 Cada requisição abre um novo navegador Chrome (headless)

## 📦 Estrutura de Arquivos

```
robo_pecaAi/
├── api_server.py          # Servidor Flask com endpoints
├── robo_envio.py          # Script de busca (refatorado para funções modulares)
├── requirements.txt       # Dependências Python
├── .env                   # Credenciais (não versionado)
└── README.md             # Este arquivo
```

---

**Desenvolvido por:** Garagem G52  
**Data:** Junho 2024
