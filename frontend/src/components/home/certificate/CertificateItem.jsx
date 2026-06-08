import React, { useRef } from 'react';
import { Icon } from '@iconify/react';
import gsap from 'gsap';

const CertificateItem = ({ cert }) => {
  const arrowRef = useRef(null);

  const handleMouseEnter = () => {
    gsap.to(arrowRef.current, { x: 3, y: -3, duration: 0.3, ease: "power2.out" });
  };

  const handleMouseLeave = () => {
    gsap.to(arrowRef.current, { x: 0, y: 0, duration: 0.3, ease: "power2.out" });
  };

  return (
    <div 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative w-full flex flex-col justify-between bg-transparent hover:bg-[#0a0a0a] border border-zinc-800/50 hover:border-zinc-700/80 p-8 lg:p-10 h-[280px] lg:h-[320px] transition-all duration-500 cursor-pointer"
    >
      
      {/* TOP: Year & Issuer (Clean, opposing corners) */}
      <div className="flex justify-between items-center w-full">
        <span className="text-[0.65rem] tracking-[0.2em] font-medium text-zinc-500 transition-colors duration-500 group-hover:text-zinc-400">
          {cert.year}
        </span>
        <span className="text-[0.65rem] tracking-[0.2em] font-medium text-zinc-500 uppercase transition-colors duration-500 group-hover:text-zinc-400">
          {cert.issuer}
        </span>
      </div>

      {/* CENTER: Typography doing the heavy lifting */}
      <div className="mt-8 mb-auto pr-4">
        <h3 className="text-xl lg:text-3xl font-medium text-zinc-300 group-hover:text-[#f3f3f3] transition-colors duration-500 leading-tight">
          {cert.title}
        </h3>
      </div>

      {/* BOTTOM: Minimal Ledger (Now with a Dotted border) */}
      <div className="flex items-end justify-between w-full mt-8 pt-6 border-t border-dotted border-zinc-800/50 transition-colors duration-500 group-hover:border-zinc-700">
        
        <div className="flex flex-col gap-1.5">
          <span className="text-[0.55rem] uppercase tracking-[0.2em] text-zinc-600 transition-colors duration-500">
            Credential ID
          </span>
          <span className="text-xs sm:text-sm font-mono tracking-widest text-zinc-400 transition-colors duration-500 group-hover:text-zinc-300">
            {cert.credentialId}
          </span>
        </div>

        {/* Status Dot + Arrow */}
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-zinc-700 group-hover:bg-[#FF5733] transition-colors duration-500"></div>
          <div ref={arrowRef} className="text-zinc-600 group-hover:text-[#f3f3f3] transition-colors duration-500">
            <Icon icon="material-symbols:arrow-outward-rounded" className="text-xl" />
          </div>
        </div>
        
      </div>

    </div>
  );
};

export default CertificateItem;