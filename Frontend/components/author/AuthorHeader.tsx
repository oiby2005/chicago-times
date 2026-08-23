"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Container from "@/components/layout/Container";

import { extractSingleAuthorName } from "@/data/authors";

export interface AuthorProfile {
  name: string;
  role: string;
  bio: string;
  image: string;
  linkedinUrl?: string;
}

interface AuthorHeaderProps {
  author?: AuthorProfile;
}

const defaultAuthor: AuthorProfile = {
  name: "Writer User",
  role: "WRITER",
  bio: "Journalist & Columnist",
  image: "",
  linkedinUrl: "https://www.linkedin.com/in/your-profile",
};

export default function AuthorHeader({ author = defaultAuthor }: AuthorHeaderProps) {
  const router = useRouter();
  const [profile, setProfile] = useState<AuthorProfile>({
    ...author,
    name: extractSingleAuthorName(author.name),
  });

  const syncProfile = () => {
    if (typeof window === "undefined") return;
    const storedUserStr = localStorage.getItem("wsj_user");
    if (storedUserStr) {
      try {
        const storedUser = JSON.parse(storedUserStr);
        const userRole = (storedUser.role || "").toLowerCase();
        const storedNameLower = (storedUser.full_name || storedUser.name || "").toLowerCase();
        const authorNameLower = (author?.name || "").toLowerCase();
        
        const isWriterPage = typeof window !== "undefined" && (window.location.pathname === "/writer" || window.location.pathname.startsWith("/author/writer"));
        const isDefaultWriter = !author || authorNameLower === "writer" || authorNameLower === "writer user";
        const isSelfProfile = storedNameLower === authorNameLower;

        if (isWriterPage || isSelfProfile || (userRole === "writer" && isDefaultWriter)) {
          setProfile({
            name: extractSingleAuthorName(storedUser.full_name || storedUser.name || author?.name || "Writer User"),
            role: (storedUser.role || author?.role || "WRITER").toUpperCase(),
            bio: storedUser.bio !== undefined ? storedUser.bio : (author?.bio || "Journalist & Columnist"),
            image: storedUser.avatar_url !== undefined ? storedUser.avatar_url : (author?.image || ""),
            linkedinUrl: storedUser.linkedin || storedUser.linkedinUrl || author?.linkedinUrl || "https://www.linkedin.com/in/your-profile",
          });
          return;
        }
      } catch (e) {
        console.error("Error parsing wsj_user in AuthorHeader:", e);
      }
    }
    if (author) {
      setProfile({
        ...author,
        name: extractSingleAuthorName(author.name),
      });
    }
  };

  useEffect(() => {
    syncProfile();
    window.addEventListener("wsj_user_updated", syncProfile);
    return () => window.removeEventListener("wsj_user_updated", syncProfile);
  }, [author]);

  // Initials fallback if no image url
  const getInitials = (name: string) => {
    if (!name) return "WR";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div className="w-full bg-white relative select-none">
      <Container className="pt-6 pb-6 border-b border-[#e5e7eb]">
        {/* Back Link */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-[11px] sm:text-[12px] font-bold text-[#505e70] hover:text-[#0f172a] tracking-wider uppercase transition-colors group mb-6 cursor-pointer"
          type="button"
        >
          <svg
            className="w-3.5 h-3.5 text-[#505e70] group-hover:text-[#0f172a] transition-transform group-hover:-translate-x-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span>GO BACK</span>
        </button>

        {/* Author Bio Header Card */}
        <div className="flex flex-col sm:flex-row items-start gap-6">
          {/* Avatar Photo */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden shrink-0 border border-gray-200 shadow-sm bg-gray-100 flex items-center justify-center">
            {profile.image ? (
              <img
                src={profile.image}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[#f05011] text-white font-bold text-3xl flex items-center justify-center">
                {getInitials(profile.name)}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0 pt-1">
            {/* Name + LinkedIn Icon */}
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-serif font-bold text-2xl sm:text-3xl md:text-4xl text-[#111111] leading-tight">
                {profile.name}
              </h1>
              {profile.linkedinUrl && (
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center w-6 h-6 sm:w-6.5 sm:h-6.5 bg-[#0a66c2] hover:bg-[#084e96] text-white rounded-xs transition-colors shadow-xs cursor-pointer ml-1"
                  title="LinkedIn Profile"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                  </svg>
                </a>
              )}
            </div>

            {/* Role Badge */}
            <div className="font-sans font-bold text-xs sm:text-sm uppercase tracking-wider text-[#990000] mt-1 mb-2.5">
              {profile.role}
            </div>

            {/* Bio Description */}
            <p className="font-sans text-xs sm:text-sm text-[#555555] leading-relaxed max-w-3xl">
              {profile.bio}
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}

