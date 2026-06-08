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

  useGSAP(() => {
    gsap.set(fillRef.current, { xPercent: -50, yPercent: 100 });

    gsap.fromTo(".about-elem", 
      { y: 40, opacity: 0 }, 
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 65%",
        }
      }
    );
  }, { scope: sectionRef });

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

  return (
    <section ref={sectionRef} id="about-section" className="relative w-full pt-[10svh] lg:pt-[15svh] pb-[15svh] px-5 lg:px-10 z-10 lg:mt-14">
      
      <div className="w-full max-w-[1600px] mx-auto flex flex-col">
        
        {/* EDITORIAL HEADER: Now acts as a sleek top border visible on all devices */}
        <div className="w-full flex items-center justify-between mb-12 lg:mb-20 border-b border-zinc-800 pb-4 about-elem">
          <span className="text-[0.55rem] sm:text-[0.65rem] tracking-[0.2em] font-medium text-zinc-500 uppercase">
            ( The Developer )
          </span>
          <span className="text-[0.55rem] sm:text-[0.65rem] tracking-[0.2em] font-medium text-zinc-500 uppercase">
            ( Based in India )
          </span>
        </div>

        {/* THE SPLIT GRID BIOGRAPHY */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-12 lg:gap-x-12 w-full">
          
          {/* LEFT SIDE: Brutalist Introduction (Now acting as the main <h2>) */}
          <div className="lg:col-span-5 flex flex-col justify-start about-elem">
            <h2 className="text-[14vw] sm:text-[10vw] lg:text-[6.5rem] xl:text-[7.5rem] leading-[0.95em] font-medium text-[#f3f3f3] tracking-tighter">
              Hi, I am <br className="hidden lg:block"/>
              <span className="text-[#FF5733] italic head-txt pr-2">Falguni.</span>
            </h2>
          </div>

          {/* RIGHT SIDE: Narrative & Tech Stack */}
          <div className="lg:col-span-7 lg:col-start-6 flex flex-col gap-12 lg:gap-16">
            
            {/* 
              WRAPPER: 
              - Mobile: Takes full width so text doesn't squish. 
              - Desktop: Adds pr-40 to make room for the absolute button. 
            */}
            <div className="about-elem relative w-full lg:pr-40">
              
              {/* THE REFINED NARRATIVE */}
              <p className="text-xl lg:text-3xl text-zinc-200 font-medium leading-relaxed max-w-2xl">
                Helping brands to have their unfair advantage by developing digital adrenaline.
              </p>
              <p className="text-sm lg:text-base text-zinc-400 leading-relaxed max-w-xl mt-6 lg:mt-8">
                Currently leading full-stack development at a digital ad agency, I specialize in bridging the gap between robust, scalable backend architectures and fluid interactive interfaces. Whether it is building complex e-commerce applications or crafting highly responsive, Awwwards-level web experiences, my philosophy remains straightforward: write clean logic, design with purpose, and deliver digital products that truly perform.
              </p>

              {/* 
                THE CTA: Advanced Circular Magnetic Button 
                - Mobile: relative, mt-10 (sits below text nicely)
                - Desktop: absolute, right-0, top-[85%] (architectural placement)
              */}
              <button
                ref={btnRef}
                onMouseEnter={handleMouseEnter}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="relative left-2/3 lg:left-auto mt-10 lg:mt-0 lg:absolute lg:right-0 lg:top-[85%] lg:-translate-y-1/2 flex items-center justify-center w-28 h-28 lg:w-32 lg:h-32 rounded-full bg-[#FF5733] overflow-hidden cursor-pointer border-none outline-none z-20"
              >
                <div 
                  ref={fillRef}
                  className="absolute top-0 left-1/2 w-[150%] h-[150%] bg-[#f3f3f3] rounded-[50%] z-0 pointer-events-none"
                ></div>
                
                <span 
                  ref={textRef} 
                  className="relative z-10 flex items-center gap-1 text-[#f3f3f3] text-sm pointer-events-none font-medium lg:font-normal"
                >
                  Resume
                  <Icon icon="material-symbols:arrow-outward-rounded" className="text-sm lg:text-base" />
                </span>
              </button>

            </div>

            {/* The Tech Stack / Arsenal */}
            <div className="pt-10 lg:pt-12 border-t border-zinc-800/50 about-elem">
              <span className="text-[0.65rem] tracking-[0.2em] uppercase text-zinc-600 font-bold mb-6 block">
                Core Arsenal
              </span>
              
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-4">
                <ul className="flex flex-col gap-3 text-sm lg:text-base text-zinc-300 font-medium">
                  <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#FF5733]"></span> React & Vite</li>
                  <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#FF5733]"></span> Tailwind CSS</li>
                  <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#FF5733]"></span> JS (ES6+)</li>
                </ul>
                <ul className="flex flex-col gap-3 text-sm lg:text-base text-zinc-300 font-medium">
                  <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#FF5733]"></span> Node.js / Express</li>
                  <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#FF5733]"></span> MongoDB</li>
                  <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#FF5733]"></span> RESTful APIs</li>
                </ul>
                <ul className="flex flex-col gap-3 text-sm lg:text-base text-zinc-300 font-medium">
                  <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#FF5733]"></span> GSAP Animation</li>
                  <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#FF5733]"></span> WebGL / Three.js</li>
                  <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#FF5733]"></span> WordPress</li>
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