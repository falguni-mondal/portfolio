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
  const { scene } = useGLTF('/falguni_ring_metal.glb');
  
  const scrollGroupRef = useRef(); 
  const mouseGroupRef = useRef();  
  const ringRef = useRef();        
  
  const mouse = useRef({ x: 0, y: -0.8 });

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
        child.material.needsUpdate = false; 
      }
    });

    // FIXED 1: The Object Position
    // Changed x from -2.7 to -1.8 to pull it closer to the center of the new aspect ratio
    scrollGroupRef.current.position.set(-2.0, -6, 0); 
    
    ringRef.current.rotation.set(-Math.PI / 16, Math.PI / 8, 0);

    gsap.to(scrollGroupRef.current.position, {
      y: -0.2, 
      ease: "power2.out",
      scrollTrigger: {
        trigger: "#works-section",
        start: "top 30%", 
        end: "top -20%", 
        scrub: 1,
      }
    });

    gsap.to(scrollGroupRef.current.position, {
      y: 6, 
      ease: "power2.in", 
      scrollTrigger: {
        trigger: "#works-section",
        start: "bottom 60%", 
        end: "bottom top",   
        scrub: 1,
      }
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#works-section",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      }
    });

    const targetScale = isMobile ? 0.45 : 0.60;

    tl.to(ringRef.current.rotation, {
      y: -Math.PI / 2, 
      x: Math.PI / 16, 
      ease: "none",
    }, 0)
    .to(ringRef.current.scale, {
      x: targetScale, 
      y: targetScale,
      z: targetScale,
      ease: "none",
    }, 0);
  }, [isMobile]);

  useFrame(() => {
    if (mouseGroupRef.current) {
      const targetX = (mouse.current.y * Math.PI) / 16; 
      const targetY = (mouse.current.x * Math.PI) / 16; 

      mouseGroupRef.current.rotation.x = THREE.MathUtils.lerp(mouseGroupRef.current.rotation.x, targetX, 0.05);
      mouseGroupRef.current.rotation.y = THREE.MathUtils.lerp(mouseGroupRef.current.rotation.y, targetY, 0.05);
    }
  });

  const initialScale = isMobile ? 0.65 : 0.75;

  return (
    <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.3}>
      <group ref={scrollGroupRef}>
        <group ref={mouseGroupRef}>
          <group ref={ringRef} scale={initialScale}>
            <primitive object={scene} position={[0, 0, 0]} />
          </group>
        </group>
      </group>
    </Float>
  );
};

useGLTF.preload('/falguni_ring_metal.glb');

const HomeCanvasBackground = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    setIsMobile(mediaQuery.matches);

    const handleResize = (e) => {
      setIsMobile(e.matches);
    };

    mediaQuery.addEventListener('change', handleResize);
    return () => mediaQuery.removeEventListener('change', handleResize);
  }, []);

  return (
    <Canvas 
      // FIXED 2: The Camera Pan
      // Moved the camera X from 0 to -0.5. This effectively pans the entire scene slightly right
      camera={{ position: [-0.5, -0.5, 5], fov: 45 }}
      dpr={[1, 1.5]} 
      gl={{ powerPreference: "high-performance", antialias: false }}
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

      <EffectComposer disableNormalPass>
        {!isMobile && <Noise opacity={0.02} />}
        <Bloom luminanceThreshold={2.0} luminanceSmoothing={1.2} intensity={0.1} mipmapBlur />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer>
    </Canvas>
  );
};

export default HomeCanvasBackground;