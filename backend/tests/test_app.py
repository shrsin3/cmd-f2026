import io
import tempfile
from pathlib import Path
import sys, os

# Add project root to path so we can import app
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from app import app, services  # import the module-level services dict


# =========================
# Tests
# =========================
def test_home_endpoint(client):
    res = client.get("/")
    assert res.status_code == 200
    data = res.get_json()
    assert data["status"] == "running"
    assert "timestamp" in data


def test_upload_text_success(client, mock_service):
    payload = {"prescription_text": "Adderall XR 20mg daily", "user_id": "user_1"}
    res = client.post("/api/prescription/upload-text", json=payload)
    assert res.status_code == 201
    data = res.get_json()
    assert data["status"] == "success"
    assert data["user_id"] == "user_1"
    assert "analysis" in data
    mock_service.analyze_text.assert_called_once_with("Adderall XR 20mg daily")
    mock_service.save_prescription.assert_called_once()


def test_upload_text_missing_text(client):
    res = client.post("/api/prescription/upload-text", json={})
    assert res.status_code == 400
    assert res.get_json()["status"] == "error"


def test_upload_file_success(client):
    data = {
        "file": (io.BytesIO(b"fake text"), "prescription.txt")
    }
    res = client.post(
        "/api/prescription/upload-file",
        data=data,
        content_type="multipart/form-data"
    )
    assert res.status_code == 201
    json_data = res.get_json()
    assert json_data["status"] == "success"
    assert json_data["filename"] == "prescription.txt"
    assert json_data["filename"] == "prescription.txt"


def test_upload_file_invalid_extension(client):
    data = {
        "file": (io.BytesIO(b"bad"), "virus.exe")
    }
    res = client.post(
        "/api/prescription/upload-file",
        data=data,
        content_type="multipart/form-data"
    )
    assert res.status_code == 400


def test_get_prescription(client):
    res = client.get("/api/prescription/test_user")
    assert res.status_code == 200
    data = res.get_json()
    assert data["status"] == "success"
    assert "prescription" in data