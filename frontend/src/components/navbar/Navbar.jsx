import React, { useState, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';
import Navmenu from './Navmenu';
import { useLabStore } from '../../store/store';

gsap.registerPlugin(ScrollTrigger);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const textRef = useRef(null);
  const navRef = useRef(null); 
  
  // POPUP STATE
  const [showPopup, setShowPopup] = useState(false);
  const popupTimer = useRef(null);
  
  const location = useLocation();

  const theme = useLabStore((state) => state.theme);
  const toggleTheme = useLabStore((state) => state.toggleTheme);

  // 1. The Menu Text Toggle Animation 
  useGSAP(() => {
    gsap.to(textRef.current, {
      yPercent: isOpen ? -50 : 0,
      duration: 0.6,
      ease: "power4.inOut"
    });
  }, [isOpen]);

  // 2. The Furo-Style Scroll Pinning Logic
  useGSAP(() => {
    if (location.pathname !== '/') {
      gsap.set(navRef.current, { y: 0, opacity: 1 });
      gsap.set(["#logo", ".contact-nav"], { opacity: 1 });
      return; 
    }

    const getOffset = () => {
      const heroSection = document.getElementById('hero');
      return heroSection ? heroSection.offsetHeight : window.innerHeight - navRef.current.offsetHeight;
    };

    gsap.set(navRef.current, { y: getOffset() });
    gsap.set(["#logo", ".contact-nav"], { opacity: 0 });

    gsap.from(navRef.current, {
      opacity: 0,
      duration: 1,
      delay: 0.5, 
      ease: "power3.out"
    });

    gsap.to(navRef.current, {
      y: 0,
      ease: "none", 
      scrollTrigger: {
        trigger: document.documentElement,
        start: "top top",
        end: () => `+=${getOffset()}`, 
        scrub: true,
        invalidateOnRefresh: true, 
      }
    });

    gsap.to(["#logo", ".contact-nav"], {
      opacity: 1,
      duration: 0.3,
      ease: "power2.out",
      scrollTrigger: {
        trigger: document.documentElement,
        start: () => `top+=${getOffset() - 20} top`, 
        toggleActions: "play none none reverse", 
        invalidateOnRefresh: true,
      }
    });

  }, [location.pathname]); 

  const navLinks = [
    { title: 'Experience', path: '/#experience' },
    { title: 'Works', path: '/#works' },
    { title: 'About', path: '/#about' },
    { title: 'Lab', path: '/#lab' },
    { title: 'Certificates', path: '/#certificates' }, 
  ];

  // TEMPORARY TOGGLE HANDLER
  const handleThemeClick = () => {
    // toggleTheme(); <-- Uncomment this when light mode is finished

    // Trigger the WIP popup
    setShowPopup(true);
    
    // Clear any existing timer so spam-clicking doesn't break the animation
    if (popupTimer.current) clearTimeout(popupTimer.current);
    
    // Hide popup after 3.5 seconds
    popupTimer.current = setTimeout(() => {
      setShowPopup(false);
    }, 3500);
  };

  return (
    <>
      <div 
        ref={navRef} 
        className={`w-full h-[50px] lg:h-[60px] px-5 lg:px-10 flex items-center justify-between ${isOpen ? "" : "mix-blend-difference"} ${theme === "dark" ? "text-[#ffffff]" : "#000000 font-medium"} relative z-50`}
      >
          <div id="logo" className="cursor-pointer z-50 pointer-events-auto">
              <Link to="/">
                  <img className='w-[65px] lg:w-[70px] 2xl:w-[80px]' src="/logo.svg" alt="logo" />
              </Link>
          </div>
          <nav className="navigations">
              <ul className='hidden lg:flex gap-10 text-xs xl:text-[0.8rem] 2xl:text-base'>
                {navLinks.map((link, index) => (
                  <li key={index} className='nav-link cursor-pointer relative uppercase'>
                    <a href={link.path}>{link.title}</a>
                  </li>
                ))}
              </ul>
          </nav>

          <div className="flex items-center gap-6 relative z-50 pointer-events-auto">
            <nav className="contact-nav uppercase text-xs xl:text-[0.8rem] 2xl:text-base hidden lg:block">
                  <a href="/#contact">( connect )</a>
            </nav>

            {/* THE THEME TOGGLE */}
            <button 
              onClick={handleThemeClick}
              className="flex items-center justify-center text-lg lg:text-xl 2xl:text-2xl transition-colors duration-300 hover:text-[#FF5733] cursor-pointer"
              aria-label="Toggle Dark Mode"
            >
              <Icon icon={theme === 'dark' ? "material-symbols:light-mode-outline" : "material-symbols:dark-mode-outline"} />
            </button>
            
            <div 
              className="nav-icon lg:hidden text-[0.7rem] xl:text-[0.8rem] font-medium cursor-pointer h-[1rem] overflow-hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
                <div ref={textRef} className="flex flex-col">
                    <span className="h-[1rem] leading-[1rem] block">(MENU)</span>
                    <span className="h-[1rem] leading-[1rem] block">(CLOSE)</span>
                </div>
            </div>
          </div>
      </div>

      <Navmenu isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* WORK IN PROGRESS POPUP TOAST */}
      <div 
        className={`fixed top-[80px] lg:top-[90px] left-1/2 -translate-x-1/2 z-[100] flex items-center justify-center px-6 py-3 rounded-md border border-zinc-800 bg-[#0a0a0a]/90 backdrop-blur-md shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${
          showPopup 
            ? "opacity-100 translate-y-0 scale-100" 
            : "opacity-0 -translate-y-4 scale-95 pointer-events-none"
        }`}
      >
        <p className="text-xs sm:text-sm font-medium tracking-[0.05em] text-zinc-300 text-center whitespace-nowrap">
          <span className="text-[#FF5733] mr-1">Work in progress!</span> 
          Will be available soon. Thank You.
        </p>
      </div>
    </>
  )
}

export default Navbar;