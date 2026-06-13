import React, { useState, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link, useLocation } from 'react-router-dom'
import Navmenu from './Navmenu'

// Register ScrollTrigger to handle scroll-linked animations
gsap.registerPlugin(ScrollTrigger);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const textRef = useRef(null);
  const navRef = useRef(null); 
  
  const location = useLocation();

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
      // Ensures both logo and connect link are visible on other pages
      gsap.set(["#logo", ".contact-nav"], { opacity: 1 });
      return; 
    }

    // --- ONLY RUNS ON THE HOME PAGE ('/') ---
    
    // The exact physical pixel height of the Hero element
    const getOffset = () => {
      const heroSection = document.getElementById('hero-section');
      return heroSection ? heroSection.offsetHeight : window.innerHeight - navRef.current.offsetHeight;
    };

    // A. INITIAL STATE
    gsap.set(navRef.current, { y: getOffset() });
    // Hides both the logo and connect link initially
    gsap.set(["#logo", ".contact-nav"], { opacity: 0 });

    gsap.from(navRef.current, {
      opacity: 0,
      duration: 1,
      delay: 0.5, 
      ease: "power3.out"
    });

    // B. THE SCRUB
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

    // C. THE LOGO & CONNECT REVEAL
    // Targets both elements to fade in simultaneously as it docks
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

  return (
    <>
      <div 
        ref={navRef} 
        className='w-full max-w-[1500px] h-[50px] lg:h-[60px] px-5 lg:px-10 flex items-center justify-between fixed top-0 left-0 z-50 mix-blend-difference text-white'
      >
          <div id="logo" className="cursor-pointer z-50 pointer-events-auto">
              <Link to="/">
                  <img className='w-[65px] lg:w-[70px]' src="/logo.svg" alt="logo" />
              </Link>
          </div>
          <nav className="navigations">
              <ul className='hidden lg:flex gap-10 text-xs'>
                {navLinks.map((link, index) => (
                  <li key={index} className='nav-link cursor-pointer relative uppercase'>
                    <a href={link.path}>{link.title}</a>
                  </li>
                ))}
              </ul>
          </nav>

          <nav className="contact-nav uppercase text-xs hidden lg:block">
                <a href="/#contact">( connect )</a>
          </nav>
          
          <div 
            className="nav-icon lg:hidden text-[0.7rem] font-medium cursor-pointer h-[1rem] overflow-hidden z-50 pointer-events-auto"
            onClick={() => setIsOpen(!isOpen)}
          >
              <div ref={textRef} className="flex flex-col">
                  <span className="h-[1rem] leading-[1rem] block">(MENU)</span>
                  <span className="h-[1rem] leading-[1rem] block">(CLOSE)</span>
              </div>
          </div>
      </div>

      <Navmenu isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  )
}

export default Navbar