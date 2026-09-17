import type { Metadata } from "next";
import { Playfair_Display, Source_Serif_4, Inter, Bodoni_Moda, Kumbh_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--font-playfair",
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-sourceserif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-bodoni",
  display: "swap",
});

const kumbh = Kumbh_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-kumbh",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Times Chicago - Breaking News, Business, Financial & Economic News",
  description: "Latest news, analysis and comment from Times Chicago.",
  icons: {
    icon: "/images/design-reference/Fav Icon.jpg",
  },
  openGraph: {
    title: "Breaking News, US News, World News, Politics, Business & Technology | Times Chicago",
    description: "Times Chicago delivers breaking news, US and world news, politics, business, economy, technology, crypto, travel, sports, health, opinion and CEO spotlight.",
    images: [{ url: "/images/design-reference/website-thumbnail.jpg", alt: "Times Chicago" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Breaking News, US News, World News, Politics, Business & Technology | Times Chicago",
    description: "Times Chicago delivers breaking news, US and world news, politics, business, economy, technology, crypto, travel, sports, health, opinion and CEO spotlight.",
    images: ["/images/design-reference/website-thumbnail.jpg"],
  },
};

import WebpGlobalInterceptor from "@/components/ui/WebpGlobalInterceptor";
import GlobalDataSync from "@/components/ui/GlobalDataSync";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${sourceSerif.variable} ${inter.variable} ${bodoni.variable} ${kumbh.variable}`} suppressHydrationWarning>
      <body className="min-h-screen max-w-full overflow-x-hidden bg-white font-sans text-[#111111] antialiased flex flex-col" suppressHydrationWarning>
        <WebpGlobalInterceptor />
        <GlobalDataSync />
        {children}
      </body>
    </html>
  );
}
