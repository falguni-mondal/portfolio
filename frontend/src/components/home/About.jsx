import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Icon } from '@iconify/react'; 

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const sectionRef = useRef(null);
  const btnRef = useRef(null);
  const textRef = useRef(null);
  const fillRef = useRef(null);
  const parallaxWrapperRef = useRef(null); 

  useGSAP(() => {
    gsap.set(fillRef.current, { xPercent: -50, yPercent: 100 });

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
        "-=1.0"
      );

      // 4. CTA Button (Fires at the exact same time as the paragraphs using "<", without opacity shifts)
      tl.fromTo(".cta-block",
        { y: 400 }, 
        { y: 0, duration: 1.2, ease: "power3.out" },
        "<" 
      );

      tl.fromTo(".arsenal-header", { opacity: 0 }, { opacity: 1, duration: 0.8 }, "-=0.6");
      tl.fromTo(".arsenal-item",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.05, ease: "power3.out" },
        "-=0.6"
      );
    });

    // ==========================================
    // MOBILE / TABLET: Individual ScrollTriggers
    // ==========================================
    mm.add("(max-width: 1023px)", () => {
      gsap.fromTo(".editorial-header", 
        { opacity: 0 }, 
        { opacity: 1, duration: 1, scrollTrigger: { trigger: ".editorial-header", start: "top 75%" } }
      );

      gsap.fromTo(".heading-block",
        { y: 80, skewY: 4, filter: "blur(8px)", opacity: 0 },
        { y: 0, skewY: 0, filter: "blur(0px)", opacity: 1, duration: 1.4, ease: "expo.out", force3D: true, scrollTrigger: { trigger: ".heading-block", start: "top 75%" } }
      );

      gsap.fromTo(".sub-heading-block",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: "power3.out", scrollTrigger: { trigger: ".sub-heading-block", start: "top 75%" } }
      );

      gsap.fromTo(".p-word",
        { yPercent: 120, opacity: 0, rotateZ: 2 },
        { yPercent: 0, opacity: 1, rotateZ: 0, duration: 1, stagger: 0.015, ease: "power4.out", scrollTrigger: { trigger: ".paragraphs-block", start: "top 65%" } }
      );

      // CTA Button (Tied to the .paragraphs-block trigger to run simultaneously)
      gsap.fromTo(".cta-block",
        { y: 400 },
        { y: 0, duration: 1.2, ease: "power3.out", scrollTrigger: { trigger: ".paragraphs-block", start: "top 65%" } }
      );

      gsap.fromTo(".arsenal-header", 
        { opacity: 0 }, 
        { opacity: 1, duration: 0.8, scrollTrigger: { trigger: ".arsenal-block", start: "top 75%" } }
      );
      gsap.fromTo(".arsenal-item",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.08, ease: "power3.out", scrollTrigger: { trigger: ".arsenal-block", start: "top 75%" } }
      );
    });

  }, { scope: sectionRef });

  // --- MAGNETIC BUTTON LOGIC ---
  const handleMouseEnter = () => {
    gsap.killTweensOf(fillRef.current);
    gsap.killTweensOf(textRef.current);

    gsap.fromTo(fillRef.current, 
      { yPercent: 100, xPercent: -50 }, 
      { yPercent: -25, xPercent: -50, duration: 0.8, ease: 'power3.out' }
    );
    gsap.to(textRef.current, { color: '#18181b', duration: 0.3 });
  };

  const handleMouseMove = (e) => {
    if (!btnRef.current || !textRef.current) return;
    
    const { left, top, width, height } = btnRef.current.getBoundingClientRect();
    const x = e.clientX - (left + width / 2);
    const y = e.clientY - (top + height / 2);

    gsap.to(btnRef.current, { x: x * 0.5, y: y * 0.5, duration: 0.6, ease: 'power3.out' });
    gsap.to(textRef.current, { x: x * 0.2, y: y * 0.2, duration: 0.6, ease: 'power3.out' });
  };

  const handleMouseLeave = () => {
    gsap.killTweensOf(fillRef.current);
    gsap.killTweensOf(textRef.current);

    gsap.to(fillRef.current, { yPercent: -150, xPercent: -50, duration: 0.6, ease: 'power3.inOut' });
    gsap.to(textRef.current, { color: '#f3f3f3', duration: 0.5 });

    gsap.to([btnRef.current, textRef.current], {
      x: 0,
      y: 0,
      duration: 0.8,
      ease: 'elastic.out(1.2, 0.4)',
    });
  };

  const splitTextToWords = (text) => {
    return text.split(" ").map((word, index) => (
      <span key={index} className="inline-flex overflow-hidden pb-1 lg:pb-2 -mb-1 lg:-mb-2 mr-[0.25em]">
        <span className="p-word origin-bottom-left will-change-transform inline-block">
          {word}
        </span>
      </span>
    ));
  };

  return (
    <section ref={sectionRef} id="about-section" className="relative w-full pt-[10svh] lg:pt-[15svh] pb-[15svh] px-5 lg:px-10 z-10 lg:mt-14">
      
      <div className="w-full max-w-[1600px] mx-auto flex flex-col">
        
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
              <h2 className="heading-block text-[14vw] sm:text-[10vw] lg:text-[6.5rem] xl:text-[7.5rem] leading-[0.95em] font-medium text-[#f3f3f3] tracking-tighter origin-bottom-left will-change-transform">
                Hi, I am <br className="hidden lg:block"/>
                <span className="text-[#FF5733] italic head-txt pr-2">Falguni.</span>
              </h2>
            </div>

            <div className="sub-heading-block mt-12 lg:mt-auto border-t border-zinc-700/50 lg:border-none pt-8 lg:pt-0">
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
                  {splitTextToWords("Helping brands to have their unfair advantage by developing digital adrenaline.")}
                </p>
                
                <p className="text-sm lg:text-base text-zinc-400 leading-relaxed max-w-xl mt-6 lg:mt-8 flex flex-wrap">
                  {splitTextToWords("Currently leading full-stack development within the agency space, I engineer the intersection of scalable data architecture and seamless UI. Whether building high-volume e-commerce platforms or immersive, Awwwards-level digital experiences, the baseline remains the same. Clean logic. Purpose-driven design. Digital products built for pure performance.")}
                </p>
              </div>

              <div ref={parallaxWrapperRef} className="cta-parallax-wrapper w-fit relative left-2/3 top-48 lg:left-auto mt-10 lg:mt-0 lg:absolute lg:right-0 lg:top-[160%] lg:-translate-y-1/2 z-20 will-change-transform">
                <div className="cta-block">
                  <button
                    ref={btnRef}
                    onMouseEnter={handleMouseEnter}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    className="relative flex items-center justify-center w-28 h-28 lg:w-32 lg:h-32 rounded-full bg-[#FF5733] overflow-hidden cursor-pointer border-none outline-none"
                  >
                    <div 
                      ref={fillRef}
                      className="absolute top-0 left-1/2 w-[150%] h-[150%] bg-[#f3f3f3] rounded-[50%] z-0 pointer-events-none"
                    ></div>
                    
                    <span 
                      ref={textRef} 
                      className="relative z-10 flex items-center gap-1 text-[#f3f3f3] text-sm pointer-events-none font-medium lg:font-normal"
                    >
                      My resume
                      <Icon icon="material-symbols:arrow-outward-rounded" className="text-sm lg:text-base" />
                    </span>
                  </button>
                </div>
              </div>

            </div>

            <div className="arsenal-block pt-10 lg:pt-12 border-t border-zinc-700/50 mt-auto">
              <span className="arsenal-header text-[0.65rem] tracking-[0.2em] uppercase text-zinc-600 font-bold mb-6 block">
                Core Arsenal
              </span>
              
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-4">
                <ul className="flex flex-col gap-3 text-sm lg:text-base text-zinc-300 font-medium">
                  <li className="arsenal-item flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#FF5733]"></span> React & Vite</li>
                  <li className="arsenal-item flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#FF5733]"></span> Tailwind CSS</li>
                  <li className="arsenal-item flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#FF5733]"></span> JS (ES6+)</li>
                </ul>
                <ul className="flex flex-col gap-3 text-sm lg:text-base text-zinc-300 font-medium">
                  <li className="arsenal-item flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#FF5733]"></span> Node.js / Express</li>
                  <li className="arsenal-item flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#FF5733]"></span> MongoDB</li>
                  <li className="arsenal-item flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#FF5733]"></span> RESTful APIs</li>
                </ul>
                <ul className="flex flex-col gap-3 text-sm lg:text-base text-zinc-300 font-medium">
                  <li className="arsenal-item flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#FF5733]"></span> GSAP Animation</li>
                  <li className="arsenal-item flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#FF5733]"></span> WebGL / Three.js</li>
                  <li className="arsenal-item flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#FF5733]"></span> WordPress</li>
                </ul>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default About;