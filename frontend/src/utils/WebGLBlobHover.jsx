import React, { useRef, Suspense, useEffect } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree, extend } from "@react-three/fiber";
import { useTexture, shaderMaterial } from "@react-three/drei";

// ==========================================
// 1. RAW GLSL SHADER MATERIAL
// ==========================================
const BlobMaterial = shaderMaterial(
  {
    uTexture1: new THREE.Texture(),
    uTexture2: new THREE.Texture(),
    uMouse: new THREE.Vector2(0.5, 0.5),
    uResolution: new THREE.Vector2(1, 1), // Canvas dimensions
    uImageRes: new THREE.Vector2(1, 1),   // Original image dimensions
    uRadius: 0.0, 
    uTime: 0.0, 
    uAspect: 1.0, 
  },
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  `
    uniform sampler2D uTexture1;
    uniform sampler2D uTexture2;
    uniform vec2 uMouse;
    uniform vec2 uResolution;
    uniform vec2 uImageRes;
    uniform float uRadius;
    uniform float uTime;
    uniform float uAspect;
    varying vec2 vUv;

    void main() {
      // ==========================================
      // THE ANTI-STRETCH MATH (object-fit: cover)
      // ==========================================
      vec2 ratio = vec2(
        min((uResolution.x / uResolution.y) / (uImageRes.x / uImageRes.y), 1.0),
        min((uResolution.y / uResolution.x) / (uImageRes.y / uImageRes.x), 1.0)
      );
      vec2 uvCover = vec2(
        vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
        vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
      );

      // We still use the un-cropped UVs for the mouse tracking so circles stay round
      vec2 aspectUv = vUv;
      aspectUv.x *= uAspect;
      vec2 aspectMouse = uMouse;
      aspectMouse.x *= uAspect;

      vec2 delta = aspectUv - aspectMouse;
      float dist = length(delta);
      float angle = atan(delta.y, delta.x);

      float hoverFactor = clamp(uRadius / 0.25, 0.0, 1.0);

      // The Organic Wobble Math
      float w1 = sin(angle * 3.0 + uTime * 6.0) * 0.04;
      float w2 = cos(angle * 5.0 - uTime * 5.5) * 0.02;
      float w3 = sin(angle * 7.0 + uTime * 3.5) * 0.01;
      float w4 = cos(angle * 2.0 - uTime * 6.0) * 0.015;
      
      float wobble = (w1 + w2 + w3 + w4) * hoverFactor;
      float animatedRadius = max(0.0, uRadius + wobble);

      float mask = smoothstep(animatedRadius + 0.001, animatedRadius - 0.001, dist);

      // Background Bulge (Using the newly calculated uvCover)
      float bulgeFactor = smoothstep(0.9, 0.0, dist) * 0.35 * hoverFactor;
      
      // Displacement uses raw vUv for direction, applied to uvCover
      vec2 displacement = vUv - uMouse; 
      vec2 uv1 = uvCover - displacement * bulgeFactor;

      float waveX = sin(vUv.y * 10.0 + uTime * 2.0) * 0.015 * hoverFactor;
      float waveY = cos(vUv.x * 10.0 - uTime * 2.0) * 0.015 * hoverFactor;
      uv1 += vec2(waveX, waveY); 

      vec4 tex1 = texture2D(uTexture1, uv1);

      // Inner Reveal
      vec2 uv2 = uvCover + displacement * mask * 0.04;
      vec4 tex2 = texture2D(uTexture2, uv2);

      gl_FragColor = mix(tex1, tex2, mask);
    }
  `
);

extend({ BlobMaterial });

// ==========================================
// 2. THE INNER WEBGL SCENE
// ==========================================
// Notice we now accept isActive
const Scene = ({ img1, img2, isActive }) => { 
  const materialRef = useRef();
  const [tex1, tex2] = useTexture([img1, img2]);
  
  // 'size' gives us the actual pixel dimensions of the Canvas wrapper
  const { viewport, size } = useThree(); 

  const targetMouse = useRef(new THREE.Vector2(0.5, 0.5));
  const targetRadius = useRef(0.0);
  const isHovered = useRef(false);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uTime = state.clock.elapsedTime;
      materialRef.current.uAspect = viewport.width / viewport.height;
      
      // Pass resolutions to the shader for the anti-stretch logic
      materialRef.current.uResolution.set(size.width, size.height);
      if (tex1.image) {
        materialRef.current.uImageRes.set(tex1.image.width, tex1.image.height);
      }

      // MOBILE LOGIC: If active (via scroll/click) but not hovered by a physical mouse, bloom in the center
      if (isActive && !isHovered.current) {
        targetRadius.current = 0.25;
        targetMouse.current.set(0.5, 0.5); // Force center
      } else if (!isActive && !isHovered.current) {
        targetRadius.current = 0.0;
      }

      materialRef.current.uMouse.lerp(targetMouse.current, 0.08);
      materialRef.current.uRadius = THREE.MathUtils.lerp(
        materialRef.current.uRadius,
        targetRadius.current,
        0.13
      );
    }
  });

  return (
    <mesh
      onPointerMove={(e) => {
        targetMouse.current.set(e.uv.x, e.uv.y);
      }}
      onPointerEnter={() => {
        isHovered.current = true;
        targetRadius.current = 0.20;
      }}
      onPointerLeave={() => {
        isHovered.current = false;
        // Radius closing is handled by the useFrame logic checking isActive
      }}
    >
      <planeGeometry args={[viewport.width, viewport.height]} />
      <blobMaterial ref={materialRef} uTexture1={tex1} uTexture2={tex2} />
    </mesh>
  );
};

// ==========================================
// 3. THE OUTER REACT COMPONENT
// ==========================================
// Added isActive to props
const WebGLBlobHover = ({ baseImage, revealImage, isActive, className = "" }) => {
  return (
    <div className={`relative w-full h-full overflow-hidden bg-[#0a0a0a] ${className}`}>
      <Canvas orthographic camera={{ position: [0, 0, 1], zoom: 1 }}>
        <Suspense fallback={null}>
          <Scene img1={baseImage} img2={revealImage} isActive={isActive} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default WebGLBlobHover;