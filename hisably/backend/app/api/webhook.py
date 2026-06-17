from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse

router = APIRouter(prefix="/webhook", tags=["webhook"])


@router.post("/whatsapp")
async def whatsapp_webhook(request: Request):
    """Receive incoming WhatsApp messages via Twilio webhook."""
    return JSONResponse(status_code=200, content={"status": "ok"})
