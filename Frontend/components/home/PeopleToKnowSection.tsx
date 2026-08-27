"use client";

import React from "react";
import Link from "next/link";

interface PeopleArticle {
  id: string;
  title: string;
  slug: string;
  summary: string;
  imageUrl: string;
  commentCount?: number;
}

const defaultArticles: PeopleArticle[] = [
  {
    id: "ptk1",
    title: "The Lakers Heiress at the Center of the NBA’s Nastiest Succession Drama",
    slug: "the-lakers-heiress-nba-succession-drama",
    summary: "When Mark Walter sold the Lakers last week, it touched off an unexpected side battle: the handpicked inheritor of Jerry Buss’ franchise vs. five of her siblings.",
    imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80",
    commentCount: 152,
  },
  {
    id: "ptk2",
    title: "How Trump’s Ever-Present Executive Assistant Became the Talk of Washington",
    slug: "how-trumps-executive-assistant-became-talk-of-washington",
    summary: "Natalie Harp, a personal aide to the president, has become an object of fascination for both the left and right.",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    commentCount: 2008,
  },
  {
    id: "ptk3",
    title: "What to Know About Florida Progressive Angie Nixon",
    slug: "what-to-know-about-florida-progressive-angie-nixon",
    summary: "The Democratic socialist and state representative scored an upset victory in Florida’s Senate primary.",
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
    commentCount: 195,
  },
];

const extractText = (html: string): string => {
  if (typeof window === "undefined") return "";
  const tmp = document.createElement("div");
  tmp.innerHTML = html || "";
  return (tmp.textContent || tmp.innerText || "").trim().slice(0, 140);
};

