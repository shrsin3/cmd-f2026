import { useNavigate, useLocation } from "react-router";
import logo from "../../assets/logo.png";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const navBtn = (label: string, path: string) => (
    <button
      onClick={() => navigate(path)}
      className={`font-['General_Sans:Regular',sans-serif] text-[20px] bg-transparent border-none cursor-pointer whitespace-nowrap ${
        location.pathname === path
          ? "text-black font-bold underline"
          : "text-black hover:underline"
      }`}
    >
      {label}
    </button>
  );

  return (
    <nav className="w-full flex items-center justify-between px-10 py-10 bg-[#ececec] relative z-50">
      <div className="flex items-center gap-3">
        <img src={logo} alt="Focusaurus logo" className="w-[70px] h-auto" />
        <span className="font-['General_Sans:Semibold_Italic',sans-serif] text-[1.6rem] text-black">
          focusaurus
        </span>
      </div>
      <div className="flex items-center gap-10 flex-wrap">
        {navBtn("Home", "/home")}
        {navBtn("Tasks", "/tasks")}
        {navBtn("Logout", "/")}
      </div>
    </nav>
  );
}