from app.workers.celery_app import celery_app


@celery_app.task(bind=True, name="process_invoice_ocr")
def process_invoice_ocr(self, invoice_id: str, file_url: str, user_id: str):
    """Run OCR extraction, GSTIN/HSN validation, anomaly scoring, and embedding for an invoice."""
    pass
