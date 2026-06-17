from fastapi import APIRouter, Depends, HTTPException

from app.deps import verify_jwt
from app.schemas.all_schemas import RiskScoreResponse

router = APIRouter(prefix="/risk", tags=["risk"])


@router.get("/score", response_model=RiskScoreResponse)
async def get_risk_score(_user=Depends(verify_jwt)):
    """Get the compliance risk score."""
    raise HTTPException(status_code=501, detail="Not implemented yet")
