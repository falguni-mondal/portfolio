import React from 'react';

const ExperienceItem = ({ exp }) => {
  return (
    <div 
      // The 'exp-fade' class allows the parent GSAP ScrollTrigger to find and animate this row
      className="group relative flex flex-col lg:grid lg:grid-cols-12 gap-y-4 lg:gap-8 items-start lg:items-center py-10 lg:py-12 border-b border-zinc-800 cursor-pointer overflow-hidden px-1 lg:px-10 exp-fade"
    >
      
      {/* Animated Orange Baseline */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-[#FF5733] transform scale-x-0 origin-center transition-transform duration-700 ease-out lg:group-hover:scale-x-100 z-10" />

      {/* 1. TIMEFRAME (Outer Left: Pushes Right) */}
      <div className="lg:col-span-3 flex items-center gap-3 transition-transform duration-500 lg:group-hover:translate-x-4">
        
        {/* Live Pulse Indicator for active roles */}
        {exp.isActive ? (
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF5733] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF5733]"></span>
          </span>
        ) : (
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-700 transition-colors duration-500 lg:group-hover:bg-[#FF5733]"></span>
        )}
        
        <span className="text-xs lg:text-sm tracking-[0.1em] font-medium text-zinc-500 transition-colors duration-500 lg:group-hover:text-[#f3f3f3]">
          {exp.duration}
        </span>
      </div>

      {/* 2. ORGANIZATION (Inner Left: Pushes slightly Right) */}
      <div className="lg:col-span-3 flex flex-col items-start transition-transform duration-500 lg:group-hover:translate-x-2">
        <h3 className="text-xl lg:text-2xl font-medium text-zinc-300 transition-colors duration-500 lg:group-hover:text-[#f3f3f3] font-light">
          {exp.company}
        </h3>
        <span className="text-[0.65rem] tracking-[0.2em] uppercase text-zinc-600 font-medium mt-1 lg:group-hover:text-zinc-400 transition-colors duration-500">
          {exp.type}
        </span>
      </div>

      {/* 3. ROLE (Inner Right: Pushes slightly Left) */}
      <div className="lg:col-span-3 flex items-center transition-transform duration-500 lg:group-hover:-translate-x-2">
        <p className="text-base lg:text-lg prime-txt font-medium transition-colors duration-500 lg:group-hover:text-[#f3f3f3]">
          {exp.role}
        </p>
      </div>

      {/* 4. PROJECTS (Outer Right: Pushes Left) */}
      <div className="lg:col-span-3 flex flex-wrap gap-x-3 gap-y-1 lg:justify-end text-sm lg:text-base font-medium transition-transform duration-500 lg:group-hover:-translate-x-4 w-full">
        {exp.projects.map((project, index) => (
          <React.Fragment key={project}>
            <span className="text-zinc-500 italic transition-colors duration-500 lg:group-hover:text-[#f3f3f3]">
              {project}
            </span>
            {index !== exp.projects.length - 1 && (
              <span className="text-zinc-800 transition-colors duration-500 lg:group-hover:text-[#FF5733]/50">/</span>
            )}
          </React.Fragment>
        ))}
      </div>

    </div>
  );
};

export default ExperienceItem;