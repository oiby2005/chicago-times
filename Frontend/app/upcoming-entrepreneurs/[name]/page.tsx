import React from "react";
import EntrepreneurProfileClient from "../../upcoming-top-20/[id]/EntrepreneurProfileClient";

export async function generateMetadata({ params }: { params: Promise<{ name: string }> }) {
  const resolvedParams = await params;
  const decoded = decodeURIComponent(resolvedParams.name).replace(/-/g, " ");
  return {
    title: `${decoded} | Upcoming Entrepreneurs | Times Chicago`,
    description: "Detailed entrepreneur profile, corporate holdings, and economic leadership tracking on Times Chicago.",
  };
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function UpcomingEntrepreneurPage({ params }: { params: Promise<{ name: string }> }) {
  const resolvedParams = await params;
  return <EntrepreneurProfileClient id={resolvedParams.name} />;
}
