"""Pinecone vector database client."""


def get_namespace(user_id: str, record_type: str) -> str:
    """Build a namespaced key for a user and record type."""
    pass


def upsert_vector(namespace: str, vector_id: str, vector: list[float], metadata: dict) -> None:
    """Upsert a single vector into the Pinecone index."""
    pass


def query_vectors(namespace: str, query_vector: list[float], top_k: int = 5) -> list[dict]:
    """Query the Pinecone index for similar vectors."""
    pass


def delete_namespace(namespace: str) -> None:
    """Delete all vectors in a namespace."""
    pass
