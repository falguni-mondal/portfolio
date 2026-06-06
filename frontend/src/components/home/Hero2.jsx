import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const Hero = () => {
  const heroRef = useRef(null);

  useGSAP(
    () => {
      const tl = gsap.timeline();

      // --- INITIAL STATES ---
      gsap.set(".hero-img", {
        clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
      });
      gsap.set(".hero-img img", { scale: 1.2 });

      gsap.set(".first-name", { y: 100, opacity: 0, skewY: 5 });
      
      gsap.set(".hero-txt", { 
        yPercent: 120, 
        skewY: 6, 
        opacity: 0,
        transformOrigin: "left top" 
      });

      // --- ANIMATION TIMELINE ---
      tl.to(
        ".hero-img",
        {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          duration: 1.6,
          ease: "power4.inOut",
        },
        "hero-reveal",
      )

        .to(
          ".hero-img img",
          {
            scale: 1,
            duration: 1.6,
            ease: "power4.inOut",
            force3D: true,
          },
          "hero-reveal",
        )

        .to(
          ".hero-txt",
          {
            yPercent: 0,
            skewY: 0,
            opacity: 1,
            duration: 1.5,
            stagger: 0.15,
            ease: "expo.out", 
          },
          "-=1.1", 
        )

        .to(
          ".first-name",
          {
            y: 0,
            opacity: 1,
            skewY: 0,
            duration: 1.2,
            ease: "power4.out",
          },
          "-=0.9",
        );
    },
    { scope: heroRef },
  );

  return (
    <section
      ref={heroRef}
      className="h-[calc(100dvh-60px)] relative overflow-hidden"
      id="hero-section"
    >
      {/* Added lg:px-10 to match the bottom container */}
      <div className="top-name-hero w-full pt-4 px-5 lg:px-10 pointer-events-none">
        
        {/* Added -ml-[1vw] for mobile and lg:-ml-[0.5vw] for desktop to pull the text flush left to counter the font's internal side-bearing */}
        <h1 className="my-name uppercase text-[23.5vw] lg:text-[25vw] w-full font-bold tracking-tighter leading-[0.75em] relative z-10 -ml-[1vw] lg:-ml-[1.3vw]">
          <span
            className="first-name relative leading-[0.75em] bg-clip-text text-transparent bg-[length:4px_4px] bg-[radial-gradient(circle,_rgba(255,255,255,0.5)_1px,_transparent_1px)] lg:bg-[radial-gradient(circle,_rgba(255,255,255,0.3)_1px,_transparent_1px)]"
          >
            falguni
          </span>
        </h1>
      </div>
      
      <div className="bottom-hero w-full flex flex-col lg:flex-row mt-10 lg:mt-0">
        <div className="bottom-hero-left w-full lg:w-1/2 head-txt text-[2.4rem] lg:text-[3.2rem] px-5 lg:px-10 leading-[1.2em]">
          
          <div className="overflow-hidden py-2 -my-2">
            <h2 className="w-full hero-txt">
              Full stack <span className="italic prime-txt">MERN</span> developer
            </h2>
          </div>
          
          <div className="overflow-hidden py-2 -my-2 mt-1 lg:mt-0">
            <h2 className="w-full text-right dim-txt hero-txt">
              Building your brand's unfair advantage.
            </h2>
          </div>

        </div>

        <div className="bottom-hero-right w-full lg:w-1/2 flex justify-end px-5 lg:px-10 relative z-0 top-10 lg:-top-10">
              <div className="hero-img img-container w-[280px] h-[380px]">
                <img className="w-full h-full object-cover" src="/me.webp" alt="falguni_mondal_image" />
              </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;