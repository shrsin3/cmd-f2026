import svgPaths from "./svg-shhkcqo5p2";
import imgAdobeExpressFile2 from "../../assets/4ecbf1117d8120f8709d5f23417aad21bf2696d7.png";

function Frame() {
  return (
    <div className="absolute bg-[#e9e9ea] h-[87px] left-0 overflow-clip rounded-[20px] top-0 w-[256px]">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[45px] justify-center leading-[0] left-[128px] not-italic text-[50px] text-black text-center top-[43.5px] w-[146px]">
        <p className="leading-[normal]">Stop</p>
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="absolute bg-[#e9e9ea] h-[87px] left-[302px] overflow-clip rounded-[20px] top-0 w-[256px]">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[45px] justify-center leading-[0] left-[128px] not-italic text-[50px] text-black text-center top-[43.5px] w-[146px]">
        <p className="leading-[normal]">Finish</p>
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="absolute h-[87px] left-[174px] top-[559px] w-[558px]">
      <Frame />
      <Frame2 />
    </div>
  );
}

function Frame1() {
  return (
    <div className="absolute bg-white border-5 border-black border-solid h-[43px] left-[685px] overflow-clip top-[200px] w-[422px]">
      <div className="absolute bg-[#54a654] h-[33px] left-0 top-0 w-[81px]" />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute inset-[30.29%_42.84%_65.03%_54.45%]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 34.6 38.95">
        <g id="Group">
          <path clipRule="evenodd" d={svgPaths.p24e41080} fill="var(--fill-0, #EB5757)" fillRule="evenodd" id="Vector" />
          <path clipRule="evenodd" d={svgPaths.p102a8fe0} fill="var(--fill-0, #F2C94C)" fillRule="evenodd" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

export default function Timer() {
  return (
    <div className="bg-[#ececec] relative size-full" data-name="Timer">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute bg-[#a2b5a1] h-[600px] left-1/2 rounded-[20px] top-1/2 w-[1068px]" />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[39px] leading-[normal] left-[147px] not-italic text-[40px] text-black top-[166px] w-[431px]">You need to lock in for</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[120px] leading-[normal] left-[269px] not-italic text-[150px] text-black top-[calc(50%-113px)] w-[368px]">16:15</p>
      <Frame3 />
      <Frame1 />
      <Group />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[39px] leading-[normal] left-[748px] not-italic text-[30px] text-black top-[255px] w-[58px]">1/5</p>
      <div className="absolute flex h-[326px] items-center justify-center left-[786px] top-[286px] w-[274px]">
        <div className="-scale-y-100 flex-none rotate-180">
          <div className="h-[326px] relative w-[274px]" data-name="Adobe Express - file 2">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgAdobeExpressFile2} />
          </div>
        </div>
      </div>
      <div className="absolute bg-[#54a654] h-[28px] left-[726px] rounded-[36px] top-[36px] w-[69px]" />
      <p className="absolute font-['General_Sans:Regular',sans-serif] leading-[normal] left-[738px] not-italic text-[17.019px] text-black top-[38px] whitespace-nowrap">Home</p>
      <p className="absolute font-['General_Sans:Regular',sans-serif] leading-[normal] left-[809px] not-italic text-[17.019px] text-black top-[38px] whitespace-nowrap">[To-do list]</p>
      <p className="absolute font-['General_Sans:Regular',sans-serif] leading-[normal] left-[916px] not-italic text-[17.019px] text-black top-[38px] whitespace-nowrap">[Dino collection]</p>
      <p className="absolute font-['General_Sans:Regular',sans-serif] leading-[normal] left-[1064px] not-italic text-[17.019px] text-black top-[38px] whitespace-nowrap">[Timer]</p>
      <p className="absolute font-['General_Sans:Regular',sans-serif] leading-[normal] left-[1144px] not-italic text-[17.019px] text-black top-[38px] whitespace-nowrap">Account</p>
    </div>
  );
}