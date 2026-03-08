import svgPaths from "./svg-3jpol6rxuy";
import imgGeminiGeneratedImageYmtf8Oymtf8Oymtf2 from "../../assets/257c2ab0b207a7ebe996b7cc56f7180563bf9ce7.png";

function EmailBotton({ className }: { className?: string }) {
  return (
    <div className={className || "absolute bg-[#f5f5f5] border border-black border-solid h-[54px] left-[498px] rounded-[9px] top-[274px] w-[296px]"} data-name="email botton">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-none left-[14px] not-italic text-[16px] text-black top-[18px] whitespace-nowrap">Username/Email</p>
    </div>
  );
}

function PasswordBotton({ className }: { className?: string }) {
  return (
    <div className={className || "absolute bg-[#f5f5f5] gap-x-[10px] gap-y-[10px] grid grid-cols-[repeat(1,minmax(0,1fr))] grid-rows-[repeat(1,minmax(0,1fr))] h-[54px] left-[498px] px-[15px] py-[19px] rounded-[9px] top-[362px] w-[296px]"} data-name="password botton">
      <div aria-hidden="true" className="absolute border border-black border-solid inset-0 pointer-events-none rounded-[9px]" />
      <p className="col-1 font-['Inter:Regular',sans-serif] font-normal justify-self-start leading-none not-italic relative row-1 self-start shrink-0 text-[16px] text-black whitespace-nowrap">Password</p>
    </div>
  );
}

function LoginBotton({ className }: { className?: string }) {
  return (
    <div className={className || "absolute bg-[#1e1e1e] content-stretch flex h-[53px] items-center justify-center left-[498px] px-[129px] py-[16px] rounded-[9px] top-[508px] w-[296px]"} data-name="login botton">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-none not-italic relative shrink-0 text-[16px] text-white whitespace-nowrap">Login</p>
    </div>
  );
}

function AntDesignGoogleCircleFilled({ className }: { className?: string }) {
  return (
    <div className={className || "absolute left-[551px] size-[45px] top-[610px]"} data-name="ant-design:google-circle-filled">
      <div className="absolute inset-[6.25%]" data-name="Vector">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 39.375 39.375">
          <path d={svgPaths.p3a4eacf0} fill="var(--fill-0, black)" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function IcRoundApple({ className }: { className?: string }) {
  return (
    <div className={className || "absolute left-[623px] size-[45px] top-[610px]"} data-name="ic:round-apple">
      <div className="absolute inset-[12.5%_18.42%_12.49%_18.39%]" data-name="Vector">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28.4383 33.7543">
          <path d={svgPaths.p2ac53600} fill="var(--fill-0, black)" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function IcBaselineFacebook({ className }: { className?: string }) {
  return (
    <div className={className || "absolute left-[695px] size-[45px] top-[610px]"} data-name="ic:baseline-facebook">
      <div className="absolute inset-[8.33%_8.33%_8.54%_8.33%]" data-name="Vector">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 37.5 37.4062">
          <path d={svgPaths.p1dae6c00} fill="var(--fill-0, black)" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <div className="bg-[#ececec] relative size-full" data-name="login">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute bg-[#a2b5a1] h-[546px] left-[calc(50%-0.5px)] rounded-[20px] top-1/2 w-[441px]" />
      <EmailBotton />
      <PasswordBotton />
      <LoginBotton />
      <AntDesignGoogleCircleFilled />
      <IcRoundApple />
      <IcBaselineFacebook />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[18px] leading-none left-[661px] not-italic text-[16px] text-black top-[430px] w-[133px]">forgot password?</p>
      <p className="absolute font-['Hiragino_Kaku_Gothic_StdN:W8',sans-serif] leading-[normal] left-[490px] not-italic text-[35px] text-black top-[179px] whitespace-nowrap">Welcome back!</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-none left-[498px] not-italic text-[16px] text-black top-[575px] whitespace-pre">{`Dont’t have an account?  Continue with`}</p>
      <p className="absolute font-['General_Sans:Semibold_Italic',sans-serif] leading-[normal] left-[calc(50%-584px)] not-italic text-[30.863px] text-black top-[28px] whitespace-nowrap">focusaurus</p>
      <div className="absolute h-[210px] left-[311px] top-[527px] w-[155px]" data-name="Gemini_Generated_Image_ymtf8oymtf8oymtf 2">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgGeminiGeneratedImageYmtf8Oymtf8Oymtf2} />
      </div>
    </div>
  );
}