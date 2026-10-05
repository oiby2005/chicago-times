"use client";

import React, { useState } from "react";
import Header from "@/components/navigation/Header";
import StickyHeaderBar from "@/components/navigation/StickyHeaderBar";
import Footer from "@/components/layout/Footer";
import Container from "@/components/layout/Container";

interface LeaderMember {
  name: string;
  role: string;
  imageUrl: string;
  linkedinUrl?: string;
}

const EXECUTIVE_LEADERSHIP: LeaderMember[] = [
  {
    name: "Geeth Roman",
    role: "Creative Director",
    imageUrl: "https://www.specialwriters.us/Leadership-Geeth.webp",
    linkedinUrl: "https://www.linkedin.com/in/geeth-roman-2739b0143/",
  },
  {
    name: "Chamitha Ranneththi",
    role: "Director of International Relations",
    imageUrl: "https://www.specialwriters.us/Leadership-Chamitha%20Ranneththi.webp",
    linkedinUrl: "https://www.linkedin.com/in/chamitha-ranneththi-224219163/",
  },
  {
    name: "Masoud Pajouh",
    role: "Chief Technology Officer",
    imageUrl: "https://www.specialwriters.us/Masoud%20Pajouh.webp",
    linkedinUrl: "https://www.linkedin.com/in/masoud-pajouh-51321846/",
  },
  {
    name: "Dr. Ehi Iden",
    role: "Director & Advisor",
    imageUrl: "https://www.specialwriters.us/Leadership-Dr.%20Ehi%20Iden.webp",
    linkedinUrl: "https://www.linkedin.com/in/ehi-iden/",
  },
  {
    name: "Dr. Tornike Shurgulaia",
    role: "Editor in Chief & Head of Magazines",
    imageUrl: "https://www.specialwriters.us/Leadership-Dr.%20Tornike%20Shurgulaia.webp",
    linkedinUrl: "https://www.linkedin.com/in/tornike-shurgulaia",
  },
  {
    name: "Jatinder Singh",
    role: "Director of Academic Partnerships",
    imageUrl: "https://www.specialwriters.us/Leadership-Jatinder%20Singh.webp",
    linkedinUrl: "", // Keep empty as requested
  },
  {
    name: "Kingzang Thinley",
    role: "Global Commercial Director",
    imageUrl: "https://www.specialwriters.us/Leadership-Kingzang%20Thinley.webp",
    linkedinUrl: "https://www.linkedin.com/in/kinzang-thinley-ab08b9292/",
  },
];

const SENIOR_MANAGEMENT: LeaderMember[] = [
  {
    name: "M. A. M. Akram",
    role: "Web Systems Administrator",
    imageUrl: "https://www.specialwriters.us/Akram%20Yoonos.webp",
    linkedinUrl: "https://www.linkedin.com/in/mohamed-azmy-mohamed-akram/",
  },
  {
    name: "Akanksha Thakur",
    role: "Head of Marketing",
    imageUrl: "https://www.specialwriters.us/Akanksha%20Thakur.webp",
    linkedinUrl: "https://www.linkedin.com/in/akanksha-thakur-52130818b/",
  },
  {
    name: "Mehul Bansal",
    role: "Senior Legal Assistant",
    imageUrl: "https://www.specialwriters.us/Mehul%20Bansal.webp",
    linkedinUrl: "https://www.linkedin.com/in/advmehulbansaltalonadvocacy/",
  },
  {
    name: "Niveditaa Chakrapani",
    role: "Media Innovator",
    imageUrl: "https://www.specialwriters.us/Niveditaa%20Chakrapani.webp",
    linkedinUrl: "https://www.linkedin.com/in/niveditaa-c-870b9426b/",
  },
  {
    name: "Suelen dos Santos",
    role: "Head of SEO Content",
    imageUrl: "https://www.specialwriters.us/Suelen%20dos%20Santos.webp",
    linkedinUrl: "https://www.linkedin.com/in/suelensmonteiro",
  },
  {
    name: "Ridhushana Thavarajah",
    role: "Creative Designer",
    imageUrl: "https://www.specialwriters.us/Shana.webp",
    linkedinUrl: "https://www.linkedin.com/in/ridhushana-thavarajah/",
  },
];

