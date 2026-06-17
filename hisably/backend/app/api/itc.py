from fastapi import APIRouter, Depends, HTTPException

from app.deps import verify_jwt
from app.schemas.all_schemas import ITCSummaryResponse

router = APIRouter(prefix="/itc", tags=["itc"])


@router.get("/summary", response_model=ITCSummaryResponse)
async def get_itc_summary(_user=Depends(verify_jwt)):
    """Get ITC recovery and loss summary."""
    raise HTTPException(status_code=501, detail="Not implemented yet")
