import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function FixFirstCard({ skills = {}, ats = {}, sections = {} }) {
  const missingSkills = Array.isArray(skills.missing) ? skills.missing : [];
  const atsChecks = Array.isArray(ats.checks) ? ats.checks : [];
  const missingSections = Array.isArray(sections.missing) ? sections.missing : [];

  // Issue 1: Top missing skills
  let skillIssue = 'All primary skills required by the job posting are covered in your resume.';
  let skillOk = true;
  if (missingSkills.length > 0) {
    const topNames = missingSkills
      .slice(0, 3)
      .map((s) => (typeof s === 'string' ? s : s.name))
      .filter(Boolean)
      .join(', ');
    skillIssue = `Add key missing skills requested in the job description: ${topNames}.`;
    skillOk = false;
  } else if (skills.warning) {
    skillIssue = skills.warning;
    skillOk = false;
  }

  // Issue 2: Failed high-impact ATS checks
  const highImpactFail = atsChecks.find(
    (c) => c.status !== 'pass' && c.impact === 'High'
  );
  const anyFail = atsChecks.find((c) => c.status !== 'pass');
  const targetAtsFail = highImpactFail || anyFail;

  let atsIssue = 'ATS formatting checks passed with clear headings and standard document structure.';
  let atsOk = true;
  if (targetAtsFail) {
    atsIssue = `Fix ATS formatting issue: ${targetAtsFail.message || targetAtsFail.name}.`;
    atsOk = false;
  }

  // Issue 3: Missing sections
  let sectionIssue = 'All essential sections (Contact, Experience, Education, and Skills) are clearly recognized.';
  let sectionOk = true;
  if (missingSections.length > 0) {
    const topMissing = missingSections.slice(0, 3).join(', ');
    sectionIssue = `Add standard resume sections to improve completeness: ${topMissing}.`;
    sectionOk = false;
  }

  const issues = [
    { title: 'Skills gap', text: skillIssue, ok: skillOk },
    { title: 'ATS screening', text: atsIssue, ok: atsOk },
    { title: 'Resume sections', text: sectionIssue, ok: sectionOk },
  ];

  return (
    <div className="p-6 bg-white border border-[#E3DFD8] rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-serif font-bold text-[#1F1F1F]">
          Fix these first
        </h2>
        <span className="text-xs text-[#5F5F5F]">Top 3 priority actions</span>
      </div>

      <div className="space-y-3">
        {issues.map((item, idx) => (
          <div key={idx} className="flex items-start gap-3 text-xs leading-relaxed text-[#3A3A3A]">
            <span className="w-5 h-5 rounded-full bg-[#FAF8F5] border border-[#E3DFD8] text-[#1F1F1F] font-semibold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
              {idx + 1}
            </span>
            <div className="flex-1">
              <span className="font-semibold text-[#1F1F1F] mr-1.5">{item.title}:</span>
              <span>{item.text}</span>
            </div>
            {item.ok ? (
              <CheckCircle2 className="w-4 h-4 text-[#166534] shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
