"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/navigation/Header";
import StickyHeaderBar from "@/components/navigation/StickyHeaderBar";
import Footer from "@/components/layout/Footer";
import Container from "@/components/layout/Container";
import AuthorHeader from "@/components/author/AuthorHeader";
import AuthorArticlesList from "@/components/author/AuthorArticlesList";
import MostReadSidebar from "@/components/author/MostReadSidebar";
import LouisVuittonAdBanner from "@/components/author/LouisVuittonAdBanner";
import { getAuthorBySlug } from "@/data/authors";

interface AuthorPageProps {
  params: Promise<{ slug: string }>;
}

export default function AuthorPage({ params }: AuthorPageProps) {
  const { slug } = React.use(params);
  const authorData = getAuthorBySlug(slug);
  const [hasPublishedArticles, setHasPublishedArticles] = useState<boolean>(true);

  useEffect(() => {
    const isWriterUser = slug.toLowerCase() === "writer" || ((authorData?.name || "").toLowerCase() === "writer user");
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

      const published = posts.filter((p: any) => p && p.status === "Published");
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
                <AuthorArticlesList authorName={authorData.name.toUpperCase()} />
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
