import React, { useState } from 'react';
import { AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

export default function SkillTags({ skills = {} }) {
  const [showAllMissing, setShowAllMissing] = useState(false);
  const [showAllMatched, setShowAllMatched] = useState(false);
  const [showExtra, setShowExtra] = useState(false);

  const safeSkills = skills || {};
  const normalizeList = (list) =>
    (Array.isArray(list) ? list : []).map((item) => {
      if (typeof item === 'string') return { name: item, category: 'General' };
      if (item && typeof item === 'object') {
        return {
          name: item.name || String(item.skill || item.title || ''),
          category: item.category || 'General',
        };
      }
      return { name: String(item || ''), category: 'General' };
    });

  const missing = normalizeList(safeSkills.missing);
  const matched = normalizeList(safeSkills.matched);
  const extra = normalizeList(safeSkills.extra);

  const totalRequired = matched.length + missing.length;
  const isLowSkillCount = totalRequired < 5;
  const warningMessage =
    safeSkills.warning ||
    (isLowSkillCount
      ? `We only found ${totalRequired} skills in this job description. Paste the full posting for a better result.`
      : null);

  const displayedMissing = showAllMissing ? missing : missing.slice(0, 12);
  const displayedMatched = showAllMatched ? matched : matched.slice(0, 12);

  return (
    <div className="p-6 bg-white border border-[#E3DFD8] rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-serif font-bold text-[#1F1F1F]">
            Skill Requirements &amp; Gap
          </h2>
          <p className="text-xs text-[#5F5F5F] mt-1">
            Core skills identified from the job description matched against your resume
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full border border-[#E3DFD8] text-[#1F1F1F]">
          {matched.length} of {totalRequired} skills matched
        </span>
      </div>

      {/* Warning if fewer than 5 skills detected in job description */}
      {isLowSkillCount && (
        <div className="p-3.5 mb-5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
          <span>{warningMessage}</span>
        </div>
      )}

      <div className="space-y-6">
        {/* 1. Missing Skills First */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-semibold text-[#1F1F1F]">
              Missing Skills ({missing.length})
            </span>
            <span className="text-[11px] text-[#5F5F5F]">
              Required in posting, not found in resume
            </span>
          </div>

          {missing.length > 0 ? (
            <div>
              <div className="flex flex-wrap gap-2">
                {displayedMissing.map((skill, idx) => (
                  <span
                    key={idx}
                    title={skill.category}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-sans bg-white border border-[#E3DFD8] text-[#1F1F1F] hover:border-[#DC2626] transition-colors cursor-default"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626] shrink-0" />
                    <span>{skill.name}</span>
                  </span>
                ))}
              </div>
              {missing.length > 12 && (
                <button
                  type="button"
                  onClick={() => setShowAllMissing(!showAllMissing)}
                  className="mt-2 text-xs font-semibold text-[#1F6F5C] hover:underline cursor-pointer"
                >
                  {showAllMissing ? 'Show fewer' : `Show all ${missing.length}`}
                </button>
              )}
            </div>
          ) : !isLowSkillCount ? (
            <p className="text-xs text-[#166534]">
              All core skills identified in the posting are present in your resume.
            </p>
          ) : null}
        </div>

        {/* 2. Matched Skills Second */}
        <div className="pt-4 border-t border-[#E3DFD8]">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-semibold text-[#1F1F1F]">
              Matched Skills ({matched.length})
            </span>
            <span className="text-[11px] text-[#5F5F5F]">
              Confirmed in your resume
            </span>
          </div>

          {matched.length > 0 ? (
            <div>
              <div className="flex flex-wrap gap-2">
                {displayedMatched.map((skill, idx) => (
                  <span
                    key={idx}
                    title={skill.category}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-sans bg-white border border-[#E3DFD8] text-[#1F1F1F] hover:border-[#166534] transition-colors cursor-default"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#166534] shrink-0" />
                    <span>{skill.name}</span>
                  </span>
                ))}
              </div>
              {matched.length > 12 && (
                <button
                  type="button"
                  onClick={() => setShowAllMatched(!showAllMatched)}
                  className="mt-2 text-xs font-semibold text-[#1F6F5C] hover:underline cursor-pointer"
                >
                  {showAllMatched ? 'Show fewer' : `Show all ${matched.length}`}
                </button>
              )}
            </div>
          ) : (
            <p className="text-xs text-[#5F5F5F] italic">No matching skills detected.</p>
          )}
        </div>

        {/* 3. Extra Skills Collapsed */}
        {extra.length > 0 && (
          <div className="pt-4 border-t border-[#E3DFD8]">
            <button
              type="button"
              onClick={() => setShowExtra(!showExtra)}
              className="flex items-center gap-1 text-xs font-semibold text-[#5F5F5F] hover:text-[#1F1F1F] cursor-pointer"
            >
              <span>
                {showExtra ? 'Hide extra skills' : `Show ${extra.length} more skills found in resume`}
              </span>
              {showExtra ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showExtra && (
              <div className="flex flex-wrap gap-2 mt-3">
                {extra.map((skill, idx) => (
                  <span
                    key={idx}
                    title={skill.category}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-sans bg-white border border-[#E3DFD8] text-[#5F5F5F] hover:text-[#1F1F1F] cursor-default"
                  >
                    <span>{skill.name}</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
