import { useEffect, useState } from "react";
import imgWqqqeq1 from "../../assets/53994a320a9700f7e517589802cc39c0ba2c3ebd.png";
import Navbar from "../components/Navbar";

interface ReportData {
  total_focus_minutes: number;
  total_distractions: number;
  focus_score: number;
  medication_considerations: string;
  suggestions: string[];
  personalized_recommendation: string;
}

export default function ReportPage() {
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/report")
      .then((res) => res.json())
      .then((data) => {
        console.log("Report data:", data); // helpful debugging
        setReport(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch report:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#ececec] flex flex-col">
      <Navbar />

      <div className="flex flex-1 flex-row items-center justify-center gap-10 px-6 py-0 -mt-8">

        {/* Left dinosaur */}
        <div className="w-full max-w-[400px] flex-shrink-0">
          <img
            alt="Dinosaur with business attire"
            className="w-full h-auto object-contain"
            src={imgWqqqeq1}
          />
        </div>

        {/* Right report card */}
        <div className="bg-[#a2b5a1] rounded-[20px] w-full max-w-[560px] px-10 py-10 flex flex-col gap-6">

          <h1 className="font-bold text-[2rem] sm:text-[2.5rem] text-black">
            Rawr... here is your daily report!
          </h1>

          {loading && (
            <p className="text-black opacity-70">Generating report...</p>
          )}

          {report && (
            <div className="flex flex-col gap-4">

              {/* Focus Minutes */}
              <div className="bg-white/40 rounded-[12px] p-4">
                <p className="text-sm opacity-70">Total Focus Minutes</p>
                <p className="text-2xl font-bold">{report.total_focus_minutes} min</p>
              </div>

              {/* Distractions */}
              <div className="bg-white/40 rounded-[12px] p-4">
                <p className="text-sm opacity-70">Total Distractions</p>
                <p className="text-2xl font-bold">{report.total_distractions}</p>
              </div>

              {/* Focus Score */}
              <div className="bg-white/40 rounded-[12px] p-4">
                <p className="text-sm opacity-70">Focus Score</p>
                <p className="text-2xl font-bold">{report.focus_score} / 100</p>
              </div>

              {/* Medication Considerations */}
              <div className="bg-white/40 rounded-[12px] p-4">
                <p className="text-sm opacity-70 mb-1">Medication Considerations</p>
                <p>{report.medication_considerations}</p>
              </div>

              {/* Suggestions */}
              <div className="bg-white/40 rounded-[12px] p-4">
                <p className="text-sm opacity-70 mb-1">Suggestions</p>
                <ul className="list-disc pl-5 space-y-1">
                  {(report.suggestions || []).map((s, index) => (
                    <li key={index}>{s}</li>
                  ))}
                </ul>
              </div>

              {/* Personalized Recommendation */}
              <div className="bg-white/40 rounded-[12px] p-4">
                <p className="text-sm opacity-70 mb-1">
                  Personalized Recommendation
                </p>
                <p>{report.personalized_recommendation}</p>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}