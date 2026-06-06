import React, { useState } from 'react';
import ProjectItem from './ProjectItem';
import VideoPortal from './VideoPortal';

// Expanded MOCK_PROJECTS with descriptions
const MOCK_PROJECTS = [
  {
    id: 1,
    title: "Nabajagaran",
    description: "A comprehensive digital ecosystem balancing traditional aesthetics with modern MERN stack architecture.",
    imgUrl: "/me.webp" // Replace with actual video/image paths
  },
  {
    id: 2,
    title: "Command Center",
    description: "A centralized, high-performance dashboard for tracking daily gaming routines and server resets.",
    imgUrl: "/me.webp"
  },
  {
    id: 3,
    title: "Lighting AI",
    description: "An interactive interface for generating cinematic, editorial-quality image prompts with precise volumetric control.",
    imgUrl: "/me.webp"
  },
  {
    id: 4,
    title: "Retail Backend",
    description: "A robust, scalable Node.js/Express architecture engineered to handle high-volume e-commerce transactions.",
    imgUrl: "/me.webp"
  },
];

const Works = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    // min-h-[150vh] ensures there is plenty of scroll room for the sticky effect
    <section id="works-section" className="relative w-full min-h-[150vh] pt-[15vh] pb-[20vh] px-5 lg:px-10 z-10 mt-20 lg:mt-28">

      {/* Massive Sticky Section Header */}
      {/* lg:sticky lg:top-[15vh] locks the text to the screen while projects scroll up past it */}
      <div className="w-full mb-12 lg:mb-0 lg:sticky lg:top-[15vh] lg:h-0 z-20 pointer-events-none">
        <h2 className="head-txt text-[22vw] lg:text-[18vw] leading-[0.75] tracking-tighter opacity-90 mix-blend-difference relative -ml-[1vw] lg:-ml-[0.5vw]">
          Works
        </h2>
      </div>

      <div className="w-full flex flex-col lg:flex-row relative z-10">

        {/* LEFT COLUMN: The 3D Viewing Window */}
        <div className="hidden lg:block w-4/12 xl:w-5/12"></div>

        {/* RIGHT COLUMN: The scrolling list of projects */}
        {/* lg:mt-[25vh] pushes the list down so it starts below the sticky header */}
        <div className="w-full lg:w-8/12 xl:w-7/12 flex flex-col border-t border-zinc-800 mt-[5vh] lg:mt-[25vh]">

          {MOCK_PROJECTS.map((project, index) => (
            <ProjectItem
              key={project.id}
              project={project}
              index={index}
              setHoveredIndex={setHoveredIndex}
            />
          ))}

        </div>
      </div>

      {/* The Mouse Tracking Video Portal (Remains unchanged) */}
      <VideoPortal projects={MOCK_PROJECTS} hoveredIndex={hoveredIndex} />

    </section>
  );
};

export default Works;