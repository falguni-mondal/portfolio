import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Icon } from '@iconify/react';
import LocalTime from './LocalTime';

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const sectionRef = useRef(null);
  const [copiedData, setCopiedData] = useState(null);

  const email = "hello@falguni.dev";
  const phone = "+91 00000 00000";

  useGSAP(() => {
    gsap.fromTo(".contact-fade", 
      { y: 40, opacity: 0 }, 
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        }
      }
    );
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
    <section ref={sectionRef} id="contact-section" className="relative w-full pt-[10svh] lg:pt-[15svh] pb-[5svh] px-5 lg:px-10 z-10 lg:mt-14">
      
      <div className="w-full max-w-[1500px] mx-auto flex flex-col">
        
        {/* EDITORIAL TOP BORDER */}
        <div className="w-full flex items-center justify-between mb-12 lg:mb-24 border-b border-zinc-800 pb-4 contact-fade">
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
          <div className="lg:col-span-5 flex flex-col contact-fade">
            
            <h2 className="text-[24vw] sm:text-[12vw] lg:text-[6.5rem] xl:text-[7.5rem] leading-[0.95em] tracking-tighter">
              <span className="font-medium italic text-[#f3f3f3]">
                Let's
              </span> 
              <span className="prime-txt head-txt italic font-medium pr-2">
                Talk.
              </span>
            </h2>

            <p className="text-zinc-400 text-sm lg:text-base leading-relaxed mt-6 lg:mt-8 max-w-sm">
              Hey there. Every robust digital product begins with a single 'hello'. I am all ears, lets create something amazing together.
            </p>
          </div>

          {/* RIGHT SIDE: The Data List */}
          <div className="lg:col-span-7 flex flex-col w-full contact-fade mt-4 lg:mt-0">
            
            {/* EMAIL BLOCK (Kinetic Hover) */}
            <div 
              onClick={() => handleCopy(email, 'email')}
              className="group flex flex-col py-8 lg:py-10 cursor-pointer overflow-hidden"
            >
              <div className="flex items-center justify-between w-full mb-2 lg:mb-4">
                <span className="text-[0.65rem] tracking-[0.2em] font-bold text-zinc-500 uppercase transition-colors group-hover:text-[#FF5733]">
                  Direct Email
                </span>
                <div className="flex items-center h-6 overflow-hidden">
                  {copiedData === 'email' ? (
                    <span className="text-[#FF5733] text-[0.65rem] tracking-widest uppercase font-bold animate-pulse">Copied</span>
                  ) : (
                    <span className="text-zinc-600 text-[0.65rem] tracking-widest uppercase font-bold group-hover:text-[#f3f3f3] transition-colors">Copy</span>
                  )}
                </div>
              </div>
              
              <span className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-light text-zinc-300 group-hover:text-[#f3f3f3] transform group-hover:translate-x-2 lg:group-hover:translate-x-4 transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] pb-2 leading-normal break-all sm:break-normal">
                {email}
              </span>
            </div>

            {/* PHONE BLOCK (Kinetic Hover) */}
            <div 
              onClick={() => handleCopy(phone, 'phone')}
              className="group flex flex-col border-t border-zinc-800 py-8 lg:py-10 cursor-pointer overflow-hidden"
            >
              <div className="flex items-center justify-between w-full mb-2 lg:mb-4">
                <span className="text-[0.65rem] tracking-[0.2em] font-bold text-zinc-500 uppercase transition-colors group-hover:text-[#FF5733]">
                  Direct Phone
                </span>
                <div className="flex items-center h-6 overflow-hidden">
                  {copiedData === 'phone' ? (
                    <span className="text-[#FF5733] text-[0.65rem] tracking-widest uppercase font-bold animate-pulse">Copied</span>
                  ) : (
                    <span className="text-zinc-600 text-[0.65rem] tracking-widest uppercase font-bold group-hover:text-[#f3f3f3] transition-colors">Copy</span>
                  )}
                </div>
              </div>
              
              <span className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-light text-zinc-300 group-hover:text-[#f3f3f3] transform group-hover:translate-x-2 lg:group-hover:translate-x-4 transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] pb-2 leading-normal">
                {phone}
              </span>
            </div>

            {/* DIGITAL / SOCIALS BLOCK */}
            <div className="flex flex-col border-t border-zinc-800 py-8 lg:py-10">
              <span className="text-[0.65rem] tracking-[0.2em] font-bold text-zinc-500 uppercase mb-6 lg:mb-8">
                Digital Network
              </span>
              
              <div className="flex flex-col sm:flex-row flex-wrap gap-8 sm:gap-12 lg:gap-16">
                
                {/* LinkedIn - Vertical Text Roll with Arrows */}
                <a href="#" target="_blank" rel="noopener noreferrer" className="group block overflow-hidden h-[32px] lg:h-[40px] w-fit">
                  <div className="flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:-translate-y-1/2">
                    {/* Top Default State */}
                    <div className="flex items-center gap-2 h-[32px] lg:h-[40px]">
                      <span className="text-2xl lg:text-4xl font-light text-zinc-400">
                        LinkedIn
                      </span>
                      <Icon icon="material-symbols:arrow-outward-rounded" className="text-xl lg:text-2xl text-zinc-600" />
                    </div>
                    {/* Bottom Hover State */}
                    <div className="flex items-center gap-2 h-[32px] lg:h-[40px]">
                      <span className="text-2xl lg:text-4xl font-light text-[#f3f3f3]">
                        LinkedIn
                      </span>
                      <Icon icon="material-symbols:arrow-outward-rounded" className="text-xl lg:text-2xl text-[#FF5733]" />
                    </div>
                  </div>
                </a>

                {/* Instagram - Vertical Text Roll with Arrows */}
                <a href="#" target="_blank" rel="noopener noreferrer" className="group block overflow-hidden h-[32px] lg:h-[40px] w-fit">
                  <div className="flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:-translate-y-1/2">
                    <div className="flex items-center gap-2 h-[32px] lg:h-[40px]">
                      <span className="text-2xl lg:text-4xl font-light text-zinc-400">
                        Instagram
                      </span>
                      <Icon icon="material-symbols:arrow-outward-rounded" className="text-xl lg:text-2xl text-zinc-600" />
                    </div>
                    <div className="flex items-center gap-2 h-[32px] lg:h-[40px]">
                      <span className="text-2xl lg:text-4xl font-light text-[#f3f3f3]">
                        Instagram
                      </span>
                      <Icon icon="material-symbols:arrow-outward-rounded" className="text-xl lg:text-2xl text-[#FF5733]" />
                    </div>
                  </div>
                </a>

                {/* GitHub - Vertical Text Roll with Arrows */}
                <a href="#" target="_blank" rel="noopener noreferrer" className="group block overflow-hidden h-[32px] lg:h-[40px] w-fit">
                  <div className="flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:-translate-y-1/2">
                    <div className="flex items-center gap-2 h-[32px] lg:h-[40px]">
                      <span className="text-2xl lg:text-4xl font-light text-zinc-400">
                        GitHub
                      </span>
                      <Icon icon="material-symbols:arrow-outward-rounded" className="text-xl lg:text-2xl text-zinc-600" />
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

        {/* ABSOLUTE BOTTOM FOOTER */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between mt-24 lg:mt-32 pt-8 contact-fade gap-6 sm:gap-0">
          
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