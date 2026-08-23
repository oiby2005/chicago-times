"use client";

import React, { useState, useEffect, useRef } from "react";

export interface UserProfile {
  id?: number;
  full_name: string;
  email: string;
  role: string;
  bio?: string;
  linkedin?: string;
  avatar_url?: string;
}

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
  const [role, setRole] = useState("READER");
  const [bio, setBio] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [showSavedToast, setShowSavedToast] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.full_name || (currentUser as any).name || "User");
      setEmail(currentUser.email || "user@gmail.com");
      setRole((currentUser.role || "READER").toUpperCase());
      setBio(currentUser.bio || "News Enthusiast");
      setLinkedin(currentUser.linkedin || "");
      setAvatarUrl(currentUser.avatar_url || "");
    } else {
      setFullName("User");
      setEmail("user@gmail.com");
      setRole("READER");
      setBio("News Enthusiast");
      setLinkedin("");
      setAvatarUrl("");
    }
  }, [currentUser, isOpen]);

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
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const updatedUser: UserProfile = {
      ...(currentUser || {}),
      full_name: fullName,
      email: email,
      role: role.toLowerCase(),
      bio: bio,
      linkedin: linkedin,
      avatar_url: avatarUrl,
    };

    // Save to localStorage
    localStorage.setItem("wsj_user", JSON.stringify(updatedUser));
    
    // Broadcast user update event across components
    window.dispatchEvent(new Event("wsj_user_updated"));

    if (onSave) {
      onSave(updatedUser);
    }

    setShowSavedToast(true);
    setTimeout(() => {
      setShowSavedToast(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      {/* Modal Dialog Box matching screenshot */}
      <div className="bg-white rounded-2xl w-full max-w-[480px] p-5 sm:p-7 shadow-2xl relative border border-[#e2e8f0] transform transition-all animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        
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
                className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl object-cover border border-[#e2e8f0] shadow-sm"
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

          {/* LINKEDIN PROFILE Field */}
          <div>
            <label className="block font-mono text-[11px] font-bold text-[#64748b] tracking-wider uppercase mb-1.5">
              LINKEDIN PROFILE
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 flex items-center justify-center pointer-events-none">
                {/* LinkedIn Badge Icon matching screenshot */}
                <div className="w-5 h-5 bg-[#0a66c2] rounded-xs flex items-center justify-center text-white font-bold text-[11px] font-sans leading-none">
                  in
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
            className="w-1/2 py-3.5 bg-[#00487c] hover:bg-[#003862] text-white font-mono font-bold text-[13.5px] sm:text-[14px] tracking-wider uppercase rounded-xl transition-all shadow-md cursor-pointer text-center"
          >
            SAVE CHANGES
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProfileSettingsModal;
