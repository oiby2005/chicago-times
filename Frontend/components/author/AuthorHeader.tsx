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
  linkedinUrl?: string;
  twitterUrl?: string;
}

interface AuthorHeaderProps {
  author?: AuthorProfile;
}

const defaultAuthor: AuthorProfile = {
  name: "Writer User",
  role: "WRITER",
  bio: "Journalist & Columnist",
  image: "",
  email: "writer@gmail.com",
  linkedinUrl: "https://www.linkedin.com",
  twitterUrl: "https://x.com",
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
              role: (u.role || author.role || "WRITER").toUpperCase(),
              bio: u.bio !== undefined && u.bio !== "" ? u.bio : (author?.bio || "Journalist & Writer"),
              image: u.avatar_url || u.image || author?.image || "",
              email: u.email || author?.email || "info@timeschicago.com",
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
          role: (u.role || author.role || "WRITER").toUpperCase(),
          bio: u.bio !== undefined && u.bio !== "" ? u.bio : author?.bio || "Journalist & Writer",
          image: u.avatar_url || u.image || author?.image || "",
          email: u.email || author?.email || "info@timeschicago.com",
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
            role: (u.role || author.role || "WRITER").toUpperCase(),
            bio: u.bio !== undefined && u.bio !== "" ? u.bio : author?.bio || "Journalist & Writer",
            image: u.avatar_url || u.image || author?.image || "",
            email: u.email || author?.email || "info@timeschicago.com",
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
      email: author?.email || "info@timeschicago.com",
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
            {/* 1. Name */}
            <h1 className="font-serif font-bold text-2xl sm:text-3xl md:text-4xl text-[#111111] leading-tight text-center">
              {profile.name}
            </h1>

            {/* 2. Role Badge (e.g. WRITER) */}
            <div className="font-sans font-bold text-xs sm:text-sm uppercase tracking-wider text-[#990000] text-center">
              {profile.role}
            </div>

            {/* 3. ONLY LinkedIn Icon - Centered directly UNDER Name & Role */}
            <div className="flex items-center justify-center pt-1 pb-1">
              <a
                href={profile.linkedinUrl || "https://www.linkedin.com"}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center hover:opacity-80 transition-opacity cursor-pointer text-[#0077b5] shrink-0 p-1"
                title="LinkedIn Profile"
              >
                <svg className="w-6 h-6 sm:w-7 sm:h-7 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
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

