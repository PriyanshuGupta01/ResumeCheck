import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, AlertCircle, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';
import PageMeta from '../components/PageMeta';

export default function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Target destination after sign-in (e.g. /dashboard or previous page)
  const from = location.state?.from?.pathname || '/dashboard';

  const validateForm = () => {
    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return false;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!validateForm()) return;

    setIsLoading(true);
    const result = await login(email.trim(), password);
    setIsLoading(false);

    if (!result.ok) {
      setErrorMessage(result.error || 'Failed to sign in. Please verify your credentials.');
      return;
    }

    navigate(from, { replace: true });
  };

  return (
    <div className="max-w-md mx-auto px-4 pt-12 pb-24 space-y-6">
      <PageMeta
        title="Sign In"
        description="Sign in to your free ResumeCheck account to save analyses and track scores over time."
      />
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1F1F1F]">
          Sign in to ResumeCheck
        </h1>
        <p className="mt-2 text-xs text-[#5F5F5F] leading-relaxed">
          Access your saved analyses and track your resume scores over time.
        </p>
      </div>

      <div className="bg-white border border-[#E3DFD8] rounded-xl p-6 sm:p-8 shadow-sm space-y-5">
        {/* Optional accounts notice */}
        <div className="p-3 rounded-lg bg-[#EAF3F0] border border-[#1F6F5C]/30 text-xs text-[#1F6F5C] flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>Accounts are optional. Guest analysis is always available.</span>
        </div>

        {/* Error message alert with Try again */}
        {errorMessage && (
          <div className="p-3 rounded-lg bg-[#FDF2F2] border border-[#C0392B]/30 text-xs text-[#C0392B] flex items-center justify-between gap-2 animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-2 py-0.5 bg-[#C0392B] text-white rounded text-[11px] font-semibold hover:bg-[#A93226] cursor-pointer shrink-0"
            >
              Try again
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="signin-email" className="block text-xs font-semibold text-[#1F1F1F] mb-1">
              Email Address
            </label>
            <input
              id="signin-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              placeholder="aarav.sharma@gmail.com"
              required
              disabled={isLoading}
              className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E3DFD8] rounded-lg text-xs text-[#1F1F1F] placeholder-[#5F5F5F]/60 focus:outline-none focus:border-[#1F6F5C] focus:ring-1 focus:ring-[#1F6F5C] transition-colors"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-[#1F1F1F]">
                Password
              </label>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="••••••••"
                required
                disabled={isLoading}
                className="w-full px-3.5 py-2.5 pr-10 bg-[#FAF8F5] border border-[#E3DFD8] rounded-lg text-xs text-[#1F1F1F] placeholder-[#5F5F5F]/60 focus:outline-none focus:border-[#1F6F5C] focus:ring-1 focus:ring-[#1F6F5C] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5F5F5F] hover:text-[#1F1F1F] transition-colors cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-[#1F6F5C] hover:bg-[#185849] disabled:opacity-60 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign in</span>
            )}
          </button>
        </form>

        <div className="pt-2 border-t border-[#E3DFD8] text-center">
          <Link
            to="/analyze"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1F6F5C] hover:underline"
          >
            <span>Skip and start analyzing as guest</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      <p className="text-center text-xs text-[#5F5F5F]">
        Don't have an account yet?{' '}
        <Link to="/signup" className="text-[#1F6F5C] font-semibold hover:underline">
          Sign up for free
        </Link>
      </p>
    </div>
  );
}
