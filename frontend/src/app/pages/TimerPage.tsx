import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import svgPaths from "../../imports/svg-shhkcqo5p2";
import imgAdobeExpressFile2 from "../../assets/4ecbf1117d8120f8709d5f23417aad21bf2696d7.png";
import Navbar from "../components/Navbar";

export default function TimerPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { subtaskId, taskName, currentTaskIndex, totalTasks, completedTasks } = location.state || {};

  const [isStopped, setIsStopped] = useState(false);

  const timeLeft = 16 * 60 + 15;
  const progress = 30;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleFinish = () => {
    navigate("/wrap-up", {
      state: { subtaskId, taskName, currentTaskIndex, totalTasks, completedTasks: completedTasks || [] }
    });
  };

  return (
    <div className="min-h-screen bg-[#ececec] flex flex-col">
      <Navbar />

      <div className="flex flex-1 items-center justify-center px-6 -mt-8">
        {/* Card */}
        <div className="bg-[#a2b5a1] rounded-[20px] w-full max-w-[900px] px-10 py-8 flex flex-col gap-6">

          {/* Top section: timer left, progress+dino right */}
          <div className="flex flex-row items-center gap-6">

            {/* Left: label + big timer */}
            <div className="flex flex-col gap-2 flex-1">
              <p className="font-['Inter:Regular',sans-serif] text-[2.3rem] text-black">
                You need to lock in for
              </p>
              <p className="font-['Inter:Regular',sans-serif] text-[7rem] text-black leading-none">
                {formatTime(timeLeft)}
              </p>
            </div>

            {/* Right: progress bar + fire/counter + dino */}
            <div className="flex flex-col items-center gap-2 w-[280px] flex-shrink-0">
              {/* Progress bar */}
              <div className="w-full bg-white border-[3px] border-black h-[32px] overflow-hidden rounded-sm">
                <div className="bg-[#54a654] h-full transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
              {/* Fire + counter */}
              <div className="flex items-center gap-2 self-start">
                <svg className="w-[24px] h-[28px]" fill="none" viewBox="0 0 34.6 38.95">
                  <path clipRule="evenodd" d={svgPaths.p24e41080} fill="#EB5757" fillRule="evenodd" />
                  <path clipRule="evenodd" d={svgPaths.p102a8fe0} fill="#F2C94C" fillRule="evenodd" />
                </svg>
                <span className="font-['Inter:Regular',sans-serif] text-[1.1rem] text-black">
                  {currentTaskIndex || 1}/{totalTasks || 3}
                </span>
              </div>
              {/* Dino */}
              <img alt="Focusaurus dinosaur mascot" className="w-full h-auto object-contain" src={imgAdobeExpressFile2} />
            </div>

          </div>

          {/* Bottom: Stop / Finish buttons */}
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