"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export interface CommentItem {
  id: string;
  articleSlug?: string;
  authorName: string;
  authorEmail?: string;
  createdAt: string;
  text: string;
}

interface ArticleCommentsSectionProps {
  commentCount?: number;
  articleSlug?: string;
}

const API_BASE_URL = "http://localhost:5000";

export default function ArticleCommentsSection({
  commentCount = 0,
  articleSlug = "default",
}: ArticleCommentsSectionProps) {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const storageKey = `tc_comments_${articleSlug}`;

  // Load active user session
  const loadUser = () => {
    if (typeof window === "undefined") return;
    const tabUser = sessionStorage.getItem("wsj_user") || localStorage.getItem("wsj_user");
    let parsed: any = null;
    if (tabUser) {
      try {
        parsed = JSON.parse(tabUser);
      } catch (e) {}
    }
    if (!parsed) {
      const defaultUserStr = localStorage.getItem("currentUser");
      if (defaultUserStr) {
        try {
          parsed = JSON.parse(defaultUserStr);
        } catch (e) {}
      }
    }
    setCurrentUser(parsed);
  };

  useEffect(() => {
    loadUser();
    const handleUpdate = () => loadUser();
    window.addEventListener("wsj_user_updated", handleUpdate);
    return () => window.removeEventListener("wsj_user_updated", handleUpdate);
  }, []);

  // Fetch comments for this article from backend database API & fallback to localStorage
  useEffect(() => {
    let isMounted = true;
    const fetchCommentsFromDb = async () => {
      // First try local cache so page renders instantly
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem(storageKey);
        if (saved && isMounted) {
          try {
            setComments(JSON.parse(saved));
          } catch (e) {}
        }
      }

      try {
        const res = await fetch(`${API_BASE_URL}/api/comments/${encodeURIComponent(articleSlug)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.comments) && isMounted) {
            setComments(data.comments);
            if (typeof window !== "undefined") {
              localStorage.setItem(storageKey, JSON.stringify(data.comments));
            }
          }
        }
      } catch (err) {
        // Silently use cached comments from localStorage if backend is unreachable
      }
    };

    fetchCommentsFromDb();

    return () => {
      isMounted = false;
    };
  }, [articleSlug, storageKey]);

  const isLoggedIn = currentUser !== null;
  const isAdmin =
    currentUser?.role?.toLowerCase() === "admin" ||
    Boolean(currentUser?.is_default_admin) ||
    ["akramyoonos006@gmail.com", "geethliyanage979@gmail.com", "timeschicago17@gmail.com", "admin@gmail.com"].includes(
      (currentUser?.email || "").toLowerCase()
    );

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !isLoggedIn || isSubmitting) return;

    setIsSubmitting(true);
    const authorName = currentUser.full_name || currentUser.name || currentUser.email?.split("@")[0] || "User";
    const authorEmail = currentUser.email || "";

    const now = new Date();
    const formattedDate = now.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    const tempId = `comment_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const commentObj: CommentItem = {
      id: tempId,
      articleSlug,
      authorName,
      authorEmail,
      createdAt: formattedDate,
      text: newComment.trim(),
    };

    // Optimistic UI update
    setComments((prev) => {
      const updated = [commentObj, ...prev];
      if (typeof window !== "undefined") {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      }
      return updated;
    });

    const commentText = newComment.trim();
    setNewComment("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: tempId,
          articleSlug,
          text: commentText,
          authorName,
          authorEmail,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.comment) {
          // Replace optimistic comment with saved database comment object
          setComments((prev) => {
            const synced = [data.comment, ...prev.filter((c) => c.id !== tempId && c.id !== data.comment.id)];
            if (typeof window !== "undefined") {
              localStorage.setItem(storageKey, JSON.stringify(synced));
            }
            return synced;
          });
        }
      }
    } catch (err) {
      console.error("Failed to save comment to database:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (id: string) => {
    const targetId = String(id).trim();
    // Optimistic deletion
    setComments((prev) => {
      const updated = prev.filter((c) => String(c.id).trim() !== targetId);
      if (typeof window !== "undefined") {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      }
      return updated;
    });

    try {
      const res = await fetch(`${API_BASE_URL}/api/comments/${encodeURIComponent(targetId)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        console.error("Failed to delete comment from backend, status:", res.status);
      }
    } catch (err) {
      console.error("Failed to delete comment from database:", err);
    }
  };

  const totalCommentCount = comments.length > 0 ? comments.length : commentCount;

  return (
    <div className="w-full pb-6 select-none font-sans">
      {/* Header without icon, Georgia font, left aligned */}
      <div className="flex items-center justify-start mb-4 text-left">
        <h3
          className="font-bold text-xs sm:text-sm tracking-wider uppercase text-[#111111]"
          style={{ fontFamily: "Georgia, serif" }}
        >
          COMMENTS ({totalCommentCount})
        </h3>
      </div>

      {/* Input Section or Log In Prompt */}
      {isLoggedIn ? (
        <form onSubmit={handleAddComment} className="flex items-center space-x-2.5 pt-1 mb-4">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            disabled={isSubmitting}
            className="border border-[#cbd5e1] rounded-full px-4 py-2.5 text-xs text-[#1e293b] placeholder-[#94a3b8] focus:outline-none focus:border-slate-500 flex-1 shadow-2xs"
          />
          <button
            type="submit"
            disabled={isSubmitting || !newComment.trim()}
            className="bg-[#71717a] hover:bg-[#52525b] disabled:opacity-50 text-white font-sans font-extrabold text-xs px-6 py-2.5 rounded-xl uppercase tracking-wider transition-colors cursor-pointer shrink-0 shadow-2xs"
          >
            {isSubmitting ? "POSTING..." : "POST"}
          </button>
        </form>
      ) : (
        <div className="mb-4">
          <Link
            href="/signin"
            className="font-bold text-xs sm:text-sm text-[#990000] hover:underline cursor-pointer"
          >
            Log in to join the conversation
          </Link>
        </div>
      )}

      {/* Empty State message or comments list */}
      {comments.length === 0 ? (
        <p
          className="text-xs italic text-[#94a3b8] pt-1 font-serif"
          style={{ fontFamily: "Georgia, serif" }}
        >
          No comments yet. Be the first to share your thoughts.
        </p>
      ) : (
        <div className="space-y-4 mt-4">
          {comments.map((item) => (
            <div key={item.id} className="border-b border-[#f1f5f9] last:border-b-0 pb-3 text-xs text-[#1e293b]">
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center space-x-2 flex-wrap">
                  <span className="font-bold text-[#0f172a] text-xs sm:text-sm">{item.authorName}</span>
                  <span className="text-[11px] text-[#64748b] font-mono">• {item.createdAt}</span>
                </div>
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => handleDeleteComment(item.id)}
                    className="text-[11px] font-bold text-red-600 hover:text-red-700 hover:underline cursor-pointer bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-md transition-colors"
                  >
                    Delete
                  </button>
                )}
              </div>
              <p className="text-xs sm:text-sm text-[#334155] leading-relaxed pt-0.5">{item.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
