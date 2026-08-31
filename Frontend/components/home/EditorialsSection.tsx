"use client";

import React from "react";
import Link from "next/link";

interface EditorialArticle {
  id: string;
  title: string;
  author: string;
  date: string;
  hasFollowButton?: boolean;
  slug: string;
  imageUrl: string;
}

const defaultArticles: EditorialArticle[] = [
  {
    id: "ed1",
    title: "Trump Should Worry About a ‘10-Year Itch’",
    author: "Matthew Continetti",
    date: "Aug. 7",
    hasFollowButton: true,
    slug: "trump-should-worry-about-10-year-itch",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "ed2",
    title: "Gawking at Ariana Grande Isn’t Noble",
    author: "Emma Camp",
    date: "Aug. 7",
    hasFollowButton: true,
    slug: "gawking-at-ariana-grande-isnt-noble",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "ed3",
    title: "No Day at the Beach",
    author: "Christopher J. Scalia",
    date: "Aug. 7",
    hasFollowButton: false,
    slug: "no-day-at-the-beach",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=80",
  },
];

export const EditorialsSection: React.FC = () => {
  const [articles, setArticles] = React.useState<EditorialArticle[]>(defaultArticles);

  const loadPosts = React.useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("wsj_posts");
      if (stored) {
        const posts = JSON.parse(stored);
        const edPosts = posts.filter((p: any) => {
          if (p.status !== "Published") return false;
          const placement = (p.homepagePlacement || "None").toLowerCase();
          if (placement.includes("editorial") || placement.includes("opinion")) return true;
          if (!placement.startsWith("none")) return false;
          const cat = (p.category || "").toLowerCase().trim();
          return cat === "editorial" || cat === "editorials" || cat === "opinion" || cat === "opinions";
        });

        edPosts.sort((a: any, b: any) => (b.publishedAt || 0) - (a.publishedAt || 0));

        if (edPosts.length > 0) {
          const formatted: EditorialArticle[] = edPosts.slice(0, 3).map((p: any) => ({
            id: p.id,
            title: p.title,
            author: p.author || "EDITORIAL BOARD",
            date: p.date || "Today",
            hasFollowButton: true,
            slug: p.slug || p.id,
            imageUrl: p.thumbnail || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
          }));

          const merged = [...formatted];
          for (let i = 0; i < defaultArticles.length && merged.length < 3; i++) {
            if (!merged.some((m) => m.id === defaultArticles[i].id)) {
              merged.push(defaultArticles[i]);
            }
          }
          setArticles(merged.slice(0, 3));
          return;
        }
      }
    } catch (e) {}
    setArticles(defaultArticles);
  }, []);

  React.useEffect(() => {
    loadPosts();
    window.addEventListener("wsj_posts_updated", loadPosts);
    return () => window.removeEventListener("wsj_posts_updated", loadPosts);
  }, [loadPosts]);

  return (
    <div className="w-full font-sans select-none bg-white border border-[#E5E0D5] overflow-hidden my-2">
      {/* Header Banner */}
      <div className="bg-[#43646B] text-white px-3.5 py-3 flex items-center">
        <h3 className="font-sans font-bold text-[15px] sm:text-[16px] tracking-tight">
          WSJ Opinion <span className="font-normal mx-0.5">|</span> Free Expression
        </h3>
      </div>

      {/* Editorial Items Container */}
      <div className="p-3.5 space-y-4">
        {articles.map((art, idx) => (
          <React.Fragment key={art.id}>
            <article className="flex items-start justify-between space-x-3">
              <div className="flex-1">
                <h4 className="font-serif font-bold text-[15px] sm:text-[16px] leading-[1.2] text-[#111111] hover:underline cursor-pointer mb-1.5">
                  <Link href={`/article/${art.slug}`}>
                    {art.title}
                  </Link>
                </h4>
                
                <div className="flex items-center flex-wrap gap-1.5 font-sans text-[12px] text-[#444444] mb-1">
                  <span>By {art.author}</span>
                  {art.hasFollowButton && (
                    <button className="bg-[#43646B] text-white font-sans font-bold text-[10.5px] rounded px-2.5 py-0.5 hover:bg-[#344F55] transition-colors cursor-pointer">
                      Follow
                    </button>
                  )}
                </div>

                <div className="font-sans text-[11px] text-[#777777]">
                  {art.date}
                </div>
              </div>

              {/* Square Thumbnail */}
              <Link href={`/article/${art.slug}`} className="shrink-0 block w-[68px] h-[68px] sm:w-[72px] sm:h-[72px] overflow-hidden bg-gray-100 border border-gray-200">
                <img
                  src={art.imageUrl}
                  alt={art.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </Link>
            </article>

            {/* Separator between items */}
            {idx < articles.length - 1 && (
              <hr className="border-t border-[#E5E0D5] my-3" />
            )}
          </React.Fragment>
        ))}

        {/* Bottom CTA Button */}
        <div className="pt-2">
          <Link
            href="/opinion"
            className="block w-full bg-[#43646B] text-white font-sans font-bold text-[13.5px] sm:text-[14px] py-2.5 text-center rounded-none hover:bg-[#344F55] transition-colors"
          >
            Go to Free Expression
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EditorialsSection;
