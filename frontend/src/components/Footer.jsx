import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Github, ExternalLink } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { getHealthStatus } from '../api';

export default function Footer() {
  const [status, setStatus] = useState('checking'); // 'online' | 'offline' | 'checking'
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    let isMounted = true;
    const check = async () => {
      const res = await getHealthStatus();
      if (isMounted) {
        setStatus(res.ok ? 'online' : 'offline');
      }
    };
    check();
    const interval = setInterval(check, 20000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const scrollToHomeSection = (id) => {
    if (location.pathname !== '/') {
      window.location.href = `/#${id}`;
      return;
    }
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const staggerContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
      },
    },
  };

  const columnVariant = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  };

  return (
    <footer className="border-t border-[#E3DFD8] mt-24 pt-12 pb-10 text-xs text-[#5F5F5F] bg-[#FAF8F5]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
        {/* Main Footer Content with Scroll Reveal */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-12 gap-8"
        >
          {/* Left Column: Brand & Description */}
          <motion.div variants={columnVariant} className="md:col-span-4 space-y-3">
            <Link to="/" className="font-serif font-bold text-[#1F1F1F] text-lg block hover:opacity-90">
              ResumeCheck
            </Link>
            <p className="text-xs text-[#5F5F5F] leading-relaxed max-w-sm">
              An end-to-end evaluation tool that analyzes resume alignment against target job descriptions with match scoring, skill gap detection, and ATS verification.
            </p>
            {/* Live system health status indicator */}
            <div className="inline-flex items-center gap-2 pt-1" title="Real-time backend API connectivity">
              <span
                className={`inline-block w-2 h-2 rounded-full ${
                  status === 'online'
                    ? 'bg-[#1F6F5C]'
                    : status === 'checking'
                    ? 'bg-amber-500'
                    : 'bg-red-500'
                }`}
              />
              <span className="text-[11px] font-medium text-[#5F5F5F]">
                {status === 'online' ? 'Engine operational' : status === 'checking' ? 'Connecting to API...' : 'Backend offline'}
              </span>
            </div>
          </motion.div>

          {/* Right Columns: Product, Company, Legal, Account (staggered) */}
          <motion.div variants={columnVariant} className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-6">
            {/* 1. Product */}
            <div className="space-y-3">
              <h4 className="font-semibold text-[#1F1F1F] text-xs uppercase tracking-wider">
                Product
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link to="/analyze" className="hover:text-[#1F1F1F] transition-colors">
                    Check my resume
                  </Link>
                </li>
                <li>
                  <Link to="/how-it-works" className="hover:text-[#1F1F1F] transition-colors">
                    How it works
                  </Link>
                </li>
                <li>
                  <Link
                    to="/#sample-report"
                    className="hover:text-[#1F1F1F] transition-colors"
                  >
                    Sample report
                  </Link>
                </li>
                <li>
                  <Link
                    to="/#faq"
                    className="hover:text-[#1F1F1F] transition-colors"
                  >
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            {/* 2. Company */}
            <div className="space-y-3">
              <h4 className="font-semibold text-[#1F1F1F] text-xs uppercase tracking-wider">
                Company
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link to="/about" className="hover:text-[#1F1F1F] transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-[#1F1F1F] transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* 3. Legal */}
            <div className="space-y-3">
              <h4 className="font-semibold text-[#1F1F1F] text-xs uppercase tracking-wider">
                Legal
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link to="/privacy" className="hover:text-[#1F1F1F] transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-[#1F1F1F] transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>

            {/* 4. Account */}
            <div className="space-y-3">
              <h4 className="font-semibold text-[#1F1F1F] text-xs uppercase tracking-wider">
                Account
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link to="/signin" className="hover:text-[#1F1F1F] transition-colors">
                    Sign in
                  </Link>
                </li>
                <li>
                  <Link to="/signup" className="hover:text-[#1F1F1F] transition-colors">
                    Sign up
                  </Link>
                </li>
              </ul>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom Bar: Copyright & Built by Priyanshu Gupta */}
        <div className="pt-6 border-t border-[#E3DFD8] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#5F5F5F]">
          <p>&copy; {new Date().getFullYear()} ResumeCheck &bull; Built by Priyanshu Gupta. All rights reserved.</p>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-[#1F1F1F] transition-colors font-medium"
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub Repository</span>
            <ExternalLink className="w-3 h-3 text-[#5F5F5F]" />
          </a>
        </div>
      </div>
    </footer>
  );
}
