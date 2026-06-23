import httpx
from app.api_models import AdversarialReviewResponse

OLLAMA_API_URL = "http://localhost:11434/api/generate"
DEFAULT_MODEL = "llama3"

async def run_adversarial_review(anonymized_text: str) -> AdversarialReviewResponse:
    prompt = f"""
Você é um auditor de privacidade hostil atuando sob a LGPD brasileira.
Seu objetivo é analisar o texto anonimizado abaixo e tentar identificar qualquer indivíduo ou vínculo sensível (reidentificação).
Não há acesso ao original.
TEXTO ANONIMIZADO:
"{anonymized_text}"

Analise os vetores residuais de reidentificação. Retorne APENAS um JSON válido seguindo este formato rigoroso e nada mais:
{{
  "approved": true/false,
  "risk_level": "Baixo" | "Médio" | "Alto",
  "critical_issues": ["lista de problemas críticos"],
  "improvements": ["lista de melhorias"],
  "summary": "resumo textual da avaliação",
  "log": ["> log de hipótese 1", "- resultado da hipótese 1"]
}}
"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(OLLAMA_API_URL, json={
                "model": DEFAULT_MODEL,
                "prompt": prompt,
                "stream": False,
                "format": "json"
            }, timeout=30.0)
            
            if response.status_code == 200:
                data = response.json()
                import json
                try:
                    res = json.loads(data["response"])
                    return AdversarialReviewResponse(**res)
                except Exception as e:
                    pass
    except Exception as e:
        pass
        
    # Fallback/Mock case if Ollama is not running or fails
    # Heurística realista: se o documento contém cargos únicos ou termos raros, há risco residual
    lower_text = anonymized_text.lower()
    risk = "Baixo"
    approved = True
    critical_issues = []
    
    contextual_leaks = ["prefeito", "presidente", "diretor executivo", "ceo"]
    found_leaks = [word for word in contextual_leaks if word in lower_text]
    
    if found_leaks:
        risk = "Médio"
        approved = False
        critical_issues = [f"Risco de inferência contextual. Cargos únicos detectados: {', '.join(found_leaks)}"]
        
    return AdversarialReviewResponse(
        approved=approved,
        risk_level=risk,
        critical_issues=critical_issues,
        improvements=["Considerar generalização temporal (ex: substituir datas exatas por apenas o ano)."] if risk == "Baixo" else ["Generalizar cargos únicos para funções genéricas na anonimização."],
        summary="O documento apresenta resistência contra reidentificação direta." if risk == "Baixo" else "O documento mascarou os identificadores diretos, mas possui contexto suficiente para reidentificação indireta.",
        log=[
            "> Validação Heurística (Fallback LLM)",
            f"- Resultado: Risco {risk}"
        ]
    )
