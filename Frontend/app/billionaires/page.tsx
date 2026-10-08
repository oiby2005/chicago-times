import React from "react";
import BillionairesClient from "../top-20-billionaires/BillionairesClient";
import { getLinkPreviewMetadata } from "@/lib/linkPreview";

export const metadata = getLinkPreviewMetadata({
  type: "static_page",
  title: "Top 20 Billionaires",
  description: "The definitive tracking of the world's wealthiest individuals, net worth valuations, corporate holdings, and economic influence on Times Chicago.",
  urlPath: "/billionaires",
});

export default function BillionairesPage() {
  return <BillionairesClient />;
}
