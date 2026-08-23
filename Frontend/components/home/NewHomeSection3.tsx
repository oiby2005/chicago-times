"use client";

import React from "react";
import Link from "next/link";

export default function NewHomeSection3() {
  return (
    <section className="w-full bg-white text-[#111111] pt-2 pb-6">
      {/* ==================== SECTION 3: EDITOR'S PICKS ==================== */}
      <div className="border-t-2 border-black pt-2 mb-3">
        <h2 className="font-serif font-bold text-[22px] text-[#111111] tracking-tight">
          Editor’s Picks
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-6">
        {/* Editor's Picks Left Featured Column (6 of 12 cols) */}
        <div className="lg:col-span-6 border-b lg:border-b-0 lg:border-r lg:border-gray-300 lg:pr-6 pb-6 lg:pb-0">
          <article className="pb-4">
            <span className="inline-block bg-red-100 text-red-700 font-sans font-bold text-[10px] px-2 py-0.5 uppercase tracking-wider mb-2">
              NEW | INTERVIEW
            </span>
            <h3 className="font-serif font-bold text-[22px] sm:text-[24px] leading-[1.18] text-[#111111] hover:underline cursor-pointer mb-2">
              <Link prefetch={true} href="/article/tanya-byron-stop-misusing-mental-health-terms-triggered">
                Tanya Byron: Stop misusing mental health terms like ‘triggered’
              </Link>
            </h3>
            <p className="font-sans text-[13px] leading-[1.4] text-[#555555] mb-3">
              The clinical psychologist has had enough of people adopting mental health labels to describe normal feelings such as grief, disappointment and sadness.
            </p>
            <div className="font-sans text-[11px] text-gray-500 mb-3 font-semibold uppercase">
              HEALTH &amp; FITNESS
            </div>
            <Link
              href="/article/tanya-byron-stop-misusing-mental-health-terms-triggered"
              className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 border border-gray-200"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/harvard-woman.jpg"
                alt="Tanya Byron"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </Link>
          </article>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            <article>
              <Link href="/article/why-earl-spencer-haunted-ghost-diana" className="block relative aspect-[4/3] w-full overflow-hidden bg-gray-100 border border-gray-200 mb-2">
                <img src="/images/bourdain-movie.jpg" alt="Earl Spencer" className="w-full h-full object-cover" />
              </Link>
              <h4 className="font-serif font-bold text-[14.5px] leading-tight text-[#111111]">
                Why Earl Spencer is still haunted by the ghost of Diana
              </h4>
              <span className="font-sans text-[10px] text-gray-500 font-bold uppercase mt-1 block">ROYAL FAMILY</span>
            </article>

            <article>
              <Link href="/article/emma-barnett-hysterectomy-never-wanted" className="block relative aspect-[4/3] w-full overflow-hidden bg-gray-100 border border-gray-200 mb-2">
                <img src="/images/ariana-grande.jpg" alt="Emma Barnett" className="w-full h-full object-cover" />
              </Link>
              <h4 className="font-serif font-bold text-[14.5px] leading-tight text-[#111111]">
                Emma Barnett: Why I had the hysterectomy I never wanted to have
              </h4>
              <span className="font-sans text-[10px] text-gray-500 font-bold uppercase mt-1 block">HEALTH &amp; FITNESS</span>
            </article>
          </div>
        </div>

        {/* Editor's Picks Right Grid (6 of 12 cols) */}
        <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <article>
            <Link href="/article/undercover-drug-cop-psychedelics" className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 border border-gray-200 mb-2">
              <img src="/images/handcuffs-money.jpg" alt="Undercover drug cop" className="w-full h-full object-cover" />
            </Link>
            <h4 className="font-serif font-bold text-[16px] leading-[1.22] text-[#111111] hover:underline cursor-pointer">
              I was an undercover drug cop. Now I experiment with psychedelics
            </h4>
            <span className="font-sans text-[10px] text-gray-500 font-bold uppercase mt-1 block">BOOKS</span>
          </article>

          <article>
            <Link href="/article/books-we-couldnt-finish-american-psycho" className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 border border-gray-200 mb-2">
              <img src="/images/wine-plane.jpg" alt="Books couldnt finish" className="w-full h-full object-cover" />
            </Link>
            <h4 className="font-serif font-bold text-[16px] leading-[1.22] text-[#111111] hover:underline cursor-pointer">
              The books we couldn’t finish — from American Psycho and Dubliners to Flesh
            </h4>
            <span className="font-sans text-[10px] text-gray-500 font-bold uppercase mt-1 block">BOOKS</span>
          </article>

          <article>
            <Link href="/article/best-worst-james-bond-themes" className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 border border-gray-200 mb-2">
              <img src="/images/dc-townhouse.jpg" alt="James Bond themes" className="w-full h-full object-cover" />
            </Link>
            <h4 className="font-serif font-bold text-[16px] leading-[1.22] text-[#111111] hover:underline cursor-pointer">
              The best (and worst) James Bond themes — and who should sing it next
            </h4>
            <span className="font-sans text-[10px] text-gray-500 font-bold uppercase mt-1 block">FILM</span>
          </article>

          <article>
            <Link href="/article/king-charles-wont-slow-down" className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 border border-gray-200 mb-2">
              <img src="/images/kevin_warsh.jpg" alt="King Charles" className="w-full h-full object-cover" />
            </Link>
            <h4 className="font-serif font-bold text-[16px] leading-[1.22] text-[#111111] hover:underline cursor-pointer">
              King Charles won’t slow down and won’t do what he’s told
            </h4>
            <span className="font-sans text-[10px] text-gray-500 font-bold uppercase mt-1 block">ROYAL FAMILY</span>
          </article>
        </div>
      </div>

      {/* ==================== SECTION 4: YOUR WEEKEND, WSJ PROMOTION & FREE EXPRESSION ==================== */}
      <div className="border-t border-gray-300 pt-6 mt-4">
        {/* WSJ Promotion Banner matching reference */}
        <div className="border border-gray-300 p-6 sm:p-8 bg-[#fafafa] flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <div className="flex-1 max-w-xl">
            <span className="font-sans font-extrabold text-[10px] tracking-widest text-blue-700 uppercase block mb-1">
              WSJ PROMOTION
            </span>
            <h3 className="font-serif font-bold text-[22px] sm:text-[26px] text-[#111111] leading-tight mb-2">
              Special Offer
            </h3>
            <p className="font-sans text-[13px] text-[#444444] mb-4 leading-relaxed">
              Trust your source. Trust your decisions. Let WSJ’s fact-based journalism help you make sense of what’s already happened and navigate what’s ahead.
            </p>
            <Link
              href="/special-offer"
              className="bg-[#007cb9] hover:bg-[#005599] text-white font-sans font-bold text-[12.5px] px-6 py-2.5 inline-block transition-colors shadow-2xs"
            >
              VIEW MEMBERSHIP OPTIONS
            </Link>
          </div>
          <div className="shrink-0 text-center border-t md:border-t-0 md:border-l border-gray-300 pt-4 md:pt-0 md:pl-8">
            <img src="/images/design-reference/Times Chicago.svg" alt="Times Chicago" className="h-10 sm:h-12 w-auto mx-auto mb-1" />
            <span className="font-sans text-[9px] font-bold text-gray-500 uppercase tracking-widest block">IT'S YOUR BUSINESS</span>
          </div>
        </div>

        {/* Your Weekend & Free Expression 12-col Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Your Weekend Column (8 of 12 cols) */}
          <div className="lg:col-span-8 lg:border-r lg:border-gray-300 lg:pr-6">
            <div className="border-t border-black pt-2 mb-3">
              <h3 className="font-serif font-bold text-[18px] text-[#111111]">Your Weekend</h3>
            </div>
            <article className="pb-4">
              <Link href="/article/why-it-is-impossible-to-get-a-restaurant-reservation" className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 border border-gray-200 mb-3">
                <img src="/images/berkshire_resort.jpg" alt="Restaurant reservation" className="w-full h-full object-cover" />
              </Link>
              <h3 className="font-serif font-bold text-[22px] leading-tight text-[#111111] hover:underline cursor-pointer mb-2">
                Why It Is Impossible to Get a Restaurant Reservation
              </h3>
              <p className="font-sans text-[13px] text-[#555555]">
                New apps, membership clubs and other middlemen are fighting over access to high-spending customers and the eateries they love.
              </p>
            </article>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-gray-200">
              <article>
                <h4 className="font-serif font-bold text-[15px] leading-tight text-[#111111]">
                  The Cyberattack That Brought a Distant War to Small-Town Minnesota
                </h4>
              </article>
              <article>
                <h4 className="font-serif font-bold text-[15px] leading-tight text-[#111111]">
                  Situational Awareness Sets Save Million-on-Stealth-Chip Startup After Crash
                </h4>
              </article>
            </div>
          </div>

          {/* WSJ Opinion | Free Expression Column (4 of 12 cols) */}
          <div className="lg:col-span-4 bg-[#f8f9fa] border border-gray-200 p-5">
            <div className="border-b border-black pb-2 mb-3">
              <h3 className="font-serif font-bold text-[16px] text-[#111111] uppercase tracking-wider">
                WSJ Opinion | Free Expression
              </h3>
            </div>
            <div className="space-y-4">
              <article>
                <h4 className="font-serif font-bold text-[15px] leading-tight text-[#111111]">
                  Trump Should Worry About 1968
                </h4>
                <span className="font-sans text-[11px] text-gray-500 block mt-0.5">By Matthew Continetti</span>
              </article>
              <article className="pt-3 border-t border-gray-200">
                <h4 className="font-serif font-bold text-[15px] leading-tight text-[#111111]">
                  Gawking at Ariana Grande Isn’t Noble
                </h4>
                <span className="font-sans text-[11px] text-gray-500 block mt-0.5">By Emma Camp</span>
              </article>
              <article className="pt-3 border-t border-gray-200">
                <h4 className="font-serif font-bold text-[15px] leading-tight text-[#111111]">
                  No Day at the Beach
                </h4>
                <span className="font-sans text-[11px] text-gray-500 block mt-0.5">By Christopher A. Scale</span>
              </article>
            </div>
            <div className="mt-5 pt-3 border-t border-gray-300">
              <Link href="/opinion" className="block text-center bg-[#334155] hover:bg-[#1e293b] text-white font-sans font-bold text-[12px] py-2 transition-colors">
                Go to Free Expression
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== AD 03 BANNER ==================== */}
      <div className="w-full bg-gray-100 border border-gray-300 h-[120px] sm:h-[140px] flex items-center justify-center my-6">
        <span className="font-serif font-bold text-[32px] text-gray-700">Ad 03</span>
      </div>
    </section>
  );
}

