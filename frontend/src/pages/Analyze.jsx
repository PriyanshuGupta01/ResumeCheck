import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Briefcase, Clock, AlertCircle, Wand2, Loader2 } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import FileUpload from '../components/FileUpload';
import Spinner from '../components/Spinner';
import PageMeta from '../components/PageMeta';
import { analyzeResume } from '../api';

const SAMPLE_JD = `Senior Full Stack Developer (React & Node.js / Python)
Company: FinTech Solutions India | Location: Bengaluru, Karnataka (Hybrid)
Compensation: ₹18 - ₹26 LPA | Experience: 3-5 Years

About the Role:
We are looking for an experienced Full Stack Developer to build high-scale financial platforms and merchant portals across India. You will collaborate with engineering teams across our Bengaluru and Pune offices.

Key Responsibilities:
- Design and develop responsive web interfaces using React, JavaScript (ES6+), TypeScript, and Tailwind CSS.
- Architect high-throughput backend microservices using Node.js, Python (FastAPI), and PostgreSQL.
- Maintain automated CI/CD pipelines using Docker, Kubernetes, and AWS (EC2, S3, RDS).
- Collaborate with agile product managers and QA engineers across Bengaluru, Hyderabad, and Pune.

Requirements:
- 3+ years of experience with React, JavaScript/TypeScript, HTML5, and modern CSS.
- Strong knowledge of RESTful APIs, microservices, and SQL databases.
- Hands-on experience with Docker, Git version control, and cloud platforms (AWS).
- Bachelor's degree (B.Tech / B.E. / BCA / MCA) or equivalent practical experience.
- Excellent analytical, problem-solving, and communication skills.`;

