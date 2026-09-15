import React from "react";
import ContactUsClient from "./ContactUsClient";
import { getLinkPreviewMetadata } from "@/lib/linkPreview";

export const metadata = getLinkPreviewMetadata({
  type: "static_page",
  title: "Contact Us",
  description: "Get in touch with Times Chicago headquarters or submit an inquiry to our reporting team.",
  urlPath: "/contact-us",
});

export default function ContactUsPage() {
  return <ContactUsClient />;
}
