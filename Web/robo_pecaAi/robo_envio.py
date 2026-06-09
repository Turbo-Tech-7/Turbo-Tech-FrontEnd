from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
from dotenv import load_dotenv
import os 
import unicodedata
import time
import traceback

driver = None
def remover_acentos(texto):
    return unicodedata.normalize('NFKD', texto)\
        .encode('ASCII', 'ignore')\
        .decode('ASCII')

def pegar_pecas_mais_baratas(driver, wait, peca,limite=5):
    """Extrai as 5 peças mais baratas dos resultados"""
    
    lista_pecas = []

    # 🔹 esperar os cards carregarem
    wait.until(EC.presence_of_element_located(
        (By.XPATH, '//div[contains(@class,"ProductCard_productCard")]')
    ))

    cards = driver.find_elements(By.XPATH, '//div[contains(@class,"ProductCard_productCard")]')

    for card in cards:
        try:
            # 🔹 Nome
            nome = card.find_element(By.XPATH, './/h6').text
                        
            nome_processado = remover_acentos(nome.lower())

            palavras_peca = remover_acentos(
                peca.lower()
            ).split()

            if not all(
                palavra in nome_processado
                for palavra in palavras_peca
            ):
                continue


            # 🔹 Preço atual (não o riscado)
            preco_texto = card.find_element(
                By.XPATH, './/p[contains(@class,"ProductCard_price")]'
            ).text

            preco = float(
                preco_texto.replace("R$", "")
                .replace(".", "")
                .replace(",", ".")
                .strip()
            )

            # 🔥 Link direto do <a> (sem clique)
            link = card.find_element(By.XPATH, './/ancestor::a').get_attribute("href")

            lista_pecas.append({
                "nome": nome,
                "preco": preco,
                "link": link
            })

        except Exception as e:
            print("Erro ao processar card:", e)
            continue

    # 🔥 ordenar pelos mais baratos
    lista_ordenada = sorted(lista_pecas, key=lambda x: x["preco"])

    # 🔥 retornar os mais baratos
    return lista_ordenada[:limite]


# ============================================================================
# 🤖 FUNÇÃO 1: Buscar dados do carro
# ============================================================================

