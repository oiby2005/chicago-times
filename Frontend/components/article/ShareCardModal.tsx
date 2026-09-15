"use client";

import React, { useState, useEffect, useRef } from "react";

interface ShareCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url?: string;
}

export const ShareCardModal: React.FC<ShareCardModalProps> = ({
  isOpen,
  onClose,
  title,
  url,
}) => {
  const [copied, setCopied] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);

  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const uStr = sessionStorage.getItem("wsj_user") || localStorage.getItem("wsj_user");
        if (uStr) {
          const parsed = JSON.parse(uStr);
          setUserRole(parsed?.role ? String(parsed.role).toLowerCase() : null);
        } else {
          setUserRole(null);
        }
      } catch (e) {
        setUserRole(null);
      }
    }
  }, [isOpen]);

  const isWriterOrAdmin = userRole === "writer" || userRole === "admin";

  if (!isOpen || isWriterOrAdmin) return null;

  const handleWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareUrl)}`, "_blank");
    onClose();
  };

  const handleFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank");
    onClose();
  };

  const handleTwitter = () => {
    const text = `${title}`;
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`, "_blank");
    onClose();
  };

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        onClose();
      }, 1500);
    }
  };

  return (
    <div
      ref={modalRef}
      className="absolute right-0 top-full mt-2 w-56 bg-white border border-[#e2e8f0] rounded-xl shadow-xl z-50 p-2.5 font-sans animate-fadeIn text-left"
    >
      <div className="space-y-1">
        {/* WHATSAPP */}
        <button
          type="button"
          onClick={handleWhatsApp}
          className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors group cursor-pointer text-left"
        >
          <svg className="w-5 h-5 text-[#25D366] fill-current shrink-0" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-1.002 3.66 3.745-.983zm10.706-6.843c-.257-.128-1.522-.751-1.758-.837-.235-.085-.407-.128-.578.128-.172.257-.665.837-.815 1.008-.15.171-.3.193-.557.064-.257-.128-1.085-.4-2.067-1.276-.763-.681-1.278-1.521-1.428-1.778-.15-.257-.016-.396.112-.524.116-.115.257-.3.386-.45.128-.15.171-.257.257-.428.085-.171.043-.321-.021-.45-.064-.128-.578-1.393-.792-1.907-.208-.5-.42-.432-.578-.44-.15-.008-.321-.01-.492-.01-.171 0-.45.064-.686.321-.235.257-.9.88-.9 2.144 0 1.264.921 2.484 1.05 2.656.128.171 1.813 2.768 4.392 3.882.613.264 1.091.422 1.464.54.616.196 1.176.168 1.619.102.494-.073 1.522-.622 1.737-1.223.214-.6.214-1.114.15-1.223-.064-.108-.235-.172-.492-.301z"/>
          </svg>
          <span className="text-[12px] font-extrabold text-[#1e293b] tracking-wider uppercase">
            WHATSAPP
          </span>
        </button>

        {/* FACEBOOK */}
        <button
          type="button"
          onClick={handleFacebook}
          className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors group cursor-pointer text-left"
        >
          <svg className="w-5 h-5 text-[#1877F2] fill-current shrink-0" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          <span className="text-[12px] font-extrabold text-[#1e293b] tracking-wider uppercase">
            FACEBOOK
          </span>
        </button>

        {/* TWITTER / X */}
        <button
          type="button"
          onClick={handleTwitter}
          className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors group cursor-pointer text-left"
        >
          <svg className="w-4 h-4 text-[#000000] fill-current shrink-0 ml-0.5" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          <span className="text-[12px] font-extrabold text-[#1e293b] tracking-wider uppercase">
            TWITTER / X
          </span>
        </button>
      </div>

      <hr className="my-2 border-t border-gray-100" />

      {/* COPY LINK */}
      <button
        type="button"
        onClick={handleCopyLink}
        className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors group cursor-pointer text-left"
      >
        <svg className="w-5 h-5 text-[#64748b] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
        <span className="text-[12px] font-extrabold text-[#1e293b] tracking-wider uppercase">
          {copied ? "COPIED!" : "COPY LINK"}
        </span>
      </button>
    </div>
  );
};

export default ShareCardModal;
