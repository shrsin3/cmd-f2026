import imgAdobeExpressFile2 from "../../assets/4ecbf1117d8120f8709d5f23417aad21bf2696d7.png";

function Frame() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px relative" data-name="Frame">
      <p className="font-['SF_Pro:Regular',sans-serif] relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        􀊫
      </p>
      <p className="font-['SF_Pro:Regular_Italic',sans-serif] italic relative shrink-0" style={{ fontVariationSettings: "'YAXS' 400" }}>
        Insert your today’s tasks
      </p>
    </div>
  );
}

function SidebarSearchField() {
  return (
    <div className="absolute content-stretch flex items-center left-[562px] rounded-[100px] top-[459px] w-[552px]" data-name="Sidebar Search Field">
      <div className="bg-[rgba(120,120,128,0.16)] flex-[1_0_0] min-h-px min-w-px relative rounded-[100px]" data-name="Search Field">
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex font-normal items-center leading-[22px] p-[11px] relative text-[#727272] text-[17px] tracking-[-0.08px] w-full whitespace-nowrap">
            <Frame />
            <p className="font-['SF_Pro:Regular',sans-serif] relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
              􀊱
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MacBookAir() {
  return (
    <div className="bg-[#ececec] relative size-full" data-name="MacBook Air - 1">
      <div className="absolute bg-[#54a654] h-[28px] left-[726px] rounded-[36px] top-[36px] w-[69px]" />
      <div className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[559px] not-italic text-[42.905px] text-black top-[323px] whitespace-nowrap">
        <p className="mb-0">Hi [user],</p>
        <p>What is your plan for today?</p>
      </div>
      <p className="absolute font-['General_Sans:Semibold_Italic',sans-serif] leading-[normal] left-[calc(50%-584px)] not-italic text-[30.863px] text-black top-[28px] whitespace-nowrap">focusaurus</p>
      <div className="absolute h-[447px] left-[136px] top-[204px] w-[376px]" data-name="Adobe Express - file 2">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgAdobeExpressFile2} />
      </div>
      <p className="absolute font-['General_Sans:Regular',sans-serif] leading-[normal] left-[738px] not-italic text-[17.019px] text-black top-[38px] whitespace-nowrap">Home</p>
      <div className="absolute bg-[#54a654] h-[28px] left-[564px] rounded-[15px] top-[532px] w-[80px]" />
      <p className="absolute font-['General_Sans:Regular',sans-serif] leading-[normal] left-[576px] not-italic text-[17.019px] text-black top-[534px] whitespace-nowrap">Submit</p>
      <p className="absolute font-['General_Sans:Regular',sans-serif] leading-[normal] left-[809px] not-italic text-[17.019px] text-black top-[38px] whitespace-nowrap">[To-do list]</p>
      <p className="absolute font-['General_Sans:Regular',sans-serif] leading-[normal] left-[916px] not-italic text-[17.019px] text-black top-[38px] whitespace-nowrap">[Dino collection]</p>
      <p className="absolute font-['General_Sans:Regular',sans-serif] leading-[normal] left-[1064px] not-italic text-[17.019px] text-black top-[38px] whitespace-nowrap">[Timer]</p>
      <p className="absolute font-['General_Sans:Regular',sans-serif] leading-[normal] left-[1144px] not-italic text-[17.019px] text-black top-[38px] whitespace-nowrap">Account</p>
      <SidebarSearchField />
    </div>
  );
}