def buscar_carro_peca_ai(placa):
    """
    Busca dados do carro no peca.ai e retorna um dicionário
    
    Args:
        placa (str): Placa do veículo (ex: "ABC1234")
    
    Returns:
        dict: {
            "status": "success" ou "error",
            "nomeveiculo": "...",
            "cilindradas": "...",
            "cor": "...",
            "tipoCombustivel": "...",
            "ano": "..."
        }
    """
    
    options = webdriver.ChromeOptions()
    # options.add_argument("--headless=new")
    # options.add_argument('--headless')  # Executar sem interface gráfica
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    global driver 
    driver = webdriver.Chrome(options=options)
    wait = WebDriverWait(driver, 10)


    try:
        load_dotenv()
        
        email = os.getenv("EMAIL_PECA_AI")
        senha = os.getenv("SENHA_PECA_AI")
        
        if not email or not senha:
            print("❌ Credenciais do peca.ai não configuradas no .env")
            return {"status": "error", "message": "Credenciais não configuradas"}
        
        # Abrir o site
        url = "http://peca.ai/"
        driver.get(url)
        print(f"✅ Navegador aberto em: {url}")
        
        time.sleep(3)  # Aguardar carregamento da página
        
        # Clicar no botão de login (esperando por ser clicável, não só presente)
        botaoLogar = wait.until(EC.element_to_be_clickable(
            (By.XPATH, '//*[@id="__next"]/div[2]/header/div[1]/div[2]/div[2]/button')
        ))
        
        # Scroll para garantir visibilidade
        driver.execute_script("arguments[0].scrollIntoView(true);", botaoLogar)
        time.sleep(1)
        
        botaoLogar.click()
        print("✅ Botão de login clicado")
        
        time.sleep(3)
        
        # Preencher email
        usuario = wait.until(EC.presence_of_element_located(
            (By.XPATH, '/html/body/div[3]/div/div[1]/div/div/div[3]/div[2]/form/div[1]/div[2]/input')
        ))
        print("✅ Campo de email encontrado")
        usuario.send_keys(email)
        print(f"✅ Email preenchido: {email}")

        # Preencher senha
        campo_senha = wait.until(EC.presence_of_element_located(
            (By.XPATH, '/html/body/div[3]/div/div[1]/div/div/div[3]/div[2]/form/div[2]/div[2]/input')
        ))
        print("✅ Campo de senha encontrado")
        campo_senha.send_keys(senha)
        print("✅ Senha preenchida")

        # Clicar em login
        botaoEnviarLogin = wait.until(EC.element_to_be_clickable(
            (By.XPATH, '/html/body/div[3]/div/div[1]/div/div/div[3]/div[2]/form/button')
        ))
        print("✅ Botão de login encontrado")
        botaoEnviarLogin.click()
        print("✅ Clicado em enviar login")
        
        time.sleep(5)  # Aguardar redirecionamento após login
        
        # Digitar placa
        inputPlaca = wait.until(EC.presence_of_element_located(
            (By.XPATH, '//*[@id="__next"]/div[2]/main/span[1]/div/div[2]/div[2]/div[1]/form/div[1]/div[2]/input')
        ))
        print(f"✅ Campo de placa encontrado, digitando: {placa}")

        for letra in placa:
            inputPlaca.send_keys(letra)
            time.sleep(0.2)
              # 200ms entre cada tecla
            
        time.sleep(2)
        inputPlaca.send_keys(Keys.BACKSPACE)

        time.sleep(1)

        # digita novamente
        inputPlaca.send_keys(placa[-1])

        dados = {}

        # Esperar os dados carregarem
        print("⏳ Aguardando dados do veículo...")
        wait.until(EC.presence_of_all_elements_located(
            (By.XPATH, '//div[contains(@class,"d-flex mb-2")]')
        ))
        print("✅ Dados carregados!")

        infos = driver.find_elements(By.XPATH, '//div[contains(@class,"d-flex mb-2")]')

        for info in infos:
            textos = info.find_elements(By.TAG_NAME, "p")
            
            if len(textos) >= 2:
                chave = textos[0].text.replace(":", "")
                valor = textos[1].text
                
                dados[chave] = valor

        # Esperar os valores carregarem
        wait.until(EC.presence_of_all_elements_located(
            (By.XPATH, '//div[contains(@class,"singleValue")]')
        ))
        
        valores = driver.find_elements(By.XPATH, '//div[contains(@class,"singleValue")]')

        if len(valores) >= 2:
            dados["Nome do veiculo:"] = valores[0].text
            dados["Cilindradas:"] = valores[1].text
        else:
            print("⚠️  Alguns dados do veículo não foram encontrados")   

        print("✅ Dados dos carros obtidos com sucesso")

        botao_confirmarDados = wait.until(EC.element_to_be_clickable(
            (By.XPATH, '//*[@id="__next"]/div[2]/main/span[1]/div/div[2]/div[2]/div[1]/div[10]/button')
        ))
        print("✅ Botão de confirmar informações encontrado")
        botao_confirmarDados.click()
        print(dados.keys())
        return {
            "status": "success",
            "nomeveiculo": dados.get("Nome do veiculo:", "N/A"),
            "cilindradas": dados.get("Cilindradas:", "N/A"),
            "cor": dados.get("Cor:", "N/A"),
            "tipoCombustivel": dados.get("Combustível:", "N/A"),
            "ano": dados.get("Ano:", "N/A"),

        }

    except Exception as e:
        print(f"❌ Erro ao buscar carro: {e}")
        print("🔴 Stack trace completo:")
        traceback.print_exc()
        return {
            "status": "error",
            "message": str(e)
        }
    



# ============================================================================
# 🤖 FUNÇÃO 2: Buscar peças
# ============================================================================

