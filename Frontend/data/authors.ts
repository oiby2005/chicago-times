export interface Author {
  slug: string;
  name: string;
  email?: string;
  role: string;
  bio: string;
  image: string;
  linkedinUrl?: string;
  twitterUrl?: string;
}

export const defaultWritersMap: Record<string, Author> = {
  writer: {
    slug: "writer",
    name: "Writer User",
    email: "writer@gmail.com",
    role: "WRITER",
    bio: "Journalist & Columnist covering business, economic policy, and global markets.",
    image: "",
    linkedinUrl: "https://www.linkedin.com/in/your-profile",
  },
  writer1: {
    slug: "writer1",
    name: "writer1",
    email: "writer1@gmail.com",
    role: "WRITER",
    bio: "Journalist & Writer covering technology, innovation, and global developments.",
    image: "",
    linkedinUrl: "https://www.linkedin.com/in/your-profile",
  },
};

export const authorsList: Author[] = [
  defaultWritersMap.writer,
  defaultWritersMap.writer1,
  {
    slug: "nivedita-chakrapani",
    name: "Nivedita Chakrapani",
    email: "nivedita@wsj.com",
    role: "WRITER",
    bio: "Niveditaa Chakrapani is a Senior Journalist and media presenter specializing in politics, business, fashion, and cryptocurrency. She is recognized for...",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?fm=webp&fit=crop&w=300&q=80",
    linkedinUrl: "https://www.linkedin.com/in/niveditachakrapani",
  },
  {
    slug: "nivedita-bhattacharjee",
    name: "Nivedita Bhattacharjee",
    email: "nivedita.b@wsj.com",
    role: "STAFF WRITER",
    bio: "Covers technology news, artificial intelligence, and major software platforms.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?fm=webp&fit=crop&w=300&q=80",
    linkedinUrl: "https://www.linkedin.com/in/niveditabhattacharjee",
  },
  {
    slug: "ethan-smith",
    name: "Ethan Smith",
    email: "ethan@wsj.com",
    role: "SENIOR EDITOR",
    bio: "Senior editor focusing on finance, Wall Street markets, and federal interest rates.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?fm=webp&fit=crop&w=300&q=80",
    linkedinUrl: "https://www.linkedin.com/in/ethansmith",
  },
  {
    slug: "samuel-rubenfeld",
    name: "Samuel Rubenfeld",
    email: "samuel@wsj.com",
    role: "LEGAL CORRESPONDENT",
    bio: "Specializes in corporate law, federal court litigation, and regulatory compliance.",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?fm=webp&fit=crop&w=300&q=80",
    linkedinUrl: "https://www.linkedin.com/in/samuelrubenfeld",
  },
];

export const authorsData: Record<string, Author> = authorsList.reduce(
  (acc, author) => {
    acc[author.slug] = author;
    return acc;
  },
  {} as Record<string, Author>
);

export function extractSingleAuthorName(rawName: string): string {
  if (!rawName) return "Writer User";
  let clean = rawName.trim().replace(/^by\s+/i, "");
  const parts = clean.split(/\s+(?:and|&)\s+|,/i);
  return parts[0].trim();
}

export function slugifyAuthorName(name: string): string {
  if (!name) return "writer";
  const clean = extractSingleAuthorName(name);
  return clean.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "writer";
}

export function getAuthorSlugForUser(user: any): string {
  if (!user) return "/author/writer";
  const email = (user.email || "").toLowerCase().trim();

  if (typeof window !== "undefined") {
    try {
      const profilesMap = JSON.parse(localStorage.getItem("wsj_users_by_email") || "{}");
      if (email && profilesMap[email]) {
        const saved = profilesMap[email];
        const savedName = saved.full_name || saved.name;
        if (savedName) return `/author/${slugifyAuthorName(savedName)}`;
      }
    } catch (e) {}
  }

  const name = user.full_name || user.name || (email ? email.split("@")[0] : "writer");
  return `/author/${slugifyAuthorName(name)}`;
}

export function getUserDashboardUrl(user: any): string {
  if (!user) return "/signin";
  const email = (user.email || "").toLowerCase().trim();
  let name = user.full_name || user.name || (email ? email.split("@")[0] : "user");

  if (typeof window !== "undefined") {
    try {
      const profilesMap = JSON.parse(localStorage.getItem("wsj_users_by_email") || "{}");
      if (email && profilesMap[email]) {
        const saved = profilesMap[email];
        if (saved.full_name || saved.name) name = saved.full_name || saved.name;
      }
    } catch (e) {}
  }

  const slug = slugifyAuthorName(name);
  const role = (user.role || "").toUpperCase();
  if (role === "ADMIN") return `/admin-dashboard/${slug}`;
  if (role === "READER") return `/reader-dashboard/${slug}`;
  return `/writer-dashboard/${slug}`;
}

export function getUserRoleUrl(user: any): string {
  if (!user) return "/";
  const email = (user.email || "").toLowerCase().trim();
  let name = user.full_name || user.name || (email ? email.split("@")[0] : "user");

  if (typeof window !== "undefined") {
    try {
      const profilesMap = JSON.parse(localStorage.getItem("wsj_users_by_email") || "{}");
      if (email && profilesMap[email]) {
        const saved = profilesMap[email];
        if (saved.full_name || saved.name) name = saved.full_name || saved.name;
      }
    } catch (e) {}
  }

  const slug = slugifyAuthorName(name);
  const role = (user.role || "").toLowerCase();
  if (role === "admin") return `/admin/${slug}`;
  if (role === "reader") return `/reader/${slug}`;
  return `/writer/${slug}`;
}

