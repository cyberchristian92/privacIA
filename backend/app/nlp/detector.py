import re
import spacy
from typing import List
from app.api_models import Entity
import uuid

# Load model globally (will be loaded at startup)
nlp = None

def load_model():
    global nlp
    if nlp is None:
        try:
            nlp = spacy.load("pt_core_news_sm")
        except OSError:
            import spacy.cli
            spacy.cli.download("pt_core_news_sm")
            nlp = spacy.load("pt_core_news_sm")

REGEX_PATTERNS = {
    "CPF": r"\b\d{3}\.\d{3}\.\d{3}-\d{2}\b",
    "CNPJ": r"\b\d{2}\.\d{3}\.\d{3}/\d{4}-\d{2}\b",
    "TELEFONE": r"\b(?:\+?55\s?)?(?:\(?\d{2}\)?\s?)?\d{4,5}[-\s]?\d{4}\b",
    "EMAIL": r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b"
}

def detect_entities(text: str) -> List[Entity]:
    load_model()
    doc = nlp(text)
    entities = []
    
    # 1. NER
    for ent in doc.ents:
        if ent.label_ in ["PER", "ORG", "LOC"]:
            ent_type = "PESSOA" if ent.label_ == "PER" else "ORGANIZACAO" if ent.label_ == "ORG" else "LOCALIDADE"
            entities.append(Entity(
                id=str(uuid.uuid4())[:8],
                type=ent_type,
                span_start=ent.start_char,
                span_end=ent.end_char,
                surface_text=ent.text,
                detector_source="ner",
                confidence=0.85,
                sensitivity_level="alta" if ent_type == "PESSOA" else "média"
            ))

    # 2. Regex
    for label, pattern in REGEX_PATTERNS.items():
        for match in re.finditer(pattern, text):
            # Check overlap to avoid duplicates
            overlap = False
            for e in entities:
                if (match.start() >= e.span_start and match.start() < e.span_end) or \
                   (match.end() > e.span_start and match.end() <= e.span_end):
                    overlap = True
                    break
            
            if not overlap:
                entities.append(Entity(
                    id=str(uuid.uuid4())[:8],
                    type=label,
                    span_start=match.start(),
                    span_end=match.end(),
                    surface_text=match.group(),
                    detector_source="regex",
                    confidence=0.99,
                    sensitivity_level="alta"
                ))

    # Sort by start position
    entities.sort(key=lambda x: x.span_start)
    return entities
