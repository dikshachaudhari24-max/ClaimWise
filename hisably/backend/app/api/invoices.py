import uuid

from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile

from app.db import queries
from app.deps import verify_jwt
from app.schemas.all_schemas import InvoiceListResponse, InvoiceUploadResponse

router = APIRouter(prefix="/invoice", tags=["invoices"])


@router.post("/upload", response_model=InvoiceUploadResponse)
async def upload_invoice(file: UploadFile = File(...), user=Depends(verify_jwt)):
    """Upload an invoice image/PDF for OCR processing."""
    invoice_data = {
        "status": "pending",
        "file_url": f"uploads/{uuid.uuid4()}_{file.filename}",
    }
    result = queries.insert_invoice(user["uid"], invoice_data)
    if not result:
        raise HTTPException(status_code=500, detail="Failed to create invoice record")
    return InvoiceUploadResponse(
        invoice_id=result["id"],
        status="pending",
    )


@router.get("/list", response_model=InvoiceListResponse)
async def list_invoices(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    user=Depends(verify_jwt),
):
    """List all invoices for the authenticated user."""
    invoices, total = queries.get_invoices(user["uid"], page=page, per_page=per_page)
    items = []
    for inv in invoices:
        conf = inv.get("confidence_scores") or {}
        items.append({
            "id": inv["id"],
            "supplier_name": inv.get("supplier_name") or "",
            "invoice_number": inv.get("invoice_number") or "",
            "date": str(inv.get("date") or ""),
            "amount": float(inv.get("total_amount") or 0),
            "status": inv.get("status") or "pending",
            "anomaly_score": float(inv.get("anomaly_score") or 0),
            "confidence_scores": {
                "supplier_name": conf.get("supplier_name", 0),
                "gstin": conf.get("gstin", 0),
                "invoice_number": conf.get("invoice_number", 0),
                "date": conf.get("date", 0),
                "amount": conf.get("amount", 0),
                "taxable_value": conf.get("taxable_value", 0),
                "gst_amount": conf.get("gst_amount", 0),
                "hsn_code": conf.get("hsn_code", 0),
                "product_description": conf.get("product_description", 0),
            },
        })
    return InvoiceListResponse(invoices=items, total=total, page=page)
