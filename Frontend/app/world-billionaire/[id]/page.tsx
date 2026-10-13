import React from "react";
import BillionaireProfileClient from "../../billionaires/[id]/BillionaireProfileClient";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const decoded = decodeURIComponent(resolvedParams.id).replace(/-/g, " ");
  const isNumber = /^\d+$/.test(decoded.trim());
  const formattedTitle = isNumber
    ? `Billionaire Profile #${decoded.trim()}`
    : decoded
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

  return {
    title: `${formattedTitle} | World Billionaires | Times Chicago`,
    description: "Detailed financial profile, net worth valuation, corporate holdings, and economic leadership tracking on Times Chicago.",
  };
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function WorldBillionaireProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <BillionaireProfileClient id={resolvedParams.id} />;
}