const usePeopleToKnowArticles = () => {
  const [articles, setArticles] = React.useState<PeopleArticle[]>(defaultArticles);

  const loadPosts = React.useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("wsj_posts");
      if (stored) {
        const posts = JSON.parse(stored);
        const ptkPosts = posts.filter(
          (p: any) =>
            p.status === "Published" &&
            p.homepagePlacement &&
            p.homepagePlacement.includes("People to know")
        );

        ptkPosts.sort((a: any, b: any) => (b.publishedAt || 0) - (a.publishedAt || 0));

        if (ptkPosts.length > 0) {
          const formatted: PeopleArticle[] = ptkPosts.slice(0, 3).map((p: any) => ({
            id: p.id,
            title: p.title,
            slug: p.slug || p.id,
            summary: p.subheadline || extractText(p.bodyContent) || "",
            imageUrl: p.thumbnail || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80",
            commentCount: p.commentsCount || 0,
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

  return articles;
};

export const PeopleToKnowTop: React.FC = () => {
  const articles = usePeopleToKnowArticles();
  const leftHero = articles[0] || defaultArticles[0];
  const rightTop = articles[1] || defaultArticles[1];

  return (
    <div className="w-full font-sans select-none mt-2 mb-0 pt-0 pb-0">
      <div className="mb-3">
        <h2 className="font-serif font-bold text-[24px] sm:text-[28px] text-[#111111] tracking-tight">
          People to Know
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 pt-1 pb-0 items-stretch">
        {/* COLUMN 1: LEFT CARD PHOTO */}
        <article 
          className="pr-0 md:pr-4 flex flex-col justify-start pb-0"
          style={{ borderRight: "1px solid #CCCCCC" }}
        >
          <Link
            href={`/article/${leftHero.slug}`}
            className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 group"
          >
            <img
              src={leftHero.imageUrl}
              alt={leftHero.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </Link>
        </article>

        {/* COLUMN 2: CENTER AD 04 BOX */}
        <div 
          className="px-0 md:px-4 py-0 flex flex-col items-center justify-start pb-0"
          style={{ borderRight: "1px solid #CCCCCC" }}
        >
          <div className="w-full aspect-[16/10] bg-[#E8E3D7] border border-[#D6CEBF] flex items-center justify-center text-center p-4">
            <span className="font-sans font-bold text-2xl sm:text-3xl text-[#111111] tracking-tight">
              Ad 04
            </span>
          </div>
        </div>

        {/* COLUMN 3: TOP STORY */}
        <div className="pl-0 md:pl-4 pt-0 flex flex-col justify-start pb-0">
          <article className="pb-2.5 border-b border-dashed border-[#CCCCCC]">
            <h4 className="font-serif font-bold text-[17px] sm:text-[18px] leading-[1.2] text-[#111111] hover:underline cursor-pointer mb-1.5">
              <Link href={`/article/${rightTop.slug}`}>
                {rightTop.title}
              </Link>
            </h4>
            {rightTop.summary && (
              <p className="font-sans text-[13px] leading-relaxed text-[#555555] mb-2 line-clamp-3">
                {rightTop.summary}
              </p>
            )}
            {rightTop.commentCount !== undefined && rightTop.commentCount > 0 && (
              <div className="font-sans text-[12px] text-[#777777] flex items-center space-x-1">
                <span>💬</span>
                <span>{rightTop.commentCount}</span>
              </div>
            )}
          </article>
        </div>
      </div>
    </div>
  );
};

export const PeopleToKnowBottom: React.FC = () => {
  const articles = usePeopleToKnowArticles();
  const leftHero = articles[0] || defaultArticles[0];
  const rightBottom = articles[2] || defaultArticles[2];

  return (
    <div className="w-full font-sans select-none pt-0 mt-0">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 pt-0 pb-2 items-stretch">
        {/* COLUMN 1: LEFT CARD HEADLINE + PARAGRAPH */}
        <div 
          className="pr-0 md:pr-4 flex flex-col justify-between pt-2"
          style={{ borderRight: "1px solid #CCCCCC" }}
        >
          <div>
            <h3 className="font-serif font-bold text-[18px] sm:text-[20px] leading-[1.18] text-[#111111] hover:underline cursor-pointer mb-2">
              <Link href={`/article/${leftHero.slug}`}>
                {leftHero.title}
              </Link>
            </h3>
            {leftHero.summary && (
              <p className="font-sans text-[13px] leading-relaxed text-[#555555] mb-2 line-clamp-3">
                {leftHero.summary}
              </p>
            )}
          </div>
          {leftHero.commentCount !== undefined && leftHero.commentCount > 0 && (
            <div className="font-sans text-[12px] text-[#777777] flex items-center space-x-1 mt-2">
              <span>💬</span>
              <span>{leftHero.commentCount}</span>
            </div>
          )}
        </div>

        {/* COLUMN 2: CENTER SPACER */}
        <div 
          className="px-0 md:px-4 py-0"
          style={{ borderRight: "1px solid #CCCCCC" }}
        />

        {/* COLUMN 3: BOTTOM STORY */}
        <div className="pl-0 md:pl-4 pt-2 flex flex-col justify-between">
          <article className="flex-1 flex flex-col justify-between">
            <div>
              <h4 className="font-serif font-bold text-[17px] sm:text-[18px] leading-[1.2] text-[#111111] hover:underline cursor-pointer mb-1.5">
                <Link href={`/article/${rightBottom.slug}`}>
                  {rightBottom.title}
                </Link>
              </h4>
              {rightBottom.summary && (
                <p className="font-sans text-[13px] leading-relaxed text-[#555555] mb-2 line-clamp-3">
                  {rightBottom.summary}
                </p>
              )}
            </div>
            {rightBottom.commentCount !== undefined && rightBottom.commentCount > 0 && (
              <div className="font-sans text-[12px] text-[#777777] flex items-center space-x-1 mt-1">
                <span>💬</span>
                <span>{rightBottom.commentCount}</span>
              </div>
            )}
          </article>
        </div>
      </div>
    </div>
  );
};

export const PeopleToKnowSection: React.FC = () => {
  return (
    <>
      <PeopleToKnowTop />
      <PeopleToKnowBottom />
    </>
  );
};

export default PeopleToKnowSection;
