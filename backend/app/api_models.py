from pydantic import BaseModel
from typing import List, Optional, Literal, Dict

class DocumentUploadResponse(BaseModel):
    document_id: str
    filename: str
    mime_type: str
    sha256: str
    original_text: str
    ocr_used: bool

class Entity(BaseModel):
    id: str
    type: str
    span_start: int
    span_end: int
    surface_text: str
    detector_source: Literal["ner", "regex", "hybrid", "context"]
    confidence: float
    sensitivity_level: Literal["alta", "média", "baixa"]
    context_label: Optional[str] = None

class Transformation(BaseModel):
    entity_id: str
    operator: Literal["Tokenização", "Mascaramento", "Supressão", "Generalização", "Substituição fictícia"]
    replacement_value: str
    reversible: bool

class AnonymizeRequest(BaseModel):
    text: str

class AnonymizeResponse(BaseModel):
    document_id: str
    original_text: str
    anonymized_text: str
    entities: List[Entity]
    transformations: List[Transformation]
    verification_metrics: Dict[str, str]

class ReviewRequest(BaseModel):
    document_id: str
    anonymized_text: str

class AdversarialReviewResponse(BaseModel):
    approved: bool
    risk_level: str
    critical_issues: List[str]
    improvements: List[str]
    summary: str
    log: List[str]
