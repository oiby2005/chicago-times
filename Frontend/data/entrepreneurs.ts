export interface CompanyShareholding {
  id: string;
  name: string;        // e.g. "Tesla"
  role: string;        // e.g. "CEO" or "Founder & CEO"
  website: string;     // e.g. "www.tesla.com"
  logoUrl?: string;    // logo icon URL
}

export interface EntrepreneurItem {
  id: string;
  rank: number;
  name: string;
  titleRole: string;       // e.g. "Founder & CEO"
  bio: string;             // paragraph bio
  website: string;         // e.g. "www.alexmorgan.com"
  photoUrl: string;        // portrait image
  age: number | string;
  country: string;
  source: string;          // e.g. "Tesla, SpaceX"
  industry: string;
  gender?: string;
  netWorthMillions?: string; // in millions, e.g. "$850 M"

  // Companies & Shareholdings (from Image 1)
  companies: CompanyShareholding[];

  // Additional Profile Details
  highlightText?: string;
  editorLastUpdated?: string;
  editorBulletPoints?: string[];
  selfMadeScore?: string | number;
  philanthropyScore?: string | number;
  residence?: string;
  citizenship?: string;
  maritalStatus?: string;
  children?: string | number;
  education?: string;
  didYouKnowFacts?: string[];
  inTheirOwnWordsQuote?: string;
  inTheirOwnWordsQuote2?: string;
  inTheirOwnWordsQuotes?: string[];
}

