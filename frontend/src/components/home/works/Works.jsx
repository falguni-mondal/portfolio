import React, { useState, useRef } from "react";
import ProjectItem from "./ProjectItem";
import VideoPortal from "./VideoPortal";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import data from '../../../data.json';
import SectionHeading from "../global/SectionHeading";

gsap.registerPlugin(ScrollTrigger);

const worksData = data.works;

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

      tl.fromTo(".heading-block",
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
      id="works"
      className="relative w-full pt-[10svh] lg:pt-[15svh] pb-[15svh] z-10 lg:mt-14"
    >
      <div className="w-full max-w-[1500px] mx-auto flex flex-col">
        
        <div className="w-full flex flex-col lg:flex-row items-start lg:items-end justify-between mb-8 lg:mb-20 border-b border-zinc-700 pb-8 lg:pb-12 px-5 lg:px-10">
          
          <SectionHeading line1="Professional" line2="Works." />

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
          {worksData.map((project, index) => (
            <ProjectItem
              key={index}
              project={project}
              index={index}
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
            />
          ))}
        </div>
      </div>

      <VideoPortal projects={worksData} activeIndex={activeIndex} />
    </section>
  );
};

export default Works;