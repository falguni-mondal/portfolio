import React, { useState, useRef } from "react";
import ProjectItem from "./ProjectItem";
import VideoPortal from "./VideoPortal";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const MOCK_PROJECTS = [
  {
    id: 1,
    title: "Nabajagaran",
    description:
      "A comprehensive digital ecosystem balancing traditional aesthetics with modern MERN stack architecture.",
    imgUrl: "/me.webp",
  },
  {
    id: 2,
    title: "Command Center",
    description:
      "A centralized, high-performance dashboard for tracking daily gaming routines and server resets.",
    imgUrl: "/me.webp",
  },
  {
    id: 3,
    title: "Lighting AI",
    description:
      "An interactive interface for generating cinematic, editorial-quality image prompts with precise volumetric control.",
    imgUrl: "/me.webp",
  },
  {
    id: 4,
    title: "Retail Backend",
    description:
      "A robust, scalable Node.js/Express architecture engineered to handle high-volume e-commerce transactions.",
    imgUrl: "/me.webp",
  },
];

const Works = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const worksRef = useRef(null);

  useGSAP(
    () => {
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

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: worksRef.current,
          start: "top 75%",
        }
      });

      tl.fromTo(".heading-line",
        { 
          y: 120, 
          skewY: 8, 
          filter: "blur(12px)", 
          opacity: 0 
        },
        {
          y: 0,
          skewY: 0,
          filter: "blur(0px)",
          opacity: 1,
          duration: 1.6, 
          stagger: 0.15,
          ease: "expo.out", 
          force3D: true 
        }
      );

      tl.fromTo(".works-fade", 
        { y: 30, opacity: 0 }, 
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.1,
          ease: "power3.out"
        },
        "-=1.2" 
      );
    },
    { scope: worksRef },
  );

  return (
    <section
      ref={worksRef}
      id="works-section"
      className="relative w-full pt-[10svh] lg:pt-[15svh] pb-[15svh] px-5 lg:px-10 z-10 lg:mt-14"
    >
      <div className="w-full max-w-[1600px] mx-auto flex flex-col">
        
        <div className="w-full flex flex-col lg:flex-row items-start lg:items-end justify-between mb-8 lg:mb-20 border-b border-zinc-700 pb-8 lg:pb-12">
          
          <h2 className="text-[14vw] sm:text-[10vw] lg:text-[6rem] xl:text-[7rem] leading-[0.75em] tracking-tighter flex flex-col">
            
            {/* Line 1: Added pr-6 to widen the masking box for the italic lean */}
            <span className="overflow-hidden block pb-2 lg:pb-4 pr-6">
              <span className="block heading-line font-light italic text-zinc-500 origin-bottom-left will-change-transform pr-2">
                Professional
              </span>
            </span>
            
            {/* Line 2: Added pr-6 here as well just to keep the geometry safe */}
            <span className="overflow-hidden block pb-2 lg:pb-4 pr-6">
              <span className="block heading-line text-[#f3f3f3] font-bold pr-2 origin-bottom-left will-change-transform">
                Works.
              </span>
            </span>
            
          </h2>

          <div className="flex flex-wrap items-center gap-6 lg:gap-12 mt-8 lg:mt-0 lg:pb-3 works-fade">
            <span className="text-[0.55rem] sm:text-[0.65rem] tracking-[0.2em] font-medium text-zinc-500 uppercase">
              ( Client Projects )
            </span>
            <span className="text-[0.55rem] sm:text-[0.65rem] tracking-[0.2em] font-medium text-zinc-500 uppercase">
              ( Upcoming & Completed )
            </span>
          </div>
        </div>

        <div className="w-full flex flex-col works-fade">
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
      </div>

      <VideoPortal projects={MOCK_PROJECTS} activeIndex={activeIndex} />
    </section>
  );
};

export default Works;