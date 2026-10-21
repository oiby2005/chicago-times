"use client";

import React, { useState, useEffect, useRef } from "react";
import { convertFileToWebP } from "@/lib/webpConverter";
import { slugifyAuthorName } from "@/data/authors";
import { getAuthHeaders } from "@/lib/authHeader";

import { ExperienceItem, EducationItem, PublicationItem } from "@/components/author/AuthorCredentialsSidebar";
import CredentialsEditor from "@/components/ui/CredentialsEditor";

export interface UserProfile {
  id?: number | string;
  full_name?: string;
  name?: string;
  displayName?: string;
  username?: string;
  email: string;
  role: string;
  writer_type?: string;
  bio?: string;
  linkedin?: string;
  country?: string;
  phone?: string;
  avatar_url?: string;
  is_default_admin?: boolean;
  is_blocked?: boolean;
  experiences?: ExperienceItem[];
  education?: EducationItem[];
  publications?: PublicationItem[];
  issued_date?: string;
  press_id?: string;
}

export interface CountryPhoneConfig {
  name: string;
  dialCode: string;
  maxDigits: number;
  placeholder: string;
}

export const COUNTRY_PHONE_CONFIGS: CountryPhoneConfig[] = [
  { name: "United States", dialCode: "+1", maxDigits: 10, placeholder: "555 123 4567" },
  { name: "United Kingdom", dialCode: "+44", maxDigits: 10, placeholder: "7911 123456" },
  { name: "Canada", dialCode: "+1", maxDigits: 10, placeholder: "555 123 4567" },
  { name: "Australia", dialCode: "+61", maxDigits: 9, placeholder: "412 345 678" },
  { name: "Germany", dialCode: "+49", maxDigits: 11, placeholder: "151 12345678" },
  { name: "France", dialCode: "+33", maxDigits: 9, placeholder: "6 12 34 56 78" },
  { name: "India", dialCode: "+91", maxDigits: 10, placeholder: "98765 43210" },
  { name: "Japan", dialCode: "+81", maxDigits: 10, placeholder: "90 1234 5678" },
  { name: "China", dialCode: "+86", maxDigits: 11, placeholder: "138 0013 8000" },
  { name: "Brazil", dialCode: "+55", maxDigits: 11, placeholder: "11 91234 5678" },
  { name: "Mexico", dialCode: "+52", maxDigits: 10, placeholder: "55 1234 5678" },
  { name: "Italy", dialCode: "+39", maxDigits: 10, placeholder: "320 123 4567" },
  { name: "Spain", dialCode: "+34", maxDigits: 9, placeholder: "612 34 56 78" },
  { name: "Netherlands", dialCode: "+31", maxDigits: 9, placeholder: "6 12345678" },
  { name: "Switzerland", dialCode: "+41", maxDigits: 9, placeholder: "79 123 45 67" },
  { name: "Sweden", dialCode: "+46", maxDigits: 9, placeholder: "70 123 45 67" },
  { name: "Singapore", dialCode: "+65", maxDigits: 8, placeholder: "8123 4567" },
  { name: "South Korea", dialCode: "+82", maxDigits: 10, placeholder: "10 1234 5678" },
  { name: "United Arab Emirates", dialCode: "+971", maxDigits: 9, placeholder: "50 123 4567" },
  { name: "Saudi Arabia", dialCode: "+966", maxDigits: 9, placeholder: "50 123 4567" },
  { name: "South Africa", dialCode: "+27", maxDigits: 9, placeholder: "71 123 4567" },
  { name: "New Zealand", dialCode: "+64", maxDigits: 9, placeholder: "21 123 4567" },
  { name: "Ireland", dialCode: "+353", maxDigits: 9, placeholder: "85 123 4567" },
  { name: "Norway", dialCode: "+47", maxDigits: 8, placeholder: "412 34 567" },
  { name: "Denmark", dialCode: "+45", maxDigits: 8, placeholder: "20 12 34 56" },
  { name: "Finland", dialCode: "+358", maxDigits: 10, placeholder: "40 123 4567" },
  { name: "Belgium", dialCode: "+32", maxDigits: 9, placeholder: "470 12 34 56" },
  { name: "Austria", dialCode: "+43", maxDigits: 10, placeholder: "664 1234567" },
  { name: "Poland", dialCode: "+48", maxDigits: 9, placeholder: "512 345 678" },
  { name: "Portugal", dialCode: "+351", maxDigits: 9, placeholder: "912 345 678" },
  { name: "Greece", dialCode: "+30", maxDigits: 10, placeholder: "691 234 5678" },
  { name: "Argentina", dialCode: "+54", maxDigits: 10, placeholder: "11 1234 5678" },
  { name: "Chile", dialCode: "+56", maxDigits: 9, placeholder: "9 1234 5678" },
  { name: "Colombia", dialCode: "+57", maxDigits: 10, placeholder: "300 123 4567" },
  { name: "Egypt", dialCode: "+20", maxDigits: 10, placeholder: "100 123 4567" },
  { name: "Indonesia", dialCode: "+62", maxDigits: 11, placeholder: "812 3456 7890" },
  { name: "Israel", dialCode: "+972", maxDigits: 9, placeholder: "50 123 4567" },
  { name: "Malaysia", dialCode: "+60", maxDigits: 10, placeholder: "12 345 6789" },
  { name: "Nigeria", dialCode: "+234", maxDigits: 10, placeholder: "802 123 4567" },
  { name: "Pakistan", dialCode: "+92", maxDigits: 10, placeholder: "300 1234567" },
  { name: "Philippines", dialCode: "+63", maxDigits: 10, placeholder: "917 123 4567" },
  { name: "Qatar", dialCode: "+974", maxDigits: 8, placeholder: "3312 3456" },
  { name: "Sri Lanka", dialCode: "+94", maxDigits: 9, placeholder: "77 123 4567" },
  { name: "Thailand", dialCode: "+66", maxDigits: 9, placeholder: "81 234 5678" },
  { name: "Turkey", dialCode: "+90", maxDigits: 10, placeholder: "532 123 4567" },
  { name: "Vietnam", dialCode: "+84", maxDigits: 9, placeholder: "91 234 5678" },
  { name: "Other", dialCode: "+1", maxDigits: 15, placeholder: "123456789" },
];

