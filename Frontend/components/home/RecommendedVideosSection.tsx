"use client";

import React from "react";
import Link from "next/link";

interface RecommendedVideo {
  id: string;
  title: string;
  slug: string;
  imageUrl: string;
}

const recommendedVideos: RecommendedVideo[] = [
  {
    id: "rv1",
    title: "Pizza Hut Lost in the U.S. Now It’s Selling for $2.7B.",
    slug: "pizza-hut-lost-in-us-selling-for-2-7b",
    imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "rv2",
    title: "How One Family’s Flower Farm Became Essential to Chanel No. 5",
    slug: "flower-farm-essential-to-chanel-no-5",
    imageUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "rv3",
    title: "Inside the Pacific Wargames Watched by America’s Adversaries",
    slug: "pacific-wargames-watched-by-americas-adversaries",
    imageUrl: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "rv4",
    title: "WSJ Opinion: Hits and Misses",
    slug: "wsj-opinion-hits-and-misses",
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "rv5",
    title: "The Evolution of Modern Motorsports",
    slug: "evolution-of-modern-motorsports",
    imageUrl: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=400&q=80",
  },
];

export const RecommendedVideosSection: React.FC = () => {
  return (
    <div className="w-full font-sans select-none pt-4 pb-2 my-0">
      {/* Section Title */}
      <div className="mb-4">
        <h3 className="font-sans font-bold text-[20px] text-[#111111] tracking-tight">
          Recommended Videos
        </h3>
      </div>

      {/* Videos List */}
      <div className="flex flex-col space-y-4">
        {recommendedVideos.map((video) => (
          <article key={video.id} className="flex items-start justify-between gap-3">
            {/* Title */}
            <h4 className="font-serif font-bold text-[15px] sm:text-[16px] leading-[1.2] text-[#111111] hover:underline cursor-pointer flex-1">
              <Link href={`/article/${video.slug}`}>
                {video.title}
              </Link>
            </h4>

            {/* Thumbnail with Play Icon Overlay */}
            <Link
              href={`/article/${video.slug}`}
              className="relative w-[105px] sm:w-[115px] aspect-[16/10] overflow-hidden bg-gray-100 flex-shrink-0 group"
            >
              <img
                src={video.imageUrl}
                alt={video.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/25 group-hover:bg-black/35 transition-colors">
                <div className="w-7 h-7 rounded-full bg-black/60 border border-white/80 flex items-center justify-center text-white">
                  <svg className="w-3.5 h-3.5 fill-current ml-0.5" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
};

export default RecommendedVideosSection;
