import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Target,
  FileText,
  FileCheck2,
  Edit3,
  AlignLeft,
  HelpCircle,
  ShieldCheck,
  Lock,
  User,
  GraduationCap,
  Briefcase,
  Search,
} from 'lucide-react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import HeroIllustration from '../components/HeroIllustration';
import CheckResumeButton from '../components/CheckResumeButton';
import CountUp from '../components/CountUp';
import PageMeta from '../components/PageMeta';
import { userFeedback } from '../data/feedback';

export default function Home() {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  // State for interactive Sample Report tabs
  const [sampleTab, setSampleTab] = useState('skills'); // 'skills' | 'ats' | 'suggestions'

  // State for Before and After carousel
  const [beforeAfterIndex, setBeforeAfterIndex] = useState(0);

  // State for accordion FAQ
  const [openFaq, setOpenFaq] = useState(0); // first item open by default

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  // Render only entries with approved: true. If none are approved, hides cleanly.
  const activeFeedback = userFeedback.filter((item) => Boolean(item.approved));

  const getInitials = (name = '') => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return (parts[0]?.[0] || 'U').toUpperCase();
  };

  // -------------------------------------------------------------
  // Data for Before and After bullet rewrites (5-6 roles with Indian context)
  // -------------------------------------------------------------
  const beforeAfterExamples = [
    {
      role: 'Backend Engineering',
      weak: 'Worked on backend APIs for the web application.',
      improved: 'Built 12 FastAPI endpoints that cut response time by 35% for 45,000 monthly active users.',
      why: 'Replaces a vague duty with a specific framework, concrete output count, and a measurable latency outcome.',
    },
    {
      role: 'Frontend Development',
      weak: 'Responsible for improving company website performance and UI design.',
      improved: 'Redesigned checkout flows using React and Tailwind CSS, increasing mobile conversion rate by 18%.',
      why: 'Specifies modern tools used and highlights a direct business conversion metric instead of generic responsibilities.',
    },
    {
      role: 'Data & Analytics',
      weak: 'Handled data pipelines and created weekly dashboards for stakeholders.',
      improved: 'Automated daily SQL ETL pipelines processing 2.5M rows, reducing weekly report generation time from 6 hours to 15 minutes.',
      why: 'Quantifies the volume of data processed and measures exact operational hours saved for the business.',
    },
    {
      role: 'Marketing',
      weak: 'Ran digital marketing campaigns and managed promotional social ads.',
      improved: 'Managed ₹8L quarterly ad spend across Meta and Google, scaling customer acquisition by 28% in Tier-2 Indian cities with 3.4x ROAS.',
      why: 'Specifies the advertising budget in INR, target regional demographic, and a concrete return on ad spend.',
    },
    {
      role: 'Finance & Accounts',
      weak: 'Handled bookkeeping, monthly GST filing, and invoicing in Tally.',
      improved: 'Reconciled monthly GST returns (GSTR-1, 3B) and bank statements for ₹4.5 Cr turnover in Tally Prime with zero compliance notices.',
      why: 'Quantifies company revenue scale in Crores, specifies official Indian tax returns, and highlights flawless compliance.',
    },
    {
      role: 'Customer Support',
      weak: 'Answered customer phone calls and resolved email tickets.',
      improved: 'Resolved 65+ inbound customer tickets daily on Freshdesk with a 96% CSAT score and under 15-minute first response time.',
      why: 'Provides daily ticket volume, tool used (Freshdesk), and measurable customer satisfaction and response time metrics.',
    },
  ];

  // -------------------------------------------------------------
  // Data for Common Resume Mistakes
  // -------------------------------------------------------------
  const commonMistakes = [
    {
      mistake: 'No numbers in achievements',
      fix: 'Add quantities, percentages, time saved, or user counts to prove real-world impact.',
    },
    {
      mistake: 'One resume for every job',
      fix: 'Adjust keywords and highlighted projects to match each specific job description.',
    },
    {
      mistake: 'Long paragraphs',
      fix: 'Break dense text blocks into concise bullet points of two lines or fewer.',
    },
    {
      mistake: 'Missing keywords',
      fix: 'Mirror the exact phrasing used in the job post (for example, "PostgreSQL" instead of just "databases").',
    },
    {
      mistake: 'Fancy templates that ATS cannot read',
      fix: 'Use single-column layouts with standard fonts and avoid tables, columns, or graphic bars.',
    },
    {
      mistake: 'No links to projects',
      fix: 'Include working links to GitHub repositories, live demos, or portfolio case studies.',
    },
  ];

  // -------------------------------------------------------------
  // Data for FAQ (Two-column layout, 7 questions)
  // -------------------------------------------------------------
  const faqs = [
    {
      q: 'Is ResumeCheck completely free?',
      a: 'Yes. Core analysis, score breakdowns, and PDF report downloads are 100% free with no subscription, paywall, or credit card required.',
    },
    {
      q: 'Does it work for my field?',
      a: 'Yes. While specialized for technical, engineering, data, and design roles, the scoring engine evaluates text relevance, structure completeness, and keyword overlap for any professional industry.',
    },
    {
      q: 'Can I use it for several jobs?',
      a: 'Yes. You can test your resume against as many target job descriptions as you like to see how well your qualifications align with each distinct opening.',
    },
    {
      q: 'Why is my score low?',
      a: 'Low scores typically happen when key competencies from the job post are missing from your resume text, or when your document lacks quantified metrics and standard section headings.',
    },
    {
      q: 'How do I improve a score?',
      a: 'Review the missing skills list, incorporate the suggested bullet point rewrites with measurable results, and ensure your formatting passes all ATS checks.',
    },
    {
      q: 'Do I need an account to use ResumeCheck?',
      a: 'No, accounts are completely optional. Core analysis works 100% without signing in. If you choose to create a free account, we store only your email and a bcrypt-hashed password so you can save past scores. Your resume files and raw text are never stored.',
    },
    {
      q: 'Is my resume data stored or shared?',
      a: 'No. Uploaded files exist only in volatile server memory during analysis and are deleted immediately after scoring. Resumes and raw text are never stored on disk or sold to third parties.',
    },
    {
      q: 'What file formats can I upload?',
      a: 'We support text-based PDF and Microsoft Word (.docx) documents up to 5 MB in size. Scanned images and password-protected files cannot be read.',
    },
  ];

  // -------------------------------------------------------------
  // Motion Animation Presets
  // -------------------------------------------------------------
  const fadeInUp = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: 'easeOut' },
    },
  };

  const staggerContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
      },
    },
  };

  return (
    <div className="flex flex-col w-full text-[#3A3A3A]">
      <PageMeta
        title="ResumeCheck — Tailor your resume before you apply"
        description="See how your resume matches the job before you apply. Free resume scanner for Indian job seekers with skill match, ATS check, and text relevance analysis."
      />
      {/* =========================================================
          1. HERO SECTION
          ========================================================= */}
      <section className="bg-[#FAF8F5] pt-10 sm:pt-16 pb-16 sm:pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Left: Headline & Actions */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="lg:col-span-7 space-y-6 text-center lg:text-left"
            >
              <h1
                style={{ textWrap: 'balance' }}
                className="text-3xl sm:text-5xl lg:text-[3.25rem] font-serif font-bold text-[#1F1F1F] leading-[1.18] tracking-tight max-w-xl mx-auto lg:mx-0"
              >
                See how your resume matches the job{' '}
                <span className="relative inline-block whitespace-nowrap">
                  before you apply.
                  {/* Hand-drawn style SVG underline */}
                  <svg
                    className="absolute left-0 -bottom-2 w-full h-3 text-[#1F6F5C] pointer-events-none"
                    viewBox="0 0 250 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <motion.path
                      d="M3 8.5C50 3 150 2 247 7.5C180 11.5 80 10.5 25 9.5"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={shouldReduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
                    />
                  </svg>
                </span>
              </h1>

              <p className="text-base sm:text-lg text-[#5F5F5F] leading-relaxed max-w-xl mx-auto lg:mx-0 font-normal">
                Upload your resume, paste the target job description, and get an instant match score, missing skills, and actionable fixes.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
                <CheckResumeButton size="lg">
                  Check my resume
                </CheckResumeButton>

                {/* Secondary Button: Try with a sample resume */}
                <motion.button
                  type="button"
                  onClick={() => navigate('/analyze', { state: { loadSample: true } })}
                  whileHover={shouldReduceMotion ? {} : { y: -1 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-semibold rounded-xl border border-[#E3DFD8] bg-white hover:bg-[#FAF8F5] text-[#1F1F1F] shadow-sm transition-colors cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-[#1F6F5C]" />
                  <span>Try with a sample resume</span>
                </motion.button>
              </div>

              <p className="text-xs text-[#5F5F5F] pt-1">
                Free &bull; No sign-up required &bull; PDF or DOCX
              </p>
            </motion.div>

            {/* Right: Animated SVG Illustration */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ duration: 0.5, delay: shouldReduceMotion ? 0 : 0.1, ease: 'easeOut' }}
              className="lg:col-span-5 flex justify-center lg:justify-end"
            >
              <HeroIllustration />
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================================
          2. WHO IT'S FOR (3 Equal-Height Blocks with Indian Examples)
          ========================================================= */}
      <section className="bg-white py-16 sm:py-24 border-y border-[#E3DFD8]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={fadeInUp}
            className="mb-10 max-w-2xl"
          >
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1F1F1F]">
              Built for every stage of your job search
            </h2>
            <p className="text-sm text-[#5F5F5F] mt-2">
              Specific evaluations whether you are applying to your first role or reviewing candidate profiles.
            </p>
          </motion.div>

          {/* 3 Equal-Height Blocks, No Empty Gap */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {/* Block 1: Campus placements */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              variants={fadeInUp}
              className="p-6 sm:p-7 rounded-2xl bg-[#FAF8F5] border border-[#E3DFD8] flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-white border border-[#E3DFD8] text-[#1F6F5C] flex items-center justify-center mb-4 shadow-sm">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-serif font-bold text-[#1F1F1F]">
                  Campus placements
                </h3>
                <p className="text-xs sm:text-sm text-[#5F5F5F] mt-2.5 leading-relaxed">
                  Tailor academic projects, coursework, and technical skills to match day-one campus placement and off-campus drive requirements.
                </p>
              </div>
            </motion.div>

            {/* Block 2: Internships and first job */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              variants={fadeInUp}
              className="p-6 sm:p-7 rounded-2xl bg-[#FAF8F5] border border-[#E3DFD8] flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-white border border-[#E3DFD8] text-[#1F6F5C] flex items-center justify-center mb-4 shadow-sm">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-serif font-bold text-[#1F1F1F]">
                  Internships &amp; first job
                </h3>
                <p className="text-xs sm:text-sm text-[#5F5F5F] mt-2.5 leading-relaxed">
                  Turn summer internships, live projects, and early roles into quantified bullets that pass initial recruiter screening at Indian startups and MNCs.
                </p>
              </div>
            </motion.div>

            {/* Block 3: Career transitions */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              variants={fadeInUp}
              className="p-6 sm:p-7 rounded-2xl bg-[#FAF8F5] border border-[#E3DFD8] flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-white border border-[#E3DFD8] text-[#1F6F5C] flex items-center justify-center mb-4 shadow-sm">
                  <Search className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-serif font-bold text-[#1F1F1F]">
                  Career &amp; tech switches
                </h3>
                <p className="text-xs sm:text-sm text-[#5F5F5F] mt-2.5 leading-relaxed">
                  Transitioning from IT services to product companies or moving to a new tech stack? Identify transferable skills and close vocabulary gaps.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================================
          3. WHAT YOU GET (Plain 2-Column Numbered List, No Boxes)
          ========================================================= */}
      <section className="bg-[#FAF8F5] py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={fadeInUp}
            className="mb-10 max-w-2xl"
          >
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1F1F1F]">
              What you get with every analysis
            </h2>
            <p className="text-sm text-[#5F5F5F] mt-1.5">
              What each evaluation checks and delivers.
            </p>
          </motion.div>

          {/* Plain Two-Column Numbered List Separated by Thin Lines, No Boxes or Icon Tiles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
            {/* Column 1: Items 01, 02, 03 */}
            <div className="divide-y divide-[#E3DFD8]">
              {[
                {
                  num: '01',
                  title: 'Match score out of 100',
                  desc: 'An overall percentage weighted by skills, text relevance, structure, and ATS formatting.',
                },
                {
                  num: '02',
                  title: 'Missing skills list',
                  desc: 'Specific tools, libraries, and core qualifications found in the job description that your resume omits.',
                },
                {
                  num: '03',
                  title: 'ATS formatting check',
                  desc: 'Scans for readable headings, clean contact channels, bullet length, and ATS-friendly parsing.',
                },
              ].map((item, idx) => (
                <div key={idx} className="py-5 flex items-start gap-4">
                  <span className="text-xs font-semibold text-[#1F6F5C] pt-0.5 select-none">
                    {item.num}
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-[#1F1F1F]">
                      {item.title}
                    </h3>
                    <p className="text-sm text-[#5F5F5F] mt-1 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Column 2: Items 04, 05, 06 */}
            <div className="divide-y divide-[#E3DFD8] border-t md:border-t-0 border-[#E3DFD8]">
              {[
                {
                  num: '04',
                  title: 'Rewritten bullet points',
                  desc: 'Before-and-after bullet point revisions using strong action verbs and quantified impact outcomes.',
                },
                {
                  num: '05',
                  title: 'A tailored summary',
                  desc: 'A concise opening summary written specifically to reflect the target job requirements.',
                },
                {
                  num: '06',
                  title: 'Interview questions',
                  desc: 'Targeted technical and situational questions based on identified resume skill gaps.',
                },
              ].map((item, idx) => (
                <div key={idx} className="py-5 flex items-start gap-4">
                  <span className="text-xs font-semibold text-[#1F6F5C] pt-0.5 select-none">
                    {item.num}
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-[#1F1F1F]">
                      {item.title}
                    </h3>
                    <p className="text-sm text-[#5F5F5F] mt-1 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          4. SAMPLE REPORT (With Interactive Clickable Tabs)
          ========================================================= */}
      <section id="sample-report" className="bg-white py-16 sm:py-24 border-y border-[#E3DFD8] scroll-mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={fadeInUp}
            className="mb-8"
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-[#1F6F5C]">
              Interactive Preview
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1F1F1F] mt-1.5">
              Sample evaluation report
            </h2>
            <p className="text-sm text-[#5F5F5F] mt-1">
              Sample evaluation for a Full Stack Developer resume matched against a Senior Engineer job posting.
            </p>
          </motion.div>

          <div className="bg-[#FAF8F5] border border-[#E3DFD8] rounded-2xl p-6 sm:p-8 shadow-sm">
            {/* Top Score & Breakdown */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E3DFD8] gap-4">
              <div>
                <span className="text-xs font-semibold text-[#5F5F5F] uppercase tracking-wider">
                  Target Role: Senior Full Stack Developer
                </span>
                <h3 className="text-lg font-bold text-[#1F1F1F] mt-0.5">
                  Resume Match Assessment
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-xs text-[#5F5F5F] block font-medium">Overall match</span>
                  <span className="text-xs font-semibold text-[#166534] bg-[#EEF6F1] px-2 py-0.5 rounded border border-[#166534]/20">
                    Good match
                  </span>
                </div>
                <div className="w-14 h-14 rounded-full border-4 border-[#1F6F5C] flex items-center justify-center font-serif font-bold text-lg text-[#1F1F1F] bg-white shadow-sm">
                  <CountUp to={72} duration={0.8} />%
                </div>
              </div>
            </div>

            {/* Score Progress Bars */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-b border-[#E3DFD8]">
              <div>
                <span className="text-xs text-[#5F5F5F] block font-medium">Skill match (50%)</span>
                <span className="font-semibold text-[#1F1F1F] text-base mt-1 block">68%</span>
                <div className="w-full bg-white border border-[#E3DFD8] h-2 rounded-full mt-1.5 overflow-hidden">
                  <motion.div
                    initial={shouldReduceMotion ? { width: '68%' } : { width: 0 }}
                    whileInView={{ width: '68%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55, ease: 'easeOut' }}
                    className="bg-[#1F6F5C] h-full rounded-full"
                  />
                </div>
              </div>

              <div>
                <span className="text-xs text-[#5F5F5F] block font-medium">Text relevance (25%)</span>
                <span className="font-semibold text-[#1F1F1F] text-base mt-1 block">74%</span>
                <div className="w-full bg-white border border-[#E3DFD8] h-2 rounded-full mt-1.5 overflow-hidden">
                  <motion.div
                    initial={shouldReduceMotion ? { width: '74%' } : { width: 0 }}
                    whileInView={{ width: '74%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55, delay: shouldReduceMotion ? 0 : 0.08, ease: 'easeOut' }}
                    className="bg-[#1F6F5C] h-full rounded-full"
                  />
                </div>
              </div>

              <div>
                <span className="text-xs text-[#5F5F5F] block font-medium">Structure (15%)</span>
                <span className="font-semibold text-[#1F1F1F] text-base mt-1 block">85%</span>
                <div className="w-full bg-white border border-[#E3DFD8] h-2 rounded-full mt-1.5 overflow-hidden">
                  <motion.div
                    initial={shouldReduceMotion ? { width: '85%' } : { width: 0 }}
                    whileInView={{ width: '85%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55, delay: shouldReduceMotion ? 0 : 0.16, ease: 'easeOut' }}
                    className="bg-[#1F6F5C] h-full rounded-full"
                  />
                </div>
              </div>

              <div>
                <span className="text-xs text-[#5F5F5F] block font-medium">ATS quality (10%)</span>
                <span className="font-semibold text-[#1F1F1F] text-base mt-1 block">70%</span>
                <div className="w-full bg-white border border-[#E3DFD8] h-2 rounded-full mt-1.5 overflow-hidden">
                  <motion.div
                    initial={shouldReduceMotion ? { width: '70%' } : { width: 0 }}
                    whileInView={{ width: '70%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55, delay: shouldReduceMotion ? 0 : 0.24, ease: 'easeOut' }}
                    className="bg-[#1F6F5C] h-full rounded-full"
                  />
                </div>
              </div>
            </div>

            {/* Clickable Report Tabs */}
            <div className="pt-6">
              <div className="flex items-center gap-2 border-b border-[#E3DFD8] pb-3 mb-6">
                {[
                  { id: 'skills', label: 'Skills' },
                  { id: 'ats', label: 'ATS check' },
                  { id: 'suggestions', label: 'Suggestions' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setSampleTab(tab.id)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      sampleTab === tab.id
                        ? 'bg-[#1F6F5C] text-white shadow-sm'
                        : 'bg-white text-[#5F5F5F] hover:text-[#1F1F1F] border border-[#E3DFD8]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab 1: Skills */}
              {sampleTab === 'skills' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-200">
                  <div className="p-4 bg-white rounded-xl border border-[#E3DFD8]">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#1F1F1F] flex items-center gap-1.5 mb-3">
                      <span className="w-2 h-2 rounded-full bg-[#166534]"></span>
                      Matched Skills (7 found)
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {['Python', 'React', 'TypeScript', 'PostgreSQL', 'REST APIs', 'Git', 'FastAPI'].map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center px-2.5 py-1 rounded text-xs font-medium bg-[#EEF6F1] text-[#166534] border border-[#166534]/25"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-white rounded-xl border border-[#E3DFD8]">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#1F1F1F] flex items-center gap-1.5 mb-3">
                      <span className="w-2 h-2 rounded-full bg-[#991B1B]"></span>
                      Missing Skills (4 required)
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {['Docker', 'Redis', 'AWS ECS', 'CI/CD Pipelines'].map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center px-2.5 py-1 rounded text-xs font-medium bg-[#FDF1F0] text-[#991B1B] border border-[#991B1B]/25"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: ATS Check */}
              {sampleTab === 'ats' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in duration-200">
                  {[
                    { name: 'Standard Section Headings', status: 'pass', note: 'Essential sections (Experience, Skills, Education) identified.' },
                    { name: 'Action Verbs Usage', status: 'pass', note: 'Strong verbs (Architected, Built, Optimized) lead your bullets.' },
                    { name: 'Paragraph Length', status: 'pass', note: 'All bullets are under 50 words for fast parsing.' },
                    { name: 'Quantified Metrics', status: 'warn', note: 'Only 2 out of 5 bullets include numbers or percentages.' },
                  ].map((check, idx) => (
                    <div key={idx} className="p-3.5 bg-white border border-[#E3DFD8] rounded-xl flex items-start gap-2.5 text-xs">
                      {check.status === 'pass' ? (
                        <CheckCircle2 className="w-4 h-4 text-[#166534] shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
                      )}
                      <div>
                        <strong className="text-[#1F1F1F] block">{check.name}</strong>
                        <span className="text-[#5F5F5F] mt-0.5 block">{check.note}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 3: Suggestions */}
              {sampleTab === 'suggestions' && (
                <div className="bg-white border border-[#E3DFD8] rounded-xl p-5 text-xs space-y-3 animate-in fade-in duration-200">
                  <div>
                    <span className="text-[#5F5F5F] block font-medium">Original resume bullet:</span>
                    <p className="text-[#3A3A3A] line-through opacity-80 mt-1">
                      &ldquo;Helped build backend APIs for the web platform and improved query speeds.&rdquo;
                    </p>
                  </div>
                  <div className="border-t border-[#E3DFD8] pt-3">
                    <span className="text-[#1F6F5C] font-semibold block">Suggested rewrite:</span>
                    <p className="text-[#1F1F1F] mt-1 font-medium leading-relaxed">
                      &ldquo;Architected 12 RESTful API endpoints in FastAPI and optimized PostgreSQL queries, reducing latency by 35% for 45,000 monthly active users.&rdquo;
                    </p>
                    <p className="text-[11px] text-[#5F5F5F] mt-2">
                      Why it works: Adds quantified latency reduction (35%), user scale (45k), and concrete technical stack naming.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          5. BEFORE AND AFTER (Tabs & Arrows Below Heading, Body Font)
          ========================================================= */}
      <section className="bg-[#FAF8F5] py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={fadeInUp}
            className="mb-6 max-w-2xl"
          >
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1F1F1F]">
              Before and after: Stronger bullet points
            </h2>
            <p className="text-sm text-[#5F5F5F] mt-1.5">
              See how weak duties become measurable proof of ability.
            </p>
          </motion.div>

          {/* Navigation Tabs (scrollable on phones) & Arrows below the heading */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
              {beforeAfterExamples.map((ex, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setBeforeAfterIndex(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    beforeAfterIndex === idx
                      ? 'bg-[#1F6F5C] text-white shadow-sm'
                      : 'bg-white text-[#5F5F5F] hover:text-[#1F1F1F] border border-[#E3DFD8]'
                  }`}
                >
                  {ex.role}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
              <button
                type="button"
                onClick={() =>
                  setBeforeAfterIndex((prev) => (prev > 0 ? prev - 1 : beforeAfterExamples.length - 1))
                }
                className="p-2 rounded-lg bg-white border border-[#E3DFD8] text-[#5F5F5F] hover:text-[#1F1F1F] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                aria-label="Previous example"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() =>
                  setBeforeAfterIndex((prev) => (prev < beforeAfterExamples.length - 1 ? prev + 1 : 0))
                }
                className="p-2 rounded-lg bg-white border border-[#E3DFD8] text-[#5F5F5F] hover:text-[#1F1F1F] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                aria-label="Next example"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Current Example Display: Body font (sans-serif), not monospace */}
          <div className="bg-white border border-[#E3DFD8] rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="text-xs font-semibold text-[#1F6F5C] mb-4">
              Example {beforeAfterIndex + 1} of {beforeAfterExamples.length}: {beforeAfterExamples[beforeAfterIndex].role}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Weak Version */}
              <div className="p-5 rounded-xl bg-[#FAF8F5] border border-[#E3DFD8] space-y-2">
                <span className="text-xs font-bold text-[#991B1B] uppercase tracking-wider block">
                  Weak Bullet Point
                </span>
                <p className="text-sm text-[#3A3A3A] line-through opacity-85 leading-relaxed font-sans">
                  &ldquo;{beforeAfterExamples[beforeAfterIndex].weak}&rdquo;
                </p>
                <p className="text-xs text-[#5F5F5F] pt-2">
                  Lacks specific frameworks, quantifiable metrics, and business outcome evidence.
                </p>
              </div>

              {/* Improved Version */}
              <div className="p-5 rounded-xl bg-[#EEF6F1] border border-[#166534]/30 space-y-2">
                <span className="text-xs font-bold text-[#166534] uppercase tracking-wider block">
                  Improved Bullet Point
                </span>
                <p className="text-sm text-[#1F1F1F] font-semibold leading-relaxed font-sans">
                  &ldquo;{beforeAfterExamples[beforeAfterIndex].improved}&rdquo;
                </p>
                <div className="pt-2 border-t border-[#166534]/20 text-xs text-[#166534]">
                  <strong>Why it works:</strong> {beforeAfterExamples[beforeAfterIndex].why}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          5b. WHAT PEOPLE WHO TRIED IT SAID (Simple, Human Layout)
          Only renders entries with approved: true.
          Hides completely if none are approved.
          ========================================================= */}
      {activeFeedback.length > 0 && (
        <section className="bg-white py-16 sm:py-24 border-y border-[#E3DFD8]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              variants={fadeInUp}
              className="mb-10 max-w-2xl"
            >
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1F1F1F]">
                What people who tried it said
              </h2>
              <p className="text-sm text-[#5F5F5F] mt-1.5">
                Real feedback from candidates testing ResumeCheck with their resumes.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              variants={fadeInUp}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
            >
              {/* One larger quote on the left */}
              <div className={`${activeFeedback.length > 1 ? 'lg:col-span-7' : 'lg:col-span-12'} p-6 sm:p-8 bg-[#FAF8F5] border border-[#E3DFD8] rounded-2xl shadow-sm flex flex-col justify-between`}>
                <blockquote className="text-base sm:text-lg text-[#1F1F1F] font-serif leading-relaxed italic mb-6">
                  &ldquo;{activeFeedback[0].quote}&rdquo;
                </blockquote>
                <div className="flex items-center gap-3 pt-4 border-t border-[#E3DFD8]">
                  <div className="w-8 h-8 rounded-full bg-white border border-[#E3DFD8] text-[#1F1F1F] flex items-center justify-center font-semibold text-xs shrink-0 select-none">
                    {getInitials(activeFeedback[0].name)}
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#1F1F1F] block">
                      {activeFeedback[0].name.split(' ')[0]}
                    </span>
                  </div>
                </div>
              </div>

              {/* Two smaller ones stacked on the right */}
              {activeFeedback.length > 1 && (
                <div className="lg:col-span-5 flex flex-col gap-6 justify-between">
                  {activeFeedback.slice(1, 3).map((fb, idx) => (
                    <div
                      key={idx}
                      className="p-5 sm:p-6 bg-[#FAF8F5] border border-[#E3DFD8] rounded-2xl shadow-sm flex-1 flex flex-col justify-between"
                    >
                      <blockquote className="text-xs sm:text-sm text-[#3A3A3A] font-serif leading-relaxed italic mb-4">
                        &ldquo;{fb.quote}&rdquo;
                      </blockquote>
                      <div className="flex items-center gap-2.5 pt-3 border-t border-[#E3DFD8]">
                        <div className="w-7 h-7 rounded-full bg-white border border-[#E3DFD8] text-[#1F1F1F] flex items-center justify-center font-semibold text-[11px] shrink-0 select-none">
                          {getInitials(fb.name)}
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-[#1F1F1F] block">
                            {fb.name.split(' ')[0]}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </section>
      )}

      {/* =========================================================
          6. COMMON RESUME MISTAKES (2-Column List with No Boxes)
          ========================================================= */}
      <section className="bg-[#FAF8F5] py-16 sm:py-24 border-b border-[#E3DFD8]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={fadeInUp}
            className="mb-10 max-w-2xl"
          >
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1F1F1F]">
              Common resume mistakes to avoid
            </h2>
            <p className="text-sm text-[#5F5F5F] mt-1.5">
              Six frequent issues that cause applicant tracking systems and hiring managers to reject strong profiles.
            </p>
          </motion.div>

          {/* Two-Column List, No Boxes, Consistent Row Alignment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
            {/* Column 1: Items 1, 2, 3 */}
            <div className="divide-y divide-[#E3DFD8]">
              {commonMistakes.slice(0, 3).map((item, idx) => (
                <div key={idx} className="py-5">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-5 h-5 rounded-full bg-[#991B1B]/10 text-[#991B1B] text-xs font-bold flex items-center justify-center shrink-0">
                      &times;
                    </span>
                    <h3 className="text-base font-semibold text-[#1F1F1F]">
                      {item.mistake}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-[#5F5F5F] pl-7 leading-relaxed">
                    <strong className="text-[#166534] font-medium">Fix: </strong>{item.fix}
                  </p>
                </div>
              ))}
            </div>

            {/* Column 2: Items 4, 5, 6 */}
            <div className="divide-y divide-[#E3DFD8] border-t md:border-t-0 border-[#E3DFD8]">
              {commonMistakes.slice(3, 6).map((item, idx) => (
                <div key={idx} className="py-5">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-5 h-5 rounded-full bg-[#991B1B]/10 text-[#991B1B] text-xs font-bold flex items-center justify-center shrink-0">
                      &times;
                    </span>
                    <h3 className="text-base font-semibold text-[#1F1F1F]">
                      {item.mistake}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-[#5F5F5F] pl-7 leading-relaxed">
                    <strong className="text-[#166534] font-medium">Fix: </strong>{item.fix}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          7. A SHORT NOTE FROM THE BUILDER
          ========================================================= */}
      <section className="bg-white py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={fadeInUp}
            className="bg-[#FAF8F5] border border-[#E3DFD8] rounded-2xl p-6 sm:p-10 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-6"
          >
            {/* Circular green badge showing the initials "PG" */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#1F6F5C] border-2 border-[#1F6F5C]/30 text-white flex items-center justify-center shrink-0 font-serif font-bold text-xl sm:text-2xl shadow-md tracking-wider">
              PG
            </div>

            <div className="space-y-3 flex-1">
              <p className="text-sm sm:text-base text-[#1F1F1F] leading-relaxed font-serif italic">
                &ldquo;I&apos;m Priyanshu Gupta. Tailoring a resume for every job takes a lot of guessing, and most free checkers only give a number with no explanation. I built ResumeCheck to show what is actually missing and how to fix it. It is still a work in progress, so if something looks wrong, tell me.&rdquo;
              </p>
              <div className="pt-1">
                <span className="text-xs font-semibold text-[#1F1F1F] block">Priyanshu Gupta</span>
                <span className="text-[11px] text-[#5F5F5F] block">Creator of ResumeCheck</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* =========================================================
          8. PRIVACY STRIP (Heading on one line, 3 columns, no boxes)
          ========================================================= */}
      <section className="bg-[#EEF3F0] py-16 sm:py-24 border-y border-[#1F6F5C]/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1F1F1F]">
              Your resume stays yours.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-xs sm:text-sm text-[#3A3A3A] leading-relaxed">
            <div>
              <strong className="text-[#1F1F1F] block text-sm font-semibold mb-1">
                Processed in memory
              </strong>
              <p className="text-[#5F5F5F]">
                Resumes are processed in memory and never saved to our servers.
              </p>
            </div>

            <div>
              <strong className="text-[#1F1F1F] block text-sm font-semibold mb-1">
                AI suggestions
              </strong>
              <p className="text-[#5F5F5F]">
                When AI feedback is turned on, the resume text is sent to Google&apos;s Gemini API to generate suggestions.
              </p>
            </div>

            <div>
              <strong className="text-[#1F1F1F] block text-sm font-semibold mb-1">
                Optional accounts
              </strong>
              <p className="text-[#5F5F5F]">
                Account email and a password hash are stored only if you sign up.
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[#1F6F5C]/15">
            <Link
              to="/privacy"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1F6F5C] hover:underline"
            >
              <span>Read privacy policy</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================
          9. FAQ (Two-Column Layout)
          ========================================================= */}
      <section id="faq" className="bg-[#FAF8F5] py-16 sm:py-24 scroll-mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column: Heading */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              variants={fadeInUp}
              className="lg:col-span-4 space-y-2"
            >
              <span className="text-xs font-semibold uppercase tracking-wider text-[#1F6F5C]">
                FAQ
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1F1F1F]">
                Frequently asked questions
              </h2>
              <p className="text-sm text-[#5F5F5F] leading-relaxed">
                Clear answers on how ResumeCheck evaluates resumes, handles your documents, and protects your personal privacy.
              </p>
            </motion.div>

            {/* Right Column: Accordion Questions */}
            <div className="lg:col-span-8 divide-y divide-[#E3DFD8] border-t border-[#E3DFD8]">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <motion.div
                    key={idx}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.15 }}
                    variants={fadeInUp}
                    className="py-4"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      className="w-full flex items-center justify-between text-left text-sm font-semibold text-[#1F1F1F] hover:text-[#1F6F5C] transition-colors cursor-pointer py-1"
                    >
                      <span className="pr-4">{faq.q}</span>
                      <span className="text-[#5F5F5F] shrink-0">
                        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
                          transition={{ duration: 0.25, ease: 'easeOut' }}
                          className="overflow-hidden"
                        >
                          <p className="pt-2 text-xs sm:text-sm text-[#3A3A3A] leading-relaxed pr-6">
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          10. FINAL CALL TO ACTION (Full-width band before footer)
          ========================================================= */}
      <section className="bg-white py-16 sm:py-20 border-t border-[#E3DFD8] text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-5">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={fadeInUp}
            className="text-2xl sm:text-4xl font-serif font-bold text-[#1F1F1F] tracking-tight"
          >
            Check your resume match before your next application.
          </motion.h2>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={fadeInUp}
            className="pt-2 flex flex-col items-center justify-center gap-2"
          >
            <CheckResumeButton size="lg">
              Check my resume
            </CheckResumeButton>
            <p className="text-xs text-[#5F5F5F] mt-2">
              Free. No sign-up needed.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
