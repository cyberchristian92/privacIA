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
REVIEW_URL = "http://127.0.0.1:8000/api/v1/review"
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
    with httpx.Client(timeout=60) as client:
        for idx, doc in enumerate(docs):
            start_time = time.time()
            
            try:
                # 1. Rota de Anonimização
                response = client.post(API_URL, json={"text": doc["text"]})
                response.raise_for_status()
                data = response.json()
                
                # 2. Rota de Ataque Adversarial / Revisão
                review_response = client.post(REVIEW_URL, json={
                    "document_id": data["document_id"],
                    "anonymized_text": data["anonymized_text"]
                })
                review_response.raise_for_status()
                review_data = review_response.json()
                
                latency = (time.time() - start_time) * 1000 # ms total
                
                detected = data.get("entities", [])
                gt = ground_truth[idx]["entities"]
                
                metrics = {
                    "id": doc["id"],
                    "latency_ms": latency,
                    "PESSOA_found": any(gt["PESSOA"] in e["surface_text"] or e["surface_text"] in gt["PESSOA"] for e in detected if e["type"] == "PESSOA"),
                    "CPF_found": any(gt["CPF"] in e["surface_text"] for e in detected if e["type"] == "CPF"),
                    "EMAIL_found": any(gt["EMAIL"] in e["surface_text"] for e in detected if e["type"] == "EMAIL"),
                    "TELEFONE_found": any(gt["TELEFONE"][-4:] in e["surface_text"] for e in detected if e["type"] == "TELEFONE"),
                    "CNPJ_found": any(gt["CNPJ"] in e["surface_text"] for e in detected if e["type"] == "CNPJ"),
                    "risk_level": review_data.get("risk_level", "Desconhecido"),
                    "approved": review_data.get("approved", False)
                }
                results.append(metrics)
                
            except Exception as e:
                print(f"Erro no doc {idx}: {e}")
                
    return pd.DataFrame(results)

def generate_report_and_chart(df):
    if df.empty:
        print("Nenhum resultado para gerar.")
        return
        
    accuracy = {
        "PESSOA": df["PESSOA_found"].mean() * 100,
        "CPF": df["CPF_found"].mean() * 100,
        "EMAIL": df["EMAIL_found"].mean() * 100,
        "TELEFONE": df["TELEFONE_found"].mean() * 100,
        "CNPJ": df["CNPJ_found"].mean() * 100,
    }
    
    avg_latency = df["latency_ms"].mean()
    p95_latency = df["latency_ms"].quantile(0.95)
    
    # Avaliação Adversarial
    risk_counts = df['risk_level'].value_counts()
    
    fig, (ax1, ax2, ax3) = plt.subplots(1, 3, figsize=(18, 6))
    
    # Gráfico 1: Acurácia
    bars = ax1.bar(accuracy.keys(), accuracy.values(), color=['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'])
    ax1.set_ylim(0, 110)
    ax1.set_ylabel('Taxa de Deteção (%)')
    ax1.set_title('Efetividade de Extração (PII)')
    for bar in bars:
        height = bar.get_height()
        ax1.annotate(f'{height:.1f}%', xy=(bar.get_x() + bar.get_width() / 2, height),
                     xytext=(0, 3), textcoords="offset points", ha='center', va='bottom')
                     
    # Gráfico 2: Latência
    ax2.hist(df["latency_ms"], bins=10, color='#64748b', edgecolor='white')
    ax2.set_xlabel('Tempo (ms)')
    ax2.set_ylabel('Frequência')
    ax2.set_title(f'Latência API Completa\n(Média: {avg_latency:.1f}ms)')
    
    # Gráfico 3: Risco Adversarial
    colors_risk = {'Baixo': '#10b981', 'Médio': '#f59e0b', 'Alto': '#ef4444', 'Desconhecido': '#9ca3af'}
    ax3.pie(risk_counts.values, labels=risk_counts.index, autopct='%1.1f%%', 
            colors=[colors_risk.get(k, '#9ca3af') for k in risk_counts.index], startangle=90)
    ax3.set_title('Reidentificação por Ataque Adversarial')
    
    plt.tight_layout()
    chart_path = r"C:\Users\chris\.gemini\antigravity-ide\brain\d155fbe8-e323-4dab-9e96-7b70278e50ae\benchmark_chart.png"
    plt.savefig(chart_path)
    print(f"\nGráfico salvo em: {chart_path}")
    
    report_data = {
        "total_docs": len(df),
        "accuracy": accuracy,
        "latency": {"avg_ms": avg_latency, "p95_ms": p95_latency},
        "adversarial_risk": risk_counts.to_dict(),
        "approval_rate": df["approved"].mean() * 100
    }
    
    with open("benchmark_results.json", "w") as f:
        json.dump(report_data, f)

    
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
