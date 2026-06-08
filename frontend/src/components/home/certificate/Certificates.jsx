import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import CertificateItem from './CertificateItem';

gsap.registerPlugin(ScrollTrigger);

const MOCK_CERTIFICATES = [
  {
    id: 1,
    title: "Advanced React & Interactive UI",
    issuer: "Meta",
    year: "2025",
    credentialId: "MT-88291X",
    link: "#"
  },
  {
    id: 2,
    title: "Back-End Web Architecture (Node.js)",
    issuer: "IBM",
    year: "2024",
    credentialId: "IB-40922A",
    link: "#"
  },
  {
    id: 3,
    title: "JavaScript Algorithms & Data Structures",
    issuer: "freeCodeCamp",
    year: "2024",
    credentialId: "FC-11099B",
    link: "#"
  },
  {
    id: 4,
    title: "MongoDB Data Modeling",
    issuer: "MongoDB University",
    year: "2024",
    credentialId: "MG-33420C",
    link: "#"
  }
];

const Certificates = () => {
  const sectionRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(".cert-fade", 
      { y: 40, opacity: 0 }, 
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        }
      }
    );
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="certificates-section" className="relative w-full pt-[10svh] lg:pt-[15svh] pb-[15svh] px-5 lg:px-10 z-10 lg:mt-14">
      
      <div className="w-full max-w-[1500px] mx-auto flex flex-col">
        
        {/* COMBINED HEADER ROW */}
        <div className="w-full flex flex-col lg:flex-row items-start lg:items-end justify-between mb-16 lg:mb-20 border-b border-zinc-800 pb-8 lg:pb-12 cert-fade">
          
          {/* BRUTALIST HEADING */}
          <h2 className="text-[14vw] sm:text-[10vw] lg:text-[6.5rem] xl:text-[7.5rem] leading-[0.95em] tracking-tighter">
            <span className="font-light italic text-zinc-500">
              Verified
            </span> 
            <br />
            <span className="text-[#f3f3f3] font-bold pr-2">
              Credentials.
            </span>
          </h2>

          {/* METADATA FLANKS */}
          <div className="flex flex-wrap items-center gap-6 lg:gap-12 mt-8 lg:mt-0 lg:pb-3">
            <span className="text-[0.55rem] sm:text-[0.65rem] tracking-[0.2em] font-medium text-zinc-500 uppercase">
              ( Accreditations )
            </span>
            <span className="text-[0.55rem] sm:text-[0.65rem] tracking-[0.2em] font-medium text-zinc-500 uppercase">
              ( Skill Validation )
            </span>
          </div>

        </div>

        {/* THE PLAQUE GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 w-full cert-fade">
          {MOCK_CERTIFICATES.map((cert) => (
            <CertificateItem key={cert.id} cert={cert} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default Certificates;