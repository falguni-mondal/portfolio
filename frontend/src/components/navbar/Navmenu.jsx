import React, { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { Link } from 'react-router-dom'

const Navmenu = ({ isOpen, setIsOpen }) => {
  const containerRef = useRef(null);
  const linksRef = useRef([]);
  const tl = useRef(null); 

  useGSAP(() => {
    gsap.set(linksRef.current, { y: 60, opacity: 0 });

    tl.current = gsap.timeline({ paused: true })
      .to(containerRef.current, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        duration: 0.8,
        ease: "power4.inOut"
      })
      .to(linksRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.08,
        ease: "power3.out"
      }, "-=0.4");
  }, []); 

  useGSAP(() => {
    if (tl.current) {
      if (isOpen) {
        gsap.set(containerRef.current, { pointerEvents: "auto" }); 
        tl.current.play();
      } else {
        tl.current.reverse().then(() => {
          gsap.set(containerRef.current, { pointerEvents: "none" }); 
        });
      }
    }
  }, [isOpen]);

  const navLinks = [
    { title: 'Works', path: '/#works' },
    { title: 'Lab', path: '/#lab' },
    { title: 'About', path: '/#about' },
    { title: 'Certs', path: '/#certifications' }, // Changed to 'Certs' to prevent text cutoff
  ];

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-40 bg-zinc-900/80 backdrop-blur-md flex flex-col justify-center px-8 md:px-16 pointer-events-none"
      style={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)" }}
    >
      <div className="flex flex-col gap-4 md:gap-6 max-w-7xl w-full mx-auto">
        
        {/* SPA Internal Navigation Links via React Router */}
        {navLinks.map((link, index) => (
          <div key={index} className="overflow-hidden">
            <Link 
              ref={(el) => (linksRef.current[index] = el)}
              to={link.path} 
              onClick={() => setIsOpen(false)} 
              className="font-display text-6xl md:text-[7rem] uppercase leading-[0.85em] text-[#f8f8f8] hover:text-[#FF5733] transition-colors inline-block w-fit tracking-tighter"
            >
              {link.title}
            </Link>
          </div>
        ))}

        {/* External Social Links (Using standard <a> tags with span brackets) */}
        <div className="overflow-hidden mt-12 md:mt-16">
            <div 
                ref={(el) => (linksRef.current[navLinks.length] = el)} 
                className="flex flex-wrap gap-6 md:gap-10 font-mono text-[0.75rem] md:text-sm tracking-[0.2em] text-gray-300 font-semibold uppercase"
            >
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="group hover:text-white transition-colors duration-300">
                    <span className="text-gray-500 mr-2 group-hover:text-[#FF5733] transition-colors">[</span>
                    LINKEDIN
                    <span className="text-gray-500 ml-2 group-hover:text-[#FF5733] transition-colors">]</span>
                </a>
                
                <a href="https://github.com" target="_blank" rel="noreferrer" className="group hover:text-white transition-colors duration-300">
                    <span className="text-gray-500 mr-2 group-hover:text-[#FF5733] transition-colors">[</span>
                    GITHUB
                    <span className="text-gray-500 ml-2 group-hover:text-[#FF5733] transition-colors">]</span>
                </a>
                
                <a href="/resume.pdf" target="_blank" rel="noreferrer" className="group hover:text-white transition-colors duration-300">
                    <span className="text-gray-500 mr-2 group-hover:text-[#FF5733] transition-colors">[</span>
                    RESUME
                    <span className="text-gray-500 ml-2 group-hover:text-[#FF5733] transition-colors">]</span>
                </a>
            </div>
        </div>

      </div>
    </div>
  )
}

export default Navmenu