from fastapi import APIRouter, Depends, File, HTTPException, UploadFile

from app.deps import verify_jwt
from app.schemas.all_schemas import ChatbotTextRequest, ChatbotTextResponse, ChatbotVoiceResponse

router = APIRouter(prefix="/chatbot", tags=["chatbot"])


@router.post("/query", response_model=ChatbotTextResponse)
async def text_query(request: ChatbotTextRequest, _user=Depends(verify_jwt)):
    """Process a text query through the RAG chatbot."""
    raise HTTPException(status_code=501, detail="Not implemented yet")


@router.post("/voice", response_model=ChatbotVoiceResponse)
async def voice_query(file: UploadFile = File(...), _user=Depends(verify_jwt)):
    """Process a voice query through STT, RAG, and TTS."""
    raise HTTPException(status_code=501, detail="Not implemented yet")
