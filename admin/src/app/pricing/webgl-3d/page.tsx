// admin/src/app/pricing/webgl-3d/page.tsx
'use client';

import { PricingRateGrid, type RateItemMeta } from '@/context/PricingContext';

const WEBGL_3D_ITEMS: RateItemMeta[] = [
  { key: 'webglSceneFirst', label: '1st WebGL 3D Scene', desc: 'Interactive Three.js/WebGL scene + mobile fallback' },
  { key: 'webglSceneExtra', label: 'Each Additional 3D Scene', desc: 'Per extra 3D environment/object' },
  { key: 'customShader', label: 'Custom GPU Shader Effect', desc: 'Ripples, distortion, or glow shaders' },
  { key: 'scrollCamera', label: 'Scroll-Linked 3D Camera', desc: 'Camera rig tied to scroll timeline' },
  { key: 'mobileTuning', label: 'Extra 3D Mobile Tuning', desc: 'Additional optimization for low-end devices' },
];

export default function Webgl3dPricingPage() {
  return <PricingRateGrid items={WEBGL_3D_ITEMS} />;
}