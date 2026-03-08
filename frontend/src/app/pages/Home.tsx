import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import imgAdobeExpressFile2 from "../../assets/4ecbf1117d8120f8709d5f23417aad21bf2696d7.png";
import Navbar from "../components/Navbar";

export default function Home() {
  const [taskInput, setTaskInput] = useState("");
  const [userName, setUserName] = useState("Dyno");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Retrieve the name from localStorage on component mount
  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  const handleSubmit = async () => {
    if (!taskInput.trim()) {
      setError("Please enter a task");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/task/break", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal: taskInput }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      // Log to debug what we're getting
      console.log("API Response:", data);

      // Handle the response structure
      const subtasks = data.result?.subtasks || data.subtasks || [];

      // Transform subtasks - keep it simple and clean
      const formattedSubtasks = subtasks.map((subtask: any, index: number) => {
        // Handle string responses
        if (typeof subtask === "string") {
          return {
            id: index + 1,
            step: subtask,
            title: subtask,
            text: subtask,
            description: "",
            time_estimate: 15,
          };
        }

        // Handle object responses
        const time = subtask.time_estimate_minutes || subtask.time_estimate || subtask.duration || 15;
        const description = subtask.description || subtask.details || "";
        const text = subtask.step || subtask.title || subtask.text || "";

        console.log(`Subtask ${index + 1}: text="${text}", time=${time}m, description="${description.substring(0, 50)}..."`);

        return {
          id: index + 1,
          step: text,
          title: text,
          text: text,
          description: description,
          time_estimate: time,
          duration: time,
          ...subtask, // Include any other properties from backend
        };
      });

      console.log("Formatted Subtasks:", formattedSubtasks);

      // Navigate with complete data
      navigate("/tasks", {
        state: {
          task: taskInput,
          subtasks: formattedSubtasks,
          completedTasks: [],
        },
      });
    } catch (error) {
      console.error("Error fetching task breakdown:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to process your task. Please try again."
      );
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isLoading) {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-[#ececec] flex flex-col">
      <Navbar />

      <div className="flex flex-1 flex-row items-center justify-center gap-20 px-6 py-0 -mt-16">
        {/* Dino image */}
        <div className="w-full max-w-[400px] flex-shrink-0 hidden md:flex">
          <img
            alt="Focusaurus dinosaur mascot"
            className="w-full h-auto object-contain"
            src={imgAdobeExpressFile2}
          />
        </div>

        {/* Main content */}
        <div className="flex flex-col gap-6 w-full max-w-[540px]">
          {/* Greeting */}
          <div>
            <p className="font-['Inter:Regular',sans-serif] text-[3.3rem] text-black leading-snug mb-0">
              Hi {userName},
            </p>
            <p className="font-['Inter:Regular',sans-serif] text-[2.5rem] text-black leading-snug">
              What is your plan for today?
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
              <p className="font-['Inter:Regular',sans-serif] text-[1rem]">
                {error}
              </p>
            </div>
          )}

          {/* Input section */}
          <div className="flex items-center gap-6 bg-[rgba(120,120,128,0.16)] rounded-full px-4 py-3 w-full">
            <input
              type="text"
              value={taskInput}
              onChange={(e) => {
                setTaskInput(e.target.value);
                setError(""); // Clear error on new input
              }}
              onKeyDown={handleKeyDown}
              placeholder="Insert your today's tasks"
              className="flex-1 bg-transparent outline-none italic text-[17px] text-[#727272] min-w-0"
              disabled={isLoading}
            />
          </div>

          {/* Button with loading state */}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`rounded-[15px] px-6 py-2 w-fit text-[17px] text-black cursor-pointer border-none font-['Inter:Regular',sans-serif] transition-all duration-200 flex items-center gap-2 ${
              isLoading
                ? "bg-[#8a9d89] opacity-70 cursor-not-allowed"
                : "bg-[#A2B5A1] hover:bg-[#92a591] active:bg-[#82956a]"
            }`}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-black"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Processing...</span>
              </>
            ) : (
              "Submit"
            )}
          </button>

          {/* Loading info */}
          {isLoading && (
            <div className="flex flex-col items-center gap-2">
              <p className="font-['Inter:Regular',sans-serif] text-[0.9rem] text-gray-600">
                Breaking down your task into subtasks...
              </p>
              <div className="w-32 h-1 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-[#A2B5A1] animate-pulse rounded-full w-full" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}