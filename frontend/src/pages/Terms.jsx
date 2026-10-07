import React from 'react';
import { Link } from 'react-router-dom';
import PageMeta from '../components/PageMeta';

export default function Terms() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 pb-24 space-y-8">
      <PageMeta
        title="Terms of Service"
        description="Terms of service and usage conditions for ResumeCheck."
      />
      <div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1F1F1F]">
          Terms of Service
        </h1>
        <p className="mt-2 text-sm text-[#5F5F5F]">
          Effective Date: October 2026 &bull; Version 1.0
        </p>
      </div>

      <div className="bg-white border border-[#E3DFD8] rounded-xl p-6 sm:p-8 shadow-sm space-y-6 text-sm text-[#3A3A3A] leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-serif font-bold text-[#1F1F1F]">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing or using ResumeCheck, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not use the service.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-serif font-bold text-[#1F1F1F]">
            2. Permitted Use &amp; Service Scope
          </h2>
          <p>
            ResumeCheck is an informational utility that calculates match scores and analyzes resume compatibility against job descriptions. The analysis results, match scores, and suggestions are provided for guidance purposes only and do not guarantee interview invitations, employment, or job placement.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-serif font-bold text-[#1F1F1F]">
            3. Privacy &amp; Data Handling
          </h2>
          <p>
            Your documents are processed strictly in volatile computer memory during analysis and are not saved to disk or permanent databases. You retain all ownership rights to your resume and content. For further details, please review our{' '}
            <Link to="/privacy" className="text-[#1F6F5C] font-semibold hover:underline">
              Privacy Policy
            </Link>.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-serif font-bold text-[#1F1F1F]">
            4. Prohibited Uses
          </h2>
          <p>
            You agree not to upload malicious files, exploit or reverse-engineer the API, or use automated scrapers that degrade server availability.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-serif font-bold text-[#1F1F1F]">
            5. Disclaimer of Warranties
          </h2>
          <p>
            The service is provided on an &ldquo;AS IS&rdquo; and &ldquo;AS AVAILABLE&rdquo; basis without warranties of any kind.
          </p>
        </section>
      </div>
    </div>
  );
}
