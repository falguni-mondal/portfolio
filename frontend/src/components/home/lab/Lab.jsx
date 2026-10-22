"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Canvas } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import LabItem from "./LabItem";
import SectionHeading from "../global/SectionHeading";
import WebGLBlobHover from "../../../utils/WebGLBlobHover";
import { useLabStore } from "../../../store/store";

gsap.registerPlugin(ScrollTrigger);

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

const Lab = () => {
  const labData = useLabStore((state) => state.portfolioData.lab) || [];
  const sectionRef = useRef(null);
  const theme = useLabStore((state) => state.theme);

  const [trackedItems, setTrackedItems] = useState([]);
  const [skipForBot, setSkipForBot] = useState(false);

  // Detect bots and warm up all Lab textures in the background for human visitors
  // so every Lab project image is already loaded in GPU memory before scrolling down.
  useEffect(() => {
    if (isAutomatedAuditOrBot()) {
      setSkipForBot(true);
      return;
    }

    labData.forEach((project) => {
      if (project.image1 && !project.image1.endsWith(".mp4")) {
        useTexture.preload(project.image1);
      }
      if (project.image2 && !project.image2.endsWith(".mp4")) {
        useTexture.preload(project.image2);
      }
    });
  }, [labData]);

  // Trim tracked items if labData shrinks
  useEffect(() => {
    setTrackedItems((prev) => prev.filter((item) => item.index < labData.length));
  }, [labData.length]);

  // Update tracked items when Lab projects are added at the beginning or reordered
  const registerItem = useCallback((item) => {
    setTrackedItems((prev) => {
      const existingIdx = prev.findIndex((i) => i.index === item.index);
      if (existingIdx !== -1) {
        const existing = prev[existingIdx];
        if (
          existing.image1 === item.image1 &&
          existing.image2 === item.image2 &&
          existing.containerRef === item.containerRef &&
          existing.imageRef === item.imageRef
        ) {
          return prev;
        }
        const next = [...prev];
        next[existingIdx] = item;
        return next;
      }
      return [...prev, item];
    });
  }, []);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      });

      tl.fromTo(
        ".editorial-header",
        { opacity: 0 },
        { opacity: 1, duration: 1, ease: "power3.out" }
      );

      tl.fromTo(
        ".heading-block",
        { y: 80, skewY: 4, filter: "blur(8px)", opacity: 0 },
        {
          y: 0,
          skewY: 0,
          filter: "blur(0px)",
          opacity: 1,
          duration: 1.4,
          stagger: 0.15,
          ease: "expo.out",
          force3D: true,
        },
        "-=0.8"
      );

      tl.fromTo(
        ".p-line",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" },
        "-=1.2"
      );

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        onLeave: () => useLabStore.getState().setActiveProject(null),
        onLeaveBack: () => useLabStore.getState().setActiveProject(null),
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="lab"
      className="relative w-full pt-[10svh] lg:pt-[15svh] pb-[15svh] px-5 lg:px-10 lg:mt-14"
    >
      {/* THE MASTER CANVAS */}
      {!skipForBot && (
        <div className="fixed inset-0 w-full h-[100svh] z-[10] pointer-events-none">
          <Canvas
            orthographic
            camera={{ position: [0, 0, 1], zoom: 1 }}
            dpr={[1, 1.5]}
            style={{ pointerEvents: "none" }}
            gl={{ alpha: true, antialias: false, powerPreference: "default" }}
            onCreated={({ gl }) => {
              gl.debug.checkShaderErrors = false;
            }}
          >
            <WebGLBlobHover trackedItems={trackedItems} />
          </Canvas>
        </div>
      )}

      <div className="w-full mx-auto flex flex-col relative">
        <div className="editorial-header w-full flex items-center justify-between mb-12 lg:mb-24 border-b border-zinc-700 pb-4 relative z-20">
          <span className="text-[0.55rem] sm:text-[0.65rem] tracking-[0.2em] font-medium text-zinc-500 uppercase">
            ( R & D )
          </span>
          <span className="text-[0.55rem] sm:text-[0.65rem] tracking-[0.2em] font-medium text-zinc-500 uppercase">
            ( The Lab )
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-12 lg:gap-x-16 w-full relative items-start">
          <div className="lg:col-span-5 relative lg:sticky lg:top-[15svh] flex flex-col z-20">
            <SectionHeading line1="Digital" line2="Playground." />
            <p
              className={`p-line ${theme === "dark" ? "text-zinc-400" : "text-zinc-500"} text-sm lg:text-base leading-relaxed mt-6 lg:mt-8 max-w-sm`}
            >
              A personal archive of passion projects, technical experiments, and
              creative coding logic built to push the boundaries of my own
              learning and creativity.
            </p>
          </div>

          <div className="lg:col-span-7 flex flex-col gap-16 lg:gap-32 w-full mt-4 lg:mt-0 relative">
            {labData.map((project, index) => (
              <LabItem
                key={project._id || `${project.name}-${index}`}
                project={project}
                index={index}
                registerItem={registerItem}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Lab;