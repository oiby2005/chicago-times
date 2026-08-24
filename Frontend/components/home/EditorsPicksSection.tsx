"use client";

import React from "react";
import Link from "next/link";

export const EditorsPicksSection: React.FC = () => {
  return (
    <section className="w-full font-sans select-none pb-4 pt-1 my-4">
      {/* Section Header */}
      <div className="border-b border-dashed border-[#CCCCCC] pb-2 mb-4">
        <h2 className="font-serif font-bold text-[24px] sm:text-[28px] text-[#2D2468] tracking-tight">
          Editor’s Picks
        </h2>
      </div>

      {/* Main Grid: Left & Center (8 of 12 cols) + Right Column (4 of 12 cols matching Business Category Section right column width) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        
        {/* ==================== LEFT & CENTER MAIN PACKAGE (8 of 12 cols ~ 67%) ==================== */}
        <div 
          className="lg:col-span-8 pr-0 lg:pr-[0.4cm]"
          style={{ borderRight: "1.5px solid #CCCCCC" }}
        >
          
          {/* Row 1 Top Feature Package */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pb-4 border-b border-dashed border-[#CCCCCC]">
            {/* Left Text Block (5 of 12 sub-cols) */}
            <div className="md:col-span-5 flex flex-col justify-start">
              <div className="flex items-center space-x-1.5 mb-1.5 font-sans font-bold text-[11px] uppercase tracking-wider">
                <span className="text-[#C00000]">NEW</span>
                <span className="text-[#888888]">|</span>
                <span className="text-[#444444]">INTERVIEW</span>
              </div>
              
              {/* Title matched to Business Secretary's wife font size (26px-30px) */}
              <h3 className="font-serif font-bold text-[26px] sm:text-[28px] lg:text-[30px] leading-[1.12] text-[#111111] hover:text-[#333333] hover:underline cursor-pointer mb-2">
                <Link href="/article/tanya-byron-stop-misusing-mental-health-terms">
                  Tanya Byron: Stop misusing mental health terms like ‘triggered’
                </Link>
              </h3>
              
              {/* Summary */}
              <p className="font-sans text-[12.5px] sm:text-[13px] leading-[1.4] text-[#555555]">
                The clinical psychologist has had enough of people adopting mental health labels to describe normal feelings such as grief, disappointment and sadness
              </p>
              
              {/* Health & Fitness Tag sitting directly near disappointment and sadness */}
              <div className="mt-1.5">
                <span className="font-sans font-bold text-[11.5px] text-[#111111]">
                  Health &amp; Fitness
                </span>
              </div>
            </div>

            {/* Right Large Hero Image (7 of 12 sub-cols) */}
            <div className="md:col-span-7">
              <Link href="/article/tanya-byron-stop-misusing-mental-health-terms" className="block relative w-full aspect-[4/3] sm:aspect-[16/10] overflow-hidden bg-gray-100 group">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1000&q=80"
                  alt="Tanya Byron"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
            </div>
          </div>

          {/* Row 2 Bottom 2 Side-by-Side Cards with Grey Solid Divider */}
          <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Bottom Card 1 with Grey Solid Vertical Border */}
            <article 
              className="flex items-start space-x-3 pr-0 sm:pr-4"
              style={{ borderRight: "1.5px solid #CCCCCC" }}
            >
              <Link href="/article/why-earl-spencer-is-still-haunted" className="shrink-0 block w-[160px] sm:w-[185px] h-[100px] sm:h-[115px] overflow-hidden bg-gray-100 border border-gray-200">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
                  alt="Earl Spencer"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </Link>
              <div className="flex-1 flex flex-col justify-between h-full min-h-[100px] sm:min-h-[115px]">
                <h4 className="font-serif font-bold text-[16px] sm:text-[17px] leading-[1.2] text-[#111111] hover:underline cursor-pointer">
                  <Link href="/article/why-earl-spencer-is-still-haunted">
                    Why Earl Spencer is still haunted by the ghost of Diana
                  </Link>
                </h4>
                <span className="font-sans font-bold text-[11px] text-[#555555] mt-1">
                  Royal family
                </span>
              </div>
            </article>

            {/* Bottom Card 2 */}
            <article className="flex items-start space-x-3 pl-0 sm:pl-2">
              <Link href="/article/emma-barnett-why-i-had-hysterectomy" className="shrink-0 block w-[160px] sm:w-[185px] h-[100px] sm:h-[115px] overflow-hidden bg-gray-100 border border-gray-200">
                <img
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80"
                  alt="Emma Barnett"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </Link>
              <div className="flex-1 flex flex-col justify-between h-full min-h-[100px] sm:min-h-[115px]">
                <h4 className="font-serif font-bold text-[16px] sm:text-[17px] leading-[1.2] text-[#111111] hover:underline cursor-pointer">
                  <Link href="/article/emma-barnett-why-i-had-hysterectomy">
                    Emma Barnett: Why I had the hysterectomy I never wanted to have
                  </Link>
                </h4>
                <span className="font-sans font-bold text-[11px] text-[#555555] mt-1">
                  Health &amp; Fitness
                </span>
              </div>
            </article>
          </div>

        </div>

        {/* ==================== RIGHT SIDEBAR 4 CARDS PACKAGE (4 of 12 cols ~ 33% matching Business Category Section right column width) ==================== */}
        <div className="lg:col-span-4 pl-0 lg:pl-[0.4cm] pt-6 lg:pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Right Sub-Column 1 with Grey Solid Vertical Border */}
            <div 
              className="flex flex-col justify-between pr-0 sm:pr-4"
              style={{ borderRight: "1.5px solid #CCCCCC" }}
            >
              {/* Card 1 */}
              <article className="pb-3 border-b border-dashed border-[#CCCCCC] flex-1 flex flex-col justify-between">
                <div>
                  <Link href="/article/undercover-drugs-cop-psychedelics" className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 mb-2 group">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
                      alt="Undercover drugs cop"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                  <span className="font-sans font-bold text-[10.5px] text-[#C00000] uppercase tracking-wider block mb-1">
                    NEW
                  </span>
                  <h4 className="font-serif font-bold text-[15px] sm:text-[15.5px] leading-[1.2] text-[#111111] hover:underline cursor-pointer">
                    <Link href="/article/undercover-drugs-cop-psychedelics">
                      I was an undercover drugs cop. Now I experiment with psychedelics
                    </Link>
                  </h4>
                </div>
              </article>

              {/* Card 2 */}
              <article className="pt-3 flex flex-col justify-between flex-1">
                <div>
                  <Link href="/article/best-worst-james-bond-themes" className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 mb-2 group">
                    <img
                      src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80"
                      alt="James Bond themes"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                  <h4 className="font-serif font-bold text-[15px] sm:text-[15.5px] leading-[1.2] text-[#111111] hover:underline cursor-pointer">
                    <Link href="/article/best-worst-james-bond-themes">
                      The best (and worst) James Bond themes — and who should sing it next
                    </Link>
                  </h4>
                </div>
                <span className="font-sans font-bold text-[11px] text-[#555555] mt-2 block">
                  Film
                </span>
              </article>
            </div>

            {/* Right Sub-Column 2 */}
            <div className="flex flex-col justify-between pl-0 sm:pl-2">
              {/* Card 3 */}
              <article className="pb-3 border-b border-dashed border-[#CCCCCC] flex-1 flex flex-col justify-between">
                <div>
                  <Link href="/article/the-books-we-couldnt-finish" className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 mb-2 group">
                    <img
                      src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=400&q=80"
                      alt="Books"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                  <h4 className="font-serif font-bold text-[15px] sm:text-[15.5px] leading-[1.2] text-[#111111] hover:underline cursor-pointer">
                    <Link href="/article/the-books-we-couldnt-finish">
                      The books we couldn’t finish — from American Psycho and Dubliners to Flesh
                    </Link>
                  </h4>
                </div>
                <span className="font-sans font-bold text-[11px] text-[#555555] mt-2 block">
                  Books
                </span>
              </article>

              {/* Card 4 */}
              <article className="pt-3 flex flex-col justify-between flex-1">
                <div>
                  <Link href="/article/king-charles-wont-slow-down" className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 mb-2 group">
                    <img
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80"
                      alt="King Charles"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                  <span className="font-sans font-bold text-[10.5px] text-[#00558c] uppercase tracking-wider block mb-1">
                    DEBORAH ROSS
                  </span>
                  <h4 className="font-serif font-bold text-[15px] sm:text-[15.5px] leading-[1.2] text-[#111111] hover:underline cursor-pointer">
                    <Link href="/article/king-charles-wont-slow-down">
                      King Charles won’t slow down and won’t do what he’s told
                    </Link>
                  </h4>
                </div>
                <span className="font-sans font-bold text-[11px] text-[#555555] mt-2 block">
                  Royal family
                </span>
              </article>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default EditorsPicksSection;
