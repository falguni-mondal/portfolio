import React, { useRef } from 'react';
import { Icon } from '@iconify/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const ProjectItem = ({ project, index, activeIndex, setActiveIndex }) => {
  const itemRef = useRef(null);
  
  // Strict active state management for flawless syncing with VideoPortal
  const isActive = activeIndex === index;

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
      // Adopted the LabItem row spacing and open structure
      className="group relative w-full py-12 lg:py-16 border-b border-zinc-700 flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-0 cursor-pointer overflow-hidden lg:px-10"
    >
      {/* Animated Orange Baseline (Stable GPU rendering) */}
      <div 
        className={`absolute bottom-0 left-0 w-full h-[1px] bg-[#FF5733] transform origin-center transition-transform duration-700 ease-out z-20 will-change-transform ${
          isActive ? 'scale-x-100' : 'scale-x-0'
        }`} 
      />

      {/* 1. NUMBER (Left aligned - No Icon) */}
      <div className={`w-full lg:w-2/12 flex items-center transition-transform duration-500 ${isActive ? 'lg:translate-x-4 text-[#FF5733]' : 'text-zinc-600'}`}>
        <span className="text-xs lg:text-sm font-bold tracking-[0.2em] uppercase">
          0{index + 1}
        </span>
      </div>

      {/* 2. TITLE (Massive typography pushing right on hover) */}
      <div className="w-full lg:w-5/12">
        <h3 className={`text-3xl lg:text-4xl xl:text-5xl font-medium transition-all duration-500 ease-out ${isActive ? 'text-[#f3f3f3] lg:translate-x-4' : 'text-zinc-300'}`}>
          {project.title}
        </h3>
      </div>

      {/* 3. DESCRIPTION (Pushing left on hover) */}
      <div className="w-full lg:w-3/12 pr-0 lg:pr-10">
        <p className={`text-sm lg:text-base leading-relaxed transition-all duration-500 ${isActive ? 'text-zinc-300 lg:-translate-x-2' : 'text-zinc-500'}`}>
          {project.description}
        </p>
      </div>

      {/* 4. EXPLORE CTA (Right aligned - Fades in on hover) */}
      <div className={`w-full lg:w-2/12 flex items-center lg:justify-end gap-2 transition-all duration-500 ${isActive ? 'text-[#FF5733] lg:-translate-x-4' : 'opacity-100 text-zinc-600'}`}>
        <span className="text-[0.65rem] uppercase tracking-[0.2em] font-bold">
          Explore
        </span>
        <Icon icon="material-symbols:arrow-right-alt-rounded" className="text-xl" />
      </div>

    </div>
  );
};

export default ProjectItem;