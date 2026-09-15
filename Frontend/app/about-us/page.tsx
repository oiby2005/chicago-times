import React from "react";
import AboutUsClient from "./AboutUsClient";
import { getLinkPreviewMetadata } from "@/lib/linkPreview";

export const metadata = getLinkPreviewMetadata({
  type: "static_page",
  title: "About Us",
  description: "Learn about Times Chicago - an independent digital news platform dedicated to delivering accurate, timely, and impactful journalism.",
  urlPath: "/about-us",
});

export default function AboutUsPage() {
  return <AboutUsClient />;
}
