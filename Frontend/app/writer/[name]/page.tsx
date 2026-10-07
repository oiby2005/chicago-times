"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/navigation/Header";
import StickyHeaderBar from "@/components/navigation/StickyHeaderBar";
import NewHomeBody from "@/components/home/NewHomeBody";
import StickySubscribeBar from "@/components/ui/StickySubscribeBar";
import Footer from "@/components/layout/Footer";
import { slugifyAuthorName } from "@/data/authors";

export default function WriterRolePage() {
  const routeParams = useParams();
  const rawName = routeParams?.name;
  const currentSlug = typeof rawName === "string" ? rawName : (Array.isArray(rawName) ? rawName[0] : "writer");

  useEffect(() => {
    const syncUrlWithName = () => {
      if (typeof window === "undefined") return;
      try {
        const storedUser = sessionStorage.getItem("wsj_user") || localStorage.getItem("wsj_user");
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          if (parsed && (parsed.role || "").toLowerCase() === "writer") {
            const writerName = parsed.full_name || parsed.name || (parsed.email ? parsed.email.split("@")[0] : "writer");
            const newSlug = slugifyAuthorName(writerName);
            if (newSlug && newSlug.toLowerCase() !== currentSlug.toLowerCase()) {
              window.history.replaceState(null, "", `/writer/${newSlug}`);
            }
          }
        }
      } catch (e) {}
    };

    syncUrlWithName();
    window.addEventListener("wsj_user_updated", syncUrlWithName);
    return () => window.removeEventListener("wsj_user_updated", syncUrlWithName);
  }, [currentSlug]);

  return (
    <main className="min-h-screen bg-white flex flex-col justify-between">
      <div>
        <Header />
        <StickyHeaderBar />
        <NewHomeBody />
        <StickySubscribeBar />
      </div>
      <Footer />
    </main>
  );
}