const COUNTRY_COORDINATORS: LeaderMember[] = [
  {
    name: "Thiloththama Jayasinghe",
    role: "Sri Lanka Country Coordinator",
    imageUrl: "https://www.specialwriters.us/Thiloththama%20Jayasinghe.webp",
    linkedinUrl: "https://www.linkedin.com/in/thiloththama-jayasinghe-36aab212a/",
  },
  {
    name: "Ravindu Randeepa",
    role: "Dubai Country Coordinator",
    imageUrl: "https://www.specialwriters.us/Ravindu%20Randeepa.webp",
    linkedinUrl: "https://www.linkedin.com/in/ravindupanagoda/",
  },
  {
    name: "Ceasar Dubor",
    role: "Ireland Country Coordinator",
    imageUrl: "https://www.specialwriters.us/Ceasar%20Dubor.webp",
    linkedinUrl: "https://www.linkedin.com/in/ceasar-dubor-danladi-ph-d-519588144/",
  },
  {
    name: "Naveen Ranaweera",
    role: "Qatar Country Coordinator",
    imageUrl: "https://www.specialwriters.us/Naveen%20Ranaweera.webp",
    linkedinUrl: "", // Keep empty as requested
  },
  {
    name: "Keith Nester A. Lavin",
    role: "Philippines Country Coordinator",
    imageUrl: "https://www.specialwriters.us/Keith%20Nester%20A.%20Lavin.webp",
    linkedinUrl: "https://www.linkedin.com/in/keith-nester-lavin-b36a15116/",
  },
  {
    name: "A. F. Syeda",
    role: "UK Country Coordinator",
    imageUrl: "https://www.specialwriters.us/A.%20F.%20Syeda.webp",
    linkedinUrl: "https://www.linkedin.com/in/fatima-ali-513236224/",
  },
];

const OUR_WRITERS: LeaderMember[] = [
  {
    name: "Namrata Bhandari",
    role: "Advance Technical Writer",
    imageUrl: "https://www.specialwriters.us/Namrata%20Bhandari.webp",
    linkedinUrl: "https://www.linkedin.com/in/namrata-bhandari01/",
  },
  {
    name: "Caroline Tohio",
    role: "Advance Writer",
    imageUrl: "https://www.specialwriters.us/CAROLINE%20TOHIO.webp",
    linkedinUrl: "https://www.linkedin.com/in/carolinelearningenglish/",
  },
  {
    name: "Olalekan Apara",
    role: "Article Writer",
    imageUrl: "https://www.specialwriters.us/OLALEKAN%20APARA.webp",
    linkedinUrl: "https://www.linkedin.com/in/olalekan-apara-8322b21aa",
  },
  {
    name: "Khoshnaw Rahmani",
    role: "Article Writer",
    imageUrl: "https://www.specialwriters.us/Khoshnaw%20Rahmani.webp",
    linkedinUrl: "https://www.linkedin.com/in/khoshnaw-rahmani-34a070171/",
  },
  {
    name: "Samuel Mauricio",
    role: "Script Writer",
    imageUrl: "https://www.specialwriters.us/Samuel.webp",
    linkedinUrl: "https://www.linkedin.com/in/samuel-mauricio-pati%C3%B1o-fuentes-740369373/",
  },
];

