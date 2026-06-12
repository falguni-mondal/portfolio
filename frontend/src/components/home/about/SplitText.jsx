import React from 'react';

const SplitText = ({ text }) => {
  return (
    <>
      <span className="lg:hidden p-mobile-text inline-block">
        {text}
      </span>
      
      {/* DESKTOP: Render the complex word-by-word span arrays for the stagger effect */}
      <span className="hidden lg:inline">
        {text.split(" ").map((word, index) => (
          <span key={index} className="inline-flex overflow-hidden pb-1 lg:pb-2 -mb-1 lg:-mb-2 mr-[0.25em]">
            <span className="p-word origin-bottom-left inline-block">
              {word}
            </span>
          </span>
        ))}
      </span>
    </>
  );
};

export default SplitText;