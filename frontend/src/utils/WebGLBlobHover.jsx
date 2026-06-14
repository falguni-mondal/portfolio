import React, { useRef, Suspense, useEffect } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree, extend } from "@react-three/fiber";
import { useTexture, shaderMaterial } from "@react-three/drei";
import { useLabStore } from "../store/store";

// ==========================================
// 1. GLOBAL MOUSE TRACKER
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
    uClipUV: new THREE.Vector4(0, 0, 1, 1), 
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
    uniform vec4 uClipUV;
    varying vec2 vUv;

    void main() {
      // 1. STRICT LOCAL UV CLIPPING
      if (vUv.x < uClipUV.x || vUv.x > uClipUV.z || vUv.y < uClipUV.y || vUv.y > uClipUV.w) {
        discard;
      }

      // 2. ASPECT RATIO COVER MATH
      vec2 ratio = vec2(
        min((uResolution.x / uResolution.y) / (uImageRes.x / uImageRes.y), 1.0),
        min((uResolution.y / uResolution.x) / (uImageRes.y / uImageRes.x), 1.0)
      );
      vec2 uvCover = vec2(
        vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
        vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
      );

      float currentAspect = uResolution.x / uResolution.y;
      vec2 aspectUv = vUv;
      aspectUv.x *= currentAspect;
      vec2 aspectMouse = uMouse;
      aspectMouse.x *= currentAspect;

      vec2 delta = aspectUv - aspectMouse;
      float dist = length(delta);
      float angle = atan(delta.y, delta.x);

      // 3. GLOBAL ACTIVATION FACTOR (Scales to 1.0 when hovered)
      float hoverFactor = clamp(uRadius / 0.20, 0.0, 1.0);

      // 4. ANIMATED WOBBLE MATH
      float w1 = sin(angle * 3.0 + uTime * 6.0) * 0.04;
      float w2 = cos(angle * 5.0 - uTime * 5.5) * 0.02;
      float w3 = sin(angle * 7.0 + uTime * 3.5) * 0.01;
      float w4 = cos(angle * 2.0 - uTime * 6.0) * 0.015;
      
      float wobble = (w1 + w2 + w3 + w4) * hoverFactor;
      float animatedRadius = max(0.0, uRadius + wobble);

      // 5. THE BLOB MASK (Determines which image shows)
      float mask = smoothstep(animatedRadius + 0.001, animatedRadius - 0.001, dist);

      // 6. GLOBAL DISTORTION
      // Bulge centers around the mouse
      float bulgeFactor = smoothstep(0.9, 0.0, dist) * 0.35 * hoverFactor;
      vec2 displacement = vUv - uMouse; 
      vec2 uv1 = uvCover - displacement * bulgeFactor;

      // FIX: The wave effect is applied to the ENTIRE image space based on hoverFactor
      float waveX = sin(vUv.y * 10.0 + uTime * 2.0) * 0.015 * hoverFactor;
      float waveY = cos(vUv.x * 10.0 - uTime * 2.0) * 0.015 * hoverFactor;
      uv1 += vec2(waveX, waveY); 

      // 7. TEXTURE MIXING
      vec4 tex1 = texture2D(uTexture1, uv1);
      vec2 uv2 = uvCover + displacement * mask * 0.04;
      vec4 tex2 = texture2D(uTexture2, uv2);

      vec4 finalColor = mix(tex1, tex2, mask);
      
      // Permanently opaque rendering
      finalColor.a = 1.0; 
      gl_FragColor = finalColor;
    }
  `
);

extend({ BlobMaterial });

// ==========================================
// 3. INDIVIDUAL TRACKED MESH
// ==========================================
const TrackedMesh = ({ data }) => { 
  const materialRef = useRef();
  const meshRef = useRef();
  
  const [tex1, tex2] = useTexture([data.image1, data.image2]);
  const { viewport, size } = useThree(); 

  const activeProject = useLabStore((state) => state.activeProject);
  const isActive = activeProject === data.index;
  
  const targetMouse = useRef(new THREE.Vector2(0.5, 0.5));
  const targetRadius = useRef(0.0);

  useEffect(() => {
    initGlobalMouse();
  }, []);

  useEffect(() => {
    if (materialRef.current && tex1.image) {
      materialRef.current.uImageRes.set(tex1.image.width, tex1.image.height);
      // FIX: Removed the SRGBColorSpace manipulation. 
      // The images will now render with their raw, natural colors.
    }
  }, [tex1]);

  useFrame((state) => {
    if (!materialRef.current || !meshRef.current || !data.imageRef.current || !data.containerRef.current) return;

    const imgRect = data.imageRef.current.getBoundingClientRect();
    const clipRect = data.containerRef.current.getBoundingClientRect();
    
    // POSITIONING
    const x = imgRect.left + imgRect.width / 2 - size.width / 2;
    const y = -(imgRect.top + imgRect.height / 2 - size.height / 2);

    meshRef.current.position.set(x, y, 0);
    meshRef.current.scale.set(imgRect.width, imgRect.height, 1);
    materialRef.current.uResolution.set(imgRect.width, imgRect.height);

    // LOCAL UV CLIPPING
    const clipMinX = (clipRect.left - imgRect.left) / imgRect.width;
    const clipMaxX = (clipRect.right - imgRect.left) / imgRect.width;
    const clipMaxY = 1.0 - ((clipRect.top - imgRect.top) / imgRect.height);
    const clipMinY = 1.0 - ((clipRect.bottom - imgRect.top) / imgRect.height);

    materialRef.current.uClipUV.set(clipMinX, clipMinY, clipMaxX, clipMaxY);

    // INTERACTION LOGIC
    materialRef.current.uTime = state.clock.elapsedTime;
    const isMobile = window.innerWidth < 1024;
    
    const pixelMouseX = isMobile ? window.innerWidth / 2 : globalMouse.x;
    const pixelMouseY = isMobile ? window.innerHeight / 2 : globalMouse.y;

    if (isActive) {
      targetRadius.current = 0.20; 
      const uvX = (pixelMouseX - imgRect.left) / imgRect.width;
      const uvY = 1.0 - ((pixelMouseY - imgRect.top) / imgRect.height);
      targetMouse.current.set(uvX, uvY);
    } else {
      targetRadius.current = 0.0; 
    }

    materialRef.current.uMouse.lerp(targetMouse.current, 0.08);
    materialRef.current.uRadius = THREE.MathUtils.lerp(materialRef.current.uRadius, targetRadius.current, 0.13);
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[1, 1]} />
      {/* FIX: added toneMapped={false} to ensure Three.js doesn't apply gamma darkening */}
      <blobMaterial ref={materialRef} uTexture1={tex1} uTexture2={tex2} transparent={true} toneMapped={false} />
    </mesh>
  );
};

// ==========================================
// 4. THE MASTER SCENE
// ==========================================
const WebGLBlobHover = ({ trackedItems }) => {
  return (
    <>
      {trackedItems.map((item) => (
        <TrackedMesh key={`blob-${item.index}`} data={item} />
      ))}
    </>
  );
};

export default WebGLBlobHover;