from fastapi import APIRouter, Depends

from app.db import queries
from app.deps import verify_jwt
from app.engines.itc_engine import compute_itc_summary
from app.schemas.all_schemas import ITCSummaryResponse

router = APIRouter(prefix="/itc", tags=["itc"])

DEMO_USER_ID = "00000000-0000-0000-0000-000000000001"


@router.get("/summary", response_model=ITCSummaryResponse)
async def get_itc_summary(_user=Depends(verify_jwt)):
    """Get ITC recovery and loss summary."""
    invoices, _ = queries.get_invoices(DEMO_USER_ID, page=1, per_page=1000)
    mismatches = queries.get_mismatches(DEMO_USER_ID, resolved=False)

    summary = compute_itc_summary(invoices, mismatches)
    queries.upsert_itc_summary(DEMO_USER_ID, summary)

    return ITCSummaryResponse(
        total_eligible=summary["total_eligible"],
        total_blocked=summary["total_blocked"],
        total_recoverable=summary["total_recoverable"],
        priority_actions=summary["priority_actions"],
        month=summary["month"],
    )
