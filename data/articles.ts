export interface Article {
  id: string;
  slug: string;
  title: string;
  summary?: string;
  deck?: string;
  category?: string;
  topicBreadcrumb?: string;
  author?: string;
  publishedDate?: string;
  imageUrl?: string;
  photoCaption?: string;
  photoCredit?: string;
  commentCount?: number;
  listenTime?: string;
  timestamp?: string;
  tag?: string; // 'EXCLUSIVE' | 'LIVE' | etc.
  subLinks?: { title: string; href: string }[];
  isOpinion?: boolean;
  dateline?: string;
  paragraphs?: string[];
}

export const homepageArticles: Record<string, Article> = {
  // Featured Article from Screenshots
  "trump-frustrated-homeland-security-secretary": {
    id: "0",
    slug: "trump-frustrated-homeland-security-secretary",
    topicBreadcrumb: "POLITICS • POLICY",
    title: "Trump Is Increasingly Frustrated With His Homeland Security Secretary",
    summary: "While president has complained about Markwayne Mullin, an administration official says Trump has no plans to fire him",
    deck: "While president has complained about Markwayne Mullin, an administration official says Trump has no plans to fire him",
    category: "Politics",
    author: "Michelle Hackman and Marianne LeVine",
    publishedDate: "Aug. 7, 2026 9:00 pm ET",
    imageUrl: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=1200&q=80",
    photoCaption: "Homeland Security Secretary Markwayne Mullin is facing strong internal opposition",
    photoCredit: "JULIA DEMAREE NIKHINSON/AP",
    commentCount: 181,
    listenTime: "2 min",
    dateline: "WASHINGTON",
    paragraphs: [
      "WASHINGTON—President Trump is growing increasingly frustrated with Homeland Security Secretary Markwayne Mullin after Mullin made a series of off-message remarks recently that angered many of the president’s outside allies, according to people familiar with the matter.",
      "Trump has complained to advisers and cabinet members about Mullin’s performance during recent high-stakes immigration and border policy meetings at the White House, the people said. Despite the private criticism, a senior administration official emphasized that the president currently has no plans to replace him.",
      "The friction highlights the mounting political pressure facing the Department of Homeland Security as it executes sweeping federal policy mandates amid intense public and congressional scrutiny.",
      "White House aides have urged cabinet secretaries to maintain tight discipline around public messaging, particularly regarding enforcement timelines and inter-agency coordination.",
      "Mullin, a former U.S. senator who assumed leadership of the department earlier this year, has faced pushback from both party lawmakers and immigration advocacy groups over enforcement priorities and departmental resource allocation.",
      "Department officials declined to comment on internal deliberations but reiterated that the secretary remains fully focused on advancing the administration’s border security agenda and protecting public safety."
    ],
  },
  "trump-frustrated-homeland-security": {
    id: "0b",
    slug: "trump-frustrated-homeland-security",
    topicBreadcrumb: "POLITICS • POLICY",
    title: "Trump Is Increasingly Frustrated With His Homeland Security Secretary",
    summary: "While president has complained about Markwayne Mullin, an administration official says Trump has no plans to fire him",
    deck: "While president has complained about Markwayne Mullin, an administration official says Trump has no plans to fire him",
    category: "Politics",
    author: "Michelle Hackman and Marianne LeVine",
    publishedDate: "Aug. 7, 2026 9:00 pm ET",
    imageUrl: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=1200&q=80",
    photoCaption: "Homeland Security Secretary Markwayne Mullin is facing strong internal opposition",
    photoCredit: "JULIA DEMAREE NIKHINSON/AP",
    commentCount: 181,
    listenTime: "2 min",
    dateline: "WASHINGTON",
    paragraphs: [
      "WASHINGTON—President Trump is growing increasingly frustrated with Homeland Security Secretary Markwayne Mullin after Mullin made a series of off-message remarks recently that angered many of the president’s outside allies, according to people familiar with the matter.",
      "Trump has complained to advisers and cabinet members about Mullin’s performance during recent high-stakes immigration and border policy meetings at the White House, the people said. Despite the private criticism, a senior administration official emphasized that the president currently has no plans to replace him.",
      "The friction highlights the mounting political pressure facing the Department of Homeland Security as it executes sweeping federal policy mandates amid intense public and congressional scrutiny.",
      "White House aides have urged cabinet secretaries to maintain tight discipline around public messaging, particularly regarding enforcement timelines and inter-agency coordination.",
      "Mullin, a former U.S. senator who assumed leadership of the department earlier this year, has faced pushback from both party lawmakers and immigration advocacy groups over enforcement priorities and departmental resource allocation.",
      "Department officials declined to comment on internal deliberations but reiterated that the secretary remains fully focused on advancing the administration’s border security agenda and protecting public safety."
    ],
  },
  // Left Column Articles
  "us-intel-putin-nato": {
    id: "1",
    slug: "us-intel-putin-nato",
    tag: "EXCLUSIVE",
    title: "U.S. Intel Finds Putin Could Test NATO's Resolve With Limited Incursion",
    summary:
      "The new assessment updates past forecasts that Russia's leader wouldn't provoke the alliance during the Ukraine war.",
    commentCount: 409,
    category: "World",
    author: "Warren P. Strobel and Michael R. Gordon",
    publishedDate: "August 7, 2026",
  },
  "republican-oppose-blanche": {
    id: "2",
    slug: "republican-oppose-blanche",
    title:
      "Second Republican Will Oppose Blanche, Leaving Confirmation Down to the Wire",
    summary:
      "Sen. Lisa Murkowski joined Sen. Susan Collins in saying she won't vote for attorney-general nominee Todd Blanche.",
    commentCount: 16,
    timestamp: "43 min ago",
    category: "Politics",
    author: "Siobhan Hughes",
    publishedDate: "August 7, 2026",
  },
  "jobs-report-fed-clues": {
    id: "3",
    slug: "jobs-report-fed-clues",
    tag: "LIVE",
    title: "Jobs Report in Focus as Investors Look for Fed Clues",
    summary:
      "Stock futures ticked higher and oil prices rose modestly as the market awaits updates from the Iran-Oman talks.",
    subLinks: [
      {
        title: "SpaceX True Believers Propel Shares Past End of Epic Lockup",
        href: "/article/spacex-true-believers",
      },
    ],
    category: "Economy",
    author: "Global Economics Team",
    publishedDate: "August 7, 2026",
  },
  "meta-ordered-pay-942-million": {
    id: "4",
    slug: "meta-ordered-pay-942-million",
    title:
      "Meta Ordered to Pay $942 Million to Address Harm to Kids From Social Media",
    summary:
      "A New Mexico judge ordered the social-media giant to create a new $567 million fund in addition to paying $375 million in previously determined civil penalties.",
    commentCount: 315,
    category: "Tech",
    author: "Jeff Horwitz",
    publishedDate: "August 7, 2026",
  },
  "faa-orders-boeing-inspections": {
    id: "5",
    slug: "faa-orders-boeing-inspections",
    title:
      "FAA Orders Inspections of Hundreds of Boeing 737 MAX Jets Over Possible Cracks",
    summary:
      "Cracks were found on some older plane models in a structural reinforcement around one of the service doors, the agency said.",
    timestamp: "46 min ago",
    category: "Business",
    author: "Andrew Tangel",
    publishedDate: "August 7, 2026",
  },
  "trump-signs-birthright-citizenship": {
    id: "6",
    slug: "trump-signs-birthright-citizenship",
    title:
      "Trump Signs Executive Orders Targeting Birthright Citizenship",
    summary:
      "The orders come after the Supreme Court struck down the president's earlier attempt to limit birthright citizenship.",
    commentCount: 1693,
    category: "Politics",
    author: "Jess Bravin",
    publishedDate: "August 7, 2026",
  },
  "how-family-flower-farm-became-essential-chanel": {
    id: "fashion-chanel",
    slug: "how-family-flower-farm-became-essential-chanel",
    title: "How One Family’s Flower Farm Became Essential to Chanel No. 5",
    summary: "Watch to see why one of the world’s most recognizable fragrances depends on flowers grown in the south of France.",
    commentCount: 9,
    category: "Fashion",
    author: "WSJ. MAGAZINE",
    publishedDate: "August 8, 2026",
  },
  "live-shopping-app-where-some-people-bid-broke": {
    id: "whatnot-bidding",
    slug: "live-shopping-app-where-some-people-bid-broke",
    title: "The Live Shopping App Where Some People Bid Until They’re Broke",
    summary: "Whatnot’s fast-moving auctions and feverish “breaks” hook users hoping to buy prized sports cards—plus fashion, tools, food and nearly anything else.",
    commentCount: 372,
    category: "Tech",
    author: "Tech Team",
    publishedDate: "August 8, 2026",
  },
  "shopping-app-whatnot-valued-20-billion": {
    id: "whatnot-valuation",
    slug: "shopping-app-whatnot-valued-20-billion",
    title: "Shopping App Whatnot Valued at $20 Billion in New Funding",
    summary: "Whatnot, a fast-growing live-shopping platform, has nearly doubled its valuation in less than a year.",
    category: "Business",
    author: "Deals Team",
    publishedDate: "August 8, 2026",
  },

  // Center Column Hero Articles
  "facing-ai-apocalypse-software-race": {
    id: "7",
    slug: "facing-ai-apocalypse-software-race",
    title:
      "Facing AI 'Apocalypse,' Once-Hot Software Companies Race to Reinvent Themselves",
    summary:
      'Generative AI is steamrolling the once booming industry known as software as a service. "You have to burn the ships and start from the ground up."',
    imageUrl: "/images/hero-ai-software.jpg",
    commentCount: 69,
    category: "Tech",
    author: "Tom Dotan and Belle Lin",
    publishedDate: "August 7, 2026",
  },
  "nyc-pied-a-terre-dodge-tax": {
    id: "8",
    slug: "nyc-pied-a-terre-dodge-tax",
    title:
      "NYC's Pied-à-Terre Owners Hunt for Creative Ways to Dodge New Tax",
    summary:
      'Owners of second homes are "apoplectic" over the levy. Some are highlighting flaws to try to reduce their home\'s value or moving in family members.',
    imageUrl: "/images/nyc-skyscrapers.jpg",
    commentCount: 429,
    category: "Real Estate",
    author: "E.B. Solomont",
    publishedDate: "August 7, 2026",
  },
  "refine-baby-refine-energy-mantra": {
    id: "9",
    slug: "refine-baby-refine-energy-mantra",
    title: "‘Refine, Baby, Refine’ Is the Energy Industry’s New Mantra",
    summary:
      "America's fuel-makers are maxed out as they try to fill in the gaps of the global fuel supply crunch.",
    imageUrl: "/images/refinery-energy.jpg",
    commentCount: 43,
    category: "Business",
    author: "Benoît Morenne",
    publishedDate: "August 7, 2026",
  },
  "iran-diminished-diplomats-hormuz": {
    id: "10",
    slug: "iran-diminished-diplomats-hormuz",
    title: "Can Iran’s Diminished Diplomats Deliver a Hormuz Deal?",
    summary:
      "Hard-liners’ growing clout raises the risk that they will undermine an agreement to reopen the strait.",
    commentCount: 183,
    category: "World",
    author: "Farnaz Fassihi",
    publishedDate: "August 7, 2026",
  },
  "ratings-firm-grade-inflation-insurer-debt": {
    id: "11",
    slug: "ratings-firm-grade-inflation-insurer-debt",
    tag: "EXCLUSIVE",
    title:
      "Ratings Firm Accused of Grade Inflation Vouched for $10 Billion of Insurer Debt",
    summary:
      "Egan-Jones says it stands by the rigor of its ratings, which were banned by a key regulator and are the focus of a lawsuit brought by former employees.",
    commentCount: 3,
    category: "Finance",
    author: "Gretchen Morgenson",
    publishedDate: "August 7, 2026",
  },

  // Right Column Opinion Articles
  "trump-fixes-medicare-trick": {
    id: "12",
    slug: "trump-fixes-medicare-trick",
    title: "Trump Fixes a Biden Medicare Trick",
    author: "THE EDITORIAL BOARD",
    isOpinion: true,
    category: "Opinion",
    publishedDate: "August 7, 2026",
  },
  "socialism-is-here-and-its-serious": {
    id: "13",
    slug: "socialism-is-here-and-its-serious",
    title: "Socialism Is Here—and It's Serious",
    author: "PEGGY NOONAN",
    isOpinion: true,
    category: "Opinion",
    publishedDate: "August 7, 2026",
  },
  "due-process-ends-labor-board": {
    id: "14",
    slug: "due-process-ends-labor-board",
    title: "Due Process Ends at the Labor Board Door",
    author: "NATHAN MCGRATH",
    isOpinion: true,
    category: "Opinion",
    publishedDate: "August 7, 2026",
  },
  "russia-drones-test-europe-defenses": {
    id: "15",
    slug: "russia-drones-test-europe-defenses",
    title: "Russia's Drones Test Europe's Defenses",
    author: "THE EDITORIAL BOARD",
    isOpinion: true,
    category: "Opinion",
    publishedDate: "August 7, 2026",
  },
  "fda-replimune-new-flu-shot": {
    id: "16",
    slug: "fda-replimune-new-flu-shot",
    title: "The FDA, Replimune and a New Flu Shot",
    author: "THE EDITORIAL BOARD",
    isOpinion: true,
    category: "Opinion",
    publishedDate: "August 7, 2026",
  },
  "israel-really-obligated-lay-off-hamas": {
    id: "17",
    slug: "israel-really-obligated-lay-off-hamas",
    title: "Is Israel Really Obligated to Lay Off Hamas?",
    author: "ELLIOT KAUFMAN",
    isOpinion: true,
    category: "Opinion",
    publishedDate: "August 7, 2026",
  },
  "escaped-teen-marriage-appalachia-harvard": {
    id: "18",
    slug: "escaped-teen-marriage-appalachia-harvard",
    title:
      "She Escaped Teen Marriage in Appalachia. Her Time at Harvard Was Even Worse.",
    imageUrl: "/images/harvard-woman.jpg",
    category: "Lifestyle",
    author: "Jennifer Levitz",
    publishedDate: "August 7, 2026",
  },

  // Podcasts Section
  "can-ai-find-next-summer-romance": {
    id: "19",
    slug: "can-ai-find-next-summer-romance",
    title: "Can AI Find Your Next Summer Romance?",
    summary:
      "ICE is on a mission to track down people it considers a threat to its agents and operations. It's turning to social media to find them. Plus, would you outsource your dating life to AI? Katie Deighton hosts.",
    imageUrl: "/images/podcast-tech-news.jpg",
    category: "Podcasts",
    author: "Katie Deighton",
    publishedDate: "August 7, 2026",
  },
  "how-amazon-built-data-center-california": {
    id: "20",
    slug: "how-amazon-built-data-center-california",
    title:
      "How Amazon Built a Data Center in a California Town Without Anyone Noticing",
    imageUrl: "/images/amazon-data-center.jpg",
    commentCount: 6,
    category: "Tech",
    author: "Sebastian Herrera",
    publishedDate: "August 7, 2026",
  },
  "most-fertile-land-winemakers-30000-feet": {
    id: "21",
    slug: "most-fertile-land-winemakers-30000-feet",
    title: "The Most Fertile Land for Winemakers Is 30,000 Feet in the Air",
    imageUrl: "/images/wine-plane.jpg",
    commentCount: 1,
    category: "Lifestyle",
    author: "Lettie Teague",
    publishedDate: "August 7, 2026",
  },
  "pros-cons-putting-extra-dollars-trump-account": {
    id: "22",
    slug: "pros-cons-putting-extra-dollars-trump-account",
    title: "The Pros and Cons of Putting Extra Dollars in a Trump Account",
    tag: "LAURA SAUNDERS | TAX REPORT",
    category: "Personal Finance",
    author: "Laura Saunders",
    publishedDate: "August 7, 2026",
  },

  // Morning Catch-Up Section
  "school-shooter-kills-seven-bangkok": {
    id: "23",
    slug: "school-shooter-kills-seven-bangkok",
    title: "School Shooter Kills Seven Near Bangkok",
    summary:
      "Police say a 14-year-old boy shot his grandparents and five school staff dead before turning the gun on himself.",
    imageUrl: "/images/bangkok-factory.jpg",
    timestamp: "44 min ago",
    category: "World",
    author: "Wilawan Watcharasakwet",
    publishedDate: "August 7, 2026",
  },
  "chinas-new-export-engine-supplying-factories": {
    id: "24",
    slug: "chinas-new-export-engine-supplying-factories",
    title:
      "China’s New Export Engine: Supplying the Factories of the World",
    summary:
      "No longer just a producer of cheap consumer goods, China is exporting more high-value items that underpin global manufacturing.",
    commentCount: 11,
    subLinks: [
      {
        title: "Three Things to Know About China's Export Boom",
        href: "/article/three-things-china-export-boom",
      },
    ],
    category: "Economy",
    author: "Stella Yifan Xie",
    publishedDate: "August 7, 2026",
  },
  "pyongyang-missile-test-conflict-north-korea": {
    id: "25",
    slug: "pyongyang-missile-test-conflict-north-korea",
    title:
      "Pyongyang Missile Test Signals Growing Conflict Between North Korea and U.S. Allies",
    summary:
      "North Korea's test launch of a ballistic missile this week is stirring fresh friction with Japan, the latest example of growing military tensions in the Indo-Pacific.",
    commentCount: 2,
    category: "World",
    author: "Timothy W. Martin",
    publishedDate: "August 7, 2026",
  },
  "latest-scary-sounding-ai-milestone-new-virus": {
    id: "26",
    slug: "latest-scary-sounding-ai-milestone-new-virus",
    title:
      "The Latest Scary-Sounding AI Milestone: A Brand-New Virus",
    summary:
      "While hacks have raised safety alarms, researchers said their experiment could protect against drug-resistant bacteria and save lives.",
    commentCount: 16,
    category: "Tech",
    author: "Dustin Volz",
    publishedDate: "August 7, 2026",
  },

  // Politics Section
  "trump-orders-leak-probe-media-coverage-munitions": {
    id: "27",
    slug: "trump-orders-leak-probe-media-coverage-munitions",
    title:
      "Trump Orders Leak Probe After Venting About Media Coverage of Munitions Stockpile",
    summary:
      "The president made the demand after weeks of headlines describing depleted munitions levels associated with the Iran war.",
    commentCount: 148,
    imageUrl: "/images/hero-ai-software.jpg",
    category: "Politics",
    author: "Vivian Salama",
    publishedDate: "August 7, 2026",
  },
  "fauci-legal-trouble-contempt-vote": {
    id: "28",
    slug: "fauci-legal-trouble-contempt-vote",
    title: "Is Fauci in Legal Trouble? What to Know After Contempt Vote",
    summary:
      "A Senate panel's atypical criminal referral comes against Dr. Anthony Fauci who got a pardon and asserted Fifth Amendment rights.",
    commentCount: 698,
    category: "Politics",
    author: "Stephanie Armour",
    publishedDate: "August 7, 2026",
  },
  "max-miller-loan-campaign-million-rejecting-calls": {
    id: "29",
    slug: "max-miller-loan-campaign-million-rejecting-calls",
    tag: "EXCLUSIVE",
    title:
      "Max Miller to Loan Campaign $1 Million, Rejecting Calls to Withdraw",
    summary:
      "The Ohio congressman has said he would remain in the race despite domestic abuse allegations and pressure from Republicans to step aside.",
    commentCount: 164,
    category: "Politics",
    author: "Michael C. Bender",
    publishedDate: "August 7, 2026",
  },

  // Most Popular Sidebar
  "investors-whose-spacex-shares-vanished": {
    id: "30",
    slug: "investors-whose-spacex-shares-vanished",
    title:
      "The Investors Whose SpaceX Shares Vanished Before They Could Cash In",
    category: "Finance",
    author: "Berber Jin",
    publishedDate: "August 7, 2026",
  },
  "burger-king-whopper-fast-food-wars": {
    id: "31",
    slug: "burger-king-whopper-fast-food-wars",
    title:
      "Burger King's New Whopper Strikes a Blow in Fast-Food Burger Wars",
    category: "Business",
    author: "Heather Haddon",
    publishedDate: "August 7, 2026",
  },
  "airlines-push-back-ice-enforcement-airports": {
    id: "32",
    slug: "airlines-push-back-ice-enforcement-airports",
    tag: "EXCLUSIVE",
    title: "Airlines Push Back Against ICE Enforcement at Airports",
    category: "Business",
    author: "Alison Sider",
    publishedDate: "August 7, 2026",
  },
  "what-do-you-think-acceptable-wear-office": {
    id: "33",
    slug: "what-do-you-think-acceptable-wear-office",
    title:
      "What Do You Think Is Acceptable to Wear at the Office? Take Our Quiz",
    category: "Style",
    author: "Callie Holtermann",
    publishedDate: "August 7, 2026",
  },
  "black-professor-resignation-plagiarism-cambridge": {
    id: "34",
    slug: "black-professor-resignation-plagiarism-cambridge",
    title:
      "Black Professor's Resignation Over Plagiarism Probe Puts Cambridge in Spotlight",
    category: "World",
    author: "Douglas Belkin",
    publishedDate: "August 7, 2026",
  },

  // Business & Finance / Real Estate
  "oil-analysts-stumped-missing-barrels": {
    id: "35",
    slug: "oil-analysts-stumped-missing-barrels",
    tag: "SPENCER JAKAB | MARKETS A.M. NEWSLETTER",
    title: "Oil Analysts Stumped by the Case of the Missing Barrels",
    summary:
      "Like most whodunits, this mystery is about reconstructing past events, but it also has big implications for where energy prices are headed next.",
    imageUrl: "/images/investigator-magnifying-glass.jpg",
    commentCount: 2,
    category: "Business & Finance",
    author: "Spencer Jakab",
    publishedDate: "August 7, 2026",
  },
  "washington-dc-billionaire-boomtown": {
    id: "36",
    slug: "washington-dc-billionaire-boomtown",
    title: "Washington, D.C., Is America’s Newest Billionaire Boomtown",
    summary:
      "Cabinet officials and tech moguls are snapping up trophy properties, pushing the area's luxury housing market to new highs.",
    imageUrl: "/images/dc-townhouse.jpg",
    commentCount: 17,
    category: "Real Estate",
    author: "Will Parker",
    publishedDate: "August 7, 2026",
  },
  "howard-schultz-starbucks-hawaii-home": {
    id: "37",
    slug: "howard-schultz-starbucks-hawaii-home",
    tag: "EXCLUSIVE",
    title:
      "Former Starbucks CEO Howard Schultz Sells His Hawaii Home for $36 Million",
    summary:
      "The billionaire purchased the Hualālai Resort estate for $25 million in 2015.",
    category: "Real Estate",
    author: "Katherine Clarke",
    publishedDate: "August 7, 2026",
  },
  "ariana-grande-step-back-tour": {
    id: "38",
    slug: "ariana-grande-step-back-tour",
    title:
      "Ariana Grande Will Step Back When Her Tour Ends—Avoiding a Potential Financial Loss",
    summary:
      "Pop stars who've canceled shows in the past can face messy insurance disputes.",
    imageUrl: "/images/ariana-grande.jpg",
    category: "People to Know",
    author: "Anne Steele",
    publishedDate: "August 7, 2026",
  },
  "tony-anthony-bourdain-education-food-life": {
    id: "39",
    slug: "tony-anthony-bourdain-education-food-life",
    tag: "FILM REVIEW",
    title: "‘Tony’: Anthony Bourdain’s Education in Food and Life",
    summary:
      "Dominic Sessa stars in a superb biopic about the renowned chef, years before fame, that stresses the value of discipline and hard work.",
    imageUrl: "/images/bourdain-movie.jpg",
    commentCount: 36,
    category: "At the Movies",
    author: "Joe Morgenstern",
    publishedDate: "August 7, 2026",
  },
  "teenage-sex-death-camp-miasma": {
    id: "40",
    slug: "teenage-sex-death-camp-miasma",
    tag: "FILM REVIEW",
    title: "‘Teenage Sex and Death at Camp Miasma’: A Scream Queen Resurfaces",
    summary:
      "Featuring Hannah Einbinder and Gillian Anderson, Jane Schoenbrun's meta-horror movie follows a young filmmaker rebooting a slasher franchise who connects with its original star.",
    category: "At the Movies",
    author: "Amy Nicholson",
    publishedDate: "August 7, 2026",
  },
  "hate-linen-sheets-tried-quince": {
    id: "41",
    slug: "hate-linen-sheets-tried-quince",
    tag: "BEDROOM",
    title: "I Used to Hate Linen Sheets, Until I Tried This Set From Quince",
    summary: "These sheets are soft, breathable and available in nearly 40 colors.",
    category: "WSJ Buy Side",
    publishedDate: "August 7, 2026",
  },
  "best-wealth-management-firms-fiduciary": {
    id: "42",
    slug: "best-wealth-management-firms-fiduciary",
    tag: "FINANCIAL ADVISORS",
    title:
      "10 of the Best Wealth Management Firms: Well-Known Fiduciary Investment Companies to Consider",
    summary:
      "We analyzed everything from advisor credentials to portfolio options to fees and customer support.",
    category: "WSJ Buy Side",
    publishedDate: "August 7, 2026",
  },
  "whiskey-advent-calendar-sale-early": {
    id: "43",
    slug: "whiskey-advent-calendar-sale-early",
    tag: "GIFT GUIDES",
    title:
      "Deal of the Day: This Buy Side-Favorite Whiskey Advent Calendar Is on Sale Early",
    summary: "Save $35 on our top-selling advent calendar.",
    category: "WSJ Buy Side",
    publishedDate: "August 7, 2026",
  },
  "seven-people-changed-american-entertainment": {
    id: "44",
    slug: "seven-people-changed-american-entertainment",
    title: "Seven People Who Changed the Course of American Entertainment",
    summary:
      "From P.T. Barnum to Walt Disney, these pioneers reimagined how the public wanted to be entertained.",
    category: "Journal Reports",
    author: "John Jurgensen",
    publishedDate: "August 7, 2026",
  },
};

