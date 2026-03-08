import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import svgPaths from "../../imports/svg-shhkcqo5p2";
import imgAdobeExpressFile2 from "../../assets/4ecbf1117d8120f8709d5f23417aad21bf2696d7.png";
import Navbar from "../components/Navbar";
import FocusDetector from "../components/focus/FocusDetectorPopup";

const BACKEND_URL = "http://localhost:5000";

export default function TimerPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { 
    subtaskId, 
    subtaskText,
    taskName, 
    currentTaskIndex, 
    totalTasks, 
    completedTasks,
    time_estimate = 20 // Default to 20 minutes if not provided
  } = location.state || {};

  // Convert minutes to seconds for the timer
  const SESSION_TIME = time_estimate * 60;

  const [timeLeft, setTimeLeft] = useState(SESSION_TIME);
  const [isStopped, setIsStopped] = useState(false);
  const [distractions, setDistractions] = useState(0);
  const [sessionStart] = useState(Date.now());

  // Progress based on completed tasks, not time
  const completedCount = completedTasks?.length || 0;
  const taskProgress = totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Timer countdown
  useEffect(() => {
    if (isStopped) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isStopped]);

  // Called when FocusDetector sees distraction
  // Only count distractions if timer is NOT paused
  const handleDistraction = () => {
    if (!isStopped) {
      setDistractions((prev) => prev + 1);
    }
  };

  // Finish session
  const handleFinish = async () => {
    const minutes = (Date.now() - sessionStart) / 1000 / 60;

    try {
      await fetch(`${BACKEND_URL}/log_session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          minutes,
          distractions,
          subtaskId,
          taskName,
          subtaskText
        })
      });
    } catch (err) {
      console.error("Failed to log session:", err);
    }

    navigate("/wrap-up", {
      state: {
        subtaskId,
        subtaskText,
        taskName,
        currentTaskIndex,
        totalTasks,
        completedTasks: completedTasks || [],
        distractions,
        timeSpent: Math.floor(minutes),
        timeEstimate: time_estimate
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#ececec] flex flex-col">
      <Navbar />

      <div className="flex flex-1 items-center justify-center px-6 -mt-8">
        <div className="bg-[#a2b5a1] rounded-[20px] w-full max-w-[900px] px-10 py-8 flex flex-col gap-6">

          {/* Top section */}
          <div className="flex flex-row items-center gap-6">

            {/* Timer and Info */}
            <div className="flex flex-col gap-4 flex-1">
              {/* Subtask name */}
              {subtaskText && (
                <p className="font-['Inter:Regular',sans-serif] text-[1.3rem] text-black font-semibold">
                  {subtaskText}
                </p>
              )}

              {/* Timer prompt */}
              <p className="font-['Inter:Regular',sans-serif] text-[2.3rem] text-black">
                You need to lock in for
              </p>

              {/* Timer display */}
              <p className={`font-['Inter:Regular',sans-serif] text-[7rem] text-black leading-none ${isStopped ? "opacity-60" : ""}`}>
                {formatTime(timeLeft)}
              </p>

              {/* Pause indicator */}
              {isStopped && (
                <p className="text-lg text-red-600 font-semibold animate-pulse">
                  ⏸ Timer Paused
                </p>
              )}

              {/* Distraction counter */}
              <div className="flex items-center gap-3">
                <p className="text-lg text-black font-medium">
                  Distractions: <span className={`${distractions > 0 ? "text-red-600 font-bold" : "text-black"}`}>{distractions}</span>
                </p>
                {isStopped && (
                  <p className="text-sm text-gray-700 italic">
                    (paused)
                  </p>
                )}
              </div>

              {/* Task progress */}
              {currentTaskIndex && totalTasks && (
                <p className="text-base text-black opacity-80">
                  Task {currentTaskIndex} of {totalTasks}
                </p>
              )}
            </div>

            {/* Progress + Dino */}
            <div className="flex flex-col items-center gap-4 w-[280px] flex-shrink-0">

              {/* Progress bar - based on tasks completed, not time */}
              <div className="w-full">
                <div className="w-full bg-white border-[3px] border-black h-[32px] overflow-hidden rounded-sm">
                  <div
                    className="bg-[#54a654] h-full transition-all duration-300"
                    style={{ width: `${taskProgress}%` }}
                  />
                </div>
                <p className="text-sm text-black font-medium text-center mt-2">
                  {completedCount} of {totalTasks} tasks
                </p>
              </div>

              {/* Fire counter */}
              <div className="flex items-center gap-2 self-start">
                <svg className="w-[24px] h-[28px]" fill="none" viewBox="0 0 34.6 38.95">
                  <path clipRule="evenodd" d={svgPaths.p24e41080} fill="#EB5757" fillRule="evenodd" />
                  <path clipRule="evenodd" d={svgPaths.p102a8fe0} fill="#F2C94C" fillRule="evenodd" />
                </svg>

                <span className="font-['Inter:Regular',sans-serif] text-[1.1rem] text-black font-medium">
                  {currentTaskIndex || 1}/{totalTasks || 1}
                </span>
              </div>

              {/* Dino */}
              <img
                alt="Focusaurus dinosaur mascot"
                className="w-full h-auto object-contain"
                src={imgAdobeExpressFile2}
              />
            </div>
          </div>

          {/* Bottom buttons */}
          <div className="flex gap-4 w-full">
            <button
              onClick={() => setIsStopped(!isStopped)}
              className={`flex-1 transition-colors rounded-[20px] py-5 font-['Inter:Regular',sans-serif] text-[1.2rem] md:text-[2rem] cursor-pointer border-none ${
                isStopped 
                  ? "bg-[#54a654] hover:bg-[#459e45] active:bg-[#368836] text-white font-bold" 
                  : "bg-[#e9e9ea] hover:bg-[#d9d9da] active:bg-[#c9c9ca] text-black"
              }`}
            >
              {isStopped ? "▶ Resume" : "⏸ Pause"}
            </button>

            <button
              onClick={handleFinish}
              className="flex-1 bg-[#e9e9ea] hover:bg-[#d9d9da] active:bg-[#c9c9ca] transition-colors rounded-[20px] py-5 font-['Inter:Regular',sans-serif] text-[1.2rem] md:text-[2rem] text-black cursor-pointer border-none"
            >
              ✓ Finish
            </button>
          </div>

        </div>
      </div>

      {/* Focus detection webcam - only active when timer is running */}
      {!isStopped && <FocusDetector onDistraction={handleDistraction} />}
    </div>
  );
}