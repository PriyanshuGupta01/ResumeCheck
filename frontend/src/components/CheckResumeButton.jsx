import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

export default function CheckResumeButton({
  className = '',
  children = 'Check my resume',
  size = 'md',
}) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  const handleClick = (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    // Short loading feedback (250ms) before smooth page transition
    setTimeout(() => {
      navigate('/analyze');
    }, shouldReduceMotion ? 50 : 250);
  };

  const sizeClasses =
    size === 'lg'
      ? 'px-6 py-3.5 text-base rounded-xl'
      : 'px-4 py-2 text-sm rounded-lg';

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      disabled={loading}
      whileHover={shouldReduceMotion ? {} : { y: -1 }}
      whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`inline-flex items-center justify-center gap-2 font-medium text-white bg-[#1F6F5C] hover:bg-[#185849] active:bg-[#185849] transition-colors shadow-sm cursor-pointer ${sizeClasses} ${className}`}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
          <span>Opening...</span>
        </>
      ) : (
        <span>{children}</span>
      )}
    </motion.button>
  );
}
