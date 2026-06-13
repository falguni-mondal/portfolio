import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import LabItem from './LabItem';
import data from '../../../data.json';
import SectionHeading from '../global/SectionHeading';

gsap.registerPlugin(ScrollTrigger);

// Dynamically pulling the lab array from your JSON data
const labData = data.lab;

const Lab = () => {
  const sectionRef = useRef(null);
  // Track the active item for scroll/click triggering
  const [activeIndex, setActiveIndex] = useState(null);

  useGSAP(() => {
    let mm = gsap.matchMedia();

    // ==========================================
    // DESKTOP: Master Timeline Sequence
    // ==========================================
    mm.add("(min-width: 1024px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 65%",
        }
      });

      tl.fromTo(".editorial-header", 
        { opacity: 0 }, 
        { opacity: 1, duration: 1, ease: "power3.out" }
      );

      tl.fromTo(".heading-block",
        { y: 120, skewY: 8, filter: "blur(12px)", opacity: 0 },
        { y: 0, skewY: 0, filter: "blur(0px)", opacity: 1, duration: 1.6, stagger: 0.15, ease: "expo.out", force3D: true },
        "-=0.8"
      );

      tl.fromTo(".p-line", 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" },
        "-=1.2"
      );
    });

    // ==========================================
    // MOBILE / TABLET: Individual ScrollTriggers
    // ==========================================
    mm.add("(max-width: 1023px)", () => {
      
      // Reset the active state when leaving the entire section
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 50%",
        end: "bottom 50%",
        onLeave: () => setActiveIndex(null),
        onLeaveBack: () => setActiveIndex(null),
      });

      gsap.fromTo(".editorial-header", 
        { opacity: 0 }, 
        { opacity: 1, duration: 1, ease: "power3.out", scrollTrigger: { trigger: ".editorial-header", start: "top 75%" } }
      );

      gsap.fromTo(".heading-block",
        { y: 80, skewY: 4, filter: "blur(8px)", opacity: 0 }, 
        { y: 0, skewY: 0, filter: "blur(0px)", opacity: 1, duration: 1.4, stagger: 0.15, ease: "expo.out", force3D: true, scrollTrigger: { trigger: ".heading-block", start: "top 75%" } }
      );

      gsap.fromTo(".p-line", 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1.2, ease: "power3.out", scrollTrigger: { trigger: ".p-line", start: "top 75%" } }
      );

    });

  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="lab" className="relative w-full pt-[10svh] lg:pt-[15svh] pb-[15svh] px-5 lg:px-10 z-10 lg:mt-14">
      
      <div className="w-full mx-auto flex flex-col">
        
        {/* EDITORIAL TOP BORDER */}
        <div className="editorial-header w-full flex items-center justify-between mb-12 lg:mb-24 border-b border-zinc-700 pb-4">
          <span className="text-[0.55rem] sm:text-[0.65rem] tracking-[0.2em] font-medium text-zinc-500 uppercase">
            ( R & D )
          </span>
          <span className="text-[0.55rem] sm:text-[0.65rem] tracking-[0.2em] font-medium text-zinc-500 uppercase">
            ( The Lab )
          </span>
        </div>

        {/* THE SPLIT ARCHITECTURE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-12 lg:gap-x-16 w-full relative items-start">
          
          <div className="lg:col-span-5 relative lg:sticky lg:top-[15svh] flex flex-col z-20">
            
            <SectionHeading line1="Digital" line2="Playground." />

            <p className="p-line text-zinc-400 text-sm lg:text-base leading-relaxed mt-6 lg:mt-8 max-w-sm">
              A personal archive of passion projects, technical experiments, and creative coding logic built to push the boundaries of my own learning and creativity.
            </p>
          </div>

          {/* THE MEDIA CANVAS: Pass active state props to children */}
          <div className="lg:col-span-7 flex flex-col gap-16 lg:gap-32 w-full mt-4 lg:mt-0 z-10">
            {labData.map((project, index) => (
              <LabItem 
                key={index} 
                project={project} 
                index={index} 
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
              />
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};

export default Lab;