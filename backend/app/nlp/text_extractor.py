import fitz  # PyMuPDF
import docx
import io

def extract_text_from_bytes(file_bytes: bytes, filename: str) -> str:
    ext = filename.split('.')[-1].lower()
    text = ""
    if ext == "pdf":
        doc = fitz.open(stream=file_bytes, filetype="pdf")
        for page in doc:
            text += page.get_text()
    elif ext == "docx":
        doc = docx.Document(io.BytesIO(file_bytes))
        for para in doc.paragraphs:
            text += para.text + "\n"
    elif ext == "txt":
        text = file_bytes.decode('utf-8', errors='ignore')
    return text
