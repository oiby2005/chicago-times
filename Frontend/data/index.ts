export interface Article {
  id: string;
  slug: string;
  category: string;
  headline: string;
  subtitle?: string;
  author: string;
  publishedDate: string;
  heroImage?: string;
  content?: string[];
  summary?: string;
}

export const sampleArticles: Article[] = [];
