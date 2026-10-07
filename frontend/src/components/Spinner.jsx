import React, { useEffect, useState } from 'react';
import { Loader2, Sparkles, CheckCircle2 } from 'lucide-react';

export default function Spinner({ message = 'Analyzing resume...' }) {
  const [stepIndex, setStepIndex] = useState(0);

  const steps = [
    'Extracting resume text & layout...',
    'Detecting core sections & contact data...',
    'Matching skills against 200+ industry keywords...',
    'Auditing ATS compliance & action verbs...',
    'Synthesizing score and generating feedback...',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-full border-4 border-[#E3DFD8] border-t-[#1F6F5C] animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center text-[#1F6F5C]">
          <Sparkles className="w-6 h-6 animate-pulse" />
        </div>
      </div>

      <h3 className="text-lg font-serif font-bold text-[#1F1F1F] mb-2">
        {message}
      </h3>

      <div className="mt-4 space-y-2 max-w-sm w-full">
        {steps.map((s, idx) => (
          <div
            key={idx}
            className={`flex items-center gap-2 text-xs transition-opacity duration-300 ${
              idx <= stepIndex ? 'opacity-100' : 'opacity-40'
            }`}
          >
            {idx < stepIndex ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-[#1F6F5C] shrink-0" />
            ) : idx === stepIndex ? (
              <Loader2 className="w-3.5 h-3.5 text-[#1F6F5C] animate-spin shrink-0" />
            ) : (
              <div className="w-3.5 h-3.5 rounded-full border border-[#E3DFD8] shrink-0" />
            )}
            <span className={idx === stepIndex ? 'text-[#1F6F5C] font-semibold' : 'text-[#5F5F5F]'}>
              {s}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
