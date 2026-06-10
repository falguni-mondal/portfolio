import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const Signature = () => {
  const sectionRef = useRef(null);

  useGSAP(() => {
    let mm = gsap.matchMedia();

    // Reusable function to apply the collapse mechanics
    const applyCollapseAnimation = (tl) => {
      // 1. Gently fade in the quote as the section enters
      tl.fromTo(".quote-text", 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, 
        0
      )
      // 2. Drop and spin the unwanted letters
      .to(".drop-char", {
        y: 100,
        opacity: 0,
        scale: 0.4,
        rotationZ: (i) => (i % 2 === 0 ? -15 : 15), // Alternating organic spin
        stagger: 0.05,
        ease: "power2.out"
      }, 0.2)
      // 3. Simultaneously collapse the structural wrappers to physically pull the F and dot inwards
      .to(".collapse-wrap", {
        width: 0,
        ease: "power2.inOut"
      }, 0.3)
      .to(".collapse-space", {
        width: 0,
        ease: "power2.inOut"
      }, 0.3);
    };

    // ==========================================
    // DESKTOP: Timeline & ScrollTrigger
    // ==========================================
    mm.add("(min-width: 1024px)", () => {
      const desktopTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%", 
          end: "bottom 50%", 
          scrub: 1.2, 
        }
      });
      applyCollapseAnimation(desktopTl);
    });

    // ==========================================
    // MOBILE / TABLET: Timeline & ScrollTrigger
    // ==========================================
    mm.add("(max-width: 1023px)", () => {
      const mobileTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%", 
          end: "bottom 30%", 
          scrub: 1.2,
        }
      });
      applyCollapseAnimation(mobileTl);
    });

  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="relative w-full py-[15svh] lg:py-[25svh] px-5 lg:px-10 z-10 flex flex-col items-center justify-center overflow-hidden">
      
      <div className="w-full max-w-[1600px] mx-auto flex flex-col items-center text-center">
        
        {/* THE QUOTE TEXT */}
        <span className="quote-text opacity-0 font-light italic text-lg sm:text-xl lg:text-3xl mb-4 lg:mb-8 block will-change-transform">
          "You were experiencing the portfolio —"
        </span>

        {/* THE BRAND COLLAPSE ANIMATION */}
        <div className="brand-collapse-container cursor-default flex justify-center">
          <h2 className="text-[16vw] sm:text-[14vw] lg:text-[6.5rem] xl:text-[7.5rem] leading-[0.8em] font-semibold tracking-tighter flex items-end justify-center text-[#f3f3f3] uppercase">
            
            <span className="inline-block">B</span>
            <span className="inline-block">Y</span>
            
            {/* The collapsible space between 'BY' and 'Falguni' */}
            <span className="collapse-space inline-block overflow-hidden whitespace-nowrap will-change-[width] w-[4vw] lg:w-[3.5rem]"></span>
            
            {/* The Permanent Orange F */}
            <span className="text-[#FF5733] inline-block pr-1 lg:pr-2">F</span>
            
            {/* Structural Wrapper for the falling letters */}
            <span className="collapse-wrap inline-flex overflow-hidden will-change-[width]">
              {["a", "l", "g", "u", "n", "i"].map((char, index) => (
                <span 
                  key={index} 
                  className="drop-char inline-block origin-top will-change-transform"
                >
                  {char}
                </span>
              ))}
            </span>
            
            {/* Custom full stop */}
            <span className="inline-block w-[0.14em] h-[0.14em] bg-[#f3f3f3] ml-[0.04em] mb-[0.04em]"></span>
            
          </h2>
        </div>

      </div>

    </section>
  );
};

export default Signature;