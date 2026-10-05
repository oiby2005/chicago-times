import React from "react";
import LeadershipClient from "./LeadershipClient";
import { getLinkPreviewMetadata } from "@/lib/linkPreview";

export const metadata = getLinkPreviewMetadata({
  type: "static_page",
  title: "Leadership Team",
  description: "Meet the leadership team behind Times Chicago - experienced professionals dedicated to advancing global education, innovation, and strategic vision.",
  urlPath: "/leadership",
});

export default function LeadershipPage() {
  return <LeadershipClient />;
}
