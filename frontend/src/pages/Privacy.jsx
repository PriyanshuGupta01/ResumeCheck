import React from 'react';
import { Lock, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageMeta from '../components/PageMeta';

export default function Privacy() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 pb-24 space-y-8">
      <PageMeta
        title="Privacy Policy"
        description="Our zero resume storage guarantee: resumes are processed in-memory and never stored on server disks."
      />
      <div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1F1F1F]">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-[#5F5F5F]">
          Effective Date: October 2026 &bull; Strict Zero Resume File Retention
        </p>
      </div>

      <div className="bg-white border border-[#E3DFD8] rounded-xl p-6 sm:p-8 shadow-sm space-y-6 text-sm text-[#3A3A3A] leading-relaxed">
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-[#1F6F5C]">
            <Lock className="w-5 h-5" />
            <h2 className="text-xl font-serif font-bold text-[#1F1F1F]">
              Zero Resume Retention Guarantee
            </h2>
          </div>
          <p>
            At ResumeCheck, we believe job seekers should never have to sacrifice personal privacy to receive expert resume guidance. Our architecture operates without storing your resume documents or extracted resume text.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
            <div className="p-3.5 rounded-lg bg-[#FAF8F5] border border-[#E3DFD8]">
              <strong className="text-[#1F1F1F] block mb-1">In-Memory Stream Processing</strong>
              <span className="text-[#5F5F5F]">Uploaded files exist only in volatile server RAM while parsing and are deleted immediately after scoring. Files are never written to disk.</span>
            </div>

            <div className="p-3.5 rounded-lg bg-[#FAF8F5] border border-[#E3DFD8]">
              <strong className="text-[#1F1F1F] block mb-1">Optional Accounts &amp; Bcrypt Security</strong>
              <span className="text-[#5F5F5F]">Accounts are completely optional. If you register, we store only your email and a bcrypt-hashed password. Resumes and raw text are never stored.</span>
            </div>
          </div>
        </section>

        <section className="space-y-2 pt-4 border-t border-[#E3DFD8]">
          <h2 className="text-lg font-serif font-bold text-[#1F1F1F]">
            1. Information Processed
          </h2>
          <p>
            When you use the resume analyzer as a guest, our API temporarily ingests the text of your uploaded resume and the target job description in volatile memory solely to compute match scores, extract skills, and audit ATS compliance.
          </p>
          <p>
            If you create an optional account, you can save numerical scores and match summaries to your dashboard. Under our strict zero-retention guarantee, raw resume text is stripped out before saving to the database.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-serif font-bold text-[#1F1F1F]">
            2. Password Hashing &amp; Account Security
          </h2>
          <p>
            User passwords are encrypted using bcrypt with salted hashing before storage. We never log, store, or transmit plain-text passwords. Session tokens are signed using HMAC-SHA256 and stored in secure httpOnly cookies.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-serif font-bold text-[#1F1F1F]">
            3. Third-Party AI Transmission (AI Mode)
          </h2>
          <p>
            When generative AI feedback is enabled on the server, resume text and the job description are transmitted over encrypted TLS connections to Google Gemini solely to generate suggestions. In Basic Mode (default when no API key is provided), all evaluation runs locally without external network calls.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-serif font-bold text-[#1F1F1F]">
            4. Cookies &amp; Tracking
          </h2>
          <p>
            We use a single secure, signed httpOnly cookie strictly for user session authentication. We do not use third-party analytics, tracking beacons, or advertising cookies.
          </p>
        </section>

        <section className="space-y-2 pt-2 border-t border-[#E3DFD8]">
          <p className="text-xs text-[#5F5F5F]">
            Have privacy questions? Please visit our{' '}
            <Link to="/contact" className="text-[#1F6F5C] font-semibold hover:underline">
              Contact Page
            </Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
