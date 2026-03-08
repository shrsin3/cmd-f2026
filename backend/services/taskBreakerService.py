"""
Task Breaker Service
Handles AI-powered task breakdown for ADHD productivity
Isolated module for task breaking feature
"""

import os
import logging
from typing import Dict, Optional

import google.generativeai as genai

logger = logging.getLogger(__name__)


class TaskBreakerService:
    """Service for breaking down goals into manageable subtasks"""

    def __init__(self):
        self.api_key = os.getenv("GOOGLE_API_KEY")

        if not self.api_key:
            raise ValueError("GOOGLE_API_KEY environment variable not set")

        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel('gemini-2.5-flash')

        logger.info("TaskBreakerService initialized")

    def break_goal_into_tasks(self, goal: str, prescription_info: str = "Needs high-stimulation, 10-15 min bursts") -> Dict:
        """Break a goal into subtasks using Gemini AI"""
        logger.info(f"Breaking goal into tasks: {goal[:50]}...")

        # Using gemini-2.0-flash for speed/hackathon efficiency
        model_id = "gemini-2.5-flash"

        prompt = f"""
        Role: You are an ADHD Productivity Coach.
        User Profile: {prescription_info}
        Goal: {goal}

        Task: Break this goal into no more than 5 tiny, specific sub-steps. Assign a realistic time estimate for each step as an integer number of minutes (e.g., 10 minutes, 15 minutes, 5 minutes).
        ADHD users struggle with 'Executive Dysfunction,' so make the first step extremely easy (e.g., 'Stand up and walk to the kitchen').

        Format your response as JSON:
        {{
            "goal": "{goal}",
            "subtasks": [
                {{
                    "step": 1,
                    "task": "Task description",
                    "time_estimate": 10
                }},
                ...
            ],
            "estimated_total_time": 45
        }}
        """

        try:
            response = self.model.generate_content(prompt)

            # Parse the response as JSON
            result = self._parse_json_response(response.text)
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
        import json

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
            # Return a structured error response
            return {
                "goal": "Error parsing response",
                "error": f"Failed to parse AI response: {str(e)}",
                "subtasks": [],
                "estimated_total_time": 0
            }