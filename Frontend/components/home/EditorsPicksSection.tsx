"use client";

import React from "react";
import Link from "next/link";

interface PickArticle {
  id: string;
  categoryTag?: string;
  title: string;
  slug: string;
  summary?: string;
  imageUrl: string;
  sectionTag?: string;
}

const defaultHero: PickArticle = {
  id: "ep1",
  categoryTag: "NEW | INTERVIEW",
  title: "Tanya Byron: Stop misusing mental health terms like ‘triggered’",
  slug: "tanya-byron-stop-misusing-mental-health-terms",
  summary: "The clinical psychologist has had enough of people adopting mental health labels to describe normal feelings such as grief, disappointment and sadness",
  imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1000&q=80",
  sectionTag: "Health & Fitness",
};

const defaultBottomCards: PickArticle[] = [
  {
    id: "ep2",
    title: "Why Earl Spencer is still haunted by the ghost of Diana",
    slug: "why-earl-spencer-is-still-haunted",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    sectionTag: "Royal family",
  },
  {
    id: "ep3",
    title: "Emma Barnett: Why I had the hysterectomy I never wanted to have",
    slug: "emma-barnett-why-i-had-hysterectomy",
    imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80",
    sectionTag: "Health & Fitness",
  },
];

const defaultRightCards: PickArticle[] = [
  {
    id: "ep4",
    categoryTag: "NEW",
    title: "I was an undercover drugs cop. Now I experiment with psychedelics",
    slug: "undercover-drugs-cop-psychedelics",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "ep5",
    title: "The best (and worst) James Bond themes — and who should sing it next",
    slug: "best-worst-james-bond-themes",
    imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80",
    sectionTag: "Film",
  },
  {
    id: "ep6",
    title: "The books we couldn’t finish — from American Psycho and Dubliners to Flesh",
    slug: "the-books-we-couldnt-finish",
    imageUrl: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=400&q=80",
    sectionTag: "Books",
  },
  {
    id: "ep7",
    categoryTag: "DEBORAH ROSS",
    title: "King Charles won’t slow down and won’t do what he’s told",
    slug: "king-charles-wont-slow-down",
    imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    sectionTag: "Royal family",
  },
];

const extractText = (html: string): string => {
  if (typeof window === "undefined") return "";
  const tmp = document.createElement("div");
  tmp.innerHTML = html || "";
  return (tmp.textContent || tmp.innerText || "").trim().slice(0, 140);
};

