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
    <section ref={sectionRef} id="experience-section" className="relative w-full pt-[15svh] pb-[15svh] px-5 lg:px-10 z-10 mt-10 lg:mt-14">
      
      {/* THE HEADER: Massive, elegant, and perfectly centered */}
      <div className="w-full flex justify-center mb-16 lg:mb-28 pointer-events-none exp-fade">
        <h2 className="head-txt text-[20vw] lg:text-[11vw] leading-[0.85] tracking-tighter opacity-90 text-center text-[#f3f3f3]">
          Experience
        </h2>
      </div>

      <div className="w-full max-w-[1500px] mx-auto flex flex-col">
        
        {/* DESKTOP LEDGER HEADER */}
        <div className="hidden lg:grid grid-cols-12 gap-8 pb-6 border-b border-zinc-800 text-[0.65rem] tracking-[0.2em] uppercase text-zinc-600 font-bold exp-fade">
          <div className="col-span-3">Timeframe</div>
          <div className="col-span-3">Organization</div>
          <div className="col-span-3">Role</div>
          <div className="col-span-3 text-right">Key Deliverables</div>
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