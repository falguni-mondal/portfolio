// admin/src/components/LiquidGlassDefs.tsx
import type { FC } from 'react';

export const LiquidGlassDefs: FC = () => (
  <>
    <style
      dangerouslySetInnerHTML={{
        __html: `
          .liquid-glass-pill {
            background: linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.72) 0%,
              rgba(255, 255, 255, 0.30) 50%,
              rgba(255, 255, 255, 0.60) 100%
            ) !important;
            color: #141414 !important;
            backdrop-filter: url(#apple-liquid-glass) blur(14px) saturate(190%) !important;
            -webkit-backdrop-filter: url(#apple-liquid-glass) blur(14px) saturate(190%) !important;
            box-shadow:
              inset 0 1.5px 1.5px rgba(255, 255, 255, 0.98),
              inset 0 -1px 2px rgba(0, 0, 0, 0.05),
              0 10px 28px -6px rgba(15, 15, 15, 0.12) !important;
            border: 1px solid rgba(255, 255, 255, 0.85) !important;
          }
          .dark .liquid-glass-pill {
            background: linear-gradient(
              135deg,
              rgba(38, 38, 42, 0.78) 0%,
              rgba(22, 22, 25, 0.50) 50%,
              rgba(32, 32, 36, 0.70) 100%
            ) !important;
            color: #f3f3f3 !important;
            backdrop-filter: url(#apple-liquid-glass) blur(14px) saturate(190%) !important;
            -webkit-backdrop-filter: url(#apple-liquid-glass) blur(14px) saturate(190%) !important;
            box-shadow:
              inset 0 1px 1.5px rgba(255, 255, 255, 0.16),
              0 12px 30px -6px rgba(0, 0, 0, 0.55) !important;
            border: 1px solid rgba(255, 255, 255, 0.14) !important;
          }
          .liquid-glass-active {
            background: linear-gradient(
              135deg,
              rgba(18, 18, 20, 0.94) 0%,
              rgba(34, 34, 38, 0.88) 100%
            ) !important;
            color: #ffffff !important;
            backdrop-filter: url(#apple-liquid-glass) blur(16px) saturate(180%) !important;
            -webkit-backdrop-filter: url(#apple-liquid-glass) blur(16px) saturate(180%) !important;
            box-shadow:
              inset 0 1.5px 1.5px rgba(255, 255, 255, 0.30),
              0 14px 32px -6px rgba(0, 0, 0, 0.24) !important;
            border: 1px solid rgba(255, 255, 255, 0.20) !important;
          }
          .dark .liquid-glass-active {
            background: linear-gradient(
              135deg,
              rgba(245, 245, 247, 0.95) 0%,
              rgba(225, 225, 230, 0.90) 100%
            ) !important;
            color: #0b0a09 !important;
            backdrop-filter: url(#apple-liquid-glass) blur(16px) saturate(180%) !important;
            -webkit-backdrop-filter: url(#apple-liquid-glass) blur(16px) saturate(180%) !important;
            box-shadow:
              inset 0 1.5px 1.5px rgba(255, 255, 255, 1),
              0 14px 32px -6px rgba(0, 0, 0, 0.50) !important;
            border: 1px solid rgba(255, 255, 255, 0.90) !important;
          }
        `,
      }}
    />
    <svg className="pointer-events-none fixed h-0 w-0 opacity-0" aria-hidden="true">
      <defs>
        <filter
          id="apple-liquid-glass"
          x="-25%"
          y="-25%"
          width="150%"
          height="150%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.013 0.017"
            numOctaves="2"
            seed="11"
            result="lensNoise"
          />
          <feGaussianBlur in="lensNoise" stdDeviation="3.2" result="smoothedLens" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="smoothedLens"
            scale="18"
            xChannelSelector="R"
            yChannelSelector="G"
            result="refractedBackground"
          />
          <feSpecularLighting
            in="smoothedLens"
            surfaceScale="3"
            specularConstant="0.85"
            specularExponent="28"
            lightingColor="#ffffff"
            result="specularRim"
          >
            <fePointLight x="-160" y="-220" z="280" />
          </feSpecularLighting>
          <feComposite in="specularRim" in2="SourceAlpha" operator="in" result="clippedSpecular" />
          <feBlend in="refractedBackground" in2="clippedSpecular" mode="screen" />
        </filter>
      </defs>
    </svg>
  </>
);

export const ThemeIcon: FC<{ darkMode: boolean }> = ({ darkMode }) =>
  darkMode ? (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  ) : (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );