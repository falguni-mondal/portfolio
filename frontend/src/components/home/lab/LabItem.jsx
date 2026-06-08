import React, { useRef } from 'react';
import { Icon } from '@iconify/react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const LabItem = ({ project, index }) => {
  const itemRef = useRef(null);
  const imageRef = useRef(null);

  useGSAP(() => {
    // Subtle parallax effect on the image/canvas inside the container
    gsap.to(imageRef.current, {
      yPercent: 15,
      ease: "none",
      scrollTrigger: {
        trigger: itemRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      }
    });
  }, { scope: itemRef });

  return (
    <div ref={itemRef} className="w-full flex flex-col group cursor-pointer">
      
      {/* THE CANVAS / MEDIA BLOCK */}
      {/* Aspect ratio dynamically shifts from 4/3 on mobile to a perfect square on desktop */}
      <div className="w-full aspect-[4/3] lg:aspect-square bg-[#0a0a0a] overflow-hidden relative mb-4 lg:mb-6 rounded-sm">
        
        {/* Subtle grid pattern background for the "Lab/Tech" feel */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px] lg:bg-[size:40px_40px] opacity-50 z-0"></div>

        {/* The Media / Image Placeholder */}
        <div 
          ref={imageRef}
          className="absolute inset-[-10%] w-[120%] h-[120%] flex items-center justify-center z-10 scale-100 lg:group-hover:scale-105 transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]"
        >
          {/* Icon scales down for mobile to prevent overwhelming the frame */}
          <Icon icon={project.icon} className="text-[5rem] lg:text-[8rem] text-zinc-800 transition-colors duration-700 lg:group-hover:text-zinc-600" />
        </div>
        
        {/* Hover Overlay Fade (Disabled on mobile since hover doesn't exist naturally) */}
        <div className="hidden lg:flex absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-20 items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-[#FF5733] flex items-center justify-center transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
            <Icon icon="material-symbols:arrow-outward-rounded" className="text-2xl text-[#f3f3f3]" />
          </div>
        </div>
      </div>

      {/* THE METADATA FOOTER */}
      {/* Stacks vertically on tiny screens, flex-row on larger mobile/desktop */}
      <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between border-t border-zinc-800 pt-4 gap-3 sm:gap-0">
        
        <div className="flex items-center gap-3 lg:gap-4">
          <span className="text-xs font-bold tracking-[0.2em] text-zinc-600">
            0{index + 1}
          </span>
          <h3 className="text-xl lg:text-2xl font-medium text-[#f3f3f3] lg:group-hover:text-[#FF5733] transition-colors duration-500">
            {project.title}
          </h3>
        </div>

        <div className="flex flex-wrap gap-x-2 lg:gap-x-3 gap-y-1">
          {project.tech.map((tag, i) => (
            <React.Fragment key={tag}>
              <span className="text-[0.6rem] lg:text-[0.65rem] uppercase tracking-[0.2em] font-bold text-zinc-500 lg:group-hover:text-[#f3f3f3] transition-colors duration-500">
                {tag}
              </span>
              {i !== project.tech.length - 1 && (
                <span className="text-zinc-800">/</span>
              )}
            </React.Fragment>
          ))}
        </div>

      </div>
      
    </div>
  );
};

export default LabItem;