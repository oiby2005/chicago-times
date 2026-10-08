export interface WealthPoint {
  year: number;
  value: number; // Value in Billions USD
}

export interface BillionaireItem {
  id: string;
  rank: number;
  name: string;
  netWorth: string;
  changeStatus: "UP" | "DOWN" | "UNCHANGED" | "NEW" | "RETURNEE";
  age: number | string;
  country: string;
  source: string;
  industry: string;
  gender?: string;
  
  // Expanded Detail & Profile Header Fields
  photoUrl?: string;
  highlightText?: string;
  endYear?: number;
  wealthHistory?: WealthPoint[];

  // Profile View Header Metrics
  titleRole?: string;        // e.g. "CEO, Tesla"
  realTimeNetWorth?: string; // e.g. "$1.037T"
  realTimeChange?: string;   // e.g. "▼ $14.2B (1.35%)"
  realTimeAsOf?: string;     // e.g. "10/7/26"
  listNetWorthAsOf?: string; // e.g. "3/10/26"
  photoCredit?: string;      // e.g. "MARTIN SCHOELLER FOR FORBES"

  // Image 1: From the Editor Bullet Points
  editorLastUpdated?: string;
  editorBulletPoints?: string[];

  // Image 3: Personal Stats Table
  selfMadeScore?: string | number;
  philanthropyScore?: string | number;
  residence?: string;
  citizenship?: string;
  maritalStatus?: string;
  children?: string | number;
  education?: string;

  // Image 4: Did You Know Carousel Facts
  didYouKnowFacts?: string[];

  // New Profile Section 1: In Their Own Words Quote (Image 1 Specs)
  inTheirOwnWordsQuote?: string;
}

