"""
Focus Report Service
Analyzes daily focus sessions and prescription data to generate ADHD-friendly insights.
Integrated with the project data folder.
"""

import os
import json
import logging
from typing import Dict, Tuple, Optional
from google import genai
from dotenv import load_dotenv

# Ensure environment variables are loaded
load_dotenv()

logger = logging.getLogger(__name__)

class FocusReportService:
    """Service for generating personalized ADHD focus reports"""

    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        
        if not self.api_key:
            logger.error("GEMINI_API_KEY environment variable not set")
            raise ValueError("GEMINI_API_KEY environment variable not set")

        self.client = genai.Client(api_key=self.api_key)
        self.model_id = "gemini-2.5-flash" 
        
        # Resolve the absolute path to the 'data' directory
        # This goes up one level from 'services/' then into 'data/'
        self.data_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'data'))
        
        
        # Specific file targets
        self.sessions_file = os.path.join(self.data_dir, "task_sessions.json")
        self.prescription_file = os.path.join(self.data_dir, "test_user_prescription.json")
        
        logger.info(f"FocusReportService initialized. Data directory: {self.data_dir}")

    def _load_session_totals(self) -> Tuple[float, int]:
        """Calculate total minutes and distractions from the task_sessions.json file"""
        try:
            if not os.path.exists(self.sessions_file):
                print(f"######################################################")
                logger.warning(f"Session file not found at {self.sessions_file}")
                return 0.0, 0

            with open(self.sessions_file, "r") as f:
                sessions = json.load(f)
            
            print(sessions)

            # Summing data only from sessions marked as 'completed'
            total_minutes = sum(s.get("minutes", 0) for s in sessions if s.get("status")=="success")
            total_distractions = sum(s.get("distractions", 0) for s in sessions if s.get("status") =="success")
            print(total_minutes, total_distractions)

            return float(total_minutes), int(total_distractions)
        except Exception as e:
            logger.error(f"Session loading error: {e}")
            return 0.0, 0

    def _load_prescription_data(self) -> str:
        """Load prescription context for the AI prompt from the data folder"""
        try:
            if not os.path.exists(self.prescription_file):
                return "No prescription data available."
                
            with open(self.prescription_file, "r") as f:
                data = json.load(f)
                return json.dumps(data, indent=2)
        except Exception as e:
            logger.error(f"Error reading prescription data: {e}")
            return "No prescription data available."

    def generate_report(self, session_minutes: Optional[float] = None, 
                        distractions_count: Optional[int] = None, 
                        prescription_info: Optional[str] = None) -> Dict:
        """
        Generates the AI focus report. 
        Uses provided args (from frontend) or falls back to data/ JSON files.
        """
        
        # 1. Data Aggregation
        if session_minutes is None or distractions_count is None:
            session_minutes, distractions_count = self._load_session_totals()
            
        if prescription_info is None:
            prescription_info = self._load_prescription_data()

        prompt = f"""
        You are an ADHD productivity coach analyzing a user's daily focus performance.

        SESSION DATA
        ------------
        Total Focus Time Today: {session_minutes} minutes
        Total Distractions Today: {distractions_count}

        PRESCRIPTION PROFILE
        --------------------
        {prescription_info}

        GUIDELINES
        ----------
        1. Consider how ADHD medication might affect focus cycles.
        2. If stimulant medication is present, assume stronger short-term focus but fatigue later.
        3. Suggest ADHD-friendly productivity strategies.
        4. Do NOT give medical advice.

        TASK
        ----
        Generate a JSON report analyzing today's productivity.
        """

        try:
            # Using Structured Output (Schema) to ensure the frontend gets exactly what it expects
            response = self.client.models.generate_content(
                model=self.model_id,
                contents=prompt,
                config={
                    'response_mime_type': 'application/json',
                    'response_schema': {
                        'type': 'object',
                        'properties': {
                            'total_focus_minutes': {'type': 'number'},
                            'total_distractions': {'type': 'integer'},
                            'focus_score': {'type': 'integer'},
                            'medication_considerations': {'type': 'string'},
                            'suggestions': {'type': 'array', 'items': {'type': 'string'}},
                            'personalized_recommendation': {'type': 'string'}
                        },
                        'required': [
                            'total_focus_minutes', 
                            'total_distractions', 
                            'focus_score', 
                            'medication_considerations', 
                            'suggestions', 
                            'personalized_recommendation'
                        ]
                    }
                }
            )

            return json.loads(response.text)

        except Exception as e:
            logger.error(f"Report generation error: {e}")
            return {
                "error": "Failed to generate report",
                "details": str(e),
                "total_focus_minutes": session_minutes,
                "total_distractions": distractions_count
            }

if __name__ == "__main__":

    service = FocusReportService()

    report = service.generate_report()

    print("\nGenerated Report:")
    print(json.dumps(report, indent=2))