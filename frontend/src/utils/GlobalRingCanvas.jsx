import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, ContactShadows, Float } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const Ring = ({ isMobile }) => {
  const { scene } = useGLTF('/falguni_ring.glb');
  
  const scrollGroupRef = useRef(); 
  const mouseGroupRef = useRef();  
  const ringRef = useRef();        
  
  const mouse = useRef({ x: 0, y: -0.8 });
  const scrollData = useRef({ velocity: 0, currentSpin: 0 });

  useEffect(() => {
    const handleMouseMove = (event) => {
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useGSAP(() => {
    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.envMapIntensity = 1.2; 
        child.material.roughness = 0.15; 
        child.material.metalness = 1; 
      }
    });

    ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        scrollData.current.velocity = self.getVelocity();
      }
    });

    // ==========================================
    // RESPONSIVE SIZING & COORDINATES
    // ==========================================
    const baseScale = isMobile ? 0.30 : 0.60; 
    const sigScale = isMobile ? 0.45 : 0.60 * 1.8; 
    const travelDistance = isMobile ? 0.55 : 2.5; 
    const centerOffset = isMobile ? 0 : -0.5; 
    const initialYOffset = isMobile ? 1.0 : 0; 

    // Hard-set the true initial state before any animations run
    gsap.set(scrollGroupRef.current.position, { 
      x: -travelDistance + centerOffset, 
      y: initialYOffset, 
      z: 0 
    });
    gsap.set(scrollGroupRef.current.scale, { 
      x: baseScale, 
      y: baseScale, 
      z: baseScale 
    });

    // ==========================================
    // THE TIMELINES (Flawless Master Arc Architecture)
    // ==========================================

    // Transition 1: About -> Lab (Glides from Left to Right)
    gsap.fromTo(scrollGroupRef.current.position,
      { 
        x: -travelDistance + centerOffset, 
        y: initialYOffset 
      },
      {
        x: travelDistance + centerOffset,
        y: 0, 
        ease: "power2.inOut",
        immediateRender: false, 
        scrollTrigger: {
          trigger: "#lab-section",
          start: "top bottom", 
          end: "top top",      
          scrub: 1,
        }
      }
    );

    // Transition 2 & 3 Combined: The Signature Arc (Certificates -> Signature -> Contact)
    // This single timeline spans the entire lifespan of the Signature section visibility
    const sigTl = gsap.timeline({
      scrollTrigger: {
        trigger: "#signature-section",
        start: "top bottom", // Triggers when Signature enters the bottom of the screen
        end: "bottom top",   // Ends when Signature completely leaves the top of the screen
        scrub: 1,
      }
    });

    // Phase 1: Enter & Expand (Right to Center)
    // This naturally takes up the first 50% of the scroll timeline
    sigTl.fromTo(scrollGroupRef.current.position, 
      { x: travelDistance + centerOffset }, 
      { x: 0 + centerOffset, ease: "power1.inOut", immediateRender: false }
    )
    .fromTo(scrollGroupRef.current.scale, 
      { x: baseScale, y: baseScale, z: baseScale }, 
      { x: sigScale, y: sigScale, z: sigScale, ease: "power1.inOut", immediateRender: false }, 
      "<" // The "<" symbol tells GSAP to play this at the exact same time as the position move
    )
    
    // Phase 2: Exit & Shrink (Center to Left)
    // This seamlessly takes over the remaining 50% of the scroll timeline
    .to(scrollGroupRef.current.position, 
      { x: -travelDistance + centerOffset, ease: "power1.inOut" }
    )
    .to(scrollGroupRef.current.scale, 
      { x: baseScale, y: baseScale, z: baseScale, ease: "power1.inOut" }, 
      "<"
    );

  }, [isMobile]);

  // ==========================================
  // --- RING PHYSICS CONTROLS ---
  // ==========================================
  const IDLE_SPIN = 0.002;           
  const SCROLL_MULTIPLIER = 0.00008; 
  const BRAKING_SPEED = 0.05;        
  const VELOCITY_DECAY = 0.9;        

  useFrame(() => {
    if (mouseGroupRef.current) {
      const targetX = (mouse.current.y * Math.PI) / 16; 
      const targetY = (mouse.current.x * Math.PI) / 16; 
      mouseGroupRef.current.rotation.x = THREE.MathUtils.lerp(mouseGroupRef.current.rotation.x, targetX, 0.05);
      mouseGroupRef.current.rotation.y = THREE.MathUtils.lerp(mouseGroupRef.current.rotation.y, targetY, 0.05);
    }

    if (ringRef.current) {
      const targetSpin = IDLE_SPIN + (scrollData.current.velocity * SCROLL_MULTIPLIER);
      
      scrollData.current.currentSpin = THREE.MathUtils.lerp(
        scrollData.current.currentSpin, 
        targetSpin, 
        BRAKING_SPEED
      );

      ringRef.current.rotation.x += scrollData.current.currentSpin;
      ringRef.current.rotation.y += scrollData.current.currentSpin * 0.8; 
      ringRef.current.rotation.z += IDLE_SPIN; 

      scrollData.current.velocity *= VELOCITY_DECAY;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.3}>
      <group ref={scrollGroupRef}>
        <group ref={mouseGroupRef}>
          <group ref={ringRef}>
            <primitive object={scene} position={[0, 0, 0]} />
          </group>
        </group>
      </group>
    </Float>
  );
};

useGLTF.preload('/falguni_ring.glb');

const GlobalRingCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    setIsMobile(mediaQuery.matches);

    const handleResize = (e) => setIsMobile(e.matches);
    mediaQuery.addEventListener('change', handleResize);
    return () => mediaQuery.removeEventListener('change', handleResize);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-[100svh] z-[-1] pointer-events-none">
      <Canvas 
        camera={{ position: [-0.5, 0, 5], fov: 45 }}
        dpr={[1, 1.5]} 
        gl={{ powerPreference: "high-performance", antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.4} />
        
        <directionalLight position={[0, 3, 5]} intensity={3} />
        <spotLight position={[5, 5, -5]} angle={0.5} penumbra={1} intensity={5} color="#ffffff" />
        <spotLight position={[-5, -5, -5]} angle={0.5} penumbra={1} intensity={4} color="#ffffff" />
        
        <Environment 
          preset="studio" 
          environmentIntensity={0.8} 
          environmentRotation={[0, Math.PI / 1.2, 0]} 
        /> 

        <ContactShadows frames={1} position={[0, -1.5, 0]} opacity={0.6} scale={isMobile ? 7 : 10} blur={2.5} far={4} color="#000000" />

        <Ring isMobile={isMobile} />

        {!isMobile && (
          <EffectComposer disableNormalPass>
            <Noise opacity={0.02} />
            <Bloom luminanceThreshold={2.0} luminanceSmoothing={1.2} intensity={0.1} mipmapBlur />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
};

export default GlobalRingCanvas;