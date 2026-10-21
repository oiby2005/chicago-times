export interface Author {
  slug: string;
  name: string;
  email?: string;
  role: string;
  bio: string;
  image: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  id?: string | number;
  avatarUrl?: string;
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

export function slugifyArticleTitle(title: string): string {
  if (!title || !title.trim()) return "untitled-article";
  return (
    title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || "untitled-article"
  );
}

export function getWriterSlugFromUser(user: any): string {
  if (!user) return "writer";
  const email = (user.email || "").toLowerCase().trim();
  let name = user.full_name || user.name || (email ? email.split("@")[0] : "writer");
  if (typeof window !== "undefined") {
    try {
      const profilesMap = JSON.parse(localStorage.getItem("wsj_users_by_email") || "{}");
      if (email && profilesMap[email]) {
        const saved = profilesMap[email];
        if (saved.full_name || saved.name) name = saved.full_name || saved.name;
      }
    } catch (e) {}
  }
  return slugifyAuthorName(name);
}

export function getEditPostUrl(post: any, userOrName?: any): string {
  if (post && post.id) {
    return `/author-workspace/create-post?id=${encodeURIComponent(post.id)}`;
  }
  return `/author-workspace/create-post`;
}

export function getWriterHomepageUrl(user: any): string {
  const slug = getWriterSlugFromUser(user);
  const role = (user?.role || "").toLowerCase();
  if (role === "admin") return `/admin/${slug}`;
  if (role === "reader") return `/reader/${slug}`;
  return `/writer/${slug}`;
}

export function getWriterArticleUrl(post: any, user?: any): string {
  const slug = user ? getWriterSlugFromUser(user) : "writer";
  const titleSlug = slugifyArticleTitle(post?.title || post?.headline || "");
  const role = (user?.role || "").toLowerCase();
  if (role === "admin") return `/admin-dashboard/${slug}/article/${titleSlug}`;
  if (role === "reader") return `/reader/${slug}/article/${titleSlug}`;
  return `/writer/${slug}/article/${titleSlug}`;
}

export function getWriterCategoryUrl(categoryNameOrSlug: string, user?: any): string {
  const slug = user ? getWriterSlugFromUser(user) : "writer";
  const catSlug = categoryNameOrSlug.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const role = (user?.role || "").toLowerCase();
  if (role === "admin") return `/admin-dashboard/${slug}/${catSlug}`;
  if (role === "reader") return `/reader/${slug}/${catSlug}`;
  return `/writer/${slug}/${catSlug}`;
}

export function getAuthorSlugForUser(user: any, targetAuthorName?: string): string {
  const slug = user ? getWriterSlugFromUser(user) : "writer";
  const authorSlug = targetAuthorName ? slugifyAuthorName(targetAuthorName) : slug;
  const role = (user?.role || "").toLowerCase();
  if (role === "admin") return `/admin-dashboard/${slug}/author/${authorSlug}`;
  if (role === "reader") return `/reader/${slug}/author/${authorSlug}`;
  return `/writer/${slug}/author/${authorSlug}`;
}

export function getUserDashboardUrl(user: any): string {
  if (!user) return "/signin";
  const slug = getWriterSlugFromUser(user);
  const role = (user.role || "").toUpperCase();
  if (role === "ADMIN") return `/admin-dashboard/${slug}`;
  if (role === "READER") return `/reader/${slug}/saved`;
  return `/writer-dashboard/${slug}`;
}

export function getUserRoleUrl(user: any): string {
  if (!user) return "/";
  const slug = getWriterSlugFromUser(user);
  const role = (user.role || "").toLowerCase();
  if (role === "admin") return `/admin/${slug}`;
  if (role === "reader") return `/reader/${slug}`;
  return `/writer/${slug}`;
}

export function getAuthorByEmail(rawEmail: string): Author | null {
  if (!rawEmail) return null;
  const cleanEmail = rawEmail.toLowerCase().trim();

  // 1. Check active user session
  if (typeof window !== "undefined") {
    try {
      const storedUser = JSON.parse(sessionStorage.getItem("wsj_user") || "null");
      if (storedUser && (storedUser.email || "").toLowerCase().trim() === cleanEmail) {
        const uName = extractSingleAuthorName(storedUser.full_name || storedUser.name || cleanEmail.split("@")[0]);
        const writerType = (storedUser.writer_type || "").toLowerCase();
        const role = writerType === "contributor"
          ? "CONTRIBUTOR"
          : (writerType === "staff" ? "STAFF WRITER" : ((storedUser.role || "WRITER").toUpperCase() === "WRITER" ? "STAFF WRITER" : (storedUser.role || "WRITER").toUpperCase()));
        return {
          slug: slugifyAuthorName(uName),
          name: uName,
          email: cleanEmail,
          role: role,
          bio: storedUser.bio || (writerType === "contributor" ? "Independent Contributor & Columnist covering news, opinion, and current affairs." : "Journalist & Columnist covering business, economic policy, and global markets."),
          image: storedUser.avatar_url || storedUser.image || "",
          linkedinUrl: storedUser.linkedin || storedUser.linkedinUrl || "https://www.linkedin.com/in/your-profile",
        };
      }
    } catch (e) {}
  }

  // 2. Check localStorage wsj_users_by_email
  if (typeof window !== "undefined") {
    try {
      const profilesMap = JSON.parse(localStorage.getItem("wsj_users_by_email") || "{}");
      if (profilesMap[cleanEmail]) {
        const u = profilesMap[cleanEmail];
        const uName = extractSingleAuthorName(u.full_name || u.name || cleanEmail.split("@")[0]);
        const writerType = (u.writer_type || "").toLowerCase();
        const role = writerType === "contributor"
          ? "CONTRIBUTOR"
          : (writerType === "staff" ? "STAFF WRITER" : ((u.role || "WRITER").toUpperCase() === "WRITER" ? "STAFF WRITER" : (u.role || "WRITER").toUpperCase()));
        return {
          slug: slugifyAuthorName(uName),
          name: uName,
          email: cleanEmail,
          role: role,
          bio: u.bio !== undefined && u.bio !== "" ? u.bio : (writerType === "contributor" ? "Independent Contributor & Columnist covering news, opinion, and current affairs." : "Journalist & Writer covering technology, innovation, and global developments."),
          image: u.avatar_url || u.image || "",
          linkedinUrl: u.linkedin || u.linkedinUrl || "https://www.linkedin.com/in/your-profile",
        };
      }
    } catch (e) {}
  }

  // 3. Fallbacks for default hardcoded writers
  if (cleanEmail === "writer1@gmail.com") {
    return {
      ...defaultWritersMap.writer1,
      name: "Mayon",
      role: "STAFF WRITER",
      email: "writer1@gmail.com",
      image: "https://f005.backblazeb2.com/file/timeschicago/avatars/avatar_writer1_gmail_com_1789032192513.webp",
    };
  }
  if (cleanEmail === "writer@gmail.com") {
    return {
      ...defaultWritersMap.writer,
      name: "Writer User",
      role: "STAFF WRITER",
      email: "writer@gmail.com",
    };
  }

  // 4. Static authorsList
  const found = authorsList.find((a) => (a.email || "").toLowerCase().trim() === cleanEmail);
  if (found) return found;

  return null;
}

export function getAuthorBySlug(slug: string, explicitEmail?: string): Author {
  if (explicitEmail) {
    const fromEmail = getAuthorByEmail(explicitEmail);
    if (fromEmail) return fromEmail;
  }

  if (!slug) slug = "writer";

  let cleanSlug = slug.toLowerCase().trim();
  if (cleanSlug.includes("-and-")) {
    cleanSlug = cleanSlug.split("-and-")[0].trim();
  }

  // If cleanSlug itself is an email
  if (cleanSlug.includes("@")) {
    const fromEmail = getAuthorByEmail(cleanSlug);
    if (fromEmail) return fromEmail;
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
          // First check exact email prefix (e.g. "oshidiishmitha")
          for (const email of Object.keys(profilesMap)) {
            const prefix = email.split("@")[0].toLowerCase();
            if (cleanSlug === prefix || cleanSlug === email.toLowerCase()) {
              targetEmail = email;
              break;
            }
          }
          // If still not found, check slug match
          if (!targetEmail) {
            for (const email of Object.keys(profilesMap)) {
              const u = profilesMap[email];
              const uName = extractSingleAuthorName(u.full_name || u.name || "");
              const uSlug = slugifyAuthorName(uName);
              if (cleanSlug === uSlug) {
                targetEmail = email;
                break;
              }
            }
          }
        }
      }

      // C. If targetEmail is resolved, load profile for that exact targetEmail
      if (targetEmail) {
        const fromEmail = getAuthorByEmail(targetEmail);
        if (fromEmail) {
          return {
            ...fromEmail,
            slug: cleanSlug,
          };
        }
      }
    } catch (e) {}
  }

  // Fallbacks for default template writers
  if (cleanSlug === "writer1") {
    return {
      ...defaultWritersMap.writer1,
      name: "Mayon",
      role: "STAFF WRITER",
      email: "writer1@gmail.com",
      image: "https://f005.backblazeb2.com/file/timeschicago/avatars/avatar_writer1_gmail_com_1789032192513.webp",
    };
  }
  if (cleanSlug === "writer") {
    if (typeof window !== "undefined") {
      try {
        const storedUser = JSON.parse(sessionStorage.getItem("wsj_user") || "null");
        if (storedUser && (storedUser.full_name || storedUser.name)) {
          const uName = extractSingleAuthorName(storedUser.full_name || storedUser.name);
          return {
            ...defaultWritersMap.writer,
            name: uName,
            role: "STAFF WRITER",
            image: storedUser.avatar_url || storedUser.image || defaultWritersMap.writer.image,
          };
        }
      } catch (e) {}
    }
    return {
      ...defaultWritersMap.writer,
      role: "STAFF WRITER",
    };
  }
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
    role: "CONTRIBUTOR",
    bio: `Contributor and writer covering news, analysis, and current affairs.`,
    image: "",
    linkedinUrl: "https://www.linkedin.com/in/your-profile",
  };
}

