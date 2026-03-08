import { useLocation, useNavigate } from "react-router";
import svgPaths from "../../imports/svg-hwtan6z5oq";
import imgImage6 from "../../assets/f4b706c48441ef103a6ac4398005f60100457692.png";
import imgAdobeExpressFile3 from "../../assets/4ecbf1117d8120f8709d5f23417aad21bf2696d7.png";
import Navbar from "../components/Navbar";

export default function WrapUpPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { subtaskId, taskName, currentTaskIndex, totalTasks, completedTasks } = location.state || {};

  const handleNextTasks = () => {
    navigate("/tasks", {
      state: {
        task: taskName,
        completedSubtaskId: subtaskId,
        completedTasks: [...(completedTasks || []), subtaskId]
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#ececec] flex flex-col">
      <Navbar />

      <div className="flex flex-1 flex-row items-center justify-center gap-20 px-6 py-0 -mt-8">

        {/* Left: congratulations content */}
        <div className="flex flex-col gap-10 w-full max-w-[500px]">
          <h1 className="font-['Inter:Bold',sans-serif] font-bold text-[3rem] text-black">
            Congratulations!
          </h1>

          <div className="w-[300px] h-[200px]">
            <img alt="Party popper emoji" className="w-full h-full object-contain" src={imgImage6} />
          </div>

          <p className="font-['Inter:Regular',sans-serif] text-[2.1rem] text-black -ml-10">
            You have completed one task
          </p>

          <button
            onClick={handleNextTasks}
            className="bg-[#a2b5a1] hover:bg-[#92a591] transition-colors rounded-[20px] py-3 px-14 w-fit font-['Inter:Regular',sans-serif] text-[1.5rem] text-black cursor-pointer border-none ml-15"
          >
            Next Tasks
          </button>
        </div>

        {/* Right: progress + dino */}

<div className="flex flex-col items-start gap-2 w-[340px] flex-shrink-0 -mt-16 -ml-10">
  {/* Progress bar */}
  <div className="w-full bg-white border-[3px] border-black h-[36px] overflow-hidden rounded-sm">
    <div className="bg-[#54a654] h-full w-[67%]" />
  </div>
  {/* Fire + counter */}
  <div className="flex items-center gap-2 self-start">
    <svg className="w-[30px] h-[34px]" fill="none" viewBox="0 0 34.6 38.95">
      <path clipRule="evenodd" d={svgPaths.p24e41080} fill="#EB5757" fillRule="evenodd" />
      <path clipRule="evenodd" d={svgPaths.p102a8fe0} fill="#F2C94C" fillRule="evenodd" />
    </svg>
    <span className="font-['Inter:Regular',sans-serif] text-[1.4rem] text-black">
      2/{totalTasks || 3}
    </span>
  </div>
  {/* Dino */}
  <img alt="Focusaurus dinosaur mascot" className="w-full h-auto object-contain" src={imgAdobeExpressFile3} />
</div>

      </div>
    </div>
  );
}