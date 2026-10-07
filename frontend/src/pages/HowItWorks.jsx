import React from 'react';
import { Link } from 'react-router-dom';
import {
  UploadCloud,
  FileText,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Target,
  BarChart3,
  Search,
  Cpu,
} from 'lucide-react';
import PageMeta from '../components/PageMeta';

export default function HowItWorks() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 pb-24 space-y-16">
      <PageMeta
        title="How It Works — Scoring Architecture"
        description="Learn how ResumeCheck evaluates skill match (50%), text relevance (25%), structure (15%), and ATS quality (10%) with zero resume storage."
      />
      {/* Page Header */}
      <section className="text-center sm:text-left max-w-3xl">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#1F6F5C] bg-[#EAF3F0] px-3 py-1 rounded-full border border-[#1F6F5C]/30 inline-block mb-3">
          Architecture &amp; Methodology
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#1F1F1F] tracking-tight leading-[1.2]">
          How ResumeCheck Works
        </h1>
        <p className="mt-4 text-base sm:text-lg text-[#5F5F5F] leading-relaxed">
          Understand how our in-memory evaluation engine parses resumes, extracts required skills, calculates ATS compliance, and computes match scores.
        </p>
      </section>

      {/* Part 1: The 3 Steps in Detail */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#1F1F1F]">
            1. The 3-Step Analysis Process
          </h2>
          <p className="text-sm text-[#5F5F5F] mt-1">
            From raw document to actionable feedback in under 5 seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="bg-white border border-[#E3DFD8] rounded-xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#EAF3F0] border border-[#1F6F5C]/30 flex items-center justify-center text-[#1F6F5C] mb-4">
                <UploadCloud className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono font-semibold text-[#1F6F5C]">STEP 01</span>
              <h3 className="text-lg font-serif font-bold text-[#1F1F1F] mt-1 mb-2">
                Upload Resume
              </h3>
              <p className="text-xs text-[#5F5F5F] leading-relaxed">
                Upload your resume in PDF (<code className="text-[#1F1F1F] bg-[#FAF8F5] px-1 py-0.5 rounded border border-[#E3DFD8]">.pdf</code>) or Word (<code className="text-[#1F1F1F] bg-[#FAF8F5] px-1 py-0.5 rounded border border-[#E3DFD8]">.docx</code>) format up to 5 MB. Text and layout structure are extracted in volatile memory.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#E3DFD8] text-[11px] text-[#5F5F5F]">
              &bull; Encrypted &amp; scanned PDF validation
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white border border-[#E3DFD8] rounded-xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#EAF3F0] border border-[#1F6F5C]/30 flex items-center justify-center text-[#1F6F5C] mb-4">
                <Target className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono font-semibold text-[#1F6F5C]">STEP 02</span>
              <h3 className="text-lg font-serif font-bold text-[#1F1F1F] mt-1 mb-2">
                Paste Job Posting
              </h3>
              <p className="text-xs text-[#5F5F5F] leading-relaxed">
                Paste the target job description (minimum 50 characters). Our engine extracts core qualifications, technical skills, tools, and experience requirements using alias normalization.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#E3DFD8] text-[11px] text-[#5F5F5F]">
              &bull; 200+ skill dictionary mapping
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white border border-[#E3DFD8] rounded-xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#EAF3F0] border border-[#1F6F5C]/30 flex items-center justify-center text-[#1F6F5C] mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono font-semibold text-[#1F6F5C]">STEP 03</span>
              <h3 className="text-lg font-serif font-bold text-[#1F1F1F] mt-1 mb-2">
                Review Fixes &amp; Export
              </h3>
              <p className="text-xs text-[#5F5F5F] leading-relaxed">
                Inspect your 0–100 match score, missing technical keywords, ATS compliance flags, and AI bullet rewrites. Download a complete PDF summary report with one click.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#E3DFD8] text-[11px] text-[#5F5F5F]">
              &bull; Instant multi-page PDF generation
            </div>
          </div>
        </div>
      </section>

      {/* Part 2: Scoring Formula Breakdown */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#1F1F1F]">
            2. What the 0–100 Score is Made Of
          </h2>
          <p className="text-sm text-[#5F5F5F] mt-1">
            A deterministic, weighted composite score designed to mirror how recruiters and ATS algorithms evaluate candidate profiles.
          </p>
        </div>

        <div className="bg-white border border-[#E3DFD8] rounded-xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Factor 1 */}
            <div className="p-4 rounded-lg bg-[#FAF8F5] border border-[#E3DFD8]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#1F6F5C]">Factor 1</span>
                <span className="text-sm font-mono font-bold text-[#1F6F5C]">50% Weight</span>
              </div>
              <h4 className="text-base font-serif font-bold text-[#1F1F1F]">
                Skill match
              </h4>
              <p className="text-xs text-[#5F5F5F] mt-1 leading-relaxed">
                Calculates the proportion of required skills from the job description explicitly identified in the candidate&apos;s resume, cross-referenced with our comprehensive skill catalog and alias normalization.
              </p>
            </div>

            {/* Factor 2 */}
            <div className="p-4 rounded-lg bg-[#FAF8F5] border border-[#E3DFD8]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0369A1]">Factor 2</span>
                <span className="text-sm font-mono font-bold text-[#0369A1]">25% Weight</span>
              </div>
              <h4 className="text-base font-serif font-bold text-[#1F1F1F]">
                Text relevance
              </h4>
              <p className="text-xs text-[#5F5F5F] mt-1 leading-relaxed">
                Computes TF-IDF (Term Frequency-Inverse Document Frequency) cosine similarity between the resume text and the job description, capturing overall vocabulary alignment beyond individual skill keywords.
              </p>
            </div>

            {/* Factor 3 */}
            <div className="p-4 rounded-lg bg-[#FAF8F5] border border-[#E3DFD8]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#15803D]">Factor 3</span>
                <span className="text-sm font-mono font-bold text-[#15803D]">15% Weight</span>
              </div>
              <h4 className="text-base font-serif font-bold text-[#1F1F1F]">
                Structure
              </h4>
              <p className="text-xs text-[#5F5F5F] mt-1 leading-relaxed">
                Checks for the presence of standard resume sections: Contact, Summary/Objective, Skills, Experience/Internships, Education, Projects, and Certifications.
              </p>
            </div>

            {/* Factor 4 */}
            <div className="p-4 rounded-lg bg-[#FAF8F5] border border-[#E3DFD8]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#B45309]">Factor 4</span>
                <span className="text-sm font-mono font-bold text-[#B45309]">10% Weight</span>
              </div>
              <h4 className="text-base font-serif font-bold text-[#1F1F1F]">
                ATS quality
              </h4>
              <p className="text-xs text-[#5F5F5F] mt-1 leading-relaxed">
                Audits formatting hygiene: word count density, action verbs, quantified metrics, contact channels, and fair screening checks (omitting photos/biodata).
              </p>
            </div>
          </div>

          {/* Rating Scale Breakdown */}
          <div className="pt-4 border-t border-[#E3DFD8]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1F1F1F] mb-3">
              Score Rating Scale
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-[#EEF6F1] border border-[#166534]/25">
                <span className="font-bold text-[#166534] block">85 – 100</span>
                <span className="font-serif font-bold text-[#1F1F1F] text-sm mt-0.5 block">Excellent</span>
                <p className="text-[11px] text-[#5F5F5F] mt-1">Exceptional role alignment.</p>
              </div>

              <div className="p-3 rounded-lg bg-[#EAF3F0] border border-[#1F6F5C]/25">
                <span className="font-bold text-[#1F6F5C] block">70 – 84</span>
                <span className="font-serif font-bold text-[#1F1F1F] text-sm mt-0.5 block">Good</span>
                <p className="text-[11px] text-[#5F5F5F] mt-1">Strong core qualification match.</p>
              </div>

              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                <span className="font-bold text-amber-800 block">40 – 69</span>
                <span className="font-serif font-bold text-[#1F1F1F] text-sm mt-0.5 block">Fair</span>
                <p className="text-[11px] text-[#5F5F5F] mt-1">Moderate fit; needs keyword tuning.</p>
              </div>

              <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                <span className="font-bold text-red-800 block">0 – 39</span>
                <span className="font-serif font-bold text-[#1F1F1F] text-sm mt-0.5 block">Weak</span>
                <p className="text-[11px] text-[#5F5F5F] mt-1">Key skills and competencies missing.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Part 3: What ATS Means & What We Check */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#1F1F1F]">
            3. What ATS Means and What We Check
          </h2>
          <p className="text-sm text-[#5F5F5F] mt-1">
            Understanding automated resume filtering and candidate screening systems.
          </p>
        </div>

        <div className="bg-white border border-[#E3DFD8] rounded-xl p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h3 className="text-lg font-serif font-bold text-[#1F1F1F] mb-2">
              What is an ATS (Applicant Tracking System)?
            </h3>
            <p className="text-sm text-[#3A3A3A] leading-relaxed">
              An <strong>Applicant Tracking System (ATS)</strong> is automated software used by over 95% of corporate recruiters and organizations to collect, parse, sort, and rank incoming job applications. Before a hiring manager or recruiter reads your resume, the ATS extracts your text into standardized database fields and checks whether you match the job’s core criteria.
            </p>
          </div>

          <div className="pt-4 border-t border-[#E3DFD8]">
            <h4 className="text-base font-serif font-bold text-[#1F1F1F] mb-3">
              The 7 Essential ATS Checks ResumeCheck Performs
            </h4>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-[#FAF8F5] border border-[#E3DFD8] text-xs">
                <strong className="text-[#1F1F1F] font-semibold block mb-0.5">1. Standard Section Headings</strong>
                <span className="text-[#5F5F5F]">Ensures conventional headings (Experience, Education, Skills) are present so parsers do not scramble or drop entire sections.</span>
              </div>

              <div className="p-3 rounded-lg bg-[#FAF8F5] border border-[#E3DFD8] text-xs">
                <strong className="text-[#1F1F1F] font-semibold block mb-0.5">2. Optimal Word Count (300 to 1,200 Words)</strong>
                <span className="text-[#5F5F5F]">Verifies length is calibrated for standard 1–2 page resumes. Flags resumes that are too short to demonstrate depth or excessively long.</span>
              </div>

              <div className="p-3 rounded-lg bg-[#FAF8F5] border border-[#E3DFD8] text-xs">
                <strong className="text-[#1F1F1F] font-semibold block mb-0.5">3. Complete Contact Information</strong>
                <span className="text-[#5F5F5F]">Verifies direct email and phone number are present, alongside professional profiles (LinkedIn, GitHub).</span>
              </div>

              <div className="p-3 rounded-lg bg-[#FAF8F5] border border-[#E3DFD8] text-xs">
                <strong className="text-[#1F1F1F] font-semibold block mb-0.5">4. Paragraph Density (&le;60 words per bullet)</strong>
                <span className="text-[#5F5F5F]">Flags long blocks of unformatted text. Recruiter research shows bullets over 60 words suffer from high drop-off rates.</span>
              </div>

              <div className="p-3 rounded-lg bg-[#FAF8F5] border border-[#E3DFD8] text-xs">
                <strong className="text-[#1F1F1F] font-semibold block mb-0.5">5. Strong Action Verbs</strong>
                <span className="text-[#5F5F5F]">Checks whether bullet points begin with decisive verbs (e.g. <em>Architected, Spearheaded, Automated, Delivered</em>) from a 60+ action verb dataset.</span>
              </div>

              <div className="p-3 rounded-lg bg-[#FAF8F5] border border-[#E3DFD8] text-xs">
                <strong className="text-[#1F1F1F] font-semibold block mb-0.5">6. Quantified Impact &amp; Metrics</strong>
                <span className="text-[#5F5F5F]">Detects whether your experience includes numbers, percentages, or dollar amounts proving tangible results.</span>
              </div>

              <div className="p-3 rounded-lg bg-[#FAF8F5] border border-[#E3DFD8] text-xs">
                <strong className="text-[#1F1F1F] font-semibold block mb-0.5">7. Target Keyword Vocabulary Coverage</strong>
                <span className="text-[#5F5F5F]">Measures the proportion of distinct technical and domain terms from the job posting represented across your experience.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Part 4: Privacy & File Handling */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#1F1F1F]">
            4. What We Do With Uploaded Files
          </h2>
          <p className="text-sm text-[#5F5F5F] mt-1">
            Zero data retention guarantee and strict in-memory execution.
          </p>
        </div>

        <div className="bg-white border border-[#E3DFD8] rounded-xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#EAF3F0] border border-[#1F6F5C]/30 flex items-center justify-center text-[#1F6F5C] shrink-0">
              <Lock className="w-6 h-6" />
            </div>
            <div className="space-y-3">
              <h3 className="text-lg font-serif font-bold text-[#1F1F1F]">
                100% In-Memory Processing
              </h3>
              <p className="text-sm text-[#3A3A3A] leading-relaxed">
                When you upload a file, it is read directly into Python byte streams in volatile RAM. <strong>The file is never written to a server hard drive, database, or cloud bucket.</strong>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="flex items-center gap-2 text-[#3A3A3A]">
                  <CheckCircle2 className="w-4 h-4 text-[#166534] shrink-0" />
                  <span>No permanent storage or file logging</span>
                </div>
                <div className="flex items-center gap-2 text-[#3A3A3A]">
                  <CheckCircle2 className="w-4 h-4 text-[#166534] shrink-0" />
                  <span>Optional accounts (resumes never stored even if signed in)</span>
                </div>
                <div className="flex items-center gap-2 text-[#3A3A3A]">
                  <CheckCircle2 className="w-4 h-4 text-[#166534] shrink-0" />
                  <span>No selling or sharing of personal data</span>
                </div>
                <div className="flex items-center gap-2 text-[#3A3A3A]">
                  <CheckCircle2 className="w-4 h-4 text-[#166534] shrink-0" />
                  <span>Immediate garbage-collection after response</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Part 5: Try It Now Call-to-Action */}
      <section className="bg-white border border-[#E3DFD8] rounded-xl p-8 sm:p-12 text-center shadow-sm space-y-4">
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1F1F1F]">
          Ready to test your resume against a job description?
        </h2>
        <p className="text-sm text-[#5F5F5F] max-w-xl mx-auto leading-relaxed">
          Upload your document and get instant feedback, keyword gap analysis, and tailored bullet point rewrites.
        </p>
        <div className="pt-2">
          <Link
            to="/analyze"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#1F6F5C] hover:bg-[#185849] text-white text-sm font-semibold rounded-xl transition-all shadow-sm cursor-pointer"
          >
            <span>Try it now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
