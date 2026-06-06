import React, { useRef, useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const Hero = () => {
  const heroRef = useRef(null);

  // --- CLOCK STATE ---
  const [time, setTime] = useState(new Date());
  const [showColon, setShowColon] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
      setShowColon((prev) => !prev); 
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const timeString = time.toLocaleTimeString("en-US", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
  });

  const [timeParts, ampm] = timeString.split(" ");
  const [hours, minutes] = timeParts.split(":");

  // --- PREMIUM GSAP ANIMATIONS ---
  useGSAP(
    () => {
      const tl = gsap.timeline();

      // INITIAL STATES
      gsap.set(".hero-img", {
        clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
      });
      gsap.set(".hero-img img", { scale: 1.2 });

      // FIXED: Animating the new hardware-accelerated wrapper, not the text span directly
      gsap.set(".name-wrapper", { 
        scale: 1.08, // Slightly reduced scale distance for smoother travel
        opacity: 0, 
        filter: "blur(12px)", // Reduced radius: Less math for the GPU, still highly cinematic
        y: 20 
      });

      gsap.set(".hero-txt", {
        yPercent: 120,
        skewY: 6,
        transformOrigin: "left top",
      });

      gsap.set(".loc-time", { y: 20, opacity: 0 });
      gsap.set(".book-badge-wrap", { scale: 0 });

      // ANIMATION TIMELINE
      tl.to(
        ".hero-img",
        {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          duration: 1.8,
          ease: "power4.inOut",
        },
        "hero-reveal",
      )
        .to(
          ".hero-img img",
          {
            scale: 1,
            duration: 1.8,
            ease: "power4.inOut",
            force3D: true, // Forces GPU acceleration on the image
          },
          "hero-reveal",
        )
        // FIXED: Smoother easing curve ('power3.out' pushes through the heavy blur quickly, settles gently)
        .to(
          ".name-wrapper",
          {
            scale: 1,
            opacity: 1,
            filter: "blur(0px)",
            y: 0,
            duration: 2.5, // Lengthened slightly for a more luxurious feel
            ease: "power3.out",
            force3D: true, // Crucial for blur performance
          },
          "hero-reveal" 
        )
        .to(
          ".hero-txt",
          {
            yPercent: 0,
            skewY: 0,
            duration: 1.2,
            stagger: 0.1,
            ease: "power4.out",
          },
          "hero-reveal+=0.8"
        )
        .to(
          ".loc-time",
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
          },
          "hero-reveal+=1.0"
        )
        .to(
          ".book-badge-wrap",
          {
            scale: 1,
            duration: 0.8,
            ease: "power4.out",
          },
          "hero-reveal+=1.0"
        );
    },
    { scope: heroRef },
  );

  return (
    <section
      ref={heroRef}
      className="h-[calc(100dvh-60px)] relative overflow-hidden flex flex-col justify-between"
      id="hero-section"
    >
      <div className="top-name-hero w-full pt-4 px-5 lg:px-10 pointer-events-none z-10">
        {/* NEW: Hardware-accelerated wrapper handles the blur & scale, keeping the text rendering fast */}
        <div className="name-wrapper w-full relative z-10 -ml-[1vw] lg:-ml-[1.3vw] will-change-[filter,transform,opacity]">
          <h1 className="my-name uppercase text-[23.5vw] lg:text-[25vw] w-full font-bold tracking-tighter leading-[0.75em]">
            <span className="first-name block relative leading-[0.75em] bg-clip-text text-transparent bg-[length:4px_4px] bg-[radial-gradient(circle,_rgba(255,255,255,0.5)_1px,_transparent_1px)] lg:bg-[radial-gradient(circle,_rgba(255,255,255,0.3)_1px,_transparent_1px)]">
              falguni
            </span>
          </h1>
        </div>
      </div>

      <div className="bottom-hero w-full flex flex-col lg:flex-row mt-5 lg:mt-0 relative z-20 pb-8 lg:pb-0">
        
        {/* LEFT BLOCK: Text and Location */}
        <div className="bottom-hero-left w-full lg:w-1/2 head-txt text-[2rem] lg:text-[3.7rem] px-5 lg:px-10 leading-none flex flex-col justify-center">
          <div className="overflow-hidden py-2 -my-2">
            <h2 className="w-full hero-txt block">
              Full stack <span className="italic prime-txt">MERN</span>{" "}
              developer
            </h2>
          </div>

          <div className="overflow-hidden py-2 -my-2 mt-1 lg:mt-0">
            <h2 className="w-full text-right dim-txt hero-txt block">
              Building your brand's unfair advantage.
            </h2>
          </div>

          <div className="loc-time body-txt text-left mt-6 lg:mt-12 text-[0.65rem] lg:text-[0.75rem] font-medium uppercase tracking-[0.2em] dim-txt flex items-center gap-3 w-full">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              Based in Kolkata, India
            </span>
            <span className="w-[1px] h-[12px] bg-zinc-600"></span>
            <span>
              {hours}
              <span
                className={`transition-opacity duration-75 ${showColon ? "opacity-100" : "opacity-0"}`}
              >
                :
              </span>
              {minutes} {ampm}
            </span>
          </div>
        </div>

        {/* RIGHT BLOCK: Image and Interactive Badge */}
        <div className="bottom-hero-right w-full lg:w-1/2 flex justify-end px-5 lg:px-10 relative z-0 top-10 lg:-top-10">
          <div className="relative">
            
            {/* Image Container */}
            <div className="hero-img img-container w-[280px] h-[380px]">
              <img
                className="w-full h-full object-cover"
                src="/me.webp"
                alt="falguni_mondal_image"
              />
            </div>

            {/* GSAP Outer Wrapper */}
            <div className="book-badge-wrap absolute -bottom-5 -right-5 lg:bottom-5 lg:-left-60 z-20">
              
              {/* CSS Hover Wrapper */}
              <div className="w-[110px] h-[110px] lg:w-[140px] lg:h-[140px] prime-bg rounded-full flex items-center justify-center text-zinc-900 cursor-pointer shadow-xl hover:scale-105 transition-transform duration-300">
                <Icon
                  icon="material-symbols:arrow-outward"
                  className="absolute text-4xl lg:text-5xl pointer-events-none"
                />

                {/* Infinite Spin SVG */}
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full animate-[spin_8s_linear_infinite] pointer-events-none"
                >
                  <path
                    id="circlePath"
                    d="M 50, 50 m -34, 0 a 34,34 0 1,1 68,0 a 34,34 0 1,1 -68,0"
                    fill="transparent"
                  />
                  <text
                    className="text-[0.6rem] uppercase tracking-[0.18em]"
                    fill="currentColor"
                  >
                    <textPath href="#circlePath" startOffset="0%">
                      book a call • book a call •
                    </textPath>
                  </text>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;