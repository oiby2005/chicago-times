"use client";

import React, { useState } from "react";
import Link from "next/link";

interface ArticleCommentsSectionProps {
  commentCount?: number;
}

export default function ArticleCommentsSection({ commentCount = 0 }: ArticleCommentsSectionProps) {
  const [comments, setComments] = useState<string[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      setComments([...comments, newComment.trim()]);
      setNewComment("");
    }
  };

  return (
    <div className="w-full pt-6 pb-6 border-b border-[#e5e7eb] select-none">
      {/* Header with Speech Bubble Icon */}
      <div className="flex items-center gap-2 mb-4">
        <svg
          className="w-4 h-4 text-[#111111]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        <h3 className="font-bold text-xs sm:text-sm tracking-wider uppercase text-[#111111]">
          COMMENTS ({commentCount + comments.length})
        </h3>
      </div>

      {/* Log in prompt */}
      <div className="mb-3">
        <Link
          href="/sign-in"
          className="font-bold text-xs sm:text-sm text-[#990000] hover:underline cursor-pointer"
        >
          Log in to join the conversation
        </Link>
      </div>

      {/* Empty State message or comments list */}
      {comments.length === 0 ? (
        <p className="font-sans italic text-xs sm:text-sm text-gray-400">
          No comments yet. Be the first to share your thoughts.
        </p>
      ) : (
        <div className="space-y-3 mt-4">
          {comments.map((comment, index) => (
            <div key={index} className="bg-gray-50 p-3 rounded text-xs text-gray-800">
              {comment}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
