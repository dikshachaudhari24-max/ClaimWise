from fastapi import APIRouter, Depends, File, HTTPException, UploadFile

from app.deps import verify_jwt
from app.schemas.all_schemas import InvoiceListResponse, InvoiceUploadResponse

router = APIRouter(prefix="/invoice", tags=["invoices"])


@router.post("/upload", response_model=InvoiceUploadResponse)
async def upload_invoice(file: UploadFile = File(...), _user=Depends(verify_jwt)):
    """Upload an invoice image/PDF for OCR processing."""
    raise HTTPException(status_code=501, detail="Not implemented yet")


@router.get("/list", response_model=InvoiceListResponse)
async def list_invoices(_user=Depends(verify_jwt)):
    """List all invoices for the authenticated user."""
    raise HTTPException(status_code=501, detail="Not implemented yet")
