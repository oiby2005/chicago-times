import React from "react";
import CareersClient from "./CareersClient";
import { getLinkPreviewMetadata } from "@/lib/linkPreview";

export const metadata = getLinkPreviewMetadata({
  type: "static_page",
  title: "Careers",
  description: "Join the Special Writers team at Times Chicago. Explore opportunities for Article Writers and Contributors.",
  urlPath: "/careers",
});

export default function CareersPage() {
  return <CareersClient />;
}