export const INITIAL_ENTREPRENEURS: EntrepreneurItem[] = [
  {
    id: "1",
    rank: 1,
    name: "Alex Morgan",
    titleRole: "Founder & CEO",
    bio: "Alex Morgan is a visionary entrepreneur building innovative companies that create a more sustainable, connected and inclusive future.",
    website: "www.alexmorgan.com",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
    age: 38,
    country: "United States",
    source: "CleanTech & Aerospace",
    industry: "Technology",
    gender: "Male",
    netWorthMillions: "$850 M",
    highlightText: "Alex Morgan has rapidly emerged as one of the most influential innovators of this decade, leading frontier developments in orbital robotics and green power grids.",
    companies: [
      {
        id: "c1",
        name: "Tesla",
        role: "CEO",
        website: "www.tesla.com",
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e8/Tesla_logo.png",
      },
      {
        id: "c2",
        name: "SpaceX",
        role: "Founder & CEO",
        website: "www.spacex.com",
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2e/SpaceX_logo_black.svg",
      },
      {
        id: "c3",
        name: "xAI",
        role: "Founder & CEO",
        website: "www.x.ai",
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/5/57/X_logo_2023_%28white%29.png",
      },
      {
        id: "c4",
        name: "Neuralink",
        role: "Founder",
        website: "www.neuralink.com",
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/8/87/Neuralink_logo.svg",
      },
    ],
    editorLastUpdated: "Last Updated Oct 10, 2026, 9:00am",
    editorBulletPoints: [
      "Alex Morgan oversees a portfolio of advanced frontier technology startups spanning 4 continents.",
      "His primary venture secured $140M in Series C financing at a valuation surpassing $1.2 billion.",
      "Morgan advocates for open-source AI infrastructure and decarbonized manufacturing systems.",
      "Recognized by Times Chicago as one of the top innovators reshaping international capital markets."
    ],
    selfMadeScore: 9,
    philanthropyScore: 3,
    residence: "San Francisco, California",
    citizenship: "United States",
    maritalStatus: "Single",
    children: 0,
    education: "B.S. in Electrical Engineering & Computer Science, Stanford University",
    didYouKnowFacts: [
      "Founded his first commercial software enterprise at age 19 from a university dormitory.",
      "Holds 18 registered international patents in high-density energy storage and power management.",
      "Is an avid amateur pilot and competitive marathon runner."
    ],
    inTheirOwnWordsQuote: "True innovation doesn't just disrupt existing systems — it elevates society by solving problems that previously seemed insurmountable."
  },
  {
    id: "2",
    rank: 2,
    name: "Elena Rostova",
    titleRole: "Co-Founder & Chief Scientist",
    bio: "Elena Rostova is pioneering next-generation synthetic biology and targeted therapeutics, transforming personalized medicine on a global scale.",
    website: "www.elenarostova.io",
    photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
    age: 36,
    country: "United Kingdom",
    source: "BioTech Innovations",
    industry: "Healthcare & Pharmaceuticals",
    gender: "Female",
    netWorthMillions: "$720 M",
    highlightText: "Rostova's groundbreaking genomics platform reduced rare disease diagnostic timelines from months to minutes.",
    companies: [
      {
        id: "c2_1",
        name: "BioHelix Labs",
        role: "Co-Founder & CEO",
        website: "www.biohelix.org",
        logoUrl: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=120&q=80",
      },
      {
        id: "c2_2",
        name: "SynthoGene",
        role: "Chief Scientist",
        website: "www.synthogene.com",
        logoUrl: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=120&q=80",
      },
    ],
    editorLastUpdated: "Last Updated Oct 8, 2026",
    editorBulletPoints: [
      "Published over 40 peer-reviewed papers in nature biotechnology prior to commercializing research.",
      "BioHelix announced partnerships with three sovereign healthcare funds in early 2026."
    ],
    selfMadeScore: 10,
    residence: "London, United Kingdom",
    citizenship: "United Kingdom",
    education: "Ph.D. in Molecular Biology, Cambridge University",
    didYouKnowFacts: [
      "Built laboratory prototypes with open-source 3D printers during graduate school."
    ]
  },
  {
    id: "3",
    rank: 3,
    name: "Marcus Vance",
    titleRole: "Founder & Executive Chairman",
    bio: "Marcus Vance leads autonomous transport and robotics infrastructure designed for smart cities and zero-emission transit networks.",
    website: "www.marcusvance.com",
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
    age: 41,
    country: "United States",
    source: "Autonomous Mobility",
    industry: "Transportation & Logistics",
    gender: "Male",
    netWorthMillions: "$640 M",
    highlightText: "Vance's automated freight fleet now operates on major highway corridors across North America.",
    companies: [
      {
        id: "c3_1",
        name: "Vance Mobility",
        role: "Founder & CEO",
        website: "www.vancemobility.com",
      },
      {
        id: "c3_2",
        name: "AeroFleet",
        role: "Chairman",
        website: "www.aerofleet.tech",
      },
    ],
    selfMadeScore: 8,
    residence: "Austin, Texas",
    citizenship: "United States",
    education: "B.S. in Mechanical Engineering, MIT",
    didYouKnowFacts: [
      "Began his career retrofitting commercial diesel trucks with electric drivetrains."
    ]
  },
  {
    id: "4",
    rank: 4,
    name: "Sofia Al-Mansoor",
    titleRole: "Founder & Managing Director",
    bio: "Sofia Al-Mansoor is creating high-efficiency solar desalination plants powering agricultural revitalization across arid climates.",
    website: "www.sofiaalmansoor.com",
    photoUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80",
    age: 39,
    country: "United Arab Emirates",
    source: "Clean Water & Solar",
    industry: "Energy",
    gender: "Female",
    netWorthMillions: "$590 M",
    highlightText: "Her solar arrays generate both drinkable water and clean megawatt-hours simultaneously.",
    companies: [
      {
        id: "c4_1",
        name: "Oasis Energy",
        role: "Founder & CEO",
        website: "www.oasisenergy.ae",
      },
    ],
    selfMadeScore: 9,
    residence: "Dubai, UAE",
    citizenship: "United Arab Emirates",
    education: "M.S. in Chemical Engineering, Imperial College London",
    didYouKnowFacts: [
      "Operates testing facilities spanning three desert research corridors."
    ]
  },
  {
    id: "5",
    rank: 5,
    name: "David Chen",
    titleRole: "CEO & Co-Founder",
    bio: "David Chen is engineering quantum-resilient cryptographic semiconductors and photonic computing processors.",
    website: "www.davidchen.tech",
    photoUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80",
    age: 35,
    country: "Singapore",
    source: "Semiconductors & Quantum",
    industry: "Technology",
    gender: "Male",
    netWorthMillions: "$540 M",
    highlightText: "Chen's optical chip designs achieve 100x efficiency over traditional silicon in AI model training.",
    companies: [
      {
        id: "c5_1",
        name: "Photonix Micro",
        role: "Co-Founder & CEO",
        website: "www.photonixmicro.com",
      },
    ],
    selfMadeScore: 9,
    residence: "Singapore",
    citizenship: "Singapore",
    education: "Ph.D. in Applied Physics, National University of Singapore",
    didYouKnowFacts: [
      "Built the first proof-of-concept photonic processor in a university research cleanroom."
    ]
  },
  {
    id: "6",
    rank: 6,
    name: "Amara Okonjo",
    titleRole: "Founder & CEO",
    bio: "Amara Okonjo is digitizing agricultural supply chains and micro-lending for independent farmers across sub-Saharan Africa.",
    website: "www.amaraokonjo.org",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    age: 37,
    country: "Nigeria",
    source: "AgriTech & Fintech",
    industry: "Business & Finance",
    gender: "Female",
    netWorthMillions: "$480 M",
    highlightText: "Over 2.5 million farmers now use Okonjo's platform for crop insurance and fertilizer distribution.",
    companies: [
      {
        id: "c6_1",
        name: "FarmPulse Africa",
        role: "Founder & CEO",
        website: "www.farmpulse.africa",
      },
    ],
    selfMadeScore: 10,
    residence: "Lagos, Nigeria",
    citizenship: "Nigeria",
    education: "MBA, Harvard Business School",
    didYouKnowFacts: [
      "Started the business as a mobile SMS alert service for regional market crop pricing."
    ]
  },
  {
    id: "7",
    rank: 7,
    name: "Kenji Sato",
    titleRole: "Founder & CTO",
    bio: "Kenji Sato designs autonomous humanoid robotic systems designed to augment elder care and precision industrial labor.",
    website: "www.kenjisato.jp",
    photoUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80",
    age: 42,
    country: "Japan",
    source: "Robotics & Automation",
    industry: "Manufacturing",
    gender: "Male",
    netWorthMillions: "$430 M",
    highlightText: "Sato's robotic actuators replicate human motor elasticity with sub-millimeter dexterity.",
    companies: [
      {
        id: "c7_1",
        name: "Miraibot Robotics",
        role: "Founder & CTO",
        website: "www.miraibot.jp",
      },
    ],
    selfMadeScore: 8,
    residence: "Tokyo, Japan",
    citizenship: "Japan",
    education: "M.S. in Robotics, University of Tokyo",
    didYouKnowFacts: [
      "Former competitive kendo champion before shifting focus to robotic locomotion research."
    ]
  },
  {
    id: "8",
    rank: 8,
    name: "Clara Lindqvist",
    titleRole: "CEO & Co-Founder",
    bio: "Clara Lindqvist leads fossil-free steel and green hydrogen production facilities powering heavy industry decarbonization.",
    website: "www.claralindqvist.se",
    photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80",
    age: 40,
    country: "Sweden",
    source: "Green Metallurgy",
    industry: "Metals and Mining",
    gender: "Female",
    netWorthMillions: "$390 M",
    highlightText: "Her hydrogen blast furnaces produce zero greenhouse emissions during commercial steel smelting.",
    companies: [
      {
        id: "c8_1",
        name: "Nordic Green Iron",
        role: "Co-Founder & CEO",
        website: "www.nordicgreeniron.se",
      },
    ],
    selfMadeScore: 9,
    residence: "Stockholm, Sweden",
    citizenship: "Sweden",
    education: "M.S. in Metallurgy, KTH Royal Institute of Technology",
    didYouKnowFacts: [
      "Partnered with Scandinavian municipal utilities to recycle waste heat directly into local district heating grids."
    ]
  },
  {
    id: "9",
    rank: 9,
    name: "Mateo Morales",
    titleRole: "Founder & CEO",
    bio: "Mateo Morales created the leading decentralized digital identity and sovereign credentials protocol in Latin America.",
    website: "www.mateomorales.co",
    photoUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=80",
    age: 33,
    country: "Colombia",
    source: "Cybersecurity & Identity",
    industry: "Technology",
    gender: "Male",
    netWorthMillions: "$360 M",
    highlightText: "Now secures digital government portals and municipal voting verification across 6 nations.",
    companies: [
      {
        id: "c9_1",
        name: "Aegis ID",
        role: "Founder & CEO",
        website: "www.aegisid.co",
      },
    ],
    selfMadeScore: 10,
    residence: "Medellín, Colombia",
    citizenship: "Colombia",
    education: "B.S. in Computer Science, Universidad de los Andes",
    didYouKnowFacts: [
      "Won global white-hat cybersecurity bounties before turning to entrepreneurship."
    ]
  },
  {
    id: "10",
    rank: 10,
    name: "Dr. Evelyn Reed",
    titleRole: "Co-Founder & CEO",
    bio: "Dr. Evelyn Reed is pioneering carbon-negative architectural concrete utilizing captured industrial CO2 mineralization.",
    website: "www.evelynreed.com",
    photoUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80",
    age: 44,
    country: "Canada",
    source: "Sustainable Materials",
    industry: "Construction",
    gender: "Female",
    netWorthMillions: "$320 M",
    highlightText: "Her concrete formulations have sequestered over 500,000 tons of carbon in skyscraper foundations.",
    companies: [
      {
        id: "c10_1",
        name: "CarboCrete Solutions",
        role: "Co-Founder & CEO",
        website: "www.carbocrete.ca",
      },
    ],
    selfMadeScore: 8,
    residence: "Vancouver, Canada",
    citizenship: "Canada",
    education: "Ph.D. in Civil Engineering, University of British Columbia",
    didYouKnowFacts: [
      "Former building inspector who patented mineral curing during weekend lab experiments."
    ]
  },
  {
    id: "11",
    rank: 11,
    name: "Arjun Mehta",
    titleRole: "Founder & CEO",
    bio: "Arjun Mehta is architecting rapid localized satellite connectivity arrays for maritime and remote logistics fleets.",
    website: "www.arjunmehta.in",
    photoUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80",
    age: 36,
    country: "India",
    source: "Satellite Communications",
    industry: "Telecommunications",
    gender: "Male",
    netWorthMillions: "$290 M",
    highlightText: "Deployed 48 low-earth orbit nano-satellites offering ultra-low latency telematics.",
    companies: [
      {
        id: "c11_1",
        name: "OrbitNet Space",
        role: "Founder & CEO",
        website: "www.orbitnetspace.in",
      },
    ],
    selfMadeScore: 9,
    residence: "Bengaluru, India",
    citizenship: "India",
    education: "B.Tech in Aerospace, IIT Bombay",
    didYouKnowFacts: [
      "Launched his initial satellite payload as an undergraduate team leader."
    ]
  },
  {
    id: "12",
    rank: 12,
    name: "Camille Laurent",
    titleRole: "Creative Director & CEO",
    bio: "Camille Laurent is revolutionizing circular luxury textiles using bio-fabricated mycelium and plant-based polymers.",
    website: "www.camillelaurent.fr",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    age: 38,
    country: "France",
    source: "Sustainable Fashion",
    industry: "Fashion & Luxury",
    gender: "Female",
    netWorthMillions: "$270 M",
    highlightText: "Collaborating with elite Parisian fashion houses to replace traditional petroleum synthetics.",
    companies: [
      {
        id: "c12_1",
        name: "MycoCouture",
        role: "Founder & CEO",
        website: "www.mycocouture.fr",
      },
    ],
    selfMadeScore: 8,
    residence: "Paris, France",
    citizenship: "France",
    education: "Master of Fine Arts, École des Beaux-Arts",
    didYouKnowFacts: [
      "Cultivates gourmet mushrooms in her home conservatory as a personal hobby."
    ]
  },
  {
    id: "13",
    rank: 13,
    name: "Lucas Müller",
    titleRole: "Founder & Managing Partner",
    bio: "Lucas Müller operates deep-tech venture acceleration laboratories focused on commercial fusion and magnetics.",
    website: "www.lucasmueller.de",
    photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80",
    age: 43,
    country: "Germany",
    source: "Deep Tech & Fusion",
    industry: "Energy",
    gender: "Male",
    netWorthMillions: "$250 M",
    highlightText: "Backed early magnetic confinement breakthroughs achieving sustained plasma equilibrium.",
    companies: [
      {
        id: "c13_1",
        name: "Ignition Labs",
        role: "Managing Partner",
        website: "www.ignitionlabs.de",
      },
    ],
    selfMadeScore: 7,
    residence: "Munich, Germany",
    citizenship: "Germany",
    education: "Ph.D. in Plasma Physics, Technical University of Munich",
    didYouKnowFacts: [
      "Published a popular science book translating quantum principles for everyday readers."
    ]
  },
  {
    id: "14",
    rank: 14,
    name: "Zainab Al-Hassan",
    titleRole: "Founder & CEO",
    bio: "Zainab Al-Hassan develops zero-waste automated hydroponic indoor farms tailored for urban food security.",
    website: "www.zainabalhassan.com",
    photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
    age: 34,
    country: "Saudi Arabia",
    source: "Controlled Environment Agri",
    industry: "Agriculture",
    gender: "Female",
    netWorthMillions: "$230 M",
    highlightText: "Supplies high-nutrient leafy greens to over 400 supermarkets across the Arabian Gulf.",
    companies: [
      {
        id: "c14_1",
        name: "GreenTower Farms",
        role: "Founder & CEO",
        website: "www.greentower.sa",
      },
    ],
    selfMadeScore: 9,
    residence: "Riyadh, Saudi Arabia",
    citizenship: "Saudi Arabia",
    education: "B.S. in Agricultural Science, King Saud University",
    didYouKnowFacts: [
      "Her farms consume 95% less water than open-field cultivation."
    ]
  },
  {
    id: "15",
    rank: 15,
    name: "Nico Santoro",
    titleRole: "Founder & Chief Architect",
    bio: "Nico Santoro engineers decentralized peer-to-peer microgrids enabling solar homeowners to trade energy autonomously.",
    website: "www.nicosantoro.it",
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
    age: 36,
    country: "Italy",
    source: "Grid Modernization",
    industry: "Energy",
    gender: "Male",
    netWorthMillions: "$210 M",
    highlightText: "Facilitated over 18 million peer-to-peer kilowatt hour transactions across Southern Europe.",
    companies: [
      {
        id: "c15_1",
        name: "VoltaGrid Protocol",
        role: "Founder & CEO",
        website: "www.voltagrid.io",
      },
    ],
    selfMadeScore: 8,
    residence: "Milan, Italy",
    citizenship: "Italy",
    education: "M.S. in Electrical Systems, Politecnico di Milano",
    didYouKnowFacts: [
      "Constructed a self-sufficient solar home in the Tuscan hills."
    ]
  },
  {
    id: "16",
    rank: 16,
    name: "Tanya Govender",
    titleRole: "CEO & Co-Founder",
    bio: "Tanya Govender builds AI-powered mineral deposit prospecting tools identifying critical rare earth elements with minimal drilling.",
    website: "www.tanyagovender.za",
    photoUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80",
    age: 39,
    country: "South Africa",
    source: "Geological AI",
    industry: "Metals and Mining",
    gender: "Female",
    netWorthMillions: "$195 M",
    highlightText: "Pinpointed 4 major copper and lithium reserves without destructive exploratory trenching.",
    companies: [
      {
        id: "c16_1",
        name: "TerraScan Analytics",
        role: "Co-Founder & CEO",
        website: "www.terrascan.co.za",
      },
    ],
    selfMadeScore: 9,
    residence: "Johannesburg, South Africa",
    citizenship: "South Africa",
    education: "Ph.D. in Geophysics, University of the Witwatersrand",
    didYouKnowFacts: [
      "Led high-altitude geological surveys in the Drakensberg mountains."
    ]
  },
  {
    id: "17",
    rank: 17,
    name: "Ethan Walker",
    titleRole: "Founder & CEO",
    bio: "Ethan Walker is pioneering high-bandwidth non-invasive neural interface wearables for hands-free computer control.",
    website: "www.ethanwalker.io",
    photoUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80",
    age: 31,
    country: "United States",
    source: "Neural Interfaces",
    industry: "Technology",
    gender: "Male",
    netWorthMillions: "$180 M",
    highlightText: "Allowed paralyzed individuals to type up to 60 words per minute via surface EMG headset sensors.",
    companies: [
      {
        id: "c17_1",
        name: "SynapTech Wearables",
        role: "Founder & CEO",
        website: "www.synaptech.io",
      },
    ],
    selfMadeScore: 10,
    residence: "Seattle, Washington",
    citizenship: "United States",
    education: "B.S. in Cognitive Neuroscience, University of Washington",
    didYouKnowFacts: [
      "Tested his earliest neural prototypes by playing chess with eye and brow twitches."
    ]
  },
  {
    id: "18",
    rank: 18,
    name: "Leila Haddad",
    titleRole: "Founder & Chief Strategist",
    bio: "Leila Haddad builds decentralized micro-factories utilizing recycled ocean polymers to create disaster relief shelters.",
    website: "www.leilahaddad.org",
    photoUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80",
    age: 38,
    country: "Lebanon",
    source: "Emergency Infrastructure",
    industry: "Construction",
    gender: "Female",
    netWorthMillions: "$165 M",
    highlightText: "Deployed over 4,000 thermal-insulated modular homes across earthquake and crisis zones.",
    companies: [
      {
        id: "c18_1",
        name: "Resilient Shelters",
        role: "Founder & CEO",
        website: "www.resilientshelters.org",
      },
    ],
    selfMadeScore: 9,
    residence: "Beirut, Lebanon",
    citizenship: "Lebanon",
    education: "Master of Architecture, American University of Beirut",
    didYouKnowFacts: [
      "Can assemble a full 4-person emergency habitat in under 4 hours."
    ]
  },
  {
    id: "19",
    rank: 19,
    name: "Viktor Jensen",
    titleRole: "Co-Founder & CEO",
    bio: "Viktor Jensen develops carbon-negative microbial aviation fuel synthesized from industrial chimney emissions.",
    website: "www.viktorjensen.dk",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
    age: 41,
    country: "Denmark",
    source: "Sustainable Aviation Fuel",
    industry: "Energy",
    gender: "Male",
    netWorthMillions: "$150 M",
    highlightText: "Certified for commercial airline operations with 80% reduction in life-cycle emissions.",
    companies: [
      {
        id: "c19_1",
        name: "AeroBio Fuels",
        role: "Co-Founder & CEO",
        website: "www.aerobiofuels.dk",
      },
    ],
    selfMadeScore: 8,
    residence: "Copenhagen, Denmark",
    citizenship: "Denmark",
    education: "M.S. in Biotechnology, Technical University of Denmark",
    didYouKnowFacts: [
      "Cycles 20 kilometers to his bio-refinery facility every morning."
    ]
  },
  {
    id: "20",
    rank: 20,
    name: "Mei-Ling Zhou",
    titleRole: "Founder & CEO",
    bio: "Mei-Ling Zhou builds ultrasonic micro-surgical robotics enabling non-invasive tumor ablation without incisions.",
    website: "www.meilingzhou.cn",
    photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
    age: 39,
    country: "China",
    source: "Precision Surgical Robotics",
    industry: "Healthcare & Pharmaceuticals",
    gender: "Female",
    netWorthMillions: "$135 M",
    highlightText: "Over 8,000 successful clinical procedures completed across Asian teaching hospitals.",
    companies: [
      {
        id: "c20_1",
        name: "Ablatech Medical",
        role: "Founder & CEO",
        website: "www.ablatech.cn",
      },
    ],
    selfMadeScore: 9,
    residence: "Shanghai, China",
    citizenship: "China",
    education: "Ph.D. in Biomedical Engineering, Tsinghua University",
    didYouKnowFacts: [
      "Holds black belts in both judo and calligraphy."
    ]
  }
];

