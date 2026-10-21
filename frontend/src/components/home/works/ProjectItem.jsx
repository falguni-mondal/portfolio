import React, { useRef } from 'react';
import { Icon } from '@iconify/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useLabStore } from '../../../store/store';

gsap.registerPlugin(ScrollTrigger);

const ProjectItem = ({ project, index, activeIndex, setActiveIndex }) => {
  const itemRef = useRef(null);

    const theme = useLabStore((state) => state.theme);
  
  // Strict active state management for flawless syncing with VideoPortal
  const isActive = activeIndex === index;

  useGSAP(() => {
    let mm = gsap.matchMedia();
    mm.add("(max-width: 1023px)", () => {
      ScrollTrigger.create({
        trigger: itemRef.current,
        start: "top 40%", 
        end: "bottom 40%", 
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

  // Dynamic wrapper logic based on the presence of a URL
  const ContentWrapper = project.url ? 'a' : 'div';
  const wrapperProps = project.url 
    ? { href: project.url, target: "_blank", rel: "noopener noreferrer" } 
    : {};

  return (
    <ContentWrapper
      {...wrapperProps}
      ref={itemRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      // Added background color transition and subtle mobile padding so text doesn't touch the orange edge
      className={`group relative w-full block py-12 lg:py-16 border-b border-zinc-700 flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-0 overflow-hidden px-4 sm:px-6 lg:px-10 transition-colors duration-500 ease-out px-5 lg:px-10 ${
        project.url ? 'cursor-pointer' : 'cursor-default lg:cursor-pointer'
      } ${
        isActive ? theme === "dark" ? 'bg-[#1a1a1a]/90 backdrop-blur-[2px]' : 'bg-[#bebebe]/90 backdrop-blur-[2px]' : 'bg-transparent'
      }`}
    >
      {/* Animated Baseline (Black to pop against the new orange background) */}
      <div 
        className={`absolute bottom-0 left-0 w-full h-[1px] bg-black transform origin-center transition-transform duration-700 ease-out z-20 ${
          isActive ? 'scale-x-100' : 'scale-x-0'
        }`} 
      />

      {/* 1. NUMBER (Left aligned) */}
      <div className={`w-full lg:w-2/12 flex items-center transition-all duration-500 ${isActive ? 'lg:translate-x-4' : ''}`}>
        <span className="text-xs lg:text-sm font-bold tracking-[0.2em] uppercase">
          0{index + 1}
        </span>
      </div>

      {/* 2. TITLE (Massive typography pushing right on hover) */}
      <div className="w-full lg:w-5/12">
        <h3 className={`text-3xl lg:text-4xl xl:text-5xl font-medium transition-all duration-500 ease-out ${isActive ? 'lg:translate-x-4' : ''}`}>
          {project.name}
        </h3>
      </div>

      {/* 3. DESCRIPTION (Pushing left on hover) */}
      <div className="w-full lg:w-3/12 pr-0 lg:pr-10">
        <p className={`text-sm lg:text-base leading-relaxed transition-all duration-500 ${isActive ? theme === "dark"? 'lg:-translate-x-2 text-zinc-300' : 'lg:-translate-x-2 text-[0b0a09]' : 'text-zinc-500'}`}>
          {project.description}
        </p>
      </div>

      {/* 4. EXPLORE / ONGOING CTA (Right aligned) */}
      <div className={`w-full lg:w-2/12 flex items-center lg:justify-end gap-2 transition-all duration-500 ${isActive ? 'lg:-translate-x-4' : ''}`}>
        {project.isOngoing ? (
          <span className={`text-[0.65rem] uppercase tracking-[0.2em] font-bold transition-all duration-500 ${isActive ? 'lg:-translate-x-2 text-[#ff5733]' : 'text-zinc-500'}`}>
            Ongoing
          </span>
        ) : (
          /* Lined Circle with Center Diagonal Arrow */
          <div className={`flex items-center justify-center w-12 h-12 rounded-full border transition-colors duration-500 ${
            isActive ? theme === "dark" ? 'prime-bg border-[#ff5733] text-[#f3f3f3]' : "prime-bg border-[#ff5733] text-[#0b0a09]" : 'bg-transparent border-zinc-600 text-zinc-600'
          }`}>
            <Icon icon="material-symbols:arrow-outward-rounded" className="text-2xl" />
          </div>
        )}
      </div>

    </ContentWrapper>
  );
};

export default ProjectItem;