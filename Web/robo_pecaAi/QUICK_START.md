# 🚀 Quick Start - Robô de Busca Peca.ai

## 1️⃣ Configuração Inicial

### Windows (PowerShell)

```powershell
# Navegue até a pasta robo_pecaAi
cd "C:\Users\seu_usuario\Documents\3 SEM\PI\Turbo-Tech-FrontEnd\Web\robo_pecaAi"

# Crie um ambiente virtual
python -m venv venv

# Ative o ambiente virtual
.\venv\Scripts\Activate.ps1

# Instale as dependências
pip install -r requirements.txt
```

### Mac/Linux

```bash
cd ~/path/to/robo_pecaAi

python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

---

## 2️⃣ Configurar Credenciais

1. Copie o arquivo `.env.example` para `.env`:
   ```bash
   cp .env.example .env
   ```

2. Abra o arquivo `.env` e preencha com suas credenciais do peca.ai:
   ```env
   EMAIL_PECA_AI=seu_email@email.com
   SENHA_PECA_AI=sua_senha
   ```

---

## 3️⃣ Iniciar o Servidor

Com o ambiente virtual ativado:

```bash
python api_server.py
```

Você verá algo assim:

```
============================================================
🚀 Iniciando API do Robô de Busca de Peças
============================================================
📍 Endpoint 1: POST /api/veiculo/buscar-robo
   → Busca dados do carro pela placa

📍 Endpoint 2: POST /api/pecas/buscar-robo
   → Busca peças mais baratas

📍 Health Check: GET /api/health
============================================================

 * Running on http://0.0.0.0:5000
```

---

## 4️⃣ Testar os Endpoints

### Teste 1: Health Check (verificar se está rodando)

```bash
curl http://localhost:5000/api/health
```

### Teste 2: Buscar carro

```bash
curl -X POST http://localhost:5000/api/veiculo/buscar-robo \
  -H "Content-Type: application/json" \
  -d '{"placa": "ABC1234"}'
```

### Teste 3: Buscar peças

```bash
curl -X POST http://localhost:5000/api/pecas/buscar-robo \
  -H "Content-Type: application/json" \
  -d '{"pecas": ["pneu", "óleo", "filtro"]}'
```

---

## 5️⃣ Usar no Frontend React

No seu código React, você pode chamar assim:

```javascript
// Buscar carro
const resultado = await fetch("http://localhost:5000/api/veiculo/buscar-robo", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ placa: "ABC1234" })
})
const dados = await resultado.json()
console.log(dados)
```

---

## ⚡ Resumo dos Comandos

| Ação | Comando |
|------|---------|
| Ativar venv (Windows) | `.\venv\Scripts\Activate.ps1` |
| Ativar venv (Mac/Linux) | `source venv/bin/activate` |
| Instalar dependências | `pip install -r requirements.txt` |
| Iniciar servidor | `python api_server.py` |
| Sair do venv | `deactivate` |

---

## 📝 Checklist de Primeiro Uso

- [ ] Ambiente virtual criado e ativado
- [ ] Dependências instaladas (`pip install -r requirements.txt`)
- [ ] Arquivo `.env` criado com credenciais
- [ ] Servidor rodando (`python api_server.py`)
- [ ] Health check funcionando (`curl http://localhost:5000/api/health`)
- [ ] Frontend React configurado para chamar `http://localhost:5000`

---

## 🆘 Problemas Comuns

### "ModuleNotFoundError: No module named 'flask'"
- Solução: Instale as dependências com `pip install -r requirements.txt`

### "ConnectionError: No connection could be made"
- Solução: Verifique se o servidor está rodando com `python api_server.py`

### "Credenciais não configuradas"
- Solução: Crie o arquivo `.env` com as credenciais corretas

### Lento/Timeout
- O robô pode demorar 30-60 segundos por busca
- Aumente o timeout em `WebDriverWait(driver, 20)` se necessário

---

**Precisa de ajuda?** Verifique o arquivo `README.md` para documentação completa.
