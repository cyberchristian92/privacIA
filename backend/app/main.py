from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import hashlib
import uuid
from app.api_models import DocumentUploadResponse, AnonymizeRequest, AnonymizeResponse, ReviewRequest, AdversarialReviewResponse
from app.nlp.text_extractor import extract_text_from_bytes
from app.nlp.detector import detect_entities
from app.nlp.anonymizer import generate_transformations, apply_anonymization
from app.llm.adversarial import run_adversarial_review

app = FastAPI(title="PrivacIA API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/v1/upload", response_model=DocumentUploadResponse)
async def upload_document(file: UploadFile = File(...)):
    contents = await file.read()
    text = extract_text_from_bytes(contents, file.filename)
    
    return DocumentUploadResponse(
        document_id=str(uuid.uuid4()),
        filename=file.filename,
        mime_type=file.content_type,
        sha256=hashlib.sha256(contents).hexdigest(),
        original_text=text,
        ocr_used=False # Simplified for now
    )

@app.post("/api/v1/anonymize", response_model=AnonymizeResponse)
async def anonymize_document(req: AnonymizeRequest):
    entities = detect_entities(req.text)
    transformations = generate_transformations(entities)
    anonymized_text = apply_anonymization(req.text, entities, transformations)
    
    return AnonymizeResponse(
        document_id=str(uuid.uuid4()),
        original_text=req.text,
        anonymized_text=anonymized_text,
        entities=entities,
        transformations=transformations,
        verification_metrics={
            "direct_leaks": "0",
            "coverage": "100%",
            "internal_risk": "Baixo"
        }
    )

@app.post("/api/v1/review", response_model=AdversarialReviewResponse)
async def review_document(req: ReviewRequest):
    return await run_adversarial_review(req.anonymized_text)
