import { useEffect, useRef } from "react";
import { FaceDetection } from "@mediapipe/face_detection";
import { Camera } from "@mediapipe/camera_utils";

export default function FocusDetector({ onDistraction }) {
  const videoRef = useRef(null);

  useEffect(() => {
    let missingFrames = 0;
    let detectedFrames = 0;
    let distractionActive = false;
    let lastTriggerTime = 0;

    const MISSING_THRESHOLD = 25; // ~1.2 seconds
    const RECOVERY_THRESHOLD = 15;
    const COOLDOWN = 4000; // prevent spam (4 seconds)

    const faceDetection = new FaceDetection({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`
    });

    faceDetection.setOptions({
      model: "short",
      minDetectionConfidence: 0.7
    });

    faceDetection.onResults((results) => {
      const now = Date.now();
      const faceDetected = results.detections.length > 0;

      if (!faceDetected) {
        missingFrames++;
        detectedFrames = 0;
      } else {
        detectedFrames++;
        missingFrames = 0;
      }

      // Trigger distraction
      if (
        missingFrames > MISSING_THRESHOLD &&
        !distractionActive &&
        now - lastTriggerTime > COOLDOWN
      ) {
        distractionActive = true;
        lastTriggerTime = now;

        onDistraction();
      }

      // Reset once face stable again
      if (detectedFrames > RECOVERY_THRESHOLD) {
        distractionActive = false;
      }
    });

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        await faceDetection.send({ image: videoRef.current });
      },
      width: 640,
      height: 480
    });

    camera.start();

    return () => {
      camera.stop();
    };
  }, [onDistraction]);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      playsInline
      className="fixed bottom-6 right-6 w-[180px] h-[135px] rounded-lg border-2 border-black shadow-md bg-black"
    />
  );
}