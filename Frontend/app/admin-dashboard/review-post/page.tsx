"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAuthorForArticle } from "@/data/authors";

const availableSubCategories = [
  "US",
  "World",
  "Politics",
  "Economy & Finance",
  "Crypto",
  "Technology",
  "Travel",
  "Opinion",
  "CFO Spotlight",
  "Sports",
  "Lifestyle",
  "Real Estate",
];

const DEFAULT_PENDING_ARTICLES: Record<string, any> = {};

const compressImageFile = (file: File, maxWidth = 800, quality = 0.7): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = (e.target?.result as string) || "";
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", quality));
        } else {
          resolve(src);
        }
      };
      img.onerror = () => resolve(src);
      img.src = src;
    };
    reader.onerror = () => resolve("");
    reader.readAsDataURL(file);
  });
};

const safeSavePostsToStorage = (posts: any[]): boolean => {
  if (typeof window === "undefined") return false;

  const sanitizePost = (post: any) => {
    let thumb = post.thumbnail || "";
    if (thumb.startsWith("data:image/") && thumb.length > 150000) {
      thumb = "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80";
    }
    return { ...post, thumbnail: thumb };
  };

  let sanitized = posts.map(sanitizePost);

  try {
    localStorage.setItem("wsj_posts", JSON.stringify(sanitized));
    return true;
  } catch (err) {
    console.warn("QuotaExceededError caught while saving wsj_posts. Compacting base64 images...", err);
    try {
      const compactPosts = sanitized.map((p) => {
        let body = p.bodyContent || "";
        body = body.replace(/src="data:image\/[^;]+;base64,[^"]+"/g, (match: string) => {
          if (match.length > 80000) {
            return 'src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80"';
          }
          return match;
        });
        let thumb = p.thumbnail || "";
        if (thumb.startsWith("data:")) {
          thumb = "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80";
        }
        return {
          ...p,
          bodyContent: body,
          thumbnail: thumb,
        };
      });
      localStorage.setItem("wsj_posts", JSON.stringify(compactPosts));
      return true;
    } catch (e2) {
      console.error("Secondary QuotaExceededError retry:", e2);
      try {
        const trimmed = sanitized.slice(0, 15).map((p) => ({
          ...p,
          bodyContent: (p.bodyContent || "").replace(/src="data:image\/[^;]+;base64,[^"]+"/g, 'src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80"'),
          thumbnail: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80",
        }));
        localStorage.setItem("wsj_posts", JSON.stringify(trimmed));
        return true;
      } catch (e3) {
        return false;
      }
    }
  }
};

