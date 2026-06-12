import React, { useRef } from "react";
import { Icon } from "@iconify/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import WebGLBlobHover from "../../../utils/WebGLBlobHover";

gsap.registerPlugin(ScrollTrigger);

const LabItem = ({ project, index, activeIndex, setActiveIndex }) => {
  const triggerRef = useRef(null); 
  const imageRef = useRef(null);

  const isActive = activeIndex === index;

  useGSAP(
    () => {
      let mm = gsap.matchMedia();

      // 1. Subtle Image Parallax Scrub (Kept for visual depth)
      gsap.to(imageRef.current, {
        yPercent: 15,
        ease: "none",
        scrollTrigger: {
          trigger: triggerRef.current, 
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      // 2. Mobile Scroll Active State Trigger
      mm.add("(max-width: 1023px)", () => {
        ScrollTrigger.create({
          trigger: triggerRef.current,
          start: "top 55%", 
          end: "bottom 45%",
          onEnter: () => setActiveIndex(index),
          onEnterBack: () => setActiveIndex(index),
        });
      });
    },
    { scope: triggerRef } 
  );

  // Dynamic wrapper: Becomes a link if a URL exists, otherwise a standard div
  const ContentWrapper = project.projectUrl ? 'a' : 'div';
  const wrapperProps = project.projectUrl 
    ? { href: project.projectUrl, target: "_blank", rel: "noopener noreferrer" } 
    : {};

  return (
    <div ref={triggerRef} className="w-full">
      <ContentWrapper
        {...wrapperProps}
        onClick={() => setActiveIndex(index)}
        className={`w-full flex flex-col group cursor-pointer ${isActive ? 'is-active' : ''}`}
      >
        {/* THE CANVAS / MEDIA BLOCK */}
        <div className="w-full aspect-square bg-[#0a0a0a] overflow-hidden relative mb-4 lg:mb-6 rounded-sm">
          
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px] lg:bg-[size:40px_40px] opacity-50 z-0"></div>

          {/* THE WEBGL PARALLAX WRAPPER */}
          <div
            ref={imageRef}
            className="absolute inset-[-10%] w-[120%] h-[120%] flex items-center justify-center z-10 scale-100 lg:group-hover:scale-105 group-[.is-active]:scale-105 transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]"
          >
            {/* The isActive state is now passed down to bypass mobile phantom clicks */}
            <WebGLBlobHover 
              baseImage={project.image1} 
              revealImage={project.image2} 
              isActive={isActive}
              className="w-full h-full pointer-events-auto"
            />
          </div>

          {/* Hover Overlay Fade */}
          <div className="flex absolute inset-0 bg-black/20 opacity-0 lg:group-hover:opacity-100 group-[.is-active]:opacity-100 transition-opacity duration-700 z-20 items-center justify-center pointer-events-none">
            <div className="w-16 h-16 rounded-full bg-[#FF5733] flex items-center justify-center transform translate-y-8 opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 group-[.is-active]:translate-y-0 group-[.is-active]:opacity-100 transition-all duration-500 ease-out">
              {project.projectUrl ? (
                <Icon
                  icon="material-symbols:arrow-outward-rounded"
                  className="text-2xl text-[#f3f3f3]"
                />
              ) : (
                <span className="text-[#f3f3f3] text-[0.65rem] font-bold tracking-[0.2em] uppercase">WIP</span>
              )}
            </div>
          </div>
        </div>

        {/* THE METADATA FOOTER */}
        <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between border-t border-zinc-700 pt-4 gap-3 sm:gap-0">
          <div className="flex items-center gap-3 lg:gap-4">
            <span className="text-xs font-bold tracking-[0.2em] text-zinc-600">
              0{index + 1}
            </span>
            <h3 className="text-xl lg:text-2xl font-medium text-[#f3f3f3] lg:group-hover:text-[#FF5733] group-[.is-active]:text-[#FF5733] transition-colors duration-500">
              {project.name}
            </h3>
          </div>

          <div className="flex flex-wrap gap-x-2 lg:gap-x-3 gap-y-1">
            {project.tools.map((tag, i) => (
              <React.Fragment key={tag}>
                <span className="text-[0.6rem] lg:text-[0.65rem] uppercase tracking-[0.2em] font-bold text-zinc-500 lg:group-hover:text-[#f3f3f3] group-[.is-active]:text-[#f3f3f3] transition-colors duration-500">
                  {tag}
                </span>
                {i !== project.tools.length - 1 && (
                  <span className="text-zinc-800">/</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

      </ContentWrapper>
    </div>
  );
};

export default LabItem;