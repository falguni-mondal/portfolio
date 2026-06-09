import React, { useRef } from 'react';
import { Icon } from '@iconify/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const CertificateItem = ({ cert, index, activeIndex, setActiveIndex }) => {
  const itemRef = useRef(null);
  
  // Derive the active state
  const isActive = activeIndex === index;

  useGSAP(() => {
    let mm = gsap.matchMedia();
    
    // Mobile Scroll Active State Trigger
    mm.add("(max-width: 1023px)", () => {
      ScrollTrigger.create({
        trigger: itemRef.current,
        start: "top 55%", // Triggers slightly above the center
        end: "bottom 45%",
        onEnter: () => setActiveIndex(index),
        onEnterBack: () => setActiveIndex(index),
      });
    });
  }, { scope: itemRef });

  return (
    <div 
      ref={itemRef}
      onClick={() => setActiveIndex(index)}
      // FIXED: Native React ternary logic for the parent's background and border.
      className={`cert-item opacity-0 translate-y-[40px] will-change-transform group relative w-full flex flex-col justify-between border p-8 lg:p-10 h-[280px] lg:h-[320px] transition-colors duration-500 cursor-pointer ${isActive ? 'is-active bg-[#0a0a0a] border-zinc-700/80' : 'bg-transparent border-zinc-800/50'} hover:bg-[#0a0a0a] hover:border-zinc-700/80`}
    >
      
      {/* TOP: Year & Issuer */}
      <div className="flex justify-between items-center w-full">
        <span className="text-[0.65rem] tracking-[0.2em] font-medium text-zinc-500 transition-colors duration-500 group-hover:text-zinc-400 group-[.is-active]:text-zinc-400">
          {cert.year}
        </span>
        <span className="text-[0.65rem] tracking-[0.2em] font-medium text-zinc-500 uppercase transition-colors duration-500 group-hover:text-zinc-400 group-[.is-active]:text-zinc-400">
          {cert.issuer}
        </span>
      </div>

      {/* CENTER: Typography */}
      <div className="mt-8 mb-auto pr-4">
        <h3 className="text-xl lg:text-3xl font-medium text-zinc-300 group-hover:text-[#f3f3f3] group-[.is-active]:text-[#f3f3f3] transition-colors duration-500 leading-tight">
          {cert.title}
        </h3>
      </div>

      {/* BOTTOM: Minimal Ledger */}
      <div className="flex items-end justify-between w-full mt-8 pt-6 border-t border-dotted border-zinc-800/50 transition-colors duration-500 group-hover:border-zinc-700 group-[.is-active]:border-zinc-700">
        
        <div className="flex flex-col gap-1.5">
          <span className="text-[0.55rem] uppercase tracking-[0.2em] text-zinc-600 transition-colors duration-500">
            Credential ID
          </span>
          <span className="text-xs sm:text-sm font-mono tracking-widest text-zinc-400 transition-colors duration-500 group-hover:text-zinc-300 group-[.is-active]:text-zinc-300">
            {cert.credentialId}
          </span>
        </div>

        {/* Status Dot + Arrow */}
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-zinc-700 group-hover:bg-[#FF5733] group-[.is-active]:bg-[#FF5733] transition-colors duration-500"></div>
          
          <div className="text-zinc-600 group-hover:text-[#f3f3f3] group-[.is-active]:text-[#f3f3f3] transition-all duration-300 ease-out group-hover:translate-x-[3px] group-hover:-translate-y-[3px] group-[.is-active]:translate-x-[3px] group-[.is-active]:-translate-y-[3px]">
            <Icon icon="material-symbols:arrow-outward-rounded" className="text-xl" />
          </div>
        </div>
        
      </div>

    </div>
  );
};

export default CertificateItem;