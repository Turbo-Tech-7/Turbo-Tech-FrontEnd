from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os
from dotenv import load_dotenv
import json
from datetime import datetime

# Importar o módulo robo_envio
sys.path.insert(0, os.path.dirname(__file__))

# Importar as funções do robô NO INÍCIO
try:
    from robo_envio import buscar_carro_peca_ai, buscar_pecas_peca_ai,fechar_navegador
    print("✅ Funções do robô importadas com sucesso!")
except ImportError as e:
    print(f"❌ Erro ao importar robo_envio: {e}")
    sys.exit(1)

app = Flask(__name__)
CORS(app)
load_dotenv()

print("🤖 Servidor de Robô de Busca iniciado!")

# ============================================================================
# 1️⃣ ENDPOINT: Buscar dados do carro pela placa
# ============================================================================

@app.route('/api/veiculo/buscar-robo', methods=['POST'])
def buscar_carro():
    """
    Busca dados do carro no site peca.ai usando robô Selenium
    
    Request: { "placa": "ABC1234" }
    Response: {
        "placa": "ABC1234",
        "nomeveiculo": "Volkswagen Gol",
        "cilindradas": "1600cc",
        "cor": "Branco",
        "tipoCombustivel": "Gasolina",
        "ano": "2019"
    }
    """
    try:
        data = request.json
        placa = data.get('placa', '').upper()

        if not placa or len(placa) != 7:
            return jsonify({
                "status": 400,
                "error": "Placa inválida. Deve ter 7 caracteres."
            }), 400

        print(f"🔍 Buscando carro com placa: {placa}")

        resultado = buscar_carro_peca_ai(placa)

        if resultado and resultado.get('status') == 'success':
            return jsonify({
                "status": 200,
                "placa": placa,
                "nomeveiculo": resultado.get('nomeveiculo', 'N/A'),
                "cilindradas": resultado.get('cilindradas', 'N/A'),
                "cor": resultado.get('cor', 'N/A'),
                "tipoCombustivel": resultado.get('tipoCombustivel', 'N/A'),
                "ano": resultado.get('ano', 'N/A'),
                "timestamp": datetime.now().isoformat()
            }), 200
        else:
            return jsonify({
                "status": 404,
                "error": "Carro não encontrado na base de dados."
            }), 404

    except Exception as e:
        print(f"❌ Erro ao buscar carro: {str(e)}")
        return jsonify({
            "status": 500,
            "error": f"Erro ao buscar carro: {str(e)}"
        }), 500


# ============================================================================
# 2️⃣ ENDPOINT: Buscar peças
# ============================================================================

@app.route('/api/pecas/buscar-robo', methods=['POST'])
def buscar_pecas():
    """
    Busca peças no site peca.ai usando robô Selenium
    Retorna as 5 mais baratas para cada peça
    
    Request: { "pecas": ["pneu", "óleo", "filtro"] }
    Response: [
        {
            "idPeca": 1,
            "nomePeca": "Pneu Firestone 195/65 R15",
            "descricaoPeca": "Aro 15 - Modelo X",
            "precoPeca": 250.00,
            "fornecedor": "peca.ai",
            "linkPeca": "https://peca.ai/..."
        },
        ...
    ]
    """
    try:
        data = request.json
        pecas = data.get('pecas', [])

        if not pecas or len(pecas) == 0:
            return jsonify({
                "status": 400,
                "error": "Nenhuma peça foi fornecida."
            }), 400

        if len(pecas) > 10:
            return jsonify({
                "status": 400,
                "error": "Máximo de 10 peças por busca."
            }), 400

        print(f"🔍 Buscando peças: {pecas}")

        resultado = buscar_pecas_peca_ai(pecas)

        if resultado and resultado.get('status') == 'success':
            pecas_encontradas = resultado.get('pecas', [])
            
            # Formatar resposta
            response = []
            for idx, peca in enumerate(pecas_encontradas, 1):
                response.append({
                    "idPeca": idx,
                    "nomePeca": peca.get('nome', 'N/A'),
                    "descricaoPeca": peca.get('descricao', 'N/A'),
                    "precoPeca": float(peca.get('preco', 0)),
                    "fornecedor": "peca.ai",
                    "linkPeca": peca.get('link', '')
                })

            return jsonify({
                "status": 200,
                "total": len(response),
                "pecas": response,
                "timestamp": datetime.now().isoformat()
            }), 200
        else:
            return jsonify({
                "status": 404,
                "error": "Nenhuma peça encontrada.",
                "pecas": []
            }), 404


    except Exception as e:
        print(f"❌ Erro ao buscar peças: {str(e)}")
        return jsonify({
            "status": 500,
            "error": f"Erro ao buscar peças: {str(e)}",
            "pecas": []
        }), 500

    
# ============================================================================
# 3️⃣ ENDPOINT: Health Check
# ============================================================================

@app.route('/api/health', methods=['GET'])
def health_check():
    """Verifica se o servidor está funcionando"""
    return jsonify({
        "status": "online",
        "service": "Robô de Busca - peca.ai",
        "timestamp": datetime.now().isoformat()
    }), 200

##
@app.route('/api/robo/fechar', methods=['POST'])
def fechar_robo():
    try:
        resultado = fechar_navegador()

        if resultado["status"] == "success":
            return jsonify(resultado), 200

        return jsonify(resultado), 400

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


# ============================================================================
# 4️⃣ ERROR HANDLER
# ============================================================================

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        "status": 404,
        "error": "Endpoint não encontrado"
    }), 404


@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        "status": 500,
        "error": "Erro interno do servidor"
    }), 500







# ============================================================================
# 5️⃣ MAIN
# ============================================================================

if __name__ == '__main__':
    print("\n" + "="*60)
    print("🚀 Iniciando API do Robô de Busca de Peças")
    print("="*60)
    print("📍 Endpoint 1: POST /api/veiculo/buscar-robo")
    print("   → Busca dados do carro pela placa")
    print("\n📍 Endpoint 2: POST /api/pecas/buscar-robo")
    print("   → Busca peças mais baratas")
    print("\n📍 Health Check: GET /api/health")
    print("="*60 + "\n")
    
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=True,
        use_reloader=False
    )