function LinkedInIcon() {
  return (
    <svg className="w-5 h-5 fill-[#0A66C2] inline-block shrink-0" viewBox="0 0 24 24">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}

const LeaderCard: React.FC<{ member: LeaderMember }> = ({ member }) => {
  const hasLinkedIn = Boolean(member.linkedinUrl && member.linkedinUrl.trim() !== "");

  return (
    <div className="group flex flex-col">
      <div className="relative w-full aspect-[4/5] rounded-none overflow-hidden bg-[#e5e0d5] mb-3 shadow-xs transition-shadow duration-300 group-hover:shadow-md">
        <img
          src={member.imageUrl}
          alt={member.name}
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105 block"
          loading="lazy"
        />
      </div>

      <div>
        {hasLinkedIn ? (
          <a
            href={member.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-sans font-bold text-[15px] sm:text-[16px] text-[#111111] hover:text-[#0A66C2] transition-colors"
          >
            <span>{member.name}</span>
            <LinkedInIcon />
          </a>
        ) : (
          <span className="inline-flex items-center gap-1.5 font-sans font-bold text-[15px] sm:text-[16px] text-[#111111]">
            <span>{member.name}</span>
          </span>
        )}
        <p className="font-sans text-[12.5px] sm:text-[13px] text-[#666666] font-medium mt-0.5 leading-snug">
          {member.role}
        </p>
      </div>
    </div>
  );
};

export default function LeadershipClient() {
  const [execOpen, setExecOpen] = useState(true);
  const [seniorOpen, setSeniorOpen] = useState(true);
  const [coordinatorsOpen, setCoordinatorsOpen] = useState(true);
  const [writersOpen, setWritersOpen] = useState(true);

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between text-[#111111] select-none font-sans">
      <div>
        <Header />
        <StickyHeaderBar />

        <main className="bg-white py-8 sm:py-12">
          <Container>
            {/* HERO SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-10">
              {/* Left Column: Heading & Intro Text */}
              <div className="lg:col-span-7 flex flex-col justify-start">
                <div className="inline-block px-3.5 py-1 rounded-full border border-gray-300 bg-[#f4f4f0] text-[#666666] font-sans font-bold text-[11px] uppercase tracking-wider mb-4 w-fit">
                  OUR LEADERSHIP
                </div>

                <h1 className="font-serif font-extrabold text-[32px] sm:text-[42px] lg:text-[48px] text-[#111111] leading-[1.1] mb-3">
                  The Team Behind <br className="hidden sm:inline" />
                  <span className="text-[#666666]">Our Vision</span>
                </h1>

                <div className="w-12 h-1 bg-[#888888] mb-5 rounded-full" />

                <p className="font-sans text-[14px] sm:text-[14.5px] leading-relaxed text-[#555555] mb-8">
                  Our leadership team brings together experienced professionals dedicated to advancing global education and student success. With expertise in academic partnerships, operations, and innovation, our leaders guide our company&apos;s strategic vision and ensure the highest standards of service. Their commitment to excellence drives our mission to create accessible opportunities and meaningful impact in the education sector.
                </p>

                {/* Stats Row with Dot Grid on Left */}
                <div className="flex items-center space-x-6 pt-2">
                  {/* Dot Grid Image Pattern next to 20+ Team Members */}
                  <div className="w-10 h-10 shrink-0 grid grid-cols-5 gap-1.5 opacity-35">
                    {[...Array(25)].map((_, i) => (
                      <div key={i} className="w-1 h-1 rounded-full bg-[#888888]" />
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-6 flex-1">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-10 h-10 rounded-full bg-[#f4f4f0] flex items-center justify-center text-[#666666] shrink-0">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-sans font-extrabold text-[20px] text-[#111111] leading-none">20+</div>
                        <div className="font-sans text-[11.5px] text-[#666666]">Team Members</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2.5">
                      <div className="w-10 h-10 rounded-full bg-[#f4f4f0] flex items-center justify-center text-[#666666] shrink-0">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-sans font-extrabold text-[20px] text-[#111111] leading-none">15+</div>
                        <div className="font-sans text-[11.5px] text-[#666666]">Countries</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2.5">
                      <div className="w-10 h-10 rounded-full bg-[#f4f4f0] flex items-center justify-center text-[#666666] shrink-0">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-sans font-extrabold text-[20px] text-[#111111] leading-none">10+</div>
                        <div className="font-sans text-[11.5px] text-[#666666]">Years Combined</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Quotes List */}
              <div className="lg:col-span-5 space-y-3.5 pt-2">
                <div className="bg-[#fbfbf9] border-l-4 border-[#888888] p-4 rounded-r-xl shadow-xs">
                  <p className="font-serif italic text-[14px] text-[#333333] leading-snug mb-2">
                    &ldquo;Nothing is impossible; you just need the courage to start and the drive to sustain&rdquo;
                  </p>
                  <p className="font-sans font-bold text-[12.5px] text-[#666666]">
                    &mdash; Geeth Roman
                  </p>
                </div>

                <div className="bg-[#fbfbf9] border-l-4 border-[#888888] p-4 rounded-r-xl shadow-xs">
                  <p className="font-serif italic text-[14px] text-[#333333] leading-snug mb-2">
                    &ldquo;Innovating Ideas for Tomorrow&apos;s Success&rdquo;
                  </p>
                  <p className="font-sans font-bold text-[12.5px] text-[#666666]">
                    &mdash; Chamitha Ranneththi
                  </p>
                </div>

                <div className="bg-[#fbfbf9] border-l-4 border-[#888888] p-4 rounded-r-xl shadow-xs">
                  <p className="font-serif italic text-[14px] text-[#333333] leading-snug mb-2">
                    &ldquo;We learn from failure, not from success&rdquo;
                  </p>
                  <p className="font-sans font-bold text-[12.5px] text-[#666666]">
                    &mdash; Jatinder Singh
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 1: EXECUTIVE LEADERSHIP */}
            <section className="mb-10">
              <div className="flex items-center mb-6">
                <span className="w-1.5 h-6 bg-[#888888] rounded-full inline-block mr-2.5" />
                <h2 className="font-sans font-bold text-[22px] sm:text-[24px] text-[#111111] tracking-tight">
                  Executive Leadership
                </h2>
                <button
                  onClick={() => setExecOpen(!execOpen)}
                  className="w-5 h-5 rounded-full bg-[#888888] text-white inline-flex items-center justify-center hover:bg-[#666666] transition-colors ml-2.5 cursor-pointer"
                  aria-label="Toggle Executive Leadership"
                >
                  <svg
                    className={`w-3 h-3 fill-current text-white transition-transform duration-300 ${execOpen ? "rotate-180" : ""}`}
                    viewBox="0 0 24 24"
                  >
                    <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
                  </svg>
                </button>
              </div>

              {execOpen && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-start">
                  {EXECUTIVE_LEADERSHIP.map((member) => (
                    <LeaderCard key={member.name} member={member} />
                  ))}
                </div>
              )}
            </section>

            {/* SECTION 2: SENIOR MANAGEMENT */}
            <section className="mb-10">
              <div className="flex items-center mb-6">
                <span className="w-1.5 h-6 bg-[#888888] rounded-full inline-block mr-2.5" />
                <h2 className="font-sans font-bold text-[22px] sm:text-[24px] text-[#111111] tracking-tight">
                  Senior Management
                </h2>
                <button
                  onClick={() => setSeniorOpen(!seniorOpen)}
                  className="w-5 h-5 rounded-full bg-[#888888] text-white inline-flex items-center justify-center hover:bg-[#666666] transition-colors ml-2.5 cursor-pointer"
                  aria-label="Toggle Senior Management"
                >
                  <svg
                    className={`w-3 h-3 fill-current text-white transition-transform duration-300 ${seniorOpen ? "rotate-180" : ""}`}
                    viewBox="0 0 24 24"
                  >
                    <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
                  </svg>
                </button>
              </div>

              {seniorOpen && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-start">
                  {SENIOR_MANAGEMENT.map((member) => (
                    <LeaderCard key={member.name} member={member} />
                  ))}
                </div>
              )}
            </section>

            {/* SECTION 3: OUR COUNTRY COORDINATORS */}
            <section className="mb-10">
              <div className="flex items-center mb-6">
                <span className="w-1.5 h-6 bg-[#888888] rounded-full inline-block mr-2.5" />
                <h2 className="font-sans font-bold text-[22px] sm:text-[24px] text-[#111111] tracking-tight">
                  Our Country Coordinators
                </h2>
                <button
                  onClick={() => setCoordinatorsOpen(!coordinatorsOpen)}
                  className="w-5 h-5 rounded-full bg-[#888888] text-white inline-flex items-center justify-center hover:bg-[#666666] transition-colors ml-2.5 cursor-pointer"
                  aria-label="Toggle Our Country Coordinators"
                >
                  <svg
                    className={`w-4 h-4 fill-current text-white transition-transform duration-300 ${coordinatorsOpen ? "rotate-180" : ""}`}
                    viewBox="0 0 24 24"
                  >
                    <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
                  </svg>
                </button>
              </div>

              {coordinatorsOpen && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-start">
                  {COUNTRY_COORDINATORS.map((member) => (
                    <LeaderCard key={member.name} member={member} />
                  ))}
                </div>
              )}
            </section>

            {/* SECTION 4: OUR WRITERS */}
            <section className="mb-8">
              <div className="flex items-center mb-6">
                <span className="w-1.5 h-6 bg-[#888888] rounded-full inline-block mr-2.5" />
                <h2 className="font-sans font-bold text-[22px] sm:text-[24px] text-[#111111] tracking-tight">
                  Our Writers
                </h2>
                <button
                  onClick={() => setWritersOpen(!writersOpen)}
                  className="w-5 h-5 rounded-full bg-[#888888] text-white inline-flex items-center justify-center hover:bg-[#666666] transition-colors ml-2.5 cursor-pointer"
                  aria-label="Toggle Our Writers"
                >
                  <svg
                    className={`w-3 h-3 fill-current text-white transition-transform duration-300 ${writersOpen ? "rotate-180" : ""}`}
                    viewBox="0 0 24 24"
                  >
                    <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
                  </svg>
                </button>
              </div>

              {writersOpen && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-start">
                  {OUR_WRITERS.map((member) => (
                    <LeaderCard key={member.name} member={member} />
                  ))}
                </div>
              )}
            </section>
          </Container>
        </main>
      </div>

      <Footer />
    </div>
  );
}
