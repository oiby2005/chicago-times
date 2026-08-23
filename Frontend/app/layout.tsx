import type { Metadata } from "next";
import { Playfair_Display, Source_Serif_4, Inter } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Times Chicago - Breaking News, Business, Financial & Economic News",
  description: "Latest news, analysis and comment from Times Chicago.",
  icons: {
    icon: "/images/design-reference/Fav Icon.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${sourceSerif.variable} ${inter.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-white font-sans text-[#111111] antialiased flex flex-col" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
