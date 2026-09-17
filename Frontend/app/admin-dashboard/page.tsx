"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProfileSettingsModal, { UserProfile } from "@/components/ui/ProfileSettingsModal";

interface ProjectItem {
  id: string;
  title: string;
  subheadline?: string;
  excerpt: string;
  bodyContent?: string;
  readTime: string;
  category: string;
  subCategories?: string[];
  tags?: string[];
  isExclusive?: boolean;
  cardSummary?: string;
  focusKeyword?: string;
  seoDescription?: string;
  seoTitle?: string;
  author: string;
  submittedDate: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  thumbnail: string;
}

interface NewsletterSub {
  id: string;
  email: string;
  newsletters: string[];
  subscribedDate: string;
}

interface PublishedPostItem {
  id: string;
  title: string;
  subheadline?: string;
  cardSummary?: string;
  bodyContent?: string;
  excerpt: string;
  readTime: string;
  category: string;
  placement?: string;
  author: string;
  views: number;
  comments: number;
  thumbnail: string;
}

export interface ShortReelItem {
  id: string;
  slotNumber: number;
  videoUrl: string;
  platform:
    | "Youtube Video"
    | "Rumble Video"
    | "Facebook Short"
    | "Instagram shorts"
    | "Apple Podcasts"
    | "Spotify"
    | "YouTube Music"
    | "Amazon Music";
  title: string;
  thumbnailUrl: string;
  duration: string;
  status: "Active" | "Inactive";
  createdAt?: string;
}

const DEFAULT_RECOMMENDED_SLOTS: ShortReelItem[] = [
  {
    id: "rec_slot_1",
    slotNumber: 1,
    videoUrl: "https://www.youtube.com/watch?v=rv1",
    platform: "Youtube Video",
    title: "Pizza Hut Lost in the U.S. Now It’s Selling for $2.7B.",
    thumbnailUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?fm=webp&fit=crop&w=400&q=80",
    duration: "0:45",
    status: "Active",
  },
  {
    id: "rec_slot_2",
    slotNumber: 2,
    videoUrl: "https://www.youtube.com/watch?v=rv2",
    platform: "Youtube Video",
    title: "How One Family’s Flower Farm Became Essential to Chanel No. 5",
    thumbnailUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?fm=webp&fit=crop&w=400&q=80",
    duration: "0:58",
    status: "Active",
  },
  {
    id: "rec_slot_3",
    slotNumber: 3,
    videoUrl: "https://www.youtube.com/watch?v=rv3",
    platform: "Youtube Video",
    title: "Inside the Pacific Wargames Watched by America’s Adversaries",
    thumbnailUrl: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?fm=webp&fit=crop&w=400&q=80",
    duration: "1:15",
    status: "Active",
  },
  {
    id: "rec_slot_4",
    slotNumber: 4,
    videoUrl: "https://www.youtube.com/watch?v=rv4",
    platform: "Youtube Video",
    title: "Times Chicago Opinion: Hits and Misses",
    thumbnailUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?fm=webp&fit=crop&w=400&q=80",
    duration: "0:50",
    status: "Active",
  },
  {
    id: "rec_slot_5",
    slotNumber: 5,
    videoUrl: "https://www.youtube.com/watch?v=rv5",
    platform: "Youtube Video",
    title: "The Evolution of Modern Motorsports",
    thumbnailUrl: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?fm=webp&fit=crop&w=400&q=80",
    duration: "0:40",
    status: "Active",
  },
];

const DEFAULT_MAIN_VIDEOS_SLOTS: ShortReelItem[] = [
  {
    id: "video_slot_1",
    slotNumber: 1,
    videoUrl: "https://www.youtube.com/watch?v=v1",
    platform: "Youtube Video",
    title: "Inside the Pacific Wargames Watched by America’s Adversaries",
    thumbnailUrl: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?fm=webp&fit=crop&w=600&q=80",
    duration: "10:22",
    status: "Active",
  },
  {
    id: "video_slot_2",
    slotNumber: 2,
    videoUrl: "https://www.youtube.com/watch?v=v2",
    platform: "Youtube Video",
    title: "Can Hamas Really Be Disarmed? Inside the Gaza Peace Deal",
    thumbnailUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?fm=webp&fit=crop&w=600&q=80",
    duration: "4:13",
    status: "Active",
  },
  {
    id: "video_slot_3",
    slotNumber: 3,
    videoUrl: "https://www.youtube.com/watch?v=v3",
    platform: "Youtube Video",
    title: "How Democratic Socialists Are Shaking Up the Midterms",
    thumbnailUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?fm=webp&fit=crop&w=600&q=80",
    duration: "6:22",
    status: "Active",
  },
  {
    id: "video_slot_4",
    slotNumber: 4,
    videoUrl: "https://www.youtube.com/watch?v=v4",
    platform: "Youtube Video",
    title: "Global Energy Markets Surge: Renewable Investments & Oil Futures",
    thumbnailUrl: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?fm=webp&fit=crop&w=600&q=80",
    duration: "8:45",
    status: "Active",
  },
];

const DEFAULT_PODCAST_SLOTS: ShortReelItem[] = [
  {
    id: "podcast_slot_1",
    slotNumber: 1,
    videoUrl: "https://podcasts.apple.com/us/podcast/cruel-summer%3A-the-violent-death-of-tiffany-valiante/id6801170249",
    platform: "Apple Podcasts",
    title: "Cruel Summer: The Violent Death of Tiffany Valiante",
    thumbnailUrl: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?fm=webp&fit=crop&w=600&q=80",
    duration: "40:34",
    status: "Active",
  },
  {
    id: "podcast_slot_2",
    slotNumber: 2,
    videoUrl: "https://podcasts.apple.com/in/podcast/smart-ways-to-regulate-your-energy-levels-jadetimes/id1791836245?i=1000702397718&l=kn",
    platform: "Apple Podcasts",
    title: "Smart Ways to Regulate Your Energy Levels | Jadetimes Talks | Episode 04",
    thumbnailUrl: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?fm=webp&fit=crop&w=600&q=80",
    duration: "20:05",
    status: "Active",
  },
  {
    id: "podcast_slot_3",
    slotNumber: 3,
    videoUrl: "https://podcasts.apple.com/in/podcast/john-cenas-journey-wrestling-to-wealth-mastery-jadetimes/id1791836245?i=1000705047737&l=kn",
    platform: "Apple Podcasts",
    title: "John Cena’s Journey | Wrestling to Wealth Mastery | Jadetimes Talks | Episode 05",
    thumbnailUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?fm=webp&fit=crop&w=600&q=80",
    duration: "7:03",
    status: "Active",
  },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<
    | "Overview"
    | "Newsletter"
    | "Published Posts"
    | "Users"
    | "Manage Ads"
    | "Contact Us Submissions"
    | "Advertise Leads"
    | "Database Backups"
    | "Shorts & Reels"
  >("Overview");

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    onConfirm: () => void;
  } | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<ProjectItem | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 1. Pending Projects Data (Overview tab)
  const [projects, setProjects] = useState<ProjectItem[]>([]);

  // 2. Newsletter Subscribers Data (Newsletter tab)
  const [subscribers, setSubscribers] = useState<NewsletterSub[]>([
    {
      id: "sub_1",
      email: "akramyoonos54354@gmail.com",
      newsletters: ["US", "ECONOMY & MARKETS"],
      subscribedDate: "Aug 17, 2026",
    },
    {
      id: "sub_2",
      email: "circuitridergary@duck.com",
      newsletters: [
        "US",
        "WORLD",
        "POLITICS",
        "ECONOMY & MARKETS",
        "BUSINESS",
        "CRYPTO",
        "TECHNOLOGY",
        "TRAVEL",
        "OPINION",
        "CEO SPOTLIGHT",
        "SPORTS",
        "HEALTH",
      ],
      subscribedDate: "Aug 14, 2026",
    },
    {
      id: "sub_3",
      email: "monlinebrands@gmail.com",
      newsletters: ["US", "POLITICS", "SPORTS"],
      subscribedDate: "Aug 11, 2026",
    },
    {
      id: "sub_4",
      email: "akramyoonos1433@gmail.com",
      newsletters: ["US", "WORLD", "ECONOMY & MARKETS", "BUSINESS"],
      subscribedDate: "Aug 10, 2026",
    },
    {
      id: "sub_5",
      email: "odulio.dylan@gmail.com",
      newsletters: [
        "US",
        "WORLD",
        "POLITICS",
        "ECONOMY & MARKETS",
        "BUSINESS",
        "CRYPTO",
        "TECHNOLOGY",
        "TRAVEL",
        "OPINION",
        "CEO SPOTLIGHT",
        "SPORTS",
        "HEALTH",
      ],
      subscribedDate: "Aug 10, 2026",
    },
  ]);
  const [selectedSubIds, setSelectedSubIds] = useState<string[]>([]);

interface AdSlotConfig {
  id: string;
  slotName: string;
  dimension: string;
  placementGroup: "Homepage" | "Category" | "Author";
  description: string;
  active: boolean;
  actionType: string;
  targetUrl: string;
  selectedArticleSlug?: string;
  imageUrl: string;
  fileName?: string;
}

const SLOT_NAME_MAP: Record<string, string> = {
  hp_slot_1: "Homepage ad 1",
  hp_slot_2: "Homepage ad 2",
  hp_slot_3: "Homepage ad 3",
  hp_slot_4: "Homepage ad 4",
  hp_slot_5: "Homepage ad 5",
  hp_slot_6: "Homepage ad 6",
  hp_slot_7: "Homepage ad 7",
  cat_slot_1: "Category Page ad 1",
  cat_slot_2: "Category Page ad 2",
  author_slot_1: "Writer Page ad 1",
};

const normalizeAdSlots = (slots: AdSlotConfig[]): AdSlotConfig[] => {
  const DIM_MAP: Record<string, string> = {
    hp_slot_1: "300x300",
    hp_slot_2: "970x175",
    hp_slot_3: "970x120",
    hp_slot_4: "300x150",
    hp_slot_5: "300x320",
    hp_slot_6: "970x180",
    hp_slot_7: "300x320",
    cat_slot_1: "300x250",
    cat_slot_2: "300x600",
    author_slot_1: "300x250",
  };

  return slots.map((s) => ({
    ...s,
    slotName: SLOT_NAME_MAP[s.id] || s.slotName,
    dimension: DIM_MAP[s.id] || s.dimension,
  }));
};

