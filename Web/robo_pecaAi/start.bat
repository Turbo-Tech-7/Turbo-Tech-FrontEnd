@echo off
REM Script para iniciar o servidor de robô no Windows

echo.
echo ============================================================
echo 🤖 Iniciando Servidor de Robô de Busca - Peca.ai
echo ============================================================
echo.

REM Verificar se o venv existe
if not exist "venv\" (
    echo ❌ Ambiente virtual não encontrado!
    echo.
    echo Criando ambiente virtual...
    python -m venv venv
    echo ✅ Ambiente virtual criado
    echo.
)

REM Ativar venv
echo Ativando ambiente virtual...
call venv\Scripts\activate.bat

REM Verificar se requirements.txt foi instalado
pip show flask >nul 2>&1
if errorlevel 1 (
    echo.
    echo 📦 Instalando dependências...
    pip install -r requirements.txt
    echo.
)

REM Verificar se .env existe
if not exist ".env" (
    echo.
    echo ⚠️  ATENÇÃO: Arquivo .env não encontrado!
    echo.
    echo 1. Copie o arquivo .env.example para .env
    echo 2. Abra o arquivo .env e preencha com suas credenciais:
    echo    - EMAIL_PECA_AI=seu_email@email.com
    echo    - SENHA_PECA_AI=sua_senha
    echo.
    pause
)

REM Iniciar servidor
echo.
echo 🚀 Iniciando servidor em http://localhost:5000
echo.
python api_server.py

pause
