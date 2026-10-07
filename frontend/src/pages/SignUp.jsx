import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, AlertCircle, ArrowRight, Loader2, CheckCircle2, Shield } from 'lucide-react';
import PageMeta from '../components/PageMeta';

export default function SignUp() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const validateForm = () => {
    if (!email.trim()) {
      setErrorMessage('Please enter an email address.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return false;
    }
    if (!password || password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!validateForm()) return;

    setIsLoading(true);
    const result = await signup(email.trim(), password);
    setIsLoading(false);

    if (!result.ok) {
      setErrorMessage(result.error || 'Failed to create account. Please try again.');
      return;
    }

    navigate('/dashboard', { replace: true });
  };

  const passwordLengthMet = password.length >= 8;

  return (
    <div className="max-w-md mx-auto px-4 pt-12 pb-24 space-y-6">
      <PageMeta
        title="Create Free Account"
        description="Create your free ResumeCheck account to save analyses and track your resume improvements over time."
      />
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1F1F1F]">
          Create Your Free Account
        </h1>
        <p className="mt-2 text-xs text-[#5F5F5F] leading-relaxed">
          Optional accounts let you save and compare your resume analyses over time.
        </p>
      </div>

      <div className="bg-white border border-[#E3DFD8] rounded-xl p-6 sm:p-8 shadow-sm space-y-5">
        {/* Zero file retention guarantee */}
        <div className="p-3 rounded-lg bg-[#EEF6F1] border border-[#166534]/30 text-xs text-[#166534] flex items-center gap-2">
          <Shield className="w-4 h-4 shrink-0" />
          <span>Strict privacy: Resumes and raw text are never stored.</span>
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
            <label htmlFor="signup-email" className="block text-xs font-semibold text-[#1F1F1F] mb-1">
              Email Address
            </label>
            <input
              id="signup-email"
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
            <label className="block text-xs font-semibold text-[#1F1F1F] mb-1">
              Password
            </label>
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
            <div className="mt-1 flex items-center gap-1.5 text-[11px]">
              <span className={passwordLengthMet ? 'text-[#166534] font-medium' : 'text-[#5F5F5F]'}>
                {passwordLengthMet ? '✓ Minimum 8 characters met' : '• Requires at least 8 characters'}
              </span>
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
                <span>Creating Account...</span>
              </>
            ) : (
              <span>Create Free Account</span>
            )}
          </button>
        </form>

        <div className="pt-2 border-t border-[#E3DFD8] text-center">
          <Link
            to="/analyze"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1F6F5C] hover:underline"
          >
            <span>Start without signing up</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      <p className="text-center text-xs text-[#5F5F5F]">
        Already have an account?{' '}
        <Link to="/signin" className="text-[#1F6F5C] font-semibold hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