const COUNTRIES_LIST = COUNTRY_PHONE_CONFIGS.map((c) => c.name);

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onSave?: (updatedUser: UserProfile) => void;
}

export const ProfileSettingsModal: React.FC<ProfileSettingsModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSave,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state initialized with fallback defaults matching screenshot
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("United States");
  const [countryDialCode, setCountryDialCode] = useState("+1");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState("READER");
  const [bio, setBio] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [education, setEducation] = useState<EducationItem[]>([]);
  const [publications, setPublications] = useState<PublicationItem[]>([]);
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setIsSaving(false);
    if (currentUser) {
      setFullName(currentUser.full_name || currentUser.name || "User");
      setEmail(currentUser.email || "user@gmail.com");
      const initCountry = currentUser.country || (currentUser as any).country || "United States";
      setCountry(initCountry);

      const rawPhone = String(currentUser.phone || (currentUser as any).mobile || "").trim();
      let matchedDial = "+1";
      let digits = "";

      if (rawPhone.startsWith("+")) {
        const sortedConfigs = [...COUNTRY_PHONE_CONFIGS].sort((a, b) => b.dialCode.length - a.dialCode.length);
        const found = sortedConfigs.find((c) => rawPhone.startsWith(c.dialCode));
        if (found) {
          matchedDial = found.dialCode;
          digits = rawPhone.slice(found.dialCode.length).replace(/\D/g, "").slice(0, found.maxDigits);
        } else {
          digits = rawPhone.replace(/\D/g, "").slice(0, 15);
        }
      } else {
        matchedDial = "+1";
        digits = rawPhone.replace(/\D/g, "").slice(0, 15);
      }

      setCountryDialCode(matchedDial);
      setPhoneNumber(digits);
      setRole((currentUser.role || "READER").toUpperCase());
      setBio(currentUser.bio || "News Enthusiast");
      setLinkedin(currentUser.linkedin || "");
      setAvatarUrl(currentUser.avatar_url || "");
      setExperiences(Array.isArray(currentUser.experiences) ? currentUser.experiences : []);
      setEducation(Array.isArray(currentUser.education) ? currentUser.education : []);
      setPublications(Array.isArray(currentUser.publications) ? currentUser.publications : []);
    } else {
      setFullName("User");
      setEmail("user@gmail.com");
      setCountry("United States");
      setCountryDialCode("+1");
      setPhoneNumber("");
      setRole("READER");
      setBio("News Enthusiast");
      setLinkedin("");
      setAvatarUrl("");
      setExperiences([]);
      setEducation([]);
      setPublications([]);
    }
  }, [currentUser, isOpen]);

  const effectiveRole = (currentUser?.role || role || "").toLowerCase().trim();
  const isAdminOrReader = effectiveRole === "admin" || effectiveRole === "reader";

  // Strictly ONLY for Staff Writer or Contributor. Admin and Reader MUST NEVER be true!
  const isStaffOrContributor =
    !isAdminOrReader &&
    (effectiveRole === "writer" ||
      effectiveRole === "staff writer" ||
      effectiveRole === "contributor" ||
      (currentUser?.writer_type === "contributor" || currentUser?.writer_type === "staff"));

  const activePhoneConfig =
    COUNTRY_PHONE_CONFIGS.find((c) => c.dialCode === countryDialCode) ||
    COUNTRY_PHONE_CONFIGS[0];

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers (strictly strip any letters/symbols)
    const rawDigits = e.target.value.replace(/\D/g, "");
    // Do not allow entering more numbers than allowed for the selected country code
    const limited = rawDigits.slice(0, activePhoneConfig.maxDigits);
    setPhoneNumber(limited);
  };

  const handleDialCodeChange = (newCode: string) => {
    setCountryDialCode(newCode);
    const cfg = COUNTRY_PHONE_CONFIGS.find((c) => c.dialCode === newCode) || COUNTRY_PHONE_CONFIGS[0];
    setPhoneNumber((prev) => prev.slice(0, cfg.maxDigits));
    // Separate: DO NOT change country dropdown!
  };

  const handleCountryChange = (newCountry: string) => {
    setCountry(newCountry);
    // Separate: DO NOT change country dial code!
  };

  if (!isOpen) return null;

  // Calculate initials for avatar box (e.g. "oshidi yapa" -> "OY")
  const getInitials = (name: string) => {
    if (!name) return "OY";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const initials = getInitials(fullName);

  // File upload handler for "Change photo"
  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const webpUrl = await convertFileToWebP(file);
      if (webpUrl) {
        setAvatarUrl(webpUrl);
      }
    }
  };

  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);

    const fullPhone = isStaffOrContributor && phoneNumber.trim()
      ? `${countryDialCode} ${phoneNumber.trim()}`
      : (isStaffOrContributor ? "" : (currentUser?.phone || ""));

    const updatedUser: UserProfile = {
      ...(currentUser || {}),
      full_name: fullName,
      email: email,
      role: role.toLowerCase(),
      bio: bio,
      linkedin: linkedin,
      country: country,
      phone: fullPhone,
      avatar_url: avatarUrl,
      experiences: isStaffOrContributor ? experiences : (currentUser?.experiences || []),
      education: isStaffOrContributor ? education : (currentUser?.education || []),
      publications: isStaffOrContributor ? publications : (currentUser?.publications || []),
    };

    // 1. Immediately apply to active session & trigger instant UI updates
    try {
      localStorage.removeItem("wsj_user");
      sessionStorage.setItem("wsj_user", JSON.stringify(updatedUser));
    } catch (e) {}

    // Broadcast user update event across all components instantly
    window.dispatchEvent(new Event("wsj_user_updated"));
    try {
      const channel = new BroadcastChannel("wsj_user_sync");
      channel.postMessage({ type: "USER_UPDATED", email });
      channel.close();
    } catch (e) {}

    if (onSave) {
      onSave(updatedUser);
    }

    onClose();

    // 2. Persist to Express Backend API & MySQL in background
    try {
      const prevName = currentUser?.full_name || (currentUser as any)?.name || "";
      const prevEmail = currentUser?.email || email;
      const res = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: getAuthHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({ ...updatedUser, old_full_name: prevName, old_email: prevEmail }),
      });
      if (res.ok) {
        const resData = await res.json();
        if (resData.success && resData.user) {
          const finalAvatar = resData.user.avatar_url !== undefined && resData.user.avatar_url !== null ? resData.user.avatar_url : avatarUrl;
          const finalUser = { ...updatedUser, ...resData.user, avatar_url: finalAvatar };
          sessionStorage.setItem("wsj_user", JSON.stringify(finalUser));
          localStorage.removeItem("wsj_user");
          window.dispatchEvent(new Event("wsj_user_updated"));
          try {
            const channel = new BroadcastChannel("wsj_user_sync");
            channel.postMessage({ type: "USER_UPDATED", email });
            channel.close();
          } catch (e) {}
        }
      }
    } catch (e) {}

    // Update posts created by this specific user and push to API
    try {
      const prevName = (currentUser?.full_name || (currentUser as any)?.name || "").toLowerCase().trim();
      const updatePostsAuthor = (key: string) => {
        const raw = localStorage.getItem(key);
        if (raw) {
          const list = JSON.parse(raw);
          if (Array.isArray(list)) {
            const updatedList = list.map((p: any) => {
              const pEmail = (p.authorEmail || "").toLowerCase().trim();
              const pAuthor = (p.author || "").toLowerCase().trim();
              if (
                (email && pEmail === email.toLowerCase().trim()) ||
                (prevName && (pAuthor === prevName || pAuthor.includes(prevName))) ||
                (email === "writer@gmail.com" && pAuthor === "writer user") ||
                pAuthor === "writer user"
              ) {
                return {
                  ...p,
                  author: fullName,
                  authorEmail: email || p.authorEmail,
                  authorImage: avatarUrl || p.authorImage,
                  authorAvatar: avatarUrl || p.authorAvatar,
                };
              }
              return p;
            });
            localStorage.setItem(key, JSON.stringify(updatedList));
            return updatedList;
          }
        }
        return null;
      };

      const updatedPosts = updatePostsAuthor("wsj_posts");
      updatePostsAuthor("wsj_published_posts");
      window.dispatchEvent(new Event("wsj_posts_updated"));

      if (updatedPosts && updatedPosts.length > 0) {
        fetch("http://localhost:5000/api/posts", {
          method: "POST",
          headers: getAuthHeaders({ "Content-Type": "application/json" }),
          body: JSON.stringify(updatedPosts),
        }).catch(() => {});
      }
    } catch (e) {}

    // Persist to stored accounts list
    try {
      const storedAccounts = localStorage.getItem("wsj_accounts");
      if (storedAccounts) {
        const accounts = JSON.parse(storedAccounts);
        const idx = accounts.findIndex((a: any) => 
          a.email && a.email.toLowerCase() === email.toLowerCase()
        );
        if (idx !== -1) {
          accounts[idx] = {
            ...accounts[idx],
            email: email,
            full_name: fullName,
            name: fullName,
            bio: bio,
            linkedin: linkedin,
            country: country,
            avatar_url: updatedUser.avatar_url,
            image: updatedUser.avatar_url,
          };
          localStorage.setItem("wsj_accounts", JSON.stringify(accounts));
        }
      }
    } catch (e) {}

    // Save to user profiles map by email in localStorage
    const userEmailLower = email.toLowerCase().trim();
    const newSlug = slugifyAuthorName(fullName);

    try {
      const existingProfiles = JSON.parse(localStorage.getItem("wsj_users_by_email") || "{}");
      existingProfiles[userEmailLower] = updatedUser;
      localStorage.setItem("wsj_users_by_email", JSON.stringify(existingProfiles));

      const slugMap = JSON.parse(localStorage.getItem("wsj_slug_to_email") || "{}");
      slugMap[newSlug] = userEmailLower;
      const prefix = userEmailLower.split("@")[0];
      slugMap[prefix] = userEmailLower;
      localStorage.setItem("wsj_slug_to_email", JSON.stringify(slugMap));
    } catch (e) {}

    // Broadcast user update event across components
    window.dispatchEvent(new Event("wsj_user_updated"));

    if (onSave) {
      onSave(updatedUser);
    }

    onClose();

    // Dynamically update URL if currently on an author page or writer page
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      const role = (updatedUser.role || "writer").toLowerCase();
      let targetUrl = "";
      if (path.includes("-dashboard")) {
        targetUrl = `/${role}-dashboard/${newSlug}`;
      } else if (path.includes("/author/")) {
        targetUrl = `/author/${newSlug}`;
      } else if (path.startsWith("/admin/") || path.startsWith("/writer/") || path.startsWith("/reader/")) {
        targetUrl = `/${role}/${newSlug}`;
      }
      if (targetUrl && window.location.pathname !== targetUrl) {
        window.location.href = targetUrl;
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      {/* Modal Dialog Box matching screenshot */}
      <div className={`bg-white rounded-2xl w-full ${isStaffOrContributor ? "max-w-[580px] sm:max-w-[640px]" : "max-w-[480px] sm:max-w-[520px]"} p-5 sm:p-7 shadow-2xl relative border border-[#e2e8f0] transform transition-all animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto`}>
        
        {/* Toast Notification on Save */}
        {showSavedToast && (
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-[#059669] text-white px-4 py-2 rounded-lg text-xs font-mono font-bold shadow-lg flex items-center space-x-2 z-10 animate-bounce">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>Profile Settings Saved Successfully!</span>
          </div>
        )}

        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 mb-5 border-b border-[#f1f5f9]">
          <div>
            <h2 className="font-serif font-bold text-[24px] sm:text-[26px] text-[#0f172a] leading-tight tracking-tight">
              Profile Settings
            </h2>
            <p className="font-mono text-[11px] font-semibold text-[#94a3b8] tracking-widest uppercase mt-0.5">
              MANAGE YOUR ACCOUNT
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#94a3b8] hover:text-[#475569] p-1 rounded-md transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* User Photo & Basic Info Row */}
        <div className="flex items-center space-x-4 mb-6">
          {/* Orange Monogram Box or Custom Avatar */}
          <div className="relative group">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={fullName}
                className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl object-contain bg-slate-50 border border-[#e2e8f0] shadow-sm"
              />
            ) : (
              <div className="w-16 h-16 sm:w-18 sm:h-18 bg-[#f05011] rounded-2xl flex items-center justify-center text-white font-bold text-[24px] sm:text-[26px] tracking-tight shadow-sm">
                {initials}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="font-sans font-bold text-[14px] sm:text-[15px] text-[#005a9c] hover:text-[#004070] hover:underline cursor-pointer block leading-tight mb-0.5 text-left"
            >
              Change photo
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoChange}
              accept="image/*"
              className="hidden"
            />
            <p className="font-mono text-[12.5px] sm:text-[13px] text-[#64748b] truncate mb-1">
              {email}
            </p>
            <span className="inline-block bg-[#f1f5f9] text-[#475569] font-mono font-bold text-[10.5px] px-2.5 py-0.5 rounded-md uppercase tracking-wider">
              {role}
            </span>
          </div>
        </div>

        {/* Form Body */}
        <div className="space-y-4">
          {/* FULL NAME Field */}
          <div>
            <label className="block font-mono text-[11px] font-bold text-[#64748b] tracking-wider uppercase mb-1.5">
              FULL NAME
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-[#e2e8f0] rounded-xl text-[#1e293b] font-sans text-[15px] focus:outline-none focus:border-[#00528a] focus:ring-2 focus:ring-[#00528a]/15 transition-all"
              placeholder="Full name"
            />
          </div>

          {/* EMAIL & COUNTRY Fields (Clean 2-column for all users) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-mono text-[11px] font-bold text-[#64748b] tracking-wider uppercase mb-1.5">
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-[#e2e8f0] rounded-xl text-[#1e293b] font-sans text-[14px] sm:text-[15px] focus:outline-none focus:border-[#00528a] focus:ring-2 focus:ring-[#00528a]/15 transition-all"
                placeholder="name@timeschicago.com"
              />
            </div>
            <div>
              <label className="block font-mono text-[11px] font-bold text-[#64748b] tracking-wider uppercase mb-1.5">
                COUNTRY
              </label>
              <select
                value={country}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-[#e2e8f0] rounded-xl text-[#1e293b] font-sans text-[14px] sm:text-[15px] focus:outline-none focus:border-[#00528a] focus:ring-2 focus:ring-[#00528a]/15 transition-all cursor-pointer"
              >
                {COUNTRIES_LIST.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* PHONE NUMBER & COUNTRY CODE (ONLY for Staff Writer and Contributor) */}
          {isStaffOrContributor && (
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              {/* Choose Country Code separately */}
              <div className="sm:col-span-5">
                <label className="block font-mono text-[11px] font-bold text-[#64748b] tracking-wider uppercase mb-1.5">
                  COUNTRY CODE
                </label>
                <select
                  value={countryDialCode}
                  onChange={(e) => handleDialCodeChange(e.target.value)}
                  className="w-full px-3 py-3 bg-white border border-[#e2e8f0] rounded-xl text-[#1e293b] font-sans text-xs sm:text-[13px] focus:outline-none focus:border-[#00528a] focus:ring-2 focus:ring-[#00528a]/15 transition-all cursor-pointer truncate"
                  title="Choose Country Code"
                >
                  {COUNTRY_PHONE_CONFIGS.map((cfg) => (
                    <option key={`${cfg.name}-${cfg.dialCode}`} value={cfg.dialCode}>
                      {cfg.dialCode} ({cfg.name})
                    </option>
                  ))}
                </select>
              </div>

              {/* Phone Number Input */}
              <div className="sm:col-span-7">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block font-mono text-[11px] font-bold text-[#64748b] tracking-wider uppercase">
                    PHONE NUMBER
                  </label>
                  <span className="font-mono text-[10px] text-gray-400">
                    {phoneNumber.length}/{activePhoneConfig.maxDigits} digits
                  </span>
                </div>
                <input
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  className="w-full px-4 py-3 bg-white border border-[#e2e8f0] rounded-xl text-[#1e293b] font-sans text-xs sm:text-[14px] focus:outline-none focus:border-[#00528a] focus:ring-2 focus:ring-[#00528a]/15 transition-all"
                  placeholder={`e.g. ${activePhoneConfig.placeholder}`}
                />
              </div>
            </div>
          )}

          {/* BIO Field */}
          <div>
            <label className="block font-mono text-[11px] font-bold text-[#64748b] tracking-wider uppercase mb-1.5">
              BIO
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-[#e2e8f0] rounded-xl text-[#1e293b] font-sans text-[15px] focus:outline-none focus:border-[#00528a] focus:ring-2 focus:ring-[#00528a]/15 transition-all resize-none leading-relaxed"
              placeholder="Tell readers about yourself..."
            />
          </div>

          {/* LINKEDIN PROFILE Field (for Staff Writers and Contributors) */}
          {isStaffOrContributor && (
            <div>
              <label className="block font-mono text-[11px] font-bold text-[#64748b] tracking-wider uppercase mb-1.5">
                LINKEDIN PROFILE
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 flex items-center justify-center pointer-events-none">
                  <div className="w-5 h-5 flex items-center justify-center cursor-default">
                    <svg className="w-5 h-5 text-[#0077b5] fill-current" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </div>
                </div>
                <input
                  type="text"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white border border-[#e2e8f0] rounded-xl text-[#1e293b] font-sans text-[15px] focus:outline-none focus:border-[#00528a] focus:ring-2 focus:ring-[#00528a]/15 transition-all"
                  placeholder="https://www.linkedin.com/in/your-profile"
                />
              </div>
              <p className="font-sans text-[12px] text-[#94a3b8] mt-1.5">
                Shown on your article bylines so readers can connect with you.
              </p>
            </div>
          )}

          {/* Experience, Publications & Education ONLY for Staff Writers & Contributors */}
          {isStaffOrContributor && (
            <div className="pt-2 border-t border-slate-100">
              <CredentialsEditor
                experiences={experiences}
                setExperiences={setExperiences}
                education={education}
                setEducation={setEducation}
                publications={publications}
                setPublications={setPublications}
              />
            </div>
          )}
        </div>

        {/* Action Buttons Footer matching screenshot */}
        <div className="flex items-center space-x-3.5 mt-7 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-1/2 py-3.5 bg-white border border-[#cbd5e1] hover:bg-[#f8fafc] text-[#334155] font-mono font-bold text-[13.5px] sm:text-[14px] tracking-wider uppercase rounded-xl transition-colors cursor-pointer text-center"
          >
            CANCEL
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="w-1/2 py-3.5 bg-[#00487c] hover:bg-[#003862] text-white font-mono font-bold text-[13.5px] sm:text-[14px] tracking-wider uppercase rounded-xl transition-all shadow-md cursor-pointer text-center disabled:opacity-50"
          >
            {isSaving ? "SAVING..." : "SAVE CHANGES"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProfileSettingsModal;
