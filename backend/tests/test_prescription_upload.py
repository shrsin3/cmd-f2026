# test_prescriptionUploadService.py
import os
import json
import pytest
from pathlib import Path
from unittest.mock import patch, MagicMock

from dotenv import load_dotenv
load_dotenv()  # This loads GOOGLE_API_KEY from your .env file

from services.prescriptionUploadService import PrescriptionService


@pytest.fixture
def prescription_service(tmp_path):
    """Create PrescriptionService instance using temporary directories"""
    upload_dir = tmp_path / "uploads"
    profile_dir = tmp_path / "prescriptions"
    return PrescriptionService(upload_dir=str(upload_dir), profile_dir=str(profile_dir))


def test_analyze_text_success(prescription_service):
    sample_text = "Adderall XR 20mg daily"

    # Mock Gemini AI API response
    mock_response = MagicMock()
    mock_response.text = json.dumps({
        "medications": [
            {"name": "Adderall XR", "dosage": "20mg", "frequency": "daily", "type": "stimulant"}
        ],
        "prescriber": "Dr. Smith",
        "warnings": [],
        "confidence": 0.95
    })

    with patch.object(prescription_service.model, "generate_content", return_value=mock_response):
        result = prescription_service.analyze_text(sample_text)
        assert "medications" in result
        assert result["medications"][0]["name"] == "Adderall XR"
        assert result["confidence"] == 0.95