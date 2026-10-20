import React from "react";
import CareerClient from "./CareerClient";
import { getLinkPreviewMetadata } from "@/lib/linkPreview";

export const metadata = getLinkPreviewMetadata({
  type: "static_page",
  title: "Careers",
  description: "Join the Special Writers team at Times Chicago. Explore opportunities for Article Writers and Contributors.",
  urlPath: "/career",
});

export default function CareerPage() {
  return <CareerClient />;
}
