"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { convertFileToWebP } from "@/lib/webpConverter";
import { slugifyAuthorName } from "@/data/authors";
import { getAuthHeaders } from "@/lib/authHeader";
import ReaderAccountSkeleton from "@/components/ui/skeletons/ReaderAccountSkeleton";
import ReaderHelpCenter from "@/components/dashboard/ReaderHelpCenter";

const COUNTRY_PHONE_INFO: Record<string, { dialCode: string; digits: number; placeholder: string }> = {
  "United States": { dialCode: "+1", digits: 10, placeholder: "5551234567" },
  "United Kingdom": { dialCode: "+44", digits: 10, placeholder: "7911123456" },
  "Canada": { dialCode: "+1", digits: 10, placeholder: "5551234567" },
  "Australia": { dialCode: "+61", digits: 9, placeholder: "412345678" },
  "Germany": { dialCode: "+49", digits: 11, placeholder: "15123456789" },
  "France": { dialCode: "+33", digits: 9, placeholder: "612345678" },
  "India": { dialCode: "+91", digits: 10, placeholder: "9876543210" },
  "Japan": { dialCode: "+81", digits: 10, placeholder: "9012345678" },
  "China": { dialCode: "+86", digits: 11, placeholder: "13812345678" },
  "Brazil": { dialCode: "+55", digits: 11, placeholder: "11912345678" },
  "Mexico": { dialCode: "+52", digits: 10, placeholder: "5512345678" },
  "Italy": { dialCode: "+39", digits: 10, placeholder: "3123456789" },
  "Spain": { dialCode: "+34", digits: 9, placeholder: "612345678" },
  "Netherlands": { dialCode: "+31", digits: 9, placeholder: "612345678" },
  "Switzerland": { dialCode: "+41", digits: 9, placeholder: "791234567" },
  "Sweden": { dialCode: "+46", digits: 9, placeholder: "701234567" },
  "Singapore": { dialCode: "+65", digits: 8, placeholder: "81234567" },
  "South Korea": { dialCode: "+82", digits: 10, placeholder: "1012345678" },
  "United Arab Emirates": { dialCode: "+971", digits: 9, placeholder: "501234567" },
  "Saudi Arabia": { dialCode: "+966", digits: 9, placeholder: "501234567" },
  "South Africa": { dialCode: "+27", digits: 9, placeholder: "821234567" },
  "New Zealand": { dialCode: "+64", digits: 9, placeholder: "211234567" },
  "Ireland": { dialCode: "+353", digits: 9, placeholder: "851234567" },
  "Norway": { dialCode: "+47", digits: 8, placeholder: "41234567" },
  "Denmark": { dialCode: "+45", digits: 8, placeholder: "20123456" },
  "Finland": { dialCode: "+358", digits: 9, placeholder: "401234567" },
  "Belgium": { dialCode: "+32", digits: 9, placeholder: "470123456" },
  "Austria": { dialCode: "+43", digits: 10, placeholder: "6501234567" },
  "Poland": { dialCode: "+48", digits: 9, placeholder: "501234567" },
  "Portugal": { dialCode: "+351", digits: 9, placeholder: "912345678" },
  "Greece": { dialCode: "+30", digits: 10, placeholder: "6912345678" },
  "Argentina": { dialCode: "+54", digits: 10, placeholder: "1112345678" },
  "Chile": { dialCode: "+56", digits: 9, placeholder: "912345678" },
  "Colombia": { dialCode: "+57", digits: 10, placeholder: "3001234567" },
  "Egypt": { dialCode: "+20", digits: 10, placeholder: "1001234567" },
  "Indonesia": { dialCode: "+62", digits: 11, placeholder: "81234567890" },
  "Israel": { dialCode: "+972", digits: 9, placeholder: "501234567" },
  "Malaysia": { dialCode: "+60", digits: 10, placeholder: "1234567890" },
  "Nigeria": { dialCode: "+234", digits: 10, placeholder: "8021234567" },
  "Pakistan": { dialCode: "+92", digits: 10, placeholder: "3001234567" },
  "Philippines": { dialCode: "+63", digits: 10, placeholder: "9171234567" },
  "Qatar": { dialCode: "+974", digits: 8, placeholder: "33123456" },
  "Sri Lanka": { dialCode: "+94", digits: 9, placeholder: "771234567" },
  "Thailand": { dialCode: "+66", digits: 9, placeholder: "812345678" },
  "Turkey": { dialCode: "+90", digits: 10, placeholder: "5321234567" },
  "Vietnam": { dialCode: "+84", digits: 9, placeholder: "901234567" },
  "Other": { dialCode: "+", digits: 15, placeholder: "1234567890" }
};

const COUNTRY_DIAL_CODES = [
  { code: "+1", label: "+1 (US/Canada)" },
  { code: "+44", label: "+44 (UK)" },
  { code: "+61", label: "+61 (Australia)" },
  { code: "+49", label: "+49 (Germany)" },
  { code: "+33", label: "+33 (France)" },
  { code: "+91", label: "+91 (India)" },
  { code: "+94", label: "+94 (Sri Lanka)" },
  { code: "+81", label: "+81 (Japan)" },
  { code: "+86", label: "+86 (China)" },
  { code: "+55", label: "+55 (Brazil)" },
  { code: "+52", label: "+52 (Mexico)" },
  { code: "+39", label: "+39 (Italy)" },
  { code: "+34", label: "+34 (Spain)" },
  { code: "+31", label: "+31 (Netherlands)" },
  { code: "+41", label: "+41 (Switzerland)" },
  { code: "+46", label: "+46 (Sweden)" },
  { code: "+65", label: "+65 (Singapore)" },
  { code: "+82", label: "+82 (South Korea)" },
  { code: "+971", label: "+971 (UAE)" },
  { code: "+966", label: "+966 (Saudi Arabia)" },
  { code: "+27", label: "+27 (South Africa)" },
  { code: "+64", label: "+64 (New Zealand)" },
  { code: "+353", label: "+353 (Ireland)" },
  { code: "+47", label: "+47 (Norway)" },
  { code: "+45", label: "+45 (Denmark)" },
  { code: "+358", label: "+358 (Finland)" },
  { code: "+32", label: "+32 (Belgium)" },
  { code: "+43", label: "+43 (Austria)" },
  { code: "+48", label: "+48 (Poland)" },
  { code: "+351", label: "+351 (Portugal)" },
  { code: "+30", label: "+30 (Greece)" },
  { code: "+54", label: "+54 (Argentina)" },
  { code: "+56", label: "+56 (Chile)" },
  { code: "+57", label: "+57 (Colombia)" },
  { code: "+20", label: "+20 (Egypt)" },
  { code: "+62", label: "+62 (Indonesia)" },
  { code: "+972", label: "+972 (Israel)" },
  { code: "+60", label: "+60 (Malaysia)" },
  { code: "+234", label: "+234 (Nigeria)" },
  { code: "+92", label: "+92 (Pakistan)" },
  { code: "+63", label: "+63 (Philippines)" },
  { code: "+974", label: "+974 (Qatar)" },
  { code: "+66", label: "+66 (Thailand)" },
  { code: "+90", label: "+90 (Turkey)" },
  { code: "+84", label: "+84 (Vietnam)" },
];

