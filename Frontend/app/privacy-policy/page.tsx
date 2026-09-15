import React from "react";
import PrivacyClient from "./PrivacyClient";
import { getLinkPreviewMetadata } from "@/lib/linkPreview";

export const metadata = getLinkPreviewMetadata({
  type: "static_page",
  title: "Privacy Policy",
  description: "Read the Privacy Policy and Data Protection guidelines for Times Chicago.",
  urlPath: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return <PrivacyClient />;
}
