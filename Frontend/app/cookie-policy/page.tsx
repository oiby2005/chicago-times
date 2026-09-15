import React from "react";
import CookieClient from "./CookieClient";
import { getLinkPreviewMetadata } from "@/lib/linkPreview";

export const metadata = getLinkPreviewMetadata({
  type: "static_page",
  title: "Cookie Policy",
  description: "Read the Cookie Policy and tracking technology management for Times Chicago.",
  urlPath: "/cookie-policy",
});

export default function CookiePolicyPage() {
  return <CookieClient />;
}
