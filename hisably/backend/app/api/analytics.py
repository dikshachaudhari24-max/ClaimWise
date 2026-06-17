from fastapi import APIRouter, Depends, HTTPException

from app.deps import verify_jwt
from app.schemas.all_schemas import MonthlyAnalyticsResponse

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/monthly", response_model=MonthlyAnalyticsResponse)
async def get_monthly_analytics(_user=Depends(verify_jwt)):
    """Get monthly analytics summary."""
    raise HTTPException(status_code=501, detail="Not implemented yet")
