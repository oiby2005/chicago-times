const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const INITIAL_ITEMS = [
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
      { year: 2026, value: 839 }
    ]
  },
  {
    id: "2",
    rank: 2,
    name: "Bernard Arnault & family",
    netWorth: "$233 B",
    changeStatus: "UP",
    age: 75,
    country: "France",
    source: "LVMH",
    industry: "Fashion & Luxury",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80",
    highlightText: "Bernard Arnault oversees the LVMH empire of 75 fashion and cosmetics brands.",
    endYear: 2026,
    titleRole: "Chairman and CEO, LVMH",
    realTimeNetWorth: "$233B",
    realTimeChange: "▲ $1.2B (0.52%)",
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
      { year: 2026, value: 233 }
    ]
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
    highlightText: "Jeff Bezos founded e-commerce giant Amazon in 1994 out of his Seattle garage.",
    endYear: 2026,
    titleRole: "Executive Chair, Amazon",
    realTimeNetWorth: "$194B",
    realTimeChange: "▼ $800M (0.41%)",
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
      { year: 2025, value: 190 },
      { year: 2026, value: 194 }
    ]
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
    highlightText: "Mark Zuckerberg started Facebook at Harvard in 2004 at age 19.",
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
      { year: 2026, value: 177 }
    ]
  }
];

async function seedBillionaires() {
  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: process.env.DB_NAME || 'timeschicago_db',
    });

    const tableSchema = `
      id VARCHAR(64) PRIMARY KEY,
      rank INT NOT NULL,
      name VARCHAR(255) NOT NULL,
      net_worth VARCHAR(64) NOT NULL,
      change_status VARCHAR(32) DEFAULT 'UP',
      age VARCHAR(32) DEFAULT '',
      country VARCHAR(255) DEFAULT '',
      source VARCHAR(255) DEFAULT '',
      industry VARCHAR(255) DEFAULT '',
      photo_url TEXT,
      highlight_text TEXT,
      end_year INT DEFAULT 2026,
      title_role VARCHAR(255) DEFAULT '',
      real_time_net_worth VARCHAR(64) DEFAULT '',
      real_time_change VARCHAR(128) DEFAULT '',
      real_time_as_of VARCHAR(64) DEFAULT '',
      list_net_worth_as_of VARCHAR(64) DEFAULT '',
      photo_credit VARCHAR(255) DEFAULT '',
      editor_last_updated VARCHAR(255) DEFAULT '',
      editor_bullet_points LONGTEXT,
      in_their_own_words_quote TEXT,
      self_made_score VARCHAR(32) DEFAULT '',
      philanthropy_score VARCHAR(32) DEFAULT '',
      residence VARCHAR(255) DEFAULT '',
      citizenship VARCHAR(255) DEFAULT '',
      marital_status VARCHAR(128) DEFAULT '',
      children VARCHAR(32) DEFAULT '',
      education TEXT,
      did_you_know_facts LONGTEXT,
      wealth_history LONGTEXT,
      data LONGTEXT,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    `;

    await conn.query(`DROP TABLE IF EXISTS billionaires`);
    await conn.query(`DROP TABLE IF EXISTS wsj_billionaires`);
    await conn.query(`CREATE TABLE billionaires (${tableSchema})`);
    await conn.query(`CREATE TABLE wsj_billionaires (${tableSchema})`);

    const dataDir = path.join(__dirname, 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    const jsonPath = path.join(dataDir, 'billionaires.json');
    fs.writeFileSync(jsonPath, JSON.stringify(INITIAL_ITEMS, null, 2), 'utf8');

    for (let i = 0; i < INITIAL_ITEMS.length; i++) {
      const item = INITIAL_ITEMS[i];
      item.rank = i + 1;
      const insertSql = `
        INSERT INTO billionaires (
          id, rank, name, net_worth, change_status, age, country, source, industry,
          photo_url, highlight_text, end_year, title_role, real_time_net_worth,
          real_time_change, real_time_as_of, list_net_worth_as_of, photo_credit,
          editor_last_updated, editor_bullet_points, in_their_own_words_quote,
          self_made_score, philanthropy_score, residence, citizenship, marital_status,
          children, education, did_you_know_facts, wealth_history, data
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const insertSqlWsj = `
        INSERT INTO wsj_billionaires (
          id, rank, name, net_worth, change_status, age, country, source, industry,
          photo_url, highlight_text, end_year, title_role, real_time_net_worth,
          real_time_change, real_time_as_of, list_net_worth_as_of, photo_credit,
          editor_last_updated, editor_bullet_points, in_their_own_words_quote,
          self_made_score, philanthropy_score, residence, citizenship, marital_status,
          children, education, did_you_know_facts, wealth_history, data
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const params = [
        String(item.id),
        Number(item.rank || 1),
        String(item.name || ''),
        String(item.netWorth || ''),
        String(item.changeStatus || 'UP'),
        String(item.age || ''),
        String(item.country || ''),
        String(item.source || ''),
        String(item.industry || ''),
        String(item.photoUrl || ''),
        String(item.highlightText || ''),
        Number(item.endYear || 2026),
        String(item.titleRole || ''),
        String(item.realTimeNetWorth || ''),
        String(item.realTimeChange || ''),
        String(item.realTimeAsOf || ''),
        String(item.listNetWorthAsOf || ''),
        String(item.photoCredit || ''),
        String(item.editorLastUpdated || ''),
        JSON.stringify(item.editorBulletPoints || []),
        String(item.inTheirOwnWordsQuote || ''),
        String(item.selfMadeScore || ''),
        String(item.philanthropyScore || ''),
        String(item.residence || ''),
        String(item.citizenship || ''),
        String(item.maritalStatus || ''),
        String(item.children || ''),
        String(item.education || ''),
        JSON.stringify(item.didYouKnowFacts || []),
        JSON.stringify(item.wealthHistory || []),
        JSON.stringify(item)
      ];
      await conn.query(insertSql, params);
      await conn.query(insertSqlWsj, params);
    }

    console.log(`SUCCESSFULLY SEEDED ${INITIAL_ITEMS.length} BILLIONAIRES INTO MYSQL TABLES billionaires AND wsj_billionaires IN wsj_db!`);
    await conn.end();
  } catch (e) {
    console.error('Seeding error:', e.message);
  }
}

seedBillionaires();
