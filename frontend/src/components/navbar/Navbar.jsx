import React, { useState, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { Link } from 'react-router-dom'
import Navmenu from './Navmenu'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const textRef = useRef(null);
  const navRef = useRef(null); // Reference for the entire navbar container

  // 1. The Menu Text Toggle Animation (Existing)
  useGSAP(() => {
    gsap.to(textRef.current, {
      yPercent: isOpen ? -50 : 0,
      duration: 0.6,
      ease: "power4.inOut"
    });
  }, [isOpen]);

  // 2. The Initial Load-in Reveal Animation
  useGSAP(() => {
    // Slides down from above the viewport and fades in, 
    // waiting 1.5s so it perfectly trails the Hero text reveal.
    gsap.from(navRef.current, {
      y: -50,
      opacity: 0,
      duration: 1,
      delay: 1.5, 
      ease: "power3.out"
    });
  }, []); // Empty dependency array ensures it only runs once on page load

  return (
    <>
      <div 
        ref={navRef} 
        className='w-full h-[50px] px-5 flex items-center justify-between fixed top-0 left-0 z-50 bg-transparent mix-blend-difference text-white'
      >
          <div id="logo" className="cursor-pointer z-50 pointer-events-auto">
              <Link to="/">
                  <img className='w-[65px]' src="/logo_w.svg" alt="logo" />
              </Link>
          </div>
          
          <div 
            className="nav-icon text-[0.7rem] font-medium cursor-pointer h-[1rem] overflow-hidden z-50 pointer-events-auto"
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