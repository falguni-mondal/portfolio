import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import ExperienceItem from './ExperienceItem';
import data from '../../../data.json';

gsap.registerPlugin(ScrollTrigger);

const experiences = data.experience;

const Experience = () => {
  const sectionRef = useRef(null);
  

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 75%",
      }
    });

    // 1. The Cinematic Skew & Blur Reveal (Awwwards Standard)
    tl.fromTo(".heading-line",
      { 
        y: 120, // Using fixed pixels instead of percent prevents bounding box clipping issues during skew
        skewY: 8, // Aggressive architectural tilt
        filter: "blur(12px)", // Deep cinematic depth-of-field
        opacity: 0 
      },
      {
        y: 0,
        skewY: 0,
        filter: "blur(0px)",
        opacity: 1,
        duration: 1.6, // Longer duration for that premium, heavy feel
        stagger: 0.15,
        ease: "expo.out", // Starts explosively fast, settles incredibly smoothly
        force3D: true // Forces GPU acceleration for the blur and transform
      }
    );

    // 2. The Metadata and Content Cascade
    tl.fromTo(".exp-fade", 
      { y: 30, opacity: 0 }, 
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out"
      },
      "-=1.2" // Overlap aggressively so the content loads while the heading is still settling
    );

  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="experience-section" className="relative w-full pt-[10svh] lg:pt-[15svh] pb-[15svh] px-5 lg:px-10 z-10 mt-20 lg:mt-24">
      
      <div className="w-full max-w-[1600px] mx-auto flex flex-col">
        
        <div className="w-full flex flex-col lg:flex-row items-start lg:items-end justify-between lg:mb-20 border-b border-zinc-700 pb-8 lg:pb-12">
          
          {/* HIGH-END MASKED HEADING */}
          <h2 className="text-[14vw] sm:text-[10vw] lg:text-[6rem] xl:text-[7rem] leading-[0.75em] tracking-tighter flex flex-col">
            
            {/* Line 1: Wrapped in overflow-hidden to act as a clipping mask. pb-2 prevents descender cutoff. */}
            <span className="overflow-hidden block pb-2 lg:pb-4">
              <span className="block heading-line font-light italic text-zinc-500 origin-bottom-left will-change-transform">
                Career
              </span>
            </span>
            
            {/* Line 2: Wrapped in overflow-hidden */}
            <span className="overflow-hidden block pb-2 lg:pb-4">
              <span className="block heading-line text-[#f3f3f3] font-bold pr-2 origin-bottom-left will-change-transform">
                Chapters.
              </span>
            </span>
            
          </h2>

          <div className="flex flex-wrap items-center gap-6 lg:gap-12 mt-8 lg:mt-0 lg:pb-3 exp-fade">
            <span className="text-[0.55rem] sm:text-[0.65rem] tracking-[0.2em] font-medium text-zinc-500 uppercase">
              ( Career Path )
            </span>
            <span className="text-[0.55rem] sm:text-[0.65rem] tracking-[0.2em] font-medium text-zinc-500 uppercase">
              ( 2025 — Present )
            </span>
          </div>

        </div>
        
        {/* THE EXPERIENCE ROWS */}
        <div className="flex flex-col w-full exp-fade">
          {experiences.map((exp) => (
            <ExperienceItem key={exp.id} exp={exp} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default Experience;