const COUNTRIES = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "India",
  "Sri Lanka",
  "Japan",
  "China",
  "Brazil",
  "Mexico",
  "Italy",
  "Spain",
  "Netherlands",
  "Switzerland",
  "Sweden",
  "Singapore",
  "South Korea",
  "United Arab Emirates",
  "Saudi Arabia",
  "South Africa",
  "New Zealand",
  "Ireland",
  "Norway",
  "Denmark",
  "Finland",
  "Belgium",
  "Austria",
  "Poland",
  "Portugal",
  "Greece",
  "Argentina",
  "Chile",
  "Colombia",
  "Egypt",
  "Indonesia",
  "Israel",
  "Malaysia",
  "Nigeria",
  "Pakistan",
  "Philippines",
  "Qatar",
  "Thailand",
  "Turkey",
  "Vietnam",
  "Other"
];

export default function ReaderSavedPage() {
  const params = useParams();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const rawSlug = typeof params?.name === "string" ? params.name : "john";
  const decodedName = decodeURIComponent(rawSlug).replace(/-/g, " ");

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "account-settings" | "manage-subscriptions" | "saved-articles" | "help-center" | "contact-us"
  >("overview");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Profile Settings form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("READER");
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneCountryCode, setPhoneCountryCode] = useState("+1");
  const [country, setCountry] = useState("United States");
  const [linkedin, setLinkedin] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Subscription states
  const [subscription, setSubscription] = useState<any>(null);
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [contactSubmissions, setContactSubmissions] = useState<any[]>([]);
  const [savedArticles, setSavedArticles] = useState<any[]>([]);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    onConfirm: () => void;
  } | null>(null);

  const formatDateClean = (dateStr?: string) => {
    if (!dateStr) return "Aug 16, 2026";
    let clean = dateStr.replace(/(\s+\d{1,2}:\d{2}.*)|(\s+AT\s+.*)/i, "").trim();
    clean = clean.replace(/([A-Za-z]{3})\./, "$1");
    return clean || "Aug 16, 2026";
  };

  const loadSavedArticles = async (userEmail?: string) => {
    if (typeof window === "undefined") return;

    let savedList: any[] = [];
    let activeEmail = userEmail || currentUser?.email || email || "";

    if (!activeEmail) {
      const userStr = sessionStorage.getItem("wsj_user");
      if (userStr) {
        try {
          const parsed = JSON.parse(userStr);
          if (parsed && parsed.email) activeEmail = parsed.email.toLowerCase().trim();
        } catch (e) {}
      }
    }

    if (!activeEmail) {
      setSavedArticles([]);
      return;
    }

    const cleanActiveEmail = activeEmail.toLowerCase().trim();

    try {
      const res = await fetch(`http://localhost:5000/api/saved-articles?email=${encodeURIComponent(cleanActiveEmail)}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.success && Array.isArray(data.saved)) {
          savedList = data.saved;
        }
      }
    } catch (e) {}

    if (savedList.length === 0) {
      const savedStr = localStorage.getItem(`wsj_saved_articles_${cleanActiveEmail}`) || localStorage.getItem("wsj_saved_articles");
      if (savedStr) {
        try {
          const parsedSaved = JSON.parse(savedStr);
          if (Array.isArray(parsedSaved)) {
            savedList = parsedSaved.filter((s: any) => {
              const sEmail = (s.user_email || s.userEmail || s.email || "").toLowerCase().trim();
              return sEmail === cleanActiveEmail;
            });
          }
        } catch (e) {}
      }
    }

    savedList.sort((a: any, b: any) => {
      const timeA = a.savedAt || a.publishedAt || (a.id && !isNaN(Number(a.id)) ? Number(a.id) : 0);
      const timeB = b.savedAt || b.publishedAt || (b.id && !isNaN(Number(b.id)) ? Number(b.id) : 0);
      return timeB - timeA;
    });

    setSavedArticles(savedList);
  };

  const confirmRemoveArticle = (article: any) => {
    const title = article.title || "this article";
    const key = article.slug || article.id;
    setDeleteConfirmModal({
      isOpen: true,
      title: "Remove Saved Article",
      message: `Are you sure you want to remove "${title}" from your saved articles?`,
      confirmText: "Remove",
      onConfirm: () => {
        handleRemoveArticle(key);
        setDeleteConfirmModal(null);
      },
    });
  };

  const handleRemoveArticle = async (slugOrId: string) => {
    if (typeof window === "undefined") return;
    try {
      let activeEmail = currentUser?.email || email || "";
      if (!activeEmail) {
        const userStr = sessionStorage.getItem("wsj_user");
        if (userStr) {
          try {
            const parsed = JSON.parse(userStr);
            if (parsed && parsed.email) activeEmail = parsed.email.toLowerCase().trim();
          } catch (e) {}
        }
      }

      const cleanEmail = activeEmail.toLowerCase().trim();

      // 1. Update component local state
      const updatedUserArticles = savedArticles.filter((item: any) => item.slug !== slugOrId && item.id !== slugOrId);
      setSavedArticles(updatedUserArticles);

      // 2. Filter global localStorage list (removing only this user's item)
      const raw = localStorage.getItem("wsj_saved_articles");
      let list: any[] = raw ? JSON.parse(raw) : [];
      list = list.filter((item: any) => {
        const itemEmail = (item.user_email || item.userEmail || "").toLowerCase().trim();
        const matchSlug = item.slug === slugOrId || item.id === slugOrId;
        return !(matchSlug && itemEmail === cleanEmail);
      });
      localStorage.setItem("wsj_saved_articles", JSON.stringify(list));
      if (cleanEmail) {
        localStorage.setItem(`wsj_saved_articles_${cleanEmail}`, JSON.stringify(updatedUserArticles));
      }

      // 3. Delete from Backend MySQL DB & File storage
      if (cleanEmail) {
        await fetch(`http://localhost:5000/api/saved-articles?email=${encodeURIComponent(cleanEmail)}&articleId=${encodeURIComponent(slugOrId)}`, {
          method: "DELETE",
        }).catch(() => {});
      }

      window.dispatchEvent(new Event("wsj_saved_articles_updated"));
    } catch (e) {}
  };

  const loadContactSubmissions = async (userEmail: string) => {
    if (!userEmail) return;
    try {
      const res = await fetch(`http://localhost:5000/api/contact/user?email=${encodeURIComponent(userEmail.toLowerCase().trim())}`);
      const data = await res.json();
      setContactSubmissions(data && data.success ? data.submissions || [] : []);
    } catch (e) {
      setContactSubmissions([]);
    }
  };

  const calculateDaysRemaining = (endDateStr: string) => {
    if (!endDateStr) return 0;
    const end = new Date(endDateStr).getTime();
    const now = Date.now();
    const diff = end - now;
    if (diff <= 0) return 0;
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return "N/A";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      return dateStr;
    }
  };

  const loadSubscription = async (userEmail: string) => {
    if (!userEmail) return;
    const cleanEmail = userEmail.toLowerCase().trim();

    try {
      const res = await fetch(`http://localhost:5000/api/subscriptions/user?email=${encodeURIComponent(cleanEmail)}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.success && data.subscription) {
          const sub = data.subscription;
          const days = calculateDaysRemaining(sub.end_date);
          const isExpired = days <= 0;
          const status = isExpired ? "Cancelled" : (sub.status || "Active");
          const updatedSub = { ...sub, status };
          setSubscription(updatedSub);
          setDaysRemaining(days);
          setIsSubscribed(!isExpired && status === "Active");
          try {
            localStorage.setItem("wsj_subscription_" + cleanEmail, JSON.stringify(updatedSub));
          } catch (e) {}
        } else {
          setSubscription(null);
          setDaysRemaining(0);
          setIsSubscribed(false);
          try {
            localStorage.removeItem("wsj_subscription_" + cleanEmail);
          } catch (e) {}
        }
      }
    } catch (e) {
      console.error("Failed to load user subscription:", e);
    }
  };

  // Load user from storage or route params
  const loadUserData = () => {
    if (typeof window === "undefined") return;

    let userObj: any = null;
    const sessionStr = sessionStorage.getItem("wsj_user");

    if (sessionStr) {
      try {
        userObj = JSON.parse(sessionStr);
      } catch (e) {}
    }

    if (!userObj) {
      // Fallback matching slug
      userObj = {
        full_name: decodedName || "John",
        email: `${rawSlug.toLowerCase()}@gmail.com`,
        role: "reader",
        bio: "News Enthusiast",
        linkedin: "",
        avatar_url: "",
      };
    }

    setCurrentUser(userObj);
    const initialName = userObj.full_name || userObj.name || decodedName || "John";
    setFullName(initialName);
    const targetEmail = userObj.email || `${rawSlug.toLowerCase()}@gmail.com`;
    setEmail(targetEmail);
    setRole((userObj.role || "READER").toUpperCase());
    setBio(userObj.bio || "News Enthusiast");
    const initialCountry = userObj.country || "United States";
    setCountry(initialCountry);
    const initialDialCode = userObj.phone_country_code || userObj.dial_code || "+1";
    setPhoneCountryCode(initialDialCode);
    const rawPhone = userObj.phone || userObj.mobile || userObj.mobile_number || "";
    const cleanDigits = String(rawPhone).replace(/\D/g, "");
    setPhone(cleanDigits.slice(0, 15));
    setLinkedin(userObj.linkedin || "");
    setAvatarUrl(userObj.avatar_url || "");

    loadSubscription(targetEmail);
  };

  const handleCountryChange = (newCountry: string) => {
    // Country is selected separately — do not change dial code
    setCountry(newCountry);
  };

  const handlePhoneChange = (val: string) => {
    // Only numbers can be entered
    const onlyNums = val.replace(/\D/g, "");
    if (onlyNums.length <= 15) {
      setPhone(onlyNums);
    }
  };

  useEffect(() => {
    loadUserData();

    const handleUpdate = () => loadUserData();
    window.addEventListener("wsj_user_updated", handleUpdate);
    return () => window.removeEventListener("wsj_user_updated", handleUpdate);
  }, [rawSlug]);

  useEffect(() => {
    if (activeTab === "contact-us" && email) {
      loadContactSubmissions(email);
    }
  }, [activeTab, email]);

  useEffect(() => {
    if (activeTab === "manage-subscriptions" && email) {
      loadSubscription(email);
    }
  }, [activeTab, email]);

  useEffect(() => {
    if (email) {
      loadSavedArticles(email);
    }
  }, [activeTab, email]);

  useEffect(() => {
    const handleSavedArticlesUpdated = () => {
      loadSavedArticles(email);
    };
    window.addEventListener("wsj_saved_articles_updated", handleSavedArticlesUpdated);
    return () => window.removeEventListener("wsj_saved_articles_updated", handleSavedArticlesUpdated);
  }, [email]);

  // Initials generator for fallback avatar
  const getInitials = (nameStr: string) => {
    if (!nameStr) return "TC";
    const parts = nameStr.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const readerDisplayName = fullName || currentUser?.full_name || currentUser?.name || decodedName || "Reader";
  const userInitials = getInitials(readerDisplayName);

  // Sign out handler
  const handleSignOut = () => {
    if (typeof window !== "undefined") {
      sessionStorage.clear();
      localStorage.removeItem("wsj_user");
      localStorage.removeItem("wsj_token");
      localStorage.removeItem("wsj_admin_user");
      localStorage.removeItem("wsj_session_active");
      window.dispatchEvent(new Event("wsj_user_updated"));
      window.dispatchEvent(new Event("wsj_logout"));
      router.push("/signin");
    }
  };

  // Profile photo upload handler
  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const webpUrl = await convertFileToWebP(file);
      if (webpUrl) {
        setAvatarUrl(webpUrl);
      }
    }
  };

  // Save profile settings handler
  const handleSaveProfile = async () => {
    if (isSaving) return;
    setIsSaving(true);

    const updatedUser = {
      ...(currentUser || {}),
      full_name: fullName,
      name: fullName,
      email: email,
      role: role.toLowerCase(),
      bio: bio,
      phone: phone,
      mobile: phone,
      mobile_number: phone,
      phone_country_code: phoneCountryCode,
      dial_code: phoneCountryCode,
      country: country,
      linkedin: "",
      avatar_url: avatarUrl,
    };

    try {
      localStorage.removeItem("wsj_user");
      sessionStorage.setItem("wsj_user", JSON.stringify(updatedUser));
    } catch (e) {}

    window.dispatchEvent(new Event("wsj_user_updated"));

    // Persist to backend API in background
    try {
      const prevName = currentUser?.full_name || currentUser?.name || "";
      await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: getAuthHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({ ...updatedUser, old_full_name: prevName }),
      });
    } catch (e) {}

    // Update stored accounts & slug map
    try {
      const storedAccounts = localStorage.getItem("wsj_accounts");
      if (storedAccounts) {
        const accounts = JSON.parse(storedAccounts);
        const idx = accounts.findIndex(
          (a: any) => a.email && a.email.toLowerCase() === email.toLowerCase()
        );
        if (idx !== -1) {
          accounts[idx] = { ...accounts[idx], ...updatedUser };
          localStorage.setItem("wsj_accounts", JSON.stringify(accounts));
        }
      }

      const profilesMap = JSON.parse(localStorage.getItem("wsj_users_by_email") || "{}");
      profilesMap[email.toLowerCase().trim()] = updatedUser;
      localStorage.setItem("wsj_users_by_email", JSON.stringify(profilesMap));
    } catch (e) {}

    setCurrentUser(updatedUser);
    setIsSaving(false);
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3500);
  };

  const bookmarkUrl = `/reader/${rawSlug}/saved/bookmark`;

  if (!currentUser) {
    return <ReaderAccountSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#F6F7F9] flex flex-col font-sans  text-[#222222]">
      {/* Mobile top navigation toggle bar */}
      <div className="lg:hidden bg-white border-b border-[#E5E5E5] px-4 py-3 flex items-center justify-between z-30">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex items-center space-x-2 text-sm font-semibold text-[#111111] p-1.5 rounded hover:bg-gray-100 transition-colors"
          aria-label="Toggle navigation menu"
        >
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
          <span>Account Menu</span>
        </button>

        <Link href="/">
          <img
            src="/images/design-reference/Times Chicago.svg"
            alt="Times Chicago"
            className="h-6 w-auto object-contain"
          />
        </Link>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row-reverse w-full min-h-screen">
        {/* ========================================================================= */}
        {/* RIGHT SIDEBAR (Matching Admin/Reader Dashboard Styling)                   */}
        {/* ========================================================================= */}
        <aside
          className={`w-full lg:w-72 bg-white border-b lg:border-b-0 lg:border-l border-[#E5E5E5] shrink-0 flex flex-col z-20 lg:sticky lg:top-0 lg:h-screen lg:self-start lg:overflow-y-auto no-scrollbar ${
            isMobileMenuOpen ? "block" : "hidden lg:flex"
          }`}
        >
          {/* 1. Times Chicago Logo at the very top (Aligned with main content image) */}
          <div className="pt-8 sm:pt-10 pb-2 px-6 flex items-center justify-between">
            <Link href="/" className="inline-block hover:opacity-90 transition-opacity">
              <img
                src="/images/design-reference/Times Chicago.svg"
                alt="Times Chicago"
                className="h-8 sm:h-9 md:h-10 w-auto object-contain block"
              />
            </Link>
          </div>

          {/* 2. Back to Home link with Left Arrow Icon */}
          <div className="px-6 pt-2 pb-1">
            <Link
              href="/"
              className="flex items-center space-x-2 text-xs sm:text-sm font-medium text-[#64748b] hover:text-[#0f172a] transition-all cursor-pointer group"
            >
              <svg
                className="w-4 h-4 shrink-0 text-[#64748b] group-hover:text-[#0f172a] transition-colors"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              <span>Back to Home</span>
            </Link>
          </div>

          {/* Divider 1 with increased top and bottom padding */}
          <hr className="mx-6 border-[#E5E5E5] my-6" />

          {/* 3. Top Reader Profile Section (Over Reader Left Sidebar) */}
          <div className="px-6">
            {/* Profile Image (reduced size as requested) */}
            <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-md overflow-hidden border border-[#E0E0E0] bg-[#F1F3F5] flex items-center justify-center shadow-xs">
              {avatarUrl || currentUser?.avatar_url ? (
                <img
                  src={avatarUrl || currentUser?.avatar_url}
                  alt={readerDisplayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[#111111] text-white font-serif font-bold text-2xl flex items-center justify-center">
                  {userInitials}
                </div>
              )}
            </div>

            {/* Reader Name */}
            <h2 className="text-2xl sm:text-[26px] font-serif font-bold text-[#111111] mt-3 leading-tight tracking-tight">
              {readerDisplayName}
            </h2>

            {/* Sign Out link */}
            <div className="mt-1">
              <button
                type="button"
                onClick={handleSignOut}
                className="text-[#0077B6] hover:text-[#005B8C] hover:underline text-sm font-normal cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* Divider 2 with increased top and bottom padding */}
          <hr className="mx-6 border-[#E5E5E5] my-6" />

          {/* 4. Unified menu items stacked continuously with icons */}
          <div className="flex flex-col w-full pb-8">
            {/* Overview */}
            <button
              type="button"
              onClick={() => {
                setActiveTab("overview");
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-6 sm:px-7 py-3 sm:py-3.5 text-[14.5px] transition-all cursor-pointer border-l-[4px] ${
                activeTab === "overview"
                  ? "bg-[#EEF2F6] border-[#0077B6] text-[#0077B6] font-bold"
                  : "border-transparent text-[#111111] hover:bg-[#F8FAFC] hover:text-[#0077B6] font-medium"
              }`}
            >
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
              </svg>
              <span className="font-poppins">Overview</span>
            </button>

            {/* Account Settings */}
            <button
              type="button"
              onClick={() => {
                setActiveTab("account-settings");
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-6 sm:px-7 py-3 sm:py-3.5 text-[14.5px] transition-all cursor-pointer border-l-[4px] ${
                activeTab === "account-settings"
                  ? "bg-[#EEF2F6] border-[#0077B6] text-[#0077B6] font-bold"
                  : "border-transparent text-[#111111] hover:bg-[#F8FAFC] hover:text-[#0077B6] font-medium"
              }`}
            >
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              <span className="font-poppins">Account Settings</span>
            </button>

            {/* Manage Subscriptions */}
            <button
              type="button"
              onClick={() => {
                setActiveTab("manage-subscriptions");
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-6 sm:px-7 py-3 sm:py-3.5 text-[14.5px] transition-all cursor-pointer border-l-[4px] ${
                activeTab === "manage-subscriptions"
                  ? "bg-[#EEF2F6] border-[#0077B6] text-[#0077B6] font-bold"
                  : "border-transparent text-[#111111] hover:bg-[#F8FAFC] hover:text-[#0077B6] font-medium"
              }`}
            >
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 3h3m-6.75 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5z" />
              </svg>
              <span className="font-poppins">Manage Subscriptions</span>
            </button>

            {/* Saved Articles */}
            <button
              type="button"
              onClick={() => {
                setActiveTab("saved-articles");
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-6 sm:px-7 py-3 sm:py-3.5 text-[14.5px] transition-all cursor-pointer border-l-[4px] ${
                activeTab === "saved-articles"
                  ? "bg-[#EEF2F6] border-[#0077B6] text-[#0077B6] font-bold"
                  : "border-transparent text-[#111111] hover:bg-[#F8FAFC] hover:text-[#0077B6] font-medium"
              }`}
            >
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
              </svg>
              <span className="font-poppins">Saved Articles</span>
            </button>

            {/* Help Center */}
            <button
              type="button"
              onClick={() => {
                setActiveTab("help-center");
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-6 sm:px-7 py-3 sm:py-3.5 text-[14.5px] transition-all cursor-pointer border-l-[4px] ${
                activeTab === "help-center"
                  ? "bg-[#EEF2F6] border-[#0077B6] text-[#0077B6] font-bold"
                  : "border-transparent text-[#111111] hover:bg-[#F8FAFC] hover:text-[#0077B6] font-medium"
              }`}
            >
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
              </svg>
              <span className="font-poppins">Help Center</span>
            </button>

            {/* Contact Us */}
            <button
              type="button"
              onClick={() => {
                setActiveTab("contact-us");
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-6 sm:px-7 py-3 sm:py-3.5 text-[14.5px] transition-all cursor-pointer border-l-[4px] ${
                activeTab === "contact-us"
                  ? "bg-[#EEF2F6] border-[#0077B6] text-[#0077B6] font-bold"
                  : "border-transparent text-[#111111] hover:bg-[#F8FAFC] hover:text-[#0077B6] font-medium"
              }`}
            >
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              <span className="font-poppins">Contact Us</span>
            </button>
          </div>
        </aside>

        {/* ========================================================================= */}
        {/* MAIN CONTENT AREA                                                         */}
        {/* ========================================================================= */}
        <main className="flex-1 flex flex-col min-h-screen bg-[#F6F7F9]">

          {/* MIDDLE CONTENT CONTAINER (Top padding aligned with Left Sidebar Logo: pt-8 sm:pt-10) */}
          <div className="flex-1 pt-8 sm:pt-10 pb-12 px-5 sm:px-8 md:px-10 max-w-5xl w-full mx-auto">
            {/* ----------------------------------------------------------------- */}
            {/* TAB 1: OVERVIEW                                                   */}
            {/* ----------------------------------------------------------------- */}
            {activeTab === "overview" && (
              <div>
                {/* Profile Image, Reader Name & Welcome Message Header */}
                <div className="flex items-start sm:items-center space-x-4 sm:space-x-5 pb-8 mb-8 border-b border-[#E5E5E5]">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-md overflow-hidden border border-[#E0E0E0] bg-[#F1F3F5] shrink-0 shadow-2xs flex items-center justify-center">
                    {avatarUrl || currentUser?.avatar_url ? (
                      <img
                        src={avatarUrl || currentUser?.avatar_url}
                        alt={readerDisplayName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#111111] text-white font-serif font-bold text-2xl sm:text-3xl flex items-center justify-center">
                        {userInitials}
                      </div>
                    )}
                  </div>

                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#111111] tracking-tight font-poppins">
                      {readerDisplayName}
                    </h1>
                    <p className="text-sm sm:text-base text-[#666666] mt-1 font-normal font-poppins">
                      Welcome to your Times Chicago Account
                    </p>
                  </div>
                </div>

                {/* 3-Column Section Grid (Matching Image 4 with requested modifications) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                  {/* Column 1: Profile */}
                  <div>
                    <h3 className="text-lg font-bold text-[#444444] mb-3 font-poppins">Profile</h3>
                    <div className="space-y-3">
                      {/* Account Settings Card */}
                      <button
                        type="button"
                        onClick={() => setActiveTab("account-settings")}
                        className="w-full bg-white border border-[#E5E5E5] p-5 text-left shadow-2xs hover:shadow-md hover:border-[#CBD5E1] transition-all cursor-pointer flex items-center min-h-[76px] group"
                      >
                        <span className="text-sm sm:text-[15px] font-medium text-[#222222] group-hover:text-[#0077B6] transition-colors font-poppins">
                          Account Settings
                        </span>
                      </button>

                      {/* Manage Subscription Card */}
                      <button
                        type="button"
                        onClick={() => setActiveTab("manage-subscriptions")}
                        className="w-full bg-white border border-[#E5E5E5] p-5 text-left shadow-2xs hover:shadow-md hover:border-[#CBD5E1] transition-all cursor-pointer flex items-center min-h-[76px] group"
                      >
                        <span className="text-sm sm:text-[15px] font-medium text-[#222222] group-hover:text-[#0077B6] transition-colors font-poppins">
                          Manage Subscription
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Column 2: Help */}
                  <div>
                    <h3 className="text-lg font-bold text-[#444444] mb-3 font-poppins">Help</h3>
                    <div className="space-y-3">
                      {/* Help Center Card */}
                      <button
                        type="button"
                        onClick={() => setActiveTab("help-center")}
                        className="w-full bg-white border border-[#E5E5E5] p-5 text-left shadow-2xs hover:shadow-md hover:border-[#CBD5E1] transition-all cursor-pointer flex items-center min-h-[76px] group"
                      >
                        <span className="text-sm sm:text-[15px] font-medium text-[#222222] group-hover:text-[#0077B6] transition-colors font-poppins">
                          Help Center
                        </span>
                      </button>

                      {/* Contact Us Card */}
                      <button
                        type="button"
                        onClick={() => setActiveTab("contact-us")}
                        className="w-full bg-white border border-[#E5E5E5] p-5 text-left shadow-2xs hover:shadow-md hover:border-[#CBD5E1] transition-all cursor-pointer flex items-center min-h-[76px] group"
                      >
                        <span className="text-sm sm:text-[15px] font-medium text-[#222222] group-hover:text-[#0077B6] transition-colors font-poppins">
                          Contact Us
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Column 3: More (With Saved Articles added and the previous 2 removed) */}
                  <div>
                    <h3 className="text-lg font-bold text-[#444444] mb-3 font-poppins">More</h3>
                    <div className="space-y-3">
                      {/* Saved Articles Card */}
                      <button
                        type="button"
                        onClick={() => setActiveTab("saved-articles")}
                        className="w-full bg-white border border-[#E5E5E5] p-5 text-left shadow-2xs hover:shadow-md hover:border-[#CBD5E1] transition-all cursor-pointer flex items-center min-h-[76px] group block"
                      >
                        <span className="text-sm sm:text-[15px] font-medium text-[#222222] group-hover:text-[#0077B6] transition-colors font-poppins">
                          Saved Articles
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ----------------------------------------------------------------- */}
            {/* ----------------------------------------------------------------- */}
            {/* TAB 2: ACCOUNT SETTINGS (Exact Profile Settings Form Extended)    */}
            {/* ----------------------------------------------------------------- */}
            {activeTab === "account-settings" && (
              <div className="w-full bg-white rounded-2xl p-6 sm:p-8 md:p-10 shadow-xs relative border border-[#e2e8f0]">
                {/* Modal Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-[#f1f5f9] gap-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <div>
                      <h2 className="font-poppins font-bold text-[24px] sm:text-[26px] text-[#0f172a] leading-tight tracking-tight">
                        Profile Settings
                      </h2>
                      <p className="font-mono text-[11px] font-semibold text-[#94a3b8] tracking-widest uppercase mt-0.5">
                        MANAGE YOUR ACCOUNT
                      </p>
                    </div>

                    {/* Ash Toast Box in Poppins Font horizontally aligned with Profile Settings */}
                    {showSavedToast && (
                      <div className="bg-[#f1f5f9] border border-[#cbd5e1] text-[#334155] px-3.5 py-1.5 rounded-lg text-xs font-poppins font-medium shadow-xs flex items-center space-x-2 transition-all">
                        <svg className="w-4 h-4 text-[#475569]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Profile settings saved successfully!</span>
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab("overview")}
                    className="text-[#94a3b8] hover:text-[#475569] p-1 rounded-md transition-colors cursor-pointer self-start sm:self-center"
                    aria-label="Close"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* User Photo & Basic Info Row */}
                <div className="flex items-center space-x-4 mb-6">
                  <div className="relative group">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={fullName}
                        className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl object-cover border border-[#e2e8f0] shadow-sm"
                      />
                    ) : (
                      <div className="w-16 h-16 sm:w-18 sm:h-18 bg-[#f05011] rounded-2xl flex items-center justify-center text-white font-bold text-[24px] sm:text-[26px] tracking-tight shadow-sm">
                        {userInitials}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="font-sans font-bold text-[14px] sm:text-[15px] text-[#005a9c] hover:text-[#004070] hover:underline cursor-pointer block leading-tight mb-0.5 text-left"
                    >
                      Change photo
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handlePhotoChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <p className="font-mono text-[12.5px] sm:text-[13px] text-[#64748b] truncate mb-1">
                      {email}
                    </p>
                    <span className="inline-block bg-[#f1f5f9] text-[#475569] font-mono font-bold text-[10.5px] px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                      {role}
                    </span>
                  </div>
                </div>

                {/* Form Body */}
                <div className="space-y-4">
                  {/* FULL NAME Field */}
                  <div>
                    <label className="block font-mono text-[11px] font-bold text-[#64748b] tracking-wider uppercase mb-1.5">
                      FULL NAME
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-[#e2e8f0] rounded-xl text-[#1e293b] font-sans text-[15px] focus:outline-none focus:border-[#00528a] focus:ring-2 focus:ring-[#00528a]/15 transition-all"
                      placeholder="Full name"
                    />
                  </div>

                  {/* BIO Field */}
                  <div>
                    <label className="block font-mono text-[11px] font-bold text-[#64748b] tracking-wider uppercase mb-1.5">
                      BIO
                    </label>
                    <textarea
                      rows={3}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-[#e2e8f0] rounded-xl text-[#1e293b] font-sans text-[15px] focus:outline-none focus:border-[#00528a] focus:ring-2 focus:ring-[#00528a]/15 transition-all resize-none leading-relaxed"
                      placeholder="Tell readers about yourself..."
                    />
                  </div>

                  {/* MOBILE NUMBER Field with Separate Country Code Dropdown */}
                  <div>
                    <label className="block font-mono text-[11px] font-bold text-[#64748b] tracking-wider uppercase mb-1.5 font-poppins">
                      MOBILE NUMBER
                    </label>
                    <div className="flex rounded-xl overflow-hidden border border-[#e2e8f0] focus-within:border-[#00528a] focus-within:ring-2 focus-within:ring-[#00528a]/15 transition-all">
                      <select
                        value={phoneCountryCode}
                        onChange={(e) => setPhoneCountryCode(e.target.value)}
                        className="bg-[#f8fafc] border-r border-[#e2e8f0] text-[#334155] font-poppins font-bold text-xs sm:text-sm px-2.5 sm:px-3 py-3 outline-none cursor-pointer max-w-[130px] sm:max-w-[160px]"
                      >
                        {COUNTRY_DIAL_CODES.map((d) => (
                          <option key={`${d.code}-${d.label}`} value={d.code}>
                            {d.label}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={phone}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        className="w-full px-4 py-3 bg-white text-[#1e293b] font-sans text-[15px] focus:outline-none font-poppins"
                        placeholder="Enter numbers only"
                      />
                    </div>
                    <div className="flex justify-between items-center mt-1 text-[11.5px] font-poppins text-[#64748b]">
                      <span>Country code and country are chosen separately</span>
                      <span>{phone.length} digits</span>
                    </div>
                  </div>

                  {/* COUNTRY Field (Select Dropdown) */}
                  <div>
                    <label className="block font-mono text-[11px] font-bold text-[#64748b] tracking-wider uppercase mb-1.5 font-poppins">
                      COUNTRY
                    </label>
                    <div className="relative">
                      <select
                        value={country}
                        onChange={(e) => handleCountryChange(e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-[#e2e8f0] rounded-xl text-[#1e293b] font-sans text-[15px] focus:outline-none focus:border-[#00528a] focus:ring-2 focus:ring-[#00528a]/15 transition-all appearance-none cursor-pointer font-poppins"
                      >
                        <option value="">Select country...</option>
                        {COUNTRIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#64748b]">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons Footer matching screenshot */}
                <div className="flex items-center space-x-3.5 mt-7 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab("overview")}
                    className="w-1/2 py-3.5 bg-white border border-[#cbd5e1] hover:bg-[#f8fafc] text-[#334155] font-mono font-bold text-[13.5px] sm:text-[14px] tracking-wider uppercase rounded-xl transition-colors cursor-pointer text-center"
                  >
                    CANCEL
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="w-1/2 py-3.5 bg-[#00487c] hover:bg-[#003862] text-white font-mono font-bold text-[13.5px] sm:text-[14px] tracking-wider uppercase rounded-xl transition-all shadow-md cursor-pointer text-center disabled:opacity-50"
                  >
                    {isSaving ? "SAVING..." : "SAVE CHANGES"}
                  </button>
                </div>
              </div>
            )}

            {/* ----------------------------------------------------------------- */}
            {/* TAB 3: MANAGE SUBSCRIPTIONS (Image 2 + Subscribed List)           */}
            {/* ----------------------------------------------------------------- */}
            {activeTab === "manage-subscriptions" && (
              <div className="w-full space-y-6">
                {/* 1. Image 2 Card: Times Chicago Free Edition */}
                <div className="bg-white border border-[#E5E5E5] p-6 sm:p-8 md:p-10 shadow-2xs">
                  <p className="text-[14px] sm:text-[15px] text-[#444444] font-normal mb-1">
                    Subscription
                  </p>
                  <h2 className="text-[26px] sm:text-[30px] font-poppins font-bold text-[#111111] leading-tight pb-4 mb-5 border-b border-[#E5E5E5]">
                    Times Chicago Free Edition
                  </h2>

                  <p className="text-[14px] sm:text-[15px] text-[#444444] leading-relaxed mb-4">
                    Thank you for registering with Times Chicago. Upgrade to the Times Chicago Digital Bundle for unlimited access across Times Chicago website and mobile apps, audio articles, daily puzzles and crosswords, real-time breaking alerts, and exclusive reporting.
                  </p>
                  <p className="text-[14px] sm:text-[15px] text-[#444444] leading-relaxed mb-7">
                    For unlimited access, please subscribe below.
                  </p>

                  <Link
                    href="/special-offer"
                    className="inline-block bg-[#0077B6] hover:bg-[#005B8C] text-white font-semibold text-[14px] sm:text-[15px] px-6 py-3 transition-colors cursor-pointer text-center"
                  >
                    View Subscription Options
                  </Link>
                </div>

                {/* 2. Subscribed List Card (Shown if user email has subscribed) */}
                {subscription && (
                  <div className="bg-white border border-[#E5E5E5] p-6 sm:p-8 md:p-10 shadow-2xs">
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-[#E5E5E5] gap-3">
                      <div>
                        <p className="text-xs font-mono font-bold text-[#64748b] uppercase tracking-wider mb-1 font-poppins">
                          YOUR SUBSCRIPTION
                        </p>
                        <h3 className="text-xl sm:text-2xl font-poppins font-bold text-[#111111]">
                          {subscription.package_name || subscription.packageName || "Times Chicago Digital Bundle"}
                        </h3>
                      </div>
                      <div>
                        {daysRemaining !== null && daysRemaining <= 0 ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                            <span className="w-2 h-2 rounded-full bg-rose-500 mr-2"></span>
                            Subscription Cancelled
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 font-poppins">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                            Active
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Day-wise Countdown Timer Box */}
                    <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-5 sm:p-6 mb-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <p className="text-xs font-mono font-bold text-[#64748b] uppercase tracking-wider mb-1">
                            TIME REMAINING
                          </p>
                          <div className="text-2xl sm:text-3xl font-poppins font-bold text-[#0f172a]">
                            {daysRemaining !== null && daysRemaining > 0 ? (
                              <span>{daysRemaining} {daysRemaining === 1 ? "day" : "days"} remaining</span>
                            ) : (
                              <span className="text-rose-600">0 days remaining</span>
                            )}
                          </div>
                          <p className="text-xs text-[#64748b] mt-1 font-poppins">
                            {daysRemaining !== null && daysRemaining > 0
                              ? `1-Year Complimentary Period (${daysRemaining} of 365 days remaining)`
                              : "The 1-year subscription term has concluded. Status: Cancelled."}
                          </p>
                        </div>

                        {daysRemaining !== null && daysRemaining > 0 && (
                          <div className="sm:text-right">
                            <span className="inline-block bg-[#0077B6]/10 text-[#0077B6] font-mono font-bold text-xs px-3 py-1.5 rounded-md font-poppins">
                              {(daysRemaining >= 365 ? 100 : Math.min(99, Math.floor((daysRemaining / 365) * 100)))}% of year left
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Day-wise Progress Bar */}
                      {daysRemaining !== null && daysRemaining > 0 && (
                        <div className="w-full bg-[#E2E8F0] h-2.5 rounded-full mt-4 overflow-hidden">
                          <div
                            className="bg-[#0077B6] h-full rounded-full transition-all duration-500"
                            style={{ width: `${Math.max(2, Math.min(100, (daysRemaining / 365) * 100))}%` }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Subscription Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div className="p-4 bg-gray-50 border border-gray-100 rounded-lg">
                        <span className="block text-xs font-mono font-bold text-gray-500 uppercase tracking-wider mb-1 font-poppins">
                          Plan & Pricing
                        </span>
                        <span className="font-semibold text-gray-900 font-poppins">
                          {subscription.price || "Free for 1 Year"}
                        </span>
                      </div>

                      <div className="p-4 bg-gray-50 border border-gray-100 rounded-lg">
                        <span className="block text-xs font-mono font-bold text-gray-500 uppercase tracking-wider mb-1 font-poppins">
                          Start Date
                        </span>
                        <span className="font-semibold text-gray-900 font-poppins">
                          {formatDateDisplay(subscription.start_date || subscription.created_at)}
                        </span>
                      </div>

                      <div className="p-4 bg-gray-50 border border-gray-100 rounded-lg">
                        <span className="block text-xs font-mono font-bold text-gray-500 uppercase tracking-wider mb-1 font-poppins">
                          Expiration Date
                        </span>
                        <span className="font-semibold text-gray-900 font-poppins">
                          {formatDateDisplay(subscription.end_date)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ----------------------------------------------------------------- */}
            {/* TAB 4: SAVED ARTICLES (Bookmark Content in Main Content Area)     */}
            {/* ----------------------------------------------------------------- */}
            {activeTab === "saved-articles" && (
              <div className="w-full">
                {/* Section Header Row */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center space-x-2 shrink-0">
                    <h2 className="font-poppins font-extrabold text-xs xs:text-sm sm:text-[15px] tracking-wider text-[#0f172a] uppercase whitespace-nowrap">
                      SAVED ARTICLES
                    </h2>
                  </div>

                  {/* Right Pill Badge: N ARTICLES */}
                  <div className="bg-[#eff4f8] text-[#556980] font-poppins text-[9.5px] sm:text-[10px] font-bold px-2 sm:px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {savedArticles.length} ARTICLES
                  </div>
                </div>

                {/* Saved Articles Card Grid */}
                {savedArticles.length === 0 ? (
                  <div className="bg-white border border-[#e2e8f0]/80 rounded-2xl py-12 sm:py-14 px-4 sm:px-8 min-h-[260px] sm:min-h-[300px] flex flex-col items-center justify-center text-center shadow-2xs">
                    {/* Center Circular Icon Container */}
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#f1f5f9] text-[#94a3b8] flex items-center justify-center mb-4">
                      <svg className="w-7 h-7 sm:w-8 sm:h-8 text-[#94a3b8]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>

                    {/* No Saved Articles Title */}
                    <h3 className="font-poppins font-bold text-base text-[#0f172a] mb-1.5">
                      No Saved Articles
                    </h3>

                    {/* Description Subtitle */}
                    <p className="font-sans text-xs sm:text-[13px] text-[#94a3b8] max-w-sm leading-relaxed text-center">
                      Explore our publications and bookmark your favorite articles to read them here later.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-start justify-start gap-3.5 sm:gap-5">
                    {savedArticles.map((article: any, index: number) => {
                      const articleSlug = article.slug || article.id || `article-${index}`;
                      return (
                        <div
                          key={articleSlug}
                          className="bg-white border border-[#e2e8f0] rounded-xl overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group w-full xs:w-[240px] sm:w-[255px] shrink-0"
                        >
                          {/* Top Image Container with Delete Trash Icon */}
                          <div className="relative w-full h-34 sm:h-36 overflow-hidden bg-slate-100">
                            <img
                              src={article.image || "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?fm=webp&fit=crop&w=600&q=80"}
                              alt={article.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />

                            {/* Top-Right Trash Delete Button */}
                            <button
                              type="button"
                              onClick={() => confirmRemoveArticle(article)}
                              className="absolute top-2 right-2 bg-[#1e293b]/75 hover:bg-[#0f172a] text-white p-1.5 rounded-md transition-colors cursor-pointer shadow-md backdrop-blur-xs"
                              title="Remove from Saved Articles"
                              aria-label="Remove from Saved Articles"
                            >
                              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                              </svg>
                            </button>
                          </div>

                          {/* Bottom Content Portion */}
                          <div className="p-3.5 flex flex-col justify-between flex-1 space-y-2">
                            <div>
                              {/* Category & Date */}
                              <div className="flex items-center space-x-1.5 font-poppins text-[10.5px] tracking-tight mb-1">
                                <span className="font-bold text-[#0284c7] uppercase tracking-wider font-poppins">{article.category || "WORLD"}</span>
                                <span className="text-[#8c9aa8]">•</span>
                                <span className="text-[#8c9aa8] font-poppins">
                                  {formatDateClean(article.date)}
                                </span>
                              </div>

                              {/* Article Title */}
                              <Link href={`/article/${articleSlug}`}>
                                <h3 className="font-bold text-[14.5px] text-[#111111] leading-[1.3] line-clamp-2 hover:text-[#0284c7] transition-colors cursor-pointer font-georgia-serif" style={{ fontFamily: "Georgia, serif" }}>
                                  {article.title}
                                </h3>
                              </Link>
                            </div>

                            {/* Author Byline */}
                            <div className="font-poppins text-[10px] font-medium text-[#8c9aa8] uppercase tracking-wider pt-2 border-t border-[#f1f5f9] truncate">
                              {article.author || "BY DYLAN CANDICE ODULIO"}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ----------------------------------------------------------------- */}
            {/* TAB 5: HELP CENTER                                                */}
            {/* ----------------------------------------------------------------- */}
            {activeTab === "help-center" && (
              <div className="w-full">
                <ReaderHelpCenter />
              </div>
            )}

            {/* ----------------------------------------------------------------- */}
            {/* TAB 6: CONTACT US (Clean Blank Middle Space)                      */}
            {/* ----------------------------------------------------------------- */}
            {activeTab === "contact-us" && (
              <div className="w-full space-y-6">
                <div className="bg-white border border-[#E5E5E5] p-6 sm:p-8 md:p-10 shadow-2xs">
                  <p className="text-[14px] sm:text-[15px] text-[#444444] font-normal mb-1">
                    Contact Us
                  </p>
                  <h2 className="text-[26px] sm:text-[30px] font-poppins font-bold text-[#111111] leading-tight pb-4 mb-5 border-b border-[#E5E5E5]">
                    We&apos;re Here to Help
                  </h2>

                  <p className="text-[14px] sm:text-[15px] text-[#444444] leading-relaxed mb-4">
                    Thank you for being a Times Chicago reader. Whether you have a question about your account or subscription, need help accessing articles, want to share a news tip, or have feedback for our newsroom, our customer care team is ready to assist you.
                  </p>
                  <p className="text-[14px] sm:text-[15px] text-[#444444] leading-relaxed mb-7">
                    If you need anything, please contact us below.
                  </p>

                  <Link
                    href="/contact-us"
                    className="inline-block bg-[#0077B6] hover:bg-[#005B8C] text-white font-semibold text-[14px] sm:text-[15px] px-6 py-3 transition-colors cursor-pointer text-center"
                  >
                    Contact Us
                  </Link>
                </div>

                {contactSubmissions.length > 0 && (
                  <div className="bg-white border border-[#E5E5E5] w-full shadow-2xs">
                    <div className="px-6 py-4 border-b border-[#E5E5E5]">
                      <h4 className="text-base font-semibold text-[#222222] font-poppins">Your Queries</h4>
                    </div>
                    <ul className="divide-y divide-[#E5E5E5]">
                      {contactSubmissions.map((s: any) => (
                        <li key={s.id} className="px-6 py-5 text-sm">
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                            <span className="font-semibold text-[#222222]">{s.inquiry_type || "General / Others"}</span>
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-[#888888]">{formatDateDisplay(s.created_at)}</span>
                              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#E8F1F8] text-[#005A9C]">{s.status || "New"}</span>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-xs text-[#555555] mb-3">
                            <div><span className="text-[#888888]">Name:</span> {s.name}</div>
                            <div><span className="text-[#888888]">Email:</span> {s.email}</div>
                            {s.phone && <div><span className="text-[#888888]">Phone:</span> {s.phone}</div>}
                            {s.whatsapp && <div><span className="text-[#888888]">WhatsApp:</span> {s.whatsapp}</div>}
                            {s.company && <div><span className="text-[#888888]">Company:</span> {s.company}</div>}
                          </div>
                          <p className="text-[#333333] leading-relaxed whitespace-pre-wrap bg-[#FAFAFA] border border-[#EEEEEE] p-3">{s.details}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* BOTTOM FOOTER (Matching Image 3) */}
          <footer className="w-full bg-white border-t border-[#E5E5E5] py-8 text-center mt-auto">
            <p className="text-[11px] font-bold text-[#555555] tracking-widest uppercase mb-3 font-poppins">
              POWERED BY TIMES CHICAGO
            </p>
            <div className="text-xs text-[#666666] flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 font-poppins">
              <Link href="/privacy-policy" className="hover:underline hover:text-[#111111] transition-colors">
                Privacy Policy
              </Link>
              <span className="text-[#cbd5e1]">|</span>
              <Link href="/cookie-policy" className="hover:underline hover:text-[#111111] transition-colors">
                Cookie Policy
              </Link>
              <span className="text-[#cbd5e1]">|</span>
              <Link href="/editorial-policy" className="hover:underline hover:text-[#111111] transition-colors">
                Editorial Policy
              </Link>
              <span className="text-[#cbd5e1]">|</span>
              <Link href="/legal-policies" className="hover:underline hover:text-[#111111] transition-colors">
                Legal Policies
              </Link>
              <span className="text-[#cbd5e1]">|</span>
              <Link href="/copyright-policy" className="hover:underline hover:text-[#111111] transition-colors">
                Copyright Policy
              </Link>
              <span className="text-[#cbd5e1]">|</span>
              <Link href="/accessibility" className="hover:underline hover:text-[#111111] transition-colors">
                Accessibility
              </Link>
            </div>
            <p className="text-[11px] text-[#888888] mt-3 font-poppins">
              © 2026 Times Chicago LLC, All Rights Reserved
            </p>
          </footer>
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmModal && deleteConfirmModal.isOpen && (
        <div className="fixed inset-0 z-[99999] bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 font-serif">
                  {deleteConfirmModal.title}
                </h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  {deleteConfirmModal.message}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeleteConfirmModal(null)}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteConfirmModal.onConfirm();
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm cursor-pointer"
              >
                {deleteConfirmModal.confirmText || "Remove"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
