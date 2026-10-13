"use client";

import React, { useState, useEffect } from "react";
import WhiteSkeletonPageLoader from "@/components/ui/skeletons/WhiteSkeletonPageLoader";

export default function HomePageLoader({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
