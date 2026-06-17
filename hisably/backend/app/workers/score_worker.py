from app.workers.celery_app import celery_app


@celery_app.task(bind=True, name="recompute_itc")
def recompute_itc(self, user_id: str):
    """Recompute ITC summary and compliance risk score for a user."""
    pass


@celery_app.task(bind=True, name="recompute_supplier_score")
def recompute_supplier_score(self, supplier_id: str, user_id: str):
    """Recompute reliability score for a specific supplier."""
    pass
