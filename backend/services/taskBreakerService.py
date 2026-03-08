import os
import json
import logging
from typing import Dict
from dotenv import load_dotenv
from pathlib import Path

# Load .env from backend root
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(env_path)

import google.generativeai as genai

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)


class TaskBreakerService:
    """Service for breaking down goals into manageable subtasks"""

    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")

        if not self.api_key:
            raise ValueError("GEMINI_API_KEY environment variable not set")

        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel('gemini-2.5-flash')

        # Resolve data folder path
        self.data_dir = Path(__file__).resolve().parent.parent / "data"
        self.data_dir.mkdir(exist_ok=True)  # ensure folder exists
        self.task_file = self.data_dir / "task_list.json"

        logger.info(f"TaskBreakerService initialized. Tasks will be saved to {self.task_file}")

    def break_goal_into_tasks(self, goal: str, prescription_info: str = "Needs high-stimulation, 10-15 min bursts") -> Dict:
        """Break a goal into subtasks using Gemini AI"""
        logger.info(f"Breaking goal into tasks: {goal[:50]}...")

        prompt = f"""
        Role: You are an ADHD Productivity Coach.
        User Profile: {prescription_info}
        Goal: {goal}

        Task: Break this goal into no more than 5 tiny, specific sub-steps. Assign a realistic time estimate for each step as an integer number of minutes (e.g., 10 minutes, 15 minutes, 5 minutes).
        ADHD users struggle with 'Executive Dysfunction,' so make the first step extremely easy (e.g., 'Stand up and walk to the kitchen').

        Format your response as JSON:
        {{"goal": "{goal}", "subtasks": [], "estimated_total_time": 45}}
        """

        try:
            response = self.model.generate_content(prompt)
            result = self._parse_json_response(response.text)

            # Save to JSON file
            try:
                with open(self.task_file, "w", encoding="utf-8") as f:
                    json.dump(result, f, indent=2)
                logger.info(f"Task list saved to {self.task_file}")
            except Exception as e:
                logger.error(f"Failed to save task list: {e}")

            return result

        except Exception as e:
            logger.error(f"Task breaking error: {e}")
            return {
                "goal": goal,
                "error": str(e),
                "subtasks": [],
                "estimated_total_time": 0
            }

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
            return {
                "goal": "Error parsing response",
                "error": f"Failed to parse AI response: {str(e)}",
                "subtasks": [],
                "estimated_total_time": 0
            }


if __name__ == "__main__":

    service = TaskBreakerService()

    result = service.break_goal_into_tasks(
        "Finish CS homework and prepare presentation"
    )

    print(json.dumps(result, indent=2))
    print(f"\n✅ Task JSON file created at: {service.task_file}")