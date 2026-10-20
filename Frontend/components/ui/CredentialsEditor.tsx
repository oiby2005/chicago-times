"use client";

import React, { useState, useEffect } from "react";
import {
  ExperienceItem,
  EducationItem,
  PublicationItem,
  formatDurationRange,
} from "@/components/author/AuthorCredentialsSidebar";

interface CredentialsEditorProps {
  experiences: ExperienceItem[];
  setExperiences: (items: ExperienceItem[]) => void;
  education: EducationItem[];
  setEducation: (items: EducationItem[]) => void;
  publications: PublicationItem[];
  setPublications: (items: PublicationItem[]) => void;
}

export default function CredentialsEditor({
  experiences,
  setExperiences,
  education,
  setEducation,
  publications,
  setPublications,
}: CredentialsEditorProps) {
  // Get today's ISO date string (YYYY-MM-DD) for max validation (disable future dates)
  const [todayIso, setTodayIso] = useState<string>("");

  useEffect(() => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    setTodayIso(`${yyyy}-${mm}-${dd}`);
  }, []);

  // 1. Experience Handlers
  const addExperience = () => {
    setExperiences([
      ...experiences,
      {
        id: `exp_${Date.now()}`,
        role: "",
        company: "",
        duration: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ]);
  };

  const updateExperience = (idx: number, field: keyof ExperienceItem, val: string) => {
    const updated = [...experiences];
    updated[idx] = { ...updated[idx], [field]: val };
    setExperiences(updated);
  };

  const updateExperienceDates = (idx: number, start?: string, end?: string) => {
    const updated = [...experiences];
    const computedDuration = formatDurationRange(start, end, updated[idx]?.duration);
    updated[idx] = {
      ...updated[idx],
      startDate: start ?? updated[idx].startDate ?? "",
      endDate: end ?? updated[idx].endDate ?? "",
      duration: computedDuration,
    };
    setExperiences(updated);
  };

  const removeExperience = (idx: number) => {
    setExperiences(experiences.filter((_, i) => i !== idx));
  };

  // 2. Publication Handlers
  const addPublication = () => {
    setPublications([
      ...publications,
      {
        id: `pub_${Date.now()}`,
        title: "",
        time: "",
        date: "",
        description: "",
        type: "Research paper",
        link: "",
      },
    ]);
  };

  const updatePublication = (idx: number, field: keyof PublicationItem, val: string) => {
    const updated = [...publications];
    updated[idx] = { ...updated[idx], [field]: val };
    setPublications(updated);
  };

  const updatePublicationDate = (idx: number, dateVal: string) => {
    const updated = [...publications];
    updated[idx] = {
      ...updated[idx],
      date: dateVal,
      time: dateVal,
    };
    setPublications(updated);
  };

  const removePublication = (idx: number) => {
    setPublications(publications.filter((_, i) => i !== idx));
  };

  // 3. Education Handlers
  const addEducation = () => {
    setEducation([
      ...education,
      {
        id: `edu_${Date.now()}`,
        degree: "",
        university: "",
        duration: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ]);
  };

  const updateEducation = (idx: number, field: keyof EducationItem, val: string) => {
    const updated = [...education];
    updated[idx] = { ...updated[idx], [field]: val };
    setEducation(updated);
  };

  const updateEducationDates = (idx: number, start?: string, end?: string) => {
    const updated = [...education];
    const computedDuration = formatDurationRange(start, end, updated[idx]?.duration);
    updated[idx] = {
      ...updated[idx],
      startDate: start ?? updated[idx].startDate ?? "",
      endDate: end ?? updated[idx].endDate ?? "",
      duration: computedDuration,
    };
    setEducation(updated);
  };

  const removeEducation = (idx: number) => {
    setEducation(education.filter((_, i) => i !== idx));
  };

  return (
    <div
      className="space-y-6 pt-2 font-poppins"
      style={{ fontFamily: "var(--font-poppins), 'Poppins', sans-serif" }}
    >
      {/* ================================================================= */}
      {/* A. EXPERIENCE SECTION                                            */}
      {/* ================================================================= */}
      <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/70 space-y-3.5">
        <div className="flex items-center justify-between">
          <label className="font-poppins text-xs font-bold text-[#0f172a] uppercase tracking-wider">
            EXPERIENCE
          </label>
          <button
            type="button"
            onClick={addExperience}
            className="font-poppins text-xs font-bold text-[#005a9c] hover:text-[#004070] bg-white border border-[#cbd5e1] hover:border-[#005a9c] px-3 py-1 rounded-xl transition-all cursor-pointer shadow-2xs"
          >
            + Add Experience
          </button>
        </div>

        {experiences.length === 0 ? (
          <p className="font-poppins text-xs text-slate-400 italic">No experiences added yet.</p>
        ) : (
          <div className="space-y-3">
            {experiences.map((exp, idx) => {
              const activeDuration = formatDurationRange(exp.startDate, exp.endDate, exp.duration);
              return (
                <div
                  key={exp.id || idx}
                  className="bg-white border border-slate-200 rounded-xl p-3 space-y-2.5 shadow-2xs relative font-poppins"
                >
                  <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                    <span className="font-poppins text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      Position #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeExperience(idx)}
                      className="font-poppins text-red-500 hover:text-red-700 font-bold text-xs cursor-pointer p-0.5"
                      title="Remove experience"
                    >
                      ✕ Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[10px] font-poppins font-bold text-slate-500 uppercase mb-1">
                        Role / Position
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Senior Editor / Columnist"
                        value={exp.role}
                        onChange={(e) => updateExperience(idx, "role", e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs font-poppins text-slate-900 focus:outline-none focus:border-[#005a9c]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-poppins font-bold text-slate-500 uppercase mb-1">
                        Company / Organization
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Times Chicago LLC"
                        value={exp.company}
                        onChange={(e) => updateExperience(idx, "company", e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs font-poppins text-slate-900 focus:outline-none focus:border-[#005a9c]"
                      />
                    </div>
                  </div>

                  {/* Duration: Start Date & End Date Calendars */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[10px] font-poppins font-bold text-slate-500 uppercase">
                        Duration
                      </label>
                      {activeDuration && (
                        <span className="font-poppins text-[10px] font-semibold text-[#005a9c] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                          {activeDuration}
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <span className="block text-[9px] text-slate-400 font-poppins mb-0.5">STARTING DATE</span>
                        <input
                          type="date"
                          value={exp.startDate || ""}
                          onChange={(e) => updateExperienceDates(idx, e.target.value, exp.endDate)}
                          className="w-full px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs font-poppins text-slate-900 focus:outline-none focus:border-[#005a9c] cursor-pointer"
                        />
                      </div>
                      <div>
                        <span className="block text-[9px] text-slate-400 font-poppins mb-0.5">ENDING DATE (FUTURE = PRESENT)</span>
                        <input
                          type="date"
                          value={exp.endDate || ""}
                          onChange={(e) => updateExperienceDates(idx, exp.startDate, e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs font-poppins text-slate-900 focus:outline-none focus:border-[#005a9c] cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-poppins font-bold text-slate-500 uppercase mb-1">
                      Description
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Brief description of responsibilities and achievements..."
                      value={exp.description}
                      onChange={(e) => updateExperience(idx, "description", e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs font-poppins text-slate-900 focus:outline-none focus:border-[#005a9c] resize-none"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ================================================================= */}
      {/* B. PUBLICATIONS SECTION                                          */}
      {/* ================================================================= */}
      <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/70 space-y-3.5">
        <div className="flex items-center justify-between">
          <label className="font-poppins text-xs font-bold text-[#0f172a] uppercase tracking-wider">
            PUBLICATIONS
          </label>
          <button
            type="button"
            onClick={addPublication}
            className="font-poppins text-xs font-bold text-[#005a9c] hover:text-[#004070] bg-white border border-[#cbd5e1] hover:border-[#005a9c] px-3 py-1 rounded-xl transition-all cursor-pointer shadow-2xs"
          >
            + Add Publication
          </button>
        </div>

        {publications.length === 0 ? (
          <p className="font-poppins text-xs text-slate-400 italic">No publications added yet.</p>
        ) : (
          <div className="space-y-3">
            {publications.map((pub, idx) => (
              <div
                key={pub.id || idx}
                className="bg-white border border-slate-200 rounded-xl p-3 space-y-2.5 shadow-2xs relative font-poppins"
              >
                <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                  <span className="font-poppins text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    Publication #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removePublication(idx)}
                    className="font-poppins text-red-500 hover:text-red-700 font-bold text-xs cursor-pointer p-0.5"
                    title="Remove publication"
                  >
                    ✕ Remove
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-poppins font-bold text-slate-500 uppercase mb-1">
                      Publication Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Trapped Online: The Dark Side of the Screen"
                      value={pub.title}
                      onChange={(e) => updatePublication(idx, "title", e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs font-poppins text-slate-900 focus:outline-none focus:border-[#005a9c]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-poppins font-bold text-slate-500 uppercase mb-1">
                      Type (Choose)
                    </label>
                    <select
                      value={pub.type || "Research paper"}
                      onChange={(e) => updatePublication(idx, "type", e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs font-poppins text-slate-900 focus:outline-none focus:border-[#005a9c] cursor-pointer"
                    >
                      <option value="Research paper">Research paper</option>
                      <option value="Book">Book</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-poppins font-bold text-slate-500 uppercase mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      max={todayIso || undefined}
                      value={pub.date || pub.time || ""}
                      onChange={(e) => updatePublicationDate(idx, e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs font-poppins text-slate-900 focus:outline-none focus:border-[#005a9c] cursor-pointer"
                    />
                    <span className="block text-[9px] text-slate-400 mt-0.5 font-poppins">
                      Dates must be on or before today (future dates disabled).
                    </span>
                  </div>
                  <div>
                    <label className="block text-[10px] font-poppins font-bold text-slate-500 uppercase mb-1">
                      Publication Link
                    </label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={pub.link}
                      onChange={(e) => updatePublication(idx, "link", e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs font-poppins text-slate-900 focus:outline-none focus:border-[#005a9c]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-poppins font-bold text-slate-500 uppercase mb-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Brief description or summary of the publication..."
                    value={pub.description}
                    onChange={(e) => updatePublication(idx, "description", e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs font-poppins text-slate-900 focus:outline-none focus:border-[#005a9c] resize-none"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================================================================= */}
      {/* C. EDUCATION SECTION                                             */}
      {/* ================================================================= */}
      <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/70 space-y-3.5">
        <div className="flex items-center justify-between">
          <label className="font-poppins text-xs font-bold text-[#0f172a] uppercase tracking-wider">
            EDUCATION
          </label>
          <button
            type="button"
            onClick={addEducation}
            className="font-poppins text-xs font-bold text-[#005a9c] hover:text-[#004070] bg-white border border-[#cbd5e1] hover:border-[#005a9c] px-3 py-1 rounded-xl transition-all cursor-pointer shadow-2xs"
          >
            + Add Education
          </button>
        </div>

        {education.length === 0 ? (
          <p className="font-poppins text-xs text-slate-400 italic">No education added yet.</p>
        ) : (
          <div className="space-y-3">
            {education.map((edu, idx) => {
              const activeDuration = formatDurationRange(edu.startDate, edu.endDate, edu.duration);
              return (
                <div
                  key={edu.id || idx}
                  className="bg-white border border-slate-200 rounded-xl p-3 space-y-2.5 shadow-2xs relative font-poppins"
                >
                  <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                    <span className="font-poppins text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      Education #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeEducation(idx)}
                      className="font-poppins text-red-500 hover:text-red-700 font-bold text-xs cursor-pointer p-0.5"
                      title="Remove education"
                    >
                      ✕ Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[10px] font-poppins font-bold text-slate-500 uppercase mb-1">
                        Degree
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Master of Science in Film & TV Production"
                        value={edu.degree}
                        onChange={(e) => updateEducation(idx, "degree", e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs font-poppins text-slate-900 focus:outline-none focus:border-[#005a9c]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-poppins font-bold text-slate-500 uppercase mb-1">
                        University / Institution
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Lovely Professional University"
                        value={edu.university}
                        onChange={(e) => updateEducation(idx, "university", e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs font-poppins text-slate-900 focus:outline-none focus:border-[#005a9c]"
                      />
                    </div>
                  </div>

                  {/* Duration: Start Date & End Date Calendars */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[10px] font-poppins font-bold text-slate-500 uppercase">
                        Duration
                      </label>
                      {activeDuration && (
                        <span className="font-poppins text-[10px] font-semibold text-[#005a9c] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                          {activeDuration}
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <span className="block text-[9px] text-slate-400 font-poppins mb-0.5">STARTING DATE</span>
                        <input
                          type="date"
                          value={edu.startDate || ""}
                          onChange={(e) => updateEducationDates(idx, e.target.value, edu.endDate)}
                          className="w-full px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs font-poppins text-slate-900 focus:outline-none focus:border-[#005a9c] cursor-pointer"
                        />
                      </div>
                      <div>
                        <span className="block text-[9px] text-slate-400 font-poppins mb-0.5">ENDING DATE (FUTURE = PRESENT)</span>
                        <input
                          type="date"
                          value={edu.endDate || ""}
                          onChange={(e) => updateEducationDates(idx, edu.startDate, e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs font-poppins text-slate-900 focus:outline-none focus:border-[#005a9c] cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-poppins font-bold text-slate-500 uppercase mb-1">
                      Description
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Grade: Gold Medalist / GPA..."
                      value={edu.description}
                      onChange={(e) => updateEducation(idx, "description", e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs font-poppins text-slate-900 focus:outline-none focus:border-[#005a9c] resize-none"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
