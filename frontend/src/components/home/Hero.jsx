import React, { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Icon } from "@iconify/react";

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

  useGSAP(
    () => {
      const tl = gsap.timeline();

      // --- INITIAL STATES (PREMIUM) ---
      gsap.set(".hero-img", {
        clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
      });
      gsap.set(".hero-img img", { scale: 1.2 });

      // Cinematic Lens Focus state
      gsap.set(".first-name", { 
        scale: 1.05, 
        opacity: 0, 
        filter: "blur(12px)", 
        y: 10 
      });

      // Physical Sliding Door state
      gsap.set(".hero-txt", {
        yPercent: 120,
        skewY: 6,
        transformOrigin: "left top",
      });

      gsap.set(".loc-time", { y: 20, opacity: 0 });
      gsap.set(".book-badge-wrap", { scale: 0 });

      // --- ANIMATION TIMELINE ---
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
            force3D: true,
          },
          "hero-reveal",
        )
        // High-end cinematic blur to focus reveal
        .to(
          ".first-name",
          {
            scale: 1,
            opacity: 1,
            filter: "blur(0px)",
            y: 0,
            duration: 2.2,
            ease: "power3.inOut",
            force3D: true,
          },
          "hero-reveal"
        )
        // Solid physical mask reveal
        .to(
          ".hero-txt",
          {
            yPercent: 0,
            skewY: 0,
            duration: 1.2,
            stagger: 0.1,
            ease: "power4.out",
          },
          "hero-reveal+=0.8",
        )
        .to(
          ".loc-time",
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
          },
          "hero-reveal+=1.0",
        )
        // Clean, direct, bounce-free scale pop
        .to(
          ".book-badge-wrap",
          {
            scale: 1,
            duration: 0.8,
            ease: "power4.out",
          },
          "hero-reveal+=1.0",
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
          <span className="first-name relative leading-[0.75em] bg-clip-text text-transparent bg-[length:4px_4px] bg-[radial-gradient(circle,_rgba(255,255,255,0.5)_1px,_transparent_1px)] lg:bg-[radial-gradient(circle,_rgba(255,255,255,0.3)_1px,_transparent_1px)]">
            falguni
          </span>
        </h1>
      </div>

      <div className="bottom-hero w-full flex flex-col lg:flex-row mt-10 lg:mt-0">
        <div className="bottom-hero-left w-full lg:w-1/2 head-txt text-[2.4rem] lg:text-[3.2rem] px-5 lg:px-10 leading-[1.2em]">
          <div className="overflow-hidden py-2 -my-2">
            <h2 className="w-full hero-txt">
              Full stack <span className="italic prime-txt">MERN</span>{" "}
              developer
            </h2>
          </div>

          <div className="overflow-hidden py-2 -my-2 mt-1 lg:mt-0">
            <h2 className="w-full text-right dim-txt hero-txt">
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

        <div className="bottom-hero-right w-full lg:w-1/2 flex justify-end px-5 lg:px-10 relative z-0 top-10 lg:-top-10">
          <div className="hero-img img-container w-[280px] h-[380px]">
            <img
              className="w-full h-full object-cover"
              src="/me.webp"
              alt="falguni_mondal_image"
            />
          </div>

          <div className="book-badge-wrap absolute bottom-5 left-5 lg:bottom-5 lg:left-48 z-20">
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
    </section>
  );
};

export default Hero;