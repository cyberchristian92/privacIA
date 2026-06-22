import httpx
import io
import json
import sys

text = """PROCESSO No 0001234-56.2024.8.26.0100

Reclamante: Joao Silva Santos
CPF: 123.456.789-09
E-mail: joao.santos@gmail.com
Telefone: (11) 98765-4321

Reclamada: Tech Solutions LTDA
CNPJ: 12.345.678/0001-90
"""

with httpx.Client(timeout=30) as c:
    # 1. Upload
    r = c.post(
        "http://127.0.0.1:8000/api/v1/upload",
        files={"file": ("contrato.txt", io.BytesIO(text.encode("utf-8")), "text/plain")}
    )
    assert r.status_code == 200, f"Upload failed: {r.text}"
    doc = r.json()
    print("=== 1. UPLOAD OK ===")
    print(f"Arquivo: {doc['filename']} | SHA256: {doc['sha256'][:12]}...")

    # 2. Anonymize
    r2 = c.post("http://127.0.0.1:8000/api/v1/anonymize", json={"text": doc["original_text"]})
    assert r2.status_code == 200, f"Anonymize failed: {r2.text}"
    anon = r2.json()
    
    print("\n=== 2. ENTIDADES DETECTADAS ===")
    for e in anon["entities"]:
        print(f"  [{e['detector_source'].upper():6}] {e['type']:15} -> \"{e['surface_text']}\"")

    print("\n=== 3. TEXTO ANONIMIZADO ===")
    print(anon["anonymized_text"])

    # 3. Review
    r3 = c.post(
        "http://127.0.0.1:8000/api/v1/review",
        json={"document_id": anon["document_id"], "anonymized_text": anon["anonymized_text"]}
    )
    assert r3.status_code == 200, f"Review failed: {r3.text}"
    rev = r3.json()
    
    print("\n=== 4. REVISAO ADVERSARIAL ===")
    print(f"Aprovado: {rev['approved']} | Risco: {rev['risk_level']}")
    print(f"Resumo: {rev['summary'][:150]}")
    
    print("\n=== PIPELINE 100% FUNCIONAL ===")
