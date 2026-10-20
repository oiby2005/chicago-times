"use client";

import React, { useState, useEffect } from "react";

export interface ExperienceItem {
  id?: string;
  role: string;
  company: string;
  duration?: string;
  startDate?: string;
  endDate?: string;
  description: string;
}

export interface EducationItem {
  id?: string;
  degree: string;
  university: string;
  duration?: string;
  startDate?: string;
  endDate?: string;
  description: string;
}

export interface PublicationItem {
  id?: string;
  title: string;
  time?: string;
  date?: string;
  description: string;
  type: "Research paper" | "Book" | string;
  link: string;
}

interface AuthorCredentialsProps {
  authorEmail?: string;
  authorName?: string;
  initialExperiences?: ExperienceItem[];
  initialEducation?: EducationItem[];
  initialPublications?: PublicationItem[];
}

/**
 * Format date range for Experience & Education.
 * If ending date is passing today's live date (or empty), end text becomes "Present".
 */
export function formatDurationRange(startDate?: string, endDate?: string, rawDuration?: string): string {
  if (!startDate && !endDate) return rawDuration || "";

  const formatMonthYear = (val?: string) => {
    if (!val) return "";
    try {
      const parts = val.split("-");
      if (parts.length >= 2) {
        const y = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10) - 1;
        const day = parts[2] ? parseInt(parts[2], 10) : 1;
        const d = new Date(y, m, day);
        if (!isNaN(d.getTime())) {
          return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
        }
      }
      const d = new Date(val);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
      }
    } catch (e) {}
    return val;
  };

  const startText = formatMonthYear(startDate);

  // Compare endDate with today's live date
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  let isFutureOrPresent = false;
  if (!endDate) {
    isFutureOrPresent = true;
  } else {
    try {
      const parts = endDate.split("-");
      const endD = parts.length >= 2
        ? new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parts[2] ? parseInt(parts[2], 10) : 1)
        : new Date(endDate);
      if (!isNaN(endD.getTime()) && endD > today) {
        isFutureOrPresent = true;
      }
    } catch (e) {}
  }

  const endText = isFutureOrPresent ? "Present" : formatMonthYear(endDate);

  if (startText && endText) return `${startText} – ${endText}`;
  if (startText) return `${startText} – Present`;
  if (endText) return endText;
  return rawDuration || "";
}

/**
 * Format publication date cleanly
 */
export function formatPublicationDate(val?: string): string {
  if (!val) return "";
  try {
    const parts = val.split("-");
    if (parts.length >= 3) {
      const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      }
    }
    const d = new Date(val);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    }
  } catch (e) {}
  return val;
}

