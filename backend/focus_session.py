import cv2
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision
import time
from session_store import save_session

# Setup MediaPipe Task Detector
base_options = python.BaseOptions(model_asset_path='face_detector.task')
options = vision.FaceDetectorOptions(
    base_options=base_options,
    running_mode=vision.RunningMode.VIDEO
)


def start_focus_session(duration_mins):

    with vision.FaceDetector.create_from_options(options) as detector:

        cap = cv2.VideoCapture(0)

        duration_secs = duration_mins * 60
        start_time = time.time()

        distractions = 0
        is_distracted = False
        distraction_start_time = 0

        print(f"Session started for {duration_mins} minutes.")

        while cap.isOpened():

            ret, frame = cap.read()
            if not ret:
                break

            frame = cv2.flip(frame, 1)

            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            mp_image = mp.Image(
                image_format=mp.ImageFormat.SRGB,
                data=rgb_frame
            )

            frame_timestamp_ms = int((time.time() - start_time) * 1000)

            results = detector.detect_for_video(
                mp_image,
                frame_timestamp_ms
            )

            elapsed = time.time() - start_time
            remaining = max(0, duration_secs - elapsed)

            # --- DISTRACTION DETECTION ---
            if not results.detections:

                if not is_distracted:
                    is_distracted = True
                    distraction_start_time = time.time()

            else:

                if is_distracted:

                    if time.time() - distraction_start_time > 2:
                        distractions += 1
                        print(f"Distraction #{distractions}")

                    is_distracted = False

            # UI
            status_text = "FOCUSING" if not is_distracted else "DISTRACTED"
            color = (0, 255, 0) if not is_distracted else (0, 0, 255)

            cv2.putText(
                frame,
                f"Time Left: {int(remaining)}s",
                (10, 30),
                cv2.FONT_HERSHEY_SIMPLEX,
                1,
                (255, 255, 255),
                2
            )

            cv2.putText(
                frame,
                status_text,
                (10, 70),
                cv2.FONT_HERSHEY_SIMPLEX,
                1,
                color,
                2
            )

            cv2.imshow('Focus Monitor', frame)

            if remaining <= 0 or cv2.waitKey(1) & 0xFF == ord('q'):
                break

        cap.release()
        cv2.destroyAllWindows()

        print("\nSession Complete!")

        # SAVE SESSION
        save_session(duration_mins, distractions, True)

        return {
            "minutes": duration_mins,
            "distractions": distractions
        }


if __name__ == "__main__":
    session = start_focus_session(0.5)

    print("\nSession recorded:")
    print(session)