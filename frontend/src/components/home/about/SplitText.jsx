import React from 'react';

const SplitText = ({ text }) => {
  return text.split(" ").map((word, index) => (
    <span key={index} className="inline-flex overflow-hidden pb-1 lg:pb-2 -mb-1 lg:-mb-2 mr-[0.25em]">
      <span className="p-word origin-bottom-left inline-block">
        {word}
      </span>
    </span>
  ));
};

export default SplitText;