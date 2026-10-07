import React from 'react';
import {
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  FileCheck,
  Mail,
  Phone,
  Linkedin,
  Github,
} from 'lucide-react';

export default function ChecklistCard({ sections = {}, contactInfo = {}, ats = {} }) {
  const sectionList = [
    { key: 'contact', name: 'Contact Information' },
    { key: 'summary', name: 'Summary / Objective' },
    { key: 'skills', name: 'Skills Section' },
    { key: 'experience', name: 'Work Experience' },
    { key: 'education', name: 'Education' },
    { key: 'projects', name: 'Projects & Portfolio' },
    { key: 'certifications', name: 'Certifications' },
  ];

  const safeSections = sections || {};
  const detectedSections = safeSections.sections || {};
  const presentCount = safeSections.present_count ?? (safeSections.present?.length || 0);

  const safeAts = ats || {};
  const atsChecks = Array.isArray(safeAts.checks) ? safeAts.checks : [];
  const safeContact = contactInfo || {};

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. Structure & Contact Checklist */}
      <div className="p-6 rounded-xl bg-white border border-[#E3DFD8] shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-serif font-bold text-[#1F1F1F] flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-[#1F6F5C]" />
              <span>Resume Structure &amp; Contact</span>
            </h3>
            <span className="text-xs font-semibold px-2.5 py-1 bg-[#EAF3F0] border border-[#1F6F5C]/30 text-[#1F6F5C] rounded-full">
              {presentCount} / 7 Sections
            </span>
          </div>

          <p className="text-xs text-[#5F5F5F] mb-5 leading-relaxed">
            Essential resume sections recognized by standard ATS parsers.
          </p>

          {/* Section list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6">
            {sectionList.map((sec) => {
              const isPresent = Boolean(detectedSections[sec.key]);
              return (
                <div
                  key={sec.key}
                  className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-xs font-medium transition-colors ${
                    isPresent
                      ? 'bg-[#EEF6F1] border-[#166534]/25 text-[#166534]'
                      : 'bg-[#FAF8F5] border-[#E3DFD8] text-[#5F5F5F]'
                  }`}
                >
                  {isPresent ? (
                    <CheckCircle2 className="w-4 h-4 text-[#166534] shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-[#5F5F5F] shrink-0" />
                  )}
                  <span className="truncate">{sec.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact info details */}
        <div className="pt-4 border-t border-[#E3DFD8]">
          <span className="text-xs font-bold uppercase tracking-wider text-[#1F1F1F] block mb-2.5">
            Contact Channels Detected
          </span>
          <div className="flex flex-wrap gap-2 text-xs">
            {contactInfo.email ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FAF8F5] border border-[#E3DFD8] text-[#1F1F1F] rounded-lg">
                <Mail className="w-3.5 h-3.5 text-[#1F6F5C]" />
                <span className="truncate max-w-[180px]">{contactInfo.email}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FDF1F0] border border-[#991B1B]/25 text-[#991B1B] rounded-lg font-medium">
                <Mail className="w-3.5 h-3.5 text-[#991B1B]" />
                <span>No Email</span>
              </span>
            )}

            {contactInfo.phone ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FAF8F5] border border-[#E3DFD8] text-[#1F1F1F] rounded-lg">
                <Phone className="w-3.5 h-3.5 text-[#1F6F5C]" />
                <span>{contactInfo.phone}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FDF1F0] border border-[#991B1B]/25 text-[#991B1B] rounded-lg font-medium">
                <Phone className="w-3.5 h-3.5 text-[#991B1B]" />
                <span>No Phone</span>
              </span>
            )}

            {contactInfo.linkedin && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FAF8F5] border border-[#E3DFD8] text-[#0A66C2] rounded-lg font-medium">
                <Linkedin className="w-3.5 h-3.5 text-[#0A66C2]" />
                <span>LinkedIn</span>
              </span>
            )}

            {contactInfo.github && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FAF8F5] border border-[#E3DFD8] text-[#1F1F1F] rounded-lg font-medium">
                <Github className="w-3.5 h-3.5 text-[#1F1F1F]" />
                <span>GitHub</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 2. ATS Compliance & Quality Checks */}
      <div className="p-6 rounded-xl bg-white border border-[#E3DFD8] shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-serif font-bold text-[#1F1F1F] flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#1F6F5C]" />
            <span>ATS Compliance Audit</span>
          </h3>
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
              ats.score >= 80
                ? 'bg-[#EEF6F1] border-[#166534]/30 text-[#166534]'
                : 'bg-amber-50 border-amber-200 text-amber-800'
            }`}
          >
            {ats.passed_count || 0} / {ats.total_checks || 7} Checks Passed
          </span>
        </div>

        <p className="text-xs text-[#5F5F5F] mb-4 leading-relaxed">
          Automated scoring checks against standard ATS filtering guidelines and best practices.
        </p>

        <div className="space-y-3">
          {atsChecks.map((chk, idx) => {
            const isPass = chk.status === 'pass';
            return (
              <div
                key={idx}
                className={`p-3 rounded-lg border text-xs transition-all ${
                  isPass
                    ? 'bg-[#EEF6F1]/50 border-[#166534]/20'
                    : 'bg-amber-50/60 border-amber-200/80'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2 font-semibold">
                    {isPass ? (
                      <CheckCircle2 className="w-4 h-4 text-[#166534] shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                    )}
                    <span className={isPass ? 'text-[#166534]' : 'text-amber-800'}>
                      {chk.name}
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#FAF8F5] border border-[#E3DFD8] text-[#5F5F5F]">
                    {chk.impact} Impact
                  </span>
                </div>
                <p className="text-[#3A3A3A] pl-6 leading-relaxed">
                  {chk.message}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
