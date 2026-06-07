import React, { useRef } from 'react';
import { Icon } from '@iconify/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const ProjectItem = ({ project, index, activeIndex, setActiveIndex }) => {
  const itemRef = useRef(null);

  useGSAP(() => {
    let mm = gsap.matchMedia();
    mm.add("(max-width: 1023px)", () => {
      ScrollTrigger.create({
        trigger: itemRef.current,
        start: "top 60%", 
        end: "bottom 60%", 
        onToggle: (self) => {
          if (self.isActive) {
            setActiveIndex(index);
          }
        }
      });
    });
  }, { scope: itemRef });

  const handleMouseEnter = () => window.innerWidth >= 1024 && setActiveIndex(index);
  const handleMouseLeave = () => window.innerWidth >= 1024 && setActiveIndex(null);

  return (
    <div
      ref={itemRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="w-full py-16 lg:py-20 border-b border-zinc-800 cursor-pointer group relative overflow-hidden"
    >
      {/* Animated Bottom Line */}
      <div className="absolute bottom-0 left-0 w-full h-[0.5px] bg-[#FF5733] transform scale-x-0 origin-center transition-transform duration-700 ease-out lg:group-hover:scale-x-100 z-10" />

      {/* THE NEW GRID LAYOUT: Organizes the row into 12 perfect columns on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-6 items-center relative z-10 w-full">
        
        {/* NUMBER (Cols 1-2): Locks to the far left */}
        <div className="lg:col-span-2 flex items-start">
          <span
            className={`text-2xl lg:text-4xl italic head-txt font-medium transition-colors duration-500 lg:group-hover:text-[#FF5733] ${activeIndex === index ? 'text-[#FF5733]' : 'text-transparent'}`}
            style={{ WebkitTextStroke: '1px rgba(255,255,255,0.3)' }}
          >
            0{index + 1}
          </span>
        </div>

        {/* TITLE (Cols 3-8): Placed directly in the middle of the monitor */}
        <div className="lg:col-span-6">
          {/* FIXED: Added lg:group-hover:text-zinc-600 to dim the text when the user hovers over the row */}
          <h3 className="head-txt text-4xl lg:text-5xl xl:text-[4.5rem] leading-[1.05em] text-[#f3f3f3] transition-all duration-500 transform lg:group-hover:translate-x-6 lg:group-hover:text-zinc-500 will-change-transform">
            {project.title}
          </h3>
        </div>

        {/* DESCRIPTION (Cols 9-12): Pushed to the right edge */}
        <div className="lg:col-span-4 flex flex-col items-start lg:items-end w-full transform transition-all duration-500 lg:group-hover:-translate-x-4">
          <p className="text-zinc-400 text-sm lg:text-base font-medium leading-relaxed max-w-xs text-left lg:text-right transition-colors duration-500 lg:group-hover:text-[#f3f3f3]">
            {project.description}
          </p>
          
          <div className="mt-6 flex items-center gap-2 text-[#FF5733] transition-all duration-500 opacity-100 lg:opacity-0 lg:group-hover:opacity-100">
            <span className="text-[0.65rem] uppercase tracking-[0.2em] font-bold">
              Explore
            </span>
            <Icon icon="material-symbols:arrow-right-alt-rounded" className="text-xl" />
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProjectItem;