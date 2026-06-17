"""Root cause analysis engine for invoice mismatches."""


def classify_root_cause(
    mismatch_type: str,
    ocr_confidence: float,
    user_edited_field: bool,
    supplier_error_history: int,
    total_supplier_invoices: int,
) -> dict:
    """Classify the root cause of a mismatch and return category, confidence, and recommended action."""
    pass
