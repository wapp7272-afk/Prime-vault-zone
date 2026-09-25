import React from 'react';

export interface VaultLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  tagline?: string;
  isPulsing?: boolean;
  onClick?: () => void;
}

export const VaultLogo: React.FC<VaultLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  tagline = 'UNLOCK PREMIUM EXCELLENCE',
  onClick,
}) => {
  const sizeConfig = {
    sm: {
      svgSize: 'w-7 h-7',
      textSize: 'text-sm sm:text-base font-black',
      taglineSize: 'text-[7.5px] tracking-[0.2em]',
      gap: 'gap-2',
    },
    md: {
      svgSize: 'w-9 h-9 sm:w-10 sm:h-10',
      textSize: 'text-base sm:text-lg font-black',
      taglineSize: 'text-[9px] tracking-[0.22em]',
      gap: 'gap-2.5',
    },
    lg: {
      svgSize: 'w-12 h-12',
      textSize: 'text-2xl sm:text-3xl font-black',
      taglineSize: 'text-[10px] tracking-[0.25em]',
      gap: 'gap-3',
    },
    xl: {
      svgSize: 'w-16 h-16 sm:w-20 sm:h-20',
      textSize: 'text-3xl sm:text-4xl md:text-5xl font-black',
      taglineSize: 'text-xs sm:text-sm tracking-[0.3em]',
      gap: 'gap-4',
    },
  }[size];

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center ${sizeConfig.gap} select-none group ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {/* Modern Hexagonal SVG Vault Logo with Deep Indigo/Purple Brand Palette */}
      <div className={`relative ${sizeConfig.svgSize} shrink-0 transition-transform duration-300 group-hover:scale-105`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full filter drop-shadow-xs"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="vaultGradientOuter" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4F46E5" />
              <stop offset="50%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#4338CA" />
            </linearGradient>
            <linearGradient id="vaultGradientInner" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#4F46E5" />
            </linearGradient>
            <radialGradient id="vaultCenterGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#EEF2FF" stopOpacity="0.9" />
              <stop offset="70%" stopColor="#EEF2FF" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background Hexagon Glow */}
          <polygon
            points="50,6 90,27 90,73 50,94 10,73 10,27"
            fill="url(#vaultCenterGlow)"
          />

          {/* Outer Hexagon Ring */}
          <polygon
            points="50,6 90,27 90,73 50,94 10,73 10,27"
            stroke="url(#vaultGradientOuter)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Outer Hexagon Tech Corner Notches */}
          <circle cx="50" cy="6" r="2.5" fill="#4F46E5" />
          <circle cx="90" cy="27" r="2.5" fill="#6366F1" />
          <circle cx="90" cy="73" r="2.5" fill="#4338CA" />
          <circle cx="50" cy="94" r="2.5" fill="#4F46E5" />
          <circle cx="10" cy="73" r="2.5" fill="#4338CA" />
          <circle cx="10" cy="27" r="2.5" fill="#6366F1" />

          {/* Inner Geometric Shield Hexagon */}
          <polygon
            points="50,17 80,33 80,67 50,83 20,67 20,33"
            stroke="url(#vaultGradientInner)"
            strokeWidth="1.8"
            strokeDasharray="4 2"
            fill="#EEF2FF"
            fillOpacity="0.7"
          />

          {/* Vault Locking Door Mechanism */}
          <circle
            cx="50"
            cy="50"
            r="16"
            stroke="url(#vaultGradientOuter)"
            strokeWidth="2.5"
            fill="#FFFFFF"
          />

          {/* Vault Locking Spoke Bolts (6 directions) */}
          <line x1="50" y1="34" x2="50" y2="24" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="50" y1="66" x2="50" y2="76" stroke="#4338CA" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="36" y1="42" x2="27" y2="37" stroke="#6366F1" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="64" y1="58" x2="73" y2="63" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="36" y1="58" x2="27" y2="63" stroke="#4338CA" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="64" y1="42" x2="73" y2="37" stroke="#6366F1" strokeWidth="2.5" strokeLinecap="round" />

          {/* Core Vault Diamond Keyhole */}
          <polygon
            points="50,42 57,50 50,58 43,50"
            fill="url(#vaultGradientOuter)"
          />
          <circle cx="50" cy="50" r="2" fill="#FFFFFF" />
        </svg>
      </div>

      {/* Brand Name Typography */}
      {showText && (
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-1.5">
            <span
              className={`${sizeConfig.textSize} tracking-wide text-[#0F172A] uppercase leading-tight font-black`}
            >
              PRIME <span className="text-[#4F46E5]">VAULT</span> ZONE
            </span>
          </div>
          {tagline && (
            <p
              className={`${sizeConfig.taglineSize} text-slate-500 uppercase font-mono font-medium block mt-0.5`}
            >
              {tagline}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export const PrimeVaultLogo = VaultLogo;
export const ZestFlickLogo = VaultLogo;
