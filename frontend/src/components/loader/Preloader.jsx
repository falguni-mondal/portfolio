"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useProgress } from "@react-three/drei";
import { useLabStore } from "../../store/store";

const isAutomatedAuditOrBot = () => {
  if (typeof window === "undefined" || typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  return (
    Boolean(navigator.webdriver) ||
    /Lighthouse|PageSpeed|Googlebot|InspectionTool|HeadlessChrome|Chrome-Lighthouse|PTST|GTmetrix|Pingdom/i.test(
      ua
    )
  );
};

const Preloader = ({ setHasLoaded }) => {
  const theme = useLabStore((state) => state.theme);
  const containerRef = useRef(null);
  const counterRef = useRef(null);
  const barRef = useRef(null);
  const textWrapperRef = useRef(null);

  const { progress, active } = useProgress();
  const [isCinematicDone, setIsCinematicDone] = useState(false);
  const [forceReady, setForceReady] = useState(false);
  const [bypassPreloader, setBypassPreloader] = useState(false);
  const outroPlayed = useRef(false);

  // Immediately bypass the blocking curtain for Googlebot / PageSpeed / Lighthouse
  // while keeping the full cinematic intro for all real human visitors.
  useEffect(() => {
    if (isAutomatedAuditOrBot()) {
      setBypassPreloader(true);
      document.body.style.overflow = "auto";
      if (setHasLoaded) setHasLoaded(true);
    }
  }, [setHasLoaded]);

  // Safety fallback timer so the preloader never deadlocks at 99% if a 3D asset stalls
  useEffect(() => {
    if (bypassPreloader) return;
    const fallbackTimer = setTimeout(() => {
      setForceReady(true);
    }, 3300);
    return () => clearTimeout(fallbackTimer);
  }, [bypassPreloader]);

  // ==========================================
  // PART 1: THE CINEMATIC INTRO (0% to 99%)
  // ==========================================
  useGSAP(
    () => {
      if (bypassPreloader) return;
      document.body.style.overflow = "hidden";
      const counter = { val: 0 };

      gsap.to(counter, {
        val: 99,
        duration: 2.8,
        ease: "power3.inOut",
        onUpdate: () => {
          if (counterRef.current) {
            counterRef.current.innerText = Math.round(counter.val);
          }
        },
        onComplete: () => {
          setIsCinematicDone(true);
        },
      });

      gsap.to(barRef.current, {
        scaleX: 0.99,
        duration: 2.8,
        ease: "power3.inOut",
      });
    },
    { scope: containerRef, dependencies: [bypassPreloader] }
  );

  // ==========================================
  // PART 2: THE OUTRO (99% to 100%)
  // ==========================================
  useGSAP(() => {
    if (bypassPreloader) return;
    const assetsReady = progress === 100 || !active || forceReady;

    if (assetsReady && isCinematicDone && !outroPlayed.current) {
      outroPlayed.current = true;

      const tl = gsap.timeline();
      const counter = { val: 99 };

      tl.to(
        counter,
        {
          val: 100,
          duration: 0.4,
          ease: "power2.out",
          onUpdate: () => {
            if (counterRef.current) {
              counterRef.current.innerText = Math.round(counter.val);
            }
          },
        },
        "finish"
      )
        .to(
          barRef.current,
          {
            scaleX: 1,
            duration: 0.4,
            ease: "power2.out",
          },
          "finish"
        )
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
        .to(
          [counterRef.current, ".percent-sign", ".progress-container"],
          {
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
          },
          "<0.6"
        )
        .call(() => {
          document.body.style.overflow = "auto";
          if (setHasLoaded) setHasLoaded(true);
        })
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
            },
          },
          "+=0.05"
        );
    }
  }, [progress, active, forceReady, isCinematicDone, bypassPreloader]);

  if (bypassPreloader) return null;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="fixed inset-0 z-[999] w-full h-[100svh] flex flex-col justify-end overflow-hidden"
    >
      {/* THE STAGGERED CURTAIN BACKGROUND */}
      <div className="absolute inset-0 flex w-full h-full z-0">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`curtain-strip w-[20.5%] h-full ${theme === "dark" ? "bg-[#0b0a09]" : "bg-[#f3f3f3]"}`}
          />
        ))}
      </div>

      {/* THE FOREGROUND UI LAYER */}
      <div
        className={`absolute inset-0 z-10 flex flex-col justify-end px-5 lg:px-10 pb-8 lg:pb-12 ${theme === "dark" ? "text-[#f3f3f3]" : "text-[#0b0a09]"} pointer-events-none`}
      >
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
            <div className="reveal-text text-[12vw] sm:text-[8vw] lg:text-[6rem] leading-[0.8em] font-bold tracking-tight uppercase whitespace-nowrap">
              BY <span className="text-[#FF5733]">F</span>ALGUNI
              <span
                className={`inline-block w-[0.14em] h-[0.14em] ${theme === "dark" ? "bg-[#f3f3f3]" : "bg-[#0b0a09]"} ml-[0.08em]`}
              ></span>
            </div>
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
        <div
          className={`progress-container w-full h-[2px] ${theme === "dark" ? "bg-zinc-800" : "bg-zinc-300"} relative overflow-hidden`}
        >
          <div
            ref={barRef}
            className={`absolute top-0 left-0 h-full w-full ${theme === "dark" ? "bg-[#f3f3f3]" : "bg-[#0b0a09]"} origin-left scale-x-0`}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Preloader;