import React, { useRef } from 'react'
import { Icon } from "@iconify/react";
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const Hero = () => {
  const heroRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline();

    // --- INITIAL STATES ---
    gsap.set('.hero-img img', { clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)', scale: 1.2 });
    gsap.set('.first-name, .last-name', { y: 100, opacity: 0, skewY: 5 });
    
    // 3. Badge (THE FINISHING STAMP): Pushed bottom-right, angled slightly more, zero opacity
    gsap.set('.folio-txt', { opacity: 0, x: 30, y: 20, rotation: -20 });
    
    gsap.set('.my-role, .my-intro, .actions-container', { y: 30, opacity: 0 });


    // --- ANIMATION TIMELINE ---
    tl.to('.hero-img img', {
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
      scale: 1,
      duration: 1.6,
      ease: 'power4.inOut'
    })
    
    .to('.my-role, .my-intro, .actions-container', {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out'
    }, "-=0.8")

    .to('.first-name, .last-name', {
      y: 0,
      opacity: 1,
      skewY: 0,
      duration: 1.2,
      stagger: 0.15,
      ease: 'power4.out'
    }, "-=0.9")

    // 4. Badge (THE FINISHING STAMP): 
    // Triggers "-=0.3" (right as MONDAL is finishing). 
    // Slides in diagonally with a premium 'back.out' snap.
    .to('.folio-txt', {
      opacity: 0.9, 
      x: 0,
      y: 0,
      rotation: -12, 
      duration: 0.8,
      ease: 'back.out(1.5)' 
    }, "-=0.7"); 

  }, { scope: heroRef });

  return (
    <section ref={heroRef} className='flex flex-col justify-between h-[calc(100dvh-60px)] relative overflow-hidden' id='hero-section'>
        <div className="top-hero flex flex-col">
            <div className="left-hero">
                <h2 className='my-role font-semibold mb-3'>Full-Stack Developer</h2>
                <p className='my-intro text-[0.8rem] dim-txt'>A professional <span className='prime-txt'>Web</span> Developer helping startups all around the world gain their unfair advantage by engineering scalable architectures and highly immersive digital experiences.</p>
                <div className="actions-container flex items-center mt-3 gap-2 font-medium">
                    <div className="book-a-call uppercase prime-bg  text-[0.7rem] h-10 px-5 rounded-[2px] flex justify-center items-center gap-1">
                        <span>book a call</span>
                        <Icon className='text-[0.85rem]' icon="material-symbols:arrow-outward"/>
                    </div>
                    {/* <div className="linkedin border-[1px] border-zinc-500 rounded h-10 aspect-square flex justify-center items-center">
                        <Icon icon="cib:linkedin-in"/>
                    </div>
                    <div className="github border-[1px] border-zinc-500 rounded h-10 aspect-square flex justify-center items-center">
                        <Icon icon="cib:github"/>
                    </div> */}
                    <div className="resume bg-zinc-800 rounded-[2px] h-10 aspect-square flex justify-center items-center">
                        <Icon icon="solar:cloud-download-outline"/>
                    </div>
                </div>
            </div>
            <div className="hero-img w-full mt-5">
                <img className='w-full object-cover' src="/me.webp" alt="falguni_mondal_image" />
            </div>
        </div>
        <div className="bottom-hero w-full absolute bottom-0 left-0">
            <h1 className='my-name head-txt uppercase text-[10rem] flex flex-col'>
                <span className="first-name leading-[0.75em]">
                    falguni
                </span>
                <span className="last-name self-end relative leading-[0.75em]">
                    mondal
                    <span className="folio-txt flex absolute bottom-8 right-15 prime-bg text-[1.5rem] px-3 leading-none tracking-widest py-2 rounded-[2px] opacity-90 -rotate-12 dark-txt">
                        folio '{new Date().getFullYear().toString().slice(-2)}
                    </span>
                </span>
            </h1>
        </div>
    </section>
  )
}

export default Hero