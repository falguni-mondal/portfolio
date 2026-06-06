import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const VideoPortal = ({ projects, hoveredIndex }) => {
  const portalRef = useRef(null);
  const filmstripRef = useRef(null);

  // 1. High-Performance Mouse Tracking
  useEffect(() => {
    // quickTo is significantly faster than standard gsap.to() for mouse events
    const xTo = gsap.quickTo(portalRef.current, "left", { duration: 0.6, ease: "power3.out" });
    const yTo = gsap.quickTo(portalRef.current, "top", { duration: 0.6, ease: "power3.out" });

    const handleMouseMove = (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // 2. The Reveal and Slide Logic
  useGSAP(() => {
    // If hovering a project, scale up. If not, scale down.
    gsap.to(portalRef.current, {
      scale: hoveredIndex !== null ? 1 : 0,
      duration: 0.5,
      ease: "power4.out"
    });

    // If hovering, slide the filmstrip to the correct video index
    if (hoveredIndex !== null) {
      gsap.to(filmstripRef.current, {
        y: `${-hoveredIndex * 100}%`, // Moves up by 100% per index
        duration: 0.6,
        ease: "power3.inOut"
      });
    }
  }, [hoveredIndex]); // This effect re-runs every time the hovered index changes

  return (
    <div 
      ref={portalRef}
      // Fixed to screen, completely centered on mouse via -translate, ignores pointer events
      className="fixed top-0 left-0 w-[200px] h-[90px] lg:w-[280px] lg:h-[170px] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50 overflow-hidden scale-0 rounded-xl"
    >
      {/* The Filmstrip Container (Stacks videos vertically) */}
      <div ref={filmstripRef} className="w-full h-full flex flex-col will-change-transform">
        
        {projects.map((project) => (
          <div key={project.id} className="w-full h-full flex-shrink-0 bg-zinc-900">
            
            {/* Replace this img with your actual <video> tag. 
              Example: <video src={project.videoUrl} autoPlay loop muted className="w-full h-full object-cover" />
            */}
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