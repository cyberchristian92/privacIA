import re
import uuid
from typing import List
from app.api_models import Entity

# Load model globally (will be loaded at startup)
_nlp = None

REGEX_PATTERNS = {
    "CPF": r"\b\d{3}\.\d{3}\.\d{3}-\d{2}\b",
    "CNPJ": r"\b\d{2}\.\d{3}\.\d{3}/\d{4}-\d{2}\b",
    "TELEFONE": r"\(?\d{2}\)?\s?\d{4,5}[-\s]?\d{4}\b",
    "EMAIL": r"\b[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}\b",
    "CEP": r"\b\d{5}-\d{3}\b",
}

def _load_model():
    """Loads the spaCy model on first call."""
    global _nlp
    if _nlp is not None:
        return _nlp
    try:
        import spacy as _spacy
        _nlp = _spacy.load("pt_core_news_sm")
    except OSError:
        import spacy as _spacy
        _spacy.cli.download("pt_core_news_sm")
        _nlp = _spacy.load("pt_core_news_sm")
    return _nlp

def detect_entities(text: str) -> List[Entity]:
    nlp = _load_model()
    
    # Run NER on a normalized (single-line) version to improve name detection
    normalized = " ".join(text.split())
    doc_normalized = nlp(normalized)
    doc_original = nlp(text)
    
    entities: List[Entity] = []

    # 1. NER via spaCy — from normalized text, map back to original positions
    for ent in doc_normalized.ents:
        label_map = {"PER": "PESSOA", "ORG": "ORGANIZACAO", "LOC": "LOCALIDADE", "GPE": "LOCALIDADE"}
        if ent.label_ in label_map and len(ent.text.strip()) > 2:
            ent_type = label_map[ent.label_]
            # Find original position
            orig_start = text.find(ent.text)
            if orig_start == -1:
                continue
            orig_end = orig_start + len(ent.text)
            entities.append(Entity(
                id=str(uuid.uuid4())[:8],
                type=ent_type,
                span_start=orig_start,
                span_end=orig_end,
                surface_text=ent.text,
                detector_source="ner",
                confidence=0.85,
                sensitivity_level="alta" if ent_type == "PESSOA" else "média"
            ))

    # 2. Regex for structured patterns
    for label, pattern in REGEX_PATTERNS.items():
        for match in re.finditer(pattern, text, re.IGNORECASE):
            # Skip if overlapping with existing entity
            overlap = any(
                match.start() < e.span_end and match.end() > e.span_start
                for e in entities
            )
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

    # Sort by position in text
    entities.sort(key=lambda x: x.span_start)
    return entities
