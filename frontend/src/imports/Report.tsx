import imgWqqqeq1 from "../../assets/53994a320a9700f7e517589802cc39c0ba2c3ebd.png";
import imgAdobeExpressFile4 from "../../assets/4ecbf1117d8120f8709d5f23417aad21bf2696d7.png";

export default function Report() {
  return (
    <div className="bg-[#ececec] relative size-full" data-name="report">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold h-[156px] leading-[normal] left-[106px] not-italic text-[50px] text-black top-[158px] w-[781px]">Rawr... here is your daily report!</p>
      <div className="absolute h-[434px] left-[176px] top-[264px] w-[321px]" data-name="wqqqeq 1">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgWqqqeq1} />
      </div>
      <div className="absolute h-[202px] left-[21px] top-[236px] w-[170px]" data-name="Adobe Express - file 4">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgAdobeExpressFile4} />
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute bg-[#a2b5a1] h-[525px] left-[calc(50%+246.5px)] rounded-[20px] top-[calc(50%+85.5px)] w-[615px]" />
      <div className="absolute bg-[#54a654] h-[28px] left-[711px] rounded-[36px] top-[41px] w-[69px]" />
      <p className="absolute font-['General_Sans:Regular',sans-serif] leading-[normal] left-[723px] not-italic text-[17.019px] text-black top-[43px] whitespace-nowrap">Home</p>
      <p className="absolute font-['General_Sans:Regular',sans-serif] leading-[normal] left-[794px] not-italic text-[17.019px] text-black top-[43px] whitespace-nowrap">[To-do list]</p>
      <p className="absolute font-['General_Sans:Regular',sans-serif] leading-[normal] left-[901px] not-italic text-[17.019px] text-black top-[43px] whitespace-nowrap">[Dino collection]</p>
      <p className="absolute font-['General_Sans:Regular',sans-serif] leading-[normal] left-[1049px] not-italic text-[17.019px] text-black top-[43px] whitespace-nowrap">[Timer]</p>
      <p className="absolute font-['General_Sans:Regular',sans-serif] leading-[normal] left-[1129px] not-italic text-[17.019px] text-black top-[43px] whitespace-nowrap">Account</p>
    </div>
  );
}