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
      // ==========================================
      // THE PHYSICS UPGRADE
      // ==========================================
      // Deleted `duration` and `easing`.
      // Lerp (0 to 1) creates natural real-world friction. 
      // 0.08 is the sweet spot for a weighty, premium momentum feel.
      lerp: 0.08, 
      
      direction: "vertical",
      gestureDirection: "vertical",
      smooth: true,
      
      // Keeps the DOM and WebGL perfectly synced
      syncTouch: true, 
      smoothTouch: true, 
      
      // ==========================================
      // THE SPEED FIX
      // ==========================================
      // Reduced from 2 to 1. This gives you exact 1:1 finger tracking.
      touchMultiplier: 1, 
      wheelMultiplier: 1, 
    });

    lenisRef.current = lenis;

    // A. Sync ScrollTrigger with Lenis' scroll events
    lenis.on("scroll", ScrollTrigger.update);

    // B. Slave Lenis's RAF loop to GSAP's global ticker
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    // C. Disable GSAP's lag smoothing
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