import React from 'react';
import PageMeta from '../components/PageMeta';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 pb-20">
      <PageMeta
        title="About & Privacy Commitment"
        description="Learn about ResumeCheck, built by Priyanshu Gupta. Zero resume storage guarantee, in-memory processing, and transparent match scoring."
      />
      <div className="mb-12">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1F1F1F]">
          About &amp; Privacy Commitment
        </h1>
        <p className="mt-3 text-base text-[#5F5F5F]">
          ResumeCheck is designed to provide transparent, practical feedback on your resume without compromising your personal privacy. Built by Priyanshu Gupta.
        </p>
      </div>

      <div className="space-y-10">
        {/* Creator Note */}
        <section className="bg-white border border-[#E3DFD8] rounded-xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#1F6F5C] text-white flex items-center justify-center font-serif font-bold text-sm shadow-sm">
              PG
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-[#1F1F1F]">
                Built by Priyanshu Gupta
              </h2>
              <span className="text-xs text-[#5F5F5F]">Founder &amp; Creator</span>
            </div>
          </div>
          <p className="text-sm text-[#3A3A3A] leading-relaxed">
            &ldquo;I&apos;m Priyanshu Gupta. Tailoring a resume for every job takes a lot of guessing, and most free checkers only give a number with no explanation. I built ResumeCheck to show what is actually missing and how to fix it. It is still a work in progress, so if something looks wrong, tell me.&rdquo;
          </p>
        </section>

        {/* Privacy Commitment */}
        <section className="bg-white border border-[#E3DFD8] rounded-xl p-6 sm:p-8 shadow-sm">
          <h2 className="text-xl font-serif font-bold text-[#1F1F1F] mb-4">
            Zero Resume Storage Guarantee
          </h2>
          <p className="text-sm text-[#5F5F5F] leading-relaxed mb-6">
            We believe job applicants should not have to trade privacy for resume guidance. Here is how your files and data are handled:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="p-4 bg-[#FAF8F5] border border-[#E3DFD8] rounded-lg">
              <h3 className="font-semibold text-[#1F1F1F]">In-Memory Processing Only</h3>
              <p className="text-[#3A3A3A] mt-1 leading-relaxed">
                When you upload a PDF or DOCX file, text is parsed in volatile RAM streams. The file is never saved to a server hard disk or cloud storage bucket.
              </p>
            </div>

            <div className="p-4 bg-[#FAF8F5] border border-[#E3DFD8] rounded-lg">
              <h3 className="font-semibold text-[#1F1F1F]">Optional Accounts &amp; Hashed Passwords</h3>
              <p className="text-[#3A3A3A] mt-1 leading-relaxed">
                Accounts are optional. We store only your email and a bcrypt-hashed password. Even for signed-in accounts, raw resume text is never persisted.
              </p>
            </div>

            <div className="p-4 bg-[#FAF8F5] border border-[#E3DFD8] rounded-lg sm:col-span-2">
              <h3 className="font-semibold text-[#1F1F1F]">AI Provider Transmission</h3>
              <p className="text-[#3A3A3A] mt-1 leading-relaxed">
                When AI feedback is enabled, extracted text and the target job description are sent to Google Gemini via encrypted HTTPS for analysis only. In Basic Mode (without an API key configured), all skill extraction and ATS checking runs completely on the local server without any external calls.
              </p>
            </div>
          </div>
        </section>

        {/* Technical Architecture */}
        <section className="bg-white border border-[#E3DFD8] rounded-xl p-6 sm:p-8 shadow-sm">
          <h2 className="text-xl font-serif font-bold text-[#1F1F1F] mb-4">
            How Analysis Works
          </h2>
          <div className="space-y-4 text-sm text-[#3A3A3A] leading-relaxed">
            <p>
              <strong className="text-[#1F1F1F] font-semibold">1. Parsing:</strong> Plain text is extracted from `.pdf` and `.docx` containers using lightweight Python extraction libraries.
            </p>
            <p>
              <strong className="text-[#1F1F1F] font-semibold">2. Skill Extraction:</strong> Case-insensitive word boundary matching checks against a curated dictionary of technical and professional skills with alias mapping.
            </p>
            <p>
              <strong className="text-[#1F1F1F] font-semibold">3. Scoring Model:</strong> Overall match scoring is a weighted combination of Skill match (50%), Text relevance (25%), Structure (15%), and ATS quality (10%).
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
