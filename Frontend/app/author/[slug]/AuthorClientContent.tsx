"use client";

import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Header from "@/components/navigation/Header";
import StickyHeaderBar from "@/components/navigation/StickyHeaderBar";
import Footer from "@/components/layout/Footer";
import Container from "@/components/layout/Container";
import AuthorHeader from "@/components/author/AuthorHeader";
import AuthorArticlesList from "@/components/author/AuthorArticlesList";
import MostReadSidebar from "@/components/author/MostReadSidebar";
import LouisVuittonAdBanner from "@/components/author/LouisVuittonAdBanner";
import AuthorCredentialsSidebar from "@/components/author/AuthorCredentialsSidebar";
import { getAuthorBySlug, getAuthorByEmail, slugifyAuthorName } from "@/data/authors";

export default function AuthorClientContent({ slug: propSlug }: { slug?: string } = {}) {
  const routeParams = useParams();
  const searchParams = useSearchParams();
  const rawSlug = propSlug || routeParams?.slug;
  const slug = typeof rawSlug === "string" ? rawSlug : (Array.isArray(rawSlug) ? rawSlug[0] : "writer");
  const emailParam = (searchParams?.get("email") || "").toLowerCase().trim();

  const [authorData, setAuthorData] = useState(() => getAuthorBySlug(slug, emailParam));
  const [hasPublishedArticles, setHasPublishedArticles] = useState<boolean>(true);

  useEffect(() => {
    const resolved = getAuthorBySlug(slug, emailParam);
    setAuthorData(resolved);

    // If emailParam exists, fetch fresh live profile from backend to ensure latest name and role
    if (emailParam) {
      fetch(`http://localhost:5000/api/users/${encodeURIComponent(emailParam)}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && data.success && data.user) {
            const u = data.user;
            const writerType = (u.writer_type || "").toLowerCase();
            const role = writerType === "contributor"
              ? "CONTRIBUTOR"
              : (writerType === "staff" ? "STAFF WRITER" : ((u.role || "WRITER").toUpperCase() === "WRITER" ? "STAFF WRITER" : (u.role || "WRITER").toUpperCase()));
            setAuthorData((prev) => ({
              ...prev,
              name: u.full_name || u.name || prev.name,
              role: role,
              email: u.email || emailParam,
              bio: u.bio !== undefined && u.bio !== "" ? u.bio : prev.bio,
              image: u.avatar_url || prev.image,
              linkedinUrl: u.linkedin || prev.linkedinUrl,
            }));
          }
        })
        .catch(() => {});
    }
  }, [slug, emailParam]);

  useEffect(() => {
    if (authorData && authorData.name && typeof window !== "undefined") {
      const correctSlug = slugifyAuthorName(authorData.name);
      if (correctSlug && correctSlug.toLowerCase() !== slug.toLowerCase() && !emailParam) {
        window.history.replaceState(null, "", `/author/${correctSlug}`);
      }
    }
  }, [authorData, slug, emailParam]);

  useEffect(() => {
    const isWriterUser = slug.toLowerCase() === "writer" || slug.toLowerCase() === "writer1" || (authorData?.email && authorData.email.includes("writer"));
    if (isWriterUser && typeof window !== "undefined") {
      let posts: any[] = [];
      try {
        const p1 = localStorage.getItem("wsj_posts");
        if (p1) posts = [...posts, ...JSON.parse(p1)];
      } catch (e) {}
      try {
        const p2 = localStorage.getItem("wsj_published_posts");
        if (p2) posts = [...posts, ...JSON.parse(p2)];
      } catch (e) {}

      const targetEmail = (authorData?.email || emailParam || "").toLowerCase().trim();
      const published = posts.filter((p: any) => {
        if (!p || (p.status !== "Published" && p.status !== "APPROVED")) return false;
        const pEmail = (p.authorEmail || "").toLowerCase().trim();
        const isSubWriter = Array.isArray(p.sub_writers) && p.sub_writers.some((sw: any) => {
          const swEmail = (sw.email || "").toLowerCase().trim();
          const swSlug = (sw.slug || "").toLowerCase().trim();
          return (targetEmail && swEmail === targetEmail) || (slug && swSlug === slug.toLowerCase());
        });
        if (isSubWriter) return true;
        if (pEmail && targetEmail) return pEmail === targetEmail;
        if (!targetEmail || targetEmail === "writer@gmail.com") return !pEmail || pEmail === "writer@gmail.com";
        return false;
      });
      setHasPublishedArticles(published.length > 0);
    }
  }, [slug, authorData, emailParam]);

  return (
    <main className="min-h-screen bg-white text-[#111111] font-sans flex flex-col justify-between ">
      <div>
        {/* Main Header & Navigation */}
        <Header />
        <StickyHeaderBar />

        {/* Writer Page Body */}
        <div className="article-body">
          {/* Section 1: Writer Profile Header */}
          <AuthorHeader author={authorData} />

          {/* Section 2: Main Articles List & Top Right Sidebar */}
          <Container className="py-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Left Column: Author Articles List (Span 8) */}
              <div className="lg:col-span-8">
                <AuthorArticlesList authorName={authorData.name.toUpperCase()} authorEmail={authorData.email} />
              </div>

              {/* Right Column: Top Right Sidebar with Experience, Publications, Education, Most Read Articles, and Louis Vuitton Ad Banner */}
              <div className="lg:col-span-4 sticky top-6 pl-0 lg:pl-4 space-y-6">
                <AuthorCredentialsSidebar authorEmail={authorData.email} authorName={authorData.name} />
                {hasPublishedArticles && (
                  <MostReadSidebar authorName={authorData.name} authorEmail={authorData.email} />
                )}
                <LouisVuittonAdBanner />
              </div>
            </div>
          </Container>
        </div>
      </div>

      {/* Main Footer */}
      <Footer />
    </main>
  );
}
