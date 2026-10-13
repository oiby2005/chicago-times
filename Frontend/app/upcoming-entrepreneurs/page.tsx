import React from "react";
import EntrepreneursClient from "../upcoming-top-20/EntrepreneursClient";
import { getLinkPreviewMetadata } from "@/lib/linkPreview";

export const metadata = getLinkPreviewMetadata({
  type: "static_page",
  title: "Upcoming Top 20 Entrepreneurs",
  description: "The definitive tracking of the world's top upcoming entrepreneurs, venture valuations, and corporate leadership on Times Chicago.",
  urlPath: "/upcoming-entrepreneurs",
});

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function UpcomingEntrepreneursPage() {
  return <EntrepreneursClient />;
}
