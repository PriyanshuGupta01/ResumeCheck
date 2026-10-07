import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Download,
  RotateCcw,
  Sparkles,
  BarChart3,
  FileText,
  ChevronDown,
  ChevronUp,
  BookmarkPlus,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Info,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import ScoreGauge from '../components/ScoreGauge';
import SkillTags from '../components/SkillTags';
import FixFirstCard from '../components/FixFirstCard';
import AtsAuditCard from '../components/AtsAuditCard';
import StructureCard from '../components/StructureCard';
import FeedbackCard from '../components/FeedbackCard';
import PageMeta from '../components/PageMeta';
import ErrorBoundary from '../components/ErrorBoundary';
import { downloadReport, saveAnalysis, analyzeResume } from '../api';
import { useAuth } from '../context/AuthContext';

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [isDownloading, setIsDownloading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [isTextExpanded, setIsTextExpanded] = useState(false);
  const [downloadError, setDownloadError] = useState('');

  // Track which score breakdown component is expanded: 'skill_match' | 'text_similarity' | 'structure_completeness' | 'ats_quality' | null
  const [expandedComponent, setExpandedComponent] = useState(null);

  const toggleComponent = (id) => {
    setExpandedComponent((prev) => (prev === id ? null : id));
  };

  const [analysisData, setAnalysisData] = useState(location.state?.analysisData || null);
  const [isLoading, setIsLoading] = useState(Boolean(location.state?.isLoading));
  const [analysisError, setAnalysisError] = useState('');

  const executeAnalysis = async () => {
    const formData = window.__PENDING_ANALYSIS_DATA__;
    if (!formData) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setAnalysisError('');
    try {
      const result = await analyzeResume(formData);
      setIsLoading(false);
      if (!result.ok) {
        setAnalysisError(result.error || 'Failed to analyze resume. Please try again.');
      } else {
        setAnalysisData(result.data);
      }
    } catch (err) {
      setIsLoading(false);
      setAnalysisError(err?.message || 'Network error occurred during analysis.');
    }
  };

  useEffect(() => {
    if (location.state?.isLoading && !analysisData) {
      executeAnalysis();
    }
  }, []);

  // Skeleton Loader while analysis is running
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-24 space-y-8 animate-pulse">
        <PageMeta title="Analyzing Document..." description="Evaluating your resume against target job criteria." />
        {/* Top bar skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E3DFD8] pb-6">
          <div className="space-y-2">
            <div className="h-4 w-28 bg-[#E3DFD8] rounded-md" />
            <div className="h-8 w-72 bg-[#E3DFD8] rounded-lg" />
            <div className="h-3 w-48 bg-[#E3DFD8] rounded-md" />
          </div>
          <div className="flex gap-3">
            <div className="h-10 w-28 bg-[#E3DFD8] rounded-xl" />
            <div className="h-10 w-36 bg-[#E3DFD8] rounded-xl" />
          </div>
        </div>

        {/* Score gauge & score bars skeleton */}
        <div className="bg-white border border-[#E3DFD8] rounded-2xl p-6 sm:p-8 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-4">
            <div className="w-40 h-40 rounded-full border-8 border-[#E3DFD8] bg-[#FAF8F5] flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-[#1F6F5C] animate-spin" />
            </div>
            <div className="h-6 w-32 bg-[#E3DFD8] rounded-full" />
            <div className="h-4 w-48 bg-[#E3DFD8] rounded-md" />
          </div>

          <div className="lg:col-span-7 space-y-5">
            <div className="h-5 w-52 bg-[#E3DFD8] rounded-md mb-4" />
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between">
                  <div className="h-4 w-36 bg-[#E3DFD8] rounded-md" />
                  <div className="h-4 w-24 bg-[#E3DFD8] rounded-md" />
                </div>
                <div className="h-3 w-full bg-[#E3DFD8] rounded-full" />
              </div>
            ))}
            <div className="h-4 w-64 bg-[#E3DFD8] rounded-md pt-2" />
          </div>
        </div>

        {/* Skills & ATS skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-[#E3DFD8] rounded-xl p-6 space-y-4">
            <div className="h-5 w-40 bg-[#E3DFD8] rounded-md" />
            <div className="flex flex-wrap gap-2 pt-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-7 w-20 bg-[#E3DFD8] rounded-lg" />
              ))}
            </div>
          </div>
          <div className="bg-white border border-[#E3DFD8] rounded-xl p-6 space-y-4">
            <div className="h-5 w-40 bg-[#E3DFD8] rounded-md" />
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-5 w-full bg-[#E3DFD8] rounded-md" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State if analysis failed with Try again button
  if (analysisError) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-5">
        <PageMeta title="Analysis Failed" description="Could not complete resume match analysis." />
        <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200 text-red-700 flex items-center justify-center mx-auto shadow-sm">
          <AlertCircle className="w-7 h-7" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-2xl font-serif font-bold text-[#1F1F1F]">Analysis Failed</h2>
          <p className="text-sm text-[#5F5F5F] max-w-md mx-auto leading-relaxed">{analysisError}</p>
        </div>
        <div className="pt-3 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={executeAnalysis}
            className="px-5 py-2.5 bg-[#1F6F5C] hover:bg-[#185849] text-white text-xs font-semibold rounded-xl transition-colors shadow-sm cursor-pointer"
          >
            Try again
          </button>
          <Link
            to="/analyze"
            className="px-5 py-2.5 bg-white hover:bg-[#FAF8F5] border border-[#E3DFD8] text-[#1F1F1F] text-xs font-semibold rounded-xl transition-colors shadow-sm"
          >
            Back to Workspace
          </Link>
        </div>
      </div>
    );
  }

  // Friendly Empty State when accessed without active data
  if (!analysisData) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <PageMeta title="No Active Analysis" description="Run a resume evaluation to view match scores." />
        <div className="w-14 h-14 rounded-2xl bg-white border border-[#E3DFD8] flex items-center justify-center mx-auto text-[#1F6F5C] mb-4 shadow-sm">
          <FileText className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-[#1F1F1F] mb-2">No Active Analysis Data</h2>
        <p className="text-sm text-[#5F5F5F] mb-6 leading-relaxed">
          Please upload a resume file and paste a target job description to generate your match score and ATS report.
        </p>
        <Link
          to="/analyze"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#1F6F5C] hover:bg-[#185849] text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
        >
          <Sparkles className="w-4 h-4" />
          <span>Go to Analysis Workspace</span>
        </Link>
      </div>
    );
  }

  const safeData = analysisData || {};
  const filename = safeData.filename || 'Resume';
  const word_count = safeData.word_count || 0;
  const extracted_text = safeData.extracted_text || '';
  const target_job = safeData.target_job || {};
  const sections = safeData.sections || {};
  const contact_info = safeData.contact_info || {};
  const skills = safeData.skills || {};
  const ats = safeData.ats || {};
  const scores = safeData.scores || {};
  const ai_feedback = safeData.ai_feedback || null;
  const is_ai_enabled = Boolean(safeData.is_ai_enabled);

  const overall_score = Number(scores.overall_score ?? 0);
  const label = scores.label || 'N/A';
  const summary = scores.summary || '';
  const sub_scores = scores.sub_scores || {};
  const weights = scores.weights || {};
  const weighted_points = scores.weighted_points || {};
  const formula_text = scores.formula_text || '';

  const matchedSkills = Array.isArray(skills.matched) ? skills.matched : [];
  const missingSkills = Array.isArray(skills.missing) ? skills.missing : [];
  const extraSkills = Array.isArray(skills.extra) ? skills.extra : [];

  const presentSections = Array.isArray(sections.present) ? sections.present : [];
  const missingSections = Array.isArray(sections.missing) ? sections.missing : [];

  const atsChecks = Array.isArray(ats.checks) ? ats.checks : [];

  // Single source of truth values
  const skillScore = sub_scores.skill_match ?? 0;
  const textScore = sub_scores.text_similarity ?? 0;
  const structureScore = sub_scores.structure_completeness ?? 0;
  const atsScore = sub_scores.ats_quality ?? 0;

  function roundTo1(val) {
    return Math.round(val * 10) / 10;
  }

  const skillPts = weighted_points.skill_match ?? roundTo1(0.50 * skillScore);
  const textPts = weighted_points.text_similarity ?? roundTo1(0.25 * textScore);
  const structurePts = weighted_points.structure_completeness ?? roundTo1(0.15 * structureScore);
  const atsPts = weighted_points.ats_quality ?? roundTo1(0.10 * atsScore);

  // Consistent 4 components
  const scoreComponents = [
    {
      id: 'skill_match',
      name: 'Skill match',
      weight: 50,
      score: skillScore,
      points: skillPts,
      maxPoints: 50.0,
      detailsTitle: 'Skills Alignment Analysis',
      explanation: `Matched ${matchedSkills.length} required skills from the job description. Missing ${missingSkills.length} key skills.`,
      content: (
        <div className="space-y-2 pt-1 text-xs">
          {matchedSkills.length > 0 && (
            <div>
              <span className="font-semibold text-[#166534] block mb-1">Found in your resume:</span>
              <div className="flex flex-wrap gap-1">
                {matchedSkills.map((s, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-[#EEF6F1] text-[#166534] border border-[#166534]/20 text-[11px]">
                    {typeof s === 'object' && s !== null ? (s.name || s.skill || '') : String(s)}
                  </span>
                ))}
              </div>
            </div>
          )}
          {missingSkills.length > 0 && (
            <div className="pt-1">
              <span className="font-semibold text-[#991B1B] block mb-1">Missing from your resume:</span>
              <div className="flex flex-wrap gap-1">
                {missingSkills.map((s, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-[#FDF1F0] text-[#991B1B] border border-[#991B1B]/20 text-[11px]">
                    {typeof s === 'object' && s !== null ? (s.name || s.skill || '') : String(s)}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'text_similarity',
      name: 'Text relevance',
      weight: 25,
      score: textScore,
      points: textPts,
      maxPoints: 25.0,
      detailsTitle: 'Vocabulary & Context Alignment',
      explanation: `Measures terminology overlap between your resume text and the job description using TF-IDF cosine similarity (${textScore}%). Keyword vocabulary coverage is ${ats.keyword_coverage_pct || textScore}%.`,
      content: (
        <div className="pt-1 text-xs text-[#5F5F5F] leading-relaxed">
          <p>
            This score evaluates natural language phrasing, technical context, and role-specific descriptions beyond standalone skill keywords.
          </p>
          <p className="mt-1 font-medium text-[#1F1F1F]">
            Tip: Mirroring exact industry phrases and responsibilities mentioned in the job posting increases this score.
          </p>
        </div>
      ),
    },
    {
      id: 'structure_completeness',
      name: 'Structure',
      weight: 15,
      score: structureScore,
      points: structurePts,
      maxPoints: 15.0,
      detailsTitle: 'Section Organization & Completeness',
      explanation: `Evaluates presence of standard resume sections: Contact, Summary/Objective, Skills, Experience, Education, Projects, Certifications.`,
      content: (
        <div className="space-y-2 pt-1 text-xs">
          <div>
            <span className="font-semibold text-[#166534] block mb-1">Sections recognized ({presentSections.length}):</span>
            <div className="flex flex-wrap gap-1">
              {presentSections.map((sec, i) => (
                <span key={i} className="px-2 py-0.5 rounded bg-[#EEF6F1] text-[#166534] border border-[#166534]/20 text-[11px]">
                  ✓ {String(sec)}
                </span>
              ))}
            </div>
          </div>
          {missingSections.length > 0 && (
            <div className="pt-1">
              <span className="font-semibold text-[#B45309] block mb-1">Optional/Missing sections ({missingSections.length}):</span>
              <div className="flex flex-wrap gap-1">
                {missingSections.map((sec, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-[#FEF6EE] text-[#B45309] border border-[#B45309]/20 text-[11px]">
                    • {String(sec)}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'ats_quality',
      name: 'ATS quality',
      weight: 10,
      score: atsScore,
      points: atsPts,
      maxPoints: 10.0,
      detailsTitle: 'Automated Screening Rule Checks',
      explanation: `Passed ${ats.passed_count || 0} of ${ats.total_checks || (atsChecks.length || 8)} standard ATS checks, including formatting, action verbs, quantified metrics, and fair screening.`,
      content: (
        <div className="space-y-1.5 pt-1 text-xs">
          {atsChecks.map((c, i) => (
            <div key={i} className="flex items-start gap-1.5 text-[11px]">
              {c.status === 'pass' ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-[#166534] shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5 text-[#D97706] shrink-0 mt-0.5" />
              )}
              <div>
                <strong className="text-[#1F1F1F]">{c.name || 'Check'}:</strong>{' '}
                <span className="text-[#5F5F5F]">{c.message || ''}</span>
              </div>
            </div>
          ))}
        </div>
      ),
    },
  ];

  const handleDownloadReport = async () => {
    setIsDownloading(true);
    setDownloadError('');
    const res = await downloadReport(analysisData);
    setIsDownloading(false);
    if (!res.ok) {
      setDownloadError(res.error || 'Failed to download report.');
    }
  };

  const handleSaveToAccount = async () => {
    if (!user) {
      navigate('/signin', { state: { from: location } });
      return;
    }

    setIsSaving(true);
    setSaveMessage('');
    const res = await saveAnalysis({
      job_title: target_job.title || filename || 'Target Job Analysis',
      score: overall_score,
      result_data: analysisData,
    });
    setIsSaving(false);

    if (res.ok) {
      setIsSaved(true);
      setSaveMessage('Analysis saved to your account!');
    } else {
      setSaveMessage(res.error || 'Failed to save analysis.');
    }
  };

  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 pt-10 pb-24 space-y-8">
      <PageMeta
        title="Evaluation Results & Match Report"
        description="Comprehensive single-source-of-truth score breakdown, missing skills, structure, and ATS quality checks."
      />
      {/* Top Navigation & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E3DFD8] pb-6">
        <div>
          <Link
            to="/analyze"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5F5F5F] hover:text-[#1F1F1F] transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Upload</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1F1F1F] tracking-tight">
            Evaluation Results & Match Report
          </h1>
          <p className="text-xs text-[#5F5F5F] mt-1 flex items-center gap-2">
            <span>File: <strong className="text-[#1F1F1F]">{filename}</strong></span>
            <span>•</span>
            <span>{word_count} words parsed</span>
            {target_job.title && (
              <>
                <span>•</span>
                <span>Role: <strong className="text-[#1F6F5C]">{target_job.title}</strong></span>
              </>
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 self-start sm:self-auto">
          {/* Analyze Another */}
          <button
            type="button"
            onClick={() => navigate('/analyze')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-white hover:bg-[#FAF8F5] border border-[#E3DFD8] rounded-xl text-xs font-semibold text-[#1F1F1F] transition-colors shadow-sm cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#5F5F5F]" />
            <span>Analyze Another</span>
          </button>

          {/* Save to Account Button (Only rendered for logged-in users; guest prompt banner handles unauthenticated users) */}
          {user && (
            <button
              type="button"
              onClick={handleSaveToAccount}
              disabled={isSaving || isSaved}
              className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-sm cursor-pointer ${
                isSaved
                  ? 'bg-[#EEF6F1] border border-[#166534]/30 text-[#166534]'
                  : 'bg-white hover:bg-[#FAF8F5] border border-[#1F6F5C] text-[#1F6F5C]'
              }`}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : isSaved ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Saved to account</span>
                </>
              ) : (
                <>
                  <BookmarkPlus className="w-3.5 h-3.5" />
                  <span>Save to my account</span>
                </>
              )}
            </button>
          )}

          {/* Download PDF */}
          <button
            type="button"
            onClick={handleDownloadReport}
            disabled={isDownloading}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1F6F5C] hover:bg-[#185849] text-white rounded-xl text-xs font-semibold transition-all shadow-sm cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isDownloading ? 'Generating PDF...' : 'Download PDF Report'}</span>
          </button>
        </div>
      </div>

      {/* Guest Sign-in Prompt Banner (Only 1 banner/button shown for guests, removing duplicate button) */}
      {!user && (
        <div className="p-4 rounded-xl bg-white border border-[#E3DFD8] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#EAF3F0] text-[#1F6F5C] flex items-center justify-center shrink-0">
              <BookmarkPlus className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#1F1F1F]">
                Want to keep this report and track your scores over time?
              </p>
              <p className="text-[11px] text-[#5F5F5F]">
                Optional accounts are 100% free. Resumes are never stored on our servers.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <Link
              to="/signin"
              state={{ from: location }}
              className="px-3 py-1.5 text-xs font-semibold text-[#1F6F5C] hover:underline"
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              state={{ from: location }}
              className="px-3.5 py-1.5 rounded-lg bg-[#1F6F5C] hover:bg-[#185849] text-white text-xs font-semibold transition-colors shadow-sm"
            >
              Create free account
            </Link>
          </div>
        </div>
      )}

      {/* Save Status Notification with Try again */}
      {saveMessage && (
        <div
          className={`p-3 rounded-xl text-xs flex items-center justify-between animate-in fade-in duration-150 ${
            isSaved
              ? 'bg-[#EEF6F1] border border-[#166534]/30 text-[#166534]'
              : 'bg-[#FDF2F2] border border-[#C0392B]/30 text-[#C0392B]'
          }`}
        >
          <div className="flex items-center gap-2">
            {isSaved ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4 shrink-0 text-[#C0392B]" />}
            <span>{saveMessage}</span>
          </div>
          <div className="flex items-center gap-2">
            {!isSaved && (
              <button
                type="button"
                onClick={handleSaveToAccount}
                className="px-2.5 py-1 bg-[#C0392B] text-white rounded-lg font-semibold hover:bg-[#A93226] transition-colors cursor-pointer"
              >
                Try again
              </button>
            )}
            <button
              type="button"
              onClick={() => setSaveMessage('')}
              className="font-bold opacity-70 hover:opacity-100 cursor-pointer px-1"
              aria-label="Dismiss notification"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* Download Error Alert with Try again */}
      {downloadError && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-700" />
            <span>{downloadError}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadReport}
              className="px-2.5 py-1 bg-red-800 text-white rounded-lg font-semibold hover:bg-red-900 transition-colors cursor-pointer"
            >
              Try again
            </button>
            <button
              type="button"
              onClick={() => setDownloadError('')}
              className="text-red-700 hover:text-red-900 font-bold px-1"
              aria-label="Dismiss error"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* Section 1: Overall Gauge & Single-Source-of-Truth Component Score Bars */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Synchronized Score Gauge */}
        <div className="lg:col-span-6 flex flex-col">
          <ScoreGauge
            score={overall_score}
            label={label}
            summary={summary}
          />
        </div>

        {/* Right: Score Breakdown with Visible Grey Tracks & Expandable Detail */}
        <div className="lg:col-span-6 p-6 rounded-xl bg-white border border-[#E3DFD8] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#E3DFD8]">
              <h2 className="text-lg font-serif font-bold text-[#1F1F1F]">
                Score Breakdown
              </h2>
              <span className="text-xs text-[#5F5F5F]">
                Click bar to inspect
              </span>
            </div>

            {/* 4 Component Bars */}
            <div className="space-y-4">
              {scoreComponents.map((comp) => {
                const isExpanded = expandedComponent === comp.id;
                // Green color family; use amber/red only if component scores under 40
                const isUnder40 = comp.score < 40;
                const barColor = isUnder40
                  ? comp.score < 25 ? 'bg-[#DC2626]' : 'bg-[#D97706]'
                  : 'bg-[#1F6F5C]';

                const pointsTextColor = isUnder40 ? 'text-[#B45309]' : 'text-[#1F6F5C]';

                return (
                  <div
                    key={comp.id}
                    className="p-2.5 rounded-lg border border-transparent hover:border-[#E3DFD8] hover:bg-[#FAF8F5] transition-all cursor-pointer"
                    onClick={() => toggleComponent(comp.id)}
                  >
                    {/* Header Row: Name, Weight, Score, and Points */}
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-[#1F1F1F]">{comp.name}</span>
                        <span className="text-xs text-[#5F5F5F] font-normal">
                          (weight {comp.weight}%)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#1F1F1F]">
                          {comp.score}/100
                        </span>
                        <span className={`text-xs font-medium ${pointsTextColor}`}>
                          ({comp.points} of {comp.maxPoints} pts)
                        </span>
                        <span className="text-[#8C827A] ml-1">
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </span>
                      </div>
                    </div>

                    {/* Horizontal Bar with Visible Grey Track and 0-100 Scale */}
                    <div className="w-full h-2.5 bg-[#E3DFD8] rounded-full overflow-hidden relative shadow-inner">
                      {/* Structure must always show bar & track, even at 0 */}
                      <div
                        style={{ width: `${Math.max(comp.score > 0 ? 3 : 0, Math.min(100, comp.score))}%` }}
                        className={`h-full rounded-full transition-all duration-700 ease-out ${barColor}`}
                      />
                    </div>

                    {/* 0-100 Scale Ticks */}
                    <div className="flex justify-between text-[10px] text-[#8C827A] mt-0.5 px-0.5 select-none">
                      <span>0</span>
                      <span>25</span>
                      <span>50</span>
                      <span>75</span>
                      <span>100</span>
                    </div>

                    {/* Clickable Component Drawer */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2, ease: 'easeOut' }}
                          className="mt-3 pt-3 border-t border-[#E3DFD8] overflow-hidden"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="p-3 bg-white rounded-lg border border-[#E3DFD8] shadow-sm">
                            <h4 className="text-xs font-bold text-[#1F1F1F] mb-1 flex items-center gap-1.5">
                              <Info className="w-3.5 h-3.5 text-[#1F6F5C]" />
                              <span>{comp.detailsTitle}</span>
                            </h4>
                            <p className="text-xs text-[#5F5F5F] leading-relaxed mb-2">
                              {comp.explanation}
                            </p>
                            {comp.content}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Plain Text Formula Display */}
          <div className="mt-5 p-3 rounded-lg bg-[#FAF8F5] border border-[#E3DFD8] text-xs text-[#5F5F5F] leading-relaxed">
            <span className="font-semibold text-[#1F1F1F] block mb-0.5">Scoring Formula:</span>
            <p className="text-xs text-[#1F1F1F]">
              {formula_text || `Overall ${overall_score} = 50% x ${skillScore} + 25% x ${textScore} + 15% x ${structureScore} + 10% x ${atsScore}`}
            </p>
          </div>
        </div>
      </div>

      {/* Section 2: Fix These First Card */}
      <FixFirstCard
        skills={skills}
        ats={ats}
        sections={sections}
      />

      {/* Section 3: Skills Card */}
      <SkillTags skills={skills} />

      {/* Section 4: ATS Card */}
      <AtsAuditCard ats={ats} />

      {/* Section 5: Structure Card */}
      <StructureCard
        sections={sections}
        contactInfo={contact_info}
      />

      {/* Section 6: AI Suggestions Card */}
      <FeedbackCard
        aiFeedback={ai_feedback}
        isAiEnabled={is_ai_enabled}
      />

      {/* Section 5: Collapsible Extracted Resume Text Preview (PRD F1) */}
      <div className="p-6 rounded-xl bg-white border border-[#E3DFD8] shadow-sm">
        <button
          type="button"
          onClick={() => setIsTextExpanded(!isTextExpanded)}
          className="w-full flex items-center justify-between text-left cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#1F6F5C]" />
            <h2 className="text-lg font-serif font-bold text-[#1F1F1F]">Extracted Resume Text Preview</h2>
            <span className="text-xs text-[#5F5F5F]">({word_count} words parsed)</span>
          </div>
          <div className="p-1 rounded-lg bg-[#FAF8F5] border border-[#E3DFD8] text-[#5F5F5F]">
            {isTextExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {isTextExpanded && (
          <div className="mt-4 pt-4 border-t border-[#E3DFD8]">
            <pre className="p-4 rounded-xl bg-white border border-[#E3DFD8] text-xs text-[#3A3A3A] font-sans overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-96">
              {extracted_text}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
