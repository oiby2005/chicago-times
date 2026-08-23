"use client";

import React from "react";
import Link from "next/link";

export default function NewHomeSection2() {
  return (
    <section className="w-full bg-white text-[#111111] pt-2 pb-6">
      {/* ==================== BUSINESS CATEGORY BLOCK ==================== */}
      <div className="border-t-2 border-black pt-2 mb-3">
        <h2 className="font-serif font-bold text-[22px] text-[#111111] tracking-tight">
          Business
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-6">
        {/* Main Business Left/Center Grid (9 of 12 cols) */}
        <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-12 gap-5 lg:border-r lg:border-gray-300 lg:pr-6">
          {/* Business Left Column (4 of 9 cols) */}
          <div className="md:col-span-4 flex flex-col divide-y divide-gray-200">
            <article className="pb-3">
              <h3 className="font-serif font-bold text-[19px] leading-[1.2] text-[#111111] hover:underline cursor-pointer">
                <Link prefetch={true} href="/article/business-secretary-wife-favourite-labour-general-secretary">
                  Business secretary’s wife is favourite for Labour general secretary
                </Link>
              </h3>
              <p className="font-sans text-[12.5px] leading-[1.38] text-[#555555] mt-1.5">
                No 10 insider Clare Reynolds, who is married to Jonathan Reynolds, is also a close friend of Burnham’s chief of staff James Purnell.
              </p>
            </article>

            <article className="py-3">
              <h4 className="font-serif font-bold text-[15px] leading-[1.22] text-[#111111] hover:underline cursor-pointer">
                <Link prefetch={true} href="/article/domestic-abuse-is-illegal-asylum-seekers-told">
                  Domestic abuse is illegal, asylum seekers told in advice on UK life
                </Link>
              </h4>
              <p className="font-sans text-[12px] leading-[1.38] text-[#555555] mt-1">
                Nine-page Home Office pamphlet to help behaviour of new arrivals says men and women are equal — critics claim it paints the entire group as a ‘menace’.
              </p>
            </article>

            <article className="pt-3">
              <h4 className="font-serif font-bold text-[15px] leading-[1.22] text-[#111111] hover:underline cursor-pointer">
                <Link prefetch={true} href="/article/migrant-who-raped-sleeping-woman-allowed-to-stay-in-uk">
                  Migrant who raped sleeping woman allowed to stay in UK
                </Link>
              </h4>
            </article>
          </div>

          {/* Business Center Hero Feature (5 of 9 cols) */}
          <div className="md:col-span-5 flex flex-col justify-between">
            <article>
              <Link
                href="/article/inside-the-wales-wildfire-zone-like-something-from-apocalypse-now"
                className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 border border-gray-200 mb-3"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/berkshire_resort.jpg"
                  alt="Inside the Wales wildfire zone"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </Link>
              <h3 className="font-serif font-bold text-[20px] leading-[1.18] text-[#111111] hover:underline cursor-pointer">
                <Link prefetch={true} href="/article/inside-the-wales-wildfire-zone-like-something-from-apocalypse-now">
                  Inside the Wales wildfire zone: ‘Like something from Apocalypse Now’
                </Link>
              </h3>
              <p className="font-sans text-[12.5px] leading-[1.4] text-[#555555] mt-1.5">
                A photographer spent 36 hours with firefighters who were stretched to their limits as fires ravaged timberland hillsides.
              </p>
            </article>

            {/* Two Bottom Small Cards under center */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200 mt-3">
              <article>
                <Link href="/article/nhs-drug-for-diabetes-could-cut-jabs" className="block relative aspect-[4/3] w-full overflow-hidden bg-gray-100 border border-gray-200 mb-1.5">
                  <img src="/images/refinery-energy.jpg" alt="NHS drug" className="w-full h-full object-cover" />
                </Link>
                <h5 className="font-serif font-bold text-[13.5px] leading-tight text-[#111111]">
                  NHS drug for diabetes could cut jabs to one a week
                </h5>
              </article>
              <article>
                <Link href="/article/israel-to-investigate-killing-five-year-old" className="block relative aspect-[4/3] w-full overflow-hidden bg-gray-100 border border-gray-200 mb-1.5">
                  <img src="/images/harvard-woman.jpg" alt="Israel investigate" className="w-full h-full object-cover" />
                </Link>
                <h5 className="font-serif font-bold text-[13.5px] leading-tight text-[#111111]">
                  Israel to investigate its killing of five-year-old girl
                </h5>
              </article>
            </div>
          </div>

          {/* Business Right Sub-Column (3 of 9 cols) */}
          <div className="md:col-span-3 flex flex-col gap-4">
            <article>
              <Link href="/article/trump-declares-economic-d-day-against-iran" className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 border border-gray-200 mb-2">
                <img src="/images/kevin_warsh.jpg" alt="Trump declares" className="w-full h-full object-cover" />
              </Link>
              <h4 className="font-serif font-bold text-[15px] leading-tight text-[#111111]">
                Trump declares ‘economic D-Day’ against Iran
              </h4>
            </article>
            <article>
              <Link href="/article/fastest-star-in-galaxy-black-hole" className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 border border-gray-200 mb-2">
                <img src="/images/podcast-tech-news.jpg" alt="Fastest star" className="w-full h-full object-cover" />
              </Link>
              <h4 className="font-serif font-bold text-[15px] leading-tight text-[#111111]">
                Fastest star in the galaxy ‘will reveal black hole’s secrets’
              </h4>
            </article>
          </div>
        </div>

        {/* Ad 1 Container (3 of 12 cols ~ Right side) */}
        <div className="lg:col-span-3 flex items-center justify-center bg-gray-100 border border-gray-300 p-4 min-h-[300px]">
          <span className="font-serif font-bold text-[28px] text-gray-700">Ad 1</span>
        </div>
      </div>

      {/* ==================== WORLD POLITICS CATEGORY BLOCK ==================== */}
      <div className="border-t border-gray-300 pt-4 mt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pb-6">
          <article>
            <Link href="/article/check-your-helicopters-greece-tells-pilots" className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 border border-gray-200 mb-2">
              <img src="/images/wine-plane.jpg" alt="Greece helicopters" className="w-full h-full object-cover" />
            </Link>
            <h4 className="font-serif font-bold text-[15px] leading-[1.22] text-[#111111] hover:underline cursor-pointer">
              Check your helicopters, Greece tells pilots after honeymoon crash
            </h4>
          </article>

          <article>
            <Link href="/article/lawrence-of-arabia-anger-banned-travel" className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 border border-gray-200 mb-2">
              <img src="/images/bourdain-movie.jpg" alt="Lawrence of Arabia" className="w-full h-full object-cover" />
            </Link>
            <h4 className="font-serif font-bold text-[15px] leading-[1.22] text-[#111111] hover:underline cursor-pointer">
              Lawrence of Arabia’s anger at being ‘banned’ from travel abroad
            </h4>
          </article>

          <article>
            <Link href="/article/by-gum-nhs-ai-phone-system-yorkshire" className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 border border-gray-200 mb-2">
              <img src="/images/nyc-skyscrapers.jpg" alt="NHS AI phone" className="w-full h-full object-cover" />
            </Link>
            <h4 className="font-serif font-bold text-[15px] leading-[1.22] text-[#111111] hover:underline cursor-pointer">
              By gum, NHS AI phone system struggles with Yorkshire accents
            </h4>
          </article>

          <article>
            <div className="font-mono text-[9.5px] font-bold text-gray-500 uppercase tracking-widest mb-1">
              THE TIMES DIARY
            </div>
            <Link href="/article/minister-literally-doesnt-care-less-fewer" className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 border border-gray-200 mb-2">
              <img src="/images/ariana-grande.jpg" alt="Minister diary" className="w-full h-full object-cover" />
            </Link>
            <h4 className="font-serif font-bold text-[15px] leading-[1.22] text-[#111111] hover:underline cursor-pointer">
              Minister literally doesn’t care if you say less or fewer
            </h4>
          </article>
        </div>
      </div>

      {/* ==================== AD 02 BANNER ==================== */}
      <div className="w-full bg-gray-100 border border-gray-300 h-[120px] sm:h-[140px] flex items-center justify-center my-4">
        <span className="font-serif font-bold text-[32px] text-gray-700">Ad 02</span>
      </div>
    </section>
  );
}
