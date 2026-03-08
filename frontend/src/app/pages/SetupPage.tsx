import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import svgPaths from "../../imports/svg-7vlb14pvc9";
import imgImg35381 from "../../assets/bfa4c9b7ceb790fca3313839f0f094f479b64a6e.png";
import imgAdobeExpressFile3 from "../../assets/4ecbf1117d8120f8709d5f23417aad21bf2696d7.png";
import imgImg35361 from "../../assets/cacad74f23f7ccbaa337741e46da970a869f8e6b.png";

export default function SetupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [selectedDino, setSelectedDino] = useState<string | null>(null);

  // New state for file upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [uploadMessage, setUploadMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);  // Reference to hidden file input

  const handleSubmit = () => {
    if (selectedActivity && selectedDino) {
      localStorage.setItem("setupCompleted", "true");
      localStorage.setItem("selectedActivity", selectedActivity);
      localStorage.setItem("selectedDino", selectedDino);
      if (name) localStorage.setItem("userName", name);
      navigate("/home");
    }
  };

  // Handle clicking the upload area
  const handleUploadClick = () => {
    fileInputRef.current?.click();  // Trigger the hidden file input
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type (match backend allowed extensions)
    const allowedTypes = ['text/plain', 'application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setUploadStatus("error");
      setUploadMessage("Invalid file type. Please upload a TXT, PDF, PNG, JPG, or JPEG file.");
      return;
    }

    // Validate file size (e.g., max 10MB as per backend)
    if (file.size > 10 * 1024 * 1024) {
      setUploadStatus("error");
      setUploadMessage("File too large. Maximum size is 10MB.");
      return;
    }

    setSelectedFile(file);
    setUploadStatus("uploading");
    setUploadMessage("Uploading...");

    // Prepare form data for upload
    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_id", name || `user_${Date.now()}`);  // Use name or generate ID

    try {
      const response = await fetch("http://localhost:5000/api/prescription/upload-file", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setUploadStatus("success");
        setUploadMessage(`Uploaded successfully: ${file.name}`);
        // Optionally store prescription data in localStorage or state
        localStorage.setItem("prescriptionUploaded", "true");
      } else {
        setUploadStatus("error");
        setUploadMessage(result.message || "Upload failed.");
      }
    } catch (error) {
      setUploadStatus("error");
      setUploadMessage("Network error. Please try again.");
    }
  };

  const activities = [
    { id: "studying", label: "Studying" },
    { id: "reading", label: "Reading" },
    { id: "exam-prep", label: "Exam Prep" },
  ];

  const dinos = [
    { id: "topsy", label: "Topsy", img: imgImg35361, alt: "Topsy dinosaur" },
    { id: "steggy", label: "Steggy", img: imgImg35381, alt: "Steggy dinosaur" },
    { id: "compy", label: "Compy", img: imgAdobeExpressFile3, alt: "Compy dinosaur" },
  ];

  return (
    <div className="min-h-screen bg-[#ececec] flex flex-col px-15 py-18">


<div className="flex flex-col gap-10 w-full px-4">

        {/* Name input */}
        <section className="flex flex-col gap-4">
          <h2 className="font-['Inter:Regular',sans-serif] text-[1.6rem] text-black">
            What is your name?
          </h2>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="bg-white rounded-[20px] px-6 py-4 font-['Inter:Regular',sans-serif] text-[1.2rem] text-black outline-none border-none w-full max-w-[400px]"
          />
        </section>

        {/* Activity selection */}
        <section className="flex flex-col gap-4">
          <h2 className="font-['Inter:Regular',sans-serif] text-[1.6rem] text-black">
            What can Dino help you with?
          </h2>
          <div className="flex flex-wrap gap-4">
            {activities.map((act) => (
              <button
                key={act.id}
                onClick={() => setSelectedActivity(act.id)}
                className={`flex-1 min-w-[160px] rounded-[20px] py-4 font-['Inter:Regular',sans-serif] text-[1.5rem] text-black border-none cursor-pointer transition-colors ${
                  selectedActivity === act.id ? "bg-[#a2b5a1]" : "bg-white hover:bg-gray-100"
                }`}
              >
                {act.label}
              </button>
            ))}
          </div>
        </section>

        {/* Dino selection */}
        <section className="flex flex-col gap-4">
          <h2 className="font-['Inter:Regular',sans-serif] text-[1.6rem] text-black">
            Pick your Dino
          </h2>
          <div className="flex flex-wrap gap-5">
            {dinos.map((dino) => (
              <button
                key={dino.id}
                onClick={() => setSelectedDino(dino.id)}
                className={`flex-1 min-w-[160px] rounded-[20px] py-4 px-4 border-none cursor-pointer transition-colors flex flex-col items-center gap-2 ${
                  selectedDino === dino.id ? "bg-[#a2b5a1]" : "bg-white hover:bg-gray-100"
                }`}
              >
                <img alt={dino.alt} className="w-[100px] h-[100px] object-contain" src={dino.img} />
                <p className="font-['Inter:Regular',sans-serif] text-[1.2rem] text-black">{dino.label}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Upload prescription */}
        <section className="flex flex-col gap-4">
          <h2 className="font-['Inter:Regular',sans-serif] text-[1.6rem] text-black">
            Upload your prescription
          </h2>
          <div
            onClick={handleUploadClick}
            className="bg-white rounded-[20px] p-8 flex flex-col items-center justify-center gap-4 min-h-[160px] cursor-pointer hover:bg-gray-50 transition-colors border-2 border-dashed border-gray-300"
          >
            <svg className="w-[60px] h-[60px]" fill="none" viewBox="0 0 91.3333 91.3333">
              <path d={svgPaths.p135f3200} fill="black" />
            </svg>
            <p className="font-['Inter:Regular',sans-serif] text-[1rem] text-gray-500">
              {uploadStatus === "uploading" ? "Uploading..." : uploadStatus === "success" ? "Uploaded!" : "Click to upload"}
            </p>
            {uploadMessage && (
              <p className={`font-['Inter:Regular',sans-serif] text-[0.9rem] ${uploadStatus === "error" ? "text-red-500" : "text-green-500"}`}>
                {uploadMessage}
              </p>
            )}
          </div>
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.pdf,.png,.jpg,.jpeg"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </section>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!selectedActivity || !selectedDino}
          className={`self-end px-10 py-4 rounded-[15px] font-['Inter:Regular',sans-serif] text-[1.3rem] text-black border-none cursor-pointer transition-colors ${
            selectedActivity && selectedDino
              ? "bg-[#75977d] hover:bg-[#658a6d]"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          Submit
        </button>

      </div>
    </div>
  );
}