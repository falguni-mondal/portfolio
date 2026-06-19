import React, { useEffect, useRef, useState, useContext } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Icon } from "@iconify/react";

import { LoadingContext } from "../../App";
import { useLabStore } from "../../store/store";
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const Hero = () => {
  const heroRef = useRef(null);
  const btnRef = useRef(null);
  const textRef = useRef(null);
  const fillRef = useRef(null);

  // Grab the loading state from our Context
  const hasLoaded = useContext(LoadingContext);

  const theme = useLabStore((state) => state.theme);

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
      gsap.set(".hero-img", {
        clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
      });
      gsap.set(".hero-img img", { scale: 1.2 });

      gsap.set(".first-name", {
        scale: 1.05,
        opacity: 0,
        filter: "blur(12px)",
        y: 10,
        willChange: "filter, transform, opacity",
      });

      gsap.set(".hero-txt", {
        yPercent: 120,
        skewY: 6,
        transformOrigin: "left top",
      });

      gsap.set(".loc-time", { y: 20, opacity: 0 });
      gsap.set(".book-badge-wrap", { scale: 0 });

      // Initialize the liquid fill for the CTA button
      gsap.set(fillRef.current, { xPercent: -50, yPercent: 100 });

      // ==========================================
      if (!hasLoaded) return;

      // ==========================================
      // ANIMATION TIMELINE
      // ==========================================
      const tl = gsap.timeline({
        onComplete: () => {
          ScrollTrigger.refresh();
        },
      });

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
        .to(
          ".first-name",
          {
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 2.4,
            ease: "power3.out",
            force3D: true,
          },
          "hero-reveal",
        )
        .to(
          ".first-name",
          {
            filter: "blur(0px)",
            duration: 1.8,
            ease: "power2.inOut",
          },
          "hero-reveal",
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
    { 
      scope: heroRef, 
      dependencies: [hasLoaded]
    },
  );

  // --- MAGNETIC BUTTON INTERACTION LOGIC --- //

  const handleMouseEnter = () => {
    gsap.killTweensOf(fillRef.current);
    gsap.killTweensOf(textRef.current);

    gsap.fromTo(
      fillRef.current,
      { yPercent: 100, xPercent: -50 },
      { yPercent: -25, xPercent: -50, duration: 0.8, ease: "power3.out" },
    );
    gsap.to(textRef.current, { color: ()=> theme === "dark" ? "#0b0a09" : "#f3f3f3", duration: 0.3 });
  };

  const handleMouseMove = (e) => {
    if (!btnRef.current || !textRef.current) return;

    const { left, top, width, height } = btnRef.current.getBoundingClientRect();
    const x = e.clientX - (left + width / 2);
    const y = e.clientY - (top + height / 2);

    gsap.to(btnRef.current, {
      x: x * 0.5,
      y: y * 0.5,
      duration: 0.6,
      ease: "power3.out",
    });
    gsap.to(textRef.current, {
      x: x * 0.2,
      y: y * 0.2,
      duration: 0.6,
      ease: "power3.out",
    });
  };

  const handleMouseLeave = () => {
    gsap.killTweensOf(fillRef.current);
    gsap.killTweensOf(textRef.current);

    gsap.to(fillRef.current, {
      yPercent: -150,
      xPercent: -50,
      duration: 0.6,
      ease: "power3.inOut",
    });
    gsap.to(textRef.current, { color: ()=> theme === "dark" ? "#f3f3f3" : "#0b0a09", duration: 0.5 });

    gsap.to([btnRef.current, textRef.current], {
      x: 0,
      y: 0,
      duration: 0.8,
      ease: "elastic.out(1.2, 0.4)",
    });
  };

  return (
    <section
      ref={heroRef}
      className="h-[calc(100svh-60px)] max-h-[880px] relative lg:overflow-hidden w-full"
      id="hero"
    >
      <div className="top-name-hero w-full pt-4 px-5 lg:px-10 pointer-events-none">
        <h1 className="my-name uppercase text-[23.5vw] lg:text-[25vw] xl:text-[25vw] 2xl:text-[25.3vw] w-full font-bold tracking-tighter leading-[0.75em] relative z-10 -ml-[1vw] lg:-ml-[1.3vw]">
          <span className={`first-name inline-block relative leading-[0.75em] bg-clip-text text-transparent bg-[length:4px_4px] ${theme == "dark" ? "bg-[radial-gradient(circle,_rgba(255,255,255,0.5)_1px,_transparent_1px)] lg:bg-[radial-gradient(circle,_rgba(255,255,255,0.3)_1px,_transparent_1px)]" : "bg-[radial-gradient(circle,_rgba(0,0,0,0.5)_1px,_transparent_1px)] lg:bg-[radial-gradient(circle,_rgba(0,0,0,0.5)_1px,_transparent_1px)]"}`}>
            falguni
          </span>
        </h1>
      </div>

      <div className="bottom-hero w-full flex flex-col lg:flex-row mt-10 lg:mt-0">
        <div className="bottom-hero-left w-full lg:w-1/2 2xl:w-[53%] head-txt text-[1.8rem] lg:text-[3rem] 2xl:text-[4rem] px-5 lg:px-10 leading-[1.2em]">
          <div className="overflow-hidden py-2 -my-2">
            <h2 className="w-full hero-txt">
              Full stack <span className="italic prime-txt body-txt">MERN</span>{" "}
              developer
            </h2>
          </div>

          <div className="overflow-hidden py-2 -my-2 mt-1 lg:mt-0">
            <h2 className="w-full text-right hero-txt">
              Building your brand's unfair advantage.
            </h2>
          </div>

          <div className="loc-time body-txt text-left mt-6 lg:mt-12 2xl:mt-20 text-[0.65rem] lg:text-[0.75rem] 2xl:text-[1rem] font-medium uppercase tracking-[0.2em] dim-txt flex items-center gap-3 w-full">
            <span className="flex items-center gap-2 2xl:gap-3">
              <span className="w-1.5 h-1.5 2xl:w-2 2xl:h-2 rounded-full bg-green-500 animate-pulse"></span>
              Based in Durgapur, India
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

        <div className="bottom-hero-right w-full lg:w-1/2 2xl:[47%] flex justify-end px-5 lg:px-10 relative z-0 top-10 lg:-top-10 2xl:-top-16">
          <div className="hero-img img-container w-[280px] h-[380px] 2xl:w-[360px] 2xl:h-auto">
            <img
              className="w-full h-full object-cover"
              src="/me.webp"
              alt="falguni_mondal_image"
            />
          </div>

          {/* THE WRAPPER: Handles the initial timeline scale animation */}
          <div className="book-badge-wrap absolute bottom-5 left-5 lg:bottom-5 lg:left-48 xl:left-44 2xl:left-52 2xl:bottom-10 z-20">
            
            <a
              href="#contact"
              ref={btnRef}
              onMouseEnter={handleMouseEnter}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative flex items-center justify-center w-28 h-28 lg:w-32 lg:h-32 2xl:w-40 2xl:h-40 rounded-full bg-[#FF5733] overflow-hidden cursor-pointer border-none outline-none shadow-xl"
            >
              {/* Liquid Fill */}
              <div
                ref={fillRef}
                className={`absolute top-0 left-1/2 w-[150%] h-[150%] ${theme === "dark" ? "bg-[#f3f3f3]" : "bg-[#0b0a09]"} rounded-[50%] z-0 pointer-events-none`}
              ></div>

              {/* Text + Arrow */}
              <span
                ref={textRef}
                className={`relative z-10 flex items-center gap-1 ${theme === "dark" ? "text-[#f3f3f3]" : "text-[#0b0a09]"} text-sm 2xl:text-base pointer-events-none font-medium lg:font-normal`}
              >
                Hey there
                <Icon
                  icon="material-symbols:arrow-outward-rounded"
                  className="text-sm lg:text-base 2xl:text--lg"
                />
              </span>
            </a>
            
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;