export function getArticleBySlug(slug: string): Article {
  const found =
    homepageArticles[slug] ||
    Object.values(homepageArticles).find(
      (a) => a.slug === slug || a.slug.toLowerCase() === slug.toLowerCase()
    );

  if (found) {
    return found;
  }

  // Format headline fallback cleanly from slug
  const title = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return {
    id: slug,
    slug: slug,
    title: title,
    deck: "Full analysis, background, and expert coverage on this developing story from The Wall Street Journal.",
    summary: "Full analysis, background, and expert coverage on this developing story from The Wall Street Journal.",
    category: "Politics",
    topicBreadcrumb: "POLITICS • POLICY",
    author: "Michelle Hackman and Marianne LeVine",
    publishedDate: "Aug. 7, 2026 9:00 pm ET",
    commentCount: 181,
    listenTime: "2 min",
    imageUrl: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=1200&q=80",
    photoCaption: "Homeland Security Secretary Markwayne Mullin is facing strong internal opposition",
    photoCredit: "JULIA DEMAREE NIKHINSON/AP",
    dateline: "WASHINGTON",
    paragraphs: [
      `WASHINGTON—The latest developments regarding ${title} have sparked significant discussion among federal officials, industry leaders, and policy analysts.`,
      "According to sources familiar with the matter, executive leadership and department strategists are holding ongoing consultations to navigate the evolving economic and political landscape.",
      "“Maintaining strategic alignment and clear communication remains our top priority,” noted a senior official during a briefing at the Capitol.",
      "Analysts emphasize that regulatory updates, market trends, and stakeholder feedback will play a key role in shaping the direction of policy in the months ahead."
    ],
  };
}

