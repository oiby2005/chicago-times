import React from "react";
import EditorialClient from "./EditorialClient";
import { getLinkPreviewMetadata } from "@/lib/linkPreview";

export const metadata = getLinkPreviewMetadata({
  type: "static_page",
  title: "Editorial Policy",
  description: "Read the official Editorial Policy for Times Chicago.",
  urlPath: "/editorial-policy",
});

export default function EditorialPolicyPage() {
  return <EditorialClient />;
}
