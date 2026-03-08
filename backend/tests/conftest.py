import pytest
import tempfile
from pathlib import Path
import sys
import os
from unittest.mock import Mock

# Add project root to path so we can import app
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from app import app, services


@pytest.fixture
def mock_service():
    """Create a mock prescription service"""
    mock = Mock()
    mock.upload_dir = Path(tempfile.mkdtemp())
    mock.profile_dir = Path(tempfile.mkdtemp())
    mock.analyze_text.return_value = {
        "medications": [
            {
                "name": "Adderall",
                "dosage": "20mg",
                "frequency": "daily",
                "type": "stimulant"
            }
        ],
        "confidence": 0.9
    }
    mock.save_prescription.return_value = True
    mock.get_prescription.return_value = {
        "user_id": "test_user",
        "analysis": {"medications": []}
    }
    mock.extract_text_from_file.return_value = "Adderall XR 20mg daily"
    return mock


@pytest.fixture
def client(mock_service):
    """Create a test client with mock prescription service"""
    # Patch the module-level services dict to use the mock
    services["prescription"] = mock_service
    app.config['TESTING'] = True
    
    with app.test_client() as test_client:
        yield test_client
