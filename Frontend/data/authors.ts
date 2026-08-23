export interface Author {
  slug: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  linkedinUrl: string;
}

export const authorsList: Author[] = [
  {
    slug: "writer",
    name: "Writer User",
    role: "WRITER",
    bio: "Journalist & Columnist",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
    linkedinUrl: "https://www.linkedin.com/in/your-profile",
  },
  {
    slug: "nivedita-chakrapani",
    name: "Nivedita Chakrapani",
    role: "WRITER",
    bio: "Experienced journalist and contributor covering global affairs, politics, and business analysis.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80",
    linkedinUrl: "https://www.linkedin.com/in/niveditaa-c-870b9426b/",
  },
  {
    slug: "ethan-carter",
    name: "Ethan Carter",
    role: "WRITER",
    bio: "Political columnist and senior news reporter writing on U.S. governance and international relations.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    linkedinUrl: "https://www.linkedin.com/in/ethan-carter-a0013341a/",
  },
  {
    slug: "samuel-mauricio-patino-fuentes",
    name: "Samuel Mauricio Patiño Fuentes",
    role: "WRITER",
    bio: "Financial news analyst and technology correspondent specializing in market trends and global trade.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    linkedinUrl: "https://www.linkedin.com/in/samuel-mauricio-pati%C3%B1o-fuentes-740369373/",
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

export function getAuthorBySlug(slug: string): Author {
  if (!slug) return authorsList[0];

  let cleanSlug = slug.toLowerCase().trim();
  if (cleanSlug.includes("-and-")) {
    cleanSlug = cleanSlug.split("-and-")[0].trim();
  }

  if (authorsData[cleanSlug]) return authorsData[cleanSlug];

  const found = authorsList.find(
    (a) => a.slug.toLowerCase() === cleanSlug || a.name.toLowerCase() === cleanSlug
  );
  if (found) return found;

  const rawFormatted = cleanSlug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const singleName = extractSingleAuthorName(rawFormatted);
  const singleSlug = singleName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  return {
    slug: singleSlug,
    name: singleName,
    role: "WRITER",
    bio: `Contributor and writer covering news, analysis, and current affairs.`,
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
    linkedinUrl: "https://www.linkedin.com",
  };
}

export function getAuthorForArticle(articleSlugOrId: string, authorName?: string): Author {
  if (authorName && authorName.trim()) {
    const singleAuthor = extractSingleAuthorName(authorName);
    const cleanSlug = singleAuthor.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    const found = authorsList.find(
      (a) => a.name.toLowerCase() === singleAuthor.toLowerCase() || a.slug === cleanSlug
    );
    if (found) return found;

    return getAuthorBySlug(cleanSlug);
  }

  const cleanSlug = articleSlugOrId.toLowerCase().trim();
  return authorsData[cleanSlug] || authorsList[0];
}
