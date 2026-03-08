import { useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import svgPaths from "../../imports/svg-ne3ka7z3m4";
import imgAdobeExpressFile3 from "../../assets/4ecbf1117d8120f8709d5f23417aad21bf2696d7.png";
import Navbar from "../components/Navbar";

function TaskCheckbox({ checked, onClick }: { checked: boolean; onClick?: (e: React.MouseEvent) => void }) {
  return (
    <div className="relative shrink-0 size-[28px] cursor-pointer" onClick={onClick}>
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28.6277 28.6277">
        <path d={svgPaths.p26603400} id="Rectangle 10" stroke="black" strokeWidth="1.46809" />
      </svg>
      {checked && (
        <svg className="absolute inset-[4px] block size-[calc(100%-8px)]" viewBox="0 0 20 20">
          <path d="M4 10 L8 14 L16 6" stroke="black" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  );
}

function SubTask({
  id, text, checked, onClick, onCheckboxClick
}: {
  id: number; text: string; checked: boolean;
  onClick: () => void; onCheckboxClick: (e: React.MouseEvent) => void;
}) {
  return (
    <div
      className="flex gap-4 items-center cursor-pointer hover:opacity-70 transition-opacity w-full"
      onClick={onClick}
    >
      <TaskCheckbox checked={checked} onClick={onCheckboxClick} />
      <p className={`font-['Inter:Regular',sans-serif] text-[1.2rem] text-black ${checked ? "line-through opacity-60" : ""}`}>
        {text}
      </p>
    </div>
  );
}

export default function TasksPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const task = location.state?.task || "My Task";
  const completedTasksFromState = location.state?.completedTasks || [];

  const [isExpanded, setIsExpanded] = useState(true);
  const [mainTaskChecked, setMainTaskChecked] = useState(false);
  const [subtasks, setSubtasks] = useState([
    { id: 1, text: "Review lecture slides", checked: completedTasksFromState.includes(1) },
    { id: 2, text: "Review notes", checked: completedTasksFromState.includes(2) },
    { id: 3, text: "Practice quizzes", checked: completedTasksFromState.includes(3) },
  ]);

  useEffect(() => {
    setSubtasks([
      { id: 1, text: "Review lecture slides", checked: completedTasksFromState.includes(1) },
      { id: 2, text: "Review notes", checked: completedTasksFromState.includes(2) },
      { id: 3, text: "Practice quizzes", checked: completedTasksFromState.includes(3) },
    ]);
  }, [location.key]);

  useEffect(() => {
    if (subtasks.every(st => st.checked) && subtasks.length > 0) setMainTaskChecked(true);
  }, [subtasks]);

  const handleSubtaskClick = (subtaskId: number, subtaskText: string) => {
    const completedCount = subtasks.filter(st => st.checked).length;
    navigate("/timer", {
      state: { subtaskId, subtaskText, taskName: task, currentTaskIndex: completedCount + 1, totalTasks: subtasks.length, completedTasks: completedTasksFromState }
    });
  };

  const handleCheckboxToggle = (subtaskId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSubtasks(prev => prev.map(st => st.id === subtaskId ? { ...st, checked: !st.checked } : st));
  };

  const handleMainCheckboxToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newState = !mainTaskChecked;
    setMainTaskChecked(newState);
    setSubtasks(prev => prev.map(st => ({ ...st, checked: newState })));
  };

  const formatTaskTitle = (text: string) =>
    text.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");

  return (
    <div className="min-h-screen bg-[#ececec] flex flex-col">
      <Navbar />

      <div className="flex flex-1 flex-row items-center justify-center gap-20 px-6 py-0 -mt-16">
        {/* Dino image */}
        <div className="w-full max-w-[400px] md:max-w-[400px] flex-shrink-3">
          <img alt="Focusaurus dinosaur mascot" className="w-full h-auto object-contain" src={imgAdobeExpressFile3} />
        </div>

        {/* Task panel */}
        <div className="flex flex-col gap-5 w-full max-w-[540px]">
          <p className="font-['Inter:Regular',sans-serif] text-[2.7rem] text-black leading-snug">
            You have these tasks to do!
          </p>

          {/* Main task row */}
          <div className="bg-[#d9d9d9] rounded-[12px] px-4 py-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <TaskCheckbox checked={mainTaskChecked} onClick={handleMainCheckboxToggle} />
              <p className="font-['Inter:Regular',sans-serif] text-[1.3rem] text-black">
                {formatTaskTitle(task)}
              </p>
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="bg-transparent border-none cursor-pointer transition-transform flex-shrink-0"
              style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }}
            >
              <svg width="22" height="20" fill="none" viewBox="0 0 22.8461 20.3697">
                <path d={svgPaths.p3b0b9e00} fill="black" />
              </svg>
            </button>
          </div>

          {/* Subtasks */}
          {isExpanded && (
            <div className="flex flex-col gap-4 pl-4">
              {subtasks.map(subtask => (
                <SubTask
                  key={subtask.id}
                  id={subtask.id}
                  text={subtask.text}
                  checked={subtask.checked}
                  onClick={() => handleSubtaskClick(subtask.id, subtask.text)}
                  onCheckboxClick={(e) => handleCheckboxToggle(subtask.id, e)}
                />
              ))}
            </div>
          )}

          {/* Done button */}
          <button
            onClick={() => navigate("/report")}
            className="bg-[#a2b5a1] hover:bg-[#92a591] transition-colors rounded-[15px] py-3 w-full font-['Inter:Regular',sans-serif] text-[1.3rem] text-black cursor-pointer border-none mt-2"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}