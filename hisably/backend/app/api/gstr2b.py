import csv
import io
import uuid

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile

from app.db import queries
from app.deps import verify_jwt
from app.engines.gstr2b_reconciler import reconcile
from app.engines.root_cause_classifier import classify_root_cause
from app.schemas.all_schemas import GSTR2BUploadResponse, MismatchListResponse

router = APIRouter(prefix="/gstr2b", tags=["gstr2b"])

DEMO_USER_ID = "00000000-0000-0000-0000-000000000001"


@router.post("/upload", response_model=GSTR2BUploadResponse)
async def upload_gstr2b(file: UploadFile = File(...), _user=Depends(verify_jwt)):
    """Upload a GSTR-2B file for reconciliation."""
    content = await file.read()
    text = content.decode("utf-8")
    reader = csv.DictReader(io.StringIO(text))
    records = list(reader)

    upload_id = str(uuid.uuid4())
    queries.insert_gstr2b_batch(DEMO_USER_ID, records, upload_id)

    invoices, _ = queries.get_invoices(DEMO_USER_ID, page=1, per_page=1000)
    gstr2b_records = queries.get_gstr2b_records(DEMO_USER_ID)

    mismatches = reconcile(invoices, gstr2b_records)

    for m in mismatches:
        rc = classify_root_cause(
            mismatch_type=m.get("mismatch_type", ""),
            ocr_confidence=0.85,
            user_edited_field=False,
            supplier_error_history=0,
            total_supplier_invoices=1,
        )
        m["root_cause_category"] = rc["root_cause_category"]
        m["root_cause_confidence"] = rc["confidence"]
        m["recommended_action"] = rc["recommended_action"]
        m["explanation_en"] = rc["reasoning"]
        m["explanation_hi"] = ""

    if mismatches:
        queries.insert_mismatches_batch(DEMO_USER_ID, mismatches)

    return GSTR2BUploadResponse(upload_id=upload_id, status="processed")


@router.get("/mismatches", response_model=MismatchListResponse)
async def get_mismatches(_user=Depends(verify_jwt)):
    """Get list of invoice vs GSTR-2B mismatches."""
    mismatches = queries.get_mismatches(DEMO_USER_ID)
    total_blocked = sum(float(m.get("itc_at_risk") or m.get("amount_difference") or 0) for m in mismatches)
    items = []
    for m in mismatches:
        items.append({
            "id": m["id"],
            "invoice_id": m.get("invoice_id") or "",
            "supplier_name": m.get("supplier_name") or "",
            "mismatch_type": m.get("mismatch_type") or "",
            "amount_difference": float(m.get("amount_difference") or 0),
            "explanation_hi": m.get("explanation_hi") or "",
            "explanation_en": m.get("explanation_en") or "",
            "root_cause_category": m.get("root_cause_category") or "",
            "root_cause_confidence": float(m.get("root_cause_confidence") or 0),
            "recommended_action": m.get("recommended_action") or "",
            "resolved": m.get("resolved", False),
        })
    return MismatchListResponse(mismatches=items, total_blocked_itc=round(total_blocked, 2))
