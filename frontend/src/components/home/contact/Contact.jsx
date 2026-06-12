import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Icon } from '@iconify/react';
import LocalTime from './LocalTime';
import data from '../../../data.json';

gsap.registerPlugin(ScrollTrigger);

// Extract contact data directly from JSON (Phone removed)
const { mail, linkedin, github, insta } = data.contact;

const Contact = () => {
  const sectionRef = useRef(null);
  const [copiedData, setCopiedData] = useState(null);

  useGSAP(() => {
    let mm = gsap.matchMedia();

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

      // 0. Editorial Header
      tl.to(".editorial-header", { opacity: 1, duration: 1, ease: "power3.out" });

      // 1. Cinematic Skew Reveal for the Heading
      tl.fromTo(".heading-block",
        { 
          y: 120, 
          skewY: 8, 
          filter: "blur(12px)", 
          opacity: 0 
        },
        {
          y: 0,
          skewY: 0,
          filter: "blur(0px)",
          opacity: 1,
          duration: 1.6, 
          stagger: 0.15,
          ease: "expo.out", 
          force3D: true 
        },
        "-=0.8"
      );

      // 2. Paragraph Reveal
      tl.to(".p-line", 
        { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" },
        "-=1.2"
      );

      // 3. Contact Data List Stagger
      tl.to(".contact-item", 
        { y: 0, opacity: 1, duration: 1.2, stagger: 0.15, ease: "power3.out" },
        "-=1.0"
      );

      // 4. Footer Reveal
      tl.to(".footer-fade", 
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
        "-=0.8"
      );
    });

    // ==========================================
    // MOBILE / TABLET: Individual ScrollTriggers
    // ==========================================
    mm.add("(max-width: 1023px)", () => {
      
      gsap.to(".editorial-header", 
        { opacity: 1, duration: 1, ease: "power3.out", scrollTrigger: { trigger: ".editorial-header", start: "top 80%" } }
      );

      gsap.fromTo(".heading-block",
        { y: 80, skewY: 4, filter: "blur(8px)", opacity: 0 }, 
        { y: 0, skewY: 0, filter: "blur(0px)", opacity: 1, duration: 1.4, stagger: 0.15, ease: "expo.out", force3D: true, scrollTrigger: { trigger: "#contact-section", start: "top 80%" } }
      );

      gsap.to(".p-line", 
        { y: 0, opacity: 1, duration: 1.2, ease: "power3.out", scrollTrigger: { trigger: ".p-line", start: "top 85%" } }
      );

      // Trigger each contact block independently as the user scrolls
      gsap.utils.toArray(".contact-item").forEach((item) => {
        gsap.to(item, 
          { y: 0, opacity: 1, duration: 1.2, ease: "power3.out", scrollTrigger: { trigger: item, start: "top 85%" } }
        );
      });

      gsap.to(".footer-fade", 
        { y: 0, opacity: 1, duration: 1, ease: "power3.out", scrollTrigger: { trigger: ".footer-fade", start: "top 90%" } }
      );
    });

  }, { scope: sectionRef });

  const handleCopy = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedData(type);
      setTimeout(() => setCopiedData(null), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <section ref={sectionRef} id="contact" className="relative w-full pt-[10svh] lg:pt-[15svh] pb-[5svh] px-5 lg:px-10 z-10 lg:mt-14">
      
      <div className="w-full max-w-[1600px] mx-auto flex flex-col">
        
        {/* EDITORIAL TOP BORDER (Starts invisible to prevent FOUC) */}
        <div className="editorial-header opacity-0 w-full flex items-center justify-between mb-12 lg:mb-24 border-b border-zinc-700 pb-4">
          <span className="text-[0.55rem] sm:text-[0.65rem] tracking-[0.2em] font-medium text-zinc-500 uppercase">
            ( The Terminal )
          </span>
          <span className="flex items-center gap-2 text-[0.55rem] sm:text-[0.65rem] tracking-[0.2em] font-medium text-zinc-500 uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5733] animate-pulse"></span>
            Status: Open to Opportunities
          </span>
        </div>

        {/* THE SPLIT ARCHITECTURE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-16 lg:gap-x-16 w-full relative items-start">
          
          {/* LEFT SIDE: Brutalist Heading */}
          <div className="lg:col-span-5 flex flex-col">
            
            {/* INLINE MASKED HEADING: Using flex-wrap so the text flows naturally */}
            <h2 className="text-[24vw] sm:text-[12vw] lg:text-[6.5rem] xl:text-[7.5rem] leading-[0.95em] tracking-tighter flex lg:flex-wrap">
              
              <span className="overflow-hidden inline-block pb-2 lg:pb-4 pr-4">
                <span className="heading-block opacity-0 inline-block font-medium italic text-[#f3f3f3] origin-bottom-left">
                  Let's
                </span> 
              </span>
              
              <span className="overflow-hidden inline-block pb-2 lg:pb-4">
                <span className="heading-block opacity-0 inline-block prime-txt head-txt italic font-medium pr-2 origin-bottom-left">
                  Talk.
                </span>
              </span>

            </h2>

            {/* Born invisible and shifted natively via CSS */}
            <p className="p-line opacity-0 translate-y-10 text-zinc-400 text-sm lg:text-base leading-relaxed mt-6 lg:mt-8 max-w-sm">
              Hey there. Every robust digital product begins with a single 'hello'. I am all ears, lets create something amazing together.
            </p>
          </div>

          {/* RIGHT SIDE: The Data List */}
          <div className="lg:col-span-7 flex flex-col w-full mt-4 lg:mt-0">
            
            {/* EMAIL BLOCK */}
            <div 
              onClick={() => handleCopy(mail, 'email')}
              className="contact-item opacity-0 translate-y-10 group flex flex-col py-8 lg:py-10 cursor-pointer overflow-hidden"
            >
              <div className="flex items-center justify-between w-full mb-2 lg:mb-4">
                <span className="text-[0.65rem] tracking-[0.2em] font-bold text-zinc-500 uppercase transition-colors group-hover:text-[#FF5733]">
                  Mail me at
                </span>
                <div className="flex items-center h-6 overflow-hidden">
                  {copiedData === 'email' ? (
                    <span className="text-[#FF5733] text-[0.65rem] tracking-widest uppercase font-bold animate-pulse">Copied</span>
                  ) : (
                    <span className="text-zinc-600 text-[0.65rem] tracking-widest uppercase font-bold group-hover:text-[#f3f3f3] transition-colors">Click to Copy</span>
                  )}
                </div>
              </div>
              
              {/* UPDATED: Text is bright #f3f3f3 on mobile, dull on desktop until hovered */}
              <span className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-light text-[#f3f3f3] lg:text-zinc-300 group-hover:text-[#f3f3f3] transform group-hover:translate-x-2 lg:group-hover:translate-x-4 transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] pb-2 leading-normal break-all sm:break-normal">
                {mail}
              </span>
            </div>

            {/* DIGITAL / SOCIALS BLOCK */}
            <div className="contact-item opacity-0 translate-y-10 flex flex-col border-t border-zinc-700 py-8 lg:py-10">
              <span className="text-[0.65rem] tracking-[0.2em] font-bold text-zinc-500 uppercase mb-6 lg:mb-8">
                Connect with me
              </span>
              
              <div className="flex flex-col sm:flex-row flex-wrap gap-8 sm:gap-12 lg:gap-16">
                
                {/* LinkedIn */}
                <a href={linkedin} target="_blank" rel="noopener noreferrer" className="group block overflow-hidden h-[32px] lg:h-[40px] w-fit">
                  <div className="flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:-translate-y-1/2">
                    <div className="flex items-center gap-2 h-[32px] lg:h-[40px]">
                      {/* UPDATED: Links are bright #f3f3f3 on mobile, dull on desktop */}
                      <span className="text-2xl lg:text-4xl font-light text-[#f3f3f3] lg:text-zinc-400">
                        LinkedIn
                      </span>
                      <Icon icon="material-symbols:arrow-outward-rounded" className="text-xl lg:text-2xl text-[#f3f3f3] lg:text-zinc-600" />
                    </div>
                    <div className="flex items-center gap-2 h-[32px] lg:h-[40px]">
                      <span className="text-2xl lg:text-4xl font-light text-[#f3f3f3]">
                        LinkedIn
                      </span>
                      <Icon icon="material-symbols:arrow-outward-rounded" className="text-xl lg:text-2xl text-[#FF5733]" />
                    </div>
                  </div>
                </a>

                {/* Instagram */}
                <a href={insta} target="_blank" rel="noopener noreferrer" className="group block overflow-hidden h-[32px] lg:h-[40px] w-fit">
                  <div className="flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:-translate-y-1/2">
                    <div className="flex items-center gap-2 h-[32px] lg:h-[40px]">
                      {/* UPDATED: Links are bright #f3f3f3 on mobile, dull on desktop */}
                      <span className="text-2xl lg:text-4xl font-light text-[#f3f3f3] lg:text-zinc-400">
                        Instagram
                      </span>
                      <Icon icon="material-symbols:arrow-outward-rounded" className="text-xl lg:text-2xl text-[#f3f3f3] lg:text-zinc-600" />
                    </div>
                    <div className="flex items-center gap-2 h-[32px] lg:h-[40px]">
                      <span className="text-2xl lg:text-4xl font-light text-[#f3f3f3]">
                        Instagram
                      </span>
                      <Icon icon="material-symbols:arrow-outward-rounded" className="text-xl lg:text-2xl text-[#FF5733]" />
                    </div>
                  </div>
                </a>

                {/* GitHub */}
                <a href={github} target="_blank" rel="noopener noreferrer" className="group block overflow-hidden h-[32px] lg:h-[40px] w-fit">
                  <div className="flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:-translate-y-1/2">
                    <div className="flex items-center gap-2 h-[32px] lg:h-[40px]">
                      {/* UPDATED: Links are bright #f3f3f3 on mobile, dull on desktop */}
                      <span className="text-2xl lg:text-4xl font-light text-[#f3f3f3] lg:text-zinc-400">
                        GitHub
                      </span>
                      <Icon icon="material-symbols:arrow-outward-rounded" className="text-xl lg:text-2xl text-[#f3f3f3] lg:text-zinc-600" />
                    </div>
                    <div className="flex items-center gap-2 h-[32px] lg:h-[40px]">
                      <span className="text-2xl lg:text-4xl font-light text-[#f3f3f3]">
                        GitHub
                      </span>
                      <Icon icon="material-symbols:arrow-outward-rounded" className="text-xl lg:text-2xl text-[#FF5733]" />
                    </div>
                  </div>
                </a>

              </div>
            </div>

          </div>

        </div>

        {/* ABSOLUTE BOTTOM FOOTER (Born invisible and shifted) */}
        <div className="footer-fade opacity-0 translate-y-10 w-full flex flex-col sm:flex-row items-center justify-between mt-20 lg:mt-24 pt-8 gap-6 sm:gap-0">
          
          <div className="flex items-center gap-2 text-zinc-500">
            <Icon icon="material-symbols:copyright-outline" className="text-sm" />
            <span className="text-[0.65rem] uppercase tracking-widest font-bold">
              {new Date().getFullYear()} Falguni. All Rights Reserved.
            </span>
          </div>

          <LocalTime />

        </div>

      </div>
    </section>
  );
};

export default Contact;