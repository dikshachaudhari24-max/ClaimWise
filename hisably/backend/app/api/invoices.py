import uuid

from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile

from app.db import queries
from app.deps import verify_jwt
from app.engines.gstin_validator import validate_gstin
from app.engines.hsn_validator import validate_hsn
from app.schemas.all_schemas import InvoiceListResponse, InvoiceUploadResponse

router = APIRouter(prefix="/invoice", tags=["invoices"])


def _process_invoice(invoice_id: str, invoice: dict, user_id: str):
    """Run GSTIN/HSN validation, anomaly scoring, and embedding inline."""
    update_data = {"status": "processing"}

    gstin = invoice.get("supplier_gstin")
    if gstin:
        gstin_result = validate_gstin(gstin)
        if not gstin_result["valid"]:
            update_data["status"] = "error_gstin"
            if gstin_result.get("corrected_gstin"):
                update_data["supplier_gstin"] = gstin_result["corrected_gstin"]

    hsn = invoice.get("hsn_code")
    if hsn:
        hsn_result = validate_hsn(hsn)
        if not hsn_result["valid"]:
            update_data["status"] = "error_hsn"
            if hsn_result.get("suggested_code"):
                update_data["hsn_code"] = hsn_result["suggested_code"]

    try:
        from ai.anomaly.isolation_forest import InvoiceAnomalyScorer
        scorer = InvoiceAnomalyScorer()
        score = scorer.score(invoice)
        update_data["anomaly_score"] = round(score, 4)
        if scorer.is_anomalous(score):
            update_data["status"] = "anomalous"
    except Exception:
        pass

    if update_data.get("status") == "processing":
        update_data["status"] = "validated"

    queries.update_invoice(invoice_id, update_data)

    if invoice.get("supplier_gstin") and invoice.get("supplier_name"):
        queries.get_or_create_supplier(user_id, invoice["supplier_name"], invoice["supplier_gstin"])

    _embed_record(invoice_id, invoice, user_id, "invoice")


def _embed_record(record_id: str, record: dict, user_id: str, record_type: str):
    """Generate embedding and upsert into Pinecone."""
    try:
        from ai.rag.embedder import embed_text
        from ai.rag.pinecone_client import get_namespace, upsert_vector

        if record_type == "invoice":
            text = (
                f"Invoice {record.get('invoice_number')} from {record.get('supplier_name')} "
                f"dated {record.get('date')} for ₹{record.get('total_amount')} "
                f"HSN: {record.get('hsn_code')} - {record.get('product_description')}"
            )
        else:
            text = (
                f"Mismatch: {record.get('mismatch_type')} for {record.get('supplier_name')} "
                f"amount difference ₹{record.get('amount_difference')} "
                f"root cause: {record.get('root_cause_category')}"
            )

        vector = embed_text(text)
        namespace = get_namespace(user_id, record_type)
        upsert_vector(namespace, record_id, vector, {"text": text, "record_type": record_type})
    except Exception:
        pass


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

    _process_invoice(result["id"], result, user["uid"])

    updated = queries.get_invoice_by_id(result["id"])
    return InvoiceUploadResponse(
        invoice_id=result["id"],
        status=updated.get("status", "pending") if updated else "pending",
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
