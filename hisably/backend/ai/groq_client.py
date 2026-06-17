"""Groq LLM client for invoice extraction and multilingual explanations."""


def generate_invoice_extraction(raw_ocr_text: str) -> dict:
    """Extract structured invoice fields from raw OCR text using Groq LLM."""
    pass


def generate_hindi_explanation(issue_data: dict) -> dict:
    """Generate a Hindi explanation of a GST issue using Groq LLM."""
    pass


def generate_supplier_recommendation(issue_data: dict) -> str:
    """Generate a supplier correction recommendation message using Groq LLM."""
    pass


def generate_rag_response(query: str, retrieved_chunks: list, chat_history: list, user_lang: str) -> str:
    """Generate a RAG-grounded response using Groq LLM."""
    pass
