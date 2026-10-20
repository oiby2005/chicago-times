"use client";

import React, { useRef, useState } from "react";
import { UserProfile } from "./ProfileSettingsModal";

interface PressIdModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
}

export const PressIdModal: React.FC<PressIdModalProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !user) return null;

  const isContributor =
    (user.writer_type || "").toLowerCase() === "contributor";
  const roleTitle = isContributor ? "Contributor" : "Staff Writer";
  const idLabel = isContributor ? "Contributor ID" : "Staff Writer ID";

  const displayName =
    user.full_name ||
    user.name ||
    user.displayName ||
    user.username ||
    "Journalist";

  // ID Number: TCxxxxx (x are numbers)
  const displayPressId =
    user.press_id && user.press_id.trim().length > 0
      ? user.press_id.trim()
      : `TC${String(user.id || 10001).padStart(5, "0")}`;

  // Formatted Issued Date
  const formatIssuedDate = (raw?: string) => {
    if (!raw || !raw.trim()) {
      return "October 20, 2026";
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(raw.trim())) {
      const [year, month, day] = raw.trim().split("-");
      const d = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      }
    }
    return raw.trim();
  };

  const displayIssuedDate = formatIssuedDate(user.issued_date);
  const displayCountry = user.country || "United States";
  const displayEmail = user.email || "";
  const displayPhone = (user as any).phone || (user as any).mobile || "—";
  const avatarSrc = user.avatar_url || (user as any).image || "";

  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPdf = async () => {
    if (!cardRef.current || isDownloading) return;
    setIsDownloading(true);
    try {
      const card = cardRef.current;
      const html2canvasModule = await import("html2canvas");
      const html2canvas = html2canvasModule.default;
      const jspdfModule = await import("jspdf");
      const jsPDF = jspdfModule.default;

      const canvas = await html2canvas(card, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdfWidth = 85.6; // Standard card width in mm
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [pdfWidth, pdfHeight],
      });

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${displayPressId}_TimesChicago_PressID.pdf`);
    } catch (err) {
      console.error("PDF generation fallback:", err);
      if (typeof window !== "undefined") {
        window.print();
      }
    } finally {
      setIsDownloading(false);
    }
  };

  const poppinsFont = {
    fontFamily: '"Poppins", var(--font-poppins), sans-serif',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Modal White Background Container */}
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 relative flex flex-col items-center justify-center border border-slate-200 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
        style={poppinsFont}
      >
        {/* Close Button at top right */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close ID card"
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-black hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Modal Header Title */}
        <div className="text-center mb-5" style={poppinsFont}>
          <h3
            className="text-xl sm:text-2xl font-bold text-black"
            style={poppinsFont}
          >
            {idLabel}
          </h3>
        </div>

        {/* The ID Card centered in the middle */}
        <div
          ref={cardRef}
          id="times-chicago-press-id-card"
          className="w-full max-w-[340px] bg-white rounded-2xl border border-slate-300 shadow-md p-5 sm:p-6 flex flex-col items-center text-center select-none"
          style={poppinsFont}
        >
          {/* Masthead Logo */}
          <div className="w-full max-w-[220px] mb-4">
            <img
              src="/images/design-reference/Times Chicago.svg"
              alt="Times Chicago"
              className="w-full h-8 object-contain mx-auto block"
            />
          </div>

          <div className="w-full h-[1px] bg-slate-200 mb-4" />

          {/* Contributor / Staff Writer Portrait Image (NO tick box) */}
          <div className="my-1">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl p-1 bg-white border border-slate-300 shadow-xs overflow-hidden flex items-center justify-center">
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt={displayName}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <div className="w-full h-full bg-slate-100 flex flex-col items-center justify-center text-slate-400 rounded-xl">
                  <svg
                    className="w-12 h-12 text-slate-300"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Writer Name */}
          <h4
            className="font-bold text-xl sm:text-2xl text-black mt-3 tracking-normal"
            style={poppinsFont}
          >
            {displayName}
          </h4>

          {/* Role Badge */}
          <div className="mt-1 mb-4">
            <span
              className="inline-block bg-black text-white text-xs px-3.5 py-0.5 rounded-full font-medium"
              style={poppinsFont}
            >
              {roleTitle}
            </span>
          </div>

          {/* Information Details List (Light Ash background, Black text, Poppins) */}
          <div
            className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl p-3.5 text-left text-xs space-y-2 text-black"
            style={poppinsFont}
          >
            <div className="flex items-center justify-between border-b border-slate-200/70 pb-1.5">
              <span className="text-slate-600 font-medium" style={poppinsFont}>
                {idLabel}:
              </span>
              <span className="font-bold text-black font-mono tracking-wide" style={poppinsFont}>
                {displayPressId}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-200/70 pb-1.5">
              <span className="text-slate-600 font-medium" style={poppinsFont}>
                Name:
              </span>
              <span className="font-bold text-black" style={poppinsFont}>
                {displayName}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-200/70 pb-1.5">
              <span className="text-slate-600 font-medium" style={poppinsFont}>
                Country:
              </span>
              <span className="font-semibold text-black" style={poppinsFont}>
                {displayCountry}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-200/70 pb-1.5">
              <span className="text-slate-600 font-medium" style={poppinsFont}>
                Email:
              </span>
              <span className="font-semibold text-black break-all" style={poppinsFont}>
                {displayEmail}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-200/70 pb-1.5">
              <span className="text-slate-600 font-medium" style={poppinsFont}>
                Phone Number:
              </span>
              <span className="font-semibold text-black" style={poppinsFont}>
                {displayPhone}
              </span>
            </div>

            <div className="flex items-center justify-between pt-0.5">
              <span className="text-slate-600 font-medium" style={poppinsFont}>
                Issued Date:
              </span>
              <span className="font-semibold text-black" style={poppinsFont}>
                {displayIssuedDate}
              </span>
            </div>
          </div>

          {/* In the end: www.timeschicago.com (Clean text, Poppins, No icon) */}
          <div className="w-full border-t border-slate-200 mt-4 pt-3 text-center">
            <span
              className="text-xs font-semibold text-black tracking-wide"
              style={poppinsFont}
            >
              www.timeschicago.com
            </span>
          </div>
        </div>

        {/* Print / Download PDF / Done Actions */}
        <div className="flex items-center space-x-3 mt-5 w-full max-w-[340px]" style={poppinsFont}>
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            className="flex-1 inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-black hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm disabled:opacity-60"
            style={poppinsFont}
          >
            {isDownloading ? (
              <>
                <svg className="animate-spin w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4 text-white shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                <span>Print ID (PDF)</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer border border-slate-200"
            style={poppinsFont}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PressIdModal;