export default function AuthorCredentialsSidebar({
  authorEmail,
  authorName,
  initialExperiences = [],
  initialEducation = [],
  initialPublications = [],
}: AuthorCredentialsProps) {
  const [experiences, setExperiences] = useState<ExperienceItem[]>(initialExperiences);
  const [education, setEducation] = useState<EducationItem[]>(initialEducation);
  const [publications, setPublications] = useState<PublicationItem[]>(initialPublications);

  const syncData = async () => {
    if (typeof window === "undefined") return;
    const cleanEmail = (authorEmail || "").toLowerCase().trim();
    const cleanName = (authorName || "").toLowerCase().trim();

    // 1. Fetch from live API
    if (cleanEmail) {
      try {
        const res = await fetch(`http://localhost:5000/api/users/${encodeURIComponent(cleanEmail)}`).catch(() => null);
        if (res && res.ok) {
          const data = await res.json();
          if (data.success && data.user) {
            const u = data.user;
            if (Array.isArray(u.experiences)) setExperiences(u.experiences);
            if (Array.isArray(u.education)) setEducation(u.education);
            if (Array.isArray(u.publications)) setPublications(u.publications);
            return;
          }
        }
      } catch (e) {}
    }

    // 2. Fallback to localStorage map
    try {
      const map = JSON.parse(localStorage.getItem("wsj_users_by_email") || "{}");
      if (cleanEmail && map[cleanEmail]) {
        const u = map[cleanEmail];
        if (Array.isArray(u.experiences)) setExperiences(u.experiences);
        if (Array.isArray(u.education)) setEducation(u.education);
        if (Array.isArray(u.publications)) setPublications(u.publications);
        return;
      }
      for (const k of Object.keys(map)) {
        const u = map[k];
        const uName = (u.full_name || u.name || "").toLowerCase().trim();
        if (cleanName && (uName === cleanName || uName.includes(cleanName) || cleanName.includes(uName))) {
          if (Array.isArray(u.experiences)) setExperiences(u.experiences);
          if (Array.isArray(u.education)) setEducation(u.education);
          if (Array.isArray(u.publications)) setPublications(u.publications);
          return;
        }
      }
    } catch (e) {}
  };

  useEffect(() => {
    syncData();
    window.addEventListener("wsj_user_updated", syncData);
    return () => window.removeEventListener("wsj_user_updated", syncData);
  }, [authorEmail, authorName]);

  const hasExperiences = experiences && experiences.length > 0;
  const hasPublications = publications && publications.length > 0;
  const hasEducation = education && education.length > 0;

  if (!hasExperiences && !hasPublications && !hasEducation) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* ================================================================= */}
      {/* 1. EXPERIENCE SECTION (LinkedIn-style connected with dots & line) */}
      {/* ================================================================= */}
      {hasExperiences && (
        <aside className="w-full bg-white border border-[#e5e7eb] rounded-xs p-5 shadow-2xs">
          {/* Header matching Most Read Articles font */}
          <div className="flex items-center justify-between border-b border-[#e5e7eb] pb-3 mb-4">
            <h3
              className="font-poppins font-sans font-bold text-xs uppercase tracking-wider text-[#111111]"
              style={{ fontFamily: "var(--font-poppins), 'Poppins', sans-serif" }}
            >
              EXPERIENCE
            </h3>
          </div>

          <div
            className="font-poppins relative pl-5 space-y-6 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-[1.5px] before:bg-gray-200"
            style={{ fontFamily: "var(--font-poppins), 'Poppins', sans-serif" }}
          >
            {experiences.map((exp, idx) => {
              const displayDuration = formatDurationRange(exp.startDate, exp.endDate, exp.duration);
              return (
                <div key={exp.id || idx} className="relative group text-left">
                  {/* Dot connected to vertical timeline line */}
                  <span className="absolute -left-5 top-1.5 w-3 h-3 rounded-full bg-gray-400 border-2 border-white ring-1 ring-gray-300 group-hover:bg-[#0077b5] transition-colors" />

                  {/* Role in Poppins font */}
                  <h4
                    className="font-poppins font-bold text-[13.5px] text-[#111111] leading-snug"
                    style={{ fontFamily: "var(--font-poppins), 'Poppins', sans-serif" }}
                  >
                    {exp.role}
                  </h4>

                  {exp.company && (
                    <div
                      className="font-poppins text-xs text-[#334155] font-semibold mt-0.5"
                      style={{ fontFamily: "var(--font-poppins), 'Poppins', sans-serif" }}
                    >
                      {exp.company}
                    </div>
                  )}

                  {displayDuration && (
                    <div
                      className="font-poppins text-[11px] text-[#64748b] font-normal mt-0.5"
                      style={{ fontFamily: "var(--font-poppins), 'Poppins', sans-serif" }}
                    >
                      {displayDuration}
                    </div>
                  )}

                  {exp.description && (
                    <p
                      className="font-poppins text-xs text-[#475569] font-normal leading-relaxed mt-2 whitespace-pre-line"
                      style={{ fontFamily: "var(--font-poppins), 'Poppins', sans-serif" }}
                    >
                      {exp.description}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </aside>
      )}

      {/* ================================================================= */}
      {/* 2. PUBLICATIONS SECTION (With ash tag, title, date, show button)  */}
      {/* ================================================================= */}
      {hasPublications && (
        <aside className="w-full bg-white border border-[#e5e7eb] rounded-xs p-5 shadow-2xs">
          {/* Header matching Most Read Articles font */}
          <div className="flex items-center justify-between border-b border-[#e5e7eb] pb-3 mb-4">
            <h3
              className="font-poppins font-sans font-bold text-xs uppercase tracking-wider text-[#111111]"
              style={{ fontFamily: "var(--font-poppins), 'Poppins', sans-serif" }}
            >
              PUBLICATIONS
            </h3>
          </div>

          <div
            className="font-poppins space-y-4 divide-y divide-gray-100"
            style={{ fontFamily: "var(--font-poppins), 'Poppins', sans-serif" }}
          >
            {publications.map((pub, idx) => {
              const displayDate = formatPublicationDate(pub.date || pub.time);
              return (
                <div key={pub.id || idx} className="pt-3.5 first:pt-0 space-y-2 text-left">
                  <div className="flex items-start justify-between gap-2">
                    {/* Publication Title in Poppins font */}
                    <h4
                      className="font-poppins font-bold text-[13.5px] text-[#111111] leading-snug"
                      style={{ fontFamily: "var(--font-poppins), 'Poppins', sans-serif" }}
                    >
                      {pub.title}
                    </h4>
                    {pub.type && (
                      <span
                        className="shrink-0 text-[10px] font-medium px-2.5 py-0.5 rounded-full bg-[#f1f5f9] text-[#475569] border border-[#cbd5e1] font-poppins"
                        style={{ fontFamily: "var(--font-poppins), 'Poppins', sans-serif" }}
                      >
                        {pub.type}
                      </span>
                    )}
                  </div>

                  {displayDate && (
                    <div
                      className="font-poppins text-[11px] text-[#64748b] font-normal"
                      style={{ fontFamily: "var(--font-poppins), 'Poppins', sans-serif" }}
                    >
                      {displayDate}
                    </div>
                  )}

                  {/* Description placed BEFORE Show Publication button */}
                  {pub.description && (
                    <p
                      className="font-poppins text-xs text-[#475569] font-normal leading-relaxed whitespace-pre-line pt-0.5"
                      style={{ fontFamily: "var(--font-poppins), 'Poppins', sans-serif" }}
                    >
                      {pub.description}
                    </p>
                  )}

                  {pub.link && (
                    <div className="pt-1">
                      <a
                        href={pub.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-poppins inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-gray-300 hover:border-black text-[11px] font-semibold text-[#111111] hover:bg-black hover:text-white transition-all cursor-pointer shadow-2xs"
                        style={{ fontFamily: "var(--font-poppins), 'Poppins', sans-serif" }}
                        title="Open publication in new tab"
                      >
                        <span>Show publication</span>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                        </svg>
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </aside>
      )}

      {/* ================================================================= */}
      {/* 3. EDUCATION SECTION (Degree, University, Duration, Description)  */}
      {/* ================================================================= */}
      {hasEducation && (
        <aside className="w-full bg-white border border-[#e5e7eb] rounded-xs p-5 shadow-2xs">
          {/* Header matching Most Read Articles font */}
          <div className="flex items-center justify-between border-b border-[#e5e7eb] pb-3 mb-4">
            <h3
              className="font-poppins font-sans font-bold text-xs uppercase tracking-wider text-[#111111]"
              style={{ fontFamily: "var(--font-poppins), 'Poppins', sans-serif" }}
            >
              EDUCATION
            </h3>
          </div>

          <div
            className="font-poppins space-y-4 divide-y divide-gray-100"
            style={{ fontFamily: "var(--font-poppins), 'Poppins', sans-serif" }}
          >
            {education.map((edu, idx) => {
              const displayDuration = formatDurationRange(edu.startDate, edu.endDate, edu.duration);
              return (
                <div key={edu.id || idx} className="pt-3.5 first:pt-0 space-y-1 text-left">
                  {/* Name of University in Poppins font */}
                  <h4
                    className="font-poppins font-bold text-[13.5px] text-[#111111] leading-snug"
                    style={{ fontFamily: "var(--font-poppins), 'Poppins', sans-serif" }}
                  >
                    {edu.university}
                  </h4>

                  {edu.degree && (
                    <div
                      className="font-poppins text-xs text-[#1e293b] font-medium"
                      style={{ fontFamily: "var(--font-poppins), 'Poppins', sans-serif" }}
                    >
                      {edu.degree}
                    </div>
                  )}

                  {displayDuration && (
                    <div
                      className="font-poppins text-[11px] text-[#64748b] font-normal"
                      style={{ fontFamily: "var(--font-poppins), 'Poppins', sans-serif" }}
                    >
                      {displayDuration}
                    </div>
                  )}

                  {edu.description && (
                    <p
                      className="font-poppins text-xs text-[#475569] font-normal leading-relaxed whitespace-pre-line pt-1"
                      style={{ fontFamily: "var(--font-poppins), 'Poppins', sans-serif" }}
                    >
                      {edu.description}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </aside>
      )}
    </div>
  );
}
