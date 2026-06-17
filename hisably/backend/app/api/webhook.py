from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse

router = APIRouter(prefix="/webhook", tags=["webhook"])


@router.post("/whatsapp")
async def whatsapp_webhook(request: Request):
    """Receive incoming WhatsApp messages via Twilio webhook."""
    body = await request.form()
    from_number = body.get("From", "")
    message_body = body.get("Body", "")

    # TODO: Route incoming WhatsApp messages to chatbot when Twilio is configured
    print(f"WhatsApp message from {from_number}: {message_body}")

    return JSONResponse(status_code=200, content={"status": "ok"})
