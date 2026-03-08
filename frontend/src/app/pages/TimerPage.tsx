import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import svgPaths from "../../imports/svg-shhkcqo5p2";
import imgAdobeExpressFile2 from "../../assets/4ecbf1117d8120f8709d5f23417aad21bf2696d7.png";
import Navbar from "../components/Navbar";

const DURATION_MINS = 20;
const BACKEND_URL = "http://localhost:5000";

export default function TimerPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { subtaskId, taskName, currentTaskIndex, totalTasks, completedTasks } = location.state || {};

  const totalSeconds = DURATION_MINS * 60;
  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const [isStopped, setIsStopped] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;

  useEffect(() => {
    const startSession = async () => {
      try {
        await fetch(`${BACKEND_URL}/start-session`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ duration_mins: DURATION_MINS }),
        });
        setSessionStarted(true);
      } catch (err) {
        console.error("Failed to start session:", err);
        setSessionStarted(true); // still start timer even if backend fails
      }
    };
    startSession();
  }, []);

  useEffect(() => {
    if (!sessionStarted || isStopped) return;

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          handleFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current!);
  }, [sessionStarted, isStopped]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleFinish = () => {
    clearInterval(intervalRef.current!);
    navigate("/wrap-up", {
      state: { subtaskId, taskName, currentTaskIndex, totalTasks, completedTasks: completedTasks || [] }
    });
  };

  return (
    <div className="min-h-screen bg-[#ececec] flex flex-col">
      <Navbar />

      <div className="flex flex-1 items-center justify-center px-6 -mt-8">
        <div className="bg-[#a2b5a1] rounded-[20px] w-full max-w-[900px] px-10 py-8 flex flex-col gap-6">

          <div className="flex flex-row items-center gap-6">
            <div className="flex flex-col gap-2 flex-1">
              <p className="font-['Inter:Regular',sans-serif] text-[2.3rem] text-black">
                You need to lock in for
              </p>
              <p className="font-['Inter:Regular',sans-serif] text-[7rem] text-black leading-none">
                {formatTime(timeLeft)}
              </p>
            </div>

            <div className="flex flex-col items-center gap-2 w-[280px] flex-shrink-0">
              <div className="w-full bg-white border-[3px] border-black h-[32px] overflow-hidden rounded-sm">
                <div className="bg-[#54a654] h-full" style={{ width: "30%" }} />
              </div>
              <div className="flex items-center gap-2 self-start">
                <svg className="w-[24px] h-[28px]" fill="none" viewBox="0 0 34.6 38.95">
                  <path clipRule="evenodd" d={svgPaths.p24e41080} fill="#EB5757" fillRule="evenodd" />
                  <path clipRule="evenodd" d={svgPaths.p102a8fe0} fill="#F2C94C" fillRule="evenodd" />
                </svg>
                <span className="font-['Inter:Regular',sans-serif] text-[1.1rem] text-black">
                  1/{totalTasks || 3}
                </span>
              </div>
              <img alt="Focusaurus dinosaur mascot" className="w-full h-auto object-contain" src={imgAdobeExpressFile2} />
            </div>
          </div>

          <div className="flex gap-4 w-full">
            <button
              onClick={() => setIsStopped(!isStopped)}
              className="flex-1 bg-[#e9e9ea] hover:bg-[#d9d9da] transition-colors rounded-[20px] py-5 font-['Inter:Regular',sans-serif] text-[2rem] text-black cursor-pointer border-none"
            >
              {isStopped ? "Resume" : "Stop"}
            </button>
            <button
              onClick={handleFinish}
              className="flex-1 bg-[#e9e9ea] hover:bg-[#d9d9da] transition-colors rounded-[20px] py-5 font-['Inter:Regular',sans-serif] text-[2rem] text-black cursor-pointer border-none"
            >
              Finish
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}