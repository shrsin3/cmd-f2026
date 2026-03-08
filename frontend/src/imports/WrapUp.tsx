import svgPaths from "./svg-hwtan6z5oq";
import imgImage6 from "../../assets/f4b706c48441ef103a6ac4398005f60100457692.png";
import imgAdobeExpressFile3 from "../../assets/4ecbf1117d8120f8709d5f23417aad21bf2696d7.png";

function Frame() {
  return (
    <div className="bg-[#a2b5a1] h-[63px] overflow-clip relative rounded-[20px] shrink-0 w-full">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[calc(50%-104.5px)] not-italic text-[40px] text-black top-[calc(50%-24.5px)] w-[209px]">Next Tasks</p>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[353px]">
      <Frame />
    </div>
  );
}

function Frame1() {
  return (
    <div className="bg-white h-[63px] overflow-clip relative rounded-[20px] shrink-0 w-[353px]">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[calc(50%-116.5px)] not-italic text-[40px] text-black top-[calc(50%-24.5px)] w-[259px]">Take a Break</p>
    </div>
  );
}

function Frame3() {
  return (
    <div className="-translate-x-1/2 absolute content-stretch flex gap-[77px] items-center left-[calc(50%-0.5px)] top-[636px]">
      <Frame2 />
      <Frame1 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="absolute bg-white border-5 border-black border-solid h-[43px] left-[703px] overflow-clip top-[178px] w-[422px]">
      <div className="absolute bg-[#54a654] h-[33px] left-0 top-0 w-[81px]" />
      <div className="absolute bg-[#448c44] h-[33px] left-[81px] top-0 w-[81px]" />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute inset-[27.64%_41.44%_67.67%_55.86%]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 34.6 38.95">
        <g id="Group">
          <path clipRule="evenodd" d={svgPaths.p24e41080} fill="var(--fill-0, #EB5757)" fillRule="evenodd" id="Vector" />
          <path clipRule="evenodd" d={svgPaths.p102a8fe0} fill="var(--fill-0, #F2C94C)" fillRule="evenodd" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

export default function WrapUp() {
  return (
    <div className="bg-[#ececec] relative size-full" data-name="wrap-up">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold h-[69px] leading-[normal] left-[179px] not-italic text-[50px] text-black top-[158px] w-[461px]">Congratulations!</p>
      <div className="absolute left-[313px] size-[144px] top-[278px]" data-name="image 6">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage6} />
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[58px] leading-[normal] left-[124px] not-italic text-[40px] text-black top-[486px] w-[599px]">You have completed one task</p>
      <Frame3 />
      <Frame4 />
      <Group />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[39px] leading-[normal] left-[766px] not-italic text-[30px] text-black top-[233px] w-[58px]">2/5</p>
      <div className="absolute flex h-[326px] items-center justify-center left-[823px] top-[253px] w-[274px]">
        <div className="-scale-y-100 flex-none rotate-180">
          <div className="h-[326px] relative w-[274px]" data-name="Adobe Express - file 3">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgAdobeExpressFile3} />
          </div>
        </div>
      </div>
      <div className="absolute bg-[#54a654] h-[28px] left-[732px] rounded-[36px] top-[36px] w-[69px]" />
      <p className="absolute font-['General_Sans:Regular',sans-serif] leading-[normal] left-[744px] not-italic text-[17.019px] text-black top-[38px] whitespace-nowrap">Home</p>
      <p className="absolute font-['General_Sans:Regular',sans-serif] leading-[normal] left-[815px] not-italic text-[17.019px] text-black top-[38px] whitespace-nowrap">[To-do list]</p>
      <p className="absolute font-['General_Sans:Regular',sans-serif] leading-[normal] left-[922px] not-italic text-[17.019px] text-black top-[38px] whitespace-nowrap">[Dino collection]</p>
      <p className="absolute font-['General_Sans:Regular',sans-serif] leading-[normal] left-[1070px] not-italic text-[17.019px] text-black top-[38px] whitespace-nowrap">[Timer]</p>
      <p className="absolute font-['General_Sans:Regular',sans-serif] leading-[normal] left-[1150px] not-italic text-[17.019px] text-black top-[38px] whitespace-nowrap">Account</p>
    </div>
  );
}