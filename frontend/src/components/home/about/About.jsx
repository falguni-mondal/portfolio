import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import SplitText from './SplitText';
import MagneticButton from './MagneticButton';
import Arsenal from './Arsenal';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const sectionRef = useRef(null);
  const parallaxWrapperRef = useRef(null); 

  useGSAP(() => {
    let mm = gsap.matchMedia();

    // ==========================================
    // PARALLAX SCRUB (Applies across all screens)
    // ==========================================
    gsap.to(parallaxWrapperRef.current, {
      y: -400, 
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      }
    });

    // ==========================================
    // DESKTOP: Master Timeline Sequence
    // ==========================================
    mm.add("(min-width: 1024px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 65%",
        }
      });

      tl.fromTo(".editorial-header", 
        { opacity: 0 }, 
        { opacity: 1, duration: 1, ease: "power3.out" }
      );

      tl.fromTo(".heading-block",
        { y: 120, skewY: 8, filter: "blur(12px)", opacity: 0 },
        { y: 0, skewY: 0, filter: "blur(0px)", opacity: 1, duration: 1.6, ease: "expo.out", force3D: true },
        "-=0.8"
      );

      tl.fromTo(".sub-heading-block",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" },
        "-=1.2"
      );

      tl.fromTo(".p-word",
        { yPercent: 120, opacity: 0, rotateZ: 2 },
        { yPercent: 0, opacity: 1, rotateZ: 0, duration: 1.2, stagger: 0.015, ease: "power4.out" },
        "-=1.2"
      );

      // CTA Button
      tl.fromTo(".cta-block",
        { y: 400 }, 
        { y: 0, duration: 1.2, ease: "power3.out" },
        "<" 
      );

      // Arsenal Line Expansion
      tl.to(".arsenal-block .animated-line", 
        { scaleX: 1, duration: 1.2, ease: "power3.out" }, 
        "-=1.7"
      );

      tl.fromTo(".arsenal-header", { opacity: 0 }, { opacity: 1, duration: 0.8 }, "-=0.8");
      
      tl.fromTo(".arsenal-item",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.05, ease: "power3.out" },
        "-=1.7"
      );
    });

    // ==========================================
    // MOBILE / TABLET: Individual ScrollTriggers (Waterfall Optimized)
    // ==========================================
    mm.add("(max-width: 1023px)", () => {
      
      gsap.fromTo(".editorial-header", 
        { opacity: 0 }, 
        { opacity: 1, duration: 1, scrollTrigger: { trigger: ".editorial-header", start: "top 85%" } }
      );

      gsap.fromTo(".heading-block",
        { y: 80, skewY: 4, filter: "blur(8px)", opacity: 0 },
        { y: 0, skewY: 0, filter: "blur(0px)", opacity: 1, duration: 1.4, ease: "expo.out", force3D: true, scrollTrigger: { trigger: ".heading-block", start: "top 85%" } }
      );

      // Sub-heading mobile animated line
      gsap.to(".sub-heading-block .animated-line", { 
        scaleX: 1, duration: 1.2, ease: "power3.out", scrollTrigger: { trigger: ".sub-heading-block", start: "top 80%" } 
      });

      gsap.fromTo(".sub-heading-block",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: "power3.out", scrollTrigger: { trigger: ".sub-heading-block", start: "top 80%" } }
      );

      // Animates the simplified mobile text block instead of individual words
      gsap.fromTo(".p-mobile-text",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, stagger: 0.15, ease: "power3.out", scrollTrigger: { trigger: ".paragraphs-block", start: "top 75%" } }
      );

      gsap.fromTo(".cta-block",
        { y: 400 },
        { y: 0, duration: 1.2, ease: "power3.out", scrollTrigger: { trigger: ".paragraphs-block", start: "top 75%" } }
      );

      // Arsenal block animated line
      gsap.to(".arsenal-block .animated-line", { 
        scaleX: 1, duration: 1.2, ease: "power3.out", scrollTrigger: { trigger: ".arsenal-block", start: "top 65%" } 
      });

      gsap.fromTo(".arsenal-header", 
        { opacity: 0 }, 
        { opacity: 1, duration: 0.8, scrollTrigger: { trigger: ".arsenal-block", start: "top 65%" } }
      );
      
      // OPTIMIZED: Animate the 3 columns instead of the 15+ individual items
      gsap.fromTo(".arsenal-column",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power3.out", scrollTrigger: { trigger: ".arsenal-block", start: "top 65%" } }
      );
    });

  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="about" className="relative w-full pt-[10svh] lg:pt-[15svh] pb-[15svh] px-5 lg:px-10 z-10 lg:mt-14">
      
      <div className="w-full max-w-[1600px] mx-auto flex flex-col">
        
        {/* Top Horizontal Line */}
        <div className="editorial-header w-full flex items-center justify-between mb-12 lg:mb-20 border-b border-zinc-700 pb-4">
          <span className="text-[0.55rem] sm:text-[0.65rem] tracking-[0.2em] font-medium text-zinc-500 uppercase">
            ( The Developer )
          </span>
          <span className="text-[0.55rem] sm:text-[0.65rem] tracking-[0.2em] font-medium text-zinc-500 uppercase">
            ( Based in India )
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-12 lg:gap-x-12 w-full">
          
          <div className="lg:col-span-5 flex flex-col justify-between h-full">
            
            <div className="overflow-hidden pb-4">
              <h2 className="heading-block text-[14vw] sm:text-[10vw] lg:text-[6.5rem] xl:text-[7.5rem] leading-[0.95em] font-medium text-[#f3f3f3] tracking-tighter origin-bottom-left">
                Hi, I am <br className="hidden lg:block"/>
                <span className="text-[#FF5733] italic head-txt pr-2">Falguni.</span>
              </h2>
            </div>

            <div className="sub-heading-block relative mt-12 lg:mt-auto pt-8 lg:pt-0">
              <div className="animated-line absolute top-0 left-0 w-full h-[1px] bg-zinc-700 origin-left scale-x-0 lg:hidden"></div>
              
              <h4 className="lg:text-xl text-zinc-200 font-medium leading-snug">
                Bachelors in <br className="hidden lg:block"/> Information Technology
              </h4>
              <div className="flex items-center gap-3 mt-4 lg:mt-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF5733]"></span>
                <span className="text-xs text-zinc-400 font-medium tracking-[0.15em] uppercase">
                  Class of <span className="text-[#f3f3f3]">2025</span>
                </span>
              </div>
            </div>

          </div>

          <div className="lg:col-span-7 lg:col-start-6 flex flex-col gap-12 lg:gap-16">
            
            <div className="relative w-full lg:pr-40">
              
              <div className="paragraphs-block">
                <p className="text-xl lg:text-3xl text-zinc-200 font-medium leading-relaxed max-w-2xl flex flex-wrap">
                  <SplitText text="Helping brands to have their unfair advantage by developing digital adrenaline." />
                </p>
                
                <p className="text-sm lg:text-base text-zinc-400 leading-relaxed max-w-xl mt-6 lg:mt-8 flex flex-wrap">
                  <SplitText text="Currently leading full-stack development within the agency space, I engineer the intersection of scalable data architecture and seamless UI. Whether building high-volume e-commerce platforms or immersive, Awwwards-level digital experiences, the baseline remains the same. Clean logic. Purpose-driven design. Digital products built for pure performance." />
                </p>
              </div>

              <div ref={parallaxWrapperRef} className="cta-parallax-wrapper w-fit relative left-2/3 top-48 lg:left-auto mt-10 lg:mt-0 lg:absolute lg:right-0 lg:top-[160%] lg:-translate-y-1/2 z-20">
                <MagneticButton />
              </div>

            </div>

            <Arsenal />

          </div>
        </div>

      </div>
    </section>
  );
};

export default About;