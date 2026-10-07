import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FileText, LogOut, ChevronDown, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    if (location.pathname !== '/') {
      window.location.href = `/#${id}`;
      return;
    }
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSignOut = async () => {
    await logout();
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  const isHowItWorksActive = location.pathname === '/how-it-works';
  const isAboutActive = location.pathname === '/about' || location.pathname === '/privacy' || location.pathname === '/terms';
  const isDashboardActive = location.pathname === '/dashboard';
  const isSignInActive = location.pathname === '/signin';

  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : 'U';

  return (
    <header className="border-b border-[#E3DFD8] bg-[#FAF8F5]/95 sticky top-0 z-40 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Simple text logo on the left */}
        <Link
          to="/"
          className="text-xl font-serif font-bold text-[#1F1F1F] tracking-tight hover:opacity-90 transition-opacity"
        >
          ResumeCheck
        </Link>

        {/* Desktop navigation links with thin green active underline */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          <Link
            to="/how-it-works"
            className={`transition-all py-1 ${
              isHowItWorksActive
                ? 'text-[#1F6F5C] font-semibold border-b-2 border-[#1F6F5C]'
                : 'text-[#5F5F5F] hover:text-[#1F1F1F]'
            }`}
          >
            How it works
          </Link>
          <Link
            to="/#sample-report"
            className="text-[#5F5F5F] hover:text-[#1F1F1F] transition-colors py-1"
          >
            Sample report
          </Link>
          <Link
            to="/#faq"
            className="text-[#5F5F5F] hover:text-[#1F1F1F] transition-colors py-1"
          >
            FAQ
          </Link>
          <Link
            to="/about"
            className={`transition-all py-1 ${
              isAboutActive
                ? 'text-[#1F6F5C] font-semibold border-b-2 border-[#1F6F5C]'
                : 'text-[#5F5F5F] hover:text-[#1F1F1F]'
            }`}
          >
            About &amp; Privacy
          </Link>
          {user && (
            <Link
              to="/dashboard"
              className={`transition-all py-1 ${
                isDashboardActive
                  ? 'text-[#1F6F5C] font-semibold border-b-2 border-[#1F6F5C]'
                  : 'text-[#5F5F5F] hover:text-[#1F1F1F]'
              }`}
            >
              My analyses
            </Link>
          )}
        </nav>

        {/* Right side auth buttons & mobile toggle */}
        <div className="flex items-center gap-3">
          {!user ? (
            <>
              {/* "Sign in" is a plain text link */}
              <Link
                to="/signin"
                className={`text-xs sm:text-sm font-medium transition-colors px-2 py-1.5 ${
                  isSignInActive
                    ? 'text-[#1F6F5C] font-semibold border-b-2 border-[#1F6F5C]'
                    : 'text-[#5F5F5F] hover:text-[#1F1F1F]'
                }`}
              >
                Sign in
              </Link>
              {/* "Sign up" is the only filled green button */}
              <Link
                to="/signup"
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-[#1F6F5C] text-white text-xs sm:text-sm font-medium hover:bg-[#185849] active:bg-[#185849] transition-colors shadow-sm"
              >
                Sign up
              </Link>
            </>
          ) : (
            /* Authenticated: User Avatar with Dropdown Menu */
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1.5 p-1 rounded-full hover:ring-2 hover:ring-[#1F6F5C]/30 transition-all cursor-pointer"
                title={user.email}
                aria-label="User account menu"
              >
                <div className="w-8 h-8 rounded-full bg-[#1F6F5C] text-white flex items-center justify-center font-serif font-bold text-sm shadow-sm">
                  {userInitial}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#5F5F5F]" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-[#E3DFD8] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-[#E3DFD8]">
                    <p className="text-[11px] uppercase tracking-wider text-[#5F5F5F]/80 font-semibold">Signed in as</p>
                    <p className="text-xs font-medium text-[#1F1F1F] truncate" title={user.email}>
                      {user.email}
                    </p>
                  </div>

                  <Link
                    to="/dashboard"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-[#1F1F1F] hover:bg-[#FAF8F5] transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#1F6F5C]" />
                    <span>My analyses</span>
                  </Link>

                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-[#C0392B] hover:bg-[#FDF2F2] transition-colors text-left cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign out</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mobile hamburger menu toggle button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="md:hidden p-2 rounded-lg text-[#5F5F5F] hover:text-[#1F1F1F] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="md:hidden border-t border-[#E3DFD8] bg-[#FAF8F5] px-4 pt-3 pb-5 space-y-3 overflow-hidden shadow-lg"
          >
            <div className="flex flex-col space-y-2 text-sm font-medium">
              <Link
                to="/how-it-works"
                className={`px-3 py-2 rounded-lg transition-colors ${
                  isHowItWorksActive
                    ? 'text-[#1F6F5C] font-semibold bg-[#EAF3F0]'
                    : 'text-[#5F5F5F] hover:text-[#1F1F1F] hover:bg-[#FAF8F5]'
                }`}
              >
                How it works
              </Link>
              <Link
                to="/#sample-report"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-[#5F5F5F] hover:text-[#1F1F1F] hover:bg-[#FAF8F5] transition-colors"
              >
                Sample report
              </Link>
              <Link
                to="/#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-[#5F5F5F] hover:text-[#1F1F1F] hover:bg-[#FAF8F5] transition-colors"
              >
                FAQ
              </Link>
              <Link
                to="/about"
                className={`px-3 py-2 rounded-lg transition-colors ${
                  isAboutActive
                    ? 'text-[#1F6F5C] font-semibold bg-[#EAF3F0]'
                    : 'text-[#5F5F5F] hover:text-[#1F1F1F] hover:bg-[#FAF8F5]'
                }`}
              >
                About &amp; Privacy
              </Link>
              {user && (
                <Link
                  to="/dashboard"
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    isDashboardActive
                      ? 'text-[#1F6F5C] font-semibold bg-[#EAF3F0]'
                      : 'text-[#5F5F5F] hover:text-[#1F1F1F] hover:bg-[#FAF8F5]'
                  }`}
                >
                  My analyses
                </Link>
              )}
            </div>

            {user && (
              <div className="pt-2 border-t border-[#E3DFD8] flex items-center justify-between px-3">
                <span className="text-xs text-[#5F5F5F] truncate max-w-[200px]">{user.email}</span>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="text-xs font-semibold text-[#C0392B] hover:underline"
                >
                  Sign out
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
