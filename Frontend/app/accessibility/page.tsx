import React from "react";
import AccessibilityClient from "./AccessibilityClient";
import { getLinkPreviewMetadata } from "@/lib/linkPreview";

export const metadata = getLinkPreviewMetadata({
  type: "static_page",
  title: "Accessibility Statement",
  description: "Read the Times Chicago Accessibility Statement.",
  urlPath: "/accessibility",
});

export default function AccessibilityPage() {
  return <AccessibilityClient />;
}
