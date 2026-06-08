import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import LabItem from './LabItem';

gsap.registerPlugin(ScrollTrigger);

const LAB_PROJECTS = [
  {
    id: 1,
    title: "Fluid Waving Textures",
    icon: "material-symbols:waves",
    tech: ["WebGL", "GLSL Shaders", "GSAP"],
  },
  {
    id: 2,
    title: "Interactive 3D Owl",
    icon: "material-symbols:view-in-ar-outline",
    tech: ["Three.js", "React Three Fiber"],
  },
  {
    id: 3,
    title: "Nexus Image Engine",
    icon: "material-symbols:image-outline",
    tech: ["JavaScript", "Canvas API"],
  }
];

const Lab = () => {
  const sectionRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(".lab-fade", 
      { y: 40, opacity: 0 }, 
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 65%",
        }
      }
    );
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="lab-section" className="relative w-full pt-[10svh] lg:pt-[15svh] pb-[15svh] px-5 lg:px-10 z-10 lg:mt-14">
      
      <div className="w-full max-w-[1500px] mx-auto flex flex-col">
        
        {/* EDITORIAL TOP BORDER */}
        <div className="w-full flex items-center justify-between mb-12 lg:mb-24 border-b border-zinc-800 pb-4 lab-fade">
          <span className="text-[0.55rem] sm:text-[0.65rem] tracking-[0.2em] font-medium text-zinc-500 uppercase">
            ( R & D )
          </span>
          <span className="text-[0.55rem] sm:text-[0.65rem] tracking-[0.2em] font-medium text-zinc-500 uppercase">
            ( The Lab )
          </span>
        </div>

        {/* THE SPLIT ARCHITECTURE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-12 lg:gap-x-16 w-full relative items-start">
          
          {/* LEFT SIDE: Natural scroll on mobile, Sticky on Desktop */}
          <div className="lg:col-span-5 relative lg:sticky lg:top-[15svh] flex flex-col lab-fade z-20">
            
            <h2 className="text-[14vw] sm:text-[10vw] lg:text-[6rem] xl:text-[7rem] leading-[0.95em] tracking-tighter">
              <span className="font-light italic text-zinc-500">
                Digital
              </span> 
              {/* FIXED: Standard line break so it stacks flawlessly on mobile screens */}
              <br />
              <span className="text-[#f3f3f3] font-bold pr-2">
                Playground.
              </span>
            </h2>

            <p className="text-zinc-400 text-sm lg:text-base leading-relaxed mt-6 lg:mt-8 max-w-sm">
              A personal archive of passion projects, technical experiments, and creative coding logic built to push the boundaries of my own learning and creativity.
            </p>
          </div>

          {/* RIGHT SIDE: The Scrollable Media Canvas */}
          <div className="lg:col-span-7 flex flex-col gap-16 lg:gap-32 w-full mt-4 lg:mt-0 lab-fade z-10">
            {LAB_PROJECTS.map((project, index) => (
              <LabItem key={project.id} project={project} index={index} />
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};

export default Lab;