def buscar_pecas_peca_ai(lista_pecas):
    """
    Busca peças no peca.ai e retorna as 5 mais baratas
    
    Args:
        lista_pecas (list): Lista com nomes das peças (ex: ["pneu", "óleo"])
    
    Returns:
        dict: {
            "status": "success" ou "error",
            "pecas": [
                {
                    "nome": "...",
                    "descricao": "...",
                    "preco": 250.00,
                    "link": "https://..."
                },
                ...
            ]
        }
    """
    
    if not lista_pecas or len(lista_pecas) == 0:
        return {"status": "error", "message": "Nenhuma peça fornecida"}
    global driver

    wait = WebDriverWait(driver, 10)
    
    try:         
        time.sleep(5)  # Aguardar redirecionamento
        
        # Buscar cada peça
        pecas_coletadas = []
        
        for peca in lista_pecas:
            print(f"🔍 Buscando peça: {peca}")
            
            try:
                inputPesquisaPeca = wait.until(EC.presence_of_element_located(
                    (By.XPATH, '//*[@id="__next"]/div[2]/main/div[2]/div[1]/div[2]/div/div/form/div/div[2]/input')
                ))
                print(f"✅ Campo de busca encontrado, digitando: {peca}")
                inputPesquisaPeca.clear()
                inputPesquisaPeca.send_keys(peca)
                time.sleep(1)
                
                # Clicar no botão de pesquisa
                botaoPesquisar = wait.until(EC.element_to_be_clickable(
                    (By.XPATH, '//*[@id="vehicleFindServices"]')
                ))
                print(f"✅ Botão de pesquisa encontrado, clicando...")
                botaoPesquisar.click()
                print(f"✅ Pesquisando: {peca}")
                
                # Esperar resultados
                time.sleep(6)
                
                # Coletar as 5 mais baratas
                print(f"⏳ Coletando peças encontradas...")
                pecas_encontradas = pegar_pecas_mais_baratas(
                    driver,
                    wait,
                    peca,
                    limite=5
                )
                print(f"✅ {len(pecas_encontradas)} peças encontradas para {peca}")
                
                for peca_encontrada in pecas_encontradas:
                    pecas_coletadas.append(peca_encontrada)
                    print(f"   → {peca_encontrada['nome']}: R$ {peca_encontrada['preco']:.2f}")
            
            except Exception as e:
                print(f"❌ Erro ao buscar peça '{peca}': {e}")
                continue
        
        print(f"✅ Total de peças coletadas: {len(pecas_coletadas)}")
        
        return {
            "status": "success",
            "pecas": pecas_coletadas
        }

    except Exception as e:
        print(f"❌ Erro geral ao buscar peças: {e}")
        print("🔴 Stack trace completo:")
        traceback.print_exc()
        return {
            "status": "error",
            "message": str(e),
            "pecas": []
        }
    




# ============================================================================
# 🎯 MODO MANUAL (executar direto este arquivo)
# ============================================================================

if __name__ == '__main__':
    print("\n" + "="*60)
    print("🤖 ROBÔ DE BUSCA - PECA.AI")
    print("="*60 + "\n")
    
    # Teste 1: Buscar carro
    placa = input("Qual a sua placa? ").upper()
    
    if placa:
        print("\n🔍 Buscando dados do carro...")
        resultado_carro = buscar_carro_peca_ai(placa)
        
        if resultado_carro.get("status") == "success":
            print("\n✅ Dados do carro:")
            for chave, valor in resultado_carro.items():
                if chave != "status":
                    print(f"   {chave}: {valor}")
            
            # Teste 2: Buscar peças
            print("\n🔍 Digite as peças que deseja pesquisar")
            pecas_entrada = input("Digite as peças (separadas por vírgula): ").strip()
            
            if pecas_entrada:
                lista_pecas = [peca.strip() for peca in pecas_entrada.split(",")]
                
                print(f"\n🔍 Buscando {len(lista_pecas)} peça(s)...")
                resultado_pecas = buscar_pecas_peca_ai(lista_pecas)
                
                if resultado_pecas.get("status") == "success":
                    print("\n✅ Peças encontradas:")
                    for peca in resultado_pecas.get("pecas", []):
                        print(f"\n   📦 {peca['nome']}")
                        print(f"      Preço: R$ {peca['preco']:.2f}")
                        print(f"      Link: {peca['link']}")
        else:
            print(f"❌ Erro: {resultado_carro.get('message')}")
driver = None

def fechar_navegador():
    global driver

    if driver:
        driver.quit()
        driver = None
        return {
            "status": "success",
            "message": "Robô fechado com sucesso."
        }

    return {
        "status": "error",
        "message": "Nenhum navegador está aberto."
    }