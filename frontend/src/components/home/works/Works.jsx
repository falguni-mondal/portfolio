import React, { useState, useRef } from 'react';
import ProjectItem from './ProjectItem';
import VideoPortal from './VideoPortal';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const MOCK_PROJECTS = [
  {
    id: 1,
    title: "Nabajagaran",
    description: "A comprehensive digital ecosystem balancing traditional aesthetics with modern MERN stack architecture.",
    imgUrl: "/me.webp" 
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
  const [activeIndex, setActiveIndex] = useState(null);
  const worksRef = useRef(null);

  useGSAP(() => {
    let mm = gsap.matchMedia();
    mm.add("(max-width: 1023px)", () => {
      ScrollTrigger.create({
        trigger: worksRef.current,
        start: "top 50%", 
        end: "bottom 50%", 
        onLeave: () => setActiveIndex(null),
        onLeaveBack: () => setActiveIndex(null),
      });
    });
  }, { scope: worksRef });

  return (
    <section ref={worksRef} id="works-section" className="relative w-full pt-[15svh] pb-[15svh] px-5 lg:px-10 z-10 mt-20 lg:mt-28">

      {/* THE NEW HEADER FIX: Editorial Framing */}
      {/* Wrapped in the exact same max-w container as the projects list so the edges align perfectly */}
      <div className="w-full max-w-[1500px] mx-auto flex flex-col lg:flex-row items-end justify-between mb-16 lg:mb-24 relative">
        
        {/* Left Flank (Hidden on mobile) */}
        <div className="hidden lg:flex w-1/3 pb-3">
          <span className="text-[0.65rem] tracking-[0.2em] font-medium text-zinc-500 uppercase">
            ( Selected Projects )
          </span>
        </div>

        {/* Center Heading */}
        {/* FIXED: Removed mix-blend-difference. Set pure color text-[#f3f3f3]. Scaled to 11vw for elegance. */}
        <div className="w-full lg:w-1/3 flex justify-center">
          <h2 className="head-txt text-[20vw] lg:text-[11vw] leading-[0.8] tracking-tighter text-[#f3f3f3]">
            Works
          </h2>
        </div>

        {/* Right Flank (Hidden on mobile) */}
        <div className="hidden lg:flex w-1/3 justify-end pb-3">
          <span className="text-[0.65rem] tracking-[0.2em] font-medium text-zinc-500 uppercase">
            ( 2024 — Present )
          </span>
        </div>

      </div>

      {/* The Project List */}
      <div className="w-full max-w-[1500px] mx-auto flex flex-col border-t border-zinc-800">
        {MOCK_PROJECTS.map((project, index) => (
          <ProjectItem
            key={project.id}
            project={project}
            index={index}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
          />
        ))}
      </div>

      <VideoPortal projects={MOCK_PROJECTS} activeIndex={activeIndex} />

    </section>
  );
};

export default Works;