from fastapi import APIRouter, Depends, HTTPException

from app.deps import verify_jwt
from app.schemas.all_schemas import (
    SupplierListResponse,
    SupplierMessageRequest,
    SupplierMessageResponse,
)

router = APIRouter(prefix="/supplier", tags=["suppliers"])


@router.get("/list", response_model=SupplierListResponse)
async def list_suppliers(_user=Depends(verify_jwt)):
    """List all suppliers with reliability scores."""
    raise HTTPException(status_code=501, detail="Not implemented yet")


@router.post("/message", response_model=SupplierMessageResponse)
async def send_supplier_message(request: SupplierMessageRequest, _user=Depends(verify_jwt)):
    """Send a correction message to a supplier."""
    raise HTTPException(status_code=501, detail="Not implemented yet")
