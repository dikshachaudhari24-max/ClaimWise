from fastapi import APIRouter, Depends

from app.db import queries
from app.deps import verify_jwt
from app.engines.compliance_score import compute_risk_score, get_next_deadline
from app.schemas.all_schemas import RiskScoreResponse

router = APIRouter(prefix="/risk", tags=["risk"])

DEMO_USER_ID = "00000000-0000-0000-0000-000000000001"


@router.get("/score", response_model=RiskScoreResponse)
async def get_risk_score(_user=Depends(verify_jwt)):
    """Get the compliance risk score."""
    mismatches = queries.get_mismatches(DEMO_USER_ID, resolved=False)

    unresolved_mismatches = sum(
        1 for m in mismatches if m.get("mismatch_type") in ("gstin_mismatch", "amount_mismatch", "missing_invoice")
    )
    unresolved_hsn = sum(1 for m in mismatches if m.get("mismatch_type") == "hsn_error")
    uncleared_anomalies = 0

    invoices, _ = queries.get_invoices(DEMO_USER_ID, page=1, per_page=1000)
    uncleared_anomalies = sum(1 for inv in invoices if float(inv.get("anomaly_score") or 0) >= 0.5)

    result = compute_risk_score(unresolved_mismatches, unresolved_hsn, uncleared_anomalies)

    return RiskScoreResponse(
        score=result["score"],
        tier=result["tier"],
        tier_color=result["tier_color"],
        breakdown=result["breakdown"],
        next_deadline=result["next_deadline"],
    )
