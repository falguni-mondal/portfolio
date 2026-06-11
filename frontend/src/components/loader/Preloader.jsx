import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const Preloader = ({ setHasLoaded }) => {
  const containerRef = useRef(null);
  const counterRef = useRef(null);
  const barRef = useRef(null);
  const textWrapperRef = useRef(null);

  useGSAP(
    () => {
      document.body.style.overflow = "hidden";

      const tl = gsap.timeline();
      const counter = { val: 0 };

      tl.to(
        counter,
        {
          val: 100,
          duration: 2.8,
          ease: "power3.inOut",
          onUpdate: () => {
            if (counterRef.current) {
              counterRef.current.innerText = Math.round(counter.val);
            }
          },
        },
        "start"
      )
        .to(
          barRef.current,
          {
            scaleX: 1,
            duration: 2.8,
            ease: "power3.inOut",
          },
          "start"
        )
        // Main branding drops away
        .to(
          ".reveal-text",
          {
            y: 100,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.in",
          },
          "+=0.2"
        )
        // FADE ONLY for counter, %, and progress line
        .to(
          [counterRef.current, ".percent-sign", ".progress-container"],
          {
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
          },
          "<0.6"
        )
        // Wake up the Hero
        .call(() => {
          document.body.style.overflow = "auto";
          if (setHasLoaded) setHasLoaded(true);
        })
        // 2. Slide the curtain
        .to(
          ".curtain-strip",
          {
            scaleY: 0,
            transformOrigin: "top",
            duration: 1.2,
            stagger: 0.08,
            ease: "expo.inOut",
            force3D: true,
            onComplete: () => {
              gsap.set(containerRef.current, { display: "none" });
            }
          },
          "+=0.05"
        );
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[999] w-full h-[100svh] flex flex-col justify-end overflow-hidden"
    >
      
      {/* THE STAGGERED CURTAIN BACKGROUND */}
      <div className="absolute inset-0 flex w-full h-full z-0">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="curtain-strip w-[20.5%] h-full bg-[#0a0a0a] will-change-transform"
          />
        ))}
      </div>

      {/* THE FOREGROUND UI LAYER */}
      <div className="absolute inset-0 z-10 flex flex-col justify-end px-5 lg:px-10 pb-8 lg:pb-12 text-[#f3f3f3] pointer-events-none">
        
        {/* THE TOP METADATA */}
        <div className="absolute top-8 lg:top-12 left-5 lg:left-10 w-full flex justify-between pr-10 lg:pr-20 overflow-hidden">
          <span className="reveal-text block text-[0.65rem] tracking-[0.2em] font-medium text-zinc-500 uppercase origin-top">
            ( Initialization )
          </span>
          <span className="reveal-text block text-[0.65rem] tracking-[0.2em] font-medium text-zinc-500 uppercase origin-top">
            Falguni © {new Date().getFullYear()}
          </span>
        </div>

        {/* THE BOTTOM TYPOGRAPHY & COUNTER */}
        <div className="w-full flex items-end justify-between mb-4 lg:mb-6">
          
          {/* BRANDING */}
          <div ref={textWrapperRef} className="flex flex-col overflow-hidden">
            <span className="reveal-text block text-sm lg:text-xl font-light italic text-zinc-400 mb-1 lg:mb-2">
              Loading Experience
            </span>
            <h1 className="reveal-text text-[12vw] sm:text-[8vw] lg:text-[6rem] leading-[0.8em] font-bold tracking-tight uppercase whitespace-nowrap">
              BY <span className="text-[#FF5733]">F</span>ALGUNI<span className="inline-block w-[0.14em] h-[0.14em] bg-[#f3f3f3] ml-[0.05em] mb-[0.04em]"></span>
            </h1>
          </div>

          {/* THE COUNTER */}
          <div className="overflow-hidden flex items-end">
            <div className="flex items-baseline prime-txt">
              <span
                ref={counterRef}
                className="text-[12vw] sm:text-[8vw] lg:text-[6rem] leading-[0.8em] font-light text-[#FF5733] tracking-tighter"
              >
                0
              </span>
              <span className="percent-sign text-xl lg:text-3xl font-light text-[#FF5733] mb-1 lg:mb-3">
                %
              </span>
            </div>
          </div>

        </div>

        {/* THE PROGRESS BAR */}
        <div className="progress-container w-full h-[2px] bg-zinc-800 relative overflow-hidden">
          <div
            ref={barRef}
            className="absolute top-0 left-0 h-full w-full bg-[#f3f3f3] origin-left scale-x-0"
          ></div>
        </div>

      </div>
    </div>
  );
};

export default Preloader;