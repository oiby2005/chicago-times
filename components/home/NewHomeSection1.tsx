"use client";

import React from "react";
import Link from "next/link";

export default function NewHomeSection1() {
  return (
    <section className="w-full bg-white text-[#111111] pt-2 pb-6">
      {/* Top Advertisement Label */}
      <div className="text-center py-2 mb-3">
        <span className="text-[10px] font-sans text-gray-400 uppercase tracking-widest">
          Advertisement
        </span>
      </div>

      {/* 3-Column Desktop/Laptop Layout Matching Screenshots 1 - 5 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 pb-8">
        
        {/* ==================== COLUMN 1: LEFT COLUMN (3 of 12 cols ~ 25%) ==================== */}
        <div className="lg:col-span-3 pr-0 lg:pr-5 pb-6 lg:pb-0 flex flex-col divide-y divide-gray-200 lg:border-r lg:border-gray-300">
          
          {/* Card L1 */}
          <article className="pb-4">
            <h2 className="font-serif font-bold text-[18px] xl:text-[19px] leading-[1.2] text-[#111111] hover:text-[#333333] hover:underline cursor-pointer">
              <Link href="/article/blockbuster-earnings-bolster-stocks-record-run">
                Blockbuster Earnings Bolster Stocks’ Record Run
              </Link>
            </h2>
            <p className="font-sans text-[12.5px] leading-[1.38] text-[#555555] mt-1.5">
              Results from the U.S.’s largest companies have helped ease worries about AI spending and inflationary pressures.
            </p>
            <div className="font-sans text-[11px] text-gray-500 mt-2 flex items-center gap-1">
              <span>💬</span>
              <span>25</span>
            </div>
          </article>

          {/* Card L2 */}
          <article className="py-4">
            <h2 className="font-serif font-bold text-[18px] xl:text-[19px] leading-[1.2] text-[#111111] hover:text-[#333333] hover:underline cursor-pointer">
              <Link href="/article/iran-demands-us-withdrawal-to-open-hormuz">
                Iran Demands U.S. Withdrawal to Open Hormuz
              </Link>
            </h2>
            <p className="font-sans text-[12.5px] leading-[1.38] text-[#555555] mt-1.5">
              A top Iranian official laid out a series of tough demands for opening the Strait of Hormuz, and the United Arab Emirates said Iran launched a missile attack on one of its ships.
            </p>
            <div className="font-sans text-[11px] text-gray-500 mt-2 flex items-center gap-1">
              <span>💬</span>
              <span>2,441</span>
            </div>
            <div className="mt-2.5 pl-2 border-l-2 border-gray-300">
              <Link
                href="/article/iran-sees-opening-to-kick-us-out-of-gulf"
                className="font-sans font-bold text-[12px] leading-tight text-[#111111] hover:underline block"
              >
                • Iran Sees an Opening to Kick the U.S. Out of the Gulf
              </Link>
            </div>
          </article>

          {/* Card L3 */}
          <article className="py-4">
            <h2 className="font-serif font-bold text-[18px] xl:text-[19px] leading-[1.2] text-[#111111] hover:text-[#333333] hover:underline cursor-pointer">
              <Link href="/article/berkshire-hathaway-starts-to-spend-cash-pile">
                Berkshire Hathaway, Under a New CEO, Starts to Spend Its Cash Pile
              </Link>
            </h2>
            <p className="font-sans text-[12.5px] leading-[1.38] text-[#555555] mt-1.5">
              The conglomerate struck a $6.8 billion deal, repurchased Berkshire shares and was a net buyer of other stocks while more than doubling quarterly profit.
            </p>
            <div className="font-sans text-[11px] text-gray-500 mt-2 flex items-center gap-1">
              <span>💬</span>
              <span>134</span>
            </div>
          </article>

          {/* Card L4 */}
          <article className="py-4">
            <div className="font-sans text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
              TIM HIGGINS
            </div>
            <h2 className="font-serif font-bold text-[18px] xl:text-[19px] leading-[1.2] text-[#111111] hover:text-[#333333] hover:underline cursor-pointer">
              <Link href="/article/selling-the-dream-of-spacex-was-the-easy-part">
                Selling the Dream of SpaceX Was the Easy Part. Now Elon Musk Has to Hang On.
              </Link>
            </h2>
            <p className="font-sans text-[12.5px] leading-[1.38] text-[#555555] mt-1.5">
              SpaceX’s $300 billion swing in market value this past week put Musk back in grind mode, having to execute on highflying promises made in the lead-up to the biggest IPO ever.
            </p>
            <div className="font-sans text-[11px] text-gray-500 mt-2 flex items-center gap-1">
              <span>💬</span>
              <span>45</span>
            </div>
          </article>

          {/* Card L5 */}
          <article className="py-4">
            <h2 className="font-serif font-bold text-[18px] xl:text-[19px] leading-[1.2] text-[#111111] hover:text-[#333333] hover:underline cursor-pointer">
              <Link href="/article/americas-electric-honeymoon-is-over">
                America’s Electric Honeymoon Is Over. EV Owners Must Work Out Where to Go Next.
              </Link>
            </h2>
            <p className="font-sans text-[12.5px] leading-[1.38] text-[#555555] mt-1.5">
              Drivers got hooked on great lease deals. Now, they’re looking at hybrids and gas cars—or just paying higher prices.
            </p>
            <div className="font-sans text-[11px] text-gray-500 mt-2 flex items-center gap-1">
              <span>💬</span>
              <span>1,360</span>
            </div>
          </article>

          {/* Card L6 */}
          <article className="py-4">
            <h2 className="font-serif font-bold text-[18px] xl:text-[19px] leading-[1.2] text-[#111111] hover:text-[#333333] hover:underline cursor-pointer">
              <Link href="/article/the-unexpected-joy-of-downsizing-slowly-in-retirement">
                The Unexpected Joy of Downsizing Slowly in Retirement
              </Link>
            </h2>
            <p className="font-sans text-[12.5px] leading-[1.38] text-[#555555] mt-1.5">
              We didn’t want to wait until an emergency forces us to purge in a hurry. One big plus: Doing it gradually has allowed us to bask in our memories.
            </p>
            <div className="font-sans text-[11px] text-gray-500 mt-2 flex items-center gap-1">
              <span>💬</span>
              <span>123</span>
            </div>
          </article>

          {/* Card L7 (From Screenshot) */}
          <article className="pt-4">
            <div className="font-sans text-[10px] font-extrabold text-[#8b6f37] uppercase tracking-wider mb-1">
              BEN COHEN | SCIENCE OF SUCCESS
            </div>
            <h2 className="font-serif font-bold text-[18px] xl:text-[19px] leading-[1.2] text-[#111111] hover:text-[#333333] hover:underline cursor-pointer">
              <Link href="/article/move-37-is-the-moment-ai-changes-everything">
                Move 37 Is the Moment AI Changes Everything. It’s Suddenly Happening Everywhere.
              </Link>
            </h2>
            <p className="font-sans text-[12.5px] leading-[1.38] text-[#555555] mt-1.5">
              A decade ago, a computer did something that no human would have done. It was considered a breakthrough for AI. Now the world is full of them.
            </p>
            <div className="font-sans text-[11px] text-gray-500 mt-2 flex items-center gap-1">
              <span>💬</span>
              <span>292</span>
            </div>
          </article>

        </div>

        {/* ==================== COLUMN 2: CENTER HERO COLUMN (6 of 12 cols ~ 50%) ==================== */}
        <div className="lg:col-span-6 px-0 lg:px-6 py-6 lg:py-0 flex flex-col gap-5 lg:border-r lg:border-gray-300">
          
          {/* Lead Hero Package */}
          <article className="pb-3">
            <Link
              href="/article/suspected-gangster-headaches-kushner-albania-deal"
              className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 border border-gray-200 mb-3.5"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80"
                alt="The Suspected Gangster Causing Headaches for Kushner's Albania Deal"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </Link>

            <h1 className="font-serif font-bold text-[24px] sm:text-[27px] leading-[1.18] text-[#111111] hover:text-[#333333] hover:underline cursor-pointer">
              <Link href="/article/suspected-gangster-headaches-kushner-albania-deal">
                The Suspected Gangster Causing Headaches for Kushner’s Albania Deal
              </Link>
            </h1>

            <p className="font-sans text-[13px] leading-[1.42] text-[#555555] mt-2">
              Villagers say they warned Trump’s son-in-law their beachfront land was stolen by Artur Shehu, who now faces drug-related charges, which he denies.
            </p>

            <div className="font-sans text-[11px] text-gray-500 mt-2 flex items-center gap-1">
              <span>💬</span>
              <span>101</span>
            </div>
          </article>

          {/* Sub-Hero Row 1: Two Columns Side-by-Side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            {/* Sub-Hero Left */}
            <article>
              <Link
                href="/article/the-jury-duty-scam-that-cost-this-family-25000"
                className="block relative aspect-[4/3] w-full overflow-hidden bg-gray-100 border border-gray-200 mb-2"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
                  alt="Jury Duty Scam"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </Link>
              <h3 className="font-serif font-bold text-[16px] leading-[1.22] text-[#111111] hover:underline cursor-pointer">
                <Link href="/article/the-jury-duty-scam-that-cost-this-family-25000">
                  The ‘Jury Duty’ Scam That Cost This Family $25,000
                </Link>
              </h3>
              <p className="font-sans text-[12px] leading-[1.38] text-[#555555] mt-1 line-clamp-3">
                In a growing ruse, swindlers pose as cops and use tremendous pressure to trap people, including young professionals.
              </p>
              <div className="font-sans text-[11px] text-gray-500 mt-1.5 flex items-center gap-1">
                <span>💬</span>
                <span>134</span>
              </div>
            </article>

            {/* Sub-Hero Right */}
            <article>
              <Link
                href="/article/cuba-is-low-on-oil-now-counting-on-solar"
                className="block relative aspect-[4/3] w-full overflow-hidden bg-gray-100 border border-gray-200 mb-2"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=600&q=80"
                  alt="Cuba Solar Panels"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </Link>
              <h3 className="font-serif font-bold text-[16px] leading-[1.22] text-[#111111] hover:underline cursor-pointer">
                <Link href="/article/cuba-is-low-on-oil-now-counting-on-solar">
                  Cuba Is Low on Oil. Now, It’s Counting on Solar, With China’s Help.
                </Link>
              </h3>
              <p className="font-sans text-[12px] leading-[1.38] text-[#555555] mt-1 line-clamp-3">
                The turn toward renewable energy has helped the island weather increased pressure from the U.S.
              </p>
              <div className="font-sans text-[11px] text-gray-500 mt-1.5 flex items-center gap-1">
                <span>💬</span>
                <span>25</span>
              </div>
            </article>
          </div>

          {/* Sub-Hero Row 2: Science of Success Feature */}
          <article className="pt-4 border-t border-gray-200">
            <div className="font-sans text-[10px] font-extrabold text-[#8b6f37] uppercase tracking-wider mb-1">
              BEN COHEN | SCIENCE OF SUCCESS
            </div>
            <h3 className="font-serif font-bold text-[18px] sm:text-[19px] leading-[1.2] text-[#111111] hover:underline cursor-pointer">
              <Link href="/article/move-37-is-the-moment-ai-changes-everything">
                Move 37 Is the Moment AI Changes Everything. It’s Suddenly Happening Everywhere.
              </Link>
            </h3>
            <p className="font-sans text-[12.5px] leading-[1.38] text-[#555555] mt-1.5">
              A decade ago, a computer did something that no human would have done. It was considered a breakthrough for AI. Now the world is full of them.
            </p>
            <div className="font-sans text-[11px] text-gray-500 mt-1.5 flex items-center gap-1">
              <span>💬</span>
              <span>288</span>
            </div>
          </article>

          {/* Sub-Hero Row 3: Russian Online Retail Giant (From Screenshot) */}
          <article className="pt-4 border-t border-gray-200">
            <h3 className="font-serif font-bold text-[18px] xl:text-[19px] leading-[1.2] text-[#111111] hover:text-[#333333] hover:underline cursor-pointer">
              <Link href="/article/the-wild-history-of-russian-online-retail-giant">
                The Wild History of the Russian Online Retail Giant Being Bombarded by Ukraine
              </Link>
            </h3>
            <p className="font-sans text-[12.5px] leading-[1.38] text-[#555555] mt-1.5">
              Plans for a megamerger were blessed by Vladimir Putin, tying the company’s fortunes to those of the Russian state.
            </p>
            <div className="font-sans text-[11px] text-gray-500 mt-1.5 flex items-center gap-1">
              <span>💬</span>
              <span>7</span>
            </div>
          </article>

          {/* Sub-Hero Row 4: Downsizing Slowly in Retirement (From Screenshot) */}
          <article className="pt-4 border-t border-gray-200">
            <h3 className="font-serif font-bold text-[18px] xl:text-[19px] leading-[1.2] text-[#111111] hover:text-[#333333] hover:underline cursor-pointer">
              <Link href="/article/the-unexpected-joy-of-downsizing-slowly-in-retirement">
                The Unexpected Joy of Downsizing Slowly in Retirement
              </Link>
            </h3>
            <p className="font-sans text-[12.5px] leading-[1.38] text-[#555555] mt-1.5">
              We didn’t want to wait until an emergency forces us to purge in a hurry. One big plus: Doing it gradually has allowed us to bask in our memories.
            </p>
            <div className="font-sans text-[11px] text-gray-500 mt-1.5 flex items-center gap-1">
              <span>💬</span>
              <span>137</span>
            </div>
          </article>

        </div>

        {/* ==================== COLUMN 3: RIGHT SIDEBAR COLUMN (3 of 12 cols ~ 25%) ==================== */}
        <div className="lg:col-span-3 pl-0 lg:pl-5 pt-6 lg:pt-0 flex flex-col gap-5">
          
          {/* OPINION SECTION */}
          <div>
            <h2 className="font-serif font-bold text-[20px] text-[#8b6f37] border-b border-gray-200 pb-1.5 mb-3">
              Opinion
            </h2>

            <div className="divide-y divide-gray-200">
              
              {/* Opinion 1 */}
              <article className="pb-3.5 flex items-start gap-3">
                <div className="w-[52px] h-[52px] rounded-full overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
                    alt="James Taranto"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-sans text-[10px] font-extrabold text-[#8b6f37] uppercase tracking-wider mb-0.5">
                    JAMES TARANTO
                  </div>
                  <h3 className="font-serif font-bold text-[14px] leading-[1.22] text-[#111111] hover:underline cursor-pointer">
                    <Link href="/article/justice-samuel-alito-practical-originalism">
                      Justice Samuel Alito: ‘Practical Originalism’ and Its Facile Critics
                    </Link>
                  </h3>
                </div>
              </article>

              {/* Opinion 2 */}
              <article className="py-3.5 flex items-start gap-3">
                <div className="w-[52px] h-[52px] overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80"
                    alt="Kevin Warsh"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-sans text-[10px] font-extrabold text-[#8b6f37] uppercase tracking-wider mb-0.5">
                    THE EDITORIAL BOARD
                  </div>
                  <h3 className="font-serif font-bold text-[14px] leading-[1.22] text-[#111111] hover:underline cursor-pointer">
                    <Link href="/article/federal-reserve-status-quo-vs-kevin-warsh">
                      The Federal Reserve Status Quo vs. Kevin Warsh
                    </Link>
                  </h3>
                </div>
              </article>

              {/* Opinion 3 */}
              <article className="py-3.5 flex items-start gap-3">
                <div className="w-[52px] h-[52px] overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=150&q=80"
                    alt="Labor Market"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-sans text-[10px] font-extrabold text-[#8b6f37] uppercase tracking-wider mb-0.5">
                    THE EDITORIAL BOARD
                  </div>
                  <h3 className="font-serif font-bold text-[14px] leading-[1.22] text-[#111111] hover:underline cursor-pointer">
                    <Link href="/article/americas-low-hire-low-fire-labor-market">
                      America’s Low-Hire, Low-Fire Labor Market
                    </Link>
                  </h3>
                </div>
              </article>

              {/* Opinion 4 */}
              <article className="py-3.5 flex items-start gap-3">
                <div className="w-[52px] h-[52px] overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=150&q=80"
                    alt="Saudi Accords"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-sans text-[10px] font-extrabold text-[#8b6f37] uppercase tracking-wider mb-0.5">
                    THE EDITORIAL BOARD
                  </div>
                  <h3 className="font-serif font-bold text-[14px] leading-[1.22] text-[#111111] hover:underline cursor-pointer">
                    <Link href="/article/saudis-spurn-abraham-accords">
                      The Saudis Spurn the Abraham Accords
                    </Link>
                  </h3>
                </div>
              </article>

              {/* Opinion 5 */}
              <article className="py-3.5 flex items-start gap-3">
                <div className="w-[52px] h-[52px] overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/world/odesa_port.jpg"
                    alt="Port Cranes"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-sans text-[10px] font-extrabold text-[#8b6f37] uppercase tracking-wider mb-0.5">
                    THE EDITORIAL BOARD
                  </div>
                  <h3 className="font-serif font-bold text-[14px] leading-[1.22] text-[#111111] hover:underline cursor-pointer">
                    <Link href="/article/russia-hears-from-lindsey-graham">
                      Russia Hears From Lindsey Graham
                    </Link>
                  </h3>
                </div>
              </article>

              {/* Opinion 6 */}
              <article className="pt-3.5 flex items-start gap-3">
                <div className="w-[52px] h-[52px] overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/world/mercury_retrograde.jpg"
                    alt="Celestial globe"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-sans text-[10px] font-extrabold text-[#8b6f37] uppercase tracking-wider mb-0.5">
                    NISHANT SAHDEV
                  </div>
                  <h3 className="font-serif font-bold text-[14px] leading-[1.22] text-[#111111] hover:underline cursor-pointer">
                    <Link href="/article/intricate-system-lets-you-find-yourself">
                      The Intricate System That Lets You Find Yourself
                    </Link>
                  </h3>
                </div>
              </article>

            </div>
          </div>

          {/* Feature Card Below Opinion */}
          <div className="pt-4 border-t border-gray-300">
            <article>
              <Link
                href="/article/destination-weddings-dress-codes"
                className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 border border-gray-200 mb-2.5"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80"
                  alt="Destination Weddings Dress Codes"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </Link>
              <h3 className="font-serif font-bold text-[16px] leading-[1.22] text-[#111111] hover:underline cursor-pointer">
                <Link href="/article/destination-weddings-dress-codes">
                  Destination Weddings Now Have Their Own Dress Codes. Here’s How to Crack Them.
                </Link>
              </h3>
            </article>

            {/* Skyscraper Advertisement Banner matching screenshot */}
            <div className="mt-6 border-t border-gray-200 pt-3">
              <div className="text-center mb-1.5">
                <span className="text-[10px] font-sans text-gray-400 uppercase tracking-widest">
                  Advertisement
                </span>
              </div>

              {/* OPIS Skyscraper Banner Box */}
              <div className="relative w-full aspect-[9/18] sm:aspect-[9/16] overflow-hidden border border-gray-300 shadow-md bg-gradient-to-b from-[#111f38] via-[#0d162a] to-[#080d19] text-white flex flex-col justify-between p-4 group select-none">
                
                {/* Background Image Overlay */}
                <div className="absolute inset-0 z-0 opacity-40">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80"
                    alt="City Skyline Night"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-[#09152b]/80 via-[#0a1832]/60 to-[#070e1c]/90" />
                </div>

                {/* Top Info Icons */}
                <div className="relative z-10 flex items-center justify-between">
                  <div>{/* Logo space */}</div>
                  <div className="flex items-center gap-1 bg-white/90 text-[#0080aa] px-1.5 py-0.5 rounded-2xs text-[10px]">
                    <span className="cursor-pointer hover:underline">ⓘ</span>
                    <span>⋮</span>
                  </div>
                </div>

                {/* OPIS Logo Header */}
                <div className="relative z-10 pt-1">
                  <div className="flex items-center gap-2">
                    <div className="border-r border-white/40 pr-2">
                      <span className="font-sans font-black text-[22px] tracking-tight block text-white leading-none">
                        OPIS
                      </span>
                      <span className="font-sans text-[7.5px] text-gray-300 tracking-wider uppercase block mt-0.5">
                        A DOW JONES COMPANY
                      </span>
                    </div>
                    <div className="font-sans text-[10.5px] leading-tight text-gray-200">
                      CHEMICAL<br />MARKET<br />ANALYTICS
                    </div>
                  </div>
                </div>

                {/* Main Content Banner */}
                <div className="relative z-10 my-auto py-2">
                  <div className="bg-black/60 backdrop-blur-xs p-3.5 border-y border-white/20 my-2 text-center">
                    <h4 className="font-sans font-black text-[22px] sm:text-[24px] leading-none text-white tracking-tight uppercase">
                      GPS: Global Plastics Summit
                    </h4>
                  </div>

                  {/* Date Banner */}
                  <div className="bg-[#e91e63] text-white text-center py-1.5 px-2 font-sans font-bold text-[12.5px] tracking-wide my-2 shadow-xs">
                    November 2–4, 2026 | Houston, TX
                  </div>

                  {/* Location Info */}
                  <div className="bg-[#0f294a]/90 border-l-4 border-[#ff9800] p-2 text-right text-gray-100 font-sans text-[11px] leading-tight max-w-[200px] ml-auto my-2">
                    <strong className="block text-white text-[12px]">The Royal Sonesta</strong>
                    Houston Galleria
                  </div>

                  {/* Savings Offer */}
                  <div className="text-center mt-3 mb-1">
                    <div className="font-sans font-black text-[22px] sm:text-[24px] leading-none text-white tracking-tight">
                      SAVE UP TO $250
                    </div>
                    <div className="font-sans font-bold text-[11.5px] text-gray-200 mt-1">
                      Lock In Early Bird Pricing Today
                    </div>
                  </div>
                </div>

                {/* Register Now Button */}
                <div className="relative z-10 pt-2 pb-1 text-center">
                  <a
                    href="#"
                    className="bg-[#e91e63] hover:bg-[#c2185b] text-white font-sans font-extrabold text-[13.5px] py-2.5 px-6 rounded-full inline-block uppercase tracking-wider shadow-md transition-colors w-full cursor-pointer"
                  >
                    REGISTER NOW
                  </a>
                </div>

              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
