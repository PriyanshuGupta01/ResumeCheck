import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
} from 'lucide-react';

const ONE_LINE_FIXES = {
  section_headings: 'Add standard headings: Summary, Experience, Education, and Skills.',
  contact_info: 'Add your active phone number (+91), email, and LinkedIn profile link.',
  action_verbs: 'Begin each bullet with a strong action verb (e.g. Built, Led, Architected).',
  quantified_metrics: 'Include numbers, percentages, or scale (e.g. reduced latency by 35%).',
  word_count: 'Aim for 400–800 words to fit cleanly on a 1- to 2-page standard resume.',
  biodata_check: 'Remove personal biodata like DOB, marital status, and full street address.',
  keyword_coverage: 'Add missing domain keywords from the job description into your bullets.',
};

export default function AtsAuditCard({ ats = {} }) {
  const [passedExpanded, setPassedExpanded] = useState(false);

  const safeAts = ats || {};
  const checks = Array.isArray(safeAts.checks) ? safeAts.checks : [];

  const failedOrWarn = checks.filter((c) => c.status !== 'pass');
  const passed = checks.filter((c) => c.status === 'pass');

  return (
    <div className="p-6 bg-white border border-[#E3DFD8] rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-serif font-bold text-[#1F1F1F]">
            ATS Formatting &amp; Compliance
          </h2>
          <p className="text-xs text-[#5F5F5F] mt-1">
            Automated screening checks based on standard recruitment parser guidelines
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full border border-[#E3DFD8] text-[#1F1F1F]">
          {passed.length} of {checks.length} passed
        </span>
      </div>

      {/* 1. Failed & Warning Checks (shown first with one-line fix) */}
      {failedOrWarn.length > 0 ? (
        <div className="space-y-3 mb-4">
          {failedOrWarn.map((chk, idx) => {
            const isWarn = chk.status === 'warn';
            const fix = ONE_LINE_FIXES[chk.id] || chk.fix || chk.message;

            return (
              <div
                key={chk.id || idx}
                className={`p-3.5 rounded-lg border text-xs ${
                  isWarn
                    ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                    : 'bg-white border-[#DC2626]/30 text-[#1F1F1F]'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2 font-semibold">
                    {isWarn ? (
                      <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-[#DC2626] shrink-0" />
                    )}
                    <span className={isWarn ? 'text-amber-900' : 'text-[#DC2626]'}>
                      {chk.name}
                    </span>
                  </div>
                  {chk.impact && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white border border-[#E3DFD8] text-[#5F5F5F]">
                      {chk.impact} Impact
                    </span>
                  )}
                </div>

                <p className="pl-6 text-xs text-[#3A3A3A] leading-relaxed mb-1.5">
                  {chk.message}
                </p>

                <div className="pl-6 text-xs font-medium text-[#1F1F1F]">
                  <span className="font-semibold text-amber-800">Fix: </span>
                  <span>{fix}</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-3.5 mb-4 rounded-lg bg-white border border-[#E3DFD8] text-xs text-[#166534] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#166534] shrink-0" />
          <span>All ATS compliance checks passed without warnings.</span>
        </div>
      )}

      {/* 2. Passed checks collapsed into one line */}
      {passed.length > 0 && (
        <div className="border-t border-[#E3DFD8] pt-3">
          <button
            type="button"
            onClick={() => setPassedExpanded(!passedExpanded)}
            className="w-full flex items-center justify-between text-xs font-medium text-[#5F5F5F] hover:text-[#1F1F1F] py-1 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#166534]" />
              <span>{passed.length} checks passed</span>
            </div>
            <div className="flex items-center gap-1 text-[11px]">
              <span>{passedExpanded ? 'Hide details' : 'Show details'}</span>
              {passedExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </div>
          </button>

          {passedExpanded && (
            <div className="mt-2 space-y-2 pt-2 border-t border-[#E3DFD8]/60">
              {passed.map((chk, idx) => (
                <div key={chk.id || idx} className="flex items-start gap-2 text-xs py-1 text-[#3A3A3A]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#166534] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#1F1F1F] mr-1.5">{chk.name}:</span>
                    <span className="text-[#5F5F5F]">{chk.message}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
