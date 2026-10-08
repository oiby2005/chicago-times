import React from "react";
import BillionairesClient from "./BillionairesClient";
import { getLinkPreviewMetadata } from "@/lib/linkPreview";

export const metadata = getLinkPreviewMetadata({
  type: "static_page",
  title: "Top 20 Billionaires",
  description: "The definitive tracking of the world's wealthiest individuals, net worth valuations, corporate holdings, and economic influence on Times Chicago.",
  urlPath: "/top-20-billionaires",
});

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Top20BillionairesPage() {
  return <BillionairesClient />;
}
