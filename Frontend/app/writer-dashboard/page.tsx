"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/navigation/Header";
import StickyHeaderBar from "@/components/navigation/StickyHeaderBar";
import NewHomeBody from "@/components/home/NewHomeBody";
import StickySubscribeBar from "@/components/ui/StickySubscribeBar";
import Footer from "@/components/layout/Footer";

interface UserProfile {
  id: number;
  full_name: string;
  email: string;
  role: string;
}

export default function WriterDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("wsj_user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed.role !== "writer") {
          router.push(`/${parsed.role}-dashboard`);
          return;
        }
        setUser(parsed);
      } catch (err) {
        console.error("Error parsing user profile:", err);
      }
    } else {
      router.push("/signin");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("wsj_token");
    localStorage.removeItem("wsj_user");
    router.push("/signin");
  };

  return (
    <main className="min-h-screen bg-white flex flex-col justify-between">
      <div>
        {/* Top Role Dashboard Banner */}
        <div className="w-full bg-[#111111] text-white py-2.5 px-6 flex justify-between items-center text-xs border-b border-gray-800 shadow-sm">
          <div className="flex items-center space-x-3">
            <button className="bg-[#00558c] text-white text-[11px] font-bold uppercase tracking-wider px-3.5 py-1 rounded shadow-2xs cursor-default">
              Writer
            </button>
            <span className="font-semibold text-gray-200">
              Writer Dashboard {user ? `(${user.full_name} - ${user.email})` : ""}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="text-gray-300 hover:text-white underline font-medium cursor-pointer"
          >
            Sign Out
          </button>
        </div>

        <Header />
        <StickyHeaderBar />
        <NewHomeBody />
        <StickySubscribeBar />
      </div>
      <Footer />
    </main>
  );
}
