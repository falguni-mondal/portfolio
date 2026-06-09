import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const VideoPortal = ({ projects, activeIndex }) => {
  const portalRef = useRef(null);
  const filmstripRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  // 1. Native Window Resize Listener
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 1023px)');
    setIsMobile(mediaQuery.matches);

    const handleResize = (e) => setIsMobile(e.matches);
    mediaQuery.addEventListener('change', handleResize);
    return () => mediaQuery.removeEventListener('change', handleResize);
  }, []);

  // 2. High-Performance Mouse Tracking (Desktop Only)
  useEffect(() => {
    if (isMobile) {
      // Clear out GSAP inline positioning so Tailwind bottom-right can take over
      gsap.set(portalRef.current, { clearProps: "top,left" });
      return; 
    }

    const xTo = gsap.quickTo(portalRef.current, "left", { duration: 0.6, ease: "power3.out" });
    const yTo = gsap.quickTo(portalRef.current, "top", { duration: 0.6, ease: "power3.out" });

    const handleMouseMove = (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isMobile]);

  // 3. The Reveal and Slide Logic
  useGSAP(() => {
    // Manage center alignment via GSAP so it doesn't break scaling animations
    gsap.set(portalRef.current, {
      xPercent: isMobile ? 0 : -50,
      yPercent: isMobile ? 0 : -50,
    });

    gsap.to(portalRef.current, {
      scale: activeIndex !== null ? 1 : 0,
      duration: 0.5,
      ease: "power4.out"
    });

    if (activeIndex !== null) {
      gsap.to(filmstripRef.current, {
        y: `${-activeIndex * 100}%`, 
        duration: 0.6,
        ease: "power3.inOut"
      });
    }
  }, [activeIndex, isMobile]); 

  return (
    <div 
      ref={portalRef}
      // FIXED: Dynamic classes based on isMobile
      className={`fixed z-50 overflow-hidden scale-0 rounded-xl pointer-events-none shadow-2xl ${
        isMobile 
          ? "bottom-8 right-10 w-[200px] h-[125px] origin-bottom-right border border-zinc-800" 
          : "top-0 left-0 w-[340px] h-[200px] origin-center"
      }`}
    >
      <div ref={filmstripRef} className="w-full h-full flex flex-col will-change-transform">
        
        {projects.map((project) => (
          <div key={project.id} className="w-full h-full flex-shrink-0 bg-zinc-900">
            <img 
              src={project.imgUrl} 
              alt={project.title} 
              className="w-full h-full object-cover opacity-80"
            />
          </div>
        ))}

      </div>
    </div>
  );
};

export default VideoPortal;