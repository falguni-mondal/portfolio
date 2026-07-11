import React, { useEffect, useRef } from "react";
import Lenis from "lenis"; 
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
      duration: 1.2, 
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
      direction: "vertical",
      gestureDirection: "vertical",
      smooth: true,
      
      // ==========================================
      // THE FIX: MOBILE MAIN-THREAD HIJACK
      // ==========================================
      // This forces mobile touch events to be processed by JavaScript instead of hardware.
      // This locks the DOM and the React Three Fiber Canvas to the exact same tick, eliminating WebGL desync.
      syncTouch: true, 
      smoothTouch: true, 
      
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