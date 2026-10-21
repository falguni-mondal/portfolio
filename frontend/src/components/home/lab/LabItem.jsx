import React, { useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useLabStore } from "../../../store/store";

gsap.registerPlugin(ScrollTrigger);

const LabItem = ({ project, index, registerItem }) => {
  const theme = useLabStore((state) => state.theme);
  const triggerRef = useRef(null);
  const containerRef = useRef(null);
  const imageRef = useRef(null);

  const activeProject = useLabStore((state) => state.activeProject);
  const setActiveProject = useLabStore((state) => state.setActiveProject);
  const isActive = activeProject === index;

  useEffect(() => {
    if (containerRef.current && imageRef.current) {
      registerItem({
        index,
        containerRef,
        imageRef,
        image1: project.image1,
        image2: project.image2,
      });
    }
  }, [index, project, registerItem]);

  useGSAP(
    () => {
      let mm = gsap.matchMedia();

      // GSAP continues to parallax the invisible imageRef div!
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

      mm.add("(max-width: 1023px)", () => {
        ScrollTrigger.create({
          trigger: triggerRef.current,
          start: "top 55%",
          end: "bottom 45%",
          onEnter: () => setActiveProject(index),
          onEnterBack: () => setActiveProject(index),
        });
      });
    },
    { scope: triggerRef },
  );

  const ContentWrapper = project.projectUrl ? "a" : "div";
  const wrapperProps = project.projectUrl
    ? { href: project.projectUrl, target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <div ref={triggerRef} className="w-full relative">
      <ContentWrapper
        {...wrapperProps}
        onPointerEnter={(e) => {
          if (window.innerWidth >= 1024) setActiveProject(index);
        }}
        onPointerLeave={(e) => {
          if (window.innerWidth >= 1024) setActiveProject(null);
        }}
        className={`w-full flex flex-col group cursor-pointer ${isActive ? "is-active" : ""}`}
      >
        <div className="relative w-full aspect-square mb-4 lg:mb-6">
          {/* THE HITBOX CONTAINER */}
          <div
            ref={containerRef}
            className="absolute inset-0 bg-[#0a0a0a] overflow-hidden rounded-sm z-0"
          >
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px] lg:bg-[size:40px_40px] opacity-50 z-0"></div>

            {/* THE INVISIBLE PARALLAX TRACKER */}
            <div
              ref={imageRef}
              className="absolute inset-[-10%] w-[120%] h-[120%] flex items-center justify-center z-10 scale-100 lg:group-hover:scale-105 group-[.is-active]:scale-105 transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]"
            >
              {/* PURE WEBGL FIX: The image is hidden visually, but kept for Google Search Indexing */}
              <img
                src={project.image1}
                alt={project.name}
                className="sr-only"
              />
            </div>
          </div>

          <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none opacity-0 lg:group-hover:opacity-100 group-[.is-active]:opacity-100 transition-opacity duration-700">
            <div className="w-16 h-16 rounded-full bg-[#FF5733] flex items-center justify-center transform translate-y-8 opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 group-[.is-active]:translate-y-0 group-[.is-active]:opacity-100 transition-all duration-500 ease-out">
              {project.projectUrl ? (
                <Icon
                  icon="material-symbols:arrow-outward-rounded"
                  className={`text-2xl ${theme === "dark" ? "text-[#f3f3f3]" : "text-[#0b0a09]"}`}
                />
              ) : (
                <span className={`${theme === "dark" ? "text-[#f3f3f3]" : "text-[#0b0a09]"} text-[0.65rem] font-bold tracking-[0.2em] uppercase`}>
                  WIP
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between border-t border-zinc-700 pt-4 gap-3 sm:gap-0 relative z-20">
          <div className="flex items-center gap-3 lg:gap-4">
            <span className="text-xs font-bold tracking-[0.2em] text-zinc-600">
              0{index + 1}
            </span>
            <h3 className={`text-xl lg:text-2xl font-medium ${theme === "dark" ? "text-[#f3f3f3]" : "text-[#0b0a09]"} lg:group-hover:text-[#FF5733] group-[.is-active]:text-[#FF5733] transition-colors duration-500`}>
              {project.name}
            </h3>
          </div>
          <div className="flex flex-wrap gap-x-2 lg:gap-x-3 gap-y-1">
            {project.tools.map((tag, i) => (
              <React.Fragment key={tag}>
                <span className={`text-[0.6rem] lg:text-[0.65rem] uppercase tracking-[0.2em] font-bold text-zinc-500 ${theme === "dark" ? "lg:group-hover:text-[#f3f3f3] group-[.is-active]:text-[#f3f3f3]" : "lg:group-hover:text-[#0b0a09] group-[.is-active]:text-[#0b0a09]"} transition-colors duration-500`}>
                  {tag}
                </span>
                {i !== project.tools.length - 1 && (
                  <span className={`${theme === "dark" ? "text-zinc-800" : "text-zinc-500"}`}>/</span>
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
