import time
import json
import random
import uuid
import httpx
import pandas as pd
import matplotlib.pyplot as plt
from faker import Faker
import os

# Configura Faker com locale do Brasil
fake = Faker('pt_BR')
Faker.seed(42)
random.seed(42)

API_URL = "http://127.0.0.1:8000/api/v1/anonymize"
NUM_DOCS = 30 # Teste com 30 documentos complexos

# Templates de documentos jurídicos/RH
TEMPLATES = [
    "CONTRATO DE TRABALHO\n\nEmpregado: {name}\nCPF: {cpf}\nEndereço: {address}\nEmail de contato: {email}\nTelefone: {phone}\n\nA empresa contratante, inscrita no CNPJ {cnpj}, concorda...",
    "TERMO DE RESCISÃO\n\nNome: {name}\nPortador do CPF nº {cpf}, residente em {address}.\nContatos: {email} / {phone}\nEmpregador: Empresa XYZ CNPJ {cnpj}.",
    "Processo N. 12345/24\n\nRequerente: {name}, CPF {cpf}.\nDados informados:\n- E-mail principal: {email}\n- Celular: {phone}\nRéu: Nova Soluções LTDA ({cnpj})."
]

def generate_synthetic_data(num_docs: int):
    docs = []
    ground_truth = []
    
    for i in range(num_docs):
        name = fake.name()
        cpf = fake.cpf()
        email = fake.email()
        phone = fake.phone_number()
        cnpj = fake.cnpj()
        address = fake.address().replace('\n', ', ')
        
        template = random.choice(TEMPLATES)
        text = template.format(
            name=name,
            cpf=cpf,
            email=email,
            phone=phone,
            cnpj=cnpj,
            address=address
        )
        
        doc_id = str(uuid.uuid4())
        docs.append({"id": doc_id, "text": text})
        
        # O Ground Truth contém as entidades exatas que esperamos encontrar
        ground_truth.append({
            "id": doc_id,
            "entities": {
                "PESSOA": name,
                "CPF": cpf,
                "EMAIL": email,
                "TELEFONE": phone,
                "CNPJ": cnpj
            }
        })
        
    return docs, ground_truth

def run_benchmark(docs, ground_truth):
    results = []
    
    print(f"Iniciando benchmark com {len(docs)} documentos...")
    with httpx.Client(timeout=30) as client:
        for idx, doc in enumerate(docs):
            start_time = time.time()
            
            try:
                response = client.post(API_URL, json={"text": doc["text"]})
                response.raise_for_status()
                data = response.json()
                latency = (time.time() - start_time) * 1000 # ms
                
                # Coleta entidades detectadas
                detected = data.get("entities", [])
                
                # Compara com ground truth
                gt = ground_truth[idx]["entities"]
                
                metrics = {
                    "id": doc["id"],
                    "latency_ms": latency,
                    "PESSOA_found": any(gt["PESSOA"] in e["surface_text"] or e["surface_text"] in gt["PESSOA"] for e in detected if e["type"] == "PESSOA"),
                    "CPF_found": any(gt["CPF"] in e["surface_text"] for e in detected if e["type"] == "CPF"),
                    "EMAIL_found": any(gt["EMAIL"] in e["surface_text"] for e in detected if e["type"] == "EMAIL"),
                    "TELEFONE_found": any(gt["TELEFONE"][-4:] in e["surface_text"] for e in detected if e["type"] == "TELEFONE"), # checa final do tel por variacoes de formatacao
                    "CNPJ_found": any(gt["CNPJ"] in e["surface_text"] for e in detected if e["type"] == "CNPJ"),
                }
                results.append(metrics)
                
            except Exception as e:
                print(f"Erro no doc {idx}: {e}")
                
    return pd.DataFrame(results)

def generate_report_and_chart(df):
    if df.empty:
        print("Nenhum resultado para gerar.")
        return
        
    # Calcula taxas de sucesso
    accuracy = {
        "PESSOA": df["PESSOA_found"].mean() * 100,
        "CPF": df["CPF_found"].mean() * 100,
        "EMAIL": df["EMAIL_found"].mean() * 100,
        "TELEFONE": df["TELEFONE_found"].mean() * 100,
        "CNPJ": df["CNPJ_found"].mean() * 100,
    }
    
    avg_latency = df["latency_ms"].mean()
    p95_latency = df["latency_ms"].quantile(0.95)
    
    # 1. Gera e salva o gráfico
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
    
    # Gráfico 1: Acurácia
    bars = ax1.bar(accuracy.keys(), accuracy.values(), color=['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'])
    ax1.set_ylim(0, 110)
    ax1.set_ylabel('Taxa de Deteção (%)')
    ax1.set_title('Efetividade da Extração por Tipo de Entidade')
    for bar in bars:
        height = bar.get_height()
        ax1.annotate(f'{height:.1f}%',
                     xy=(bar.get_x() + bar.get_width() / 2, height),
                     xytext=(0, 3),  # 3 points vertical offset
                     textcoords="offset points",
                     ha='center', va='bottom')
                     
    # Gráfico 2: Latência
    ax2.hist(df["latency_ms"], bins=10, color='#64748b', edgecolor='white')
    ax2.set_xlabel('Tempo (ms)')
    ax2.set_ylabel('Frequência (Documentos)')
    ax2.set_title(f'Distribuição de Latência da API\n(Média: {avg_latency:.1f}ms | P95: {p95_latency:.1f}ms)')
    
    plt.tight_layout()
    chart_path = r"C:\Users\chris\.gemini\antigravity-ide\brain\d155fbe8-e323-4dab-9e96-7b70278e50ae\benchmark_chart.png"
    plt.savefig(chart_path)
    print(f"\nGráfico salvo em: {chart_path}")
    
    # 2. Exibe relatório textual JSON
    report_data = {
        "total_docs": len(df),
        "accuracy": accuracy,
        "latency": {
            "avg_ms": avg_latency,
            "min_ms": df["latency_ms"].min(),
            "max_ms": df["latency_ms"].max(),
            "p95_ms": p95_latency
        }
    }
    
    print("\n=== RESUMO DO BENCHMARK ===")
    print(json.dumps(report_data, indent=2))
    
    with open("benchmark_results.json", "w") as f:
        json.dump(report_data, f)

if __name__ == "__main__":
    print("Gerando dados sintéticos...")
    docs, gt = generate_synthetic_data(NUM_DOCS)
    
    df_results = run_benchmark(docs, gt)
    
    print("Gerando relatórios...")
    generate_report_and_chart(df_results)
