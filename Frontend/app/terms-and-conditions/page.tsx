import React from "react";
import TermsClient from "./TermsClient";
import { getLinkPreviewMetadata } from "@/lib/linkPreview";

export const metadata = getLinkPreviewMetadata({
  type: "static_page",
  title: "Terms and Conditions",
  description: "Read the official Terms and Conditions governing access to and use of Times Chicago.",
  urlPath: "/terms-and-conditions",
});

export default function TermsAndConditionsPage() {
  return <TermsClient />;
}
