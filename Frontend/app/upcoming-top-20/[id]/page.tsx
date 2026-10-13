import React from "react";
import EntrepreneurProfileClient from "./EntrepreneurProfileClient";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return {
    title: `Entrepreneur Profile #${resolvedParams.id} | Times Chicago`,
    description: "Detailed entrepreneur profile, corporate holdings, and economic leadership tracking on Times Chicago.",
  };
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function UpcomingTop20ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <EntrepreneurProfileClient id={resolvedParams.id} />;
}
