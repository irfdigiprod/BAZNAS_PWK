import React from 'react';

interface BaznasLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark' | 'color';
  showSubtitle?: boolean;
}

export const BaznasLogo: React.FC<BaznasLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'color',
  showSubtitle = true,
}) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-14 h-14',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  const isLight = variant === 'light';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Official BAZNAS Emblem Emblem SVG */}
      <svg
        className={`${iconSizes[size]} shrink-0`}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Logo BAZNAS Kabupaten Purwakarta"
      >
        {/* Outer Circular Rim */}
        <circle cx="50" cy="50" r="48" fill={isLight ? '#FFFFFF' : '#047857'} stroke="#D97706" strokeWidth="2.5" />
        
        {/* Decorative Inner Ring */}
        <circle cx="50" cy="50" r="42" fill={isLight ? '#065F46' : '#065F46'} stroke="#F59E0B" strokeWidth="1" strokeDasharray="3 2" />

        {/* Islamic 8-Point Star / Geometric Emblem */}
        <path
          d="M50 15 L58 35 L78 35 L62 48 L68 68 L50 56 L32 68 L38 48 L22 35 L42 35 Z"
          fill="#F59E0B"
        />

        {/* Garuda / Golden Wings of Charity & Protection */}
        <path
          d="M50 24 C55 32 68 38 72 44 C65 44 58 41 50 48 C42 41 35 44 28 44 C32 38 45 32 50 24 Z"
          fill="#FDE68A"
        />

        {/* Inner Crescent & Leaf of Barakah */}
        <path
          d="M50 36 C56 36 60 42 60 49 C60 56 55 61 48 61 C43 61 39 57 39 51 C39 47 42 43 45 42 C42 45 42 50 45 53 C48 56 53 54 54 49 C54 44 51 38 50 36 Z"
          fill="#FFFFFF"
        />

        {/* BAZNAS Badge Text Ribbon at Bottom */}
        <rect x="20" y="69" width="60" height="15" rx="4" fill="#D97706" />
        <text
          x="50"
          y="80"
          fill="#FFFFFF"
          fontSize="8.5"
          fontWeight="bold"
          fontFamily="'Plus Jakarta Sans', sans-serif"
          textAnchor="middle"
          letterSpacing="0.08em"
        >
          BAZNAS
        </text>
      </svg>

      {/* Typography Label */}
      <div className="flex flex-col leading-tight">
        <div className="flex items-baseline gap-1.5">
          <span className={`font-extrabold tracking-tight ${textSizes[size]} ${isLight ? 'text-white' : 'text-emerald-950'}`}>
            BAZNAS
          </span>
          <span className={`text-[11px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded ${isLight ? 'bg-emerald-800 text-emerald-200' : 'bg-emerald-100 text-emerald-800'}`}>
            Purwakarta
          </span>
        </div>
        {showSubtitle && (
          <span className={`text-[10px] uppercase font-medium tracking-wide ${isLight ? 'text-emerald-200' : 'text-slate-600'}`}>
            Badan Amil Zakat Nasional
          </span>
        )}
      </div>
    </div>
  );
};
