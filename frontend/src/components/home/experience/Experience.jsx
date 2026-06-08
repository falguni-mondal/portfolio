import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import ExperienceItem from './ExperienceItem';

gsap.registerPlugin(ScrollTrigger);

const EXPERIENCES = [
  {
    id: 1,
    role: "Lead Full Stack Web Developer",
    company: "Graphitage",
    type: "Digital Ad Agency",
    duration: "Nov 2025 — Present",
    projects: ["SIHM", "Mritsna", "Ankuran", "StemQuest"],
    isActive: true, // Triggers the live pulse indicator
  }
];

const Experience = () => {
  const sectionRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(".exp-fade", 
      { y: 30, opacity: 0 }, 
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        }
      }
    );
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="experience-section" className="relative w-full pt-[10svh] lg:pt-[15svh] pb-[15svh] px-5 lg:px-10 z-10 mt-20 lg:mt-24">
      
      {/* Wrapped everything in the max-w container for flawless left/right edge alignment across the site */}
      <div className="w-full max-w-[1600px] mx-auto flex flex-col">
        
        {/* COMBINED HEADER ROW: Heading on Left, Flanks on Right */}
        <div className="w-full flex flex-col lg:flex-row items-start lg:items-end justify-between lg:mb-20 border-b border-zinc-800 pb-8 lg:pb-12 exp-fade">
          
          {/* BRUTALIST HEADING */}
          <h2 className="text-[14vw] sm:text-[10vw] lg:text-[6rem] xl:text-[7rem] leading-[0.95em] tracking-tighter">
            <span className="font-light italic text-zinc-500">
              Career
            </span>
            <br />
            <span className="text-[#f3f3f3] font-bold pr-2">Chapters.</span>
          </h2>

          {/* THE METADATA FLANKS (Sitting beside the heading) */}
          <div className="flex flex-wrap items-center gap-6 lg:gap-12 mt-8 lg:mt-0 lg:pb-3">
            <span className="text-[0.55rem] sm:text-[0.65rem] tracking-[0.2em] font-medium text-zinc-500 uppercase">
              ( Career Path )
            </span>
            <span className="text-[0.55rem] sm:text-[0.65rem] tracking-[0.2em] font-medium text-zinc-500 uppercase">
              ( 2025 — Present )
            </span>
          </div>

        </div>
        
        {/* THE EXPERIENCE ROWS */}
        <div className="flex flex-col w-full">
          {EXPERIENCES.map((exp) => (
            <ExperienceItem key={exp.id} exp={exp} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default Experience;