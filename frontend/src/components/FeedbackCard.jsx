import React from 'react';
import {
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Info,
} from 'lucide-react';

export default function FeedbackCard({ aiFeedback = null, isAiEnabled = false }) {
  if (!aiFeedback) {
    return (
      <div className="p-6 rounded-xl bg-white border border-[#E3DFD8] shadow-sm">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-[#1F6F5C] shrink-0 mt-0.5" />
          <div>
            <h2 className="text-lg font-serif font-bold text-[#1F1F1F] mb-1">
              AI Suggestions
            </h2>
            <p className="text-xs text-[#5F5F5F] leading-relaxed">
              Deterministic parsing, skill extraction, ATS compliance checks, and match scoring are fully functional. To enable AI bullet rewriting and tailored recommendations, provide a GEMINI_API_KEY in the server environment.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const safeFeedback = aiFeedback || {};
  const summary = safeFeedback.summary || '';
  const safeStrengths = Array.isArray(safeFeedback.strengths) ? safeFeedback.strengths : [];
  const safeWeaknesses = Array.isArray(safeFeedback.weaknesses) ? safeFeedback.weaknesses : [];
  const safeMissingKeywords = Array.isArray(safeFeedback.missing_keywords) ? safeFeedback.missing_keywords : [];
  const safeImprovedBullets = Array.isArray(safeFeedback.improved_bullets) ? safeFeedback.improved_bullets : [];
  const tailoredSummary = safeFeedback.tailored_summary || '';
  const safeInterviewQuestions = Array.isArray(safeFeedback.interview_questions) ? safeFeedback.interview_questions : [];

  return (
    <div className="space-y-8">
      {/* 1. AI Overview Card */}
      <div className="p-6 bg-white border border-[#E3DFD8] rounded-xl shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-serif font-bold text-[#1F1F1F]">
              AI Suggestions &amp; Analysis
            </h2>
            <p className="text-xs text-[#5F5F5F] mt-1">
              Automated feedback generated to strengthen your match against the target job
            </p>
          </div>
          <span className="text-[11px] font-medium text-[#1F6F5C] border border-[#1F6F5C]/30 px-2 py-0.5 rounded-full">
            Gemini
          </span>
        </div>

        {summary && (
          <p className="text-xs sm:text-sm text-[#1F1F1F] leading-relaxed mb-5 pb-4 border-b border-[#E3DFD8]">
            {summary}
          </p>
        )}

        {/* Strengths & Improvements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Key Strengths */}
          <div>
            <span className="text-xs font-semibold text-[#1F1F1F] flex items-center gap-1.5 mb-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#166534]" />
              <span>Strengths Identified</span>
            </span>
            <ul className="space-y-2">
              {safeStrengths.map((str, idx) => (
                <li key={idx} className="text-xs text-[#3A3A3A] flex items-start gap-2">
                  <span className="text-[#166534] mt-0.5">•</span>
                  <span>{typeof str === 'string' ? str : JSON.stringify(str)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas for Improvement */}
          <div>
            <span className="text-xs font-semibold text-[#1F1F1F] flex items-center gap-1.5 mb-2.5">
              <AlertCircle className="w-4 h-4 text-amber-700" />
              <span>Areas for Improvement</span>
            </span>
            <ul className="space-y-2">
              {safeWeaknesses.map((weak, idx) => (
                <li key={idx} className="text-xs text-[#3A3A3A] flex items-start gap-2">
                  <span className="text-amber-700 mt-0.5">•</span>
                  <span>{typeof weak === 'string' ? weak : JSON.stringify(weak)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recommended Keywords */}
        {safeMissingKeywords.length > 0 && (
          <div className="mt-5 pt-4 border-t border-[#E3DFD8]">
            <span className="text-xs font-semibold text-[#1F1F1F] block mb-2">
              Recommended Target Keywords:
            </span>
            <div className="flex flex-wrap gap-2">
              {safeMissingKeywords.map((kw, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-white border border-[#E3DFD8] text-[#1F1F1F] rounded-full text-xs font-sans"
                >
                  +{typeof kw === 'string' ? kw : kw?.name || JSON.stringify(kw)}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. Tailored Professional Summary */}
      {tailoredSummary && (
        <div className="p-6 bg-white border border-[#E3DFD8] rounded-xl shadow-sm">
          <h2 className="text-lg font-serif font-bold text-[#1F1F1F] mb-1">
            Tailored Professional Summary
          </h2>
          <p className="text-xs text-[#5F5F5F] mb-3">
            Suggested opening statement aligned with the target job responsibilities
          </p>
          <div className="p-4 rounded-lg border border-[#E3DFD8] text-xs sm:text-sm text-[#1F1F1F] leading-relaxed italic">
            &ldquo;{tailoredSummary}&rdquo;
          </div>
        </div>
      )}

      {/* 3. Rewritten Bullet Points */}
      {safeImprovedBullets.length > 0 && (
        <div className="p-6 bg-white border border-[#E3DFD8] rounded-xl shadow-sm">
          <h2 className="text-lg font-serif font-bold text-[#1F1F1F] mb-1">
            Rewritten Bullet Points
          </h2>
          <p className="text-xs text-[#5F5F5F] mb-4">
            Before-and-after bullet point revisions using strong action verbs and quantified outcomes
          </p>

          <div className="space-y-4">
            {safeImprovedBullets.map((bullet, idx) => {
              const original = typeof bullet === 'object' && bullet !== null ? bullet.original : '';
              const improved =
                typeof bullet === 'object' && bullet !== null
                  ? bullet.improved || bullet.rewrite || bullet.text
                  : String(bullet || '');
              const explanation = typeof bullet === 'object' && bullet !== null ? bullet.explanation : '';

              return (
                <div key={idx} className="p-4 rounded-lg border border-[#E3DFD8] space-y-2.5">
                  {original && (
                    <div className="text-xs">
                      <span className="font-semibold text-[#8C827A] block mb-1">Original:</span>
                      <p className="text-[#5F5F5F] line-through">{original}</p>
                    </div>
                  )}
                  <div className="text-xs">
                    <span className="font-semibold text-[#166534] block mb-1">Improved rewrite:</span>
                    <p className="text-[#1F1F1F] font-medium leading-relaxed">{improved}</p>
                  </div>
                  {explanation && (
                    <p className="text-[11px] text-[#5F5F5F] italic pt-1 border-t border-[#E3DFD8]">
                      Why: {explanation}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Target Interview Questions */}
      {safeInterviewQuestions.length > 0 && (
        <div className="p-6 bg-white border border-[#E3DFD8] rounded-xl shadow-sm">
          <h2 className="text-lg font-serif font-bold text-[#1F1F1F] mb-1">
            Targeted Interview Questions
          </h2>
          <p className="text-xs text-[#5F5F5F] mb-4">
            Likely questions based on the candidate profile and target requirements
          </p>
          <div className="space-y-2">
            {safeInterviewQuestions.map((q, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-[#3A3A3A] py-1">
                <span className="font-semibold text-[#1F1F1F]">{idx + 1}.</span>
                <p className="leading-relaxed">{typeof q === 'string' ? q : JSON.stringify(q)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
