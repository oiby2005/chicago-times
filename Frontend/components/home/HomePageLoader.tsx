"use client";

import React, { useState, useEffect } from "react";
import WhiteSkeletonPageLoader from "@/components/ui/skeletons/WhiteSkeletonPageLoader";

export default function HomePageLoader({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <>
      {loading && <WhiteSkeletonPageLoader />}
      <div className={loading ? "opacity-0 transition-opacity duration-300" : "opacity-100 transition-opacity duration-300"}>
        {children}
      </div>
    </>
  );
}
