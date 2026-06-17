from fastapi import APIRouter, Depends, File, HTTPException, UploadFile

from app.db import queries
from app.deps import verify_jwt
from app.schemas.all_schemas import ChatbotTextRequest, ChatbotTextResponse, ChatbotVoiceResponse

router = APIRouter(prefix="/chatbot", tags=["chatbot"])

DEMO_USER_ID = "00000000-0000-0000-0000-000000000001"


@router.post("/query", response_model=ChatbotTextResponse)
async def text_query(request: ChatbotTextRequest, _user=Depends(verify_jwt)):
    """Process a text query through the RAG chatbot."""
    queries.insert_chat_message(DEMO_USER_ID, "user", request.query)

    response_text = (
        f"I received your question: '{request.query}'. "
        "The RAG pipeline is not yet connected to an LLM provider. "
        "Once Groq API keys are configured, I'll provide grounded answers "
        "based on your invoice and compliance data."
    )

    queries.insert_chat_message(
        DEMO_USER_ID, "assistant", response_text,
        namespaces=["invoices", "mismatches"], grounded=False,
    )

    return ChatbotTextResponse(
        response_text=response_text,
        retrieved_namespaces=["invoices", "mismatches"],
        grounded=False,
    )


@router.post("/voice", response_model=ChatbotVoiceResponse)
async def voice_query(file: UploadFile = File(...), _user=Depends(verify_jwt)):
    """Process a voice query through STT, RAG, and TTS."""
    raise HTTPException(
        status_code=501,
        detail="Voice pipeline not yet connected — requires Groq STT and gTTS API keys",
    )
