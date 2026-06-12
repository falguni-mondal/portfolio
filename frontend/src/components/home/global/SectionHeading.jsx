import React from 'react';

const SectionHeading = ({ line1, line2 }) => {
  return (
    <h2 className="text-[14vw] sm:text-[10vw] lg:text-[6.5rem] xl:text-[7.5rem] leading-[0.85em] tracking-tighter flex flex-col">
      
      {/* Line 1: Light, Italic, Zinc */}
      <span className="overflow-hidden block pb-2 lg:pb-4 pr-6">
        <span className="heading-block opacity-0 block font-light italic text-zinc-500 origin-bottom-left pr-2">
          {line1}
        </span>
      </span>
      
      {/* Line 2: Bold, Bright, Tucked upwards slightly */}
      <span className="overflow-hidden block pb-2 lg:pb-4 pr-6 -mt-2 lg:-mt-4">
        <span className="heading-block opacity-0 block text-[#f3f3f3] font-bold pr-2 origin-bottom-left">
          {line2}
        </span>
      </span>
      
    </h2>
  );
};

export default SectionHeading;