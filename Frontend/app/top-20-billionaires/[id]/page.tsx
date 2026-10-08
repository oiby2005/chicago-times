import React from "react";
import BillionaireProfileClient from "../../billionaires/[id]/BillionaireProfileClient";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return {
    title: `Billionaire Profile #${resolvedParams.id} | Times Chicago`,
    description: "Detailed financial profile, net worth valuation, corporate holdings, and economic leadership tracking on Times Chicago.",
  };
}

export default async function Top20BillionaireProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <BillionaireProfileClient id={resolvedParams.id} />;
}
