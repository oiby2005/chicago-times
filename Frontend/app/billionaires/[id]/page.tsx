import React from "react";
import BillionaireProfileClient from "./BillionaireProfileClient";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return {
    title: `Billionaire Profile #${resolvedParams.id} | Times Chicago`,
    description: "Detailed financial profile, net worth valuation, corporate holdings, and economic leadership tracking on Times Chicago.",
  };
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function BillionaireProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <BillionaireProfileClient id={resolvedParams.id} />;
}
