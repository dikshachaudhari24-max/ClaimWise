from app.workers.celery_app import celery_app


@celery_app.task(bind=True, name="analyze_gstr2b")
def analyze_gstr2b(self, upload_id: str, user_id: str, file_url: str):
    """Parse GSTR-2B file, run reconciliation, classify root causes, and generate explanations."""
    pass
