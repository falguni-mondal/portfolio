import React, { useState, useEffect, useRef } from 'react';

const ExperienceItem = ({ exp }) => {
  const [isClicked, setIsClicked] = useState(false);
  const itemRef = useRef(null);

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
      className={`group relative flex flex-col lg:grid lg:grid-cols-12 gap-y-4 lg:gap-8 items-start lg:items-center py-10 lg:py-12 border-b border-zinc-800 cursor-pointer overflow-hidden px-1 lg:px-10 exp-fade ${isClicked ? 'is-clicked' : ''}`}
    >
      
      {/* Animated Orange Baseline */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-[#FF5733] transform scale-x-0 origin-left transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] lg:group-hover:scale-x-100 group-[.is-clicked]:scale-x-100 z-10" />

      {/* 1. TIMEFRAME */}
      {/* Kept horizontal shift on lg:group-hover, removed from group-[.is-clicked] */}
      <div className="lg:col-span-3 flex items-center gap-4 transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] lg:group-hover:translate-x-6">
        
        {exp.isActive ? (
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF5733] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF5733]"></span>
          </span>
        ) : (
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-700 transition-colors duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] lg:group-hover:bg-[#FF5733] group-[.is-clicked]:bg-[#FF5733]"></span>
        )}
        
        <span className="text-xs lg:text-sm tracking-[0.1em] font-medium text-zinc-500 transition-colors duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] lg:group-hover:text-[#f3f3f3] group-[.is-clicked]:text-[#f3f3f3]">
          {exp.duration}
        </span>
      </div>

      {/* 2. ORGANIZATION (Vertical Text Roll) */}
      {/* Kept horizontal shift on lg:group-hover, removed from group-[.is-clicked] */}
      <div className="lg:col-span-3 flex flex-col items-start transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] lg:group-hover:translate-x-2">
        
        {/* Vertical Text Flip Container (This stays on click since it doesn't shift the layout horizontally) */}
        <div className="relative overflow-hidden h-[28px] lg:h-[32px]">
          <div className="flex flex-col transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] lg:group-hover:-translate-y-1/2 group-[.is-clicked]:-translate-y-1/2">
            <h3 className="text-xl lg:text-2xl font-light text-zinc-300 h-[28px] lg:h-[32px] flex items-center">
              {exp.company}
            </h3>
            <h3 className="text-xl lg:text-2xl font-medium text-[#f3f3f3] h-[28px] lg:h-[32px] flex items-center">
              {exp.company}
            </h3>
          </div>
        </div>

        <span className="text-[0.65rem] tracking-[0.2em] uppercase text-zinc-600 font-medium mt-1 transition-colors duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] lg:group-hover:text-zinc-300 group-[.is-clicked]:text-zinc-300">
          {exp.type}
        </span>
      </div>

      {/* 3. ROLE */}
      {/* Kept horizontal shift on lg:group-hover, removed from group-[.is-clicked] */}
      <div className="lg:col-span-3 flex items-center transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] lg:group-hover:-translate-x-2">
        <p className="text-base lg:text-lg prime-txt font-medium text-zinc-400 transition-colors duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] lg:group-hover:text-[#f3f3f3] group-[.is-clicked]:text-[#f3f3f3]">
          {exp.role}
        </p>
      </div>

      {/* 4. PROJECTS (Cascading Colors, NO horizontal stagger slide on click) */}
      <div className="lg:col-span-3 flex flex-wrap gap-x-3 gap-y-1 lg:justify-end text-sm lg:text-base font-medium w-full">
        {exp.projects.map((project, index) => (
          <React.Fragment key={project}>
            
            <span 
              className="text-zinc-500 italic transform transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] lg:group-hover:text-[#f3f3f3] lg:group-hover:-translate-x-4 group-[.is-clicked]:text-[#f3f3f3]"
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