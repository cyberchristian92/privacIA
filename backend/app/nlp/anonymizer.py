from typing import List, Tuple
from app.api_models import Entity, Transformation

def generate_transformations(entities: List[Entity]) -> List[Transformation]:
    transformations = []
    counters = {"PESSOA": 1, "ORGANIZACAO": 1, "LOCALIDADE": 1, "CPF": 1, "CNPJ": 1, "TELEFONE": 1, "EMAIL": 1}
    
    for ent in entities:
        if ent.type == "PESSOA":
            operator = "Substituição fictícia"
            repl = f"Indivíduo_{counters['PESSOA']}"
            counters["PESSOA"] += 1
        elif ent.type in ["CPF", "CNPJ"]:
            operator = "Mascaramento"
            if ent.type == "CPF":
                repl = f"***.***.***-{ent.surface_text[-2:]}"
            else:
                repl = f"**.***.***/****-{ent.surface_text[-2:]}"
        elif ent.type == "EMAIL":
            operator = "Mascaramento"
            parts = ent.surface_text.split("@")
            repl = f"***@{parts[1]}"
        else:
            operator = "Tokenização"
            repl = f"[{ent.type}_{counters.get(ent.type, 1):03d}]"
            if ent.type in counters:
                counters[ent.type] += 1
                
        transformations.append(Transformation(
            entity_id=ent.id,
            operator=operator,
            replacement_value=repl,
            reversible=True
        ))
    
    return transformations

def apply_anonymization(text: str, entities: List[Entity], transformations: List[Transformation]) -> str:
    # Sort backwards to replace without shifting indices for remaining entities
    sorted_pairs = sorted(zip(entities, transformations), key=lambda x: x[0].span_start, reverse=True)
    
    anon_text = text
    for ent, trans in sorted_pairs:
        anon_text = anon_text[:ent.span_start] + trans.replacement_value + anon_text[ent.span_end:]
        
    return anon_text
