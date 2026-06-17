from app.workers.celery_app import celery_app


@celery_app.task(bind=True, name="embed_and_upsert")
def embed_and_upsert(self, record_type: str, record_id: str, user_id: str):
    """Generate embeddings for a record and upsert into the Pinecone vector store."""
    pass
