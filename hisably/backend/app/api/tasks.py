from fastapi import APIRouter, Depends, HTTPException

from app.deps import verify_jwt
from app.schemas.all_schemas import TaskDoneRequest, TaskDoneResponse, TaskListResponse

router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.get("/list", response_model=TaskListResponse)
async def list_tasks(_user=Depends(verify_jwt)):
    """List all pending and completed tasks."""
    raise HTTPException(status_code=501, detail="Not implemented yet")


@router.post("/done", response_model=TaskDoneResponse)
async def mark_task_done(request: TaskDoneRequest, _user=Depends(verify_jwt)):
    """Mark a task as completed with proof."""
    raise HTTPException(status_code=501, detail="Not implemented yet")
