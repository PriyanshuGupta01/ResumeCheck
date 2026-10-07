import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function HeroIllustration() {
  const shouldReduceMotion = useReducedMotion();
  const [cycle, setCycle] = useState(0);

  // Trigger loop every 6 seconds if motion is enabled
  useEffect(() => {
    if (shouldReduceMotion) return;
    const interval = setInterval(() => {
      setCycle((c) => c + 1);
    }, 6000);
    return () => clearInterval(interval);
  }, [shouldReduceMotion]);

  return (
    <div className="relative w-full max-w-[480px] mx-auto select-none">
      <svg
        viewBox="0 0 475 380"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto drop-shadow-sm overflow-visible"
        aria-label="Illustration of resume scanner, match score gauge, and skill verification"
      >
        <defs>
          {/* Laser beam gradient */}
          <linearGradient id="laserBeam" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1F6F5C" stopOpacity="0" />
            <stop offset="70%" stopColor="#1F6F5C" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#1F6F5C" stopOpacity="0.85" />
          </linearGradient>

          {/* Laser horizontal glow */}
          <linearGradient id="laserLine" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1F6F5C" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#1F6F5C" stopOpacity="1" />
            <stop offset="100%" stopColor="#1F6F5C" stopOpacity="0.2" />
          </linearGradient>

          {/* Card shadow */}
          <filter id="shadowLight" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000000" floodOpacity="0.04" />
          </filter>
        </defs>

        {/* 1. Resume Sheet (Main Left Document) */}
        <g filter="url(#shadowLight)">
          {/* Paper sheet */}
          <rect
            x="24"
            y="25"
            width="250"
            height="325"
            rx="8"
            fill="#FFFFFF"
            stroke="#E3DFD8"
            strokeWidth="1.5"
          />

          {/* Document Header lines */}
          <rect x="44" y="45" width="80" height="9" rx="3" fill="#1F1F1F" />
          <rect x="44" y="60" width="110" height="5" rx="2" fill="#5F5F5F" />
          <rect x="44" y="70" width="140" height="4" rx="2" fill="#E3DFD8" />

          {/* Section 1: Summary */}
          <rect x="44" y="88" width="55" height="5" rx="2" fill="#1F6F5C" />
          <rect x="44" y="99" width="210" height="4" rx="2" fill="#E3DFD8" />
          <rect x="44" y="108" width="180" height="4" rx="2" fill="#E3DFD8" />

          {/* Section 2: Experience */}
          <rect x="44" y="126" width="65" height="5" rx="2" fill="#1F6F5C" />
          <rect x="44" y="137" width="90" height="5" rx="2" fill="#1F1F1F" />
          <rect x="44" y="147" width="200" height="4" rx="2" fill="#E3DFD8" />
          <rect x="44" y="156" width="170" height="4" rx="2" fill="#E3DFD8" />

          {/* Section 3: Technical Skills Chips */}
          <rect x="44" y="174" width="45" height="5" rx="2" fill="#1F6F5C" />

          {/* Skill 1: React */}
          <g transform="translate(44, 188)">
            <rect width="52" height="18" rx="4" fill="#EEF6F1" stroke="#166534" strokeWidth="0.8" strokeOpacity="0.4" />
            <text x="8" y="13" fill="#166534" fontSize="9" fontFamily="Inter, sans-serif" fontWeight="600">React</text>
            <motion.path
              d="M40 7 L44 11 L49 5"
              fill="none"
              stroke="#166534"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={shouldReduceMotion ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
              animate={shouldReduceMotion ? {} : { pathLength: [0, 1, 1], opacity: [0, 1, 1] }}
              transition={{ duration: 0.5, delay: 1.2, repeat: Infinity, repeatDelay: 5.5 }}
            />
          </g>

          {/* Skill 2: Python */}
          <g transform="translate(102, 188)">
            <rect width="54" height="18" rx="4" fill="#EEF6F1" stroke="#166534" strokeWidth="0.8" strokeOpacity="0.4" />
            <text x="8" y="13" fill="#166534" fontSize="9" fontFamily="Inter, sans-serif" fontWeight="600">Python</text>
            <motion.path
              d="M43 7 L47 11 L52 5"
              fill="none"
              stroke="#166534"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={shouldReduceMotion ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
              animate={shouldReduceMotion ? {} : { pathLength: [0, 1, 1], opacity: [0, 1, 1] }}
              transition={{ duration: 0.5, delay: 1.6, repeat: Infinity, repeatDelay: 5.5 }}
            />
          </g>

          {/* Skill 3: TypeScript */}
          <g transform="translate(44, 212)">
            <rect width="70" height="18" rx="4" fill="#EEF6F1" stroke="#166534" strokeWidth="0.8" strokeOpacity="0.4" />
            <text x="8" y="13" fill="#166534" fontSize="9" fontFamily="Inter, sans-serif" fontWeight="600">TypeScript</text>
            <motion.path
              d="M58 7 L62 11 L67 5"
              fill="none"
              stroke="#166534"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={shouldReduceMotion ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
              animate={shouldReduceMotion ? {} : { pathLength: [0, 1, 1], opacity: [0, 1, 1] }}
              transition={{ duration: 0.5, delay: 2.0, repeat: Infinity, repeatDelay: 5.5 }}
            />
          </g>

          {/* Additional text lines */}
          <rect x="44" y="244" width="200" height="4" rx="2" fill="#E3DFD8" />
          <rect x="44" y="254" width="160" height="4" rx="2" fill="#E3DFD8" />
          <rect x="44" y="264" width="180" height="4" rx="2" fill="#E3DFD8" />
        </g>

        {/* 2. Highlighted Missing Keywords that fade in (fully clear of gauge card) */}
        <motion.g
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
          animate={shouldReduceMotion ? {} : { opacity: [0, 0, 1, 1, 0], y: [6, 6, 0, 0, 6] }}
          transition={{ duration: 6, times: [0, 0.4, 0.5, 0.9, 1], repeat: Infinity }}
        >
          {/* Missing 1: +Docker */}
          <g transform="translate(122, 212)">
            <rect width="58" height="18" rx="4" fill="#FDF1F0" stroke="#991B1B" strokeWidth="0.8" strokeOpacity="0.4" />
            <text x="8" y="13" fill="#991B1B" fontSize="9" fontFamily="Inter, sans-serif" fontWeight="600">+ Docker</text>
          </g>

          {/* Missing 2: +AWS */}
          <g transform="translate(186, 212)">
            <rect width="52" height="18" rx="4" fill="#FDF1F0" stroke="#991B1B" strokeWidth="0.8" strokeOpacity="0.4" />
            <text x="8" y="13" fill="#991B1B" fontSize="9" fontFamily="Inter, sans-serif" fontWeight="600">+ AWS</text>
          </g>
        </motion.g>

        {/* 3. Moving Scanning Laser Beam */}
        {!shouldReduceMotion && (
          <motion.g
            animate={{ y: [0, 280, 0] }}
            transition={{
              duration: 3.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {/* Soft vertical gradient beam behind laser */}
            <rect x="25" y="25" width="248" height="24" fill="url(#laserBeam)" />
            {/* Sharp laser line */}
            <line x1="25" y1="49" x2="273" y2="49" stroke="url(#laserLine)" strokeWidth="2.5" />
            {/* Scanner indicator dot */}
            <circle cx="29" cy="49" r="3" fill="#1F6F5C" />
            <circle cx="269" cy="49" r="3" fill="#1F6F5C" />
          </motion.g>
        )}

        {/* 4. Score Gauge Overlay Card - Moved to x=252 so +Docker and +AWS chips are fully visible */}
        <g transform="translate(252, 160)" filter="url(#shadowLight)">
          {/* Card background */}
          <rect
            width="200"
            height="185"
            rx="12"
            fill="#FFFFFF"
            stroke="#E3DFD8"
            strokeWidth="1.5"
          />

          {/* Title */}
          <text x="20" y="28" fill="#5F5F5F" fontSize="10" fontFamily="Inter, sans-serif" fontWeight="600" letterSpacing="0.05em">
            MATCH EVALUATION
          </text>

          {/* Gauge Center Group: startAngle = -120, totalSweep = 240, score = 72 => angle = -120 + (72/100)*240 = 52.8 */}
          <g transform="translate(100, 100)">
            {/* Background circular track (-120 to +120 deg, r=42) */}
            <path
              d="M -36.37 21 A 42 42 0 1 1 36.37 21"
              fill="none"
              stroke="#E3DFD8"
              strokeWidth="7"
              strokeLinecap="round"
            />

            {/* Filled progress arc: length = (240/360)*2*pi*42 = 175.93. At 72%, offset = 175.93 * (1 - 0.72) = 49.26 */}
            <motion.path
              d="M -36.37 21 A 42 42 0 1 1 36.37 21"
              fill="none"
              stroke="#1F6F5C"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray="175.93"
              initial={shouldReduceMotion ? { strokeDashoffset: 49.26 } : { strokeDashoffset: 175.93 }}
              animate={shouldReduceMotion ? {} : { strokeDashoffset: [175.93, 49.26, 49.26] }}
              transition={{ duration: 1.6, delay: 0.6, repeat: Infinity, repeatDelay: 4.4, ease: "easeOut" }}
            />

            {/* Center Pivot Dot */}
            <circle cx="0" cy="0" r="5" fill="#1F1F1F" />

            {/* Needle starts at center dot (0,0), reaches the arc (r=42), angle = startAngle + (score/100)*totalSweep */}
            <motion.g
              style={{ transformOrigin: '0px 0px' }}
              initial={shouldReduceMotion ? { rotate: 52.8 } : { rotate: -120 }}
              animate={shouldReduceMotion ? {} : { rotate: [-120, 52.8, 52.8] }}
              transition={{ duration: 1.6, delay: 0.6, repeat: Infinity, repeatDelay: 4.4, ease: "easeOut" }}
            >
              <line x1="0" y1="0" x2="0" y2="-42" stroke="#1F1F1F" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="0" cy="-42" r="2" fill="#1F6F5C" />
            </motion.g>

            {/* Score Readout */}
            <text x="0" y="28" textAnchor="middle" fill="#1F1F1F" fontSize="18" fontFamily="'Source Serif 4', Georgia, serif" fontWeight="700">
              72
              <tspan fontSize="11" fill="#5F5F5F" fontFamily="Inter, sans-serif" fontWeight="400">/100</tspan>
            </text>
          </g>

          {/* Badge: Good match */}
          <g transform="translate(56, 142)">
            <rect width="88" height="22" rx="11" fill="#EAF3F0" stroke="#1F6F5C" strokeWidth="0.8" strokeOpacity="0.4" />
            <circle cx="14" cy="11" r="3.5" fill="#1F6F5C" />
            <text x="24" y="14" fill="#1F6F5C" fontSize="10" fontFamily="Inter, sans-serif" fontWeight="600">
              Good Match
            </text>
          </g>
        </g>
      </svg>
    </div>
  );
}
