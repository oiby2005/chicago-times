"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Container from "@/components/layout/Container";

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
  name: "Dylan Candice Odulio",
  role: "WRITER",
  bio: "Content writer and aspiring journalist with 2 years of news-writing experience, skilled in research, article writing, and current affairs coverage.",
  image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
  linkedinUrl: "https://www.linkedin.com/in/candice-odulio-1a4b68411/",
};

export default function AuthorHeader({ author = defaultAuthor }: AuthorHeaderProps) {
  const router = useRouter();

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
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden shrink-0 border border-gray-200 shadow-sm bg-gray-100">
            <img
              src={author.image}
              alt={author.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0 pt-1">
            {/* Name + LinkedIn Icon */}
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-serif font-bold text-2xl sm:text-3xl md:text-4xl text-[#111111] leading-tight">
                {author.name}
              </h1>
              {author.linkedinUrl && (
                <a
                  href={author.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center w-4 h-4 bg-[#0077b5] text-white font-bold text-[9px] rounded-[2px] hover:opacity-80 transition-opacity"
                  title="LinkedIn Profile"
                >
                  in
                </a>
              )}
            </div>

            {/* Role Badge */}
            <div className="font-sans font-bold text-xs sm:text-sm uppercase tracking-wider text-[#990000] mt-1 mb-2.5">
              {author.role}
            </div>

            {/* Bio Description */}
            <p className="font-sans text-xs sm:text-sm text-[#555555] leading-relaxed max-w-3xl">
              {author.bio}
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