export function getEntrepreneursList(): EntrepreneurItem[] {
  if (typeof window === "undefined") {
    return INITIAL_ENTREPRENEURS;
  }

  // Auto-fetch fresh list from backend
  fetch("http://localhost:5000/api/entrepreneurs")
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => {
      if (data && data.success && Array.isArray(data.entrepreneurs) && data.entrepreneurs.length > 0) {
        const trimmed = data.entrepreneurs.slice(0, 20).map((item: any, index: number) => ({
          ...item,
          rank: index + 1,
        }));
        const existing = localStorage.getItem("wsj_entrepreneurs_list");
        const newStr = JSON.stringify(trimmed);
        if (existing !== newStr) {
          localStorage.setItem("wsj_entrepreneurs_list", newStr);
          window.dispatchEvent(new Event("wsj_entrepreneurs_updated"));
        }
      }
    })
    .catch(() => {});

  try {
    const stored = localStorage.getItem("wsj_entrepreneurs_list");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.slice(0, 20);
      }
    }
  } catch (e) {}
  return INITIAL_ENTREPRENEURS;
}

export function saveEntrepreneursList(items: EntrepreneurItem[]): void {
  if (typeof window === "undefined") return;
  const trimmed = items.slice(0, 20).map((item, index) => ({
    ...item,
    rank: index + 1,
  }));

  try {
    localStorage.setItem("wsj_entrepreneurs_list", JSON.stringify(trimmed));
    window.dispatchEvent(new Event("wsj_entrepreneurs_updated"));
  } catch (e) {}

  // Save to MySQL database & upload images to Backblaze B2
  fetch("http://localhost:5000/api/entrepreneurs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ entrepreneurs: trimmed }),
  })
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => {
      if (data && data.success && Array.isArray(data.entrepreneurs) && data.entrepreneurs.length > 0) {
        const updated = data.entrepreneurs.slice(0, 20).map((item: any, index: number) => ({
          ...item,
          rank: index + 1,
        }));
        localStorage.setItem("wsj_entrepreneurs_list", JSON.stringify(updated));
        window.dispatchEvent(new Event("wsj_entrepreneurs_updated"));
      }
    })
    .catch((err) => {
      console.warn("Backend save entrepreneurs error:", err);
    });
}
