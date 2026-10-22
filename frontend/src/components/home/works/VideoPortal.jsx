"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const VideoPortal = ({ projects, activeIndex }) => {
  const portalRef = useRef(null);
  const filmstripRef = useRef(null);
  const videoRefs = useRef([]);
  const [isMobile, setIsMobile] = useState(false);
  const [shouldLoadVideos, setShouldLoadVideos] = useState(false);

  // 1. Native Window Resize Listener
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1023px)");
    setIsMobile(mediaQuery.matches);

    const handleResize = (e) => setIsMobile(e.matches);
    mediaQuery.addEventListener("change", handleResize);
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  // 2. Lazy-load video sources when the user approaches #works (or hovers a work item)
  // Prevents downloading 4+ multi-MB MP4 streams during initial page load.
  useEffect(() => {
    if (activeIndex !== null) {
      setShouldLoadVideos(true);
      return;
    }
    const worksSection = document.getElementById("works");
    if (!worksSection || typeof IntersectionObserver === "undefined") {
      setShouldLoadVideos(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoadVideos(true);
          observer.disconnect();
        }
      },
      { rootMargin: "700px 0px" }
    );
    observer.observe(worksSection);
    return () => observer.disconnect();
  }, [activeIndex]);

  // 3. Play only the currently hovered/active video and pause off-screen ones to save CPU/GPU
  useEffect(() => {
    if (!shouldLoadVideos) return;
    videoRefs.current.forEach((videoEl, idx) => {
      if (!videoEl) return;
      if (idx === activeIndex) {
        videoEl.play().catch(() => {});
      } else {
        videoEl.pause();
      }
    });
  }, [activeIndex, shouldLoadVideos]);

  // 4. High-Performance Mouse Tracking (Desktop Only)
  useEffect(() => {
    if (isMobile) {
      gsap.set(portalRef.current, { clearProps: "top,left" });
      return;
    }

    const xTo = gsap.quickTo(portalRef.current, "left", {
      duration: 0.6,
      ease: "power3.out",
    });
    const yTo = gsap.quickTo(portalRef.current, "top", {
      duration: 0.6,
      ease: "power3.out",
    });

    const handleMouseMove = (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isMobile]);

  // 5. The Reveal and Slide Logic
  useGSAP(() => {
    gsap.set(portalRef.current, {
      xPercent: isMobile ? 0 : -50,
      yPercent: isMobile ? 0 : -50,
    });

    gsap.to(portalRef.current, {
      scale: activeIndex !== null ? 1 : 0,
      duration: 0.5,
      ease: "power4.out",
    });

    if (activeIndex !== null) {
      gsap.to(filmstripRef.current, {
        y: `${-activeIndex * 100}%`,
        duration: 0.6,
        ease: "power3.inOut",
      });
    }
  }, [activeIndex, isMobile]);

  return (
    <div
      ref={portalRef}
      className={`fixed z-50 overflow-hidden scale-0 rounded-sm pointer-events-none shadow-2xl ${
        isMobile
          ? "bottom-8 right-10 w-[200px] h-[125px] origin-bottom-right border border-zinc-800"
          : "top-0 left-0 w-[420px] h-[240px] origin-center"
      }`}
    >
      <div ref={filmstripRef} className="w-full h-full flex flex-col">
        {projects.map((project, index) => (
          <div key={index} className="w-full h-full flex-shrink-0 bg-zinc-900 relative">
            {project.videoUrl ? (
              <video
                ref={(el) => {
                  videoRefs.current[index] = el;
                }}
                src={shouldLoadVideos ? project.videoUrl : undefined}
                preload={shouldLoadVideos ? "metadata" : "none"}
                loop
                muted
                playsInline
                className="w-full h-full object-cover opacity-80"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-zinc-500 font-mono text-[0.65rem] uppercase tracking-[0.2em]">
                {project.isOngoing ? "Work In Progress" : "Preview Unavailable"}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoPortal;