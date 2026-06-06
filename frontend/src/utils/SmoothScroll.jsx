import React, { useEffect, useRef } from "react";
import Lenis from "lenis"; // Note: Use '@studio-freight/lenis' if on the older package version
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLocation } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

const SmoothScroll = ({ children }) => {
  const lenisRef = useRef(null);
  const { pathname } = useLocation();

  // 1. Initialize Lenis and Sync with GSAP
  useEffect(() => {
    // Create the Lenis instance
    const lenis = new Lenis({
      duration: 1.2, // The standard high-end feeling duration
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Standard ease-out
      direction: "vertical",
      gestureDirection: "vertical",
      smooth: true,
      smoothTouch: false, // Keep native scrolling on touch devices
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    // A. Sync ScrollTrigger with Lenis' scroll events
    lenis.on("scroll", ScrollTrigger.update);

    // B. Slave Lenis's RAF loop to GSAP's global ticker
    // This guarantees both libraries execute on the exact same frame
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    // C. Disable GSAP's lag smoothing
    // If the browser stutters, GSAP attempts to correct it, which desyncs it from Lenis. This locks them together.
    gsap.ticker.lagSmoothing(0);

    return () => {
      // Clean up on unmount to prevent memory leaks
      gsap.ticker.remove((time) => {
        lenis.raf(time * 1000);
      });
      lenis.destroy();
    };
  }, []);

  // 2. Handle React SPA Route Changes
  useEffect(() => {
    if (lenisRef.current) {
      // A. Instantly reset the scrollbar to the very top before the new page renders
      lenisRef.current.scrollTo(0, { immediate: true });

      // B. Force GSAP to recalculate all ScrollTrigger start/end points.
      // We wrap this in a short timeout because React needs a few milliseconds 
      // to paint the new DOM nodes of the next page before GSAP can measure their heights.
      const refreshTimeout = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);

      return () => clearTimeout(refreshTimeout);
    }
  }, [pathname]); // This triggers every time the route URL changes

  return <>{children}</>;
};

export default SmoothScroll;