export default function AdminReviewPostPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Article state
  const [headline, setHeadline] = useState("");
  const [subheadline, setSubheadline] = useState("");
  const [bodyContent, setBodyContent] = useState("");
  const [mainCategory, setMainCategory] = useState("Business");
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [readDuration, setReadDuration] = useState("5 min read");
  const [isExclusive, setIsExclusive] = useState(true);
  const [homepagePlacement, setHomepagePlacement] = useState("None (Category and Search Only)");
  const [newsletterBanner, setNewsletterBanner] = useState("Auto — Middle of article (default)");

  // Editor Ref & Visual WYSIWYG ContentEditable Formatting
  const editorRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const subheadlineRef = useRef<HTMLTextAreaElement>(null);

  // Auto-expand Title and Subheading textareas to fit content without scrolling
  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.height = "auto";
      titleRef.current.style.height = `${titleRef.current.scrollHeight}px`;
    }
  }, [headline]);

  useEffect(() => {
    if (subheadlineRef.current) {
      subheadlineRef.current.style.height = "auto";
      subheadlineRef.current.style.height = `${subheadlineRef.current.scrollHeight}px`;
    }
  }, [subheadline]);

  // Current logged in user & Article author
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [articleAuthor, setArticleAuthor] = useState("Writer User");

  // Editor Writing Area Font Size State
  const [editorFontSize, setEditorFontSize] = useState<number>(18);

  // Preview Mode Interactive Controls State
  const [previewFontSize, setPreviewFontSize] = useState<"normal" | "medium" | "large">("normal");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [previewToast, setPreviewToast] = useState<string | null>(null);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const showToast = (msg: string) => {
    setPreviewToast(msg);
    setTimeout(() => {
      setPreviewToast(null);
    }, 2500);
  };

  const handleToggleBookmark = () => {
    const nextState = !isBookmarked;
    setIsBookmarked(nextState);
    showToast(nextState ? "Article bookmarked to reading list!" : "Bookmark removed.");
  };

  const handleShareArticle = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
    }
    showToast("Article link copied to clipboard!");
  };

  // Target article ID being reviewed
  const [reviewPostId, setReviewPostId] = useState<string | null>(null);
  const isContentInitialized = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("wsj_user");
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          if (parsed) setCurrentUser(parsed);
        } catch (e) {}
      }

      const params = new URLSearchParams(window.location.search);
      const postId = params.get("id");
      if (postId) {
        setReviewPostId(postId);

        let found: any = null;
        try {
          const storedPosts = localStorage.getItem("wsj_posts");
          if (storedPosts) {
            const posts = JSON.parse(storedPosts);
            found = posts.find((p: any) => p.id === postId);
          }
        } catch (e) {}

        if (!found && DEFAULT_PENDING_ARTICLES[postId]) {
          found = DEFAULT_PENDING_ARTICLES[postId];
        }

        if (found) {
          const titleVal = found.title || "";
          const subheadlineVal = found.subheadline || found.excerpt || "";
          const categoryVal = found.category || "Business";
          const bodyVal = found.bodyContent || (subheadlineVal ? `<p>${subheadlineVal}</p>` : "");

          if (titleVal) setHeadline(titleVal);
          if (subheadlineVal) setSubheadline(subheadlineVal);
          if (categoryVal) setMainCategory(categoryVal);

          const loadedContent = bodyVal;
          if (loadedContent) {
            const sanitizedContent = loadedContent.replace(
              /src="blob:[^"]*"/g,
              'src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80"'
            );
            setBodyContent(sanitizedContent);
            if (editorRef.current) {
              editorRef.current.innerHTML = sanitizedContent;
            }
          }

          if (found.author) setArticleAuthor(found.author);
          setReadDuration(found.readDuration || found.readTime || "5 min read");
          setIsExclusive(found.isExclusive !== undefined ? found.isExclusive : true);

          if (found.subCategories && Array.isArray(found.subCategories) && found.subCategories.length > 0) {
            setSelectedSubCategories(found.subCategories);
          } else {
            const catLower = categoryVal.toLowerCase();
            if (catLower.includes("business")) {
              setSelectedSubCategories(["Economy & Finance", "CFO Spotlight"]);
            } else if (catLower.includes("tech")) {
              setSelectedSubCategories(["Technology", "Crypto"]);
            } else {
              setSelectedSubCategories(["World", "US"]);
            }
          }

          if (found.tags && Array.isArray(found.tags) && found.tags.length > 0) {
            setTags(found.tags);
          } else {
            const words = titleVal.split(/\s+/).filter((w: string) => w.length > 3).slice(0, 3).map((w: string) => w.replace(/[^a-zA-Z]/g, "").toUpperCase());
            setTags(words.length > 0 ? words : [categoryVal.toUpperCase()]);
          }

          const plainText = bodyVal.replace(/<[^>]+>/g, " ").trim();
          const summaryFallback = found.cardSummary || subheadlineVal || (plainText ? plainText.slice(0, 140) + "..." : "");
          const descFallback = found.seoDescription || subheadlineVal || (plainText ? plainText.slice(0, 150) + "..." : "");
          const keywordFallback = found.focusKeyword || titleVal.split(":").pop()?.trim() || titleVal.slice(0, 30);

          setCardSummary(summaryFallback);
          setSeoDescription(descFallback);
          setFocusKeyword(keywordFallback);
          setSeoTitle(found.seoTitle || titleVal);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (editorRef.current && bodyContent && !isContentInitialized.current) {
      editorRef.current.innerHTML = bodyContent;
      isContentInitialized.current = true;
    }
  }, [bodyContent]);

  const authorName = articleAuthor || "Writer User";
  const authorInitial = authorName.charAt(0).toUpperCase();
  const authorImage =
    getAuthorForArticle("", authorName)?.image ||
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80";

  const handleToggleBlockquote = () => {
    if (!editorRef.current) return;
    editorRef.current.focus();

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      document.execCommand("formatBlock", false, "blockquote");
    } else {
      let isInsideBq = false;
      let currNode: Node | null = selection.anchorNode;
      while (currNode && currNode !== editorRef.current) {
        if (
          currNode.nodeType === Node.ELEMENT_NODE &&
          (currNode as HTMLElement).tagName === "BLOCKQUOTE"
        ) {
          isInsideBq = true;
          break;
        }
        currNode = currNode.parentNode;
      }

      if (isInsideBq) {
        document.execCommand("formatBlock", false, "p");
      } else {
        document.execCommand("formatBlock", false, "blockquote");
      }
    }

    const bqs = editorRef.current.querySelectorAll("blockquote");
    bqs.forEach((bq) => {
      const figuresAndImgs = Array.from(bq.querySelectorAll("figure, img"));
      figuresAndImgs.forEach((mediaEl) => {
        bq.parentNode?.insertBefore(mediaEl, bq);
      });

      bq.style.borderLeft = "5px solid #ea580c";
      bq.style.backgroundColor = "#f8fafc";
      bq.style.padding = "12px 18px";
      bq.style.margin = "8px 0 12px 0";
      bq.style.borderRadius = "0 6px 6px 0";
      bq.style.fontStyle = "italic";
      bq.style.color = "#334155";
      bq.style.display = "flow-root";
      bq.style.boxSizing = "border-box";
    });

    setBodyContent(editorRef.current.innerHTML);
  };

  const handleToggleCodeBlock = () => {
    if (!editorRef.current) return;
    editorRef.current.focus();

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      document.execCommand("formatBlock", false, "pre");
    } else {
      let isInsidePre = false;
      let currNode: Node | null = selection.anchorNode;
      while (currNode && currNode !== editorRef.current) {
        if (
          currNode.nodeType === Node.ELEMENT_NODE &&
          (currNode as HTMLElement).tagName === "PRE"
        ) {
          isInsidePre = true;
          break;
        }
        currNode = currNode.parentNode;
      }

      if (isInsidePre) {
        document.execCommand("formatBlock", false, "p");
      } else {
        document.execCommand("formatBlock", false, "pre");
      }
    }

    const pres = editorRef.current.querySelectorAll("pre");
    pres.forEach((pre) => {
      const figuresAndImgs = Array.from(pre.querySelectorAll("figure, img"));
      figuresAndImgs.forEach((mediaEl) => {
        pre.parentNode?.insertBefore(mediaEl, pre);
      });

      pre.style.backgroundColor = "#f1f5f9";
      pre.style.border = "none";
      pre.style.outline = "none";
      pre.style.padding = "18px 24px";
      pre.style.margin = "16px 0";
      pre.style.borderRadius = "12px";
      pre.style.fontStyle = "italic";
      pre.style.color = "#334155";
      pre.style.fontSize = "15px";
      pre.style.lineHeight = "1.6";
      pre.style.display = "flow-root";
      pre.style.maxWidth = "100%";
      pre.style.boxSizing = "border-box";
      pre.style.whiteSpace = "pre-wrap";
      pre.style.wordBreak = "break-word";
    });

    setBodyContent(editorRef.current.innerHTML);
  };

  const execCommand = (command: string, value: string = "") => {
    if (editorRef.current) {
      editorRef.current.focus();
      if (command === "insertUnorderedList" || command === "insertOrderedList") {
        document.execCommand(command, false, undefined);
      } else if (command === "blockquote") {
        handleToggleBlockquote();
        return;
      } else if (command === "code") {
        handleToggleCodeBlock();
        return;
      } else {
        document.execCommand(command, false, value);
      }
      setBodyContent(editorRef.current.innerHTML);
    }
  };

  const changeSelectedFontSize = (delta: number) => {
    if (!editorRef.current) return;
    editorRef.current.focus();

    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
      const range = selection.getRangeAt(0);

      if (editorRef.current.contains(range.commonAncestorContainer)) {
        let parentEl: HTMLElement | null =
          range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
            ? (range.commonAncestorContainer as HTMLElement)
            : range.commonAncestorContainer.parentElement;

        let currentPx = 18;
        if (parentEl) {
          const comp = window.getComputedStyle(parentEl).fontSize;
          if (comp) {
            const parsed = parseFloat(comp);
            if (!isNaN(parsed)) currentPx = Math.round(parsed);
          }
        }

        const nextPx = Math.min(32, Math.max(1, currentPx + delta));
        const span = document.createElement("span");
        span.style.fontSize = `${nextPx}px`;

        try {
          const content = range.extractContents();
          span.appendChild(content);
          range.insertNode(span);
          selection.removeAllRanges();
          const newRange = document.createRange();
          newRange.selectNodeContents(span);
          selection.addRange(newRange);
        } catch (e) {
          document.execCommand("fontSize", false, "5");
        }

        setBodyContent(editorRef.current.innerHTML);
        return;
      }
    }

    setEditorFontSize((prev) => Math.min(32, Math.max(1, prev + delta)));
  };

  const handleInsertLink = () => {
    let url = window.prompt("Enter link URL:", "https://");
    if (url) {
      url = url.trim();
      if (!/^https?:\/\//i.test(url) && !url.startsWith("/") && !url.startsWith("#")) {
        url = `https://${url}`;
      }
      execCommand("createLink", url);

      if (editorRef.current) {
        const anchors = editorRef.current.querySelectorAll("a");
        anchors.forEach((a) => {
          a.setAttribute("target", "_blank");
          a.setAttribute("rel", "noopener noreferrer");
          a.style.color = "#ea580c";
          a.style.textDecoration = "underline";
        });
        setBodyContent(editorRef.current.innerHTML);
      }
    }
  };

  const handleInsertImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (re: any) => {
          const imgUrl = re.target?.result as string;
          execCommand("insertImage", imgUrl);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  // Modals & Notifications
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  // Insert Image State
  const [modalImageUrl, setModalImageUrl] = useState("");
  const [modalImageFile, setModalImageFile] = useState<File | null>(null);
  const [modalImageCaption, setModalImageCaption] = useState("");
  const [modalImageCredit, setModalImageCredit] = useState("");
  const [modalImageSize, setModalImageSize] = useState("Medium (Width: 450px)");
  const [modalImageAlign, setModalImageAlign] = useState("Left (Wrap Text Right)");

  // Interactive Image Selection State
  const [selectedImgEl, setSelectedImgEl] = useState<HTMLImageElement | null>(null);
  const [toolbarPos, setToolbarPos] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [editingFigureEl, setEditingFigureEl] = useState<HTMLElement | null>(null);

  const handleEditSelectedImage = () => {
    if (!selectedImgEl) return;
    const figure = (selectedImgEl.closest("figure") || selectedImgEl) as HTMLElement;
    setEditingFigureEl(figure);

    const img = (figure.tagName === "IMG" ? figure : figure.querySelector("img")) as HTMLImageElement | null;
    const currentSrc = img ? img.src : "";

    const captionSpan = figure.querySelector("div span:first-child");
    const currentCaption = captionSpan ? captionSpan.textContent || "" : "";

    const creditSpan = figure.querySelector("div span:last-child");
    let currentCredit = creditSpan ? creditSpan.textContent || "" : "";
    currentCredit = currentCredit.replace(/^\(PHOTO:\s*/i, "").replace(/\)$/, "").trim();

    setModalImageUrl(currentSrc);
    setModalImageFile(null);
    setModalImageCaption(currentCaption);
    setModalImageCredit(currentCredit);
    setShowImageModal(true);
  };

  const updateSelectedImgPos = (el: HTMLElement | null) => {
    if (!editorRef.current || !el) return;
    const figureOrImg = (el.closest("figure") || el) as HTMLElement;
    const editorRect = editorRef.current.getBoundingClientRect();
    const rect = figureOrImg.getBoundingClientRect();
    setToolbarPos({
      top: rect.top - editorRect.top,
      left: rect.left - editorRect.left,
      width: rect.width,
      height: rect.height,
    });
  };

  useEffect(() => {
    if (!selectedImgEl) return;
    const handleRecalculate = () => updateSelectedImgPos(selectedImgEl);
    window.addEventListener("resize", handleRecalculate);
    window.addEventListener("scroll", handleRecalculate, true);
    return () => {
      window.removeEventListener("resize", handleRecalculate);
      window.removeEventListener("scroll", handleRecalculate, true);
    };
  }, [selectedImgEl]);

  const handleEditorClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const figureOrImg = target.closest("figure") || (target.tagName === "IMG" ? target : null);
    if (figureOrImg) {
      const img =
        figureOrImg.tagName === "IMG"
          ? (figureOrImg as HTMLImageElement)
          : (figureOrImg.querySelector("img") as HTMLImageElement) || (figureOrImg as HTMLElement);
      setSelectedImgEl(img as HTMLImageElement);
      updateSelectedImgPos(img as HTMLElement);
    } else {
      setSelectedImgEl(null);
      setToolbarPos(null);
    }
  };

  const handleResizeStart = (e: React.MouseEvent, handle: "tl" | "tr" | "bl" | "br") => {
    e.preventDefault();
    e.stopPropagation();
    if (!selectedImgEl || !editorRef.current) return;
    const figure = (selectedImgEl.closest("figure") || selectedImgEl) as HTMLElement;
    const startX = e.clientX;
    const startWidth = figure.getBoundingClientRect().width;
    const editorWidth = editorRef.current.getBoundingClientRect().width;

    setIsResizing(true);

    const onMouseMove = (moveEvent: MouseEvent) => {
      moveEvent.preventDefault();
      const deltaX = moveEvent.clientX - startX;
      let newWidth = startWidth;

      if (handle === "tr" || handle === "br") {
        newWidth = startWidth + deltaX;
      } else if (handle === "tl" || handle === "bl") {
        newWidth = startWidth - deltaX;
      }

      const clampedWidth = Math.min(Math.max(120, newWidth), editorWidth);
      figure.style.width = `${clampedWidth}px`;
      figure.style.maxWidth = "100%";

      if (editorRef.current) {
        const editorRect = editorRef.current.getBoundingClientRect();
        const rect = figure.getBoundingClientRect();
        setToolbarPos({
          top: rect.top - editorRect.top,
          left: rect.left - editorRect.left,
          width: rect.width,
          height: rect.height,
        });
      }
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      setIsResizing(false);
      if (editorRef.current) {
        setBodyContent(editorRef.current.innerHTML);
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const handleSetImageSize = (sizeStr: string) => {
    if (!selectedImgEl) return;
    const figure = (selectedImgEl.closest("figure") || selectedImgEl) as HTMLElement;
    figure.style.width = sizeStr;
    figure.style.maxWidth = "100%";
    setTimeout(() => updateSelectedImgPos(selectedImgEl), 50);
    if (editorRef.current) setBodyContent(editorRef.current.innerHTML);
  };

  const handleSetImageAlign = (align: "left" | "center" | "right") => {
    if (!selectedImgEl) return;
    const figure = (selectedImgEl.closest("figure") || selectedImgEl) as HTMLElement;
    if (align === "left") {
      figure.style.float = "left";
      figure.style.margin = "8px 24px 16px 0";
      figure.style.clear = "left";
      figure.style.display = "block";
    } else if (align === "right") {
      figure.style.float = "right";
      figure.style.margin = "8px 0 16px 24px";
      figure.style.clear = "right";
      figure.style.display = "block";
    } else {
      figure.style.float = "none";
      figure.style.margin = "20px auto";
      figure.style.clear = "both";
      figure.style.display = "block";
    }
    setTimeout(() => updateSelectedImgPos(selectedImgEl), 50);
    if (editorRef.current) setBodyContent(editorRef.current.innerHTML);
  };

  const [isDraggingImage, setIsDraggingImage] = useState(false);

  const handleDragMoveStart = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.title?.startsWith("Resize") || target.closest("button")) return;

    e.preventDefault();
    if (!selectedImgEl || !editorRef.current) return;

    const figure = (selectedImgEl.closest("figure") || selectedImgEl) as HTMLElement;
    let topBlock: HTMLElement = figure;
    while (topBlock.parentElement && topBlock.parentElement !== editorRef.current) {
      topBlock = topBlock.parentElement;
    }

    const parent = editorRef.current;
    let isMoving = true;
    setIsDraggingImage(true);

    const onMouseMove = (moveEvent: MouseEvent) => {
      if (!isMoving) return;
      moveEvent.preventDefault();
      const mouseY = moveEvent.clientY;
      const children = Array.from(parent.children).filter((child) => child !== topBlock) as HTMLElement[];

      let insertBeforeTarget: HTMLElement | null = null;
      for (const child of children) {
        const rect = child.getBoundingClientRect();
        const childMiddleY = rect.top + rect.height / 2;
        if (mouseY < childMiddleY) {
          insertBeforeTarget = child;
          break;
        }
      }

      if (insertBeforeTarget) {
        parent.insertBefore(topBlock, insertBeforeTarget);
      } else {
        parent.appendChild(topBlock);
      }

      const editorRect = parent.getBoundingClientRect();
      const rect = figure.getBoundingClientRect();
      setToolbarPos({
        top: rect.top - editorRect.top,
        left: rect.left - editorRect.left,
        width: rect.width,
        height: rect.height,
      });
    };

    const onMouseUp = () => {
      isMoving = false;
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      setIsDraggingImage(false);
      if (editorRef.current) {
        setBodyContent(editorRef.current.innerHTML);
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const handleMoveImage = (direction: "up" | "down") => {
    if (!selectedImgEl || !editorRef.current) return;
    const figure = (selectedImgEl.closest("figure") || selectedImgEl) as HTMLElement;

    if (figure.parentElement && (figure.parentElement.tagName === "P" || figure.parentElement.tagName === "BLOCKQUOTE")) {
      const parentBlock = figure.parentElement;
      parentBlock.parentNode?.insertBefore(figure, parentBlock);
    }

    let topBlock: HTMLElement = figure;
    while (topBlock.parentElement && topBlock.parentElement !== editorRef.current) {
      topBlock = topBlock.parentElement;
    }
    const parent = topBlock.parentElement || editorRef.current;

    if (direction === "up") {
      const prev = topBlock.previousElementSibling as HTMLElement | null;
      if (prev) {
        parent.insertBefore(topBlock, prev);
      }
    } else {
      const next = topBlock.nextElementSibling as HTMLElement | null;
      if (next) {
        parent.insertBefore(next, topBlock);
      }
    }

    figure.style.marginTop = "12px";

    if (typeof sanitizeEditorDOM === "function") sanitizeEditorDOM(editorRef.current);
    setTimeout(() => updateSelectedImgPos(selectedImgEl), 30);
    if (editorRef.current) {
      setBodyContent(editorRef.current.innerHTML);
    }
  };

  const handleDeleteImage = () => {
    if (!selectedImgEl) return;
    const figure = (selectedImgEl.closest("figure") || selectedImgEl) as HTMLElement;
    figure.remove();
    setSelectedImgEl(null);
    setToolbarPos(null);
    if (editorRef.current) setBodyContent(editorRef.current.innerHTML);
  };

  const handleOpenImageModal = () => {
    setEditingFigureEl(null);
    setModalImageUrl("");
    setModalImageFile(null);
    setModalImageCaption("");
    setModalImageCredit("");
    setModalImageSize("Medium (Width: 450px)");
    setModalImageAlign("Left (Wrap Text Right)");
    setShowImageModal(true);
  };

  const handleConfirmInsertImage = async () => {
    let finalUrl = modalImageUrl.trim();
    if (modalImageFile) {
      finalUrl = await compressImageFile(modalImageFile, 800, 0.7);
    }
    if (!finalUrl || finalUrl.startsWith("blob:")) {
      finalUrl = "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80";
    }

    let exactWidthStyle = "width: 450px; max-width: 100%;";
    if (modalImageSize.includes("250px")) exactWidthStyle = "width: 250px; max-width: 100%;";
    if (modalImageSize.includes("450px")) exactWidthStyle = "width: 450px; max-width: 100%;";
    if (modalImageSize.includes("100%")) exactWidthStyle = "width: 100%;";

    const captionHtml = modalImageCaption ? `<span style="font-size: 11px; font-style: italic; color: #475569; margin-right: 12px;">${modalImageCaption}</span>` : "";
    const creditText = modalImageCredit ? (modalImageCredit.toUpperCase().startsWith("PHOTO:") ? modalImageCredit.toUpperCase() : `(PHOTO: ${modalImageCredit.toUpperCase()})`) : "";
    const creditHtml = creditText ? `<span style="font-size: 10px; font-family: monospace; color: #64748b; text-transform: uppercase; margin-left: auto; text-align: right;">${creditText}</span>` : "";

    let figureStyle = "";
    if (modalImageAlign.startsWith("Left")) {
      figureStyle = `float: left; margin: 8px 24px 16px 0; ${exactWidthStyle} clear: left;`;
    } else if (modalImageAlign.startsWith("Right")) {
      figureStyle = `float: right; margin: 8px 0 16px 24px; ${exactWidthStyle} clear: right;`;
    } else {
      figureStyle = `display: block; margin: 20px auto; ${exactWidthStyle} clear: both;`;
    }

    if (editingFigureEl) {
      editingFigureEl.style.cssText = `${figureStyle} max-width: 100%; box-sizing: border-box;`;
      editingFigureEl.innerHTML = `<img src="${finalUrl}" alt="${modalImageCaption || "Article image"}" style="width: 100%; border-radius: 12px; display: block;" /><div style="display: flex; justify-content: space-between; align-items: center; margin-top: 6px; font-family: sans-serif;">${captionHtml}${creditHtml}</div>`;
      setEditingFigureEl(null);
      const newImg = editingFigureEl.querySelector("img") as HTMLImageElement;
      if (newImg) setSelectedImgEl(newImg);
      setTimeout(() => updateSelectedImgPos(editingFigureEl), 50);
      if (editorRef.current) setBodyContent(editorRef.current.innerHTML);
    } else {
      const imgTag = `<figure style="${figureStyle} max-width: 100%; box-sizing: border-box;"><img src="${finalUrl}" alt="${modalImageCaption || "Article image"}" style="width: 100%; border-radius: 12px; display: block;" /><div style="display: flex; justify-content: space-between; align-items: center; margin-top: 6px; font-family: sans-serif;">${captionHtml}${creditHtml}</div></figure>&nbsp;`;

      if (editorRef.current) {
        editorRef.current.focus();
        document.execCommand("insertHTML", false, imgTag);
        setBodyContent(editorRef.current.innerHTML);
      }
    }

    setShowImageModal(false);
    setModalImageUrl("");
    setModalImageFile(null);
    setModalImageCaption("");
    setModalImageCredit("");
    setModalImageSize("Medium (Width: 450px)");
    setModalImageAlign("Left (Wrap Text Right)");
  };

  // Sidebar State
  const [sidebarTab, setSidebarTab] = useState<"DETAILS" | "SEO">("DETAILS");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // SEO State
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [focusKeyword, setFocusKeyword] = useState("");
  const [cardSummary, setCardSummary] = useState("");
  const [isManualKeyword, setIsManualKeyword] = useState(false);
  const [isManualSummary, setIsManualSummary] = useState(false);
  const [isManualDesc, setIsManualDesc] = useState(false);

  const extractPlainText = (html: string): string => {
    if (typeof window === "undefined") return "";
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return (tmp.textContent || tmp.innerText || "").replace(/\s+/g, " ").trim();
  };

  const handleAutoGenerateSEO = () => {
    const plainText = extractPlainText(bodyContent);
    if (!plainText) {
      showToast("Write some content in the editor to auto-generate SEO details!");
      return;
    }

    const words = plainText.split(" ").filter((w) => w.length > 3);
    const wordFreq: Record<string, number> = {};
    words.forEach((w) => {
      const clean = w.toLowerCase().replace(/[^a-z0-9]/g, "");
      if (clean && !["this", "that", "with", "from", "have", "more", "about"].includes(clean)) {
        wordFreq[clean] = (wordFreq[clean] || 0) + 1;
      }
    });

    const sortedWords = Object.keys(wordFreq).sort((a, b) => wordFreq[b] - wordFreq[a]);
    const generatedKeyword = sortedWords.slice(0, 2).join(" ");
    const generatedSummary = plainText.slice(0, 160) + (plainText.length > 160 ? "..." : "");
    const generatedDesc = `Discover key insights on ${generatedKeyword || headline}: ${plainText.slice(0, 120)}...`;

    if (!isManualKeyword) setFocusKeyword(generatedKeyword);
    if (!isManualSummary) setCardSummary(generatedSummary);
    if (!isManualDesc) setSeoDescription(generatedDesc);

    showToast("SEO Metadata Auto-Generated!");
  };

  const handleSubCategoryToggle = (subCat: string) => {
    if (selectedSubCategories.includes(subCat)) {
      setSelectedSubCategories(selectedSubCategories.filter((c) => c !== subCat));
    } else {
      if (selectedSubCategories.length < 5) {
        setSelectedSubCategories([...selectedSubCategories, subCat]);
      }
    }
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      const cleaned = tagInput.trim().replace(/^#/, "");
      if (cleaned && !tags.includes(cleaned)) {
        setTags([...tags, cleaned]);
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // =========================================================================
  // ADMIN ACTION BUTTON HANDLERS: REJECT TO TRASH & APPROVE & PUBLISH
  // =========================================================================
  const handleApproveAndPublish = () => {
    const targetId = reviewPostId || Date.now().toString();
    const currentBody = editorRef.current?.innerHTML || bodyContent;

    let thumb = "";
    if (editorRef.current) {
      const imgEl = editorRef.current.querySelector("img");
      if (imgEl) thumb = imgEl.src;
    }
    if (!thumb && currentBody) {
      const match = currentBody.match(/src=["']([^"']+)["']/);
      if (match) thumb = match[1];
    }
    if (!thumb) {
      thumb = "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80";
    }

    let existingPosts: any[] = [];
    try {
      const stored = localStorage.getItem("wsj_posts");
      if (stored) existingPosts = JSON.parse(stored);
    } catch (e) {}

    const updatedPost = {
      id: targetId,
      title: headline.trim() || "Approved Article",
      subheadline: subheadline.trim(),
      bodyContent: currentBody,
      category: mainCategory || "Business",
      subCategories: selectedSubCategories,
      tags: tags,
      status: "Published",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      readDuration: readDuration || "5 min read",
      author: authorName,
      thumbnail: thumb,
      isExclusive: isExclusive,
      cardSummary: cardSummary,
      focusKeyword: focusKeyword,
      seoDescription: seoDescription,
      seoTitle: seoTitle,
      homepagePlacement: homepagePlacement,
      newsletterBanner: newsletterBanner,
      publishedAt: Date.now(),
      views: 0,
    };

    const idx = existingPosts.findIndex((p) => p.id === targetId);
    if (idx >= 0) {
      existingPosts[idx] = updatedPost;
    } else {
      existingPosts = [updatedPost, ...existingPosts];
    }

    // Manage Homepage Placement Queues (Top News: 3, A+ Main: 1, In Depth: 4, Main Bottom: 2, Right Main: 2)
    const SECTION_LIMITS = [
      { keyword: "Top News", max: 3 },
      { keyword: "A+ Main News", max: 1 },
      { keyword: "A+ Section (main hero)", max: 1 },
      { keyword: "In Depth", max: 4 },
      { keyword: "Main Bottom", max: 2 },
      { keyword: "Right Main Panel", max: 2 },
    ];

    if (homepagePlacement && !homepagePlacement.startsWith("None")) {
      SECTION_LIMITS.forEach(({ keyword, max }) => {
        if (homepagePlacement.includes(keyword)) {
          const sectionPosts = existingPosts.filter(
            (p: any) => p.status === "Published" && p.homepagePlacement && p.homepagePlacement.includes(keyword)
          );

          sectionPosts.sort((a: any, b: any) => (b.publishedAt || 0) - (a.publishedAt || 0));

          if (sectionPosts.length > max) {
            for (let i = max; i < sectionPosts.length; i++) {
              sectionPosts[i].homepagePlacement = "None (Category and Search Only)";
            }
          }
        }
      });
    }

    safeSavePostsToStorage(existingPosts);
    window.dispatchEvent(new Event("wsj_posts_updated"));
    router.push("/admin-dashboard?tab=Overview");
  };

  const handleRejectToTrash = () => {
    const targetId = reviewPostId || Date.now().toString();

    let existingPosts: any[] = [];
    try {
      const stored = localStorage.getItem("wsj_posts");
      if (stored) existingPosts = JSON.parse(stored);
    } catch (e) {}

    const idx = existingPosts.findIndex((p) => p.id === targetId);
    if (idx >= 0) {
      existingPosts[idx].status = "Rejected";
    } else {
      existingPosts.push({
        id: targetId,
        title: headline.trim(),
        subheadline: subheadline.trim(),
        bodyContent: bodyContent,
        category: mainCategory,
        status: "Rejected",
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        author: authorName,
      });
    }

    safeSavePostsToStorage(existingPosts);
    window.dispatchEvent(new Event("wsj_posts_updated"));
    router.push("/admin-dashboard?tab=Overview");
  };

  if (!isMounted) return null;

  return (
    <div suppressHydrationWarning className="min-h-screen bg-[#f8fafc] text-[#0f172a] font-sans flex flex-col w-full touch-pan-y">
      <div>
        {/* ================================================================= */}
        {/* TOP NAVBAR (Exact match to create-post page layout)                */}
        {/* ================================================================= */}
        <header suppressHydrationWarning className="bg-[#0b132b] border-b border-[#1e293b] h-auto min-h-[56px] sm:min-h-[2cm] px-3 sm:px-6 lg:px-10 py-2 flex items-center justify-between sticky top-0 z-40 shadow-md flex-wrap sm:flex-nowrap gap-2">
          {/* Left Side: Cancel Button, Divider, Headline Status */}
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            <button
              onClick={() => router.push("/admin-dashboard?tab=Overview")}
              className="flex items-center space-x-1.5 text-[#94a3b8] hover:text-white font-sans text-xs uppercase tracking-wider font-extrabold transition-colors cursor-pointer shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              <span>CANCEL</span>
            </button>

            <span className="text-[#334155] font-light shrink-0">|</span>

            <span className="text-[#94a3b8] text-[10px] sm:text-xs font-mono font-extrabold uppercase tracking-widest truncate max-w-[150px] xs:max-w-[240px] sm:max-w-[400px]">
              {reviewPostId
                ? `Reviewing: ${headline.trim() || "Untitled Article"}`
                : `REVIEW ${mainCategory.toUpperCase()} ARTICLE`}
            </span>
          </div>

          {/* Right Side Action Buttons: PREVIEW, REJECT TO TRASH, APPROVE & PUBLISH */}
          <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
            {/* 1. PREVIEW BUTTON */}
            <button
              type="button"
              onClick={() => setShowPreviewModal(true)}
              className="border border-[#334155] bg-[#1e293b]/80 hover:bg-[#1e293b] text-white font-sans font-extrabold text-[8.5px] xs:text-[9.5px] sm:text-xs h-6.5 sm:h-8 px-1.5 xs:px-2.5 sm:px-3 rounded-[4px] sm:rounded-[6px] flex items-center justify-center space-x-1 sm:space-x-1.5 transition-all cursor-pointer shadow-2xs whitespace-nowrap shrink-0"
            >
              <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#94a3b8] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span className="uppercase tracking-wider font-extrabold">PREVIEW</span>
            </button>

            {/* 2. REJECT TO TRASH BUTTON (Solid Dark Red) */}
            <button
              type="button"
              onClick={handleRejectToTrash}
              className="bg-[#991b1b] hover:bg-[#7f1d1d] text-white font-sans font-extrabold text-[8.5px] xs:text-[9.5px] sm:text-xs h-6.5 sm:h-8 px-1.5 xs:px-2.5 sm:px-3 rounded-[4px] sm:rounded-[6px] flex items-center justify-center space-x-1 sm:space-x-1.5 transition-all cursor-pointer shadow-sm whitespace-nowrap shrink-0"
            >
              <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span className="uppercase tracking-wider font-extrabold">REJECT TO TRASH</span>
            </button>

            {/* 3. APPROVE & PUBLISH BUTTON (Solid Emerald Green) */}
            <button
              type="button"
              onClick={handleApproveAndPublish}
              className="bg-[#047857] hover:bg-[#065f46] text-white font-sans font-extrabold text-[8.5px] xs:text-[9.5px] sm:text-xs h-6.5 sm:h-8 px-1.5 xs:px-2.5 sm:px-3 rounded-[4px] sm:rounded-[6px] flex items-center justify-center space-x-1 sm:space-x-1.5 transition-all cursor-pointer shadow-sm whitespace-nowrap shrink-0"
            >
              <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <span className="uppercase tracking-wider font-extrabold">APPROVE & PUBLISH</span>
            </button>
          </div>
        </header>

        {/* ================================================================= */}
        {/* TWO COLUMN MAIN CONTENT CANVAS (100% Exact match to create-post)  */}
        {/* ================================================================= */}
        <main className="w-full max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-10 py-4 sm:py-6 pb-32 sm:pb-16 touch-pan-y">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-start justify-center gap-6 lg:gap-8 w-full">
            
            {/* ==================== LEFT COLUMN: EDITOR CANVAS ==================== */}
            <div className="w-full lg:flex-1 max-w-[840px]">
              <div className="bg-white border border-[#e2e8f0] rounded-2xl p-3.5 sm:p-6 min-h-[320px] sm:min-h-[480px] lg:min-h-[640px] h-auto shadow-2xs space-y-5 sm:space-y-6 overflow-visible">
                
                {/* Integrated Rich Text Editor Formatting Toolbar */}
                <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-2 sm:p-2.5 flex items-center justify-start space-x-2 sm:space-x-3 shadow-2xs overflow-x-auto no-scrollbar font-sans text-xs">
                  <div className="flex items-center space-x-2 sm:space-x-3 text-gray-700">
                    <button type="button" onClick={() => execCommand("undo")} className="p-1.5 hover:bg-gray-200/60 rounded text-gray-600 transition-colors cursor-pointer" title="Undo">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                      </svg>
                    </button>
                    <button type="button" onClick={() => execCommand("redo")} className="p-1.5 hover:bg-gray-200/60 rounded text-gray-600 transition-colors cursor-pointer" title="Redo">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 10H11a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
                      </svg>
                    </button>
                    <span className="text-gray-300 font-light">|</span>
                    <button type="button" onClick={() => execCommand("bold")} className="px-2 py-1 hover:bg-gray-200/60 rounded font-bold text-gray-800 transition-colors cursor-pointer" title="Bold">
                      B
                    </button>
                    <button type="button" onClick={() => execCommand("italic")} className="px-2 py-1 hover:bg-gray-200/60 rounded italic font-serif text-gray-800 transition-colors cursor-pointer" title="Italic">
                      I
                    </button>
                    <button type="button" onClick={() => execCommand("underline")} className="px-2 py-1 hover:bg-gray-200/60 rounded underline text-gray-800 transition-colors cursor-pointer" title="Underline">
                      U
                    </button>
                    <span className="text-gray-300 font-light">|</span>
                    <button type="button" onClick={handleInsertLink} className="p-1.5 hover:bg-gray-200/60 rounded text-gray-600 transition-colors cursor-pointer" title="Hyperlink">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </button>
                    <button type="button" onClick={() => execCommand("insertUnorderedList")} className="p-1.5 hover:bg-gray-200/60 rounded text-gray-700 transition-colors cursor-pointer" title="Unordered Bullet List">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <circle cx="4" cy="6" r="2" />
                        <circle cx="4" cy="12" r="2" />
                        <circle cx="4" cy="18" r="2" />
                        <rect x="9" y="5" width="12" height="2" rx="1" />
                        <rect x="9" y="11" width="12" height="2" rx="1" />
                        <rect x="9" y="17" width="12" height="2" rx="1" />
                      </svg>
                    </button>

                    <button type="button" onClick={() => execCommand("insertOrderedList")} className="p-1.5 hover:bg-gray-200/60 rounded text-gray-700 transition-colors cursor-pointer" title="Ordered Numbered List">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 4.5h2v6H4V6H3V4.5zM3 13.5h3v1.5H4.5v1H6V19.5H3v-1.5h1.5v-1H3v-2z" />
                        <rect x="9" y="5" width="12" height="2" rx="1" />
                        <rect x="9" y="11" width="12" height="2" rx="1" />
                        <rect x="9" y="17" width="12" height="2" rx="1" />
                      </svg>
                    </button>
                    <span className="text-gray-300 font-light">|</span>
                    <button type="button" onClick={() => execCommand("blockquote")} className="px-2 py-1 hover:bg-gray-200/60 rounded font-serif text-gray-700 transition-colors text-sm font-bold cursor-pointer" title="Blockquote">
                      ❞
                    </button>
                    <button type="button" onClick={() => execCommand("code")} className="px-2 py-1 hover:bg-gray-200/60 rounded font-mono text-gray-700 transition-colors text-xs cursor-pointer" title="Code">
                      &lt;/&gt;
                    </button>
                    <span className="text-gray-300 font-light">|</span>

                    <button
                      type="button"
                      onClick={() => changeSelectedFontSize(1)}
                      className="px-1.5 py-1 hover:bg-gray-200/60 rounded text-gray-800 transition-colors cursor-pointer flex items-center space-x-0.5"
                      title="Increase font size by 1 (Max 32px)"
                    >
                      <span className="font-serif font-bold text-sm leading-none">A</span>
                      <span className="text-[9px] font-black leading-none">▲</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => changeSelectedFontSize(-1)}
                      className="px-1.5 py-1 hover:bg-gray-200/60 rounded text-gray-800 transition-colors cursor-pointer flex items-center space-x-0.5"
                      title="Decrease font size by 1 (Min 1px)"
                    >
                      <span className="font-serif font-bold text-xs leading-none">A</span>
                      <span className="text-[9px] font-black leading-none">▼</span>
                    </button>
                    <span className="text-gray-300 font-light">|</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleOpenImageModal}
                    className="border border-[#ffedd5] bg-[#fff7ed] hover:bg-[#ffedd5] text-[#ea580c] font-bold text-[11px] px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-colors cursor-pointer shrink-0"
                  >
                    <svg className="w-4 h-4 text-[#ea580c]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="uppercase tracking-wider font-extrabold">INSERT IMAGE</span>
                  </button>
                </div>

                {/* Title Input */}
                <textarea
                  ref={titleRef}
                  rows={1}
                  placeholder="Add Title..."
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-2xl xs:text-3xl sm:text-4xl lg:text-[40px] font-encorpada-headline font-bold text-[#111111] placeholder-[#cbd5e1] resize-none pt-2 overflow-hidden touch-pan-y"
                />

                {/* Subheading Input */}
                <textarea
                  ref={subheadlineRef}
                  rows={1}
                  placeholder="Add Subheading / Deck..."
                  value={subheadline}
                  onChange={(e) => setSubheadline(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-base sm:text-xl font-sans text-[#555555] placeholder-[#cbd5e1] resize-none leading-normal overflow-hidden touch-pan-y"
                />

                {/* ContentEditable Body */}
                <div className="relative">
                  <div
                    ref={editorRef}
                    contentEditable
                    suppressContentEditableWarning
                    onInput={(e: any) => setBodyContent(e.currentTarget.innerHTML)}
                    onClick={handleEditorClick}
                    style={{ fontSize: `${editorFontSize}px` }}
                    className="w-full min-h-[320px] sm:min-h-[380px] h-auto flow-root outline-none text-[#1a1a1a] leading-[1.75] font-serif touch-pan-y empty:before:content-[attr(data-placeholder)] empty:before:text-[#cbd5e1] empty:before:pointer-events-none [&_p]:mb-5 [&_p]:leading-[1.75] [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-2 [&_blockquote]:border-l-[5px] [&_blockquote]:border-[#ea580c] [&_blockquote]:bg-[#f8fafc] [&_blockquote]:py-3.5 [&_blockquote]:px-5 [&_blockquote]:my-3 [&_blockquote]:rounded-r-md [&_blockquote]:italic [&_blockquote]:text-[#334155] [&_blockquote]:flow-root [&_pre]:bg-[#f1f5f9] [&_pre]:border-none [&_pre]:outline-none [&_pre]:p-5 [&_pre]:rounded-xl [&_pre]:italic [&_pre]:text-[#334155] [&_pre]:text-base [&_pre]:my-4 [&_pre]:max-w-full [&_pre]:box-border [&_pre]:whitespace-pre-wrap [&_pre]:break-words [&_pre]:flow-root [&_a]:text-[#2563eb] [&_a]:underline [&_img]:max-w-full [&_img]:rounded-xl [&_img]:cursor-grab [&_img:active]:cursor-grabbing [&_figure]:cursor-grab [&_figure:active]:cursor-grabbing [&_img]:hover:ring-2 [&_img]:hover:ring-[#2563eb] transition-all duration-150"
                    data-placeholder="Start writing or type / for plugins"
                  />

                  {/* Interactive Selected Image Floating Toolbar */}
                  {selectedImgEl && toolbarPos && (
                    <>
                      <div
                        style={{
                          top: `${Math.max(-44, toolbarPos.top - 46)}px`,
                          left: `${Math.max(0, toolbarPos.left + toolbarPos.width / 2 - 190)}px`,
                        }}
                        className="absolute bg-[#0b132b] text-white rounded-xl shadow-2xl px-3.5 py-1.5 flex items-center space-x-3 z-30 font-sans text-xs border border-slate-700/80 animate-in zoom-in-95 duration-100 shrink-0"
                      >
                        <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">
                          SIZE
                        </span>
                        <div className="flex items-center space-x-1 font-bold text-xs">
                          <button type="button" onClick={() => handleSetImageSize("250px")} className="px-1.5 py-0.5 hover:bg-slate-700 rounded transition-colors cursor-pointer" title="Small (250px)">
                            S
                          </button>
                          <button type="button" onClick={() => handleSetImageSize("450px")} className="px-1.5 py-0.5 hover:bg-slate-700 rounded transition-colors cursor-pointer" title="Medium (450px)">
                            M
                          </button>
                          <button type="button" onClick={() => handleSetImageSize("100%")} className="px-1.5 py-0.5 hover:bg-slate-700 rounded transition-colors cursor-pointer" title="Full Width (100%)">
                            FULL
                          </button>
                        </div>

                        <span className="text-slate-700 font-light">|</span>

                        <div className="flex items-center space-x-1.5 text-slate-200">
                          <button type="button" onClick={() => handleSetImageAlign("left")} className="p-1 hover:bg-slate-700 rounded transition-colors cursor-pointer" title="Align Left">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h10M4 18h14" />
                            </svg>
                          </button>
                          <button type="button" onClick={() => handleSetImageAlign("center")} className="p-1 hover:bg-slate-700 rounded transition-colors cursor-pointer" title="Center">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M7 12h10M5 18h14" />
                            </svg>
                          </button>
                          <button type="button" onClick={() => handleSetImageAlign("right")} className="p-1 hover:bg-slate-700 rounded transition-colors cursor-pointer" title="Align Right">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M10 12h10M6 18h14" />
                            </svg>
                          </button>
                        </div>

                        <span className="text-slate-700 font-light">|</span>

                        <button type="button" onClick={handleEditSelectedImage} className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded flex items-center space-x-1 transition-colors cursor-pointer" title="Edit Image">
                          <svg className="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                          <span className="text-[10px] font-bold uppercase tracking-wider">EDIT</span>
                        </button>

                        <span className="text-slate-700 font-light">|</span>

                        <button type="button" onClick={handleDeleteImage} className="p-1 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded transition-colors cursor-pointer" title="Delete Image">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>

                      <div
                        onMouseDown={handleDragMoveStart}
                        style={{
                          top: `${toolbarPos.top}px`,
                          left: `${toolbarPos.left}px`,
                          width: `${toolbarPos.width}px`,
                          height: `${toolbarPos.height}px`,
                        }}
                        className={`absolute border-2 border-[#2563eb] rounded-xl pointer-events-auto z-20 shadow-xs ${
                          isDraggingImage ? "cursor-grabbing" : "cursor-grab"
                        } active:cursor-grabbing`}
                      >
                        <div onMouseDown={(e) => handleResizeStart(e, "tl")} className="absolute -top-2 -left-2 w-4 h-4 bg-white border-2 border-[#2563eb] rounded-full shadow-md cursor-nwse-resize" />
                        <div onMouseDown={(e) => handleResizeStart(e, "tr")} className="absolute -top-2 -right-2 w-4 h-4 bg-white border-2 border-[#2563eb] rounded-full shadow-md cursor-nesw-resize" />
                        <div onMouseDown={(e) => handleResizeStart(e, "bl")} className="absolute -bottom-2 -left-2 w-4 h-4 bg-white border-2 border-[#2563eb] rounded-full shadow-md cursor-nesw-resize" />
                        <div onMouseDown={(e) => handleResizeStart(e, "br")} className="absolute -bottom-2 -right-2 w-4 h-4 bg-white border-2 border-[#2563eb] rounded-full shadow-md cursor-nwse-resize" />
                      </div>
                    </>
                  )}
                </div>

                {/* Bottom Tags */}
                {tags.length > 0 && (
                  <div className="flex items-center space-x-2 pt-4 border-t border-[#f1f5f9] mt-6">
                    <span className="text-xs font-mono font-bold text-[#94a3b8] uppercase tracking-wider">
                      TAGS:
                    </span>
                    <div className="flex flex-wrap gap-1.5 items-center">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          onClick={() => handleRemoveTag(tag)}
                          className="bg-[#f1f5f9] text-[#334155] hover:bg-red-50 hover:text-red-600 font-mono font-bold text-xs px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                        >
                          #{tag.toUpperCase().replace(/^#/, "")}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ==================== RIGHT COLUMN: ARTICLE SETTINGS SIDEBAR ==================== */}
            <div className="w-full lg:w-[330px] max-w-[840px] shrink-0 touch-pan-y">
              <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4 sm:p-5 shadow-2xs relative font-sans text-left">
                
                <button
                  type="button"
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  className="absolute -left-4 top-4.5 bg-white border border-[#e2e8f0] text-[#475569] hover:text-black rounded-full w-8 h-8 hidden lg:flex items-center justify-center shadow-xs transition-colors z-20 cursor-pointer"
                >
                  <svg className={`w-4 h-4 text-[#475569] transition-transform ${isSidebarCollapsed ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="18" height="18" rx="3" strokeWidth="1.8" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 3v18M14 9l3 3-3 3" />
                  </svg>
                </button>

                {!isSidebarCollapsed && (
                  <div className="space-y-5">
                    <div className="flex items-center space-x-2 border-b border-[#e2e8f0] pb-3.5 pl-2">
                      <svg className="w-4 h-4 text-[#475569]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <h3 className="font-serif font-bold text-sm tracking-wide text-[#0f172a] uppercase">
                        ARTICLE SETTINGS
                      </h3>
                    </div>

                    <div className="bg-[#f1f5f9]/70 border border-[#e2e8f0] rounded-xl p-1 grid grid-cols-2 gap-1 text-center text-xs tracking-tight select-none">
                      <button
                        type="button"
                        onClick={() => setSidebarTab("DETAILS")}
                        className={`py-2 rounded-lg transition-all cursor-pointer ${
                          sidebarTab === "DETAILS"
                            ? "bg-white text-[#0f172a] font-extrabold shadow-sm"
                            : "text-[#0f172a] font-bold hover:text-black"
                        }`}
                      >
                        DETAILS
                      </button>
                      <button
                        type="button"
                        onClick={() => setSidebarTab("SEO")}
                        className={`py-2 rounded-lg transition-all cursor-pointer ${
                          sidebarTab === "SEO"
                            ? "bg-white text-[#0f172a] font-extrabold shadow-sm"
                            : "text-[#0f172a] font-bold hover:text-black"
                        }`}
                      >
                        SEO
                      </button>
                    </div>

                    {sidebarTab === "DETAILS" && (
                      <div className="space-y-5">
                        <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-3">
                          <label className="flex items-center space-x-2.5 text-xs font-bold text-[#1e293b] cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={isExclusive}
                              onChange={(e) => setIsExclusive(e.target.checked)}
                              className="w-4 h-4 accent-[#2563eb] rounded border-gray-300 focus:ring-0 cursor-pointer"
                            />
                            <span className="uppercase text-[11px] font-sans font-bold tracking-wider text-[#1e293b]">
                              Mark as EXCLUSIVE Article
                            </span>
                          </label>
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-[10.5px] font-mono font-bold text-[#94a3b8] uppercase tracking-wider">
                            SELECT CATEGORY (MAIN)
                          </label>
                          <div className="relative">
                            <select
                              value={mainCategory}
                              onChange={(e) => setMainCategory(e.target.value)}
                              className="w-full bg-white border border-[#cbd5e1] rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#1e293b] appearance-none focus:outline-none focus:border-[#2563eb] cursor-pointer"
                            >
                              <option value="Business">Business</option>
                              <option value="World">World</option>
                              <option value="U.S.">U.S.</option>
                              <option value="Politics">Politics</option>
                              <option value="Economy">Economy</option>
                              <option value="Tech">Tech</option>
                              <option value="Markets">Markets</option>
                              <option value="Opinion">Opinion</option>
                              <option value="Arts">Arts</option>
                              <option value="Lifestyle">Lifestyle</option>
                              <option value="Real Estate">Real Estate</option>
                            </select>
                            <div className="pointer-events-none absolute right-3 top-3 text-gray-500">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-[10.5px] font-mono font-bold text-[#94a3b8] uppercase tracking-wider">
                            SELECT SUB-CATEGORIES (OPTIONAL, MAX 5)
                          </label>
                          <div className="relative bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl p-3.5">
                            <div
                              id="subcat-scroll-container"
                              className="max-h-none sm:max-h-[145px] overflow-visible sm:overflow-y-auto font-sans text-xs space-y-2.5 sm:pr-4 scroll-smooth"
                              style={{
                                scrollbarWidth: "thin",
                                scrollbarColor: "#ea580c #f1f5f9",
                              }}
                            >
                              <div className="grid grid-cols-2 gap-x-3 gap-y-2.5">
                                {availableSubCategories.map((subCat) => {
                                  const isChecked = selectedSubCategories.includes(subCat);
                                  const isDisabled = !isChecked && selectedSubCategories.length >= 5;
                                  return (
                                    <label
                                      key={subCat}
                                      className={`flex items-center space-x-2 truncate transition-opacity ${
                                        isChecked
                                          ? "text-[#1e293b] font-bold cursor-pointer"
                                          : isDisabled
                                          ? "text-[#cbd5e1] opacity-35 cursor-not-allowed pointer-events-none"
                                          : "text-[#475569] font-medium hover:text-black cursor-pointer"
                                      }`}
                                    >
                                      <input
                                        type="checkbox"
                                        checked={isChecked}
                                        disabled={isDisabled}
                                        onChange={() => handleSubCategoryToggle(subCat)}
                                        className="w-4 h-4 accent-[#ea580c] rounded border-gray-300 focus:ring-0 cursor-pointer disabled:cursor-not-allowed"
                                      />
                                      <span className="truncate text-[12px]">{subCat}</span>
                                    </label>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-[10.5px] font-mono font-bold text-[#94a3b8] uppercase tracking-wider">
                            TAGS
                          </label>
                          <div className="bg-white border-2 border-[#ea580c] rounded-2xl p-3.5 space-y-3 shadow-2xs">
                            {tags.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {tags.map((tag) => (
                                  <span
                                    key={tag}
                                    onClick={() => handleRemoveTag(tag)}
                                    className="bg-[#0b132b] text-white text-[11px] font-mono font-extrabold px-3 py-1.5 rounded-xl flex items-center space-x-1.5 cursor-pointer hover:bg-[#1e293b] transition-all shadow-xs"
                                  >
                                    <span>#{tag.toUpperCase()}</span>
                                  </span>
                                ))}
                              </div>
                            )}
                            <input
                              type="text"
                              placeholder={tags.length > 0 ? "Add more tags..." : "Add tags..."}
                              value={tagInput}
                              onChange={(e) => setTagInput(e.target.value)}
                              onKeyDown={handleAddTag}
                              className="w-full bg-transparent border-none outline-none text-sm font-sans font-medium text-[#1e293b] placeholder-[#94a3b8]"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-[10.5px] font-mono font-bold text-[#94a3b8] uppercase tracking-wider">
                            READ DURATION
                          </label>
                          <input
                            type="text"
                            value={readDuration}
                            onChange={(e) => setReadDuration(e.target.value)}
                            className="w-full bg-white border border-[#e2e8f0] rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#1e293b] focus:outline-none focus:border-[#2563eb]"
                          />
                        </div>

                        {/* HOMEPAGE PLACEMENT SECTION (Matching User Images 1 & 3) */}
                        <div className="border border-[#cbd5e1] bg-[#fffdfa] rounded-2xl p-3.5 space-y-2 text-left">
                          <label className="block text-[10px] font-mono font-bold text-[#ea580c] uppercase tracking-wider">
                            HOMEPAGE PLACEMENT
                          </label>
                          <div className="relative">
                            <select
                              value={homepagePlacement}
                              onChange={(e) => setHomepagePlacement(e.target.value)}
                              className="w-full bg-[#fffdf0] border border-[#facc15] rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#1e293b] focus:outline-none focus:border-[#eab308] cursor-pointer appearance-none pr-8"
                            >
                              <option value="None (Category and Search Only)">None (Category and Search Only)</option>
                              <option value="Home - Top News">Home - Top News</option>
                              <option value="Home - A+ Main News">Home - A+ Main News</option>
                              <option value="Home - Right Main Panel">Home - Right Main Panel</option>
                              <option value="Home- In Depth Panel">Home- In Depth Panel</option>
                              <option value="Home - Main Bottom Panel">Home - Main Bottom Panel</option>
                              <option value="Home - Business Category">Home - Business Category</option>
                              <option value="Home - World Politics Category">Home - World Politics Category</option>
                              <option value="Home - Editors Picks">Home - Editors Picks</option>
                              <option value="Home - Your Weekend">Home - Your Weekend</option>
                              <option value="Home - Editorials">Home - Editorials</option>
                              <option value="Home - People to know">Home - People to know</option>
                              <option value="Home - Politics Category">Home - Politics Category</option>
                              <option value="Home - Most Popular News">Home - Most Popular News</option>
                              <option value="Home - Tech Category">Home - Tech Category</option>
                              <option value="Home - Recommended Videos">Home - Recommended Videos</option>
                              <option value="Home - Sport Category">Home - Sport Category</option>
                              <option value="Home - Entertainment">Home - Entertainment</option>
                              <option value="Home - Main Videos">Home - Main Videos</option>
                              <option value="Home - Podcast">Home - Podcast</option>
                              <option value="Home - Fashion Category">Home - Fashion Category</option>
                              <option value="Home - Science">Home - Science</option>
                              <option value="Home- Arts Category">Home- Arts Category</option>
                              <option value="Home- Lifestyle Category">Home- Lifestyle Category</option>
                              <option value="Home - A+ Section 2">Home - A+ Section 2</option>
                              <option value="Home - CEO and Executives Category">Home - CEO and Executives Category</option>
                              <option value="Home - Economy">Home - Economy</option>
                              <option value="Home - Market and Finnace">Home - Market and Finnace</option>
                              <option value="Home - Health Category">Home - Health Category</option>
                              <option value="Home - Investing Category">Home - Investing Category</option>
                              <option value="Home - Crypto Category">Home - Crypto Category</option>
                              <option value="Home- Real Estate Category">Home- Real Estate Category</option>
                              <option value="Home- Industries Category">Home- Industries Category</option>
                              <option value="Home - Law Category">Home - Law Category</option>
                              <option value="Home- Small Business Category">Home- Small Business Category</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#1e293b]">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </div>
                          <p className="text-[10px] font-mono text-[#64748b] leading-relaxed">
                            Select where this story will be curated on the homepage layout. Any list slots will automatically push the newest article to rank #1 and shift older items down.
                          </p>
                        </div>

                        {/* NEWSLETTER BANNER SECTION (Matching User Images 1 & 2) */}
                        <div className="space-y-1.5 pt-1 text-left">
                          <label className="block text-[10px] font-mono font-bold text-[#ea580c] uppercase tracking-wider">
                            NEWSLETTER BANNER
                          </label>
                          <div className="relative">
                            <select
                              value={newsletterBanner}
                              onChange={(e) => setNewsletterBanner(e.target.value)}
                              className="w-full bg-[#fffdf0] border border-[#facc15] rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#1e293b] focus:outline-none focus:border-[#eab308] cursor-pointer appearance-none pr-8"
                            >
                              <option value="Auto — Middle of article (default)">Auto — Middle of article (default)</option>
                              <option value="Top of article">Top of article</option>
                              <option value="Middle of article">Middle of article</option>
                              <option value="End of article">End of article</option>
                              <option value="Off — don't show">Off — don't show</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#1e293b]">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </div>
                          <p className="text-[10px] font-mono text-[#64748b] leading-relaxed">
                            Where the "IBT Fast Start" signup banner appears inside this article.
                          </p>
                        </div>
                      </div>
                    )}

                    {sidebarTab === "SEO" && (
                      <div className="space-y-4 pt-1 font-sans text-left">
                        {/* Auto-Generate SEO Orange Button */}
                        <div>
                          <button
                            type="button"
                            onClick={handleAutoGenerateSEO}
                            className="w-full bg-[#f97316] hover:bg-[#ea580c] text-white font-sans font-extrabold text-xs py-3 px-4 rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-xs uppercase tracking-wider"
                          >
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                            <span>AUTO-GENERATE SEO</span>
                          </button>

                          <p className="text-[10px] font-mono text-[#64748b] leading-relaxed mt-2">
                            Keyword & meta description fill in automatically from your title and content. Edit any field to override.
                          </p>
                        </div>

                        {/* 1. CARD SUMMARY (SEO LEAD) */}
                        <div className="space-y-1.5">
                          <label className="block text-[10.5px] font-mono font-bold text-[#94a3b8] uppercase tracking-wider">
                            CARD SUMMARY (SEO LEAD)
                          </label>
                          <textarea
                            rows={3}
                            placeholder="Concise 1-2 sentence preview details."
                            value={cardSummary}
                            onChange={(e) => {
                              setCardSummary(e.target.value);
                              setIsManualSummary(true);
                            }}
                            className="w-full bg-white border border-[#cbd5e1] rounded-xl p-3 text-xs text-[#1e293b] placeholder-[#94a3b8] focus:outline-none focus:border-[#2563eb] leading-relaxed resize-y"
                          />
                        </div>

                        {/* 2. FOCUS KEYWORD */}
                        <div className="space-y-1.5">
                          <label className="block text-[10.5px] font-mono font-bold text-[#94a3b8] uppercase tracking-wider">
                            FOCUS KEYWORD
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Vexillum Minerals"
                            value={focusKeyword}
                            onChange={(e) => {
                              setFocusKeyword(e.target.value);
                              setIsManualKeyword(true);
                            }}
                            className="w-full bg-white border border-[#cbd5e1] rounded-xl px-3.5 py-2.5 text-xs text-[#1e293b] placeholder-[#94a3b8] focus:outline-none focus:border-[#2563eb]"
                          />

                          {/* Real-time Focus Keyword Detection Status Indicators */}
                          {focusKeyword.trim().length > 0 && (() => {
                            const cleanKw = focusKeyword.trim().toLowerCase();
                            const kwWords = cleanKw.split(/\s+/).filter((w) => w.length > 1);

                            const inTitle =
                              headline.trim().length > 0 &&
                              (headline.toLowerCase().includes(cleanKw) ||
                                (kwWords.length > 0 && kwWords.every((w) => headline.toLowerCase().includes(w))));

                            const inMetaDesc =
                              seoDescription.trim().length > 0 &&
                              (seoDescription.toLowerCase().includes(cleanKw) ||
                                (kwWords.length > 0 && kwWords.every((w) => seoDescription.toLowerCase().includes(w))));

                            return (
                              <div className="space-y-2 pt-2 font-mono text-[11px] leading-snug">
                                {/* Title includes focus keyword status */}
                                <div className={`flex items-start space-x-2 ${inTitle ? "text-[#059669]" : "text-[#94a3b8]"}`}>
                                  <svg
                                    className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${inTitle ? "text-[#059669]" : "text-[#94a3b8]"}`}
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                  >
                                    <circle cx="12" cy="12" r="9" />
                                    {inTitle ? (
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
                                    ) : (
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" />
                                    )}
                                  </svg>
                                  <span>{inTitle ? "The title includes the focus keyword." : "The title does not include the focus keyword."}</span>
                                </div>

                                {/* Meta description includes focus keyword status */}
                                <div className={`flex items-start space-x-2 ${inMetaDesc ? "text-[#059669]" : "text-[#94a3b8]"}`}>
                                  <svg
                                    className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${inMetaDesc ? "text-[#059669]" : "text-[#94a3b8]"}`}
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                  >
                                    <circle cx="12" cy="12" r="9" />
                                    {inMetaDesc ? (
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
                                    ) : (
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" />
                                    )}
                                  </svg>
                                  <span>
                                    {inMetaDesc
                                      ? "The meta description includes the focus keyword."
                                      : "The meta description does not include the focus keyword."}
                                  </span>
                                </div>
                              </div>
                            );
                          })()}
                        </div>

                        {/* 3. META DESCRIPTION */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <label className="block text-[10.5px] font-mono font-bold text-[#94a3b8] uppercase tracking-wider">
                              META DESCRIPTION
                            </label>
                            <span className="text-[10px] font-mono text-[#94a3b8]">
                              {seoDescription.length}/160
                            </span>
                          </div>
                          <textarea
                            rows={3}
                            placeholder="Discover why... — the sentence shown under the title in Google."
                            value={seoDescription}
                            onChange={(e) => {
                              setSeoDescription(e.target.value);
                              setIsManualDesc(true);
                            }}
                            className="w-full bg-white border border-[#cbd5e1] rounded-xl p-3 text-xs text-[#1e293b] placeholder-[#94a3b8] focus:outline-none focus:border-[#2563eb] leading-relaxed resize-y"
                          />
                        </div>

                        {/* 4. PREVIEW IN SEARCH RESULTS */}
                        <div className="space-y-1.5 pt-1">
                          <label className="flex items-center space-x-1.5 text-[10.5px] font-mono font-bold text-[#94a3b8] uppercase tracking-wider">
                            <svg className="w-3.5 h-3.5 text-[#94a3b8]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <span>PREVIEW IN SEARCH RESULTS</span>
                          </label>

                          {/* Search Result Card Box */}
                          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4 shadow-2xs space-y-2 text-left font-sans">
                            {/* Site Header: WT Circle Logo + Name & Domain */}
                            <div className="flex items-center space-x-2.5">
                              <div className="w-7 h-7 rounded-full bg-[#0f172a] text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                                WT
                              </div>
                              <div className="overflow-hidden">
                                <div className="text-[11px] font-bold text-[#0f172a] font-mono leading-none">
                                  Washington Times
                                </div>
                                <div className="text-[10px] text-[#475569] font-mono leading-none mt-1 truncate">
                                  www.washington-times.com › article...
                                </div>
                              </div>
                            </div>

                            {/* Article Title */}
                            <div className="text-sm font-bold text-[#0000d6] font-mono leading-tight hover:underline cursor-pointer truncate pt-1">
                              {headline ? `${headline} |...` : "Your Article Title |..."}
                            </div>

                            {/* Snippet Description */}
                            <div className="text-xs text-[#475569] font-mono leading-relaxed truncate">
                              {seoDescription || cardSummary || (headline ? `${headline}...` : "Article preview description will appear here.")}
                            </div>
                          </div>

                          <p className="text-[10px] font-mono text-[#64748b] leading-relaxed pt-1">
                            This is how the article can appear on Google. Meta description drives the snippet under the link.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* ARTICLE PREVIEW MODAL */}
      {showPreviewModal && (
        <div className="fixed inset-0 bg-white text-[#0f172a] z-50 overflow-y-auto font-sans animate-in fade-in duration-200">
          <header className="bg-[#0b132b] text-white h-auto min-h-[56px] px-3.5 sm:px-6 lg:px-10 py-2 flex items-center justify-between sticky top-0 z-50 border-b border-slate-800 shadow-md select-none flex-wrap sm:flex-nowrap gap-2">
            <div className="flex items-center space-x-3">
              <span className="bg-[#b45309] text-amber-100 font-mono text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded">
                PREVIEW MODE
              </span>
              <span className="text-xs text-[#94a3b8] font-sans font-medium hidden sm:inline">
                This is how your article with inline images will render on the live feed.
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowPreviewModal(false)}
              className="border border-[#334155] bg-[#1e293b] hover:bg-slate-800 text-white font-sans text-xs font-bold px-3.5 py-1.5 rounded-lg flex items-center space-x-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span className="uppercase tracking-wider font-extrabold text-[11px]">EXIT PREVIEW</span>
            </button>
          </header>

          <main className="w-full max-w-[1240px] mx-auto px-3.5 sm:px-6 lg:px-10 py-6 sm:py-10">
            <div className="flex flex-col lg:flex-row items-start justify-between gap-6 lg:gap-12">
              <div className="w-full lg:flex-1 max-w-[780px] text-left font-sans">
                <div className="flex items-center space-x-3 mb-3 font-sans">
                  {isExclusive && (
                    <span className="inline-block border border-[#333333] rounded-[3px] px-2 py-[2px] text-[11.5px] font-sans font-bold text-[#111111] tracking-wider leading-none select-none">
                      EXCLUSIVE
                    </span>
                  )}
                  <span className="text-[12px] font-sans font-bold text-[#666666] tracking-wider uppercase">
                    {mainCategory.toUpperCase()}
                  </span>
                </div>

                {headline.trim() && (
                  <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-encorpada-headline font-bold text-[#111111] mb-4">
                    {headline}
                  </h1>
                )}

                {subheadline.trim() && (
                  <p className="text-base sm:text-lg md:text-[19px] text-[#555555] font-sans leading-relaxed mb-6">
                    {subheadline}
                  </p>
                )}

                <div className="pt-1 pb-4 mb-8 border-b border-[#e2e8f0]">
                  <div className="font-sans flex items-center gap-3.5 flex-wrap">
                    <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden shrink-0 border border-gray-200 bg-gray-100 flex items-center justify-center">
                      <img src={authorImage} alt={authorName} className="w-full h-full object-cover rounded-full" />
                    </div>
                    <div>
                      <div className="text-[14px] font-bold text-[#111111] leading-tight flex items-center gap-2 flex-wrap">
                        <span>By <span className="underline cursor-pointer hover:text-black">{authorName}</span></span>

                        {/* Share Icon directly next to writer name */}
                        <button
                          type="button"
                          onClick={() => {
                            if (typeof window !== "undefined" && navigator.share) {
                              navigator.share({ title: headline, url: window.location.href }).catch(() => {});
                            } else if (typeof window !== "undefined" && navigator.clipboard) {
                              navigator.clipboard.writeText(window.location.href);
                              setPreviewToast("Link copied to clipboard!");
                              setTimeout(() => setPreviewToast(null), 2500);
                            }
                          }}
                          className="inline-flex items-center justify-center w-7 h-7 rounded-lg border border-[#cbd5e1] bg-white hover:bg-slate-100 text-[#334155] hover:text-[#0f172a] transition-colors cursor-pointer shadow-2xs ml-1"
                          title="Share Article"
                          aria-label="Share Article"
                          suppressHydrationWarning
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                            <path d="M4 19c2.5-2.5 6-4.5 11-4.5v4.5l8-8.5L15 2v4.5C8.5 6.5 4.5 11 4 19z" />
                          </svg>
                        </button>

                        {/* Bookmark Icon directly next to Share icon */}
                        <button
                          type="button"
                          onClick={handleToggleBookmark}
                          className={`inline-flex items-center justify-center w-7 h-7 rounded-lg border transition-all cursor-pointer shadow-2xs ${
                            isBookmarked
                              ? "text-[#ea580c] bg-amber-50 border-amber-300"
                              : "border-[#cbd5e1] bg-white hover:bg-slate-100 text-[#334155] hover:text-[#0f172a]"
                          }`}
                          title={isBookmarked ? "Remove Bookmark" : "Save Article Bookmark"}
                          aria-label="Save Article Bookmark"
                          suppressHydrationWarning
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            fill={isBookmarked ? "currentColor" : "none"}
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                            />
                          </svg>
                        </button>
                      </div>
                      <div className="text-[13.5px] font-semibold text-[#555555] leading-tight mt-1">
                        Aug. 18, 2026 10:13 am ET
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="flow-root text-[#1a1a1a] leading-[1.75] font-serif space-y-5 [&_p]:mb-5 [&_p]:leading-[1.75] [&_img]:rounded-xl [&_img]:max-w-full [&_blockquote]:border-l-[5px] [&_blockquote]:border-[#ea580c] [&_blockquote]:bg-[#f8fafc] [&_blockquote]:py-3.5 [&_blockquote]:px-5 [&_blockquote]:my-3 [&_blockquote]:rounded-r-md [&_blockquote]:italic [&_blockquote]:text-[#334155] [&_blockquote]:flow-root [&_pre]:bg-[#f1f5f9] [&_pre]:border-none [&_pre]:outline-none [&_pre]:p-5 [&_pre]:rounded-xl [&_pre]:italic [&_pre]:text-[#334155] [&_pre]:text-base [&_pre]:my-4 [&_pre]:max-w-full [&_pre]:box-border [&_pre]:whitespace-pre-wrap [&_pre]:break-words [&_pre]:flow-root transition-all duration-150"
                  dangerouslySetInnerHTML={{ __html: bodyContent }}
                />
              </div>

              <div className="w-full lg:w-[300px] shrink-0 font-sans text-left">
                <div className="border-t-2 border-[#0f172a] pt-3">
                  <h4 className="text-xs font-serif font-extrabold tracking-wider text-[#0f172a] uppercase mb-4">
                    RECENT IN {mainCategory.toUpperCase()}
                  </h4>
                  <p className="text-xs italic text-[#94a3b8] leading-relaxed">
                    No other recent articles in this category.
                  </p>
                </div>
              </div>
            </div>
          </main>

          {/* Interactive Floating Toast Notification */}
          {previewToast && (
            <div className="fixed bottom-6 right-6 bg-[#0f172a] text-white font-sans text-xs font-bold px-4.5 py-3 rounded-2xl shadow-2xl flex items-center space-x-2.5 z-50 animate-in slide-in-from-bottom-3 duration-200 border border-slate-700">
              <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span>{previewToast}</span>
            </div>
          )}
        </div>
      )}

      {/* INSERT IMAGE MODAL */}
      {showImageModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-[520px] w-full p-4 sm:p-7 max-h-[90vh] overflow-y-auto shadow-2xl space-y-4 font-sans text-left border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#fff7ed] border border-[#ffedd5] flex items-center justify-center text-[#ea580c]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-serif font-bold text-[#0f172a] tracking-tight">
                  Insert Article Image
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="text-gray-400 hover:text-slate-700 transition-colors p-1 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4 pt-1">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono font-bold text-[#94a3b8] uppercase tracking-wider">
                  CHOOSE COMPUTER FILE
                </label>
                <div className="border border-dashed border-[#cbd5e1] rounded-xl p-3 bg-[#f8fafc] text-xs font-mono text-[#475569]">
                  <div className="flex items-center space-x-2">
                    <label className="bg-white border border-[#cbd5e1] hover:bg-slate-50 text-[#0f172a] font-bold px-3 py-1.5 rounded-lg cursor-pointer transition-colors shrink-0 shadow-2xs">
                      Choose File
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setModalImageFile(file);
                        }}
                      />
                    </label>
                    <span className="truncate text-[#1e293b] font-medium">
                      {modalImageFile ? modalImageFile.name : "No file chosen"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono font-bold text-[#94a3b8] uppercase tracking-wider">
                  IMAGE CAPTION / ALT TEXT
                </label>
                <input
                  type="text"
                  placeholder="Describe this image..."
                  value={modalImageCaption}
                  onChange={(e) => setModalImageCaption(e.target.value)}
                  className="w-full bg-white border border-[#cbd5e1] rounded-xl px-3.5 py-2.5 text-xs text-[#1e293b] placeholder-[#94a3b8] focus:outline-none focus:border-[#ea580c] transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono font-bold text-[#94a3b8] uppercase tracking-wider">
                  IMAGE CREDIT / SOURCE (OPTIONAL)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Getty Images, AP Photo"
                  value={modalImageCredit}
                  onChange={(e) => setModalImageCredit(e.target.value)}
                  className="w-full bg-white border border-[#cbd5e1] rounded-xl px-3.5 py-2.5 text-xs text-[#1e293b] placeholder-[#94a3b8] focus:outline-none focus:border-[#ea580c] transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5 pt-1">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-mono font-bold text-[#94a3b8] uppercase tracking-wider">
                    IMAGE SIZE
                  </label>
                  <select
                    value={modalImageSize}
                    onChange={(e) => setModalImageSize(e.target.value)}
                    className="w-full bg-white border border-[#cbd5e1] rounded-xl px-3 py-2.5 text-xs font-sans text-[#1e293b] focus:outline-none focus:border-[#ea580c] transition-colors cursor-pointer"
                  >
                    <option value="Small (Width: 250px)">Small (Width: 250px)</option>
                    <option value="Medium (Width: 450px)">Medium (Width: 450px)</option>
                    <option value="Full-Width (100%)">Full-Width (100%)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-mono font-bold text-[#94a3b8] uppercase tracking-wider">
                    POSITION ALIGNMENT
                  </label>
                  <select
                    value={modalImageAlign}
                    onChange={(e) => setModalImageAlign(e.target.value)}
                    className="w-full bg-white border border-[#cbd5e1] rounded-xl px-3 py-2.5 text-xs font-sans text-[#1e293b] focus:outline-none focus:border-[#ea580c] transition-colors cursor-pointer"
                  >
                    <option value="Left (Wrap Text Right)">Left (Wrap Text Right)</option>
                    <option value="Center (No Wrap)">Center (No Wrap)</option>
                    <option value="Right (Wrap Text Left)">Right (Wrap Text Left)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3">
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="w-full bg-[#f1f5f9] hover:bg-slate-200 text-[#475569] font-bold text-xs py-3 rounded-xl transition-colors cursor-pointer uppercase tracking-wider"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={handleConfirmInsertImage}
                className="w-full bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-xs py-3 rounded-xl transition-colors cursor-pointer shadow-xs uppercase tracking-wider"
              >
                INSERT IMAGE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