export const INITIAL_BILLIONAIRES: BillionaireItem[] = [
  {
    id: "1",
    rank: 1,
    name: "Elon Musk",
    netWorth: "$839 B",
    changeStatus: "UP",
    age: 54,
    country: "United States",
    source: "Tesla, SpaceX",
    industry: "Technology",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/3/34/Elon_Musk_Royal_Society_%28crop2%29.jpg",
    highlightText: "Elon Musk became the world's first trillionaire on June 12 when SpaceX went public.",
    endYear: 2026,
    titleRole: "CEO, Tesla",
    realTimeNetWorth: "$1.037T",
    realTimeChange: "▼ $14.2B (1.35%)",
    realTimeAsOf: "10/7/26",
    listNetWorthAsOf: "3/10/26",
    photoCredit: "MARTIN SCHOELLER FOR FORBES",
    wealthHistory: [
      { year: 2017, value: 21 },
      { year: 2018, value: 20 },
      { year: 2019, value: 22 },
      { year: 2020, value: 25 },
      { year: 2021, value: 190 },
      { year: 2022, value: 219 },
      { year: 2023, value: 180 },
      { year: 2024, value: 210 },
      { year: 2025, value: 340 },
      { year: 2026, value: 839 },
    ],
    editorLastUpdated: "Last Updated Sep 15, 2026, 6:30am EDT",
    editorBulletPoints: [
      "Elon Musk became the world's first trillionaire on June 12 when SpaceX went public.",
      "SpaceX opened its first day of trading as a public company at a valuation of nearly $2 trillion. Musk owns 38% of the company (including options).",
      "He is a cofounder of seven companies, including electric car maker Tesla, rocketmaker SpaceX and artificial intelligence startup xAI.",
      "SpaceX, founded in 2002, acquired xAI in February in a deal that valued the combined company at $1.25 trillion. Twitter, which Musk bought in 2022, was merged into xAI nearly a year earlier.",
      "He owns nearly 11% of Tesla, which he first backed in 2004, and which he's led as CEO since 2008. That excludes unvested restricted stock from his 2018 CEO performance award that could give Musk another 8% upon vesting (before taxes).",
      "While the bulk of his fortune is held in SpaceX and to a lesser extent Tesla, Musk also founded and has stakes in tunneling startup The Boring Company and brain implant outfit Neuralink."
    ],
    selfMadeScore: 8,
    philanthropyScore: 1,
    residence: "Austin, Texas",
    citizenship: "United States",
    maritalStatus: "Divorced",
    children: 14,
    education: "Bachelor of Arts/Science, University of Pennsylvania",
    didYouKnowFacts: [
      "Musk, who says he's worried about population collapse, has fathered at least 14 children with four women, including triplets and two sets of twins.",
      "Musk slept on the factory floor at Tesla during Model 3 production ramping in 2018, working up to 120 hours a week."
    ],
    inTheirOwnWordsQuote: "“I operate on the physics approach to analysis. You boil things down to the first principles or fundamental truths in a particular area and then you reason up from there.”"
  },
  {
    id: "2",
    rank: 2,
    name: "Bernard Arnault & family",
    netWorth: "$233 B",
    changeStatus: "DOWN",
    age: 75,
    country: "France",
    source: "LVMH",
    industry: "Fashion & Retail",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80",
    highlightText: "Bernard Arnault oversees the LVMH empire of 75 fashion and cosmetics brands, including Louis Vuitton and Sephora.",
    endYear: 2026,
    titleRole: "CEO & Chairman, LVMH",
    realTimeNetWorth: "$233B",
    realTimeChange: "▲ $1.5B (0.65%)",
    realTimeAsOf: "10/7/26",
    listNetWorthAsOf: "3/10/26",
    photoCredit: "TIMES CHICAGO FOR BILLIONAIRES",
    wealthHistory: [
      { year: 2017, value: 41 },
      { year: 2018, value: 72 },
      { year: 2019, value: 76 },
      { year: 2020, value: 76 },
      { year: 2021, value: 150 },
      { year: 2022, value: 158 },
      { year: 2023, value: 211 },
      { year: 2024, value: 233 },
      { year: 2025, value: 220 },
      { year: 2026, value: 233 },
    ],
    editorLastUpdated: "Last Updated Oct 1, 2026, 8:15am EDT",
    editorBulletPoints: [
      "Bernard Arnault oversees the LVMH empire of 75 luxury fashion and cosmetics brands.",
      "His father made a fortune in construction; Arnault used $15 million from that business to buy Christian Dior in 1984.",
      "Five of his children work in LVMH fashion houses, including Tiffany & Co., Louis Vuitton, and Tag Heuer."
    ],
    selfMadeScore: 3,
    philanthropyScore: 2,
    residence: "Paris, France",
    citizenship: "France",
    maritalStatus: "Married",
    children: 5,
    education: "Bachelor of Arts/Science, Ecole Polytechnique",
    didYouKnowFacts: [
      "Arnault is an accomplished classical pianist and reportedly bonded with his wife, Hélène Mercier, over piano duets.",
      "In 2019, Arnault pledged €200 million ($226 million) to help rebuild Notre Dame Cathedral after a devastating fire."
    ],
    inTheirOwnWordsQuote: "“Money is just a consequence. I always say to my team, don't worry too much about profitability. If you do your job well, profitability will come.”"
  },
  {
    id: "3",
    rank: 3,
    name: "Jeff Bezos",
    netWorth: "$194 B",
    changeStatus: "UP",
    age: 60,
    country: "United States",
    source: "Amazon",
    industry: "Technology",
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80",
    highlightText: "Jeff Bezos founded e-commerce giant Amazon in 1994 out of his Seattle garage and now focuses on space company Blue Origin.",
    endYear: 2026,
    titleRole: "Executive Chairman, Amazon",
    realTimeNetWorth: "$194B",
    realTimeChange: "▲ $2.1B (1.10%)",
    realTimeAsOf: "10/7/26",
    listNetWorthAsOf: "3/10/26",
    photoCredit: "TIMES CHICAGO FOR BILLIONAIRES",
    wealthHistory: [
      { year: 2017, value: 72 },
      { year: 2018, value: 112 },
      { year: 2019, value: 131 },
      { year: 2020, value: 113 },
      { year: 2021, value: 177 },
      { year: 2022, value: 171 },
      { year: 2023, value: 114 },
      { year: 2024, value: 194 },
      { year: 2025, value: 188 },
      { year: 2026, value: 194 },
    ],
    editorLastUpdated: "Last Updated Sep 28, 2026",
    editorBulletPoints: [
      "Jeff Bezos stepped down as CEO of Amazon in 2021 to become executive chairman.",
      "He owns aerospace company Blue Origin, which launched its first human spaceflight in July 2021 with Bezos onboard.",
      "He owns The Washington Post, which he purchased in 2013 for $250 million."
    ],
    selfMadeScore: 8,
    philanthropyScore: 2,
    residence: "Miami, Florida",
    citizenship: "United States",
    maritalStatus: "Engaged",
    children: 4,
    education: "Bachelor of Arts/Science, Princeton University",
    didYouKnowFacts: [
      "Bezos accepted a $300,000 investment from his parents in 1995 to start Amazon when the internet was still nascent.",
      "His space venture Blue Origin is named after the blue marble Earth."
    ],
    inTheirOwnWordsQuote: "“If you double the number of experiments you do per year, you're going to double your inventiveness.”"
  },
  {
    id: "4",
    rank: 4,
    name: "Mark Zuckerberg",
    netWorth: "$177 B",
    changeStatus: "UP",
    age: 40,
    country: "United States",
    source: "Meta",
    industry: "Technology",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80",
    highlightText: "Mark Zuckerberg started Facebook at Harvard in 2004 at age 19 and has pivoted Meta heavily into AI and hardware.",
    endYear: 2026,
    titleRole: "CEO, Meta",
    realTimeNetWorth: "$177B",
    realTimeChange: "▲ $3.4B (1.95%)",
    realTimeAsOf: "10/7/26",
    listNetWorthAsOf: "3/10/26",
    photoCredit: "TIMES CHICAGO FOR BILLIONAIRES",
    wealthHistory: [
      { year: 2017, value: 56 },
      { year: 2018, value: 71 },
      { year: 2019, value: 62 },
      { year: 2020, value: 54 },
      { year: 2021, value: 97 },
      { year: 2022, value: 67 },
      { year: 2023, value: 64 },
      { year: 2024, value: 177 },
      { year: 2025, value: 170 },
      { year: 2026, value: 177 },
    ],
    editorLastUpdated: "Last Updated Oct 5, 2026",
    editorBulletPoints: [
      "Mark Zuckerberg launched Facebook at Harvard in 2004 for students to connect.",
      "He took Facebook public in May 2012; he still owns about 13% of Meta's stock.",
      "Zuckerberg and his wife Priscilla Chan pledged to give away 99% of their Meta stake over their lifetimes."
    ],
    selfMadeScore: 8,
    philanthropyScore: 2,
    residence: "Palo Alto, California",
    citizenship: "United States",
    maritalStatus: "Married",
    children: 3,
    education: "Drop Out, Harvard University",
    didYouKnowFacts: [
      "Zuckerberg actively trains in Brazilian Jiu-Jitsu and has won medals in regional tournaments.",
      "He built an AI assistant for his home named Jarvis, voiced by Morgan Freeman."
    ],
    inTheirOwnWordsQuote: "“The biggest risk is not taking any risk. In a world that's changing really quickly, the only strategy that is guaranteed to fail is not taking risks.”"
  },
];

export function getBillionairesList(): BillionaireItem[] {
  if (typeof window === "undefined") return INITIAL_BILLIONAIRES;
  try {
    const stored = localStorage.getItem("wsj_billionaires_list");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.slice(0, 20);
      }
    }
  } catch (e) {}
  return INITIAL_BILLIONAIRES;
}

export function saveBillionairesList(items: BillionaireItem[]): void {
  if (typeof window === "undefined") return;
  try {
    const trimmed = items.slice(0, 20).map((item, index) => ({
      ...item,
      rank: index + 1,
    }));
    localStorage.setItem("wsj_billionaires_list", JSON.stringify(trimmed));
    window.dispatchEvent(new Event("wsj_billionaires_updated"));
  } catch (e) {}
}
