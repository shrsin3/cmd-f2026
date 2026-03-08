import os
import json
from datetime import datetime
from google import genai
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


# ------------------------------------------------
# LOAD SESSION DATA
# ------------------------------------------------
def load_session_totals(file_path="sessions.json"):
    """
    Calculate total minutes and distractions from sessions.json
    Only includes completed sessions.
    """

    try:
        with open(file_path, "r") as f:
            sessions = json.load(f)

        total_minutes = 0
        total_distractions = 0

        for session in sessions:
            if session.get("completed"):
                total_minutes += session.get("minutes", 0)
                total_distractions += session.get("distractions", 0)

        return total_minutes, total_distractions

    except Exception as e:
        print(f"Session loading error: {e}")
        return 0, 0


# ------------------------------------------------
# LOAD PRESCRIPTION DATA
# ------------------------------------------------
def load_prescription_data(file_path="prescription_data.json"):
    try:
        with open(file_path, "r") as f:
            return json.load(f)
    except Exception:
        return {}


# ------------------------------------------------
# GENERATE AI REPORT
# ------------------------------------------------
def generate_focus_report(session_minutes=None, distractions_count=None, prescription=None):

    model_id = "gemini-2.5-flash"

    # Use passed arguments if they exist; otherwise, load from files
    if session_minutes is None or distractions_count is None:
        session_minutes, distractions_count = load_session_totals()
    
    if prescription is None:
        prescription = load_prescription_data()

    prescription_context = json.dumps(prescription, indent=2) if prescription else "No prescription data available."

    prompt = f"""
You are an ADHD productivity coach analyzing a user's daily focus performance.

SESSION DATA
------------
Total Focus Time Today: {session_minutes} minutes
Total Distractions Today: {distractions_count}

PRESCRIPTION PROFILE
--------------------
This information was extracted from the user's prescription records.

{prescription_context}

GUIDELINES
----------
1. Consider how ADHD medication might affect focus cycles.
2. If stimulant medication is present, assume stronger short-term focus but fatigue later.
3. Suggest ADHD-friendly productivity strategies.
4. Do NOT give medical advice.

TASK
----
Generate a JSON report analyzing today's productivity.

Output format:

{{
    "total_focus_minutes": {session_minutes},
    "total_distractions": {distractions_count},
    "focus_score": 75,
    "medication_considerations": "How the medication might affect productivity.",
    "suggestions": [
        "Tip 1",
        "Tip 2",
        "Tip 3"
    ],
    "personalized_recommendation": "Best focus/break pattern for this user"
}}
"""

    try:
        response = client.models.generate_content(
            model=model_id,
            contents=prompt,
            config={'response_mime_type': 'application/json'}
        )

        report_data = json.loads(response.text)
        return report_data

    except Exception as e:
        return {"error": f"Failed to generate report: {e}"}


# ------------------------------------------------
# TEST
# ------------------------------------------------
if __name__ == "__main__":
    print("Generating AI Focus Report...")

    try:
        # Load session data
        with open("sessions.json", "r") as f:
            sessions = json.load(f)

        # Calculate totals from all sessions
        total_minutes = sum(session["minutes"] for session in sessions)
        total_distractions = sum(session["distractions"] for session in sessions)

        # Hardcoded ADHD prescription test input
        test_prescription = "Adderall XR 10mg - improves sustained attention but may cause hyperfocus bursts"

        print(f"Total Session Minutes: {total_minutes}")
        print(f"Total Distractions: {total_distractions}")
        print(f"Prescription Context: {test_prescription}")
        print()

        # Generate AI report
        report = generate_focus_report(
            total_minutes,
            total_distractions,
            test_prescription
        )

        if "error" not in report:
            print(f"Focus Score: {report['focus_score']}%")
            print("Suggestions:")
            for s in report["suggestions"]:
                print(f" • {s}")

            print(f"Personalized Strategy: {report['personalized_recommendation']}")
        else:
            print(report["error"])

    except FileNotFoundError:
        print("Error: sessions.json file not found.")
    except Exception as e:
        print(f"Unexpected error: {e}")