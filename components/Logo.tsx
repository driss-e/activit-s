import React from 'react';

export const Logo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg 
      viewBox="0 0 240 50" 
      xmlns="http://www.w3.org/2000/svg"
      aria-label="SortieEnsemble Logo"
      {...props}
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#10b981', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#2dd4bf', stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      {/* Icon: Abstract group of people / hills */}
      <g transform="translate(0, 5)">
        <path 
          d="M15 40 C 20 20, 30 20, 35 40 Z" 
          fill="url(#logoGradient)" 
          transform="translate(8, 0)"
        />
        <path 
          d="M0 40 C 5 10, 25 10, 30 40 Z" 
          fill="url(#logoGradient)" 
          style={{ opacity: 0.7 }}
        />
        <path 
          d="M30 40 C 35 25, 45 25, 50 40 Z" 
          fill="url(#logoGradient)" 
          style={{ opacity: 0.8 }}
          transform="translate(-2, 0)"
        />
      </g>
      
      {/* Text: SortieEnsemble */}
      <text 
        x="60" 
        y="33" 
        fontFamily="Lexend, sans-serif"
        fontSize="28" 
        fontWeight="600"
        fill="currentColor"
      >
        SortieEnsemble
      </text>
    </svg>
  );
};