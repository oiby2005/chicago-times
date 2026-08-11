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
    slug: "dylan-candice-odulio",
    name: "Dylan Candice Odulio",
    role: "WRITER",
    bio: "Content writer and aspiring journalist with 2 years of news-writing experience, skilled in research, article writing, and current affairs coverage.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
    linkedinUrl: "https://www.linkedin.com/in/candice-odulio-1a4b68411/",
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

export function getAuthorBySlug(slug: string): Author {
  return authorsData[slug] || authorsList[0];
}

export function getAuthorForArticle(articleSlugOrId: string): Author {
  let hash = 0;
  for (let i = 0; i < articleSlugOrId.length; i++) {
    hash = (hash << 5) - hash + articleSlugOrId.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % authorsList.length;
  return authorsList[index];
}