export function getAuthorForArticle(articleSlugOrId: string, authorName?: string, authorEmail?: string): Author {
  const email = (authorEmail || "").toLowerCase().trim();

  // STRICT PRIORITY 1: Absolute precedence to authorEmail
  if (email) {
    const authorByEmail = getAuthorByEmail(email);
    if (authorByEmail) {
      if (authorName && (!authorByEmail.name || authorByEmail.name === "Writer User" || authorByEmail.name === email.split("@")[0])) {
        return {
          ...authorByEmail,
          name: extractSingleAuthorName(authorName),
        };
      }
      return authorByEmail;
    }

    // If not yet in cache, create Author based directly on this specific email
    const cleanAuthor = authorName ? extractSingleAuthorName(authorName) : email.split("@")[0];
    return {
      slug: slugifyAuthorName(cleanAuthor),
      name: cleanAuthor,
      email: email,
      role: "CONTRIBUTOR",
      bio: "Independent Contributor & Writer covering news, analysis, and current affairs.",
      image: "",
      linkedinUrl: "https://www.linkedin.com/in/your-profile",
    };
  }

  // Active user session fallback
  if (typeof window !== "undefined") {
    try {
      const storedUser = JSON.parse(sessionStorage.getItem("wsj_user") || "null");
      if (storedUser && (storedUser.full_name || storedUser.name)) {
        const uName = extractSingleAuthorName(storedUser.full_name || storedUser.name);
        const uEmail = (storedUser.email || "").toLowerCase().trim();
        const aName = (authorName || "").toLowerCase().trim();
        if (
          aName === "writer user" ||
          aName === "by writer user" ||
          (uEmail === "writer@gmail.com" && (aName.includes("writer") || !authorName))
        ) {
          const writerType = (storedUser.writer_type || "").toLowerCase();
          const role = writerType === "contributor"
            ? "CONTRIBUTOR"
            : (writerType === "staff" ? "STAFF WRITER" : ((storedUser.role || "WRITER").toUpperCase() === "WRITER" ? "STAFF WRITER" : (storedUser.role || "WRITER").toUpperCase()));
          return {
            slug: slugifyAuthorName(uName),
            name: uName,
            email: uEmail,
            role: role,
            bio: storedUser.bio || defaultWritersMap.writer.bio,
            image: storedUser.avatar_url || storedUser.image || "",
            linkedinUrl: storedUser.linkedin || defaultWritersMap.writer.linkedinUrl,
          };
        }
      }
    } catch (e) {}
  }

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

export async function fetchAuthorBySlug(slugParam: string): Promise<Author> {
  if (!slugParam) return getAuthorBySlug("writer");
  const cleanSlug = slugParam.toLowerCase().trim();

  try {
    const res = await fetch("http://localhost:5000/api/users", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (data?.success && Array.isArray(data.users)) {
        const found = data.users.find((u: any) => {
          const uName = (u.full_name || u.name || "").toLowerCase().trim();
          const uSlug = uName.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
          const uEmailSlug = (u.email || "").split("@")[0].toLowerCase().trim();
          return uSlug === cleanSlug || uEmailSlug === cleanSlug || uName === cleanSlug;
        });

        if (found) {
          const uName = found.full_name || found.name || "Journalist";
          const isContributor = (found.writer_type || "").toLowerCase() === "contributor";
          return {
            slug: cleanSlug,
            name: uName,
            email: found.email,
            role: isContributor ? "CONTRIBUTOR" : "STAFF WRITER",
            bio:
              found.bio ||
              (isContributor
                ? "Independent Contributor & Columnist covering news, opinion, and current affairs."
                : "Journalist & Columnist covering business, economic policy, and global markets."),
            image: found.avatar_url || (found as any).image || "",
            linkedinUrl: found.linkedin || "https://www.linkedin.com/in/your-profile",
          };
        }
      }
    }
  } catch (e) {}

  return getAuthorBySlug(slugParam);
}
