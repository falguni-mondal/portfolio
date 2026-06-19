import React, { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import CertificateItem from "./CertificateItem";
import data from "../../../data.json";
import SectionHeading from "../global/SectionHeading";
import { useLabStore } from "../../../store/store";

gsap.registerPlugin(ScrollTrigger);

// Dynamically pulling the certificates array from your JSON data
const certificatesData = data.certificates;

const Certificates = () => {
  const theme = useLabStore((state) => state.theme);
  const sectionRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(null);

  useGSAP(
    () => {
      let mm = gsap.matchMedia();

      // ==========================================
      // DESKTOP: Master Timeline Sequence
      // ==========================================
      mm.add("(min-width: 1024px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 65%",
          },
        });

        tl.to(".editorial-header", {
          opacity: 1,
          duration: 1,
          ease: "power3.out",
        });

        tl.fromTo(
          ".heading-block",
          {
            y: 120,
            skewY: 8,
            filter: "blur(12px)",
            opacity: 0,
          },
          {
            y: 0,
            skewY: 0,
            filter: "blur(0px)",
            opacity: 1,
            duration: 1.6,
            stagger: 0.15,
            ease: "expo.out",
            force3D: true,
          },
          "-=0.8",
        );

        tl.to(
          ".cert-item",
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            stagger: 0.1,
            ease: "power3.out",
          },
          "-=1.2",
        );
      });

      // ==========================================
      // MOBILE / TABLET: Individual ScrollTriggers
      // ==========================================
      mm.add("(max-width: 1023px)", () => {
        // Reset the active state when leaving the entire section
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top 50%",
          end: "bottom 50%",
          onLeave: () => setActiveIndex(null),
          onLeaveBack: () => setActiveIndex(null),
        });

        gsap.to(".editorial-header", {
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: ".editorial-header", start: "top 75%" },
        });

        gsap.fromTo(
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
            scrollTrigger: { trigger: ".heading-block", start: "top 75%" },
          },
        );

        gsap.utils.toArray(".cert-item").forEach((item) => {
          gsap.to(item, {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: { trigger: item, start: "top 75%" },
          });
        });
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="certificates"
      className="relative w-full pt-[10svh] lg:pt-[15svh] pb-[15svh] px-5 lg:px-10 z-10 lg:mt-14"
    >
      <div className="w-full mx-auto flex flex-col">
        {/* COMBINED HEADER ROW */}
        <div className="editorial-header opacity-0 w-full flex flex-col lg:flex-row items-start lg:items-end justify-between mb-16 lg:mb-20 border-b border-zinc-700 pb-8 lg:pb-12">
          {/* HIGH-END MASKED HEADING */}
          <SectionHeading line1="Verified" line2="Credentials." />

          {/* METADATA FLANKS */}
          <div className="flex flex-wrap items-center gap-6 lg:gap-12 mt-8 lg:mt-0 lg:pb-3">
            <span className={`text-[0.55rem] sm:text-[0.65rem] tracking-[0.2em] font-medium ${theme === "dark" ? "text-zinc-500" : "text-zinc-600"} uppercase`}>
              ( Accreditations )
            </span>
            <span className={`text-[0.55rem] sm:text-[0.65rem] tracking-[0.2em] font-medium ${theme === "dark" ? "text-zinc-500" : "text-zinc-600"} uppercase`}>
              ( Skill Validation )
            </span>
          </div>
        </div>

        {/* THE PLAQUE GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 w-full">
          {certificatesData.map((cert, index) => (
            <CertificateItem
              key={index}
              cert={cert}
              index={index}
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certificates;
