from fastapi import APIRouter, Depends, File, HTTPException, UploadFile

from app.deps import verify_jwt
from app.schemas.all_schemas import GSTR2BUploadResponse, MismatchListResponse

router = APIRouter(prefix="/gstr2b", tags=["gstr2b"])


@router.post("/upload", response_model=GSTR2BUploadResponse)
async def upload_gstr2b(file: UploadFile = File(...), _user=Depends(verify_jwt)):
    """Upload a GSTR-2B file for reconciliation."""
    raise HTTPException(status_code=501, detail="Not implemented yet")


@router.get("/mismatches", response_model=MismatchListResponse)
async def get_mismatches(_user=Depends(verify_jwt)):
    """Get list of invoice vs GSTR-2B mismatches."""
    raise HTTPException(status_code=501, detail="Not implemented yet")
