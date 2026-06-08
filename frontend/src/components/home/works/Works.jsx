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
        {/* COMBINED HEADER ROW: Heading on Left, Flanks on Right */}
        <div className="w-full flex flex-col lg:flex-row items-start lg:items-end justify-between mb-8 lg:mb-20 border-b border-zinc-800 pb-8 lg:pb-12">
          {/* BRUTALIST HEADING */}
          <h2 className="text-[14vw] sm:text-[10vw] lg:text-[6rem] xl:text-[7rem] leading-[0.95em] tracking-tighter">
            <span className="font-light italic text-zinc-500">
              Professional
            </span>
            <br />
            <span className="text-[#f3f3f3] font-bold pr-2">Works.</span>
          </h2>

          {/* THE METADATA FLANKS (Sitting beside the heading) */}
          <div className="flex flex-wrap items-center gap-6 lg:gap-12 mt-8 lg:mt-0 lg:pb-3">
            <span className="text-[0.55rem] sm:text-[0.65rem] tracking-[0.2em] font-medium text-zinc-500 uppercase">
              ( Client Projects )
            </span>
            <span className="text-[0.55rem] sm:text-[0.65rem] tracking-[0.2em] font-medium text-zinc-500 uppercase">
              ( Upcoming & Completed )
            </span>
          </div>
        </div>

        {/* THE PROJECT LIST */}
        <div className="w-full flex flex-col">
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
