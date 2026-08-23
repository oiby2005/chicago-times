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

export default function WriterPage() {
  const [writerName, setWriterName] = useState<string>("Writer User");
  const [hasPublishedArticles, setHasPublishedArticles] = useState<boolean>(false);

  const syncWriterData = () => {
    if (typeof window === "undefined") return;
    const storedUserStr = localStorage.getItem("wsj_user");
    let name = "Writer User";
    if (storedUserStr) {
      try {
        const storedUser = JSON.parse(storedUserStr);
        if (storedUser.full_name) {
          name = storedUser.full_name;
        }
      } catch (e) {
        console.error("Error reading writer name:", e);
      }
    }
    setWriterName(name);

    const storedPostsStr = localStorage.getItem("wsj_published_posts");
    if (storedPostsStr) {
      try {
        const storedPosts = JSON.parse(storedPostsStr);
        const filtered = storedPosts.filter((p: any) => {
          const a = (p.author || "").toLowerCase();
          const curr = name.toLowerCase();
          return a === curr || a.includes("writer");
        });
        setHasPublishedArticles(filtered.length > 0);
      } catch (e) {
        setHasPublishedArticles(false);
      }
    } else {
      setHasPublishedArticles(false);
    }
  };

  useEffect(() => {
    syncWriterData();
    window.addEventListener("wsj_user_updated", syncWriterData);
    return () => window.removeEventListener("wsj_user_updated", syncWriterData);
  }, []);

  return (
    <main className="min-h-screen bg-white text-[#111111] font-sans flex flex-col justify-between select-none">
      <div>
        {/* Main Header & Navigation */}
        <Header />
        <StickyHeaderBar />

        {/* Writer Page Body */}
        <div className="article-body">
          {/* Section 1: Writer Profile Header (reactively synced with Profile Settings) */}
          <AuthorHeader />

          {/* Section 2: Main Articles List & Top Right Sidebar */}
          <Container className="py-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Left Column: Author Articles List (Span 8) */}
              <div className="lg:col-span-8">
                <AuthorArticlesList authorName={writerName.toUpperCase()} />
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
