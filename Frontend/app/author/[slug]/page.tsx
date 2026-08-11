import React from "react";
import Header from "@/components/navigation/Header";
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

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { slug } = await params;
  const authorData = getAuthorBySlug(slug);

  return (
    <main className="min-h-screen bg-white text-[#111111] font-sans flex flex-col justify-between select-none">
      <div>
        {/* Main Header & Navigation (completely untouched) */}
        <Header />

        {/* Writer Page Body */}
        <div className="article-body">
          {/* Section 1: Writer Profile Header */}
          <AuthorHeader author={authorData} />

          {/* Section 2: Main Articles List & Most Read Sidebar */}
          <Container className="py-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Left Column: Author Articles List (Span 8) */}
              <div className="lg:col-span-8">
                <AuthorArticlesList authorName={authorData.name.toUpperCase()} />
              </div>

              {/* Right Column: Most Read Sidebar & Louis Vuitton Ad (Span 4) */}
              <div className="lg:col-span-4 sticky top-6 pl-0 lg:pl-4 space-y-6">
                <MostReadSidebar />
                <LouisVuittonAdBanner />
              </div>
            </div>
          </Container>
        </div>
      </div>

      {/* Main Footer (completely untouched) */}
      <Footer />
    </main>
  );
}
