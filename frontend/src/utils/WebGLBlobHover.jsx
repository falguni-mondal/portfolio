import React, { useRef, Suspense, useEffect } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree, extend } from "@react-three/fiber";
import { useTexture, shaderMaterial } from "@react-three/drei";

// ==========================================
// 1. GLOBAL MOUSE TRACKER (SINGLETON)
// ==========================================
const globalMouse = { x: -1000, y: -1000 };
let isMouseInitialized = false;

const initGlobalMouse = () => {
  if (typeof window !== "undefined" && !isMouseInitialized) {
    window.addEventListener("mousemove", (e) => {
      globalMouse.x = e.clientX;
      globalMouse.y = e.clientY;
    }, { passive: true });
    isMouseInitialized = true;
  }
};

// ==========================================
// 2. RAW GLSL SHADER MATERIAL
// ==========================================
const BlobMaterial = shaderMaterial(
  {
    uTexture1: new THREE.Texture(),
    uTexture2: new THREE.Texture(),
    uMouse: new THREE.Vector2(0.5, 0.5),
    uResolution: new THREE.Vector2(1, 1), 
    uImageRes: new THREE.Vector2(1, 1),   
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
      vec2 ratio = vec2(
        min((uResolution.x / uResolution.y) / (uImageRes.x / uImageRes.y), 1.0),
        min((uResolution.y / uResolution.x) / (uImageRes.y / uImageRes.x), 1.0)
      );
      vec2 uvCover = vec2(
        vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
        vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
      );

      vec2 aspectUv = vUv;
      aspectUv.x *= uAspect;
      vec2 aspectMouse = uMouse;
      aspectMouse.x *= uAspect;

      vec2 delta = aspectUv - aspectMouse;
      float dist = length(delta);
      float angle = atan(delta.y, delta.x);

      float hoverFactor = clamp(uRadius / 0.25, 0.0, 1.0);

      float w1 = sin(angle * 3.0 + uTime * 6.0) * 0.04;
      float w2 = cos(angle * 5.0 - uTime * 5.5) * 0.02;
      float w3 = sin(angle * 7.0 + uTime * 3.5) * 0.01;
      float w4 = cos(angle * 2.0 - uTime * 6.0) * 0.015;
      
      float wobble = (w1 + w2 + w3 + w4) * hoverFactor;
      float animatedRadius = max(0.0, uRadius + wobble);

      float mask = smoothstep(animatedRadius + 0.001, animatedRadius - 0.001, dist);

      float bulgeFactor = smoothstep(0.9, 0.0, dist) * 0.35 * hoverFactor;
      
      vec2 displacement = vUv - uMouse; 
      vec2 uv1 = uvCover - displacement * bulgeFactor;

      float waveX = sin(vUv.y * 10.0 + uTime * 2.0) * 0.015 * hoverFactor;
      float waveY = cos(vUv.x * 10.0 - uTime * 2.0) * 0.015 * hoverFactor;
      uv1 += vec2(waveX, waveY); 

      vec4 tex1 = texture2D(uTexture1, uv1);

      vec2 uv2 = uvCover + displacement * mask * 0.04;
      vec4 tex2 = texture2D(uTexture2, uv2);

      gl_FragColor = mix(tex1, tex2, mask);
    }
  `
);

extend({ BlobMaterial });

// ==========================================
// 3. THE OPTIMIZED INNER WEBGL SCENE
// ==========================================
const Scene = ({ img1, img2 }) => { 
  const materialRef = useRef();
  const [tex1, tex2] = useTexture([img1, img2]);
  const { viewport, size, gl } = useThree(); 

  const targetMouse = useRef(new THREE.Vector2(0.5, 0.5));
  const targetRadius = useRef(0.0);
  
  // THE TWO-BOX ARCHITECTURE REFS
  const canvasRectRef = useRef(null);
  const hitboxRectRef = useRef(null);

  useEffect(() => {
    initGlobalMouse();
  }, []);

  useEffect(() => {
    const updateRect = () => {
      if (gl.domElement) {
        // 1. Box A: The oversized WebGL Canvas (Used for UV Math)
        canvasRectRef.current = gl.domElement.getBoundingClientRect();
        
        // 2. Box B: The visible square parent container (Used for strict Trigger Math)
        const parentHitbox = gl.domElement.closest('.aspect-square');
        if (parentHitbox) {
          hitboxRectRef.current = parentHitbox.getBoundingClientRect();
        } else {
          // Fallback if the parent class is ever removed
          hitboxRectRef.current = canvasRectRef.current;
        }
      }
    };

    updateRect(); 

    window.addEventListener("scroll", updateRect, { passive: true });
    window.addEventListener("resize", updateRect, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateRect);
      window.removeEventListener("resize", updateRect);
    };
  }, [gl.domElement, size]);

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uAspect = viewport.width / viewport.height;
      materialRef.current.uResolution.set(size.width, size.height);
      if (tex1.image) {
        materialRef.current.uImageRes.set(tex1.image.width, tex1.image.height);
      }
    }
  }, [viewport, size, tex1]);

  useFrame((state) => {
    if (!materialRef.current || !canvasRectRef.current || !hitboxRectRef.current) return;

    materialRef.current.uTime = state.clock.elapsedTime;

    const canvasRect = canvasRectRef.current;
    const hitboxRect = hitboxRectRef.current;
    
    // Check if we are on a mobile breakpoint
    const isMobile = window.innerWidth < 1024;
    
    // VIRTUAL CURSOR LOGIC
    // If mobile, anchor the "mouse" to the dead center of the screen.
    // If desktop, use the actual physical mouse position.
    const cursorX = isMobile ? window.innerWidth / 2 : globalMouse.x;
    const cursorY = isMobile ? window.innerHeight / 2 : globalMouse.y;

    // TRIGGER MATH: Check if the virtual cursor is inside the visible square
    const isInside = (
      cursorX >= hitboxRect.left &&
      cursorX <= hitboxRect.right &&
      cursorY >= hitboxRect.top &&
      cursorY <= hitboxRect.bottom
    );

    if (isInside) {
      targetRadius.current = 0.20;
      
      // UV MATH: Map the virtual cursor to the 120% oversized canvas
      const uvX = (cursorX - canvasRect.left) / canvasRect.width;
      const uvY = 1.0 - ((cursorY - canvasRect.top) / canvasRect.height);
      targetMouse.current.set(uvX, uvY);
    } else {
      targetRadius.current = 0.0;
    }

    // Smoothly interpolate the actual shader uniforms toward our calculated targets
    materialRef.current.uMouse.lerp(targetMouse.current, 0.08);
    materialRef.current.uRadius = THREE.MathUtils.lerp(
      materialRef.current.uRadius,
      targetRadius.current,
      0.13
    );
  });

  return (
    <mesh>
      <planeGeometry args={[viewport.width, viewport.height]} />
      <blobMaterial ref={materialRef} uTexture1={tex1} uTexture2={tex2} />
    </mesh>
  );
};

// ==========================================
// 4. THE OUTER REACT COMPONENT
// ==========================================
const WebGLBlobHover = ({ baseImage, revealImage, className = "" }) => {
  return (
    <div className={`relative w-full h-full overflow-hidden bg-[#0a0a0a] ${className}`}>
      <Canvas orthographic camera={{ position: [0, 0, 1], zoom: 1 }}>
        <Suspense fallback={null}>
          <Scene img1={baseImage} img2={revealImage} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default WebGLBlobHover;