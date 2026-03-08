import { useState } from "react";
import { useNavigate } from "react-router";
import svgPaths from "../../imports/svg-3jpol6rxuy";
import imgGeminiGeneratedImageYmtf8Oymtf8Oymtf2 from "../../assets/257c2ab0b207a7ebe996b7cc56f7180563bf9ce7.png";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (email && password) {
      const hasCompletedSetup = localStorage.getItem("setupCompleted");
      navigate(hasCompletedSetup ? "/home" : "/setup");
    }
  };

  const handleSocialLogin = () => navigate("/setup");

  return (
    <div className="min-h-screen bg-[#ececec] flex flex-col items-center justify-center px-4 py-10">
      {/* Logo */}
      <p className="font-['General_Sans:Semibold_Italic',sans-serif] text-[1.8rem] text-black mb-8 self-start ml-8">
        focusaurus
      </p>

      <div className="relative w-full max-w-[441px]">
        {/* Card */}
        <div className="bg-[#a2b5a1] rounded-[20px] w-full px-8 py-10 flex flex-col gap-5">
          <h1 className="font-['Hiragino_Kaku_Gothic_StdN:W8',sans-serif] text-[2rem] text-black mb-2">
            Welcome back to Focusaurus!
          </h1>

          {/* Email */}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Username/Email"
            className="w-full bg-[#f5f5f5] border border-black rounded-[9px] px-4 py-4 font-['Inter:Regular',sans-serif] text-[16px] text-black outline-none"
          />

          {/* Password */}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full bg-[#f5f5f5] border border-black rounded-[9px] px-4 py-4 font-['Inter:Regular',sans-serif] text-[16px] text-black outline-none"
          />

          <button
            onClick={() => {}}
            className="self-end font-['Inter:Regular',sans-serif] text-[16px] text-black bg-transparent border-none cursor-pointer hover:underline -mt-2"
          >
            forgot password?
          </button>

          {/* Login button */}
          <button
            onClick={handleLogin}
            className="w-full bg-[#1e1e1e] hover:bg-[#2e2e2e] transition-colors rounded-[9px] py-4 font-['Inter:Regular',sans-serif] text-[16px] text-white cursor-pointer border-none"
          >
            Login
          </button>

          {/* Social login */}
          <p className="font-['Inter:Regular',sans-serif] text-[15px] text-black text-center">
            Don't have an account? Continue with
          </p>
          <div className="flex justify-center gap-6">
            <button onClick={handleSocialLogin} className="size-[45px] cursor-pointer bg-transparent border-none hover:opacity-70 transition-opacity">
              <svg className="size-full" fill="none" viewBox="0 0 39.375 39.375">
                <path d={svgPaths.p3a4eacf0} fill="black" />
              </svg>
            </button>
            <button onClick={handleSocialLogin} className="size-[45px] cursor-pointer bg-transparent border-none hover:opacity-70 transition-opacity p-[5px]">
              <svg className="size-full" fill="none" viewBox="0 0 28.4383 33.7543">
                <path d={svgPaths.p2ac53600} fill="black" />
              </svg>
            </button>
            <button onClick={handleSocialLogin} className="size-[45px] cursor-pointer bg-transparent border-none hover:opacity-70 transition-opacity p-[3px]">
              <svg className="size-full" fill="none" viewBox="0 0 37.5 37.4062">
                <path d={svgPaths.p1dae6c00} fill="black" />
              </svg>
            </button>
          </div>
        </div>

        {/* Decorative dino */}
        <div className="absolute -left-[100px] bottom-[10px] w-[130px] pointer-events-none hidden md:block">
          <img alt="Focusaurus dinosaur mascot" className="w-full h-auto object-contain" src={imgGeminiGeneratedImageYmtf8Oymtf8Oymtf2} />
        </div>
      </div>
    </div>
  );
}