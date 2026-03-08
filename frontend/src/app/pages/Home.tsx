import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import imgAdobeExpressFile2 from "../../assets/4ecbf1117d8120f8709d5f23417aad21bf2696d7.png";
import Navbar from "../components/Navbar";

export default function Home() {
  const [taskInput, setTaskInput] = useState("");
  const [userName, setUserName] = useState("Dyno");
  const navigate = useNavigate();


  // Retrieve the name from localStorage on component mount
  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setUserName(storedName);
    }
  }, []);  // Empty dependency array means this runs once on mount

  const handleSubmit = () => {
    if (taskInput.trim()) {
      navigate("/tasks", { state: { task: taskInput } });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="min-h-screen bg-[#ececec] flex flex-col">
      <Navbar />
      <div className="flex flex-1 flex-row items-center justify-center gap-20 px-6 py-0 -mt-16">
        <div className="w-full max-w-[400px] flex-shrink-0">
          <img alt="Focusaurus dinosaur mascot" className="w-full h-auto object-contain" src={imgAdobeExpressFile2} />
        </div>
        <div className="flex flex-col gap-6 w-full max-w-[540px]">
          <div>
            <p className="font-['Inter:Regular',sans-serif] text-[3.3rem] text-black leading-snug mb-0">Hi {userName},</p>
            <p className="font-['Inter:Regular',sans-serif] text-[2.5rem] text-black leading-snug">What is your plan for today?</p>
          </div>
          <div className="flex items-center gap-6 bg-[rgba(120,120,128,0.16)] rounded-full px-4 py-3 w-full">
            <input
              type="text"
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Insert your today's tasks"
              className="flex-1 bg-transparent outline-none italic text-[17px] text-[#727272] min-w-0"
            />
          </div>
          <button
            onClick={handleSubmit}
            className="bg-[#A2B5A1] rounded-[15px] px-6 py-2 w-fit text-[17px] text-black cursor-pointer border-none"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}