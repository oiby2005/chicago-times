import React from "react";
import BillionairesClient from "../top-20-billionaires/BillionairesClient";
import { getLinkPreviewMetadata } from "@/lib/linkPreview";

export const metadata = getLinkPreviewMetadata({
  type: "static_page",
  title: "World Billionaires List",
  description: "The definitive tracking of the world's wealthiest individuals, net worth valuations, corporate holdings, and economic influence on Times Chicago.",
  urlPath: "/world-billionaire",
});

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function WorldBillionairePage() {
  return <BillionairesClient />;
}
