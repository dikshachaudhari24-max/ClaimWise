"""Invoice anomaly detection using Isolation Forest."""


class InvoiceAnomalyScorer:
    """Scores invoices for anomalies using an Isolation Forest model."""

    def score(self, invoice: dict) -> float:
        """Return an anomaly score between 0.0 and 1.0 for an invoice."""
        pass

    def is_anomalous(self, score: float) -> bool:
        """Determine whether a score exceeds the anomaly threshold."""
        pass

    def get_explanation(self, invoice: dict, score: float) -> str:
        """Generate a human-readable explanation for an anomaly score."""
        pass
