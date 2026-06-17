from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse

from app.config import settings
from app.db import queries

router = APIRouter(prefix="/webhook", tags=["webhook"])


def _send_whatsapp(to: str, message: str) -> bool:
    """Send a WhatsApp message via Twilio."""
    try:
        from twilio.rest import Client

        client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        client.messages.create(
            body=message,
            from_=settings.TWILIO_WHATSAPP_FROM,
            to=f"whatsapp:{to}" if not to.startswith("whatsapp:") else to,
        )
        return True
    except Exception as e:
        print(f"Twilio send error: {e}")
        return False


@router.post("/whatsapp")
async def whatsapp_webhook(request: Request):
    """Receive incoming WhatsApp messages via Twilio webhook and respond via chatbot."""
    body = await request.form()
    from_number = body.get("From", "")
    message_body = body.get("Body", "").strip()

    if not message_body:
        return JSONResponse(status_code=200, content={"status": "empty"})

    user = queries.get_user_by_phone(from_number.replace("whatsapp:", ""))

    if not user:
        _send_whatsapp(from_number, "Aapka number registered nahi hai. Pehle Hisably app pe sign up karein.")
        return JSONResponse(status_code=200, content={"status": "unregistered"})

    user_id = user["id"]
    queries.insert_chat_message(user_id, "user", message_body)

    try:
        from ai.rag.retriever import retrieve_and_respond

        result = retrieve_and_respond(user_id, message_body, "invoices")
        response_text = result["response"]
    except Exception as e:
        response_text = f"Sorry, kuch error aa gaya: {e}"

    queries.insert_chat_message(user_id, "assistant", response_text, namespaces=["invoices"], grounded=True)

    _send_whatsapp(from_number, response_text)

    return JSONResponse(status_code=200, content={"status": "replied"})


@router.post("/whatsapp/send")
async def send_whatsapp_message(request: Request):
    """Manually send a WhatsApp message (e.g., supplier correction message)."""
    body = await request.json()
    to_number = body.get("to", "")
    message = body.get("message", "")

    if not to_number or not message:
        return JSONResponse(status_code=400, content={"error": "Missing 'to' or 'message'"})

    sent = _send_whatsapp(to_number, message)
    return JSONResponse(status_code=200, content={"sent": sent})
