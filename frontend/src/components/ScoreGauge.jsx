import React from 'react';
import { Award, CheckCircle, AlertTriangle, XCircle, Sparkles } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

export default function ScoreGauge({ score = 0, label = 'N/A', summary = '' }) {
  const shouldReduceMotion = useReducedMotion();
  const safeScore = typeof score === 'number' && !isNaN(score) ? score : (parseFloat(score) || 0);

  // Color scheme
  let strokeColor = '#1F6F5C';
  let badgeBg = 'bg-[#EEF6F1] border-[#166534]/30 text-[#166534]';
  let icon = <Award className="w-4 h-4 text-[#166534]" />;

  if (safeScore >= 85) {
    strokeColor = '#1F6F5C';
    badgeBg = 'bg-[#EEF6F1] border-[#166534]/30 text-[#166534]';
    icon = <Sparkles className="w-4 h-4 text-[#166534]" />;
  } else if (safeScore >= 70) {
    strokeColor = '#1F6F5C';
    badgeBg = 'bg-[#EAF3F0] border-[#1F6F5C]/30 text-[#1F6F5C]';
    icon = <CheckCircle className="w-4 h-4 text-[#1F6F5C]" />;
  } else if (safeScore >= 40) {
    strokeColor = '#D97706';
    badgeBg = 'bg-amber-50 border-amber-200 text-amber-800';
    icon = <AlertTriangle className="w-4 h-4 text-amber-800" />;
  } else {
    strokeColor = '#DC2626';
    badgeBg = 'bg-red-50 border-red-200 text-red-800';
    icon = <XCircle className="w-4 h-4 text-red-800" />;
  }

  // Exact tachometer arc geometry
  // Center (75, 75), radius 54, startAngle = -120 deg, totalSweep = 240 deg
  const startAngle = -120;
  const totalSweep = 240;
  // Needle angle formula: angle = start angle + (score / 100) * total sweep
  const targetAngle = startAngle + (Math.max(0, Math.min(100, safeScore)) / 100) * totalSweep;

  // Arc length for r=54 across 240 degrees: (240/360) * 2 * pi * 54 = 226.195
  const arcLength = 226.2;
  const targetOffset = arcLength * (1 - Math.max(0, Math.min(100, score)) / 100);

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 p-6 sm:p-8 rounded-xl bg-white border border-[#E3DFD8] shadow-sm">
      {/* Semi-circular Speedometer-style Gauge with Synchronized Needle & Arc */}
      <div className="relative w-40 h-40 shrink-0 flex items-center justify-center">
        <svg className="w-full h-full overflow-visible" viewBox="0 0 150 150">
          {/* Background Grey Track */}
          <path
            d="M 28.23 102 A 54 54 0 1 1 121.77 102"
            fill="none"
            stroke="#E3DFD8"
            strokeWidth="9"
            strokeLinecap="round"
          />

          {/* Animated Filled Progress Arc */}
          <motion.path
            d="M 28.23 102 A 54 54 0 1 1 121.77 102"
            fill="none"
            stroke={strokeColor}
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={arcLength}
            initial={shouldReduceMotion ? { strokeDashoffset: targetOffset } : { strokeDashoffset: arcLength }}
            animate={{ strokeDashoffset: targetOffset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />

          {/* Pivot Circle */}
          <circle cx="75" cy="75" r="5.5" fill="#1F1F1F" />

          {/* Animated Needle matched exactly to the arc angle */}
          <motion.g
            style={{ transformOrigin: '75px 75px' }}
            initial={shouldReduceMotion ? { rotate: targetAngle } : { rotate: startAngle }}
            animate={{ rotate: targetAngle }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          >
            {/* Needle line extending towards the arc */}
            <line
              x1="75"
              y1="75"
              x2="75"
              y2="21"
              stroke="#1F1F1F"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Colored tip accent */}
            <circle cx="75" cy="22" r="2" fill={strokeColor} />
          </motion.g>

          {/* Numerical Score Display */}
          <text
            x="75"
            y="126"
            textAnchor="middle"
            fill="#1F1F1F"
            className="font-sans font-bold text-2xl"
          >
            {score}
            <tspan fontSize="12" fill="#5F5F5F" fontWeight="normal">/100</tspan>
          </text>
        </svg>
      </div>

      {/* Score Summary & Badge */}
      <div className="flex-1 text-center sm:text-left">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#5F5F5F]">
            Overall Match Rating
          </span>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeBg}`}>
            {icon}
            <span>{label}</span>
          </span>
        </div>

        <h2 className="text-lg font-serif font-bold text-[#1F1F1F] mb-1.5">
          {score >= 85 ? 'Outstanding Match' : score >= 70 ? 'Strong Candidate Fit' : score >= 40 ? 'Moderate Alignment' : 'Low Match Compatibility'}
        </h2>

        <p className="text-sm text-[#3A3A3A] leading-relaxed max-w-xl">
          {summary || 'Analysis computed across skill requirements, text relevance, structural completeness, and ATS compliance.'}
        </p>
      </div>
    </div>
  );
}
