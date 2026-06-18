import random
import time

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.config import settings

router = APIRouter(prefix="/auth", tags=["auth"])

_otp_store: dict[str, dict] = {}

OTP_EXPIRY_SECONDS = 300


class SendOtpRequest(BaseModel):
    phone: str


class VerifyOtpRequest(BaseModel):
    phone: str
    otp: str


class AuthResponse(BaseModel):
    success: bool
    token: str | None = None
    user_id: str | None = None
    message: str = ""


@router.post("/send-otp", response_model=AuthResponse)
async def send_otp(req: SendOtpRequest):
    phone = req.phone.strip().replace(" ", "")
    if not phone.startswith("+"):
        phone = f"+91{phone}"

    otp = f"{random.randint(100000, 999999)}"
    _otp_store[phone] = {"otp": otp, "ts": time.time()}

    if settings.APP_ENV == "development":
        return AuthResponse(success=True, message=f"Dev OTP: {otp}")

    try:
        from twilio.rest import Client
        client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        client.messages.create(
            body=f"Your Hisably verification code is: {otp}",
            from_=settings.TWILIO_WHATSAPP_FROM,
            to=f"whatsapp:{phone}",
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send OTP: {e}")

    return AuthResponse(success=True, message="OTP sent to WhatsApp")


@router.post("/verify-otp", response_model=AuthResponse)
async def verify_otp(req: VerifyOtpRequest):
    phone = req.phone.strip().replace(" ", "")
    if not phone.startswith("+"):
        phone = f"+91{phone}"

    stored = _otp_store.get(phone)
    if not stored:
        raise HTTPException(status_code=400, detail="No OTP sent for this number. Request OTP first.")

    if time.time() - stored["ts"] > OTP_EXPIRY_SECONDS:
        _otp_store.pop(phone, None)
        raise HTTPException(status_code=400, detail="OTP expired. Request a new one.")

    if stored["otp"] != req.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    _otp_store.pop(phone, None)

    import hashlib
    user_id = hashlib.sha256(phone.encode()).hexdigest()[:36]
    token = f"dev-{user_id}" if settings.APP_ENV == "development" else _generate_jwt(phone, user_id)

    if settings.APP_ENV == "development":
        from app.deps import DEV_TOKENS
        DEV_TOKENS[token] = {"uid": user_id, "email": "", "role": "authenticated"}

    return AuthResponse(success=True, token=token, user_id=user_id, message="Verified")


def _generate_jwt(phone: str, user_id: str) -> str:
    import jwt as pyjwt
    payload = {
        "sub": user_id,
        "phone": phone,
        "role": "authenticated",
        "aud": "authenticated",
        "iat": int(time.time()),
        "exp": int(time.time()) + 86400 * 7,
    }
    return pyjwt.encode(payload, settings.SUPABASE_JWT_SECRET, algorithm="HS256")
