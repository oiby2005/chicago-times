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
  email?: string;
  country?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
}

interface AuthorHeaderProps {
  author?: AuthorProfile;
}

const defaultAuthor: AuthorProfile = {
  name: "Writer User",
  role: "STAFF WRITER",
  bio: "Journalist & Columnist",
  image: "",
  email: "writer@gmail.com",
  country: "United States",
  linkedinUrl: "https://www.linkedin.com",
  twitterUrl: "https://x.com",
};

const getFormattedRole = (u?: any, fallbackRole: string = "STAFF WRITER") => {
  if ((u?.writer_type || "").toLowerCase() === "contributor") return "CONTRIBUTOR";
  const r = (u?.role || fallbackRole || "STAFF WRITER").toUpperCase();
  if (r === "WRITER") return "STAFF WRITER";
  return r;
};

export default function AuthorHeader({ author = defaultAuthor }: AuthorHeaderProps) {
  const router = useRouter();
  const [profile, setProfile] = useState<AuthorProfile>({
    ...author,
    name: extractSingleAuthorName(author.name),
  });

  const syncProfile = async () => {
    if (typeof window === "undefined") return;
    const authorEmailLower = (author?.email || "").toLowerCase().trim();
    const authorNameLower = (author?.name || "").toLowerCase().trim();
    const authorSlugLower = (author?.slug || "").toLowerCase().trim();

    if (authorEmailLower) {
      try {
        const res = await fetch(`http://localhost:5000/api/users/${encodeURIComponent(authorEmailLower)}`).catch(() => null);
        if (res && res.ok) {
          const data = await res.json();
          if (data.success && data.user) {
            const u = data.user;
            setProfile({
              name: extractSingleAuthorName(u.full_name || u.name || author.name),
              role: getFormattedRole(u, author.role),
              bio: u.bio !== undefined && u.bio !== "" ? u.bio : (author?.bio || "Journalist & Writer"),
              image: u.avatar_url || u.image || author?.image || "",
              email: u.email || author?.email || "worldnews@timeschicago.com",
              country: u.country || (u as any).country || author?.country || "",
              linkedinUrl: u.linkedin || u.linkedinUrl || author?.linkedinUrl || "https://www.linkedin.com",
              twitterUrl: u.twitter || u.twitterUrl || author?.twitterUrl || "https://x.com",
            });
            return;
          }
        }
      } catch (e) {}
    }

    try {
      const map = JSON.parse(localStorage.getItem("wsj_users_by_email") || "{}");
      
      // 1. Direct match by exact email address
      if (authorEmailLower && map[authorEmailLower]) {
        const u = map[authorEmailLower];
        setProfile({
          name: extractSingleAuthorName(u.full_name || u.name || author.name),
          role: getFormattedRole(u, author.role),
          bio: u.bio !== undefined && u.bio !== "" ? u.bio : author?.bio || "Journalist & Writer",
          image: u.avatar_url || u.image || author?.image || "",
          email: u.email || author?.email || "worldnews@timeschicago.com",
          country: u.country || (u as any).country || author?.country || "",
          linkedinUrl: u.linkedin || u.linkedinUrl || author?.linkedinUrl || "https://www.linkedin.com",
          twitterUrl: u.twitter || u.twitterUrl || author?.twitterUrl || "https://x.com",
        });
        return;
      }

      // 2. Match by email prefix or slug in users map
      for (const email of Object.keys(map)) {
        const u = map[email];
        const uNameLower = (u.full_name || u.name || "").toLowerCase().trim();
        const uSlug = uNameLower.replace(/[^a-z0-9]+/g, "-");
        const emailPrefix = email.split("@")[0].toLowerCase();

        if (authorSlugLower === uSlug || authorSlugLower === emailPrefix || (authorNameLower && authorNameLower === uNameLower)) {
          setProfile({
            name: extractSingleAuthorName(u.full_name || u.name || author.name),
            role: getFormattedRole(u, author.role),
            bio: u.bio !== undefined && u.bio !== "" ? u.bio : author?.bio || "Journalist & Writer",
            image: u.avatar_url || u.image || author?.image || "",
            email: u.email || author?.email || "worldnews@timeschicago.com",
            country: u.country || (u as any).country || author?.country || "",
            linkedinUrl: u.linkedin || u.linkedinUrl || author?.linkedinUrl || "https://www.linkedin.com",
            twitterUrl: u.twitter || u.twitterUrl || author?.twitterUrl || "https://x.com",
          });
          return;
        }
      }
    } catch (e) {}

    setProfile({
      ...author,
      name: extractSingleAuthorName(author.name),
      email: author?.email || "worldnews@timeschicago.com",
      country: author?.country || "",
      linkedinUrl: author?.linkedinUrl || "https://www.linkedin.com",
      twitterUrl: author?.twitterUrl || "https://x.com",
    });
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
    <div className="w-full bg-white relative ">
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

        {/* Author Bio Header Card (Centered Layout with Sharp Square Image & LinkedIn Icon Only) */}
        <div className="flex flex-col items-center justify-center text-center gap-4 mx-auto max-w-3xl">
          {/* Avatar Photo with Sharp Corners (Square rounded-none) */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-none overflow-hidden shrink-0 border border-gray-200 shadow-xs bg-gray-100 flex items-center justify-center aspect-square mx-auto">
            {profile.image && profile.image.trim() !== "" ? (
              <img
                src={profile.image}
                alt={profile.name}
                className="w-full h-full object-cover object-center rounded-none aspect-square"
              />
            ) : (
              <div className="w-full h-full bg-[#111111] text-white font-bold text-xl sm:text-2xl flex items-center justify-center rounded-none">
                {getInitials(profile.name)}
              </div>
            )}
          </div>

          {/* Author Details - Positioned directly UNDER the image & centered */}
          <div className="w-full text-center space-y-2">
            {/* 1. Name & Country (Writer name strictly centralized, Country positioned to the right aligned with bottom edge) */}
            <div className="flex items-center justify-center">
              <div className="relative inline-flex items-baseline">
                <h1 className="font-serif font-bold text-2xl sm:text-3xl md:text-4xl text-[#111111] leading-tight text-center">
                  {profile.name}
                </h1>
                {profile.country && (
                  <span className="absolute left-full ml-2 whitespace-nowrap font-sans text-xs sm:text-sm font-normal text-[#666666] bottom-0.5 sm:bottom-1">
                    ({profile.country})
                  </span>
                )}
              </div>
            </div>

            {/* 2. Role Badge (e.g. STAFF WRITER / CONTRIBUTOR) */}
            <div className="font-sans font-bold text-xs sm:text-sm uppercase tracking-wider text-[#990000] text-center">
              {profile.role?.toUpperCase() === "WRITER" || !profile.role ? "STAFF WRITER" : profile.role}
            </div>

            {/* 3. Social Icons: LinkedIn & Email */}
            <div className="flex items-center justify-center gap-2 pt-1 pb-1">
              {/* LinkedIn Icon */}
              <a
                href={profile.linkedinUrl || "https://www.linkedin.com"}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer shrink-0 rounded-none h-5"
                title={`${profile.name}'s LinkedIn Profile`}
              >
                <svg className="w-5 h-5 rounded-none" viewBox="0 0 24 24">
                  <rect width="24" height="24" fill="#0077b5" rx="0" />
                  <path
                    d="M8 19H5V8h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3V8h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                    fill="white"
                  />
                </svg>
              </a>

              {/* Email Icon (Same vertical height as LinkedIn) */}
              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex items-center justify-center hover:opacity-80 transition-opacity cursor-pointer shrink-0 h-5"
                  title={`Send email to ${profile.email}`}
                >
                  <svg
                    className="h-5 w-auto text-[#111111] hover:text-[#005a9c] transition-colors"
                    viewBox="1 3 22 18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    <path d="m3 19 6.5-6" />
                    <path d="m21 19-6.5-6" />
                  </svg>
                </a>
              )}
            </div>

            {/* 4. Bio Description - Positioned directly UNDER the LinkedIn Icon */}
            <p className="font-sans text-xs sm:text-sm text-[#555555] leading-relaxed max-w-2xl text-center mx-auto pt-1">
              {profile.bio}
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}

