"""
Focus Session Service (Detection Service)
Handles real-time face tracking to monitor ADHD focus sessions.
Saves session data to the centralized data folder.
"""

import cv2
import mediapipe as mp
import time
import json
import os
import threading
import logging
from mediapipe.tasks import python
from mediapipe.tasks.python import vision

logger = logging.getLogger(__name__)

class FocusSessionService:
    def __init__(self):
        # Resolve paths relative to this script's location (backend/services/detectService.py)
        self.base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
        
        # 1. Point to the task file in the backend root
        self.model_path = os.path.join(self.base_dir, 'face_detector.task')
        
        # 2. Point to task_sessions.json in the data folder
        self.storage_file = os.path.join(self.base_dir, 'data', 'task_sessions.json')
        
        self.is_running = False
        
        # Setup MediaPipe Options
        if not os.path.exists(self.model_path):
            logger.error(f"Face detector task file not found at: {self.model_path}")
            raise FileNotFoundError(f"Missing face_detector.task at {self.model_path}")

        self.base_options = python.BaseOptions(model_asset_path=self.model_path)
        self.options = vision.FaceDetectorOptions(
            base_options=self.base_options,
            running_mode=vision.RunningMode.VIDEO
        )
        
        logger.info(f"FocusSessionService initialized. Storage: {self.storage_file}")

    def _save_session_to_json(self, minutes, distractions, completed):
        """Internal helper to append session results to backend/data/task_sessions.json"""
        # Ensure data directory exists
        os.makedirs(os.path.dirname(self.storage_file), exist_ok=True)
        
        new_session = {
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
            "minutes": minutes,
            "distractions": distractions,
            "completed": completed
        }

        sessions = []
        if os.path.exists(self.storage_file):
            try:
                with open(self.storage_file, "r") as f:
                    sessions = json.load(f)
            except (json.JSONDecodeError, IOError):
                sessions = []

        sessions.append(new_session)
        
        try:
            with open(self.storage_file, "w") as f:
                json.dump(sessions, f, indent=4)
            logger.info(f"Session saved successfully to {self.storage_file}")
        except Exception as e:
            logger.error(f"Failed to save session: {e}")

    def run_session(self, duration_mins):
        """The actual detection logic and OpenCV window management"""
        self.is_running = True
        distractions = 0
        is_distracted = False
        distraction_start_time = 0
        
        try:
            with vision.FaceDetector.create_from_options(self.options) as detector:
                cap = cv2.VideoCapture(0)
                if not cap.isOpened():
                    raise RuntimeError("Could not open webcam.")

                duration_secs = duration_mins * 60
                start_time = time.time()

                while cap.isOpened() and self.is_running:
                    ret, frame = cap.read()
                    if not ret: 
                        break

                    # Mirror and preprocess
                    frame = cv2.flip(frame, 1)
                    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                    mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb_frame)
                    
                    # MediaPipe detection
                    frame_timestamp_ms = int((time.time() - start_time) * 1000)
                    results = detector.detect_for_video(mp_image, frame_timestamp_ms)

                    # --- DISTRACTION LOGIC ---
                    if not results.detections:
                        if not is_distracted:
                            is_distracted = True
                            distraction_start_time = time.time()
                    else:
                        if is_distracted:
                            # Must be away for more than 2 seconds to count as a distraction
                            if time.time() - distraction_start_time > 2:
                                distractions += 1
                                logger.info(f"Distraction detected. Total: {distractions}")
                            is_distracted = False

                    # --- UI OVERLAY ---
                    elapsed = time.time() - start_time
                    remaining = max(0, duration_secs - elapsed)
                    
                    # Time Remaining
                    cv2.putText(frame, f"Time Left: {int(remaining)}s", (10, 30), 
                                cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)
                    
                    # Focus Status
                    status = "LOOK AWAY" if is_distracted else "FOCUSING"
                    color = (0, 0, 255) if is_distracted else (0, 255, 0)
                    cv2.putText(frame, status, (10, 70), cv2.FONT_HERSHEY_SIMPLEX, 1, color, 2)

                    cv2.imshow('ADHD Focus Monitor', frame)

                    # Exit conditions: Time up or 'q' key pressed
                    if remaining <= 0 or (cv2.waitKey(1) & 0xFF == ord('q')):
                        break

                cap.release()
                cv2.destroyAllWindows()
                
                # Save results to the data folder
                self._save_session_to_json(duration_mins, distractions, True)
                self.is_running = False
                return {"minutes": duration_mins, "distractions": distractions}

        except Exception as e:
            logger.error(f"Focus session error: {e}")
            self.is_running = False
            return {"error": str(e)}

    def start_async_session(self, duration_mins):
        """Starts the session in a background thread so the Flask/FastAPI server stays responsive"""
        if self.is_running:
            return {"status": "error", "message": "A session is already in progress."}
            
        thread = threading.Thread(target=self.run_session, args=(duration_mins,))
        thread.daemon = True  # Ensures thread closes if the main server closes
        thread.start()
        return {"status": "session_started", "duration": duration_mins}
    
if __name__ == "__main__":

    print("Starting DetectService test session...")

    try:
        service = FocusSessionService()

        print("Running 0.1 minute (6 second) test session...")
        
        # Very short test session so you don't have to sit in front of webcam long
        result = service.run_session(duration_mins=0.5)

        print("\nSession Result:")
        print(result)

        print("\nCheck file output at:")
        print(service.storage_file)

        if os.path.exists(service.storage_file):
            print("✅ task_sessions.json successfully created!")

    except Exception as e:
        print("❌ DetectService test failed:")
        print(str(e))