import React from 'react';
import { Icon } from '@iconify/react';

const ProjectItem = ({ project, index, setHoveredIndex }) => {
  return (
    <div
      onMouseEnter={() => setHoveredIndex(index)}
      onMouseLeave={() => setHoveredIndex(null)}
      className="w-full py-16 lg:py-24 border-b border-zinc-800 cursor-pointer group relative overflow-hidden"
    >
      {/* Animated Bottom Line */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#FF5733] transform scale-x-0 origin-left transition-transform duration-700 ease-out lg:group-hover:scale-x-100 z-10" />

      <div className="flex flex-col lg:flex-row justify-between gap-y-8 lg:gap-x-12 relative z-10">
        
        {/* LEFT: Number & Massive Title */}
        <div className="flex items-start gap-6 lg:gap-10 w-full lg:w-3/5">
          <span
            className="text-xl lg:text-2xl font-medium text-transparent mt-3 transition-colors duration-500 lg:group-hover:text-[#FF5733]"
            style={{ WebkitTextStroke: '1px rgba(255,255,255,0.3)' }}
          >
            0{index + 1}
          </span>

          <h3 className="head-txt text-5xl lg:text-[5.5rem] leading-[0.9em] text-[#f3f3f3] lg:text-zinc-600 transition-all duration-500 transform lg:group-hover:translate-x-6 lg:group-hover:text-[#f3f3f3] will-change-transform max-w-2xl">
            {project.title}
          </h3>
        </div>

        {/* RIGHT: Description & Explore */}
        <div className="flex flex-col items-start w-full lg:w-[30%] transform transition-all duration-500 lg:group-hover:-translate-x-4">
          <p className="text-zinc-300 lg:text-zinc-500 text-sm lg:text-base font-medium leading-relaxed max-w-xs transition-colors duration-500 lg:group-hover:text-zinc-300">
            {project.description}
          </p>
          
          <div className="mt-8 flex items-center gap-2 text-[#FF5733] transition-all duration-500 opacity-100 lg:opacity-0 lg:group-hover:opacity-100">
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