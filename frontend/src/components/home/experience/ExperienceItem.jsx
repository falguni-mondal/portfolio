import React, { useState, useEffect, useRef } from 'react';
import { useLabStore } from "../../../store/store";

const ExperienceItem = ({ exp }) => {
  const [isClicked, setIsClicked] = useState(false);
  const itemRef = useRef(null);
  const theme = useLabStore((state) => state.theme);

  // Handle clicking outside of the component to reset the state
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (itemRef.current && !itemRef.current.contains(event.target)) {
        setIsClicked(false);
      }
    };

    // Attach the listener
    document.addEventListener("mousedown", handleClickOutside);
    
    // Cleanup the listener on unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div 
      ref={itemRef}
      onClick={() => setIsClicked(!isClicked)}
      className={`group relative flex flex-col lg:grid lg:grid-cols-12 gap-y-4 lg:gap-8 items-start lg:items-center py-10 lg:py-12 border-b border-zinc-700 cursor-pointer overflow-hidden px-1 lg:px-10 exp-fade ${isClicked ? 'is-clicked' : ''}`}
    >
      
      {/* Animated Orange Baseline */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-[#FF5733] transform scale-x-0 origin-left transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] lg:group-hover:scale-x-100 group-[.is-clicked]:scale-x-100 z-10" />

      {/* 1. TIMEFRAME */}
      {/* Kept horizontal shift on lg:group-hover, removed from group-[.is-clicked] */}
      <div className="lg:col-span-3 flex items-center gap-4 transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] lg:group-hover:translate-x-6">
        
        {exp.isPresent ? (
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF5733] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF5733]"></span>
          </span>
        ) : (
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-700 transition-colors duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] lg:group-hover:bg-[#FF5733] group-[.is-clicked]:bg-[#FF5733]"></span>
        )}
        
        <span className={`text-xs lg:text-sm tracking-[0.1em] font-medium ${theme === "dark" ? "text-zinc-500" : "text-zinc-600"} capitalize transition-colors duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] ${theme === "dark" ? "lg:group-hover:text-[#f3f3f3]" : "lg:group-hover:text-[#0b0a09]"} ${theme === "dark" ? "group-[.is-clicked]:text-[#f3f3f3]" : "group-[.is-clicked]:text-[#0b0a09]"}`}>
          {exp.from} — {exp.isPresent ? "Present" : exp.to}
        </span>
      </div>

      {/* 2. ORGANIZATION (Vertical Text Roll) */}
      {/* Kept horizontal shift on lg:group-hover, removed from group-[.is-clicked] */}
      <div className="lg:col-span-3 flex flex-col items-start transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] lg:group-hover:translate-x-2">
        
        {/* Vertical Text Flip Container */}
        <div className="relative overflow-hidden h-[28px] lg:h-[32px]">
          <div className="flex flex-col transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] lg:group-hover:-translate-y-1/2 group-[.is-clicked]:-translate-y-1/2">
            <h3 className={`text-xl lg:text-2xl font-light${theme === "dark" ? "font-light" : "font-base"} ${theme === "dark" ? "text-zinc-300" : "text-zinc-600"} h-[28px] lg:h-[32px] flex items-center capitalize`}>
              {exp.name}
            </h3>
            <h3 className={`text-xl lg:text-2xl font-medium ${theme === "dark" ? "text-[#f3f3f3]" : "text-[#0b0a09]"} h-[28px] lg:h-[32px] flex items-center capitalize`}>
              {exp.name}
            </h3>
          </div>
        </div>

        <span className={`text-[0.65rem] tracking-[0.2em] uppercase text-zinc-500 font-medium mt-1 transition-colors duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]  ${theme === "dark" ? "lg:group-hover:text-zinc-300" : "lg:group-hover:text-zinc-700"} ${theme === "dark" ? "group-[.is-clicked]:text-zinc-500" : "group-[.is-clicked]:text-zinc-700"}`}>
          {exp.type}
        </span>
      </div>

      {/* 3. ROLE */}
      {/* Kept horizontal shift on lg:group-hover, removed from group-[.is-clicked] */}
      <div className="lg:col-span-3 flex items-center transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] lg:group-hover:-translate-x-2">
        <p className={`text-base lg:text-lg prime-txt font-medium capitalize transition-colors duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]`}>
          {exp.role}
        </p>
      </div>

      {/* 4. PROJECTS (Cascading Colors, NO horizontal stagger slide on click) */}
      <div className="lg:col-span-3 flex flex-wrap gap-x-3 gap-y-1 lg:justify-end text-sm lg:text-base font-medium w-full">
        {exp.projects.map((project, index) => (
          <React.Fragment key={project}>
            
            <span 
              className={`text-zinc-500 italic transform transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] ${theme === "dark" ? "lg:group-hover:text-[#f3f3f3]" : "lg:group-hover:text-zinc-700"} lg:group-hover:-translate-x-4 ${theme === "dark" ? "group-[.is-clicked]:text-[#f3f3f3]" : "group-[.is-clicked]:text-zinc-700"}`}
              style={{ transitionDelay: `${index * 40}ms` }}
            >
              {project}
            </span>
            
            {index !== exp.projects.length - 1 && (
              <span 
                className="text-zinc-800 transform transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] lg:group-hover:text-[#FF5733]/50 lg:group-hover:-translate-x-4 group-[.is-clicked]:text-[#FF5733]/50"
                style={{ transitionDelay: `${index * 40}ms` }}
              >
                /
              </span>
            )}

          </React.Fragment>
        ))}
      </div>

    </div>
  );
};

export default ExperienceItem;