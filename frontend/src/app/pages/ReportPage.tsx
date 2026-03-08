import { useNavigate } from "react-router";
import imgWqqqeq1 from "../../assets/53994a320a9700f7e517589802cc39c0ba2c3ebd.png";
import imgAdobeExpressFile4 from "../../assets/4ecbf1117d8120f8709d5f23417aad21bf2696d7.png";
import Navbar from "../components/Navbar";

export default function ReportPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#ececec] flex flex-col">
      <Navbar />

      <div className="flex flex-1 flex-row items-center justify-center gap-10 px-6 py-0 -mt-8">

        {/* Left: dinos - same size/position as other pages */}
        <div className="w-full max-w-[400px] flex-shrink-0">
          <img alt="Dinosaur with business attire" className="w-full h-auto object-contain" src={imgWqqqeq1} />
        </div>

        {/* Right: report card */}
        <div className="bg-[#a2b5a1] rounded-[20px] w-full max-w-[560px] px-10 py-10 flex flex-col gap-6">
          <h1 className="font-['Inter:Bold',sans-serif] font-bold text-[2rem] sm:text-[2.5rem] text-black leading-snug">
            Rawr... here is your daily report!
          </h1>

          <div className="flex flex-col gap-4">
            <div className="bg-white/40 rounded-[12px] p-4">
              <p className="font-['Inter:Regular',sans-serif] text-[1rem] text-black opacity-70">Tasks completed</p>
              <p className="font-['Inter:Regular',sans-serif] text-[2rem] text-black font-bold">3 / 3</p>
            </div>
            <div className="bg-white/40 rounded-[12px] p-4">
              <p className="font-['Inter:Regular',sans-serif] text-[1rem] text-black opacity-70">Focus time</p>
              <p className="font-['Inter:Regular',sans-serif] text-[2rem] text-black font-bold">48 min</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}