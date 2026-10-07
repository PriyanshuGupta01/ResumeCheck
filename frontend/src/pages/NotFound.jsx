import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';
import PageMeta from '../components/PageMeta';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <PageMeta
        title="Page Not Found"
        description="The page you are looking for could not be found. Return to ResumeCheck home page."
      />
      <div className="max-w-md w-full text-center space-y-6 bg-white border border-[#E3DFD8] rounded-2xl p-8 sm:p-10 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-[#EAF3F0] border border-[#1F6F5C]/30 text-[#1F6F5C] flex items-center justify-center mx-auto shadow-inner">
          <Search className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#1F6F5C]">
            404 Error
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1F1F1F]">
            Page not found
          </h1>
          <p className="text-xs sm:text-sm text-[#5F5F5F] leading-relaxed">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved or doesn&apos;t exist.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#1F6F5C] hover:bg-[#185849] text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <Link
            to="/analyze"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white hover:bg-[#FAF8F5] border border-[#E3DFD8] text-[#1F1F1F] text-xs font-semibold rounded-xl transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-[#5F5F5F]" />
            <span>Check Resume</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