export function getAuthorBySlug(slug: string): Author {
  if (!slug) slug = "writer";

  let cleanSlug = slug.toLowerCase().trim();
  if (cleanSlug.includes("-and-")) {
    cleanSlug = cleanSlug.split("-and-")[0].trim();
  }

  // Server-side check: read Backend/data/users.json
  if (typeof window === "undefined") {
    try {
      const fs = require("fs");
      const path = require("path");
      const candidatePaths = [
        path.resolve(process.cwd(), "../Backend/data/users.json"),
        path.resolve(process.cwd(), "Backend/data/users.json"),
        path.resolve(process.cwd(), "../../Backend/data/users.json"),
      ];
      for (const p of candidatePaths) {
        if (fs.existsSync(p)) {
          const raw = fs.readFileSync(p, "utf-8");
          const usersMap = JSON.parse(raw);
          for (const email of Object.keys(usersMap)) {
            const u = usersMap[email];
            if (!u) continue;
            const uName = extractSingleAuthorName(u.full_name || u.name || "");
            const uSlug = slugifyAuthorName(uName);
            const prefix = email.split("@")[0].toLowerCase();
            if (
              cleanSlug === uSlug ||
              cleanSlug === prefix ||
              cleanSlug === uName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") ||
              (cleanSlug === "writer1" && email === "writer1@gmail.com") ||
              (cleanSlug === "writer" && email === "writer@gmail.com")
            ) {
              return {
                slug: cleanSlug,
                name: uName || (email === "writer1@gmail.com" ? "Mayon" : "Writer User"),
                email: email,
                role: (u.role || "WRITER").toUpperCase(),
                bio: u.bio !== undefined && u.bio !== "" ? u.bio : "Journalist & Writer covering technology, innovation, and global developments.",
                image: u.avatar_url || u.image || "",
                linkedinUrl: u.linkedin || u.linkedinUrl || "https://www.linkedin.com/in/your-profile",
              };
            }
          }
        }
      }
    } catch (e) {}
  }

  if (typeof window !== "undefined") {
    try {
      const profilesMap = JSON.parse(localStorage.getItem("wsj_users_by_email") || "{}");
      const slugMap = JSON.parse(localStorage.getItem("wsj_slug_to_email") || "{}");

      // A. Direct slug-to-email mapping check
      let targetEmail = slugMap[cleanSlug];

      // B. Fallback checks for registered accounts
      if (!targetEmail) {
        if (cleanSlug === "writer1") {
          targetEmail = "writer1@gmail.com";
        } else if (cleanSlug === "writer") {
          targetEmail = "writer@gmail.com";
        } else {
          for (const email of Object.keys(profilesMap)) {
            const u = profilesMap[email];
            const uName = extractSingleAuthorName(u.full_name || u.name || "");
            const uSlug = slugifyAuthorName(uName);
            const prefix = email.split("@")[0].toLowerCase();
            if (cleanSlug === uSlug || cleanSlug === prefix) {
              targetEmail = email;
              break;
            }
          }
        }
      }

      // C. If targetEmail is resolved, load profile for that exact targetEmail
      if (targetEmail) {
        const u = profilesMap[targetEmail] || {};
        const baseTemplate = targetEmail === "writer1@gmail.com" ? defaultWritersMap.writer1 : defaultWritersMap.writer;
        const uName = extractSingleAuthorName(u.full_name || u.name || (targetEmail === "writer1@gmail.com" ? "Mayon" : baseTemplate.name));

        return {
          slug: cleanSlug,
          name: uName,
          email: targetEmail,
          role: (u.role || baseTemplate.role || "WRITER").toUpperCase(),
          bio: u.bio !== undefined ? u.bio : baseTemplate.bio,
          image: u.avatar_url || u.image || "",
          linkedinUrl: u.linkedin || u.linkedinUrl || baseTemplate.linkedinUrl,
        };
      }
    } catch (e) {}
  }

  // Fallbacks for default template writers
  if (cleanSlug === "writer1") {
    return {
      ...defaultWritersMap.writer1,
      name: "Mayon",
      image: "https://f005.backblazeb2.com/file/timeschicago/avatars/avatar_writer1_gmail_com_1789032192513.webp",
    };
  }
  if (cleanSlug === "writer") return defaultWritersMap.writer;
  if (authorsData[cleanSlug]) return authorsData[cleanSlug];

  const rawFormatted = cleanSlug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const singleName = extractSingleAuthorName(rawFormatted);
  const singleSlug = slugifyAuthorName(singleName);

  return {
    slug: singleSlug,
    name: singleName,
    role: "WRITER",
    bio: `Contributor and writer covering news, analysis, and current affairs.`,
    image: "",
    linkedinUrl: "https://www.linkedin.com/in/your-profile",
  };
}

export function getAuthorForArticle(articleSlugOrId: string, authorName?: string, authorEmail?: string): Author {
  const email = (authorEmail || "").toLowerCase().trim();
  if (email === "writer1@gmail.com") return getAuthorBySlug("writer1");
  if (email === "writer@gmail.com") return getAuthorBySlug("writer");

  if (!authorName) return defaultWritersMap.writer;

  const cleanAuthor = extractSingleAuthorName(authorName);
  const authorLower = cleanAuthor.toLowerCase().trim();
  const targetSlug = slugifyAuthorName(cleanAuthor);

  if (authorLower === "writer1" || authorLower.includes("writer1")) {
    return getAuthorBySlug("writer1");
  }
  if (authorLower === "writer" || authorLower === "writer user" || authorLower.includes("writer user")) {
    return getAuthorBySlug("writer");
  }

  return getAuthorBySlug(targetSlug);
}
