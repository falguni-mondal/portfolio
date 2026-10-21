"use client";

import React, { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const SmoothScroll = ({ children }) => {
  const lenisRef = useRef(null);
  const pathname = usePathname();

  // 1. Initialize Lenis and Sync with GSAP
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.08,
      direction: "vertical",
      gestureDirection: "vertical",
      smooth: true,
      syncTouch: true,
      smoothTouch: true,
      touchMultiplier: 1,
      wheelMultiplier: 1,
    });

    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const updateTicker = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
    };
  }, []);

  // 2. Handle Next.js App Router Route Changes
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });

      const refreshTimeout = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);

      return () => clearTimeout(refreshTimeout);
    }
  }, [pathname]);

  return <>{children}</>;
};

export default SmoothScroll;
