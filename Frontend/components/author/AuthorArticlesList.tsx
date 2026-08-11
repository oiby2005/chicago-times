"use client";

import React from "react";
import Link from "next/link";

export interface AuthorArticleItem {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  image: string;
  slug: string;
}

const authorArticlesData: AuthorArticleItem[] = [
  {
    id: "a1",
    category: "POLITICS",
    title: "Pax Silica Could Transform the Philippines. But Who Really Benefits?",
    excerpt: "Four thousand acres. To some people, that is merely a number. To others, it is a home. It is farmland, a source of livelihood, and a place where generations of families have built their lives. Pax...",
    author: "DYLAN CANDICE ODULIO",
    date: "AUG 07, 2026",
    image: "/images/investigator-magnifying-glass.jpg",
    slug: "pax-silica-could-transform-philippines",
  },
  {
    id: "a2",
    category: "POLITICS",
    title: "The Philippine Vice President, the Missing Millions, and the Questions That Followed",
    excerpt: "Millions of pesos. That is where the controversy began. Months later, the issue has grown into one of the biggest political stories in the Philippines and one that has attracted attention far...",
    author: "DYLAN CANDICE ODULIO",
    date: "AUG 08, 2026",
    image: "/images/labor_market.jpg",
    slug: "philippine-vice-president-missing-millions",
  },
  {
    id: "a3",
    category: "BUSINESS",
    title: "The Bodies Were Finally Found. Gaza Is Only Beginning to Grieve.",
    excerpt: "A funeral is usually held days after a death. In Gaza, some families waited almost three years. This week, thousands of Palestinians gathered in Gaza City for a mass funeral following the recovery...",
    author: "DYLAN CANDICE ODULIO",
    date: "AUG 08, 2026",
    image: "/images/refinery-energy.jpg",
    slug: "bodies-finally-found-gaza-grieve",
  },
  {
    id: "a4",
    category: "WORLD",
    title: "Mercury Retrograde Had Everyone Looking Back At Their Exes",
    excerpt: "Did you lose someone recently? Did a relationship end out of nowhere? Did someone you cared about suddenly become a stranger? Maybe you experienced what astrology believers call the \"Mercury...",
    author: "DYLAN CANDICE ODULIO",
    date: "AUG 07, 2026",
    image: "/images/wine-plane.jpg",
    slug: "mercury-retrograde-looking-back-exes",
  },
  {
    id: "a5",
    category: "WORLD",
    title: "This Italian Festival Lets You \"Dunk\" the Politician You Hate",
    excerpt: "Imagine choosing the politician who annoyed people the most this year then watching them get lowered into a river three times. That is the idea behind La Tonca, one of the strongest traditions...",
    author: "DYLAN CANDICE ODULIO",
    date: "AUG 07, 2026",
    image: "/images/dc-townhouse.jpg",
    slug: "italian-festival-dunk-politician",
  },
  {
    id: "a6",
    category: "POLITICS",
    title: "The World Needs More People Like José Rizal",
    excerpt: "But first of all, who is José Rizal? If you ask Filipinos, they will tell you that José Rizal is a hero, a writer, and a martyr who died for his country. But that is probably the least interesting...",
    author: "DYLAN CANDICE ODULIO",
    date: "AUG 08, 2026",
    image: "/images/kevin_warsh.jpg",
    slug: "world-needs-more-people-jose-rizal",
  },
  {
    id: "a7",
    category: "US",
    title: "The Livestream That Ended With Police Outside the Door",
    excerpt: "For years, Perez Hilton made a living by talking about other people's lives. This week, the internet was talking about his. Celebrity blogger Perez Hilton, whose real name is Mario Lavandeira Jr.,...",
    author: "DYLAN CANDICE ODULIO",
    date: "AUG 08, 2026",
    image: "/images/podcast-tech-news.jpg",
    slug: "livestream-ended-with-police",
  },
  {
    id: "a8",
    category: "WORLD",
    title: "People at This Hospital Reported Seeing a Grim Reaper on the Roof",
    excerpt: "Patients and hospital visitors at Ysbyty Glan Clwyd in St Asaph, Wales, were confronted with an unusual sight on June 6, 2026, when a man dressed in a Grim Reaper-style costume climbed onto the...",
    author: "DYLAN CANDICE ODULIO",
    date: "AUG 09, 2026",
    image: "/images/bangkok-factory.jpg",
    slug: "grim-reaper-on-hospital-roof",
  },
  {
    id: "a9",
    category: "WORLD",
    title: "Why Is Everyone Talking About Ariana Grande's Body Again?",
    excerpt: "A photograph of Ariana Grande can now spark a debate far beyond the music she is promoting. In recent weeks, the singer's appearance has become the subject of intense discussion online...",
    author: "DYLAN CANDICE ODULIO",
    date: "AUG 09, 2026",
    image: "/images/ariana-grande.jpg",
    slug: "ariana-grande-body-discussion",
  },
  {
    id: "a10",
    category: "US",
    title: "How Serious Is Joe Biden’s Cancer as His Son Says the Disease Has Spread Further",
    excerpt: "Joe Biden's health has taken a more serious turn. In an interview with the BBC on Friday, August 7, 2026, Hunter Biden said his father's prostate cancer has spread further, including to his bones...",
    author: "DYLAN CANDICE ODULIO",
    date: "AUG 09, 2026",
    image: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=600&q=80",
    slug: "biden-cancer-disease-spread-further",
  },
];

interface AuthorArticlesListProps {
  authorName?: string;
}

export default function AuthorArticlesList({
  authorName = "DYLAN CANDICE ODULIO",
}: AuthorArticlesListProps) {
  return (
    <div className="w-full select-none">
      {/* Header */}
      <div className="border-b border-[#111111] pb-1.5 mb-6">
        <h3 className="font-serif font-bold text-sm sm:text-[15px] uppercase tracking-wider text-[#111111]">
          MORE FROM {authorName}
        </h3>
      </div>

      {/* List of Articles */}
      <div className="space-y-6">
        {authorArticlesData.map((item) => (
          <article
            key={item.id}
            className="pb-6 border-b border-[#e5e7eb] last:border-b-0"
          >
            <Link
              href={`/article/${item.slug}`}
              className="flex flex-col sm:flex-row items-start gap-4 group"
            >
              {/* Thumbnail Image */}
              <div className="w-full sm:w-48 md:w-56 aspect-[16/10] shrink-0 overflow-hidden bg-gray-100 rounded-xs">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Text Info */}
              <div className="flex-1 min-w-0">
                <div className="font-sans font-bold text-[10px] uppercase tracking-wider text-[#333333] mb-1">
                  {item.category}
                </div>
                <h4 className="font-serif font-bold text-base sm:text-lg text-[#111111] leading-snug group-hover:underline mb-1.5">
                  {item.title}
                </h4>
                <p className="font-sans text-xs sm:text-sm text-[#666666] leading-relaxed line-clamp-2 mb-3">
                  {item.excerpt}
                </p>
                <div className="font-sans text-[10px] uppercase tracking-wider text-gray-400">
                  BY {item.author} &bull; {item.date}
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
