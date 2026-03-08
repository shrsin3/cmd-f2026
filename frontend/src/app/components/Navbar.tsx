import { useNavigate } from "react-router";
import logo from "../../assets/logo.png";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="w-full flex items-center justify-between px-10 py-10 bg-[#ececec]">
      <div className="flex items-center gap-3">
        <img src={logo} alt="Focusaurus logo" className="w-[70px] h-auto" />
        <span className="font-['General_Sans:Semibold_Italic',sans-serif] text-[1.6rem] text-black">
          focusaurus
        </span>
      </div>
      <div className="flex items-center gap-10 flex-wrap">
        <button
          onClick={() => navigate("/home")}
          className="font-['General_Sans:Regular',sans-serif] text-[20px] text-black bg-transparent border-none cursor-pointer hover:underline whitespace-nowrap"
        >
          Home
        </button>
        <button
          onClick={() => navigate("/tasks")}
          className="font-['General_Sans:Regular',sans-serif] text-[20px] text-black bg-transparent border-none cursor-pointer hover:underline whitespace-nowrap"
        >
          Tasks
        </button>
        <span className="font-['General_Sans:Regular',sans-serif] text-[20px] text-black whitespace-nowrap cursor-default">
          Account
        </span>
        <span className="font-['General_Sans:Regular',sans-serif] text-[20px] text-black whitespace-nowrap cursor-default">
          Collection
        </span>
        <button
          onClick={() => navigate("/")}
          className="font-['General_Sans:Regular',sans-serif] text-[20px] text-black bg-transparent border-none cursor-pointer hover:underline whitespace-nowrap"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}