const DEFAULT_AD_SLOTS: AdSlotConfig[] = [
  {
    id: "hp_slot_1",
    slotName: "Homepage ad 1",
    dimension: "300x300",
    placementGroup: "Homepage",
    description: "Displayed inside the right sidebar of the Business category section.",
    active: true,
    actionType: "External Link (URL)",
    targetUrl: "https://www.top-scholarships.com/",
    selectedArticleSlug: "",
    imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?fm=webp&fit=crop&w=300&q=80",
  },
  {
    id: "hp_slot_2",
    slotName: "Homepage ad 2",
    dimension: "970x175",
    placementGroup: "Homepage",
    description: "Displayed horizontally full-width directly below the World Politics section.",
    active: true,
    actionType: "External Link (URL)",
    targetUrl: "https://www.top-scholarships.com/",
    selectedArticleSlug: "",
    imageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?fm=webp&fit=crop&w=970&q=80",
  },
  {
    id: "hp_slot_3",
    slotName: "Homepage ad 3",
    dimension: "970x120",
    placementGroup: "Homepage",
    description: "Displayed horizontally full-width inside main content area below Your Weekend.",
    active: true,
    actionType: "External Link (URL)",
    targetUrl: "https://www.pepsi.com/",
    selectedArticleSlug: "",
    imageUrl: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?fm=webp&fit=crop&w=970&q=80",
  },
  {
    id: "hp_slot_4",
    slotName: "Homepage ad 4",
    dimension: "300x150",
    placementGroup: "Homepage",
    description: "Displayed inside the center column at bottom of People to Know section.",
    active: true,
    actionType: "External Link (URL)",
    targetUrl: "https://www.pepsi.com/",
    selectedArticleSlug: "",
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?fm=webp&fit=crop&w=300&q=80",
  },
  {
    id: "hp_slot_5",
    slotName: "Homepage ad 5",
    dimension: "300x320",
    placementGroup: "Homepage",
    description: "Displayed inside the right sidebar directly below Recommended Videos section.",
    active: true,
    actionType: "External Link (URL)",
    targetUrl: "https://www.wsj.com/",
    selectedArticleSlug: "",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?fm=webp&fit=crop&w=300&q=80",
  },
  {
    id: "hp_slot_6",
    slotName: "Homepage ad 6",
    dimension: "970x180",
    placementGroup: "Homepage",
    description: "Displayed horizontally full-width directly below Sports Category section.",
    active: true,
    actionType: "External Link (URL)",
    targetUrl: "https://www.bloomberg.com/",
    selectedArticleSlug: "",
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?fm=webp&fit=crop&w=970&q=80",
  },
  {
    id: "hp_slot_7",
    slotName: "Homepage ad 7",
    dimension: "300x320",
    placementGroup: "Homepage",
    description: "Displayed inside the right sidebar next to Main Video section on Homepage.",
    active: true,
    actionType: "External Link (URL)",
    targetUrl: "https://www.marketwatch.com/",
    selectedArticleSlug: "",
    imageUrl: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?fm=webp&fit=crop&w=300&q=80",
  },
  {
    id: "cat_slot_1",
    slotName: "Category Page ad 1",
    dimension: "300x250",
    placementGroup: "Category",
    description: "Displayed inside the right sidebar of all category listing pages.",
    active: true,
    actionType: "External Link (URL)",
    targetUrl: "https://www.wsj.com/news/world",
    selectedArticleSlug: "",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?fm=webp&fit=crop&w=300&q=80",
  },
  {
    id: "cat_slot_2",
    slotName: "Category Page ad 2",
    dimension: "300x600",
    placementGroup: "Category",
    description: "Displayed inside the right sidebar of all category pages directly below Ad 1.",
    active: true,
    actionType: "External Link (URL)",
    targetUrl: "https://www.wsj.com/news/business",
    selectedArticleSlug: "",
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?fm=webp&fit=crop&w=300&q=80",
  },
  {
    id: "author_slot_1",
    slotName: "Writer Page ad 1",
    dimension: "300x250",
    placementGroup: "Author",
    description: "Displayed inside the sidebar of writer and author profile pages.",
    active: true,
    actionType: "External Link (URL)",
    targetUrl: "https://www.wsj.com/author",
    selectedArticleSlug: "",
    imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?fm=webp&fit=crop&w=300&q=80",
  },
];

  // 3. Published Posts Data (Published Posts tab)
  const [publishedPosts, setPublishedPosts] = useState<PublishedPostItem[]>([]);

  // Filter state for Published Posts
  const [pubCategoryFilter, setPubCategoryFilter] = useState("All Categories");
  const [pubPlacementFilter, setPubPlacementFilter] = useState("All Placements");
  const [pubSearchQuery, setPubSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  // 4. Manage Ads State
  const [adSubTab, setAdSubTab] = useState<"ALL" | "HOMEPAGE" | "CATEGORY" | "AUTHOR">("ALL");

  // 5. Users Desk State
  interface UserDeskItem {
    id: string | number;
    full_name: string;
    email: string;
    role: string;
    bio?: string;
    avatar_url?: string;
    linkedin?: string;
    is_default_admin?: boolean;
    created_at?: string;
  }

  const DEFAULT_ADMIN_EMAILS = [
    "akramyoonos006@gmail.com",
    "geethliyanage979@gmail.com",
    "timeschicago17@gmail.com"
  ];

  const [usersList, setUsersList] = useState<UserDeskItem[]>([]);
  const [userSubTab, setUserSubTab] = useState<"ALL" | "ADMINS" | "WRITERS" | "READERS">("ALL");
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showViewUserModal, setShowViewUserModal] = useState<UserDeskItem | null>(null);
  const [showEditUserModal, setShowEditUserModal] = useState<UserDeskItem | null>(null);

  // New user form state
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserRole, setNewUserRole] = useState<"admin" | "writer" | "reader">("writer");
  const [addUserError, setAddUserError] = useState("");
  const [isSubmittingUser, setIsSubmittingUser] = useState(false);

  // Edit user form state
  const [editUserName, setEditUserName] = useState("");
  const [editUserEmail, setEditUserEmail] = useState("");
  const [editUserRole, setEditUserRole] = useState<"admin" | "writer" | "reader">("writer");
  const [editUserPassword, setEditUserPassword] = useState("");
  const [showEditUserPasswordText, setShowEditUserPasswordText] = useState(false);
  const [editUserBio, setEditUserBio] = useState("");
  const [editUserLinkedin, setEditUserLinkedin] = useState("");
  const [editUserError, setEditUserError] = useState("");
  const [isSubmittingEditUser, setIsSubmittingEditUser] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserDeskItem | null>(null);
  const [adSavedPopup, setAdSavedPopup] = useState<string | null>(null);
  const [adminNoticePopup, setAdminNoticePopup] = useState<string | null>(null);
  const [adDimensionMismatchPopup, setAdDimensionMismatchPopup] = useState<{
    uploadedDim: string;
    slotDim: string;
    slotName: string;
  } | null>(null);

  // 9. Shorts & Reels State
  const [recommendedList, setRecommendedList] = useState<ShortReelItem[]>(DEFAULT_RECOMMENDED_SLOTS);
  const [mainVideosList, setMainVideosList] = useState<ShortReelItem[]>(DEFAULT_MAIN_VIDEOS_SLOTS);
  const [podcastList, setPodcastList] = useState<ShortReelItem[]>(DEFAULT_PODCAST_SLOTS);
  const [shortsSubTab, setShortsSubTab] = useState<"RECOMMENDED" | "VIDEOS" | "PODCAST">("RECOMMENDED");
  const [shortVideoUrl, setShortVideoUrl] = useState("");
  const [shortPlatform, setShortPlatform] = useState<
    | "Youtube Video"
    | "Rumble Video"
    | "Facebook Short"
    | "Instagram shorts"
    | "Apple Podcasts"
    | "Spotify"
    | "YouTube Music"
    | "Amazon Music"
  >("Youtube Video");
  const [shortTitle, setShortTitle] = useState("");
  const [shortThumbnailUrl, setShortThumbnailUrl] = useState("");
  const [shortDuration, setShortDuration] = useState("0:45");
  const [shortTargetSlot, setShortTargetSlot] = useState<number>(1);
  const [shortStatus, setShortStatus] = useState<"Active" | "Inactive">("Active");
  const [editingSlotNumber, setEditingSlotNumber] = useState<number | null>(null);
  const [shortSuccessMsg, setShortSuccessMsg] = useState("");

  interface BackupItem {
    fileName: string;
    fileId?: string | null;
    backupDate: string;
    size?: number;
    sizeFormatted: string;
    publicUrl?: string | null;
    source?: string;
  }

  const [backupsList, setBackupsList] = useState<BackupItem[]>([]);
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [isRestoringBackup, setIsRestoringBackup] = useState(false);
  const jsonFileInputRef = useRef<HTMLInputElement>(null);

  interface ContactSubmissionItem {
    id: string;
    created_at?: string;
    name: string;
    company?: string;
    email: string;
    phone?: string;
    whatsapp?: string;
    inquiry_type?: string;
    message: string;
    status?: string;
  }

  interface AdvertiseLeadItem {
    id: string;
    created_at?: string;
    name: string;
    company: string;
    email: string;
    phone?: string;
    whatsapp?: string;
    service_option?: string;
    requirements: string;
    status?: string;
  }

  const formatSubmissionDate = (rawDate?: string) => {
    if (!rawDate) return "Just now";
    try {
      const d = new Date(rawDate);
      if (isNaN(d.getTime())) return rawDate;
      const datePart = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      const timePart = d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
      return `${datePart}, ${timePart}`;
    } catch (e) {
      return rawDate;
    }
  };

  const formatModalSubmittedDate = (dateStr?: string) => {
    if (!dateStr) return "Submitted on N/A";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return `Submitted on ${dateStr}`;
      return `Submitted on ${d.toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
        year: "numeric",
      })}, ${d.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      })}`;
    } catch (e) {
      return `Submitted on ${dateStr}`;
    }
  };

  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmissionItem[]>([]);
  const [advertiseLeads, setAdvertiseLeads] = useState<AdvertiseLeadItem[]>([]);

  const [contactSearchQuery, setContactSearchQuery] = useState("");
  const [contactTypeFilter, setContactTypeFilter] = useState("All Inquiry Types");
  const [selectedContactModal, setSelectedContactModal] = useState<ContactSubmissionItem | null>(null);

  const [advertiseSearchQuery, setAdvertiseSearchQuery] = useState("");
  const [advertiseServiceFilter, setAdvertiseServiceFilter] = useState("All Services");
  const [selectedAdvertiseModal, setSelectedAdvertiseModal] = useState<AdvertiseLeadItem | null>(null);

  const fetchContactSubmissions = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/contact").catch(() => null);
      if (res && res.ok) {
        const data = await res.json();
        const list = data.submissions || (Array.isArray(data) ? data : []);
        setContactSubmissions(list);
      }
    } catch (err) {
      console.error("Failed to fetch contact submissions:", err);
    }
  };

  const fetchAdvertiseLeads = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/advertise-leads").catch(() => null);
      if (res && res.ok) {
        const data = await res.json();
        const list = data.leads || (Array.isArray(data) ? data : []);
        setAdvertiseLeads(list);
      }
    } catch (err) {
      console.error("Failed to fetch advertise leads:", err);
    }
  };

  const handleUpdateContactStatus = async (id: string, newStatus: string) => {
    setContactSubmissions((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
    try {
      await fetch(`http://localhost:5000/api/contact/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (e) {
      console.error("Failed to update contact status:", e);
    }
  };

  const handleDeleteContactSubmission = async (id: string) => {
    setContactSubmissions((prev) => prev.filter((item) => item.id !== id));
    try {
      await fetch(`http://localhost:5000/api/contact/${id}`, { method: "DELETE" });
    } catch (e) {
      console.error("Failed to delete contact submission:", e);
    }
  };

  const handleUpdateAdvertiseStatus = async (id: string, newStatus: string) => {
    setAdvertiseLeads((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
    try {
      await fetch(`http://localhost:5000/api/advertise-leads/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (e) {
      console.error("Failed to update advertise status:", e);
    }
  };

  const handleDeleteAdvertiseLead = async (id: string) => {
    setAdvertiseLeads((prev) => prev.filter((item) => item.id !== id));
    try {
      await fetch(`http://localhost:5000/api/advertise-leads/${id}`, { method: "DELETE" });
    } catch (e) {
      console.error("Failed to delete advertise lead:", e);
    }
  };

  const filteredContactSubmissions = contactSubmissions.filter((item) => {
    const typeMatch =
      contactTypeFilter === "All Inquiry Types" ||
      (item.inquiry_type || "").toLowerCase() === contactTypeFilter.toLowerCase();
    const q = contactSearchQuery.toLowerCase().trim();
    const searchMatch =
      !q ||
      (item.name || "").toLowerCase().includes(q) ||
      (item.email || "").toLowerCase().includes(q) ||
      (item.message || "").toLowerCase().includes(q) ||
      (item.company || "").toLowerCase().includes(q);
    return typeMatch && searchMatch;
  });

  const filteredAdvertiseLeads = advertiseLeads.filter((item) => {
    const serviceMatch =
      advertiseServiceFilter === "All Services" ||
      (item.service_option || "").toLowerCase() === advertiseServiceFilter.toLowerCase();
    const q = advertiseSearchQuery.toLowerCase().trim();
    const searchMatch =
      !q ||
      (item.name || "").toLowerCase().includes(q) ||
      (item.email || "").toLowerCase().includes(q) ||
      (item.requirements || "").toLowerCase().includes(q) ||
      (item.company || "").toLowerCase().includes(q);
    return serviceMatch && searchMatch;
  });

  const fetchBackupsList = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/backups").catch(() => null);
      if (res && res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.backups)) {
          setBackupsList(data.backups);
          return;
        }
      }
    } catch (err) {
      console.error("Failed to fetch backups list:", err);
    }
  };

  const handleCreateB2Backup = async () => {
    setIsCreatingBackup(true);
    let allPosts: any[] = [];
    if (typeof window !== "undefined") {
      try {
        allPosts = JSON.parse(localStorage.getItem("wsj_posts") || "[]");
      } catch (e) {}
    }

    const publishedPostsOnly = allPosts.filter(
      (p: any) => p && p.status && ["published", "approved"].includes(String(p.status).toLowerCase())
    );

    const payload = {
      published_posts: publishedPostsOnly,
      subscribers: subscribers,
      users: usersList,
      contact_submissions: contactSubmissions,
      advertise_leads: advertiseLeads,
    };

    try {
      const res = await fetch("http://localhost:5000/api/backups/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payload }),
      });
      const data = await res.json();
      if (data.success) {
        setAdminNoticePopup("B2 Backup snapshot created and uploaded successfully!");
        fetchBackupsList();
      } else {
        setAdminNoticePopup(data.message || "Failed to create B2 backup");
      }
    } catch (err) {
      setAdminNoticePopup("Network error creating B2 backup");
    } finally {
      setIsCreatingBackup(false);
    }
  };

  const handleUploadJsonRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const content = reader.result as string;
        const snapshot = JSON.parse(content);

        setIsRestoringBackup(true);
        const res = await fetch("http://localhost:5000/api/backups/upload-restore", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ snapshot, fileName: file.name }),
        });
        const data = await res.json();
        if (data.success) {
          if (typeof window !== "undefined") {
            if (snapshot.posts && Array.isArray(snapshot.posts)) {
              localStorage.setItem("wsj_posts", JSON.stringify(snapshot.posts));
            }
            if (snapshot.users && Array.isArray(snapshot.users)) {
              const uMap: Record<string, any> = {};
              snapshot.users.forEach((u: any) => {
                if (u.email) uMap[u.email.toLowerCase().trim()] = u;
              });
              localStorage.setItem("wsj_users_by_email", JSON.stringify(uMap));
            }
            if (snapshot.ads && Array.isArray(snapshot.ads)) {
              localStorage.setItem("wsj_ad_slots_config", JSON.stringify(snapshot.ads));
            }
            if (snapshot.subscribers && Array.isArray(snapshot.subscribers)) {
              localStorage.setItem("wsj_newsletter_subscribers", JSON.stringify(snapshot.subscribers));
            }
            if (snapshot.shorts && Array.isArray(snapshot.shorts)) {
              const rec = snapshot.shorts.filter((s: any) => s.id?.includes("recommended") || s.slotNumber <= 5);
              const mainV = snapshot.shorts.filter((s: any) => s.id?.includes("main") || s.id?.includes("videos"));
              const pod = snapshot.shorts.filter((s: any) => s.id?.includes("podcast"));
              if (rec.length > 0) localStorage.setItem("wsj_recommended_video_slots", JSON.stringify(rec));
              if (mainV.length > 0) localStorage.setItem("wsj_main_video_slots", JSON.stringify(mainV));
              if (pod.length > 0) localStorage.setItem("wsj_podcast_slots", JSON.stringify(pod));
              window.dispatchEvent(new Event("wsj_shorts_updated"));
            }
            window.dispatchEvent(new Event("wsj_posts_updated"));
            window.dispatchEvent(new Event("wsj_user_updated"));
          }
          alert("Website database restored successfully from uploaded JSON! Reloading page...");
          window.location.reload();
        } else {
          setAdminNoticePopup(data.message || "Failed to restore database");
        }
      } catch (err) {
        setAdminNoticePopup("Invalid JSON backup file format.");
      } finally {
        setIsRestoringBackup(false);
        if (jsonFileInputRef.current) jsonFileInputRef.current.value = "";
      }
    };
    reader.readAsText(file);
  };

  const handleRestoreBackup = async (fileName: string) => {
    if (
      !confirm(
        `Are you sure you want to restore the website database from snapshot "${fileName}"? This will update all published articles, users, subscribers, ad placements, and media.`
      )
    ) {
      return;
    }

    setIsRestoringBackup(true);
    try {
      const res = await fetch("http://localhost:5000/api/backups/restore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName }),
      });
      const data = await res.json();
      if (data.success) {
        const snap = data.snapshot;
        if (snap && typeof window !== "undefined") {
          if (snap.posts && Array.isArray(snap.posts)) {
            localStorage.setItem("wsj_posts", JSON.stringify(snap.posts));
          }
          if (snap.users && Array.isArray(snap.users)) {
            const uMap: Record<string, any> = {};
            snap.users.forEach((u: any) => {
              if (u.email) uMap[u.email.toLowerCase().trim()] = u;
            });
            localStorage.setItem("wsj_users_by_email", JSON.stringify(uMap));
          }
          if (snap.ads && Array.isArray(snap.ads)) {
            localStorage.setItem("wsj_ad_slots_config", JSON.stringify(snap.ads));
          }
          if (snap.subscribers && Array.isArray(snap.subscribers)) {
            localStorage.setItem("wsj_newsletter_subscribers", JSON.stringify(snap.subscribers));
          }
          if (snap.shorts && Array.isArray(snap.shorts)) {
            const rec = snap.shorts.filter((s: any) => s.id?.includes("recommended") || s.slotNumber <= 5);
            const mainV = snap.shorts.filter((s: any) => s.id?.includes("main") || s.id?.includes("videos"));
            const pod = snap.shorts.filter((s: any) => s.id?.includes("podcast"));
            if (rec.length > 0) localStorage.setItem("wsj_recommended_video_slots", JSON.stringify(rec));
            if (mainV.length > 0) localStorage.setItem("wsj_main_video_slots", JSON.stringify(mainV));
            if (pod.length > 0) localStorage.setItem("wsj_podcast_slots", JSON.stringify(pod));
            window.dispatchEvent(new Event("wsj_shorts_updated"));
          }
          window.dispatchEvent(new Event("wsj_posts_updated"));
          window.dispatchEvent(new Event("wsj_user_updated"));
        }
        alert(`Website database restored successfully from ${fileName}! Reloading page...`);
        window.location.reload();
      } else {
        setAdminNoticePopup(data.message || "Failed to restore backup snapshot");
      }
    } catch (err) {
      setAdminNoticePopup("Network error restoring backup snapshot");
    } finally {
      setIsRestoringBackup(false);
    }
  };

  const handleDownloadBackup = async (backup: BackupItem) => {
    try {
      if (backup.publicUrl) {
        const res = await fetch(backup.publicUrl).catch(() => null);
        if (res && res.ok) {
          const blob = await res.blob();
          const downloadUrl = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = downloadUrl;
          link.download = backup.fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(downloadUrl);
          return;
        }
      }

      const res = await fetch("http://localhost:5000/api/backups");
      if (res.ok) {
        const data = await res.json();
        const found = (data.backups || []).find((b: any) => b.fileName === backup.fileName);
        if (found && found.publicUrl) {
          window.open(found.publicUrl, "_blank");
          return;
        }
      }

      setAdminNoticePopup("Could not download backup file.");
    } catch (e) {
      setAdminNoticePopup("Error downloading backup file.");
    }
  };

  const handleDeleteBackup = async (fileName: string) => {
    if (!confirm(`Are you sure you want to delete backup snapshot "${fileName}"?`)) return;

    try {
      const res = await fetch(`http://localhost:5000/api/backups/${encodeURIComponent(fileName)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        fetchBackupsList();
        setAdminNoticePopup("Backup snapshot deleted successfully!");
      } else {
        setAdminNoticePopup(data.message || "Failed to delete backup snapshot");
      }
    } catch (e) {
      setAdminNoticePopup("Error deleting backup snapshot");
    }
  };

  useEffect(() => {
    const fetchShortsList = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/shorts", { cache: "no-store" }).catch(() => null);
        if (res && res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.slots)) {
            const rec = data.slots.filter(
              (s: any) => (s.id?.includes("recommended") || s.id?.startsWith("rec") || s.subTab === "RECOMMENDED") && !s.id?.includes("main") && !s.id?.includes("videos") && !s.id?.includes("podcast") && !s.id?.includes("pod")
            );
            const mainV = data.slots.filter(
              (s: any) => s.id?.includes("main") || s.id?.includes("videos") || s.subTab === "VIDEOS"
            );
            const pod = data.slots.filter(
              (s: any) => s.id?.includes("podcast") || s.id?.includes("pod") || s.subTab === "PODCAST"
            );

            if (rec.length > 0) {
              setRecommendedList(rec);
              localStorage.setItem("wsj_recommended_video_slots", JSON.stringify(rec));
            }
            if (mainV.length > 0) {
              setMainVideosList(mainV);
              localStorage.setItem("wsj_main_video_slots", JSON.stringify(mainV));
            }
            if (pod.length > 0) {
              setPodcastList(pod);
              localStorage.setItem("wsj_podcast_slots", JSON.stringify(pod));
            }
            return;
          }
        }
      } catch (e) {
        console.error("Failed to fetch shorts from backend API:", e);
      }

      const savedPod = localStorage.getItem("wsj_podcast_slots");
      if (savedPod) {
        try {
          const parsed = JSON.parse(savedPod);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setPodcastList(parsed);
          }
        } catch (e) {}
      }
    };

    const sanitizeList = (list: ShortReelItem[], defaultList: ShortReelItem[]) => {
      return list.map((item, idx) => {
        if (!item.thumbnailUrl || item.thumbnailUrl.includes("1611974789855-9c2a0a7236a3")) {
          const fallback = defaultList[idx]?.thumbnailUrl || "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?fm=webp&fit=crop&w=400&q=80";
          return { ...item, thumbnailUrl: fallback };
        }
        return item;
      });
    };

    const savedRec = localStorage.getItem("wsj_recommended_video_slots");
    if (savedRec) {
      try {
        const parsed = JSON.parse(savedRec);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const sanitized = sanitizeList(parsed.slice(0, 5), DEFAULT_RECOMMENDED_SLOTS);
          setRecommendedList(sanitized);
        }
      } catch (e) {}
    }
    const savedMain = localStorage.getItem("wsj_main_video_slots");
    if (savedMain) {
      try {
        const parsed = JSON.parse(savedMain);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const sanitized = sanitizeList(parsed, DEFAULT_MAIN_VIDEOS_SLOTS);
          setMainVideosList(sanitized);
        }
      } catch (e) {}
    }
    const savedPod = localStorage.getItem("wsj_podcast_slots");
    if (savedPod) {
      try {
        const parsed = JSON.parse(savedPod);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPodcastList(parsed);
        }
      } catch (e) {}
    }

    fetchShortsList();
    fetchBackupsList();

    window.addEventListener("wsj_shorts_updated", fetchShortsList);
    return () => window.removeEventListener("wsj_shorts_updated", fetchShortsList);
  }, []);

  const extractYoutubeId = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
    return match ? match[1] : null;
  };

  const detectShortPlatform = (url: string) => {
    const lower = url.toLowerCase();
    if (lower.includes("podcasts.apple.com") || lower.includes("apple.com")) return "Apple Podcasts";
    if (lower.includes("spotify.com") || lower.includes("open.spotify.com")) return "Spotify";
    if (lower.includes("music.youtube.com")) return "YouTube Music";
    if (lower.includes("youtube.com") || lower.includes("youtu.be")) return "Youtube Video";
    if (lower.includes("rumble.com")) return "Rumble Video";
    if (lower.includes("facebook.com") || lower.includes("fb.watch")) return "Facebook Short";
    if (lower.includes("instagram.com")) return "Instagram shorts";
    return shortPlatform;
  };

  function decodeHtmlEntities(str: string): string {
    if (!str) return "";
    return str
      .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)))
      .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)))
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&#39;/g, "'");
  }

  function cleanVideoTitle(rawTitle: string): string {
    if (!rawTitle) return "";
    let decoded = decodeHtmlEntities(rawTitle);
    decoded = decoded.replace(/^[0-9.]+[KMB]?\s*(?:views|reactions|likes)[^|]*\|\s*/i, "");
    decoded = decoded.replace(/\s*\|\s*(?:Fox News Video|Facebook Video|Rumble Video)\s*$/i, "");
    return decoded.trim();
  }

  const [isFetchingVideoDetails, setIsFetchingVideoDetails] = useState(false);

  const autoFetchVideoDetails = async (url: string) => {
    if (!url || !url.trim()) return;
    const trimmed = url.trim();

    setIsFetchingVideoDetails(true);

    // 1. Primary Backend Universal Video Metadata Fetcher & Backblaze B2 Cover Image uploader
    try {
      const res = await fetch("http://localhost:5000/api/video-metadata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          if (data.platform) setShortPlatform(data.platform);
          if (data.title) setShortTitle(cleanVideoTitle(data.title));
          if (data.thumbnailUrl) setShortThumbnailUrl(data.thumbnailUrl);
          if (data.duration) setShortDuration(data.duration);
          setIsFetchingVideoDetails(false);
          return;
        }
      }
    } catch (err) {
      console.log("Backend video-metadata API failed, fallback to client fetch:", err);
    }

    // 2. Fallback Client Fetch
    const detected = detectShortPlatform(trimmed);
    setShortPlatform(detected);

    const ytId = extractYoutubeId(trimmed);
    if (ytId) {
      setShortThumbnailUrl(`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`);

      try {
        const ytWatchUrl = `https://www.youtube.com/watch?v=${ytId}`;
        const res = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(ytWatchUrl)}&format=json`);
        if (res.ok) {
          const data = await res.json();
          if (data.title) {
            setShortTitle(data.title);
            setIsFetchingVideoDetails(false);
            return;
          }
        }
      } catch (err) {
        console.log("YouTube official oEmbed fetch skipped:", err);
      }
    }

    try {
      const res = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(trimmed)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.title) {
          setShortTitle(data.title);
        }
        if (data.thumbnail_url && !ytId) {
          setShortThumbnailUrl(data.thumbnail_url);
        }
      }
    } catch (err) {
      console.log("General oEmbed auto-fetch skipped:", err);
    } finally {
      setIsFetchingVideoDetails(false);
    }
  };

  const handleShortUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setShortVideoUrl(val);
    if (val && val.trim().length > 8) {
      autoFetchVideoDetails(val);
    }
  };

  const handleShortThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        if (typeof reader.result === "string") {
          const base64 = reader.result;
          setShortThumbnailUrl(base64);
          try {
            const res = await fetch("http://localhost:5000/api/upload", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                imageBase64: base64,
                fileName: `cover_${Date.now()}.${file.name.split('.').pop() || 'webp'}`,
                folder: "cover images",
              }),
            });
            const data = await res.json();
            if (data.success && data.url) {
              setShortThumbnailUrl(data.url);
            }
          } catch (err) {
            console.log("Custom thumbnail Backblaze upload skipped:", err);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const getCurrentShortsList = () => {
    if (shortsSubTab === "RECOMMENDED") return recommendedList;
    if (shortsSubTab === "VIDEOS") return mainVideosList;
    return podcastList;
  };

  const getMaxSlotsForSubTab = () => {
    if (shortsSubTab === "RECOMMENDED") return 5;
    if (shortsSubTab === "VIDEOS") return 4;
    return 3;
  };

  const updateCurrentShortsList = (updated: ShortReelItem[]) => {
    if (shortsSubTab === "RECOMMENDED") {
      setRecommendedList(updated);
      localStorage.setItem("wsj_recommended_video_slots", JSON.stringify(updated));
    } else if (shortsSubTab === "VIDEOS") {
      setMainVideosList(updated);
      localStorage.setItem("wsj_main_video_slots", JSON.stringify(updated));
    } else {
      setPodcastList(updated);
      localStorage.setItem("wsj_podcast_slots", JSON.stringify(updated));
    }
    window.dispatchEvent(new Event("wsj_shorts_updated"));
  };

  const handleSaveShortSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shortVideoUrl.trim()) {
      alert("Please enter a Video URL.");
      return;
    }
    if (!shortTitle.trim()) {
      alert("Please enter a Video Title / Headline.");
      return;
    }

    const currentList = getCurrentShortsList();
    const updated = [...currentList];
    const targetIdx = updated.findIndex((s) => s.slotNumber === shortTargetSlot);
    const slotId = shortsSubTab === "PODCAST" ? `podcast_slot_${shortTargetSlot}` : shortsSubTab === "VIDEOS" ? `video_slot_${shortTargetSlot}` : `recommended_slot_${shortTargetSlot}`;

    const newShort: ShortReelItem = {
      id: slotId,
      slotNumber: shortTargetSlot,
      videoUrl: shortVideoUrl.trim(),
      platform: shortPlatform,
      title: shortTitle.trim(),
      thumbnailUrl: shortThumbnailUrl.trim(),
      duration: shortDuration.trim() || "0:45",
      status: shortStatus,
      createdAt: new Date().toISOString(),
    };

    if (targetIdx !== -1) {
      updated[targetIdx] = newShort;
    } else {
      updated.push(newShort);
      updated.sort((a, b) => a.slotNumber - b.slotNumber);
    }

    // Save locally first
    updateCurrentShortsList(updated);

    // Re-host thumbnail to Backblaze B2 cover images folder via backend POST /api/shorts
    try {
      const res = await fetch("http://localhost:5000/api/shorts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subTab: shortsSubTab, slots: updated }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.slots)) {
          const filtered = data.slots.filter((s: any) => {
            if (shortsSubTab === "RECOMMENDED")
              return s.id?.includes("recommended") || (s.id?.startsWith("rec") && !s.id?.includes("video"));
            if (shortsSubTab === "VIDEOS")
              return s.id?.includes("videos") || s.id?.includes("main") || s.id?.includes("video_slot");
            return s.id?.includes("podcast") || s.id?.includes("pod") || s.subTab === "podcast";
          });
          if (filtered.length > 0) {
            updateCurrentShortsList(filtered);
          }
        }
      }
    } catch (err) {
      console.log("Backend shorts save sync skipped:", err);
    }

    setShortSuccessMsg(`Slot #${shortTargetSlot} saved successfully!`);
    setTimeout(() => setShortSuccessMsg(""), 4000);

    setShortVideoUrl("");
    setShortTitle("");
    setShortThumbnailUrl("");
    setShortDuration("0:45");
    setEditingSlotNumber(null);
  };

  const handleEditShortSlot = (item: ShortReelItem) => {
    if (!item) return;
    setEditingSlotNumber(item.slotNumber || 1);
    setShortTargetSlot(item.slotNumber || 1);
    setShortVideoUrl(item.videoUrl || "");

    let validPlatform = item.platform || (shortsSubTab === "PODCAST" ? "Apple Podcasts" : "Youtube Video");
    if (shortsSubTab === "PODCAST") {
      if (!["Apple Podcasts", "Spotify", "YouTube Music", "Amazon Music"].includes(validPlatform)) {
        validPlatform = "Apple Podcasts";
      }
    } else {
      if (!["Youtube Video", "Rumble Video", "Facebook Short", "Instagram shorts"].includes(validPlatform)) {
        validPlatform = "Youtube Video";
      }
    }
    setShortPlatform(validPlatform as any);
    setShortTitle(item.title && !item.title.includes("[Empty Slot") ? item.title : "");
    setShortThumbnailUrl(item.thumbnailUrl || "");
    setShortDuration(item.duration || "0:45");
    setShortStatus(item.status || "Active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteShortSlot = (slotNumber: number) => {
    if (confirm(`Are you sure you want to delete / reset content for Slot #${slotNumber}? The slot container will remain available.`)) {
      const currentList = getCurrentShortsList();
      const slotId = shortsSubTab === "PODCAST" ? `podcast_slot_${slotNumber}` : shortsSubTab === "VIDEOS" ? `video_slot_${slotNumber}` : `recommended_slot_${slotNumber}`;
      
      const updated = currentList.map((s) => {
        if (s.slotNumber === slotNumber) {
          return {
            id: slotId,
            slotNumber,
            videoUrl: "",
            platform: (shortsSubTab === "PODCAST" ? "Apple Podcasts" : "Youtube Video") as any,
            title: `[Empty Slot #${slotNumber}]`,
            thumbnailUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><rect width='100%' height='100%' fill='%23000000'/></svg>",
            duration: "0:00",
            status: "Inactive" as const,
          };
        }
        return s;
      });
      updateCurrentShortsList(updated);
      fetch("http://localhost:5000/api/shorts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subTab: shortsSubTab, slots: updated }),
      }).catch((err) => console.log("Backend shorts delete sync skipped:", err));
    }
  };

  const loggedInEmail = (currentUser?.email || "").toLowerCase().trim();
  const isLoggedInUserDefaultAdmin = Boolean(currentUser?.is_default_admin);

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users").catch(() => null);
      if (res && res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.list)) {
          setUsersList(data.list);

          const tabUserStr = typeof window !== "undefined" ? sessionStorage.getItem("wsj_user") : null;
          let currentEmail = "";
          if (tabUserStr) {
            try {
              const p = JSON.parse(tabUserStr);
              currentEmail = (p.email || "").toLowerCase().trim();
            } catch (e) {}
          }
          if (!currentEmail && currentUser?.email) {
            currentEmail = currentUser.email.toLowerCase().trim();
          }

          if (currentEmail) {
            const me = data.list.find((u: any) => (u.email || "").toLowerCase().trim() === currentEmail);
            if (me) {
              const updatedMe = {
                ...currentUser,
                ...me,
                avatar_url: me.avatar_url !== undefined && me.avatar_url !== null ? me.avatar_url : "",
                is_default_admin: Boolean(me.is_default_admin),
              };
              setCurrentUser(updatedMe);
              if (typeof window !== "undefined") {
                sessionStorage.setItem("wsj_user", JSON.stringify(updatedMe));
              }
            }
          }
          return;
        }
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }

    if (typeof window !== "undefined") {
      try {
        const storedMap = localStorage.getItem("wsj_users_by_email");
        if (storedMap) {
          const parsed = JSON.parse(storedMap);
          const list = Object.values(parsed).map((u: any) => ({
            ...u,
            is_default_admin: DEFAULT_ADMIN_EMAILS.includes((u.email || "").toLowerCase().trim()),
          }));
          setUsersList(list as UserDeskItem[]);
        }
      } catch (e) {}
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddUserError("");
    if (!newUserName.trim() || !newUserEmail.trim() || !newUserPassword.trim()) {
      setAddUserError("All fields are required.");
      return;
    }

    if (!isLoggedInUserDefaultAdmin && newUserRole === "admin") {
      setAddUserError("Only Default Admins can create new Admin accounts.");
      return;
    }

    setIsSubmittingUser(true);
    try {
      const res = await fetch("http://localhost:5000/api/users/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newUserName.trim(),
          email: newUserEmail.trim(),
          password: newUserPassword.trim(),
          role: newUserRole,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setAddUserError(data.message || "Failed to create user.");
        setIsSubmittingUser(false);
        return;
      }

      setShowAddUserModal(false);
      setNewUserName("");
      setNewUserEmail("");
      setNewUserPassword("");
      setNewUserRole("writer");
      setIsSubmittingUser(false);
      fetchUsers();
    } catch (err) {
      setAddUserError("Network error when creating user.");
      setIsSubmittingUser(false);
    }
  };

  const handleOpenEditUserModal = (user: UserDeskItem) => {
    setShowEditUserModal(user);
    setEditUserName(user.full_name || "");
    setEditUserEmail(user.email || "");
    setEditUserRole((user.role?.toLowerCase() as any) || "writer");
    setEditUserPassword("");
    setShowEditUserPasswordText(false);
    setEditUserBio(user.bio || "");
    setEditUserLinkedin(user.linkedin || "");
    setEditUserError("");
  };

  const handleSaveEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditUserError("");
    if (!editUserEmail) return;

    setIsSubmittingEditUser(true);
    try {
      const res = await fetch("http://localhost:5000/api/users/edit", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: editUserEmail,
          full_name: editUserName.trim(),
          role: editUserRole,
          password: editUserPassword.trim() || undefined,
          bio: editUserBio.trim(),
          linkedin: editUserLinkedin.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setEditUserError(data.message || "Failed to update user.");
        setIsSubmittingEditUser(false);
        return;
      }

      if (typeof window !== "undefined") {
        try {
          const map = JSON.parse(localStorage.getItem("wsj_users_by_email") || "{}");
          const cleanKey = editUserEmail.toLowerCase().trim();
          map[cleanKey] = {
            ...(map[cleanKey] || {}),
            full_name: editUserName.trim(),
            role: editUserRole,
            bio: editUserBio.trim(),
            linkedin: editUserLinkedin.trim(),
          };
          localStorage.setItem("wsj_users_by_email", JSON.stringify(map));

          const tabUserStr = sessionStorage.getItem("wsj_user");
          if (tabUserStr) {
            const parsed = JSON.parse(tabUserStr);
            if ((parsed.email || "").toLowerCase().trim() === cleanKey) {
              const updatedSessionUser = {
                ...parsed,
                full_name: editUserName.trim(),
                role: editUserRole,
                bio: editUserBio.trim(),
                linkedin: editUserLinkedin.trim(),
              };
              sessionStorage.setItem("wsj_user", JSON.stringify(updatedSessionUser));
              localStorage.setItem("wsj_user", JSON.stringify(updatedSessionUser));
            }
          }
          window.dispatchEvent(new Event("wsj_user_updated"));
          window.dispatchEvent(new Event("wsj_posts_updated"));
        } catch (e) {}
      }

      setShowEditUserModal(null);
      setIsSubmittingEditUser(false);
      fetchUsers();
      loadPostsData();
    } catch (err) {
      setEditUserError("Network error when updating user.");
      setIsSubmittingEditUser(false);
    }
  };

  const handleDeleteUser = async (email: string) => {
    const cleanEmail = (email || "").toLowerCase().trim();
    if (DEFAULT_ADMIN_EMAILS.includes(cleanEmail)) {
      setAdminNoticePopup("Default Admin accounts cannot be deleted.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/users/${encodeURIComponent(cleanEmail)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        fetchUsers();
      } else {
        setAdminNoticePopup(data.message || "Failed to delete user.");
      }
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  const [adSlots, setAdSlots] = useState<AdSlotConfig[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("wsj_ad_slots_config");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return normalizeAdSlots(parsed);
          }
        }
      } catch (e) {}
    }
    return DEFAULT_AD_SLOTS;
  });

  // Load current user from storage & guard auth
  const loadUserData = () => {
    if (typeof window === "undefined") return;
    const tabUserStr = sessionStorage.getItem("wsj_user");
    if (tabUserStr) {
      try {
        const parsed = JSON.parse(tabUserStr);
        if (parsed && (parsed.role?.toLowerCase() === "admin" || parsed.role?.toLowerCase() === "default admin")) {
          setCurrentUser(parsed);
          return;
        }
        if (parsed && parsed.role?.toLowerCase() === "writer") {
          router.push("/writer-dashboard");
          return;
        }
        if (parsed && parsed.role?.toLowerCase() === "reader") {
          router.push("/reader-dashboard");
          return;
        }
      } catch (e) {}
    }

    const adminUser = {
      full_name: "Admin User",
      email: "admin@gmail.com",
      role: "ADMIN",
      bio: "Senior System Administrator & Chief Editor",
      avatar_url: "",
    };

    setCurrentUser(adminUser);
  };

  // Load newsletter subscribers from storage & Express Backend API
  const loadSubscribersData = async () => {
    if (typeof window === "undefined") return;
    let localSubscribers: any[] = [];
    const stored = localStorage.getItem("wsj_newsletter_subscribers");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) localSubscribers = parsed;
      } catch (e) {}
    }

    try {
      const res = await fetch("http://localhost:5000/api/newsletter").catch(() => null);
      if (res && res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.subscribers)) {
          const map = new Map();
          localSubscribers.forEach((s) => map.set((typeof s === "string" ? s : s.email).toLowerCase(), s));
          data.subscribers.forEach((s: any) => {
            const email = (s.email || "").toLowerCase();
            if (email) {
              let nList = ["US", "WORLD", "BUSINESS"];
              if (Array.isArray(s.newsletters)) {
                nList = s.newsletters;
              } else if (typeof s.newsletters === "string") {
                try {
                  const parsed = JSON.parse(s.newsletters);
                  if (Array.isArray(parsed)) nList = parsed;
                  else if (s.newsletters.trim()) nList = [s.newsletters.trim()];
                } catch (e) {
                  if (s.newsletters.trim()) nList = [s.newsletters.trim()];
                }
              }

              map.set(email, {
                id: String(s.id || "sub_" + email),
                email: s.email,
                newsletters: nList,
                subscribedDate: s.subscribed_at ? new Date(s.subscribed_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : (s.subscribedDate || "Recent"),
              });
            }
          });
          const merged = Array.from(map.values());
          setSubscribers(merged);
          localStorage.setItem("wsj_newsletter_subscribers", JSON.stringify(merged));
          return;
        }
      }
    } catch (e) {}

    setSubscribers(localSubscribers);
  };

  // Helper to resolve unique, topic-specific thumbnails instead of duplicate fallback images
  const resolveArticleThumbnail = (p: any): string => {
    let thumb = p.thumbnail || p.coverImage || p.imageUrl || "";

    const isGeneric =
      !thumb ||
      thumb.includes("photo-1590283603385-17ffb3a7f29f") ||
      thumb.includes("hero-ai-software.jpg");

    if (isGeneric && p.bodyContent) {
      const match = p.bodyContent.match(/src=["']([^"']+)["']/);
      if (match && match[1] && !match[1].includes("photo-1590283603385-17ffb3a7f29f")) {
        return match[1];
      }
    }

    if (!isGeneric && thumb) {
      return thumb;
    }

    const DYNAMIC_CATEGORY_IMAGES: Record<string, string[]> = {
      ENTERTAINMENT: [
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?fm=webp&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?fm=webp&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?fm=webp&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fm=webp&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?fm=webp&fit=crop&w=800&q=80",
      ],
      SPORTS: [
        "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?fm=webp&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?fm=webp&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?fm=webp&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?fm=webp&fit=crop&w=800&q=80",
      ],
      BUSINESS: [
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?fm=webp&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1507679799987-c73779587ccf?fm=webp&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?fm=webp&fit=crop&w=800&q=80",
      ],
      TECH: [
        "https://images.unsplash.com/photo-1518770660439-4636190af475?fm=webp&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?fm=webp&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1531297484001-80022131f5a1?fm=webp&fit=crop&w=800&q=80",
      ],
      POLITICS: [
        "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?fm=webp&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?fm=webp&fit=crop&w=800&q=80",
      ],
      LIFESTYLE: [
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?fm=webp&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?fm=webp&fit=crop&w=800&q=80",
      ],
      GENERAL: [
        "https://images.unsplash.com/photo-1504711434969-e33886168f5c?fm=webp&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1495020689067-958852a7765e?fm=webp&fit=crop&w=800&q=80",
      ]
    };

    const categoryKey = (p.category || "GENERAL").toUpperCase();
    const pool = DYNAMIC_CATEGORY_IMAGES[categoryKey] || DYNAMIC_CATEGORY_IMAGES.GENERAL;
    const str = (p.id || p.title || "article") + "";
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % pool.length;
    return pool[index];
  };

  // Load submitted pending posts & published posts from storage & listen for live updates
  const loadPostsData = async () => {
    if (typeof window === "undefined") return;
    let parsedPosts: any[] = [];

    // 1. Load from localStorage
    try {
      const stored = localStorage.getItem("wsj_posts");
      if (stored) {
        const localArray = JSON.parse(stored);
        if (Array.isArray(localArray)) parsedPosts = [...localArray];
      }
    } catch (e) {}

    // 2. Fetch from Express Backend API for cross-browser sync
    try {
      const res = await fetch("http://localhost:5000/api/posts").catch(() => null);
      if (res && res.ok) {
        const data = await res.json();
        const remotePosts = Array.isArray(data) ? data : (data && Array.isArray(data.posts) ? data.posts : []);
        if (Array.isArray(remotePosts) && remotePosts.length > 0) {
          const serverIds = new Set(remotePosts.map((p: any) => String(p.id)));
          const unsavedLocalDrafts = parsedPosts.filter((p) => !serverIds.has(String(p.id)) && String(p.id).startsWith("post_"));
          parsedPosts = [...remotePosts, ...unsavedLocalDrafts];
          localStorage.setItem("wsj_posts", JSON.stringify(parsedPosts));
        }
      }
    } catch (e) {}

    if (parsedPosts.length === 0) {
      setProjects([]);
      setPublishedPosts([]);
      return;
    }

    try {
      parsedPosts.sort((a: any, b: any) => {
        const timeA = a.publishedAt || (a.id && !isNaN(Number(a.id)) ? Number(a.id) : 0);
        const timeB = b.publishedAt || (b.id && !isNaN(Number(b.id)) ? Number(b.id) : 0);
        return timeB - timeA;
      });

      // Resolve author name per account email strictly
      const resolveWriterAuthorName = (p: any) => {
        let profilesMap: Record<string, any> = {};
        if (typeof window !== "undefined") {
          try {
            profilesMap = JSON.parse(localStorage.getItem("wsj_users_by_email") || "{}");
          } catch (e) {}
        }

        const writerProfile = profilesMap["writer@gmail.com"] || {};
        const currentWriterName = writerProfile.full_name || writerProfile.name || "Writer User";

        const writer1Profile = profilesMap["writer1@gmail.com"] || {};
        const currentWriter1Name = writer1Profile.full_name || writer1Profile.name || "writer1";

        const email = (p.authorEmail || "").toLowerCase().trim();
        const rawAuthor = (p.author || "").trim();
        const rawAuthorLower = rawAuthor.toLowerCase();

        // 1. Explicit writer1@gmail.com email
        if (email === "writer1@gmail.com") {
          return currentWriter1Name;
        }

        // 2. Explicit writer@gmail.com email
        if (email === "writer@gmail.com") {
          return currentWriterName;
        }

        // 3. Other specific emails in profilesMap
        if (email && profilesMap[email]) {
          const u = profilesMap[email];
          if (u.full_name || u.name) return u.full_name || u.name;
        }

        // 4. Staff writers
        if (
          rawAuthorLower.includes("nivedita") ||
          rawAuthorLower.includes("ethan") ||
          rawAuthorLower.includes("samuel")
        ) {
          return rawAuthor;
        }

        // 5. Raw author text fallback for legacy posts
        if (rawAuthorLower === "writer1") {
          return currentWriter1Name;
        }

        return currentWriterName;
      };

      // Pending posts
      const pending = parsedPosts.filter(
        (p: any) =>
          p.status?.toLowerCase() === "pending review" ||
          p.status?.toLowerCase() === "pending"
      );

      if (pending.length > 0) {
        const mappedProjects: ProjectItem[] = pending.map((p: any) => {
          const thumb = resolveArticleThumbnail(p);
          let excerpt = p.subheadline || p.excerpt;
          if (!excerpt && p.bodyContent) {
            excerpt =
              p.bodyContent.replace(/<[^>]+>/g, "").slice(0, 150) + "...";
          }

          return {
            id: p.id,
            title: p.title,
            subheadline: p.subheadline || "",
            excerpt: excerpt || "Submitted article pending editor review.",
            bodyContent: p.bodyContent || "",
            readTime: p.readDuration || p.readTime || "5 min read",
            category: (p.category || "BUSINESS").toUpperCase(),
            subCategories: p.subCategories || [],
            tags: p.tags || [],
            isExclusive: p.isExclusive,
            cardSummary: p.cardSummary || "",
            focusKeyword: p.focusKeyword || "",
            seoDescription: p.seoDescription || "",
            seoTitle: p.seoTitle || "",
            author: resolveWriterAuthorName(p),
            submittedDate: p.date || p.submittedDate || "Aug 18, 2026",
            status: "PENDING",
            thumbnail: thumb,
          };
        });

        setProjects(mappedProjects);
      } else {
        setProjects([]);
      }

      // Published posts
      const published = parsedPosts.filter(
        (p: any) =>
          p.status?.toLowerCase() === "published" ||
          p.status?.toLowerCase() === "approved"
      );
      if (published.length > 0) {
        const mappedPubs: PublishedPostItem[] = published.map((p: any) => ({
          id: p.id,
          title: p.title,
          subheadline: p.subheadline || p.subtitle || "",
          cardSummary: p.cardSummary || p.seoDescription || "",
          bodyContent: p.bodyContent || "",
          excerpt:
            p.subheadline ||
            (p.bodyContent
              ? p.bodyContent.replace(/<[^>]+>/g, "").slice(0, 150) + "..."
              : ""),
          readTime: p.readDuration || "5 min read",
          category: (p.category || "BUSINESS").toUpperCase(),
          placement: "Main Grid",
          author: resolveWriterAuthorName(p),
          views: p.views || 0,
          comments: 0,
          thumbnail: resolveArticleThumbnail(p),
        }));

        setPublishedPosts(mappedPubs);
      } else {
        setPublishedPosts([]);
      }
    } catch (e) {
      console.error("Error parsing wsj_posts:", e);
    }
  };

  const generateArticleTextFile = (post: any): string => {
    const title = post.title?.trim() || "Untitled Article";
    const subheadline = post.subheadline?.trim() || post.subtitle?.trim() || post.excerpt?.trim() || "";
    const author = post.author?.trim() || "Unknown Author";
    const date = post.publishedAt
      ? (typeof post.publishedAt === "number" || !isNaN(Date.parse(post.publishedAt)) ? new Date(post.publishedAt).toISOString() : String(post.publishedAt))
      : (post.date || post.submittedDate || new Date().toISOString());
    const category = post.category?.trim() || "General";
    
    let rawImageUrl = post.thumbnail?.trim() || post.imageUrl?.trim() || post.coverImage?.trim() || "";
    if (rawImageUrl.includes("webp-proxy") && rawImageUrl.includes("url=")) {
      try {
        const searchStr = rawImageUrl.slice(rawImageUrl.indexOf("?"));
        const params = new URLSearchParams(searchStr);
        const targetUrl = params.get("url");
        if (targetUrl) {
          rawImageUrl = targetUrl;
        }
      } catch (e) {
        const match = rawImageUrl.match(/[?&]url=([^&]+)/);
        if (match && match[1]) {
          rawImageUrl = decodeURIComponent(match[1]);
        }
      }
    }
    const imageUrl = rawImageUrl;

    let rawBody = post.bodyContent || "";
    let plainContent = "";

    if (rawBody && typeof window !== "undefined") {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = rawBody;

      const blockNodes = tempDiv.querySelectorAll("p, h1, h2, h3, h4, h5, h6, blockquote, pre, figure, div");
      if (blockNodes.length > 0) {
        const textBlocks: string[] = [];
        blockNodes.forEach((node) => {
          if (node.tagName === "FIGURE") {
            const creditSpan = node.querySelector("span:last-child");
            let credit = creditSpan?.textContent?.trim() || "";
            if (credit && !credit.startsWith("(PHOTO:")) {
              credit = `(PHOTO: ${credit})`;
            }
            if (credit && !textBlocks.includes(credit)) textBlocks.push(credit);
          }

          const text = node.textContent?.trim();
          if (text && !textBlocks.includes(text)) {
            textBlocks.push(text);
          }
        });
        plainContent = textBlocks.join("\n\n");
      } else {
        plainContent = tempDiv.textContent?.trim() || "";
      }
    } else if (rawBody) {
      plainContent = rawBody.replace(/<[^>]+>/g, "\n\n").trim();
    }

    let summary = post.cardSummary?.trim() || post.seoDescription?.trim() || post.summary?.trim() || post.excerpt?.trim() || "";
    if (!summary && plainContent) {
      summary = plainContent.slice(0, 240).trim() + (plainContent.length > 240 ? "…" : "");
    }

    const border70 = "======================================================================";
    const divider70 = "----------------------------------------------------------------------";

    return `${border70}
TITLE: ${title}
SUBTITLE: ${subheadline}
AUTHOR: ${author}
DATE: ${date}
CATEGORY: ${category}
IMAGE URL: ${imageUrl}
${border70}

SUMMARY:
${summary}

${divider70}
CONTENT:
${plainContent}
${divider70}
`;
  };

  const handleDownloadArticlesZip = async () => {
    let fullPosts: any[] = [];
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("wsj_posts");
        if (stored) {
          const parsed = JSON.parse(stored);
          fullPosts = parsed.filter((p: any) => {
            const st = (p.status || "").toLowerCase();
            return st === "published" || st === "approved";
          });
        }
      } catch (e) {}
    }

    try {
      const res = await fetch("http://localhost:5000/api/posts").catch(() => null);
      if (res && res.ok) {
        const data = await res.json();
        const remotePosts = Array.isArray(data) ? data : (data && Array.isArray(data.posts) ? data.posts : []);
        if (Array.isArray(remotePosts) && remotePosts.length > 0) {
          const postsMap = new Map();
          fullPosts.forEach((p) => postsMap.set(p.id, p));
          remotePosts.forEach((p: any) => {
            const st = (p.status || "").toLowerCase();
            if (st === "published" || st === "approved") {
              postsMap.set(p.id, p);
            }
          });
          fullPosts = Array.from(postsMap.values());
        }
      }
    } catch (e) {}

    if (fullPosts.length === 0 && publishedPosts.length > 0) {
      fullPosts = publishedPosts.map((p) => ({
        id: p.id,
        title: p.title,
        subheadline: p.subheadline || p.excerpt,
        cardSummary: p.cardSummary || "",
        author: p.author,
        date: new Date().toISOString(),
        category: p.category,
        thumbnail: p.thumbnail,
        bodyContent: p.bodyContent || `<p>${p.excerpt}</p>`,
      }));
    }

    if (fullPosts.length === 0) {
      setAdminNoticePopup("No published articles found to backup.");
      return;
    }

    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();
    const usedFilenames = new Map<string, number>();

    fullPosts.forEach((post, index) => {
      const fileContent = generateArticleTextFile(post);
      const cleanTitle = (post.title || `Article_${index + 1}`)
        .replace(/[^a-zA-Z0-9\s_-]/g, "")
        .trim()
        .replace(/\s+/g, "_")
        .slice(0, 60);

      const baseName = cleanTitle || `article_${index + 1}`;
      const lowerBase = baseName.toLowerCase();
      let filename = `${baseName}.txt`;

      if (usedFilenames.has(lowerBase)) {
        const count = usedFilenames.get(lowerBase)! + 1;
        usedFilenames.set(lowerBase, count);
        filename = `${baseName}_${count}.txt`;
      } else {
        usedFilenames.set(lowerBase, 1);
      }

      zip.file(filename, fileContent);
    });

    const zipBlob = await zip.generateAsync({ type: "blob" });
    const downloadUrl = URL.createObjectURL(zipBlob);

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `WSJ_Articles_Backup_${new Date().toISOString().slice(0, 10)}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(downloadUrl);
  };

  // Handlers for Manage Ads Configuration
  const handleToggleAdSlot = (id: string) => {
    setAdSlots((prev) => {
      const updated = prev.map((slot) => (slot.id === id ? { ...slot, active: !slot.active } : slot));
      if (typeof window !== "undefined") {
        localStorage.setItem("wsj_ad_slots_config", JSON.stringify(updated));
      }
      return updated;
    });
  };

  const handleUpdateAdSlot = (id: string, key: keyof AdSlotConfig, value: any) => {
    setAdSlots((prev) => {
      const updated = prev.map((slot) => (slot.id === id ? { ...slot, [key]: value } : slot));
      if (typeof window !== "undefined") {
        localStorage.setItem("wsj_ad_slots_config", JSON.stringify(updated));
      }
      return updated;
    });
  };

  const cropImageToSlotDimension = (
    base64Src: string,
    dimensionStr: string
  ): Promise<string> => {
    return new Promise((resolve) => {
      try {
        if (!dimensionStr || !dimensionStr.includes("x") || !base64Src) {
          return resolve(base64Src);
        }
        const parts = dimensionStr.toLowerCase().split("x");
        const targetW = parseInt(parts[0], 10);
        const targetH = parseInt(parts[1], 10);
        if (!targetW || !targetH || isNaN(targetW) || isNaN(targetH)) {
          return resolve(base64Src);
        }

        const img = new Image();
        if (base64Src.startsWith("http://") || base64Src.startsWith("https://")) {
          img.crossOrigin = "anonymous";
        }
        img.onload = () => {
          try {
            const canvas = document.createElement("canvas");
            canvas.width = targetW;
            canvas.height = targetH;
            const ctx = canvas.getContext("2d");
            if (!ctx) return resolve(base64Src);

            const srcW = img.width;
            const srcH = img.height;
            if (!srcW || !srcH) return resolve(base64Src);

            const targetAspect = targetW / targetH;
            const srcAspect = srcW / srcH;

            let drawW = srcW;
            let drawH = srcH;
            let srcX = 0;
            let srcY = 0;

            if (srcAspect > targetAspect) {
              drawW = srcH * targetAspect;
              srcX = (srcW - drawW) / 2;
            } else {
              drawH = srcW / targetAspect;
              srcY = (srcH - drawH) / 2;
            }

            ctx.drawImage(img, srcX, srcY, drawW, drawH, 0, 0, targetW, targetH);
            const croppedBase64 = canvas.toDataURL("image/webp", 0.92);
            resolve(croppedBase64);
          } catch (err) {
            console.warn("Canvas crop fallback:", err);
            resolve(base64Src);
          }
        };
        img.onerror = () => {
          resolve(base64Src);
        };
        img.src = base64Src;
      } catch (err) {
        console.warn("cropImageToSlotDimension outer fallback:", err);
        resolve(base64Src);
      }
    });
  };

  const handleUploadAdImage = async (id: string, file: File) => {
    try {
      if (!file) return;
      handleUpdateAdSlot(id, "fileName", file.name);
      const targetSlot = adSlots.find((s) => s.id === id);
      const dimensionStr = targetSlot?.dimension || "";

      const reader = new FileReader();
      reader.onload = async (evt) => {
        try {
          const rawBase64 = evt.target?.result as string;
          if (!rawBase64) return;

          const img = new Image();
          img.onload = async () => {
            const uploadedW = img.width;
            const uploadedH = img.height;

            if (dimensionStr && dimensionStr.includes("x")) {
              const [wStr, hStr] = dimensionStr.toLowerCase().split("x");
              const targetW = parseInt(wStr, 10);
              const targetH = parseInt(hStr, 10);

              if (targetW && targetH && (uploadedW !== targetW || uploadedH !== targetH)) {
                setAdDimensionMismatchPopup({
                  uploadedDim: `${uploadedW} × ${uploadedH}`,
                  slotDim: `${targetW} × ${targetH}`,
                  slotName: targetSlot?.slotName || "Ad Slot",
                });
              }
            }

            handleUpdateAdSlot(id, "imageUrl", rawBase64);

            try {
              const res = await fetch("http://localhost:5000/api/upload", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  imageBase64: rawBase64,
                  folder: "ads",
                  fileName: `ad_${id}_${Date.now()}.webp`,
                }),
              });
              const data = await res.json();
              if (data && data.success && data.url) {
                handleUpdateAdSlot(id, "imageUrl", data.url);
              }
            } catch (err) {
              console.warn("Backblaze B2 ad upload notice:", err);
            }
          };
          img.src = rawBase64;
        } catch (err) {
          console.error("Ad upload processing error:", err);
        }
      };
      reader.onerror = (err) => {
        console.error("FileReader error reading ad image file:", err);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("handleUploadAdImage outer error:", err);
    }
  };

  const handleSaveAdConfig = async (id: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("wsj_ad_slots_config", JSON.stringify(adSlots));
      window.dispatchEvent(new Event("wsj_ads_updated"));

      try {
        await fetch("http://localhost:5000/api/ads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slots: adSlots }),
        });
      } catch (e) {
        console.warn("API ad save notice:", e);
      }

      const targetSlot = adSlots.find((s) => s.id === id);
      const slotName = targetSlot ? targetSlot.slotName : "Ad";
      setAdSavedPopup(`${slotName} configuration saved successfully!`);
    }
  };

  useEffect(() => {
    const fetchAdsFromApi = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/ads");
        const data = await res.json();
        if (data.success && data.slots && data.slots.length > 0) {
          const normalized = normalizeAdSlots(data.slots);
          setAdSlots(normalized);
          localStorage.setItem("wsj_ad_slots_config", JSON.stringify(normalized));
        }
      } catch (e) {}
    };
    fetchAdsFromApi();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      if (tabParam) {
        setActiveTab(tabParam as any);
      }
    }
    loadUserData();
    loadSubscribersData();
    loadPostsData();
    fetchUsers();
    fetchContactSubmissions();
    fetchAdvertiseLeads();
    window.addEventListener("wsj_user_updated", loadUserData);
    window.addEventListener("wsj_users_updated", fetchUsers);
    window.addEventListener("wsj_newsletter_updated", loadSubscribersData);
    window.addEventListener("wsj_posts_updated", loadPostsData);
    return () => {
      window.removeEventListener("wsj_user_updated", loadUserData);
      window.removeEventListener("wsj_users_updated", fetchUsers);
      window.removeEventListener(
        "wsj_newsletter_updated",
        loadSubscribersData
      );
      window.removeEventListener("wsj_posts_updated", loadPostsData);
    };
  }, [router]);

  // Click outside to close profile dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = () => {
    if (typeof window !== "undefined") {
      sessionStorage.clear();
      localStorage.removeItem("wsj_user");
      localStorage.removeItem("wsj_token");
      localStorage.removeItem("wsj_admin_user");
      localStorage.removeItem("wsj_session_active");
      window.dispatchEvent(new Event("wsj_user_updated"));
      window.dispatchEvent(new Event("wsj_logout"));
      window.location.href = "/";
    }
  };

  if (!currentUser) {
    return null;
  }

  // Derive admin initials & name
  const adminName = currentUser.full_name || "Admin User";
  const adminEmail = currentUser.email || "admin@gmail.com";

  const getInitials = (name: string) => {
    if (!name) return "AU";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };
  const adminInitials = getInitials(adminName);

  const pendingCount = projects.filter((p) => p.status === "PENDING").length;

  // Handlers for Newsletter Subscribers
  const handleRemoveSub = (id: string) => {
    const targetSub = subscribers.find((s) => s.id === id);
    const targetEmail = targetSub?.email;

    if (targetEmail) {
      fetch("http://localhost:5000/api/newsletter", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: targetEmail }),
      }).catch((e) => console.error("Error deleting subscriber from Express API:", e));
    }

    setSubscribers((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "wsj_newsletter_subscribers",
          JSON.stringify(updated)
        );
      }
      return updated;
    });
    setSelectedSubIds((prev) => prev.filter((i) => i !== id));
  };

  const handleToggleSelectAllSubs = () => {
    if (selectedSubIds.length === subscribers.length) {
      setSelectedSubIds([]);
    } else {
      setSelectedSubIds(subscribers.map((s) => s.id));
    }
  };

  const handleToggleSelectSub = (id: string) => {
    if (selectedSubIds.includes(id)) {
      setSelectedSubIds(selectedSubIds.filter((i) => i !== id));
    } else {
      setSelectedSubIds([...selectedSubIds, id]);
    }
  };

  const handleExportCSV = () => {
    const header = "id,email,newsletters,subscribedAt";
    const rows = subscribers.map((s) => {
      let datePart = s.subscribedDate;
      const parts = s.subscribedDate.replace(",", "").trim().split(/\s+/);
      if (parts.length === 3) {
        // e.g. ["Aug", "17", "2026"] -> "17-Aug,2026"
        datePart = `${parts[1]}-${parts[0]},${parts[2]}`;
      } else if (parts.length === 2 && parts[0].includes("-")) {
        // e.g. ["17-Aug", "2026"] -> "17-Aug,2026"
        datePart = `${parts[0]},${parts[1]}`;
      }
      const nStr = Array.isArray(s.newsletters) ? s.newsletters.join("|") : String(s.newsletters);
      return `${s.id},${s.email},"${nStr}",${datePart}`;
    });
    const csvText = [header, ...rows].join("\n");
    const blob = new Blob([csvText], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "newsletter_subscribers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const confirmRemoveSub = (sub: NewsletterSub) => {
    setDeleteConfirmModal({
      isOpen: true,
      title: "Remove Subscriber",
      message: `Are you sure you want to remove subscriber "${sub.email}" from the newsletter list?`,
      confirmText: "Remove Subscriber",
      onConfirm: () => {
        handleRemoveSub(sub.id);
        setDeleteConfirmModal(null);
      },
    });
  };

  const confirmDeletePost = (post: PublishedPostItem) => {
    setDeleteConfirmModal({
      isOpen: true,
      title: "Delete Published Article",
      message: `Are you sure you want to delete article "${post.title}"? This cannot be undone.`,
      confirmText: "Delete Article",
      onConfirm: () => {
        handleDeletePost(post.id);
        setDeleteConfirmModal(null);
      },
    });
  };

  const confirmDeleteContactSubmission = (item: ContactSubmission) => {
    setDeleteConfirmModal({
      isOpen: true,
      title: "Delete Contact Submission",
      message: `Are you sure you want to delete the contact submission from "${item.name || item.email}"?`,
      confirmText: "Delete Submission",
      onConfirm: () => {
        handleDeleteContactSubmission(item.id);
        setSelectedContactModal(null);
        setDeleteConfirmModal(null);
      },
    });
  };

  const confirmDeleteAdvertiseLead = (item: AdvertiseLead) => {
    setDeleteConfirmModal({
      isOpen: true,
      title: "Delete Advertising Lead",
      message: `Are you sure you want to delete the advertising lead for "${item.company || item.name || item.email}"?`,
      confirmText: "Delete Lead",
      onConfirm: () => {
        handleDeleteAdvertiseLead(item.id);
        setSelectedAdvertiseModal(null);
        setDeleteConfirmModal(null);
      },
    });
  };

  // Handlers for Published Posts
  const handleDeletePost = async (id: string) => {
    const targetId = String(id);
    setPublishedPosts((prev) => prev.filter((p) => String(p.id) !== targetId));

    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("wsj_posts");
        const allPosts: any[] = stored ? JSON.parse(stored) : [];
        const newAll = allPosts.filter((p) => String(p.id) !== targetId);
        localStorage.setItem("wsj_posts", JSON.stringify(newAll));
        window.dispatchEvent(new Event("wsj_posts_updated"));

        await fetch(`http://localhost:5000/api/posts/${encodeURIComponent(targetId)}`, {
          method: "DELETE",
        }).catch(() => null);
      } catch (err) {}
    }
  };

  const filteredPublishedPosts = publishedPosts.filter((post) => {
    const postCat = post.category ? post.category.toLowerCase().trim() : "";
    const filterCat = pubCategoryFilter.toLowerCase().trim();

    const matchesCategory =
      pubCategoryFilter === "All Categories" ||
      postCat === filterCat ||
      (filterCat === "u.s." && (postCat === "us" || postCat === "u.s.")) ||
      (filterCat === "us" && (postCat === "us" || postCat === "u.s.")) ||
      (filterCat === "tech" && (postCat === "technology" || postCat === "tech")) ||
      (filterCat === "technology" && (postCat === "technology" || postCat === "tech")) ||
      (filterCat === "markets & finance" && (postCat === "markets" || postCat === "markets & finance"));
    const matchesPlacement =
      pubPlacementFilter === "All Placements" ||
      (post.placement &&
        post.placement.toLowerCase() === pubPlacementFilter.toLowerCase());
    const matchesSearch =
      !pubSearchQuery.trim() ||
      post.title.toLowerCase().includes(pubSearchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(pubSearchQuery.toLowerCase());

    return matchesCategory && matchesPlacement && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col lg:flex-row font-sans text-[#333333] relative">
      {/* Mobile Drawer Backdrop Overlay */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden cursor-pointer"
        />
      )}

      {/* ================================================================= */}
      {/* LEFT SIDEBAR (Light, Elegant Neutral Grey Navigation Bar)          */}
      {/* ================================================================= */}
      <aside
        className={`fixed lg:sticky top-0 bottom-0 left-0 z-50 lg:z-20 w-64 lg:w-72 bg-[#4b5563] text-white flex flex-col justify-between shrink-0 h-screen shadow-lg transition-transform duration-200 ease-in-out ${
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div>
          {/* Top WSJ Logo / Masthead Header */}
          <div className="pt-6 pb-5 px-6 border-b border-[#6b7280]/60 text-center flex items-center justify-between lg:justify-center">
            <Link href="/admin-dashboard" className="inline-block hover:opacity-90 transition-opacity">
              <img
                src="/images/design-reference/Times Chicago.svg"
                alt="Times Chicago"
                className="h-6 sm:h-7 w-auto object-contain mx-auto brightness-0 invert block"
              />
            </Link>
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="lg:hidden text-[#e5e7eb] hover:text-white p-1"
              title="Close Menu"
            >
              ✕
            </button>
          </div>

          {/* Back to Home Navigation Item */}
          <div className="px-4 pt-5 pb-3">
            <Link
              href="/"
              className="flex items-center space-x-2.5 px-3.5 py-2 text-xs font-medium text-[#e5e7eb] hover:text-white hover:bg-[#6b7280]/60 rounded-xl transition-all cursor-pointer group"
            >
              <svg
                width={16}
                height={16}
                style={{ width: "16px", height: "16px", minWidth: "16px", minHeight: "16px" }}
                className="shrink-0 text-[#e5e7eb] group-hover:text-white transition-colors"
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

          {/* Sidebar Menu Options (Lighter Grey Palette) */}
          <nav className="px-4 space-y-1.5 mt-1">
            {/* 1. Overview */}
            <button
              onClick={() => {
                setActiveTab("Overview");
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "Overview"
                  ? "bg-[#6b7280] text-white border border-[#9ca3af]/40 shadow-sm"
                  : "text-[#e5e7eb] hover:bg-[#6b7280]/40 hover:text-white"
              }`}
            >
              <svg
                width={18}
                height={18}
                style={{ width: "18px", height: "18px", minWidth: "18px", minHeight: "18px" }}
                className="shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
              </svg>
              <span>Overview</span>
            </button>

            {/* 2. Newsletter */}
            <button
              onClick={() => {
                setActiveTab("Newsletter");
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "Newsletter"
                  ? "bg-[#6b7280] text-white border border-[#9ca3af]/40 shadow-sm"
                  : "text-[#e5e7eb] hover:bg-[#6b7280]/40 hover:text-white"
              }`}
            >
              <svg
                width={18}
                height={18}
                style={{ width: "18px", height: "18px", minWidth: "18px", minHeight: "18px" }}
                className="shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              <span>Newsletter</span>
            </button>

            {/* 3. Published Posts */}
            <button
              onClick={() => {
                setActiveTab("Published Posts");
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "Published Posts"
                  ? "bg-[#6b7280] text-white border border-[#9ca3af]/40 shadow-sm"
                  : "text-[#e5e7eb] hover:bg-[#6b7280]/40 hover:text-white"
              }`}
            >
              <svg
                width={18}
                height={18}
                style={{ width: "18px", height: "18px", minWidth: "18px", minHeight: "18px" }}
                className="shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <span>Published Posts</span>
            </button>

            {/* 4. Users */}
            <button
              onClick={() => {
                setActiveTab("Users");
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "Users"
                  ? "bg-[#6b7280] text-white border border-[#9ca3af]/40 shadow-sm"
                  : "text-[#e5e7eb] hover:bg-[#6b7280]/40 hover:text-white"
              }`}
            >
              <svg
                width={18}
                height={18}
                style={{ width: "18px", height: "18px", minWidth: "18px", minHeight: "18px" }}
                className="shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
              <span>Users</span>
            </button>

            {/* 5. Manage Ads */}
            <button
              onClick={() => {
                setActiveTab("Manage Ads");
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "Manage Ads"
                  ? "bg-[#6b7280] text-white border border-[#9ca3af]/40 shadow-sm"
                  : "text-[#e5e7eb] hover:bg-[#6b7280]/40 hover:text-white"
              }`}
            >
              <svg
                width={18}
                height={18}
                style={{ width: "18px", height: "18px", minWidth: "18px", minHeight: "18px" }}
                className="shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.38-.09-2.07-.09-1.99 0-3.95.23-5.85.67V6.75c1.9-.44 3.86-.67 5.85-.67 1.99 0 3.95.23 5.85.67v8.94c-1.25-.29-2.54-.47-3.84-.53zM10.34 15.84v4.91m0 0a2.25 2.25 0 002.25-2.25v-2.66" />
              </svg>
              <span>Manage Ads</span>
            </button>

            {/* 6. Contact Us Submissions */}
            <button
              onClick={() => {
                setActiveTab("Contact Us Submissions");
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "Contact Us Submissions"
                  ? "bg-[#6b7280] text-white border border-[#9ca3af]/40 shadow-sm"
                  : "text-[#e5e7eb] hover:bg-[#6b7280]/40 hover:text-white"
              }`}
            >
              <svg
                width={18}
                height={18}
                style={{ width: "18px", height: "18px", minWidth: "18px", minHeight: "18px" }}
                className="shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3.75h9m-9 3.75h5.25M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
              </svg>
              <span>Contact Us Submissions</span>
            </button>

            {/* 7. Advertise Leads */}
            <button
              onClick={() => {
                setActiveTab("Advertise Leads");
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "Advertise Leads"
                  ? "bg-[#6b7280] text-white border border-[#9ca3af]/40 shadow-sm"
                  : "text-[#e5e7eb] hover:bg-[#6b7280]/40 hover:text-white"
              }`}
            >
              <svg
                width={18}
                height={18}
                style={{ width: "18px", height: "18px", minWidth: "18px", minHeight: "18px" }}
                className="shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5h16.5a1.5 1.5 0 011.5 1.5v9.75a1.5 1.5 0 01-1.5 1.5H3.75a1.5 1.5 0 01-1.5-1.5V6a1.5 1.5 0 011.5-1.5z" />
              </svg>
              <span>Advertise Leads</span>
            </button>

            {/* 8. Database Backups */}
            <button
              onClick={() => {
                setActiveTab("Database Backups");
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "Database Backups"
                  ? "bg-[#6b7280] text-white border border-[#9ca3af]/40 shadow-sm"
                  : "text-[#e5e7eb] hover:bg-[#6b7280]/40 hover:text-white"
              }`}
            >
              <svg
                width={18}
                height={18}
                style={{ width: "18px", height: "18px", minWidth: "18px", minHeight: "18px" }}
                className="shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 5.625c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
              </svg>
              <span>Database Backups</span>
            </button>

            {/* 9. Shorts & Reels */}
            <button
              onClick={() => {
                setActiveTab("Shorts & Reels");
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "Shorts & Reels"
                  ? "bg-[#6b7280] text-white border border-[#9ca3af]/40 shadow-sm"
                  : "text-[#e5e7eb] hover:bg-[#6b7280]/40 hover:text-white"
              }`}
            >
              <svg
                width={18}
                height={18}
                style={{ width: "18px", height: "18px", minWidth: "18px", minHeight: "18px" }}
                className="shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
              </svg>
              <span>Shorts & Reels</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer Copyright */}
        <div className="p-4 border-t border-[#6b7280]/60 text-[10px] text-[#e5e7eb] text-center font-mono">
          © 2026 Dow Jones & Company, Inc.
        </div>
      </aside>

      {/* ================================================================= */}
      {/* RIGHT MAIN WORKSPACE CONTENT AREA                                 */}
      {/* ================================================================= */}
      <main className="flex-1 p-3.5 sm:p-6 lg:p-10 max-w-7xl w-full min-w-0 overflow-y-auto">
        {/* Top Workspace Header Bar */}
        <div className="flex items-center justify-between mb-6 sm:mb-8 pb-2 gap-3">
          {/* Left Title & Welcome Subtitle */}
          <div className="flex items-center space-x-3">
            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              className="lg:hidden p-2 text-[#4b5563] hover:text-black hover:bg-slate-100 rounded-xl transition-colors cursor-pointer border border-slate-200 shrink-0"
              title="Toggle Sidebar Menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#374151] tracking-tight leading-none">
                My Workspace
              </h1>
              <p className="text-xs sm:text-sm text-[#6b7280] font-medium mt-1">
                Welcome back, {adminName}!
              </p>
            </div>
          </div>

          {/* Right Profile Icon Dropdown Card Button */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center space-x-2.5 bg-white hover:bg-slate-50 border border-slate-300 rounded-2xl sm:rounded-3xl px-3 py-1.5 transition-all cursor-pointer shadow-2xs"
            >
              {currentUser.avatar_url ? (
                <img
                  src={currentUser.avatar_url}
                  alt={adminName}
                  className="w-8 h-8 rounded-xl object-cover shadow-2xs shrink-0 border border-slate-200"
                />
              ) : (
                <div className="w-8 h-8 rounded-xl bg-[#ea580c] text-white flex items-center justify-center font-extrabold text-xs shrink-0 shadow-2xs">
                  {adminInitials}
                </div>
              )}
              <span className="font-bold text-sm text-[#0f172a] tracking-tight">
                {adminName}
              </span>
              <svg
                width={14}
                height={14}
                style={{ width: "14px", height: "14px", minWidth: "14px", minHeight: "14px" }}
                className={`shrink-0 text-[#64748b] transition-transform duration-200 ${
                  showProfileDropdown ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
              </svg>
            </button>

            {/* Profile Dropdown Card matching uploaded design */}
            {showProfileDropdown && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-slate-200 shadow-xl rounded-2xl p-4 z-50 animate-in zoom-in-95 duration-100 font-sans text-left">
                {/* User Info Header */}
                <div className="flex items-center space-x-3">
                  {currentUser.avatar_url ? (
                    <img
                      src={currentUser.avatar_url}
                      alt={adminName}
                      className="w-10 h-10 rounded-xl object-cover shadow-2xs shrink-0 border border-slate-200"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-[#ea580c] text-white flex items-center justify-center font-extrabold text-sm shrink-0 shadow-2xs">
                      {adminInitials}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-base text-[#0f172a] truncate">
                      {adminName}
                    </div>
                    <div className="font-mono text-xs text-[#64748b] mt-0.5 tracking-tight truncate">
                      {adminEmail}
                    </div>
                    <div className="mt-1.5">
                      <span className="bg-[#f1f5f9] text-[#334155] font-mono text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wider inline-block">
                        ADMIN
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-[#f1f5f9] my-3" />

                {/* Profile Settings Option */}
                <button
                  onClick={() => {
                    setShowProfileDropdown(false);
                    setShowProfileModal(true);
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-slate-50 rounded-xl text-sm font-semibold text-[#1e293b] transition-colors cursor-pointer text-left"
                >
                  <svg
                    width={18}
                    height={18}
                    className="shrink-0 text-[#64748b]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                  <span>Profile Settings</span>
                </button>

                <div className="border-t border-[#f1f5f9] my-2" />

                {/* Log Out Option */}
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-red-50 text-red-600 rounded-xl text-sm font-bold transition-colors cursor-pointer text-left"
                >
                  <svg
                    width={18}
                    height={18}
                    className="shrink-0 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12" />
                  </svg>
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Top 3 Stat Metric Cards (3 Horizontal Aligning Boxes matching reference site) */}
        <div className="grid grid-cols-3 gap-2 xs:gap-3.5 sm:gap-6 mb-5 sm:mb-6">
          {/* Card 1: ACTIVE REVIEWS (Purple accent line & container) */}
          <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-[#e5e7eb] shadow-2xs relative overflow-hidden flex flex-col justify-between border-l-4 border-l-[#8b5cf6]">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[8.5px] xs:text-[10px] sm:text-[11px] font-bold text-[#6b7280] tracking-wider sm:tracking-widest uppercase font-mono truncate">
                ACTIVE REVIEWS
              </span>
              <div className="w-6 h-6 xs:w-8 xs:h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-[#f3e8ff] text-[#8b5cf6] flex items-center justify-center shrink-0">
                <svg
                  className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-4.5 sm:h-4.5 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
            </div>
            <div className="mt-1.5 sm:mt-2.5">
              <span className="text-xl xs:text-2xl sm:text-3xl font-extrabold text-[#111827] leading-none">
                {pendingCount}
              </span>
            </div>
          </div>

          {/* Card 2: COMPLETED RELEASES (Teal/Green accent line & container) */}
          <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-[#e5e7eb] shadow-2xs relative overflow-hidden flex flex-col justify-between border-l-4 border-l-[#10b981]">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[8.5px] xs:text-[10px] sm:text-[11px] font-bold text-[#6b7280] tracking-wider sm:tracking-widest uppercase font-mono truncate">
                COMPLETED RELEASES
              </span>
              <div className="w-6 h-6 xs:w-8 xs:h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-[#d1fae5] text-[#10b981] flex items-center justify-center shrink-0">
                <svg
                  className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-4.5 sm:h-4.5 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-1.5 sm:mt-2.5">
              <span className="text-xl xs:text-2xl sm:text-3xl font-extrabold text-[#111827] leading-none">
                {publishedPosts.length}
              </span>
            </div>
          </div>

          {/* Card 3: NEWSLETTER SUBS (Orange accent line & container) */}
          <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-[#e5e7eb] shadow-2xs relative overflow-hidden flex flex-col justify-between border-l-4 border-l-[#ea580c]">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[8.5px] xs:text-[10px] sm:text-[11px] font-bold text-[#6b7280] tracking-wider sm:tracking-widest uppercase font-mono truncate">
                NEWSLETTER SUBS
              </span>
              <div className="w-6 h-6 xs:w-8 xs:h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-[#ffedd5] text-[#ea580c] flex items-center justify-center shrink-0">
                <svg
                  className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-4.5 sm:h-4.5 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
            </div>
            <div className="mt-1.5 sm:mt-2.5">
              <span className="text-xl xs:text-2xl sm:text-3xl font-extrabold text-[#111827] leading-none">
                {subscribers.length}
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Section Content based on Active Tab */}
        {activeTab === "Overview" ? (
          /* ============================================================= */
          /* MAIN SECTION: Recent Projects (Pending Review)               */
          /* ============================================================= */
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-[#e5e7eb] shadow-2xs">
            <div className="flex items-center justify-between mb-4 pb-1">
              <h2 className="text-xl sm:text-2xl font-bold text-[#111111] tracking-tight">
                Recent Projects (Pending Review)
              </h2>
              <span className="bg-[#f3f4f6] text-[#4b5563] text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-[#d1d5db] font-mono">
                Pending Count: {pendingCount}
              </span>
            </div>

            {projects.length === 0 ? (
              <div className="py-12 text-center text-gray-500 font-sans border-t border-[#f3f4f6]">
                <svg
                  className="w-10 h-10 text-gray-300 mx-auto mb-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                  />
                </svg>
                <p className="text-xs font-bold text-[#374151]">No pending articles found</p>
                <p className="text-[11px] text-[#6b7280] mt-0.5">
                  Articles submitted by writers for review will automatically appear here.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                  <table className="w-full min-w-[720px] text-left font-sans border-collapse">
                    <thead>
                      <tr className="border-b border-[#e5e7eb] text-[9.5px] font-mono font-bold text-[#9ca3af] uppercase tracking-wider">
                        <th className="pb-2.5 pr-4 font-bold min-w-[260px] sm:min-w-[300px]">ARTICLE DETAILS</th>
                        <th className="pb-2.5 px-3 font-bold whitespace-nowrap">CATEGORY</th>
                        <th className="pb-2.5 px-3 font-bold whitespace-nowrap">AUTHOR</th>
                        <th className="pb-2.5 px-3 font-bold whitespace-nowrap">SUBMITTED DATE</th>
                        <th className="pb-2.5 px-3 font-bold whitespace-nowrap">STATUS</th>
                        <th className="pb-2.5 pl-3 text-right whitespace-nowrap">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f3f4f6]">
                      {projects.map((proj) => (
                        <tr key={proj.id} className="hover:bg-[#f9fafb] transition-colors">
                          <td className="py-2.5 sm:py-3 pr-4 text-left">
                            <div className="flex items-center space-x-3 max-w-lg">
                              <img
                                src={proj.thumbnail}
                                alt={proj.title}
                                className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover shrink-0 border border-[#e5e7eb] shadow-2xs"
                              />
                              <div className="min-w-0 flex-1">
                                <h3 className="font-bold text-xs sm:text-[13px] text-[#111827] leading-snug line-clamp-1">
                                  {proj.title}
                                </h3>
                                <p className="text-[11px] text-[#6b7280] mt-0.5 line-clamp-1 leading-snug">
                                  {proj.excerpt}
                                </p>
                                <span className="inline-block text-[10px] font-mono text-[#9ca3af] mt-0.5 font-normal">
                                  {proj.readTime}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-2.5 sm:py-3 px-3 whitespace-nowrap">
                            <span className="bg-[#f3f4f6] text-[#4b5563] border border-[#d1d5db] text-[9.5px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block">
                              {proj.category}
                            </span>
                          </td>
                          <td className="py-2.5 sm:py-3 px-3 text-xs font-semibold text-[#374151] whitespace-nowrap">
                            {proj.author}
                          </td>
                          <td className="py-2.5 sm:py-3 px-3 text-xs font-mono text-[#6b7280] whitespace-nowrap">
                            {proj.submittedDate}
                          </td>
                          <td className="py-2.5 sm:py-3 px-3 whitespace-nowrap">
                            <span className="bg-[#f3f4f6] text-[#4b5563] border border-[#d1d5db] text-[9.5px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block">
                              {proj.status}
                            </span>
                          </td>
                          <td className="py-2.5 sm:py-3 pl-3 text-right whitespace-nowrap">
                            <button
                              onClick={() =>
                                router.push(`/admin-dashboard/review-post?id=${encodeURIComponent(proj.id)}`)
                              }
                              className="bg-[#4b5563] hover:bg-[#374151] text-white font-extrabold text-[11px] uppercase tracking-wider px-4 py-1.5 rounded-md transition-all cursor-pointer shadow-2xs"
                            >
                              OPEN
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
            )}
          </div>
        ) : activeTab === "Newsletter" ? (
          /* ============================================================= */
          /* NEWSLETTER SUBSCRIBERS VIEW                                   */
          /* ============================================================= */
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e5e7eb] shadow-2xs">
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#f3f4f6]">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#111111] tracking-tight">
                  Newsletter Subscribers
                </h2>
                <p className="text-xs text-[#6b7280] font-mono mt-1">
                  Emails collected from the Newsletter signup page.
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={handleExportCSV}
                  className="flex items-center space-x-2 bg-white hover:bg-[#f3f4f6] border border-[#6b7280] text-[#374151] text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer shadow-2xs"
                >
                  <svg
                    width={14}
                    height={14}
                    style={{ width: "14px", height: "14px", minWidth: "14px", minHeight: "14px" }}
                    className="shrink-0 text-[#374151]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  <span>EXPORT CSV</span>
                </button>
                <span className="bg-[#f3f4f6] text-[#4b5563] text-xs font-semibold px-3 py-2 rounded-xl border border-[#d1d5db] font-mono">
                  Total: {subscribers.length}
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-left font-sans border-collapse">
                <thead>
                  <tr className="border-b border-[#e5e7eb] text-[10px] font-mono font-bold text-[#6b7280] uppercase tracking-wider">
                    <th className="py-3 px-3 w-10">
                      <input
                        type="checkbox"
                        checked={selectedSubIds.length === subscribers.length && subscribers.length > 0}
                        onChange={handleToggleSelectAllSubs}
                        className="rounded-md border-gray-400 text-gray-700 focus:ring-gray-700 cursor-pointer"
                      />
                    </th>
                    <th className="py-3 px-4 font-bold min-w-[200px]">EMAIL</th>
                    <th className="py-3 px-4 font-bold min-w-[240px] sm:min-w-[280px]">NEWSLETTERS</th>
                    <th className="py-3 px-4 font-bold whitespace-nowrap">SUBSCRIBED</th>
                    <th className="py-3 pl-4 pr-3 font-bold text-right whitespace-nowrap">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f3f4f6]">
                  {subscribers.map((sub) => (
                    <tr key={sub.id} className="hover:bg-[#f9fafb] transition-colors">
                      <td className="py-4 px-3">
                        <input
                          type="checkbox"
                          checked={selectedSubIds.includes(sub.id)}
                          onChange={() => handleToggleSelectSub(sub.id)}
                          className="rounded-md border-gray-400 text-gray-700 focus:ring-gray-700 cursor-pointer"
                        />
                      </td>

                      <td className="py-4 px-4 font-bold text-xs sm:text-sm text-[#374151]">
                        <div className="flex items-center space-x-2.5">
                          <svg
                            width={16}
                            height={16}
                            style={{ width: "16px", height: "16px", minWidth: "16px", minHeight: "16px" }}
                            className="shrink-0 text-[#6b7280]"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                          </svg>
                          <span>{sub.email}</span>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1.5 max-w-xl">
                          {(Array.isArray(sub.newsletters)
                            ? sub.newsletters
                            : typeof sub.newsletters === "string"
                            ? (sub.newsletters as string).replace(/[\[\]"]/g, "").split(",")
                            : ["US", "WORLD", "BUSINESS"]
                          ).map((tag: string) => (
                            <span
                              key={String(tag).trim()}
                              className="bg-[#f3f4f6] text-[#374151] text-[9.5px] font-mono font-bold px-2 py-0.5 rounded-md uppercase tracking-wider border border-[#d1d5db] inline-block"
                            >
                              {String(tag).trim()}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="py-4 px-4 text-xs font-mono text-[#6b7280] whitespace-nowrap">
                        {sub.subscribedDate}
                      </td>

                      <td className="py-4 pl-4 pr-3 text-right whitespace-nowrap">
                        <button
                          onClick={() => confirmRemoveSub(sub)}
                          className="inline-flex items-center space-x-1 border border-[#6b7280] bg-white hover:bg-[#f3f4f6] text-[#374151] font-bold text-[11px] px-3 py-1.5 rounded-xl transition-colors cursor-pointer shadow-2xs"
                        >
                          <svg
                            width={13}
                            height={13}
                            style={{ width: "13px", height: "13px", minWidth: "13px", minHeight: "13px" }}
                            className="shrink-0 text-[#374151]"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                          <span>REMOVE</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : activeTab === "Published Posts" ? (
          /* ============================================================= */
          /* PUBLISHED POSTS VIEW                                          */
          /* ============================================================= */
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e5e7eb] shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#f3f4f6]">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#111111] tracking-tight">
                  Published Posts
                </h2>
                <p className="text-xs text-[#6b7280] font-sans mt-1 max-w-2xl leading-relaxed">
                  This panel grants the Chief Editor absolute authority to inspect engagement metrics and permanently delete/de-list articles from the database.
                </p>
              </div>

              <div className="flex items-center space-x-3 shrink-0">
                <button
                  onClick={handleDownloadArticlesZip}
                  className="flex items-center space-x-2 bg-white hover:bg-[#f3f4f6] border border-[#6b7280] text-[#374151] font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer shadow-2xs"
                >
                  <svg
                    width={14}
                    height={14}
                    style={{ width: "14px", height: "14px", minWidth: "14px", minHeight: "14px" }}
                    className="shrink-0 text-[#374151]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  <span>BACKUP ARTICLES (ZIP)</span>
                </button>
                <span className="bg-[#f3f4f6] text-[#4b5563] text-xs font-mono font-semibold px-3 py-2 rounded-xl border border-[#d1d5db]">
                  Live items: {filteredPublishedPosts.length} / {publishedPosts.length}
                </span>
              </div>
            </div>

            <div className="bg-white border border-[#d1d5db] rounded-2xl p-4 sm:p-5 shadow-2xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
                <div>
                  <label className="block text-[10px] font-mono font-bold text-[#6b7280] uppercase tracking-wider mb-1.5">
                    FILTER BY CATEGORY
                  </label>
                  <select
                    value={pubCategoryFilter}
                    onChange={(e) => setPubCategoryFilter(e.target.value)}
                    className="w-full bg-white border border-[#d1d5db] text-xs text-[#374151] rounded-xl px-3 py-2.5 outline-none focus:border-[#374151] transition-all font-sans cursor-pointer"
                  >
                    <option value="All Categories">All Categories</option>
                    <option value="World">World</option>
                    <option value="Business">Business</option>
                    <option value="U.S.">U.S.</option>
                    <option value="Politics">Politics</option>
                    <option value="Economy">Economy</option>
                    <option value="Tech">Tech</option>
                    <option value="Markets & Finance">Markets & Finance</option>
                    <option value="Opinion">Opinion</option>
                    <option value="Free Expression">Free Expression</option>
                    <option value="Arts">Arts</option>
                    <option value="Lifestyle">Lifestyle</option>
                    <option value="Real Estate">Real Estate</option>
                    <option value="Personal Finance">Personal Finance</option>
                    <option value="Health">Health</option>
                    <option value="Style">Style</option>
                    <option value="Sports">Sports</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-bold text-[#6b7280] uppercase tracking-wider mb-1.5">
                    FILTER BY PLACEMENT
                  </label>
                  <select
                    value={pubPlacementFilter}
                    onChange={(e) => setPubPlacementFilter(e.target.value)}
                    className="w-full bg-white border border-[#d1d5db] text-xs text-[#374151] rounded-xl px-3 py-2.5 outline-none focus:border-[#374151] transition-all font-sans cursor-pointer"
                  >
                    <option value="All Placements">All Placements</option>
                    <option value="Main Grid">Main Grid</option>
                    <option value="Top Lead">Top Lead</option>
                    <option value="Secondary">Secondary</option>
                    <option value="Tech News">Tech News</option>
                    <option value="World News">World News</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-bold text-[#6b7280] uppercase tracking-wider mb-1.5">
                    SEARCH ARTICLES
                  </label>
                  <input
                    type="text"
                    placeholder="Search title, author..."
                    value={pubSearchQuery}
                    onChange={(e) => setPubSearchQuery(e.target.value)}
                    className="w-full bg-white border border-[#d1d5db] text-xs text-[#374151] rounded-xl px-3 py-2.5 outline-none focus:border-[#374151] transition-all font-sans placeholder:text-[#9ca3af]"
                  />
                </div>

                <div className="flex justify-end pb-1.5">
                  <button
                    onClick={() => {
                      setPubCategoryFilter("All Categories");
                      setPubPlacementFilter("All Placements");
                      setPubSearchQuery("");
                    }}
                    className="text-xs font-bold text-[#374151] hover:underline cursor-pointer"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>

            {filteredPublishedPosts.length === 0 ? (
              <div className="py-16 text-center text-gray-500 font-sans border-t border-[#f3f4f6]">
                <svg
                  className="w-12 h-12 text-gray-300 mx-auto mb-3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                  />
                </svg>
                <p className="text-sm font-bold text-[#374151]">No published articles found</p>
                <p className="text-xs text-[#6b7280] mt-1">
                  Articles approved and published from the review queue will appear here.
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[720px] text-left font-sans border-collapse">
                    <thead>
                      <tr className="border-b border-[#e5e7eb] text-[10px] font-mono font-bold text-[#6b7280] uppercase tracking-wider">
                        <th className="pb-3 pr-4 font-bold min-w-[280px] sm:min-w-[320px]">ARTICLE DETAILS</th>
                        <th className="pb-3 px-4 font-bold whitespace-nowrap">CATEGORY</th>
                        <th className="pb-3 px-4 font-bold whitespace-nowrap">AUTHOR</th>
                        <th className="pb-3 px-4 font-bold whitespace-nowrap">METRICS DESK</th>
                        <th className="pb-3 pl-4 pr-2 font-bold text-right whitespace-nowrap">DELETE GATE</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f3f4f6]">
                      {filteredPublishedPosts.map((post) => (
                        <tr key={post.id} className="hover:bg-[#f9fafb] transition-colors">
                          <td className="py-5 pr-4 text-left">
                            <div className="flex items-start space-x-4 max-w-lg">
                              <img
                                src={post.thumbnail}
                                alt={post.title}
                                className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0 border border-[#e5e7eb] shadow-2xs"
                              />
                              <div>
                                <h3 className="font-bold text-xs sm:text-sm text-[#374151] leading-snug">
                                  {post.title}
                                </h3>
                                <p className="text-[11px] sm:text-xs text-[#6b7280] mt-1 line-clamp-2 leading-relaxed">
                                  {post.excerpt}
                                </p>
                                <span className="inline-block text-[10px] font-mono text-[#9ca3af] mt-1 font-normal">
                                  {post.readTime}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="py-5 px-4 whitespace-nowrap">
                            <span className="bg-[#f3f4f6] text-[#374151] text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-[#d1d5db] inline-block">
                              {post.category}
                            </span>
                          </td>

                          <td className="py-5 px-4 text-xs font-semibold text-[#4b5563] whitespace-nowrap">
                            {post.author}
                          </td>

                          <td className="py-5 px-4 text-xs font-mono text-[#4b5563] font-semibold whitespace-nowrap">
                            {post.views} Views • {post.comments} Comments
                          </td>

                          <td className="py-5 pl-4 pr-2 text-right whitespace-nowrap">
                            <div className="inline-flex items-center justify-end space-x-2">
                              <button
                                onClick={() => router.push(`/admin-dashboard/edit-post?id=${post.id}`)}
                                className="w-8 h-8 rounded-full bg-[#f3f4f6] hover:bg-[#e5e7eb] text-[#374151] border border-[#d1d5db] flex items-center justify-center transition-colors cursor-pointer"
                                title="Edit Article"
                              >
                                <svg
                                  width={14}
                                  height={14}
                                  style={{ width: "14px", height: "14px", minWidth: "14px", minHeight: "14px" }}
                                  className="shrink-0"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  viewBox="0 0 24 24"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                </svg>
                              </button>

                              <button
                                onClick={() => confirmDeletePost(post)}
                                className="w-8 h-8 rounded-full bg-[#f3f4f6] hover:bg-[#e5e7eb] text-[#374151] border border-[#d1d5db] flex items-center justify-center transition-colors cursor-pointer"
                                title="Permanently Delete Article"
                              >
                                <svg
                                  width={14}
                                  height={14}
                                  style={{ width: "14px", height: "14px", minWidth: "14px", minHeight: "14px" }}
                                  className="shrink-0"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  viewBox="0 0 24 24"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#f3f4f6] text-xs">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="px-4 py-2 bg-white border border-[#6b7280] text-[#374151] rounded-xl font-medium hover:bg-[#f3f4f6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {"‹ Previous"}
                  </button>

                  <span className="font-mono text-[#6b7280] font-medium">
                    Page {currentPage} of 10
                  </span>

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(10, p + 1))}
                    className="px-4 py-2 bg-white border border-[#6b7280] text-[#374151] rounded-xl font-medium hover:bg-[#f3f4f6] transition-colors cursor-pointer"
                  >
                    {"Next ›"}
                  </button>
                </div>
              </>
            )}
          </div>
        ) : activeTab === "Users" ? (
          /* ============================================================= */
          /* USERS DESK VIEW (Matching Reference Screenshots 1, 2 & 3)     */
          /* ============================================================= */
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e5e7eb] shadow-2xs space-y-6">
            {/* Top Bar: Title, Add User Button & Total Users Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#111111] tracking-tight">
                  Users Desk
                </h2>
              </div>

              <div className="flex items-center space-x-3 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setAddUserError("");
                    setNewUserName("");
                    setNewUserEmail("");
                    setNewUserPassword("");
                    setNewUserRole("writer");
                    setShowAddUserModal(true);
                  }}
                  className="flex items-center space-x-2 bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-xs uppercase tracking-wider px-4 py-2 rounded-full transition-all cursor-pointer shadow-sm whitespace-nowrap shrink-0"
                >
                  <svg className="w-4 h-4 stroke-[2] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  <span className="whitespace-nowrap">ADD USER</span>
                </button>
                <span className="bg-[#f8fafc] border border-[#e2e8f0] text-[#64748b] text-xs font-mono font-bold px-3.5 py-2 rounded-xl">
                  Total Users: {usersList.length}
                </span>
              </div>
            </div>

            {/* Sub-Tabs: ALL USERS (x), ADMINS (x), WRITERS (x), READERS (x) */}
            <div className="flex items-center space-x-8 border-b border-[#e5e7eb] font-sans text-xs overflow-x-auto">
              <button
                type="button"
                onClick={() => setUserSubTab("ALL")}
                className={`font-bold tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer pb-3 px-1 border-b-2 ${
                  userSubTab === "ALL"
                    ? "text-[#ea580c] border-[#ea580c] -mb-[1px] font-extrabold"
                    : "text-[#64748b] hover:text-[#111111] border-transparent"
                }`}
              >
                ALL USERS ({usersList.length})
              </button>

              <button
                type="button"
                onClick={() => setUserSubTab("ADMINS")}
                className={`font-bold tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer pb-3 px-1 border-b-2 ${
                  userSubTab === "ADMINS"
                    ? "text-[#ea580c] border-[#ea580c] -mb-[1px] font-extrabold"
                    : "text-[#64748b] hover:text-[#111111] border-transparent"
                }`}
              >
                ADMINS ({usersList.filter((u) => u.role?.toLowerCase() === "admin").length})
              </button>

              <button
                type="button"
                onClick={() => setUserSubTab("WRITERS")}
                className={`font-bold tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer pb-3 px-1 border-b-2 ${
                  userSubTab === "WRITERS"
                    ? "text-[#ea580c] border-[#ea580c] -mb-[1px] font-extrabold"
                    : "text-[#64748b] hover:text-[#111111] border-transparent"
                }`}
              >
                WRITERS ({usersList.filter((u) => u.role?.toLowerCase() === "writer").length})
              </button>

              <button
                type="button"
                onClick={() => setUserSubTab("READERS")}
                className={`font-bold tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer pb-3 px-1 border-b-2 ${
                  userSubTab === "READERS"
                    ? "text-[#ea580c] border-[#ea580c] -mb-[1px] font-extrabold"
                    : "text-[#64748b] hover:text-[#111111] border-transparent"
                }`}
              >
                READERS ({usersList.filter((u) => u.role?.toLowerCase() === "reader").length})
              </button>
            </div>

            {/* Subheader Title */}
            <div>
              <h3 className="font-serif font-bold text-base text-[#111827]">
                User Workspace Roles
              </h3>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left font-sans border-collapse">
                <thead>
                  <tr className="bg-[#f8fafc] border-y border-[#e5e7eb] text-[10px] font-mono font-bold text-[#6b7280] uppercase tracking-wider">
                    <th className="py-3 px-4 font-bold min-w-[240px]">NAME</th>
                    <th className="py-3 px-4 font-bold min-w-[240px]">EMAIL ADDRESS</th>
                    <th className="py-3 px-4 font-bold whitespace-nowrap">WORKSPACE ROLE</th>
                    <th className="py-3 pl-4 pr-4 font-bold text-right whitespace-nowrap">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f3f4f6]">
                  {usersList
                    .filter((u) => {
                      const r = (u.role || "").toLowerCase();
                      if (userSubTab === "ADMINS") return r === "admin";
                      if (userSubTab === "WRITERS") return r === "writer";
                      if (userSubTab === "READERS") return r === "reader";
                      return true;
                    })
                    .map((user) => {
                      const targetEmail = (user.email || "").toLowerCase().trim();
                      const isTargetDefaultAdmin = Boolean(user.is_default_admin);
                      const isSelf = targetEmail === loggedInEmail && loggedInEmail !== "";
                      const userRoleLower = (user.role || "reader").toLowerCase();

                      // Permission logic:
                      // 1. Default admin CANNOT edit other default admins (can only view them).
                      // 2. Normal admin CANNOT edit default admins (can only view them).
                      // 3. User can edit their own profile if self.
                      // 4. Default admin / Normal admin can edit other normal admins, writers, readers.
                      const canEditUser = isTargetDefaultAdmin ? isSelf : true;

                      return (
                        <tr key={user.id || user.email} className="hover:bg-[#f9fafb] transition-colors">
                          {/* NAME */}
                          <td className="py-4 px-4 font-bold text-xs sm:text-sm text-[#111827] whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <span>{user.full_name}</span>
                              {isSelf && (
                                <span className="bg-[#f1f5f9] text-[#475569] text-[11px] font-medium px-2 py-0.5 rounded-md border border-[#e2e8f0] shadow-2xs">
                                  You
                                </span>
                              )}
                              {isTargetDefaultAdmin && (
                                <span className="inline-flex items-center space-x-1 border border-[#fcd34d] bg-[#fefce8] text-[#b45309] text-[9.5px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                                  <svg className="w-3.5 h-3.5 text-[#b45309]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                  </svg>
                                  <span>DEFAULT ADMIN</span>
                                </span>
                              )}
                            </div>
                          </td>

                          {/* EMAIL ADDRESS */}
                          <td className="py-4 px-4 text-xs font-mono text-[#6b7280] whitespace-nowrap">
                            {user.email}
                          </td>

                          {/* WORKSPACE ROLE */}
                          <td className="py-4 px-4 whitespace-nowrap">
                            {userRoleLower === "admin" ? (
                              <span className="border border-[#f87171] text-[#dc2626] bg-[#fef2f2] text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block">
                                ADMIN
                              </span>
                            ) : userRoleLower === "writer" ? (
                              <span className="border border-[#60a5fa] text-[#2563eb] bg-[#eff6ff] text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block">
                                WRITER
                              </span>
                            ) : (
                              <span className="border border-[#9ca3af] text-[#4b5563] bg-[#f3f4f6] text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block">
                                READER
                              </span>
                            )}
                          </td>

                          {/* ACTIONS */}
                          <td className="py-4 pl-4 pr-4 text-right whitespace-nowrap">
                            <div className="inline-flex items-center justify-end space-x-2">
                              {/* Eye Icon (View Profile Details) */}
                              <button
                                type="button"
                                onClick={() => setShowViewUserModal(user)}
                                className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-100 text-[#475569] flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                                title="View Profile Details"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12c.077-.19.152-.38.228-.568C3.805 7.699 7.55 5 12 5c4.45 0 8.195 2.699 9.736 6.432.076.188.151.378.228.568-.077.19-.152.38-.228.568C20.195 16.301 16.45 19 12 19c-4.45 0-8.195-2.699-9.736-6.432a13.313 13.313 0 01-.228-.568z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                              </button>

                              {/* EDIT Button (Hidden for other default admins) */}
                              {canEditUser && (
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditUserModal(user)}
                                  className="inline-flex items-center space-x-1 border border-slate-300 bg-white hover:bg-slate-50 text-[#334155] font-bold text-[11px] px-3 py-1.5 rounded-xl transition-colors cursor-pointer shadow-2xs"
                                >
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                                  </svg>
                                  <span>EDIT</span>
                                </button>
                              )}

                              {/* DELETE Button (Triggers confirmation modal) */}
                              {!isTargetDefaultAdmin && (
                                <button
                                  type="button"
                                  onClick={() => setUserToDelete(user)}
                                  className="inline-flex items-center space-x-1 border border-red-200 bg-white hover:bg-red-50 text-[#dc2626] font-bold text-[11px] px-3 py-1.5 rounded-xl transition-colors cursor-pointer shadow-2xs"
                                >
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                  </svg>
                                  <span>DELETE</span>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        ) : activeTab === "Contact Us Submissions" ? (
          /* ============================================================= */
          /* CONTACT US SUBMISSIONS VIEW (Matching Image 3)                */
          /* ============================================================= */
          <div className="space-y-6 font-sans">
            {/* Header + Search/Filter Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-[#111827] font-sans tracking-tight">
                  Contact Us Submissions
                </h2>
                <p className="text-xs text-[#6b7280] font-sans mt-0.5">
                  View and manage messages submitted by readers and partners on the Contact Us page.
                </p>
              </div>

              {/* Right Controls: Search bar + Inquiry Type filter dropdown */}
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  placeholder="Search name, email, message..."
                  value={contactSearchQuery}
                  onChange={(e) => setContactSearchQuery(e.target.value)}
                  className="bg-white border border-[#e5e7eb] rounded-xl px-3.5 py-2 text-xs text-[#111827] placeholder-gray-400 focus:outline-none focus:border-[#00558c] w-64 shadow-2xs font-sans"
                />

                <select
                  value={contactTypeFilter}
                  onChange={(e) => setContactTypeFilter(e.target.value)}
                  className="bg-white border border-[#e5e7eb] rounded-xl px-3.5 py-2 text-xs font-medium text-[#111827] focus:outline-none focus:border-[#00558c] shadow-2xs cursor-pointer font-sans"
                >
                  <option value="All Inquiry Types">All Inquiry Types</option>
                  <option value="Business / Advertising">Business / Advertising</option>
                  <option value="Editorial">Editorial</option>
                  <option value="Technical glitch">Technical glitch</option>
                  <option value="General / Others">General / Others</option>
                </select>
              </div>
            </div>

            {/* Submissions Data Table */}
            <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left font-sans border-collapse">
                  <thead>
                    <tr className="border-b border-[#f1f5f9] text-[10px] font-mono font-bold text-[#6b7280] uppercase tracking-wider bg-slate-50/50">
                      <th className="py-3 px-4">DATE</th>
                      <th className="py-3 px-4">NAME / COMPANY</th>
                      <th className="py-3 px-4">EMAIL</th>
                      <th className="py-3 px-4">PHONE / WHATSAPP</th>
                      <th className="py-3 px-4">TYPE</th>
                      <th className="py-3 px-4">MESSAGE</th>
                      <th className="py-3 px-4">STATUS</th>
                      <th className="py-3 px-4 text-center">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f1f5f9] text-xs">
                    {filteredContactSubmissions.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-10 text-center text-slate-400 font-sans text-xs">
                          No contact submissions found.
                        </td>
                      </tr>
                    ) : (
                      filteredContactSubmissions.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-4 px-4 text-[#6b7280] whitespace-nowrap font-medium text-[11px]">
                            {formatSubmissionDate(item.created_at)}
                          </td>
                          <td className="py-4 px-4">
                            <div className="font-bold text-[#111827]">{item.name}</div>
                            <div className="text-[11px] text-[#6b7280]">{item.company || "N/A"}</div>
                          </td>
                          <td className="py-4 px-4 text-[#4b5563] font-mono text-[11px] whitespace-nowrap">
                            {item.email}
                          </td>
                          <td className="py-4 px-4 text-[11px] text-[#4b5563] whitespace-nowrap">
                            <div>P: {item.phone || "N/A"}</div>
                            <div>W: {item.whatsapp || "N/A"}</div>
                          </td>
                          <td className="py-4 px-4 whitespace-nowrap">
                            <span className="bg-slate-100 text-[#4b5563] border border-slate-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                              {item.inquiry_type || (item as any).inquiryType || "General / Others"}
                            </span>
                          </td>
                          <td
                            className="py-4 px-4 text-[#374151] max-w-[240px] truncate overflow-hidden whitespace-nowrap"
                            title={item.details || (item as any).message || ""}
                          >
                            {item.details || (item as any).message}
                          </td>
                          <td className="py-4 px-4 whitespace-nowrap">
                            <select
                              value={item.status || "New"}
                              onChange={(e) => handleUpdateContactStatus(item.id, e.target.value)}
                              className="bg-sky-50/80 border border-sky-200 text-[#0284c7] font-bold rounded-lg text-xs px-2.5 py-1 focus:outline-none cursor-pointer"
                            >
                              <option value="New">New</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Resolved">Resolved</option>
                              <option value="Archived">Archived</option>
                            </select>
                          </td>
                          <td className="py-4 px-4 whitespace-nowrap text-center">
                            <div className="inline-flex items-center space-x-2">
                              <button
                                onClick={() => setSelectedContactModal(item)}
                                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                                title="View Details"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12c.077-.19.152-.38.228-.568C3.805 7.699 7.55 5 12 5c4.45 0 8.195 2.699 9.736 6.432.076.188.151.378.228.568-.077.19-.152.38-.228.568C20.195 16.301 16.45 19 12 19c-4.45 0-8.195-2.699-9.736-6.432a13.313 13.313 0 01-.228-.568z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => confirmDeleteContactSubmission(item)}
                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                title="Delete Submission"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : activeTab === "Advertise Leads" ? (
          /* ============================================================= */
          /* ADVERTISE CLIENT LEADS VIEW (Matching Image 2)                */
          /* ============================================================= */
          <div className="space-y-6 font-sans">
            {/* Header + Search/Filter Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-[#111827] font-sans tracking-tight">
                  Advertise Client Leads
                </h2>
                <p className="text-xs text-[#6b7280] font-sans mt-0.5">
                  View and manage leads submitted by businesses and partners on the Advertise page.
                </p>
              </div>

              {/* Right Controls: Search bar + Service Filter dropdown */}
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  placeholder="Search name, company, message..."
                  value={advertiseSearchQuery}
                  onChange={(e) => setAdvertiseSearchQuery(e.target.value)}
                  className="bg-white border border-[#e5e7eb] rounded-xl px-3.5 py-2 text-xs text-[#111827] placeholder-gray-400 focus:outline-none focus:border-[#00558c] w-64 shadow-2xs font-sans"
                />

                <select
                  value={advertiseServiceFilter}
                  onChange={(e) => setAdvertiseServiceFilter(e.target.value)}
                  className="bg-white border border-[#e5e7eb] rounded-xl px-3.5 py-2 text-xs font-medium text-[#111827] focus:outline-none focus:border-[#00558c] shadow-2xs cursor-pointer font-sans"
                >
                  <option value="All Services">All Services</option>
                  <option value="Publish Company Article">Publish Company Article</option>
                  <option value="Publish CEO Profile">Publish CEO Profile</option>
                  <option value="Report News">Report News</option>
                  <option value="Times Chicago Magazine">Times Chicago Magazine</option>
                </select>
              </div>
            </div>

            {/* Leads Data Table */}
            <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left font-sans border-collapse">
                  <thead>
                    <tr className="border-b border-[#f1f5f9] text-[10px] font-mono font-bold text-[#6b7280] uppercase tracking-wider bg-slate-50/50">
                      <th className="py-3 px-4">DATE</th>
                      <th className="py-3 px-4">SUBMITTER / COMPANY</th>
                      <th className="py-3 px-4">EMAIL</th>
                      <th className="py-3 px-4">PHONE / WHATSAPP</th>
                      <th className="py-3 px-4">SERVICE OPTION</th>
                      <th className="py-3 px-4">REQUIREMENTS</th>
                      <th className="py-3 px-4">STATUS</th>
                      <th className="py-3 px-4 text-center">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f1f5f9] text-xs">
                    {filteredAdvertiseLeads.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-10 text-center text-slate-400 font-sans text-xs">
                          No advertise leads found.
                        </td>
                      </tr>
                    ) : (
                      filteredAdvertiseLeads.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-4 px-4 text-[#6b7280] whitespace-nowrap font-medium text-[11px]">
                            {formatSubmissionDate(item.created_at)}
                          </td>
                          <td className="py-4 px-4">
                            <div className="font-bold text-[#111827]">{item.name}</div>
                            <div className="text-[11px] text-[#6b7280]">{item.company || "N/A"}</div>
                          </td>
                          <td className="py-4 px-4 text-[#4b5563] font-mono text-[11px] whitespace-nowrap">
                            {item.email}
                          </td>
                          <td className="py-4 px-4 text-[11px] text-[#4b5563] whitespace-nowrap">
                            <div>P: {item.phone || "N/A"}</div>
                            <div>W: {item.whatsapp || "N/A"}</div>
                          </td>
                          <td className="py-4 px-4 whitespace-nowrap">
                            <span className="bg-sky-50 text-[#0284c7] border border-sky-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                              {item.service_option || (item as any).serviceOption || "Publish Company Article"}
                            </span>
                          </td>
                          <td
                            className="py-4 px-4 text-[#374151] max-w-[240px] truncate overflow-hidden whitespace-nowrap"
                            title={item.details || (item as any).requirements || ""}
                          >
                            {item.details || (item as any).requirements}
                          </td>
                          <td className="py-4 px-4 whitespace-nowrap">
                            <select
                              value={item.status || "New"}
                              onChange={(e) => handleUpdateAdvertiseStatus(item.id, e.target.value)}
                              className="bg-sky-50/80 border border-sky-200 text-[#0284c7] font-bold rounded-lg text-xs px-2.5 py-1 focus:outline-none cursor-pointer"
                            >
                              <option value="New">New</option>
                              <option value="Contacted">Contacted</option>
                              <option value="Proposal Sent">Proposal Sent</option>
                              <option value="Won">Won</option>
                              <option value="Lost">Lost</option>
                            </select>
                          </td>
                          <td className="py-4 px-4 whitespace-nowrap text-center">
                            <div className="inline-flex items-center space-x-2">
                              <button
                                onClick={() => setSelectedAdvertiseModal(item)}
                                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                                title="View Details"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12c.077-.19.152-.38.228-.568C3.805 7.699 7.55 5 12 5c4.45 0 8.195 2.699 9.736 6.432.076.188.151.378.228.568-.077.19-.152.38-.228.568C20.195 16.301 16.45 19 12 19c-4.45 0-8.195-2.699-9.736-6.432a13.313 13.313 0 01-.228-.568z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => confirmDeleteAdvertiseLead(item)}
                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                title="Delete Lead"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : activeTab === "Manage Ads" ? (
          /* ============================================================= */
          /* MANAGE ADS VIEW (Matching Reference Screenshots & Color Palette)*/
          /* ============================================================= */
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e5e7eb] shadow-2xs space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#111111] tracking-tight">
                Manage Ads
              </h2>
              <p className="text-xs text-[#666666] font-sans mt-1 leading-relaxed">
                Configure customized advertisement graphics or promote internal articles in predefined slots.
              </p>
            </div>

            {/* Sub-Tabs Header: ALL AD SLOTS (10), HOMEPAGE SLOTS (7), CATEGORY PAGE SLOTS (2), AUTHOR PAGE SLOTS (1) */}
            <div className="flex items-center space-x-6 border-b border-[#e5e7eb] pb-3 font-sans text-xs overflow-x-auto">
              <button
                type="button"
                onClick={() => setAdSubTab("ALL")}
                className={`font-bold tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer ${
                  adSubTab === "ALL"
                    ? "text-[#b8860b] border-b-2 border-[#b8860b] pb-2.5 font-extrabold"
                    : "text-[#6b7280] hover:text-[#111111]"
                }`}
              >
                ALL AD SLOTS ({adSlots.length})
              </button>

              <button
                type="button"
                onClick={() => setAdSubTab("HOMEPAGE")}
                className={`font-bold tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer ${
                  adSubTab === "HOMEPAGE"
                    ? "text-[#b8860b] border-b-2 border-[#b8860b] pb-2.5 font-extrabold"
                    : "text-[#6b7280] hover:text-[#111111]"
                }`}
              >
                HOMEPAGE SLOTS ({adSlots.filter((s) => s.placementGroup === "Homepage").length})
              </button>

              <button
                type="button"
                onClick={() => setAdSubTab("CATEGORY")}
                className={`font-bold tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer ${
                  adSubTab === "CATEGORY"
                    ? "text-[#b8860b] border-b-2 border-[#b8860b] pb-2.5 font-extrabold"
                    : "text-[#6b7280] hover:text-[#111111]"
                }`}
              >
                CATEGORY PAGE SLOTS ({adSlots.filter((s) => s.placementGroup === "Category").length})
              </button>

              <button
                type="button"
                onClick={() => setAdSubTab("AUTHOR")}
                className={`font-bold tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer ${
                  adSubTab === "AUTHOR"
                    ? "text-[#b8860b] border-b-2 border-[#b8860b] pb-2.5 font-extrabold"
                    : "text-[#6b7280] hover:text-[#111111]"
                }`}
              >
                WRITER PAGE SLOTS ({adSlots.filter((s) => s.placementGroup === "Author").length})
              </button>
            </div>

            {/* List of 10 Filtered Ad Slots */}
            <div className="space-y-6 pt-2">
              {adSlots
                .filter((slot) => {
                  if (adSubTab === "HOMEPAGE") return slot.placementGroup === "Homepage";
                  if (adSubTab === "CATEGORY") return slot.placementGroup === "Category";
                  if (adSubTab === "AUTHOR") return slot.placementGroup === "Author";
                  return true;
                })
                .map((slot) => (
                  <div
                    key={slot.id}
                    className="bg-white border border-[#e5e7eb] rounded-3xl p-5 sm:p-6 shadow-2xs relative"
                  >
                    {/* Top Right ACTIVE Switch */}
                    <div className="absolute top-5 right-5 sm:top-6 sm:right-6 flex items-center space-x-2 z-10">
                      <span className="text-[10px] font-mono font-bold text-[#6b7280] uppercase tracking-wider">
                        {slot.active ? "ACTIVE" : "INACTIVE"}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleToggleAdSlot(slot.id)}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          slot.active ? "bg-[#b8860b]" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                            slot.active ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Main 2-Column Grid Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                      {/* Left Column: SLOT DIMENSIONS + Image Thumbnail + Choose File */}
                      <div className="lg:col-span-4 flex flex-col space-y-3">
                        <span className="text-[11px] font-mono font-bold text-[#b8860b] uppercase tracking-wider block">
                          SLOT DIMENSIONS: {slot.dimension}
                        </span>

                        {/* Image Banner Preview Container */}
                        <div className="w-full h-[130px] sm:h-[140px] bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-2xs flex items-center justify-center relative shrink-0">
                          {slot.imageUrl ? (
                            <img
                              src={slot.imageUrl}
                              alt={slot.slotName}
                              className="w-full h-full object-fill"
                            />
                          ) : (
                            <span className="text-xs text-gray-400 font-mono">No Image Uploaded</span>
                          )}
                        </div>

                        {/* Upload Banner Image */}
                        <div>
                          <span className="text-[10px] font-mono font-bold text-[#6b7280] uppercase tracking-wider block mb-1">
                            UPLOAD BANNER IMAGE
                          </span>
                          <div className="flex items-center space-x-2">
                            <label className="bg-white border border-[#cccccc] hover:bg-gray-100 text-[#374151] font-bold px-4 py-1.5 rounded-full cursor-pointer shadow-2xs transition-colors whitespace-nowrap text-xs">
                              Choose File
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    handleUploadAdImage(slot.id, file);
                                  }
                                }}
                              />
                            </label>
                            <span className="text-xs text-[#6b7280] font-sans truncate max-w-[140px]">
                              {slot.fileName || (slot.imageUrl && slot.imageUrl.includes("http") ? "Backblaze Image" : "No file chosen")}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right Column: Title, Description, Side-by-Side Inputs, Clear & Save Buttons */}
                      <div className="lg:col-span-8 flex flex-col justify-between self-stretch min-h-[220px]">
                        {/* Top: Title & Description Subtitle */}
                        <div>
                          <h3 className="font-serif font-bold text-xl text-[#111111] leading-tight pr-24">
                            {slot.slotName}
                          </h3>
                          <p className="text-xs text-[#666666] font-sans mt-1 leading-relaxed max-w-xl">
                            {slot.description}
                          </p>

                          {/* Middle: Side-by-Side Controls Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 font-sans">
                            <div>
                              <label className="block text-[10px] font-mono font-bold text-[#6b7280] uppercase tracking-wider mb-1">
                                TARGET ACTION TYPE
                              </label>
                              <select
                                value={slot.actionType}
                                onChange={(e) => handleUpdateAdSlot(slot.id, "actionType", e.target.value)}
                                className="w-full bg-white border border-[#cbd5e1] text-xs font-semibold text-[#111111] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#b8860b] transition-colors cursor-pointer"
                              >
                                <option value="External Link (URL)">External Link (URL)</option>
                                <option value="Internal Promoted Article">Internal Promoted Article</option>
                              </select>
                            </div>

                            {slot.actionType === "Internal Promoted Article" ? (
                              <div>
                                <label className="block text-[10px] font-mono font-bold text-[#6b7280] uppercase tracking-wider mb-1">
                                  CHOOSE PUBLISH STORY
                                </label>
                                <select
                                  value={slot.selectedArticleSlug || ""}
                                  onChange={(e) => handleUpdateAdSlot(slot.id, "selectedArticleSlug", e.target.value)}
                                  className="w-full bg-white border border-[#cbd5e1] text-xs font-semibold text-[#111111] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#b8860b] transition-colors cursor-pointer"
                                >
                                  <option value="">-- Choose Published Story --</option>
                                  {publishedPosts.map((post) => (
                                    <option key={post.id || post.slug} value={post.slug || post.id}>
                                      [{post.category || "GENERAL"}] {post.title}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            ) : (
                              <div>
                                <label className="block text-[10px] font-mono font-bold text-[#6b7280] uppercase tracking-wider mb-1">
                                  TARGET LINK URL
                                </label>
                                <input
                                  type="text"
                                  value={slot.targetUrl || ""}
                                  onChange={(e) => handleUpdateAdSlot(slot.id, "targetUrl", e.target.value)}
                                  placeholder="https://..."
                                  className="w-full bg-white border border-[#cbd5e1] text-xs text-[#111111] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#b8860b] transition-colors font-sans"
                                />
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Bottom Right Buttons */}
                        <div className="flex items-center justify-end space-x-3 mt-4 pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              handleUpdateAdSlot(slot.id, "imageUrl", "");
                              handleUpdateAdSlot(slot.id, "fileName", "");
                            }}
                            className="bg-white hover:bg-slate-50 border border-[#cccccc] text-[#4b5563] font-bold text-xs px-5 py-2.5 rounded-xl transition-colors cursor-pointer uppercase shadow-2xs tracking-wider"
                          >
                            CLEAR IMAGE
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveAdConfig(slot.id)}
                            className="bg-[#b8860b] hover:bg-[#a07409] text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-colors cursor-pointer uppercase shadow-2xs tracking-wider"
                          >
                            SAVE AD CONFIG
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ) : activeTab === "Database Backups" ? (
          /* ============================================================= */
          /* DATABASE BACKUPS & CLOUD RESTORE VIEW                         */
          /* ============================================================= */
          <div className="space-y-6 font-sans">
            {/* Outer Container Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e5e7eb] shadow-2xs space-y-6">
              {/* Header Title + Action Buttons */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#f1f5f9]">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#111111] tracking-tight">
                    Database Backups & Cloud Restore
                  </h2>
                  <p className="text-xs text-[#64748b] mt-1">
                    Automated and manual database snapshots stored on Backblaze B2.
                  </p>
                </div>

                {/* Top-Right Action Buttons */}
                <div className="flex items-center space-x-3 shrink-0">
                  {/* CREATE B2 BACKUP Button */}
                  <button
                    type="button"
                    disabled={isCreatingBackup}
                    onClick={handleCreateB2Backup}
                    className="inline-flex items-center space-x-2 bg-white hover:bg-[#fff7ed] border border-[#ea580c] text-[#ea580c] font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-2xs disabled:opacity-50"
                  >
                    {isCreatingBackup ? (
                      <>
                        <svg className="w-4 h-4 animate-spin text-[#ea580c]" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>CREATING BACKUP...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 text-[#ea580c]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        <span>CREATE B2 BACKUP</span>
                      </>
                    )}
                  </button>

                  {/* UPLOAD JSON RESTORE Button */}
                  <label className="inline-flex items-center space-x-2 bg-[#0f172a] hover:bg-[#1e293b] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-2xs">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    <span>UPLOAD JSON RESTORE</span>
                    <input
                      ref={jsonFileInputRef}
                      type="file"
                      accept=".json"
                      onChange={handleUploadJsonRestore}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Sub-description paragraph matching screenshot */}
              <p className="text-xs text-[#64748b] leading-relaxed">
                Backups are automatically taken every 24 hours. The snapshots include all published articles, media links, admin & writer accounts, subscriber list, ad placements, and contact leads.
              </p>

              {/* Table of Backups */}
              <div className="overflow-x-auto">
                <table className="w-full min-w-[680px] text-left font-sans border-collapse">
                  <thead>
                    <tr className="border-b border-[#e5e7eb] text-[10px] font-mono font-bold text-[#64748b] uppercase tracking-wider">
                      <th className="py-3 px-4 font-bold">BACKUP FILE</th>
                      <th className="py-3 px-4 font-bold">BACKUP DATE</th>
                      <th className="py-3 px-4 font-bold">FILE SIZE</th>
                      <th className="py-3 pl-4 pr-4 font-bold text-right">ACTION GATE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f1f5f9]">
                    {backupsList.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-12 text-center text-xs text-[#94a3b8] font-mono">
                          No backup snapshots found in Backblaze B2 storage. Click "CREATE B2 BACKUP" to generate one.
                        </td>
                      </tr>
                    ) : (
                      backupsList.map((b) => (
                        <tr key={b.fileName} className="hover:bg-[#f8fafc] transition-colors">
                          {/* BACKUP FILE */}
                          <td className="py-4 px-4 font-mono font-bold text-xs sm:text-sm text-[#0f172a] whitespace-nowrap">
                            {b.fileName}
                          </td>

                          {/* BACKUP DATE */}
                          <td className="py-4 px-4 text-xs font-sans text-[#64748b] whitespace-nowrap">
                            {b.backupDate}
                          </td>

                          {/* FILE SIZE */}
                          <td className="py-4 px-4 text-xs font-mono font-semibold text-[#64748b] whitespace-nowrap">
                            {b.sizeFormatted}
                          </td>

                          {/* ACTION GATE */}
                          <td className="py-4 pl-4 pr-4 text-right whitespace-nowrap">
                            <div className="inline-flex items-center justify-end space-x-2">
                              {/* RESTORE Button */}
                              <button
                                type="button"
                                disabled={isRestoringBackup}
                                onClick={() => handleRestoreBackup(b.fileName)}
                                className="border border-[#ea580c] text-[#ea580c] hover:bg-[#fff7ed] text-[11px] font-mono font-bold px-3.5 py-1.5 rounded-lg uppercase tracking-wider transition-all cursor-pointer shadow-2xs disabled:opacity-50"
                              >
                                RESTORE
                              </button>

                              {/* Download Icon Button */}
                              <button
                                type="button"
                                onClick={() => handleDownloadBackup(b)}
                                className="w-8 h-8 rounded-lg border border-[#cbd5e1] bg-white hover:bg-slate-100 text-[#475569] flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                                title="Download JSON Snapshot to Device"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                </svg>
                              </button>

                              {/* Delete Icon Button */}
                              <button
                                type="button"
                                onClick={() => handleDeleteBackup(b.fileName)}
                                className="w-8 h-8 rounded-lg border border-[#cbd5e1] bg-white hover:bg-red-50 hover:border-red-300 text-slate-400 hover:text-red-600 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                                title="Delete Backup Snapshot"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : activeTab === "Shorts & Reels" ? (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e5e7eb] shadow-2xs space-y-6 font-sans">
            {/* Header Row inside Outer Card */}
            <div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2.5">
                    <h2 className="text-xl sm:text-2xl font-bold text-[#111111] tracking-tight">
                      Shorts & Reels Manager
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-sans font-bold bg-[#fef3c7] text-[#b8860b] border border-[#fde68a]">
                      {getMaxSlotsForSubTab()} {shortsSubTab === "PODCAST" ? "Podcast" : "Videos"}
                    </span>
                  </div>
                  <p className="text-xs text-[#64748b] mt-1 font-sans">
                    Curate short-form video stories from YouTube Shorts, Rumble, Instagram Reels, and Facebook Reels.
                  </p>
                </div>

                <div className="shrink-0">
                  <span className="px-3.5 py-1.5 rounded-full text-[10px] font-mono font-bold bg-[#e0f2fe] text-[#0284c7] border border-[#bae6fd] tracking-widest uppercase">
                    HOMEPAGE FEED: {getCurrentShortsList().filter((s) => s.status === "Active" && s.videoUrl).length} / {getMaxSlotsForSubTab()} {shortsSubTab === "PODCAST" ? "AUDIO" : "VIDEOS"}
                  </span>
                </div>
              </div>

              {/* Sub-Tabs Header Bar: RECOMMENDED VIDEOS, VIDEOS, PODCAST (matching Manage Ads style) */}
              <div className="flex items-center space-x-6 border-b border-[#e5e7eb] pt-4 pb-1 font-sans text-xs overflow-x-auto">
                <button
                  type="button"
                  onClick={() => {
                    setShortsSubTab("RECOMMENDED");
                    setShortsSubTab("RECOMMENDED");
                    setShortTargetSlot(1);
                    setShortPlatform("Youtube Video");
                  }}
                  className={`font-bold tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer pb-2.5 ${
                    shortsSubTab === "RECOMMENDED"
                      ? "text-[#b8860b] border-b-2 border-[#b8860b] font-extrabold"
                      : "text-[#6b7280] hover:text-[#111111]"
                  }`}
                >
                  RECOMMENDED VIDEOS
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShortsSubTab("VIDEOS");
                    setShortTargetSlot(1);
                    setShortPlatform("Youtube Video");
                  }}
                  className={`font-bold tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer pb-2.5 ${
                    shortsSubTab === "VIDEOS"
                      ? "text-[#b8860b] border-b-2 border-[#b8860b] font-extrabold"
                      : "text-[#6b7280] hover:text-[#111111]"
                  }`}
                >
                  VIDEOS
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShortsSubTab("PODCAST");
                    setShortTargetSlot(1);
                    setShortPlatform("Apple Podcasts");
                  }}
                  className={`font-bold tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer pb-2.5 ${
                    shortsSubTab === "PODCAST"
                      ? "text-[#b8860b] border-b-2 border-[#b8860b] font-extrabold"
                      : "text-[#6b7280] hover:text-[#111111]"
                  }`}
                >
                  PODCAST
                </button>
              </div>
            </div>

            {/* INNER CARD 1: Add New Short / Reel Video */}
            <div className="bg-[#ffffff] rounded-2xl p-6 border border-[#e2e8f0] shadow-2xs space-y-6">
              {/* Card Title & Icon Header */}
              <div className="flex items-start space-x-3 pb-4 border-b border-[#f1f5f9]">
                <div className="w-9 h-9 rounded-xl bg-[#fef3c7] text-[#b8860b] border border-[#fde68a] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <svg className="w-4 h-4 fill-current ml-0.5" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold font-sans text-[#0f172a]">
                    Add New {shortsSubTab === "PODCAST" ? "Podcast Audio" : "Short / Reel Video"}
                  </h3>
                  <p className="text-xs text-[#64748b] mt-0.5 font-sans">
                    {shortsSubTab === "PODCAST"
                      ? "Paste any Apple Podcasts, Spotify, or YouTube Music link."
                      : "Paste any YouTube, Rumble, Instagram, or Facebook link — platform and thumbnails are detected automatically."}
                  </p>
                </div>
              </div>

              {shortSuccessMsg && (
                <div className="bg-[#ecfdf5] border border-[#a7f3d0] text-[#047857] px-4 py-3 rounded-2xl text-xs font-sans font-bold flex items-center space-x-2">
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span>{shortSuccessMsg}</span>
                </div>
              )}

              <form onSubmit={handleSaveShortSlot} className="space-y-6">
                {/* Row 1: VIDEO URL (70%) + PLATFORM (30%) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  <div className="lg:col-span-8">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-[10px] font-mono font-bold text-[#64748b] uppercase tracking-wider">
                        URL <span className="text-red-500">*</span>
                      </label>
                      <button
                        type="button"
                        disabled={isFetchingVideoDetails}
                        onClick={() => {
                          if (shortVideoUrl) autoFetchVideoDetails(shortVideoUrl);
                        }}
                        className="text-[11px] font-sans font-bold text-[#b8860b] hover:underline flex items-center space-x-1.5 cursor-pointer disabled:opacity-70"
                      >
                        {isFetchingVideoDetails ? (
                          <>
                            <svg className="w-3.5 h-3.5 animate-spin text-[#b8860b]" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Fetching Details...</span>
                          </>
                        ) : (
                          <span>✨ Auto-Fetch Title, Image & Duration</span>
                        )}
                      </button>
                    </div>
                    <input
                      type="text"
                      value={shortVideoUrl}
                      onChange={handleShortUrlChange}
                      placeholder={
                        shortsSubTab === "PODCAST"
                          ? "e.g. https://podcasts.apple.com/us/podcast/... or https://open.spotify.com/episode/..."
                          : "e.g. https://www.youtube.com/shorts/... or https://rumble.com/... or https://instagram.com/reel/..."
                      }
                      className="w-full text-xs bg-[#f8fafc] border border-[#e2e8f0] focus:border-[#b8860b] focus:bg-white rounded-xl px-4 py-2.5 transition-all text-[#0f172a] font-sans placeholder:text-[#94a3b8]"
                      required
                    />
                    <p className="text-[10px] text-[#94a3b8] mt-1 font-sans">
                      {shortsSubTab === "PODCAST"
                        ? "Supports Apple Podcasts, Spotify, and YouTube Music."
                        : "Supports YouTube Shorts, Rumble videos, Instagram Reels, and Facebook Reels."}
                    </p>
                  </div>

                  <div className="lg:col-span-4">
                    <label className="block text-[10px] font-mono font-bold text-[#64748b] mb-1.5 uppercase tracking-wider">
                      PLATFORM
                    </label>
                    <select
                      value={shortPlatform}
                      onChange={(e) => setShortPlatform(e.target.value as any)}
                      className="w-full text-xs bg-[#f8fafc] border border-[#e2e8f0] focus:border-[#b8860b] focus:bg-white rounded-xl px-4 py-2.5 text-[#0f172a] font-sans font-medium cursor-pointer"
                    >
                      {shortsSubTab === "PODCAST" ? (
                        <>
                          <option value="Apple Podcasts">Apple Podcasts</option>
                          <option value="Spotify">Spotify</option>
                          <option value="YouTube Music">YouTube Music</option>
                        </>
                      ) : (
                        <>
                          <option value="Youtube Video">Youtube Video</option>
                          <option value="Rumble Video">Rumble Video</option>
                          <option value="Facebook Short">Facebook Short</option>
                          <option value="Instagram shorts">Instagram shorts</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>

                {/* Row 2: VIDEO TITLE / HEADLINE */}
                <div>
                  <label className="block text-[10px] font-mono font-bold text-[#64748b] mb-1.5 uppercase tracking-wider">
                    TITLE / HEADLINE <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={shortTitle}
                    onChange={(e) => setShortTitle(e.target.value)}
                    placeholder="e.g. Supreme Court Hearing Highlights & Legal Analysis"
                    className="w-full text-xs bg-[#f8fafc] border border-[#e2e8f0] focus:border-[#b8860b] focus:bg-white rounded-xl px-4 py-2.5 transition-all text-[#0f172a] font-sans placeholder:text-[#94a3b8]"
                    required
                  />
                </div>

                {/* Row 3: 2-COLUMN SPLIT (Form Controls Left vs Live Feed Preview & Add Button Right) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                  {/* Left Column Controls */}
                  <div className="lg:col-span-8 space-y-4 font-sans flex flex-col justify-between">
                    {/* Row 1: Cover Image / Thumbnail URL Input */}
                    <div>
                      <label className="block text-[10px] font-mono font-bold text-[#64748b] mb-1.5 uppercase tracking-wider">
                        COVER IMAGE / THUMBNAIL URL
                      </label>
                      <input
                        type="text"
                        value={shortThumbnailUrl}
                        onChange={(e) => setShortThumbnailUrl(e.target.value)}
                        placeholder="e.g. https://images.unsplash.com/... or auto-fetched YouTube thumbnail"
                        className="w-full text-xs bg-[#f8fafc] border border-[#e2e8f0] focus:border-[#b8860b] focus:bg-white rounded-xl px-4 py-2.5 transition-all text-[#0f172a] font-sans placeholder:text-[#94a3b8]"
                      />
                    </div>

                    {/* Row 2: Custom Thumbnail Upload */}
                    <div>
                      <label className="block text-[10px] font-mono font-bold text-[#64748b] mb-1.5 uppercase tracking-wider">
                        OR UPLOAD CUSTOM THUMBNAIL
                      </label>
                      <div className="flex items-center space-x-3">
                        <label className="bg-white hover:bg-slate-50 border border-[#cbd5e1] text-[#334155] font-bold text-xs px-4 py-2 rounded-xl transition-colors cursor-pointer shadow-2xs">
                          <span>Choose File</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleShortThumbnailUpload}
                            className="hidden"
                          />
                        </label>
                        <span className="text-xs text-[#94a3b8] font-sans">No file chosen</span>
                      </div>
                    </div>

                    {/* Row 3: 3-Column Inputs: Duration, Target Slot, Status */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono font-bold text-[#64748b] mb-1.5 uppercase tracking-wider">
                          DURATION (AUTO)
                        </label>
                        <input
                          type="text"
                          value={shortDuration}
                          onChange={(e) => setShortDuration(e.target.value)}
                          placeholder="e.g. 0:45"
                          className="w-full text-xs bg-[#f8fafc] border border-[#e2e8f0] focus:border-[#b8860b] focus:bg-white rounded-xl px-4 py-2.5 text-[#0f172a] font-sans"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono font-bold text-[#64748b] mb-1.5 uppercase tracking-wider">
                          TARGET SLOT (1 TO {getMaxSlotsForSubTab()})
                        </label>
                        <select
                          value={shortTargetSlot}
                          onChange={(e) => setShortTargetSlot(Number(e.target.value))}
                          className="w-full text-xs bg-[#f8fafc] border border-[#e2e8f0] focus:border-[#b8860b] focus:bg-white rounded-xl px-4 py-2.5 text-[#0f172a] font-sans font-bold cursor-pointer"
                        >
                          {Array.from({ length: getMaxSlotsForSubTab() }, (_, i) => i + 1).map((num) => {
                            const existing = getCurrentShortsList().find((s) => s.slotNumber === num);
                            const isOccupied = Boolean(existing && existing.videoUrl && existing.title && !existing.title.includes("[Empty Slot"));
                            const truncatedTitle = existing && existing.title ? (existing.title.length > 25 ? `${existing.title.slice(0, 25)}...` : existing.title) : "";
                            return (
                              <option key={num} value={num}>
                                {isOccupied
                                  ? `Slot #${num} (Occupied: "${truncatedTitle}" - replaces old video)`
                                  : `Slot #${num} (Available / Empty)`}
                              </option>
                            );
                          })}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono font-bold text-[#64748b] mb-1.5 uppercase tracking-wider">
                          STATUS
                        </label>
                        <select
                          value={shortStatus}
                          onChange={(e) => setShortStatus(e.target.value as any)}
                          className="w-full text-xs bg-[#f8fafc] border border-[#e2e8f0] focus:border-[#b8860b] focus:bg-white rounded-xl px-4 py-2.5 text-[#0f172a] font-sans cursor-pointer font-bold"
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </div>
                    </div>

                    {/* Row 4: Yellow Lightbulb Alert Banner (Matching Reference Exactly) */}
                    <div className="bg-[#fffbeb] border border-[#fef3c7] text-[#92400e] p-3.5 rounded-2xl text-xs font-sans font-medium flex items-start space-x-3 mt-auto">
                      <span className="text-base shrink-0 mt-0.5">💡</span>
                      <div className="text-xs leading-relaxed text-[#78350f]">
                        <span className="font-bold text-[#92400e]">Strict 1 Video Per Slot: </span>
                        <span>Each slot (1 to {getMaxSlotsForSubTab()}) holds only 1 video. If you assign a video to an already occupied slot, the previous video will automatically be removed and replaced by the new video.</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column Preview Box & Action Button (Matching Reference Exactly) */}
                  <div className="lg:col-span-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl p-4 text-center flex flex-col items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-[#64748b] uppercase tracking-wider block mb-3">
                        LIVE FEED PREVIEW
                      </span>

                      {/* Vertical Preview Card (150px width matching reference sheet) */}
                      <div className="relative w-[150px] aspect-[9/15] rounded-2xl overflow-hidden shadow-lg border border-slate-700 group bg-black text-left mx-auto">
                        {shortThumbnailUrl.trim() ? (
                          <img
                            src={shortThumbnailUrl.trim()}
                            alt=""
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).style.display = "none";
                            }}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-black" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent p-3 flex flex-col justify-between text-white">
                          {/* Top-Left Platform Badge */}
                          <div>
                            <span
                              className={`text-[8px] font-extrabold font-mono px-1.5 py-0.5 rounded-md uppercase tracking-wider text-white shadow-xs ${
                                shortPlatform === "Instagram shorts"
                                  ? "bg-gradient-to-r from-purple-600 via-pink-600 to-red-500"
                                  : shortPlatform === "Youtube Video"
                                  ? "bg-red-600"
                                  : shortPlatform === "Rumble Video"
                                  ? "bg-emerald-500 text-black font-bold"
                                  : shortPlatform === "Facebook Short"
                                  ? "bg-blue-600"
                                  : shortPlatform === "Apple Podcasts"
                                  ? "bg-purple-700 font-bold"
                                  : shortPlatform === "Spotify"
                                  ? "bg-emerald-600 font-bold"
                                  : shortPlatform === "YouTube Music"
                                  ? "bg-red-700 font-bold"
                                  : shortPlatform === "Amazon Music"
                                  ? "bg-sky-600 font-bold"
                                  : "bg-purple-700 font-bold"
                              }`}
                            >
                              {shortPlatform === "Instagram shorts"
                                ? "INSTAGRAM"
                                : shortPlatform === "Youtube Video"
                                ? "YOUTUBE"
                                : shortPlatform === "Rumble Video"
                                ? "RUMBLE"
                                : shortPlatform === "Facebook Short"
                                ? "FACEBOOK"
                                : shortPlatform === "Apple Podcasts"
                                ? "APPLE PODCASTS"
                                : shortPlatform === "Spotify"
                                ? "SPOTIFY"
                                : shortPlatform === "YouTube Music"
                                ? "YOUTUBE MUSIC"
                                : shortPlatform === "Amazon Music"
                                ? "AMAZON MUSIC"
                                : String(shortPlatform || "PODCAST").toUpperCase()}
                            </span>
                          </div>

                          {/* Center Play Circle */}
                          <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-xs border border-white/60 flex items-center justify-center mx-auto my-auto text-white shadow-md">
                            <svg className="w-3.5 h-3.5 fill-current ml-0.5" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>

                          {/* Bottom Title & Duration */}
                          <div className="space-y-0.5">
                            <p className="text-[11px] font-sans font-bold leading-snug line-clamp-2 drop-shadow-md text-white">
                              {shortTitle || "Short Video Title"}
                            </p>
                            <div className="flex items-center space-x-1 text-[9px] font-mono text-white/80">
                              <span>▶</span>
                              <span>{shortDuration || "0:45"}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Submit Action Button BELOW Live Feed Preview (Matching Reference Exactly) */}
                    <button
                      type="submit"
                      className="w-full bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold py-3.5 px-4 rounded-2xl transition-all cursor-pointer shadow-md flex items-center justify-center space-x-2 text-xs uppercase tracking-wider font-sans mt-4"
                    >
                      <span>{editingSlotNumber ? `UPDATE SLOT #${editingSlotNumber}` : "ADD TO FEED"}</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* INNER CARD 2: Current Shorts & Reels Slots (Matching Image 1) */}
            <div className="bg-white rounded-2xl p-6 border border-[#e2e8f0] shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-4">
                <div>
                  <h3 className="text-base font-bold font-sans text-[#0f172a]">
                    Current {shortsSubTab === "PODCAST" ? "Podcast Slots" : "Shorts & Reels Slots"} ({getMaxSlotsForSubTab()} Dedicated Slots)
                  </h3>
                  <p className="text-xs text-[#64748b] mt-0.5 font-sans">Manage live homepage feed slots across all platforms.</p>
                </div>
                <span className="text-[10px] font-mono font-bold px-3 py-1 rounded-full bg-[#f1f5f9] text-[#475569] border border-[#e2e8f0]">
                  {getCurrentShortsList().filter((s) => s.status === "Active" && s.videoUrl).length} / {getMaxSlotsForSubTab()} Active
                </span>
              </div>

              {/* Grid of Dedicated Slots (Exactly 4 Cards Per Row) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
                {Array.from({ length: getMaxSlotsForSubTab() }, (_, i) => i + 1).map((slotNum) => {
                  const slotItem = getCurrentShortsList().find((s) => s.slotNumber === slotNum) || {
                    id: `slot_${slotNum}`,
                    slotNumber: slotNum,
                    videoUrl: "",
                    platform: "Youtube Video" as const,
                    title: `[Empty Slot #${slotNum}]`,
                    thumbnailUrl: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=600&q=80",
                    duration: "0:00",
                    status: "Inactive" as const,
                  };

                  const isOccupied = Boolean(slotItem.videoUrl && slotItem.title && !slotItem.title.includes("[Empty Slot"));

                  const platformBadgeText =
                    slotItem.platform === "Youtube Video" || slotItem.platform === "YouTube Shorts"
                      ? "YOUTUBE"
                      : slotItem.platform === "Instagram shorts"
                      ? "INSTAGRAM"
                      : slotItem.platform === "Rumble Video"
                      ? "RUMBLE"
                      : slotItem.platform === "Facebook Short"
                      ? "FACEBOOK"
                      : slotItem.platform === "Apple Podcasts"
                      ? "APPLE PODCASTS"
                      : slotItem.platform === "Spotify"
                      ? "SPOTIFY"
                      : slotItem.platform === "YouTube Music"
                      ? "YOUTUBE MUSIC"
                      : slotItem.platform === "Amazon Music"
                      ? "AMAZON MUSIC"
                      : String(slotItem.platform || "PODCAST").toUpperCase();

                  return (
                    <div
                      key={slotNum}
                      className={`bg-white border ${
                        editingSlotNumber === slotNum ? "border-[#b8860b] ring-2 ring-[#b8860b]/20" : "border-[#e2e8f0]"
                      } hover:border-[#b8860b]/60 rounded-2xl p-3.5 transition-all shadow-2xs flex flex-col justify-between group`}
                    >
                      {/* Top Horizontal Content Split */}
                      <div className="flex items-start space-x-3 mb-3">
                        {/* Left Vertical Thumbnail Box with Top-Left Platform Badge */}
                        <div className="relative w-20 h-32 rounded-xl overflow-hidden shrink-0 border border-[#e2e8f0] bg-slate-900 shadow-2xs">
                          <img
                            src={slotItem.thumbnailUrl}
                            alt=""
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=600&q=80";
                            }}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {/* Overlaid Platform Badge on Top-Left of Thumbnail */}
                          <span
                            className={`absolute top-1 left-1 text-[8px] font-mono font-black uppercase px-1 py-0.5 rounded-xs shadow-xs tracking-wider z-10 ${
                              slotItem.platform === "Instagram shorts"
                                ? "bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 text-white"
                                : slotItem.platform === "Youtube Video" || slotItem.platform === "YouTube Shorts"
                                ? "bg-red-600 text-white"
                                : slotItem.platform === "Rumble Video"
                                ? "bg-emerald-500 text-black font-bold"
                                : slotItem.platform === "Facebook Short"
                                ? "bg-blue-600 text-white"
                                : slotItem.platform === "Apple Podcasts"
                                ? "bg-purple-700 text-white font-bold"
                                : slotItem.platform === "Spotify"
                                ? "bg-emerald-600 text-white font-bold"
                                : slotItem.platform === "YouTube Music"
                                ? "bg-red-700 text-white font-bold"
                                : slotItem.platform === "Amazon Music"
                                ? "bg-sky-600 text-white font-bold"
                                : "bg-slate-700 text-white"
                            }`}
                          >
                            {platformBadgeText}
                          </span>
                        </div>

                        {/* Right Details Column */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between h-36 py-0.5">
                          {/* Top Badges: ACTIVE + Slot #X */}
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                                slotItem.status === "Active"
                                  ? "bg-[#dcfce7] text-[#15803d]"
                                  : "bg-slate-100 text-slate-500"
                              }`}
                            >
                              {slotItem.status}
                            </span>

                            <span className="text-xs font-mono font-medium px-2.5 py-0.5 bg-[#fef9c3] text-[#854d0e] border border-[#fef08a] rounded-md shadow-2xs">
                              slot #{slotNum}
                            </span>
                          </div>

                          {/* Headline / Title */}
                          <h4 className="text-xs sm:text-sm font-sans font-bold text-[#0f172a] line-clamp-3 leading-snug my-1">
                            {slotItem.title}
                          </h4>

                          {/* Duration & Watch Link */}
                          <div className="flex items-center justify-between text-xs pt-1">
                            <div className="flex items-center space-x-1 text-[#94a3b8] font-mono font-medium">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>{slotItem.duration}</span>
                            </div>

                            {isOccupied ? (
                              <a
                                href={slotItem.videoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-bold font-sans text-[#f97316] hover:underline flex items-center space-x-0.5"
                              >
                                <span>Watch</span>
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H18m0 0v4.5m0-4.5L11.25 12.75" />
                                </svg>
                              </a>
                            ) : (
                              <span className="text-xs font-mono text-[#94a3b8]">Empty</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Bottom Divider Line & Action Buttons (EDIT & DELETE) */}
                      <div className="border-t border-[#f1f5f9] pt-3 mt-1 flex items-center justify-end space-x-2.5">
                        <button
                          type="button"
                          onClick={() => handleEditShortSlot(slotItem)}
                          className="text-xs font-bold font-sans text-[#334155] hover:text-[#0f172a] bg-[#f1f5f9] hover:bg-[#e2e8f0] px-4 py-1.5 rounded-xl transition-colors cursor-pointer flex items-center space-x-1.5 shadow-2xs"
                        >
                          <svg className="w-3.5 h-3.5 stroke-current" fill="none" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                          </svg>
                          <span>EDIT</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteShortSlot(slotNum)}
                          className="text-xs font-bold font-sans text-[#dc2626] hover:text-[#b91c1c] bg-[#fef2f2] hover:bg-[#fee2e2] px-4 py-1.5 rounded-xl transition-colors cursor-pointer flex items-center space-x-1.5 shadow-2xs"
                        >
                          <svg className="w-3.5 h-3.5 stroke-current" fill="none" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                          <span>DELETE</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* Placeholder View for Other Sidebar Tabs */
          <div className="bg-white rounded-3xl p-8 border border-[#e5e7eb] shadow-2xs min-h-[400px] flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-[#f3f4f6] text-[#374151] border border-[#e5e7eb] rounded-2xl flex items-center justify-center mb-4">
              <svg
                width={32}
                height={32}
                style={{ width: "32px", height: "32px", minWidth: "32px", minHeight: "32px" }}
                className="shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[#374151]">{activeTab} Management</h2>
            <p className="text-xs text-[#6b7280] mt-1 max-w-md">
              Manage all {activeTab.toLowerCase()} settings and records from your administrator portal.
            </p>
            <button
              onClick={() => setActiveTab("Overview")}
              className="mt-5 text-xs font-bold text-[#374151] hover:underline"
            >
              {"\u2190"} Return to Workspace Overview
            </button>
          </div>
        )}
      </main>

      {/* ================================================================= */}
      {/* MODAL 1: ADD NEW USER MODAL (Image 2)                            */}
      {/* ================================================================= */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200 font-sans">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <svg className="w-5 h-5 text-[#ea580c] stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                <h3 className="font-serif text-lg font-bold text-[#111827]">
                  Add New User
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddUserModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {addUserError && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold p-3 rounded-xl">
                {addUserError}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono font-bold text-[#6b7280] uppercase tracking-wider mb-1.5">
                  USER NAME
                </label>
                <input
                  type="text"
                  placeholder="e.g. Richard Hendricks"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full bg-white border border-[#d1d5db] rounded-2xl px-4 py-3 text-xs text-[#111827] outline-none focus:border-[#ea580c] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-[#6b7280] uppercase tracking-wider mb-1.5">
                  USER EMAIL
                </label>
                <input
                  type="email"
                  placeholder="e.g. richard@washington-times.com"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full bg-white border border-[#d1d5db] rounded-2xl px-4 py-3 text-xs text-[#111827] outline-none focus:border-[#ea580c] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-[#6b7280] uppercase tracking-wider mb-1.5">
                  USER PASSWORD
                </label>
                <input
                  type="password"
                  placeholder="Create user passcode"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  className="w-full bg-white border border-[#d1d5db] rounded-2xl px-4 py-3 text-xs text-[#111827] outline-none focus:border-[#ea580c] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-[#6b7280] uppercase tracking-wider mb-1.5">
                  WORKSPACE ROLE
                </label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as any)}
                  className="w-full bg-white border border-[#ea580c] rounded-2xl px-4 py-3 text-xs font-semibold text-[#111827] outline-none focus:border-[#ea580c] transition-colors cursor-pointer"
                >
                  {isLoggedInUserDefaultAdmin && <option value="admin">Admin</option>}
                  <option value="writer">Writer</option>
                  <option value="reader">Reader</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="w-full bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#475569] font-bold text-xs uppercase tracking-wider py-3 rounded-2xl transition-colors cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingUser}
                  className="w-full bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-xs uppercase tracking-wider py-3 rounded-2xl transition-colors cursor-pointer shadow-2xs"
                >
                  {isSubmittingUser ? "CREATING..." : "CREATE USER"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL 2: VIEW PROFILE DETAILS MODAL (Image 3)                    */}
      {/* ================================================================= */}
      {showViewUserModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200 font-sans">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-[#2563eb]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12c.077-.19.152-.38.228-.568C3.805 7.699 7.55 5 12 5c4.45 0 8.195 2.699 9.736 6.432.076.188.151.378.228.568-.077.19-.152.38-.228.568C20.195 16.301 16.45 19 12 19c-4.45 0-8.195-2.699-9.736-6.432a13.313 13.313 0 01-.228-.568z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <h3 className="font-serif text-lg font-bold text-[#111827]">
                  Profile Details
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowViewUserModal(null)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Profile Info Header Card */}
            <div className="flex items-center space-x-4 mb-6">
              {showViewUserModal.avatar_url ? (
                <img
                  src={showViewUserModal.avatar_url}
                  alt={showViewUserModal.full_name}
                  className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shrink-0 shadow-2xs"
                />
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-[#ea580c] text-white flex items-center justify-center font-extrabold text-base shrink-0 shadow-2xs">
                  {showViewUserModal.full_name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "US"}
                </div>
              )}
              <div>
                <h4 className="font-serif font-bold text-base text-[#0f172a] leading-tight">
                  {showViewUserModal.full_name}
                </h4>
                <div className="mt-1.5">
                  {showViewUserModal.role?.toLowerCase() === "admin" ? (
                    <span className="border border-[#f87171] text-[#dc2626] bg-[#fef2f2] text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block">
                      ADMIN
                    </span>
                  ) : showViewUserModal.role?.toLowerCase() === "writer" ? (
                    <span className="border border-[#60a5fa] text-[#2563eb] bg-[#eff6ff] text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block">
                      WRITER
                    </span>
                  ) : (
                    <span className="border border-[#9ca3af] text-[#4b5563] bg-[#f3f4f6] text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block">
                      READER
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Details List */}
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono font-bold text-[#94a3b8] uppercase tracking-wider mb-1">
                  EMAIL
                </label>
                <div className="flex items-center space-x-2 text-xs font-semibold text-[#334155]">
                  <svg className="w-4 h-4 text-[#64748b]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                  <span>{showViewUserModal.email}</span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-[#94a3b8] uppercase tracking-wider mb-1">
                  BIO
                </label>
                <div className="bg-[#f8fafc] border border-slate-100 p-3.5 rounded-2xl text-xs text-[#334155] leading-relaxed">
                  {showViewUserModal.bio || "New Washington Times subscriber via Google."}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-[#94a3b8] uppercase tracking-wider mb-1">
                  LINKEDIN
                </label>
                <div className="text-xs font-semibold text-[#64748b]">
                  {showViewUserModal.linkedin ? (
                    <a
                      href={showViewUserModal.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#2563eb] hover:underline"
                    >
                      {showViewUserModal.linkedin}
                    </a>
                  ) : (
                    "Not linked."
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer Close Button */}
            <div className="mt-6 pt-2">
              <button
                type="button"
                onClick={() => setShowViewUserModal(null)}
                className="w-full border border-slate-300 hover:bg-slate-50 text-[#334155] font-bold text-xs uppercase tracking-wider py-3 rounded-2xl transition-colors cursor-pointer text-center"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL 3: EDIT USER MODAL                                          */}
      {/* ================================================================= */}
      {showEditUserModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200 font-sans">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <svg className="w-5 h-5 text-[#ea580c]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                </svg>
                <h3 className="font-serif text-lg font-bold text-[#111827]">
                  Edit User Settings
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowEditUserModal(null)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {editUserError && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold p-3 rounded-xl">
                {editUserError}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSaveEditUser} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono font-bold text-[#6b7280] uppercase tracking-wider mb-1.5">
                  USER NAME
                </label>
                <input
                  type="text"
                  value={editUserName}
                  onChange={(e) => setEditUserName(e.target.value)}
                  className="w-full bg-white border border-[#d1d5db] rounded-2xl px-4 py-3 text-xs text-[#111827] outline-none focus:border-[#ea580c] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-[#6b7280] uppercase tracking-wider mb-1.5">
                  USER EMAIL
                </label>
                <input
                  type="email"
                  value={editUserEmail}
                  onChange={(e) => setEditUserEmail(e.target.value)}
                  className="w-full bg-white border border-[#d1d5db] rounded-2xl px-4 py-3 text-xs text-[#111827] outline-none focus:border-[#ea580c] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-[#6b7280] uppercase tracking-wider mb-1.5">
                  USER PASSWORD (LEAVE BLANK TO KEEP UNCHANGED)
                </label>
                <div className="relative">
                  <input
                    type={showEditUserPasswordText ? "text" : "password"}
                    placeholder="Create new user passcode"
                    value={editUserPassword}
                    onChange={(e) => setEditUserPassword(e.target.value)}
                    className="w-full bg-white border border-[#d1d5db] rounded-2xl px-4 py-3 pr-10 text-xs text-[#111827] outline-none focus:border-[#ea580c] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowEditUserPasswordText(!showEditUserPasswordText)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer"
                    title={showEditUserPasswordText ? "Hide password" : "Show password"}
                  >
                    {showEditUserPasswordText ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12c.077-.19.152-.38.228-.568C3.805 7.699 7.55 5 12 5c4.45 0 8.195 2.699 9.736 6.432.076.188.151.378.228.568-.077.19-.152.38-.228.568C20.195 16.301 16.45 19 12 19c-4.45 0-8.195-2.699-9.736-6.432a13.313 13.313 0 01-.228-.568z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-[#6b7280] uppercase tracking-wider mb-1.5">
                  WORKSPACE ROLE
                </label>
                <select
                  value={editUserRole}
                  onChange={(e) => setEditUserRole(e.target.value as any)}
                  className="w-full bg-white border border-[#d1d5db] rounded-2xl px-4 py-3 text-xs font-semibold text-[#111827] outline-none focus:border-[#ea580c] transition-colors cursor-pointer"
                >
                  {(isLoggedInUserDefaultAdmin || showEditUserModal.role?.toLowerCase() === "admin") && (
                    <option value="admin">Admin</option>
                  )}
                  <option value="writer">Writer</option>
                  <option value="reader">Reader</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditUserModal(null)}
                  className="w-full bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#475569] font-bold text-xs uppercase tracking-wider py-3 rounded-2xl transition-colors cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingEditUser}
                  className="w-full bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-xs uppercase tracking-wider py-3 rounded-2xl transition-colors cursor-pointer shadow-2xs"
                >
                  {isSubmittingEditUser ? "SAVING..." : "SAVE CHANGES"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE USER POPUP MODAL */}
      {userToDelete && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-left font-sans animate-in fade-in zoom-in duration-150 border border-slate-100">
            <div className="flex items-center space-x-3 text-red-600 border-b border-gray-100 pb-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 leading-tight">Confirm Account Deletion</h3>
                <p className="text-xs text-gray-500 font-normal">This action cannot be undone.</p>
              </div>
            </div>

            <div className="py-2 text-sm text-slate-700 leading-relaxed">
              Are you sure you want to delete the user account for <strong className="font-extrabold text-slate-900">{userToDelete.full_name}</strong> (<span className="font-mono text-xs text-slate-600">{userToDelete.email}</span>)?
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-full cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const email = userToDelete.email;
                  setUserToDelete(null);
                  handleDeleteUser(email);
                }}
                className="px-5 py-2 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors cursor-pointer shadow-sm"
              >
                Yes, Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AD SAVED SUCCESS POPUP MODAL */}
      {adSavedPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150 font-sans">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-5 text-center border border-slate-100 animate-in zoom-in-95 duration-150">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <svg className="w-9 h-9 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 leading-tight">Ad Saved Successfully</h3>
              <p className="text-xs text-slate-600 font-medium mt-2 leading-relaxed">
                {adSavedPopup}
              </p>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setAdSavedPopup(null)}
                className="w-full bg-[#b8860b] hover:bg-[#a07409] text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-2xl transition-colors cursor-pointer shadow-md"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN GENERAL NOTICE POPUP MODAL */}
      {adminNoticePopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150 font-sans">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-5 text-center border border-slate-100 animate-in zoom-in-95 duration-150">
            <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
              <svg className="w-7 h-7 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 leading-tight">Notice</h3>
              <p className="text-xs text-slate-600 font-medium mt-2 leading-relaxed">
                {adminNoticePopup}
              </p>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setAdminNoticePopup(null)}
                className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-2xl transition-colors cursor-pointer shadow-md"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AD DIMENSION MISMATCH NOTICE POPUP MODAL */}
      {adDimensionMismatchPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150 font-sans">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-5 text-center border border-slate-100 animate-in zoom-in-95 duration-150">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
              <svg className="w-8 h-8 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 leading-tight">Image Resolution Notice</h3>
              <div className="text-xs text-slate-600 font-medium mt-3 space-y-2 leading-relaxed bg-amber-50/70 border border-amber-200/60 p-3.5 rounded-2xl text-left">
                <p>
                  Uploaded Image Size: <strong className="font-mono text-amber-900 font-bold">{adDimensionMismatchPopup.uploadedDim}</strong>
                </p>
                <p>
                  Target Slot Size: <strong className="font-mono text-amber-900 font-bold">{adDimensionMismatchPopup.slotDim}</strong> ({adDimensionMismatchPopup.slotName})
                </p>
                <p className="text-[11px] text-amber-800 pt-1 border-t border-amber-200/50">
                  Because the uploaded dimensions do not match the target slot resolution, the image will be stretched to fit the <span className="font-bold">{adDimensionMismatchPopup.slotDim}</span> slot on the website.
                </p>
              </div>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setAdDimensionMismatchPopup(null)}
                className="w-full bg-[#b8860b] hover:bg-[#a07409] text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-2xl transition-colors cursor-pointer shadow-md"
              >
                I UNDERSTAND
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONTACT SUBMISSION DETAILS MODAL (Matching Image 1) */}
      {selectedContactModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 font-sans">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl space-y-4 border border-slate-200 animate-in zoom-in-95 duration-150">
            {/* Top Pill Badge + Title + Close Button */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="bg-orange-50 text-orange-600 border border-orange-200 text-[11px] font-bold px-3 py-1 rounded-full inline-block mb-1.5 font-sans">
                  {selectedContactModal.inquiry_type || (selectedContactModal as any).inquiryType || "General / Others"}
                </span>
                <h3 className="text-xl font-bold text-[#0f172a] font-sans">
                  Query Detail Submission
                </h3>
                <p className="text-xs text-slate-400 font-sans mt-0.5">
                  {formatModalSubmittedDate(selectedContactModal.created_at)}
                </p>
              </div>

              <button
                onClick={() => setSelectedContactModal(null)}
                className="text-slate-400 hover:text-slate-700 transition-colors p-1 cursor-pointer"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Grid Layout (2 Columns) */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-xs font-sans">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                  SUBMITTER NAME
                </span>
                <span className="font-bold text-slate-900 text-sm block">
                  {selectedContactModal.name}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                  COMPANY
                </span>
                <span className="font-bold text-slate-900 text-sm block">
                  {selectedContactModal.company || "N/A"}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                  EMAIL ADDRESS
                </span>
                <span className="font-bold text-[#00558c] font-mono text-xs block">
                  {selectedContactModal.email}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                  STATUS
                </span>
                <select
                  value={selectedContactModal.status || "New"}
                  onChange={(e) => {
                    const newStatus = e.target.value;
                    handleUpdateContactStatus(selectedContactModal.id, newStatus);
                    setSelectedContactModal({ ...selectedContactModal, status: newStatus });
                  }}
                  className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#00558c] cursor-pointer"
                >
                  <option value="New">New</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>

              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                  PHONE NUMBER
                </span>
                <span className="font-semibold text-slate-800 text-xs block">
                  {selectedContactModal.phone || "N/A"}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                  WHATSAPP
                </span>
                <span className="font-semibold text-slate-800 text-xs block">
                  {selectedContactModal.whatsapp || "N/A"}
                </span>
              </div>
            </div>

            {/* QUESTION / MESSAGE DETAILS */}
            <div className="pt-1">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
                QUESTION / MESSAGE DETAILS
              </span>
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl text-xs text-slate-800 leading-relaxed font-sans min-h-[70px] whitespace-pre-wrap">
                {selectedContactModal.details || selectedContactModal.message}
              </div>
            </div>

            {/* Modal Footer Buttons Row */}
            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => {
                  handleDeleteContactSubmission(selectedContactModal.id);
                  setSelectedContactModal(null);
                }}
                className="bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
              >
                DELETE MESSAGE
              </button>
              <button
                onClick={() => setSelectedContactModal(null)}
                className="bg-[#0f172a] hover:bg-slate-800 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-colors cursor-pointer"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADVERTISE LEAD DETAILS MODAL (Matching Image 2) */}
      {selectedAdvertiseModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 font-sans">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl space-y-4 border border-slate-200 animate-in zoom-in-95 duration-150">
            {/* Top Pill Badge + Title + Close Button */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="bg-sky-50 text-sky-600 border border-sky-200 text-[11px] font-bold px-3 py-1 rounded-full inline-block mb-1.5 font-sans">
                  {selectedAdvertiseModal.service_option || (selectedAdvertiseModal as any).serviceOption || "Publish Company Article"}
                </span>
                <h3 className="text-xl font-bold text-[#0f172a] font-sans">
                  Client Lead Details
                </h3>
                <p className="text-xs text-slate-400 font-sans mt-0.5">
                  {formatModalSubmittedDate(selectedAdvertiseModal.created_at)}
                </p>
              </div>

              <button
                onClick={() => setSelectedAdvertiseModal(null)}
                className="text-slate-400 hover:text-slate-700 transition-colors p-1 cursor-pointer"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Grid Layout (2 Columns) */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-xs font-sans">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                  CLIENT NAME
                </span>
                <span className="font-bold text-slate-900 text-sm block">
                  {selectedAdvertiseModal.name}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                  COMPANY
                </span>
                <span className="font-bold text-slate-900 text-sm block">
                  {selectedAdvertiseModal.company || "N/A"}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                  EMAIL ADDRESS
                </span>
                <span className="font-bold text-[#00558c] font-mono text-xs block">
                  {selectedAdvertiseModal.email}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                  STATUS
                </span>
                <select
                  value={selectedAdvertiseModal.status || "New"}
                  onChange={(e) => {
                    const newStatus = e.target.value;
                    handleUpdateAdvertiseStatus(selectedAdvertiseModal.id, newStatus);
                    setSelectedAdvertiseModal({ ...selectedAdvertiseModal, status: newStatus });
                  }}
                  className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#00558c] cursor-pointer"
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Proposal Sent">Proposal Sent</option>
                  <option value="Won">Won</option>
                  <option value="Lost">Lost</option>
                </select>
              </div>

              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                  PHONE NUMBER
                </span>
                <span className="font-semibold text-slate-800 text-xs block">
                  {selectedAdvertiseModal.phone || "N/A"}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                  WHATSAPP
                </span>
                <span className="font-semibold text-slate-800 text-xs block">
                  {selectedAdvertiseModal.whatsapp || "N/A"}
                </span>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div>
                  <span className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">NAME</span>
                  <span className="font-bold text-sm text-slate-900">{selectedAdvertiseModal.name || "N/A"}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">COMPANY</span>
                  <span className="font-bold text-sm text-slate-900">{selectedAdvertiseModal.company || "N/A"}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">EMAIL</span>
                  <span className="font-medium text-xs text-slate-700">{selectedAdvertiseModal.email || "N/A"}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">PHONE</span>
                  <span className="font-medium text-xs text-slate-700">{selectedAdvertiseModal.phone || "N/A"}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div>
                  <span className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">SERVICE OPTION</span>
                  <span className="font-bold text-xs text-sky-700">{selectedAdvertiseModal.service_option || "Sponsored Content"}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">BUDGET RANGE</span>
                  <span className="font-bold text-xs text-slate-900">{selectedAdvertiseModal.budget_range || "N/A"}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">TARGET WEBSITE</span>
                  <span className="font-medium text-xs text-slate-700 truncate block">{selectedAdvertiseModal.target_website || "N/A"}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">TIMELINE</span>
                  <span className="font-medium text-xs text-slate-700">{selectedAdvertiseModal.timeline || "N/A"}</span>
                </div>
              </div>

              <div>
                <span className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1.5">STATUS</span>
                <select
                  value={selectedAdvertiseModal.status || "NEW LEAD"}
                  onChange={(e) => handleUpdateAdvertiseStatus(selectedAdvertiseModal.id, e.target.value)}
                  className="w-full bg-white border border-slate-200 text-xs font-bold text-slate-800 rounded-xl px-3 py-2 outline-none cursor-pointer"
                >
                  <option value="NEW LEAD">NEW LEAD</option>
                  <option value="IN CONTACT">IN CONTACT</option>
                  <option value="PROPOSAL SENT">PROPOSAL SENT</option>
                  <option value="CLOSED">CLOSED</option>
                </select>
              </div>

              <div>
                <span className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1.5">PROJECT REQUIREMENTS</span>
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl text-xs text-slate-800 leading-relaxed font-sans min-h-[70px] whitespace-pre-wrap">
                  {selectedAdvertiseModal.details || selectedAdvertiseModal.requirements}
                </div>
              </div>
            </div>

            {/* Modal Footer Buttons Row */}
            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => confirmDeleteAdvertiseLead(selectedAdvertiseModal)}
                className="bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
              >
                DELETE LEAD
              </button>
              <button
                onClick={() => setSelectedAdvertiseModal(null)}
                className="bg-[#0f172a] hover:bg-slate-800 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-colors cursor-pointer"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Render Profile Settings Modal */}
      <ProfileSettingsModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        currentUser={currentUser}
        onSave={(updated) => {
          setCurrentUser(updated);
          if (typeof window !== "undefined") {
            sessionStorage.setItem("wsj_user", JSON.stringify(updated));
            sessionStorage.setItem("wsj_admin_user", JSON.stringify(updated));
            localStorage.setItem("wsj_user", JSON.stringify(updated));
            window.dispatchEvent(new Event("wsj_user_updated"));
          }
          fetchUsers();
        }}
      />

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
                {deleteConfirmModal.confirmText || "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

