import React from "react";
import CopyrightClient from "./CopyrightClient";
import { getLinkPreviewMetadata } from "@/lib/linkPreview";

export const metadata = getLinkPreviewMetadata({
  type: "static_page",
  title: "Copyright Policy & DMCA",
  description: "Read the Times Chicago Copyright Policy and DMCA notice procedures.",
  urlPath: "/copyright-policy",
});

export default function CopyrightPolicyPage() {
  return <CopyrightClient />;
}
