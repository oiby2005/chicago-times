import React from "react";
import LegalPoliciesClient from "./LegalPoliciesClient";
import { getLinkPreviewMetadata } from "@/lib/linkPreview";

export const metadata = getLinkPreviewMetadata({
  type: "static_page",
  title: "Legal & Info | Times Chicago",
  description: "Read the official legal policies, privacy notice, cookie policy, copyright rules, and compliance standards for Times Chicago.",
  urlPath: "/legal-policies",
});

export default function LegalPoliciesPage() {
  return <LegalPoliciesClient />;
}
