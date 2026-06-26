import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Icon } from '@iconify/react';
import { useLabStore } from '../../../store/store';

const MagneticButton = () => {
  const btnRef = useRef(null);
  const textRef = useRef(null);
  const fillRef = useRef(null);

  const theme = useLabStore((state) => state.theme);

  useGSAP(() => {
    gsap.set(fillRef.current, { xPercent: -50, yPercent: 100 });
  });

  const handleMouseEnter = () => {
    gsap.killTweensOf(fillRef.current);
    gsap.killTweensOf(textRef.current);

    gsap.fromTo(fillRef.current, 
      { yPercent: 100, xPercent: -50 }, 
      { yPercent: -25, xPercent: -50, duration: 0.8, ease: 'power3.out' }
    );
    
    gsap.to(textRef.current, { 
      color: theme === 'dark' ? '#0b0a09' : '#f3f3f3', 
      duration: 0.3 
    });
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
    gsap.to(textRef.current, { color: () => theme === "dark" ? '#f3f3f3' : '#0b0a09', duration: 0.5 });

    gsap.to([btnRef.current, textRef.current], {
      x: 0,
      y: 0,
      duration: 0.8,
      ease: 'elastic.out(1.2, 0.4)',
    });
  };

  return (
    <div className="cta-block">
      <a
        href="/falguni_mondal_resume.pdf"
        download="Falguni_Mondal_Resume.pdf"
        ref={btnRef}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative flex items-center justify-center w-28 h-28 lg:w-32 lg:h-32 rounded-full bg-[#FF5733] overflow-hidden cursor-pointer border-none outline-none block"
      >
        <div 
          ref={fillRef}
          className={`absolute top-0 left-1/2 w-[150%] h-[150%] rounded-[50%] z-0 pointer-events-none ${theme === 'dark' ? 'bg-[#f3f3f3]' : 'bg-[#0e0d0d]'}`}
        ></div>
        
        <span 
          ref={textRef} 
          className={`relative z-10 flex items-center gap-1 ${theme === "dark" ? "text-[#f3f3f3]" : "text-[#0b0a09]"} text-sm pointer-events-none font-medium lg:font-normal`}
        >
          My resume
          <Icon icon="material-symbols:arrow-outward-rounded" className="text-sm lg:text-base" />
        </span>
      </a>
    </div>
  );
};

export default MagneticButton;