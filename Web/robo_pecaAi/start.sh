#!/bin/bash

# Script para iniciar o servidor de robô em Mac/Linux

echo ""
echo "============================================================"
echo "🤖 Iniciando Servidor de Robô de Busca - Peca.ai"
echo "============================================================"
echo ""

# Verificar se o venv existe
if [ ! -d "venv" ]; then
    echo "❌ Ambiente virtual não encontrado!"
    echo ""
    echo "Criando ambiente virtual..."
    python3 -m venv venv
    echo "✅ Ambiente virtual criado"
    echo ""
fi

# Ativar venv
echo "Ativando ambiente virtual..."
source venv/bin/activate

# Verificar se requirements.txt foi instalado
pip show flask > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo ""
    echo "📦 Instalando dependências..."
    pip install -r requirements.txt
    echo ""
fi

# Verificar se .env existe
if [ ! -f ".env" ]; then
    echo ""
    echo "⚠️  ATENÇÃO: Arquivo .env não encontrado!"
    echo ""
    echo "1. Copie o arquivo .env.example para .env"
    echo "   $ cp .env.example .env"
    echo ""
    echo "2. Abra o arquivo .env e preencha com suas credenciais:"
    echo "   EMAIL_PECA_AI=seu_email@email.com"
    echo "   SENHA_PECA_AI=sua_senha"
    echo ""
    read -p "Pressione ENTER após configurar o arquivo .env..."
fi

# Iniciar servidor
echo ""
echo "🚀 Iniciando servidor em http://localhost:5000"
echo ""
python api_server.py
