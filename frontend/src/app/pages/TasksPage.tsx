import { useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import svgPaths from "../../imports/svg-ne3ka7z3m4";
import imgAdobeExpressFile3 from "../../assets/4ecbf1117d8120f8709d5f23417aad21bf2696d7.png";
import Navbar from "../components/Navbar";

function TaskCheckbox({ checked, onClick }: { checked: boolean; onClick?: (e: React.MouseEvent) => void }) {
  return (
    <div 
      className="relative shrink-0 size-[28px] cursor-pointer" 
      onClick={onClick}
      role="checkbox"
      aria-checked={checked}
      tabIndex={0}
    >
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
  id, text, description, checked, onClick, onCheckboxClick, timeEstimate
}: {
  id: number; 
  text: string; 
  description: string;
  checked: boolean;
  onClick: () => void; 
  onCheckboxClick: (e: React.MouseEvent) => void;
  timeEstimate: number;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleTitleClick = (e: React.MouseEvent) => {
    // Only trigger if not clicking on the info button
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    onClick();
  };

  const handleInfoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="flex flex-col gap-2 w-full p-3 rounded bg-white border border-gray-200 hover:shadow-md transition-shadow">
      {/* Header row */}
      <div 
        className="flex gap-4 items-center cursor-pointer hover:opacity-80 transition-opacity"
        onClick={handleTitleClick}
      >
        <div onClick={onCheckboxClick} role="presentation">
          <TaskCheckbox checked={checked} />
        </div>
        
        <div className="flex-1 min-w-0">
          <p className={`font-['Inter:Regular',sans-serif] text-[1.1rem] font-semibold text-black ${checked ? "line-through opacity-60" : ""}`}>
            {text}
          </p>
        </div>

        {/* Info icon to expand description */}
        {description && (
          <button
            onClick={handleInfoClick}
            className="flex-shrink-0 p-1 hover:opacity-60 transition-opacity bg-transparent border-none cursor-pointer"
            title="Show details"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="black" strokeWidth="2"/>
              <text x="12" y="16" textAnchor="middle" fontSize="14" fontWeight="bold" fill="black">i</text>
            </svg>
          </button>
        )}

        {/* Time estimate */}
        <div 
          className="flex-shrink-0 text-right"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          <p className="font-['Inter:Regular',sans-serif] text-[0.9rem] text-gray-600 bg-gray-100 px-2 py-1 rounded cursor-pointer hover:bg-gray-200 transition-colors">
            {timeEstimate}m
          </p>
        </div>
      </div>

      {/* Expandable description */}
      {isExpanded && description && (
        <div className="pl-12 pt-2 border-t border-gray-200">
          <p className="font-['Inter:Regular',sans-serif] text-[0.95rem] text-gray-700 leading-relaxed">
            {description}
          </p>
        </div>
      )}
    </div>
  );
}

export default function TasksPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const task = location.state?.task || "My Task";
  const subtasksFromState = location.state?.subtasks || [];
  const completedTaskIds = location.state?.completedTasks || [];

  // Initialize subtasks with proper structure
  const [subtasks, setSubtasks] = useState(
    subtasksFromState.map((subtask: any, index: number) => {
      const id = index + 1;
      return {
        id,
        text: subtask.text || subtask.step || subtask.title || "",
        description: subtask.description || subtask.details || "",
        checked: completedTaskIds.includes(id),
        time_estimate: subtask.time_estimate_minutes || subtask.time_estimate || subtask.duration || 15
      };
    })
  );

  const [isExpanded, setIsExpanded] = useState(true);
  const [mainTaskChecked, setMainTaskChecked] = useState(false);

  // Update subtasks when location state changes
  useEffect(() => {
    const completed = location.state?.completedTasks || [];
    setSubtasks(
      subtasksFromState.map((subtask: any, index: number) => {
        const id = index + 1;
        return {
          id,
          text: subtask.text || subtask.step || subtask.title || "",
          description: subtask.description || subtask.details || "",
          checked: completed.includes(id),
          time_estimate: subtask.time_estimate_minutes || subtask.time_estimate || subtask.duration || 15
        };
      })
    );
    setMainTaskChecked(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key]);

  // Check if all subtasks are completed
  useEffect(() => {
    if (subtasks.length > 0) {
      const allChecked = subtasks.every(st => st.checked);
      setMainTaskChecked(allChecked);
    }
  }, [subtasks]);

  const handleSubtaskClick = (subtaskId: number, subtaskText: string) => {
    const completedCount = subtasks.filter(st => st.checked).length;
    const timeEstimate = subtasks.find(st => st.id === subtaskId)?.time_estimate || 15;
    
    console.log(`Starting subtask ${subtaskId}: "${subtaskText}" with time estimate: ${timeEstimate}m`);
    
    navigate("/timer", {
      state: {
        subtaskId,
        subtaskText,
        taskName: task,
        currentTaskIndex: subtaskId,
        totalTasks: subtasks.length,
        completedTasks: subtasks.filter(st => st.checked).map(st => st.id),
        time_estimate: timeEstimate,
        subtasks: subtasksFromState
      }
    });
  };

  const handleCheckboxToggle = (subtaskId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    setSubtasks(prev => 
      prev.map(st => 
        st.id === subtaskId 
          ? { ...st, checked: !st.checked } 
          : st
      )
    );
  };

  const handleMainCheckboxToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    const newState = !mainTaskChecked;
    setMainTaskChecked(newState);
    setSubtasks(prev => prev.map(st => ({ ...st, checked: newState })));
  };

  const formatTaskTitle = (text: string) =>
    text.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");

  const completedCount = subtasks.filter(st => st.checked).length;
  const totalCount = subtasks.length;

  return (
    <div className="min-h-screen bg-[#ececec] flex flex-col">
      <Navbar />

      <div className="flex flex-1 flex-row items-center justify-center gap-20 px-6 py-8">
        {/* Dino image */}
        <div className="w-full max-w-[400px] md:max-w-[400px] flex-shrink-0 hidden md:flex">
          <img 
            alt="Focusaurus dinosaur mascot" 
            className="w-full h-auto object-contain" 
            src={imgAdobeExpressFile3} 
          />
        </div>

        {/* Task panel */}
        <div className="flex flex-col gap-5 w-full max-w-[540px] h-full">
          <div className="flex flex-col gap-2">
            <p className="font-['Inter:Regular',sans-serif] text-[2.7rem] text-black leading-snug">
              You have these tasks to do!
            </p>
            {totalCount > 0 && (
              <p className="font-['Inter:Regular',sans-serif] text-[1rem] text-gray-600">
                {completedCount} of {totalCount} completed
              </p>
            )}
          </div>

          {/* Main task row */}
          <div className="bg-[#d9d9d9] rounded-[12px] px-4 py-4 flex items-center justify-between gap-3 flex-shrink-0">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div onClick={handleMainCheckboxToggle}>
                <TaskCheckbox checked={mainTaskChecked} />
              </div>
              <p className="font-['Inter:Regular',sans-serif] text-[1.3rem] text-black truncate">
                {formatTaskTitle(task)}
              </p>
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="bg-transparent border-none cursor-pointer transition-transform flex-shrink-0 p-1 hover:opacity-70"
              style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }}
              aria-label={isExpanded ? "Collapse tasks" : "Expand tasks"}
            >
              <svg width="22" height="20" fill="none" viewBox="0 0 22.8461 20.3697">
                <path d={svgPaths.p3b0b9e00} fill="black" />
              </svg>
            </button>
          </div>

          {/* Subtasks - Scrollable container */}
          {isExpanded && (
            <div className="flex flex-col gap-0 overflow-hidden flex-1 min-h-0">
              <div className="overflow-y-auto flex-1 pr-2">
                {subtasks.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    {subtasks.map(subtask => (
                      <SubTask
                        key={subtask.id}
                        id={subtask.id}
                        text={subtask.text}
                        description={subtask.description}
                        checked={subtask.checked}
                        timeEstimate={subtask.time_estimate}
                        onClick={() => handleSubtaskClick(subtask.id, subtask.text)}
                        onCheckboxClick={(e) => handleCheckboxToggle(subtask.id, e)}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="font-['Inter:Regular',sans-serif] text-[1rem] text-gray-500">
                    No subtasks available.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Done button */}
          <button
            onClick={() => navigate("/wrap-up")}
            className="bg-[#a2b5a1] hover:bg-[#92a591] active:bg-[#82956a] transition-colors rounded-[15px] py-3 w-full font-['Inter:Regular',sans-serif] text-[1.3rem] text-black cursor-pointer border-none flex-shrink-0"
          >
            Done
          </button>
        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style>{`
        div::-webkit-scrollbar {
          width: 6px;
        }
        div::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        div::-webkit-scrollbar-thumb {
          background: #a2b5a1;
          border-radius: 10px;
        }
        div::-webkit-scrollbar-thumb:hover {
          background: #92a591;
        }
      `}</style>
    </div>
  );
}