export const EditorsPicksSection: React.FC = () => {
  const [hero, setHero] = React.useState<PickArticle>(defaultHero);
  const [bottomCards, setBottomCards] = React.useState<PickArticle[]>(defaultBottomCards);
  const [rightCards, setRightCards] = React.useState<PickArticle[]>(defaultRightCards);

  const loadPosts = React.useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("wsj_posts");
      if (stored) {
        const posts = JSON.parse(stored);
        const pickPosts = posts.filter(
          (p: any) =>
            p.status === "Published" &&
            (p.homepagePlacement && (p.homepagePlacement.includes("Editors Picks") || p.homepagePlacement.includes("Editor's Picks")))
        );

        pickPosts.sort((a: any, b: any) => (b.publishedAt || 0) - (a.publishedAt || 0));

        if (pickPosts.length > 0) {
          const formatted: PickArticle[] = pickPosts.map((p: any) => ({
            id: p.id,
            title: p.title,
            slug: p.slug || p.id,
            summary: p.subheadline || extractText(p.bodyContent) || "",
            imageUrl: p.thumbnail || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1000&q=80",
            sectionTag: p.subCategories?.[0] || p.category,
          }));

          if (formatted[0]) setHero(formatted[0]);

          const bCards = [...formatted.slice(1, 3)];
          for (let i = 0; i < defaultBottomCards.length && bCards.length < 2; i++) {
            if (!bCards.some((c) => c.id === defaultBottomCards[i].id)) {
              bCards.push(defaultBottomCards[i]);
            }
          }
          setBottomCards(bCards.slice(0, 2));

          const rCards = [...formatted.slice(3, 7)];
          for (let i = 0; i < defaultRightCards.length && rCards.length < 4; i++) {
            if (!rCards.some((c) => c.id === defaultRightCards[i].id)) {
              rCards.push(defaultRightCards[i]);
            }
          }
          setRightCards(rCards.slice(0, 4));
          return;
        }
      }
    } catch (e) {}
    setHero(defaultHero);
    setBottomCards(defaultBottomCards);
    setRightCards(defaultRightCards);
  }, []);

  React.useEffect(() => {
    loadPosts();
    window.addEventListener("wsj_posts_updated", loadPosts);
    return () => window.removeEventListener("wsj_posts_updated", loadPosts);
  }, [loadPosts]);

  return (
    <section className="w-full font-sans select-none pb-4 pt-1 my-4">
      {/* Section Header */}
      <div className="border-b border-dashed border-[#CCCCCC] pb-2 mb-4">
        <h2 className="font-serif font-bold text-[24px] sm:text-[28px] text-[#2D2468] tracking-tight">
          Editor’s Picks
        </h2>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* LEFT & CENTER MAIN PACKAGE */}
        <div 
          className="lg:col-span-8 pr-0 lg:pr-[0.4cm]"
          style={{ borderRight: "1.5px solid #CCCCCC" }}
        >
          {/* Row 1 Top Feature Package */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pb-4 border-b border-dashed border-[#CCCCCC]">
            {/* Left Text Block */}
            <div className="md:col-span-5 flex flex-col justify-start">
              {hero.categoryTag && (
                <div className="flex items-center space-x-1.5 mb-1.5 font-sans font-bold text-[11px] uppercase tracking-wider">
                  <span className="text-[#C00000]">{hero.categoryTag}</span>
                </div>
              )}
              
              <h3 className="font-serif font-bold text-[26px] sm:text-[28px] lg:text-[30px] leading-[1.12] text-[#111111] hover:text-[#333333] hover:underline cursor-pointer mb-2">
                <Link href={`/article/${hero.slug}`}>
                  {hero.title}
                </Link>
              </h3>
              
              {hero.summary && (
                <p className="font-sans text-[12.5px] sm:text-[13px] leading-[1.4] text-[#555555] line-clamp-3">
                  {hero.summary}
                </p>
              )}
              
              {hero.sectionTag && (
                <div className="mt-1.5">
                  <span className="font-sans font-bold text-[11.5px] text-[#111111]">
                    {hero.sectionTag}
                  </span>
                </div>
              )}
            </div>

            {/* Right Large Hero Image */}
            <div className="md:col-span-7">
              <Link href={`/article/${hero.slug}`} className="block relative w-full aspect-[4/3] sm:aspect-[16/10] overflow-hidden bg-gray-100 group">
                <img
                  src={hero.imageUrl}
                  alt={hero.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
            </div>
          </div>

          {/* Row 2 Bottom 2 Side-by-Side Cards */}
          <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {bottomCards[0] && (
              <article 
                className="flex items-start space-x-3 pr-0 sm:pr-4"
                style={{ borderRight: "1.5px solid #CCCCCC" }}
              >
                <Link href={`/article/${bottomCards[0].slug}`} className="shrink-0 block w-[160px] sm:w-[185px] h-[100px] sm:h-[115px] overflow-hidden bg-gray-100 border border-gray-200">
                  <img
                    src={bottomCards[0].imageUrl}
                    alt={bottomCards[0].title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </Link>
                <div className="flex-1 flex flex-col justify-between h-full min-h-[100px] sm:min-h-[115px]">
                  <h4 className="font-serif font-bold text-[16px] sm:text-[17px] leading-[1.2] text-[#111111] hover:underline cursor-pointer">
                    <Link href={`/article/${bottomCards[0].slug}`}>
                      {bottomCards[0].title}
                    </Link>
                  </h4>
                  {bottomCards[0].sectionTag && (
                    <span className="font-sans font-bold text-[11px] text-[#555555] mt-1">
                      {bottomCards[0].sectionTag}
                    </span>
                  )}
                </div>
              </article>
            )}

            {bottomCards[1] && (
              <article className="flex items-start space-x-3 pl-0 sm:pl-2">
                <Link href={`/article/${bottomCards[1].slug}`} className="shrink-0 block w-[160px] sm:w-[185px] h-[100px] sm:h-[115px] overflow-hidden bg-gray-100 border border-gray-200">
                  <img
                    src={bottomCards[1].imageUrl}
                    alt={bottomCards[1].title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </Link>
                <div className="flex-1 flex flex-col justify-between h-full min-h-[100px] sm:min-h-[115px]">
                  <h4 className="font-serif font-bold text-[16px] sm:text-[17px] leading-[1.2] text-[#111111] hover:underline cursor-pointer">
                    <Link href={`/article/${bottomCards[1].slug}`}>
                      {bottomCards[1].title}
                    </Link>
                  </h4>
                  {bottomCards[1].sectionTag && (
                    <span className="font-sans font-bold text-[11px] text-[#555555] mt-1">
                      {bottomCards[1].sectionTag}
                    </span>
                  )}
                </div>
              </article>
            )}
          </div>
        </div>

        {/* RIGHT SIDEBAR 4 CARDS PACKAGE */}
        <div className="lg:col-span-4 pl-0 lg:pl-[0.4cm] pt-6 lg:pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div 
              className="flex flex-col justify-between pr-0 sm:pr-4"
              style={{ borderRight: "1.5px solid #CCCCCC" }}
            >
              {rightCards[0] && (
                <article className="pb-3 border-b border-dashed border-[#CCCCCC] flex-1 flex flex-col justify-between">
                  <div>
                    <Link href={`/article/${rightCards[0].slug}`} className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 mb-2 group">
                      <img
                        src={rightCards[0].imageUrl}
                        alt={rightCards[0].title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>
                    {rightCards[0].categoryTag && (
                      <span className="font-sans font-bold text-[10.5px] text-[#C00000] uppercase tracking-wider block mb-1">
                        {rightCards[0].categoryTag}
                      </span>
                    )}
                    <h4 className="font-serif font-bold text-[15px] sm:text-[15.5px] leading-[1.2] text-[#111111] hover:underline cursor-pointer">
                      <Link href={`/article/${rightCards[0].slug}`}>
                        {rightCards[0].title}
                      </Link>
                    </h4>
                  </div>
                </article>
              )}

              {rightCards[1] && (
                <article className="pt-3 flex flex-col justify-between flex-1">
                  <div>
                    <Link href={`/article/${rightCards[1].slug}`} className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 mb-2 group">
                      <img
                        src={rightCards[1].imageUrl}
                        alt={rightCards[1].title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>
                    <h4 className="font-serif font-bold text-[15px] sm:text-[15.5px] leading-[1.2] text-[#111111] hover:underline cursor-pointer">
                      <Link href={`/article/${rightCards[1].slug}`}>
                        {rightCards[1].title}
                      </Link>
                    </h4>
                  </div>
                  {rightCards[1].sectionTag && (
                    <span className="font-sans font-bold text-[11px] text-[#555555] mt-2 block">
                      {rightCards[1].sectionTag}
                    </span>
                  )}
                </article>
              )}
            </div>

            <div className="flex flex-col justify-between pl-0 sm:pl-2">
              {rightCards[2] && (
                <article className="pb-3 border-b border-dashed border-[#CCCCCC] flex-1 flex flex-col justify-between">
                  <div>
                    <Link href={`/article/${rightCards[2].slug}`} className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 mb-2 group">
                      <img
                        src={rightCards[2].imageUrl}
                        alt={rightCards[2].title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>
                    <h4 className="font-serif font-bold text-[15px] sm:text-[15.5px] leading-[1.2] text-[#111111] hover:underline cursor-pointer">
                      <Link href={`/article/${rightCards[2].slug}`}>
                        {rightCards[2].title}
                      </Link>
                    </h4>
                  </div>
                  {rightCards[2].sectionTag && (
                    <span className="font-sans font-bold text-[11px] text-[#555555] mt-2 block">
                      {rightCards[2].sectionTag}
                    </span>
                  )}
                </article>
              )}

              {rightCards[3] && (
                <article className="pt-3 flex flex-col justify-between flex-1">
                  <div>
                    <Link href={`/article/${rightCards[3].slug}`} className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 mb-2 group">
                      <img
                        src={rightCards[3].imageUrl}
                        alt={rightCards[3].title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>
                    {rightCards[3].categoryTag && (
                      <span className="font-sans font-bold text-[10.5px] text-[#00558c] uppercase tracking-wider block mb-1">
                        {rightCards[3].categoryTag}
                      </span>
                    )}
                    <h4 className="font-serif font-bold text-[15px] sm:text-[15.5px] leading-[1.2] text-[#111111] hover:underline cursor-pointer">
                      <Link href={`/article/${rightCards[3].slug}`}>
                        {rightCards[3].title}
                      </Link>
                    </h4>
                  </div>
                  {rightCards[3].sectionTag && (
                    <span className="font-sans font-bold text-[11px] text-[#555555] mt-2 block">
                      {rightCards[3].sectionTag}
                    </span>
                  )}
                </article>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditorsPicksSection;
