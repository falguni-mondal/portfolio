import React from 'react';
import data from '../../../data.json';
import { useLabStore } from '../../../store/store';

// Dynamically pull the arsenal array
const arsenalData = data.arsenal;

// Smart chunking to automatically divide the array into 3 balanced columns for the UI
const chunkSize = Math.ceil(arsenalData.length / 3);
const arsenalColumns = [
  arsenalData.slice(0, chunkSize),
  arsenalData.slice(chunkSize, chunkSize * 2),
  arsenalData.slice(chunkSize * 2)
];

const Arsenal = () => {
    const theme = useLabStore((state) => state.theme);

  return (
    <div className="arsenal-block relative pt-10 lg:pt-12 mt-auto">
      <div className="animated-line absolute top-0 left-0 w-full h-[1px] bg-zinc-700 origin-left scale-x-0"></div>
      
      <span className="arsenal-header text-[0.65rem] tracking-[0.2em] uppercase text-zinc-600 font-bold mb-6 block">
        Core Arsenal
      </span>
      
      {/* Dynamically Mapped Arsenal Columns */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-4">
        {arsenalColumns.map((column, colIndex) => (
          <ul key={colIndex} className={`flex flex-col gap-3 text-sm lg:text-base ${theme === "dark" ? "text-zinc-300" : "text-zinc-700"} font-medium`}>
            {column.map((item, itemIndex) => (
              <li key={itemIndex} className="arsenal-item flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF5733]"></span> {item}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
};

export default Arsenal;