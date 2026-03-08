"""
Prescription Upload Service
Handles prescription file/text uploads and analysis
Isolated module for prescription upload feature
"""

import os
import json
import logging
from pathlib import Path
from datetime import datetime
from typing import Dict, Optional
from dotenv import load_dotenv
from pathlib import Path

# Load .env from backend root (one level up from services)
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(env_path)

import google.generativeai as genai

logger = logging.getLogger(__name__)


class PrescriptionService:
    """Service for uploading and analyzing prescriptions"""

    def __init__(self, upload_dir: str = "uploads", profile_dir: str = None):
        # Uploads folder stays local to services
        self.upload_dir = Path(upload_dir)
        self.upload_dir.mkdir(exist_ok=True)

        # Profile folder (where JSON is saved)
        if profile_dir is None:
            # ../data relative to this file
            self.profile_dir = Path(__file__).resolve().parent.parent / "data"
        else:
            self.profile_dir = Path(profile_dir)

        self.profile_dir.mkdir(exist_ok=True)  # ensure folder exists

        self.api_key = os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY environment variable not set")

        import google.generativeai as genai
        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel('gemini-2.5-flash')

        logger.info(f"PrescriptionService initialized. JSON files will be saved to {self.profile_dir}")

    def analyze_text(self, text: str) -> Dict:
        """Analyze prescription text with Gemini AI"""
        logger.info("Analyzing prescription text")

        prompt = f"""Analyze this prescription and extract medication information.
        
Return ONLY valid JSON:
{{
    "medications": [
        {{
            "name": "medication name",
            "dosage": "dosage amount",
            "frequency": "how often",
            "type": "stimulant/non-stimulant/other"
        }}
    ],
    "prescriber": "doctor name if mentioned",
    "warnings": ["warnings if any"],
    "confidence": 0.0-1.0
}}

Prescription:
{text}"""

        try:
            response = self.model.generate_content(prompt)
            return self._parse_json_response(response.text)
        except Exception as e:
            logger.error(f"Analysis error: {e}")
            return {"medications": [], "error": str(e), "confidence": 0}

    def extract_text_from_file(self, filepath: str, file_ext: str) -> str:
        """Extract text from uploaded file"""
        filepath = Path(filepath)
        
        try:
            if file_ext == 'txt':
                with open(filepath, 'r') as f:
                    return f.read()
            
            elif file_ext == 'pdf':
                from PyPDF2 import PdfReader
                reader = PdfReader(filepath)
                return "".join([page.extract_text() for page in reader.pages])
            
            elif file_ext in ['png', 'jpg', 'jpeg']:
                import pytesseract
                from PIL import Image
                image = Image.open(filepath)
                return pytesseract.image_to_string(image)
            
            else:
                raise ValueError(f"Unsupported file type: {file_ext}")
        
        except ImportError as e:
            logger.error(f"Missing library: {e}")
            raise
        except Exception as e:
            logger.error(f"File extraction error: {e}")
            raise

    def save_prescription(self, user_id: str, analysis: Dict) -> bool:
        """Save prescription analysis"""
        try:
            filename = self.profile_dir / f"{user_id}_prescription.json"
            data = {
                "user_id": user_id,
                "timestamp": datetime.now().isoformat(),
                "analysis": analysis
            }
            with open(filename, "w") as f:
                json.dump(data, f, indent=2)
            logger.info(f"Prescription saved: {user_id}")
            return True
        except Exception as e:
            logger.error(f"Save error: {e}")
            return False

    def get_prescription(self, user_id: str) -> Optional[Dict]:
        """Retrieve saved prescription"""
        try:
            filename = self.profile_dir / f"{user_id}_prescription.json"
            if filename.exists():
                with open(filename, "r") as f:
                    return json.load(f)
            return None
        except Exception as e:
            logger.error(f"Retrieve error: {e}")
            return None

    def _parse_json_response(self, response_text: str) -> Dict:
        """Parse JSON from Gemini response"""
        try:
            if "```json" in response_text:
                json_str = response_text.split("```json")[1].split("```")[0].strip()
            elif "```" in response_text:
                json_str = response_text.split("```")[1].split("```")[0].strip()
            else:
                json_str = response_text
            
            return json.loads(json_str)
        except json.JSONDecodeError as e:
            logger.error(f"JSON parse error: {e}")
            return {"medications": [], "error": "Parse error", "confidence": 0}
        
if __name__ == "__main__":

    print("Testing PrescriptionService...")

    service = PrescriptionService()

    sample_text = """
    Patient: John Smith
    Medication: Adderall 10mg
    Frequency: Twice daily
    Doctor: Dr. Brown
    """

    result = service.analyze_text(sample_text)

    print("\nAnalysis Result:")
    print(result)

    # Test saving
    service.save_prescription(
        user_id="test_user",
        analysis=result
    )

    print("Prescription file saved.")