export default function Analyze() {
  const navigate = useNavigate();
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [yearsExperience, setYearsExperience] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const loadSampleData = async () => {
    setJobDescription(SAMPLE_JD);
    setJobTitle('Senior Full Stack Developer (Bengaluru)');
    setYearsExperience('3.5');

    try {
      const res = await fetch('/Aarav_Sharma_Resume.pdf');
      if (res.ok) {
        const blob = await res.blob();
        const sampleFile = new File([blob], 'Aarav_Sharma_Resume.pdf', { type: 'application/pdf' });
        setFile(sampleFile);
      }
    } catch {
      // If sample file fetch fails, JD is still loaded
    }
  };

  useEffect(() => {
    if (location.state?.loadSample) {
      loadSampleData();
    }
  }, [location.state]);

  const handleFillSample = () => {
    loadSampleData();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!file) {
      setErrorMessage('Please upload a resume file (.pdf or .docx).');
      return;
    }

    const trimmedJd = jobDescription.trim();
    if (trimmedJd.length < 50) {
      setErrorMessage(`Job description must be at least 50 characters long (currently ${trimmedJd.length} chars).`);
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('job_description', trimmedJd);
    if (jobTitle.trim()) {
      formData.append('job_title', jobTitle.trim());
    }
    if (yearsExperience.trim()) {
      formData.append('years_experience', yearsExperience.trim());
    }

    // Set pending analysis and navigate immediately to Results page with skeleton placeholders
    window.__PENDING_ANALYSIS_DATA__ = formData;
    navigate('/results', { state: { isLoading: true } });
  };

  const jdCharCount = jobDescription.trim().length;
  const isJdValid = jdCharCount >= 50;
  const canSubmit = file && isJdValid && !isLoading;

  const fadeInUp = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 pb-20">
      <PageMeta
        title="Resume Analysis Workspace"
        description="Upload your resume and paste a target job description to evaluate your skill match, text relevance, structure, and ATS quality."
      />
      {/* Header */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="mb-8"
      >
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5F5F5F] hover:text-[#1F1F1F] transition-colors mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-[#1F1F1F] tracking-tight">
              Resume Analysis Workspace
            </h1>
            <p className="mt-1.5 text-sm text-[#5F5F5F]">
              Upload your resume and paste the target job description to evaluate your match rating.
            </p>
          </div>

          <button
            type="button"
            onClick={handleFillSample}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-[#1F6F5C] bg-[#EAF3F0] hover:bg-[#1F6F5C]/15 border border-[#1F6F5C]/30 transition-colors self-start sm:self-auto shadow-sm cursor-pointer disabled:opacity-50"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Load Sample JD</span>
          </button>
        </div>
      </motion.div>

      {/* Error Alert with Try again */}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block mb-0.5">Analysis Notice</span>
              <span>{errorMessage}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSubmit}
              className="px-2.5 py-1 bg-red-800 text-white rounded-lg font-semibold hover:bg-red-900 transition-colors cursor-pointer"
            >
              Try again
            </button>
            <button
              type="button"
              onClick={() => setErrorMessage('')}
              className="text-red-700 hover:text-red-900 cursor-pointer font-bold px-1"
              aria-label="Dismiss error notice"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File Upload Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="p-6 sm:p-8 rounded-xl bg-white border border-[#E3DFD8] shadow-sm"
        >
          <FileUpload
            file={file}
            onFileSelect={(f) => {
              setFile(f);
              setErrorMessage('');
            }}
            onFileRemove={() => setFile(null)}
          />
        </motion.div>

        {/* Job Description Input */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="p-6 sm:p-8 rounded-xl bg-white border border-[#E3DFD8] shadow-sm space-y-4"
        >
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F1F1F]">
              Target Job Description <span className="text-[#991B1B]">*</span>
            </label>
            <span
              className={`text-[11px] font-mono font-medium ${
                isJdValid ? 'text-[#166534]' : 'text-[#5F5F5F]'
              }`}
            >
              {jdCharCount} / min 50 chars
            </span>
          </div>

          <textarea
            rows={8}
            value={jobDescription}
            disabled={isLoading}
            onChange={(e) => {
              setJobDescription(e.target.value);
              if (errorMessage) setErrorMessage('');
            }}
            placeholder="Paste the full job posting text here (responsibilities, required skills, qualifications)..."
            className="w-full p-4 rounded-xl bg-[#FAF8F5] border border-[#E3DFD8] text-sm text-[#1F1F1F] placeholder-[#5F5F5F]/70 focus:outline-none focus:border-[#1F6F5C] focus:ring-1 focus:ring-[#1F6F5C] transition-all font-sans leading-relaxed disabled:opacity-70"
          />

          {/* Optional Metadata Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#E3DFD8]">
            <div>
              <label htmlFor="target-job-title" className="block text-xs font-medium text-[#3A3A3A] mb-1.5 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-[#5F5F5F]" />
                <span>Target Role / Title (Optional)</span>
              </label>
              <input
                id="target-job-title"
                type="text"
                disabled={isLoading}
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Full Stack Developer (Bengaluru)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E3DFD8] text-xs text-[#1F1F1F] placeholder-[#5F5F5F]/70 focus:outline-none focus:border-[#1F6F5C] focus:ring-1 focus:ring-[#1F6F5C] disabled:opacity-70"
              />
            </div>

            <div>
              <label htmlFor="target-years-exp" className="block text-xs font-medium text-[#3A3A3A] mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#5F5F5F]" />
                <span>Years of Experience Required (Optional)</span>
              </label>
              <input
                id="target-years-exp"
                type="number"
                disabled={isLoading}
                min="0"
                max="40"
                step="0.5"
                value={yearsExperience}
                onChange={(e) => setYearsExperience(e.target.value)}
                placeholder="e.g. 3.5"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E3DFD8] text-xs text-[#1F1F1F] placeholder-[#5F5F5F]/70 focus:outline-none focus:border-[#1F6F5C] focus:ring-1 focus:ring-[#1F6F5C] disabled:opacity-70"
              />
            </div>
          </div>
        </motion.div>

        {/* Live Evaluation Progress Card while running */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="bg-white border border-[#E3DFD8] rounded-xl shadow-sm"
          >
            <Spinner message="Analyzing resume against target job description..." />
          </motion.div>
        )}

        {/* Action Button with Inline Spinner */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <p className="text-xs text-[#5F5F5F] text-center sm:text-left">
            Resumes are processed securely in memory and never permanently stored.
          </p>

          <button
            type="submit"
            disabled={!canSubmit}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm transition-all shadow-sm ${
              canSubmit
                ? 'bg-[#1F6F5C] hover:bg-[#185849] active:bg-[#185849] text-white cursor-pointer hover:scale-[1.01]'
                : isLoading
                ? 'bg-[#1F6F5C]/80 text-white cursor-wait'
                : 'bg-[#E3DFD8] text-[#5F5F5F] cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                <span>Evaluating Document...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Run AI Match Analysis</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
