"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/navigation/Header";
import StickyHeaderBar from "@/components/navigation/StickyHeaderBar";
import Footer from "@/components/layout/Footer";
import Container from "@/components/layout/Container";
import AuthorHeader from "@/components/author/AuthorHeader";
import AuthorArticlesList from "@/components/author/AuthorArticlesList";
import MostReadSidebar from "@/components/author/MostReadSidebar";
import LouisVuittonAdBanner from "@/components/author/LouisVuittonAdBanner";
import { getAuthorBySlug, slugifyAuthorName } from "@/data/authors";

export default function AuthorClientContent() {
  const routeParams = useParams();
  const rawSlug = routeParams?.slug;
  const slug = typeof rawSlug === "string" ? rawSlug : (Array.isArray(rawSlug) ? rawSlug[0] : "writer");

  const authorData = getAuthorBySlug(slug);
  const [hasPublishedArticles, setHasPublishedArticles] = useState<boolean>(true);

  useEffect(() => {
    if (authorData && authorData.name && typeof window !== "undefined") {
      const correctSlug = slugifyAuthorName(authorData.name);
      if (correctSlug && correctSlug.toLowerCase() !== slug.toLowerCase()) {
        window.history.replaceState(null, "", `/author/${correctSlug}`);
      }
    }
  }, [authorData, slug]);

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

      const targetEmail = (authorData?.email || "").toLowerCase().trim();
      const published = posts.filter((p: any) => {
        if (!p || p.status !== "Published") return false;
        const pEmail = (p.authorEmail || "").toLowerCase().trim();
        if (pEmail && targetEmail) return pEmail === targetEmail;
        if (!targetEmail || targetEmail === "writer@gmail.com") return !pEmail || pEmail === "writer@gmail.com";
        return false;
      });
      setHasPublishedArticles(published.length > 0);
    }
  }, [slug, authorData]);

  return (
    <main className="min-h-screen bg-white text-[#111111] font-sans flex flex-col justify-between select-none">
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

              {/* Right Column: Top Right Sidebar with Louis Vuitton Ad Banner */}
              <div className="lg:col-span-4 sticky top-6 pl-0 lg:pl-4 space-y-6">
                {hasPublishedArticles && <MostReadSidebar />}
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
