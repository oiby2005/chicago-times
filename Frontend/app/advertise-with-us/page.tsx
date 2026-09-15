import React from "react";
import AdvertiseClient from "./AdvertiseClient";
import { getLinkPreviewMetadata } from "@/lib/linkPreview";

export const metadata = getLinkPreviewMetadata({
  type: "static_page",
  title: "Advertise with Us",
  description: "Reach an influential global audience of corporate executives, investors, policy makers, and thought leaders.",
  urlPath: "/advertise-with-us",
});

export default function AdvertiseWithUsPage() {
  return <AdvertiseClient />;
}
