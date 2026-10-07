import React from 'react';
import {
  CheckCircle2,
  XCircle,
  Mail,
  Phone,
  Linkedin,
  Github,
  Globe,
} from 'lucide-react';

export default function StructureCard({ sections = {}, contactInfo = {} }) {
  const sectionList = [
    { key: 'contact', name: 'Contact Information' },
    { key: 'summary', name: 'Summary / Objective' },
    { key: 'skills', name: 'Skills Section' },
    { key: 'experience', name: 'Work Experience / Internships' },
    { key: 'education', name: 'Education' },
    { key: 'projects', name: 'Projects & Portfolio' },
    { key: 'certifications', name: 'Certifications' },
  ];

  const safeSections = sections || {};
  const detectedMap = safeSections.sections || {};
  const safeContact = contactInfo || {};

  // Verify contact info presence from both section detector and parsed contact details
  const isContactPresent = Boolean(
    detectedMap['contact'] ||
    detectedMap['Contact'] ||
    safeContact.email ||
    safeContact.phone ||
    safeContact.linkedin ||
    safeContact.github
  );

  // Determine item presence
  const evaluatedList = sectionList.map((sec) => {
    let present = false;
    if (sec.key === 'contact') {
      present = isContactPresent;
    } else {
      present = Boolean(detectedMap[sec.key] || detectedMap[sec.key.charAt(0).toUpperCase() + sec.key.slice(1)]);
    }
    return { ...sec, present };
  });

  const presentCount = evaluatedList.filter((s) => s.present).length;
  const totalCount = sectionList.length;

  return (
    <div className="p-6 bg-white border border-[#E3DFD8] rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-serif font-bold text-[#1F1F1F]">
            Resume Structure
          </h2>
          <p className="text-xs text-[#5F5F5F] mt-1">
            Standard sections expected by applicant tracking systems and recruiters
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full border border-[#E3DFD8] text-[#1F1F1F]">
          {presentCount} of {totalCount} found
        </span>
      </div>

      {/* Compact Checklist: No box around items, small check/cross icon plus label */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-6 py-2">
        {evaluatedList.map((sec) => (
          <div key={sec.key} className="flex items-center gap-2 text-xs py-1">
            {sec.present ? (
              <CheckCircle2 className="w-4 h-4 text-[#166534] shrink-0" />
            ) : (
              <XCircle className="w-4 h-4 text-[#DC2626] shrink-0" />
            )}
            <span className={sec.present ? 'text-[#1F1F1F] font-medium' : 'text-[#8C827A]'}>
              {sec.name}
            </span>
          </div>
        ))}
      </div>

      {/* Contact Channels Verified */}
      {(safeContact.email || safeContact.phone || safeContact.linkedin || safeContact.github) && (
        <div className="mt-4 pt-3 border-t border-[#E3DFD8] text-xs text-[#5F5F5F]">
          <span className="font-semibold text-[#1F1F1F] mr-2">Contact details found:</span>
          <span className="inline-flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
            {safeContact.email && (
              <span className="inline-flex items-center gap-1 text-[#1F1F1F]">
                <Mail className="w-3.5 h-3.5 text-[#1F6F5C]" />
                <span>{safeContact.email}</span>
              </span>
            )}
            {safeContact.phone && (
              <span className="inline-flex items-center gap-1 text-[#1F1F1F]">
                <Phone className="w-3.5 h-3.5 text-[#1F6F5C]" />
                <span>{safeContact.phone}</span>
              </span>
            )}
            {safeContact.linkedin && (
              <span className="inline-flex items-center gap-1 text-[#0A66C2]">
                <Linkedin className="w-3.5 h-3.5 text-[#0A66C2]" />
                <span>LinkedIn</span>
              </span>
            )}
            {safeContact.github && (
              <span className="inline-flex items-center gap-1 text-[#1F1F1F]">
                <Github className="w-3.5 h-3.5 text-[#1F1F1F]" />
                <span>GitHub</span>
              </span>
            )}
          </span>
        </div>
      )}
    </div>
  );
}
