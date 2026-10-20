"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { BillionaireItem, WealthPoint, getBillionairesList, saveBillionairesList } from "@/data/billionaires";
import { getAuthHeaders } from "@/lib/authHeader";

export const INDUSTRY_OPTIONS = [
  "Technology",
  "Business & Finance",
  "Markets & Finance",
  "Real Estate",
  "Energy",
  "Automotive",
  "Manufacturing",
  "Agriculture",
  "Construction",
  "Fashion & Luxury",
  "Media & Entertainment",
  "Healthcare & Pharmaceuticals",
  "Consumer Goods & Retail",
  "Food & Beverage",
  "Investments & Private Equity",
  "Sports",
  "Hospitality & Tourism",
  "Telecommunications",
  "Transportation & Logistics",
];

const autoFormatNetWorth = (val: string): string => {
  if (!val.trim()) return "";
  const cleaned = val.trim();
  const digitsOnly = cleaned.replace(/[^0-9.]/g, "");
  if (!digitsOnly) return cleaned;
  if (cleaned.toUpperCase().includes("T")) {
    return `$${digitsOnly}T`;
  }
  return `$${digitsOnly} B`;
};

export default function BillionairesAdminDesk() {
  const [mounted, setMounted] = useState(false);
  const [billionaires, setBillionaires] = useState<BillionaireItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showLimitAlert, setShowLimitAlert] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const [editingItem, setEditingItem] = useState<BillionaireItem | null>(null);

  // Form State — Basic Information
  const [name, setName] = useState("");
  const [netWorth, setNetWorth] = useState("");
  const [changeStatus, setChangeStatus] = useState<BillionaireItem["changeStatus"]>("UP");
  const [age, setAge] = useState<string | number>("");
  const [country, setCountry] = useState("");
  const [source, setSource] = useState("");
  const [industry, setIndustry] = useState("");

  // Form State — Photo & Highlight
  const [photoUrl, setPhotoUrl] = useState("");
  const [highlightText, setHighlightText] = useState("");

  // Form State — Profile Page Header Valuation Data
  const [titleRole, setTitleRole] = useState("");
  const [realTimeNetWorth, setRealTimeNetWorth] = useState("");
  const [realTimeChange, setRealTimeChange] = useState("");
  const [realTimeChangeDir, setRealTimeChangeDir] = useState<"DOWN" | "UP" | "UNCHANGED">("DOWN");
  const [realTimeChangeAmount, setRealTimeChangeAmount] = useState("");
  const [realTimeChangePercent, setRealTimeChangePercent] = useState("");
  const [realTimeAsOf, setRealTimeAsOf] = useState("");
  const [listNetWorthAsOf, setListNetWorthAsOf] = useState("");
  const [photoCredit, setPhotoCredit] = useState("");

  // Helper to sanitize numeric inputs and remove leading zeros
  const cleanNumberOnly = (val: string, allowDecimal = true) => {
    let cleaned = allowDecimal
      ? val.replace(/[^0-9.]/g, "").replace(/(\..*?)\..*/g, "$1")
      : val.replace(/\D/g, "");
    if (cleaned.length > 1 && cleaned.startsWith("0") && cleaned[1] !== ".") {
      cleaned = cleaned.replace(/^0+/, "") || "0";
    }
    return cleaned;
  };

  // Helper to auto-assemble Real Time Change string
  const updateRealTimeChangeHelper = (dir: "DOWN" | "UP" | "UNCHANGED", amt: string, pct: string) => {
    const cleanAmtRaw = cleanNumberOnly(amt);
    const cleanPctRaw = cleanNumberOnly(pct);
    setRealTimeChangeDir(dir);
    setRealTimeChangeAmount(cleanAmtRaw);
    setRealTimeChangePercent(cleanPctRaw);
    let symbol = "▼";
    if (dir === "UP") symbol = "▲";
    if (dir === "UNCHANGED") symbol = "-";

    const cleanAmt = cleanAmtRaw.trim() ? (cleanAmtRaw.endsWith("B") || cleanAmtRaw.endsWith("M") ? `$${cleanAmtRaw}` : `$${cleanAmtRaw}B`) : "";
    const cleanPct = cleanPctRaw.trim() ? (cleanPctRaw.endsWith("%") ? cleanPctRaw : `${cleanPctRaw}%`) : "";

    if (cleanAmt && cleanPct) {
      setRealTimeChange(`${symbol} ${cleanAmt} (${cleanPct})`);
    } else if (cleanAmt) {
      setRealTimeChange(`${symbol} ${cleanAmt}`);
    } else if (cleanPct) {
      setRealTimeChange(`${symbol} (${cleanPct})`);
    } else {
      setRealTimeChange("");
    }
  };

  // Form State — Image 1 (From the Editor) & In Their Own Words
  const [editorLastUpdated, setEditorLastUpdated] = useState("");
  const [editorBulletPointsText, setEditorBulletPointsText] = useState("");
  const [inTheirOwnWordsQuote, setInTheirOwnWordsQuote] = useState("");
  const [inTheirOwnWordsQuote2, setInTheirOwnWordsQuote2] = useState("");

  // Form State — Image 3 (Personal Stats Table)
  const [selfMadeScore, setSelfMadeScore] = useState<string | number>("");
  const [philanthropyScore, setPhilanthropyScore] = useState<string | number>("");
  const [residence, setResidence] = useState("");
  const [citizenship, setCitizenship] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [children, setChildren] = useState<string | number>("");
  const [education, setEducation] = useState("");

  // Form State — Section 4 (Did You Know Carousel Hints)
  const [didYouKnowFactsText, setDidYouKnowFactsText] = useState("");

  // Form State — Wealth History Graph
  const [endYear, setEndYear] = useState<number>(2026);
  const [historyValues, setHistoryValues] = useState<{ [year: number]: number | string }>({
    2017: "",
    2018: "",
    2019: "",
    2020: "",
    2021: "",
    2022: "",
    2023: "",
    2024: "",
    2025: "",
    2026: "",
  });

  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadBillionaires = useCallback(() => {
    setBillionaires(getBillionairesList());
  }, []);

  useEffect(() => {
    loadBillionaires();
    window.addEventListener("wsj_billionaires_updated", loadBillionaires);
    return () => window.removeEventListener("wsj_billionaires_updated", loadBillionaires);
  }, [loadBillionaires]);

  // Compute 10-year window array ending at endYear
  const yearsWindow = Array.from({ length: 10 }, (_, i) => endYear - 9 + i);

  const openAddModal = () => {
    if (billionaires.length >= 20) {
      setShowLimitAlert(true);
      return;
    }
    setEditingItem(null);
    setName("");
    setNetWorth("");
    setChangeStatus("UP");
    setAge("");
    setCountry("");
    setSource("");
    setIndustry("");
    setPhotoUrl("");
    setHighlightText("");

    // Profile Page Header defaults (Empty for clean new additions)
    setTitleRole("");
    setRealTimeNetWorth("");
    setRealTimeChangeDir("DOWN");
    setRealTimeChangeAmount("");
    setRealTimeChangePercent("");
    setRealTimeChange("");
    setRealTimeAsOf("");
    setListNetWorthAsOf("");
    setPhotoCredit("");

    // From Editor & In Their Own Words
    setEditorLastUpdated("");
    setEditorBulletPointsText("");
    // Section 3 Defaults
    setInTheirOwnWordsQuote("");
    setInTheirOwnWordsQuote2("");

    // Personal Stats
    setSelfMadeScore("");
    setPhilanthropyScore("");
    setResidence("");
    setCitizenship("");
    setMaritalStatus("");
    setChildren("");
    setEducation("");

    // Section 4 Hints
    setDidYouKnowFactsText("");

    setEndYear(2026);
    const emptyHistory: { [yr: number]: number | string } = {};
    for (let yr = 2017; yr <= 2026; yr++) {
      emptyHistory[yr] = "";
    }
    setHistoryValues(emptyHistory);

    setErrorMsg("");
    setIsModalOpen(true);
  };

  const openEditModal = (item: BillionaireItem) => {
    setEditingItem(item);
    setName(item.name);
    setNetWorth(item.netWorth);
    setChangeStatus(item.changeStatus);
    setAge(item.age);
    setCountry(item.country);
    setSource(item.source);
    setIndustry(item.industry || "Technology");
    setPhotoUrl(item.photoUrl || "");
    setHighlightText(item.highlightText || "");

    setTitleRole(item.titleRole || `CEO, ${item.source}`);
    setRealTimeNetWorth(item.realTimeNetWorth || item.netWorth);
    setRealTimeChange(item.realTimeChange || "▼ $23.2B (2.21%)");

    const match = (item.realTimeChange || "").match(/([▼▲\-])\s*\$?([0-9.]+)[BM]?\s*(?:\(([0-9.]+)%?\))?/);
    if (match) {
      if (match[1] === "▲") setRealTimeChangeDir("UP");
      else if (match[1] === "-") setRealTimeChangeDir("UNCHANGED");
      else setRealTimeChangeDir("DOWN");
      setRealTimeChangeAmount(cleanNumberOnly(match[2] || ""));
      setRealTimeChangePercent(cleanNumberOnly(match[3] || ""));
    } else {
      setRealTimeChangeDir("DOWN");
      setRealTimeChangeAmount("");
      setRealTimeChangePercent("");
    }

    setRealTimeAsOf(item.realTimeAsOf || "10/7/26");
    setListNetWorthAsOf(item.listNetWorthAsOf || "3/10/26");
    setPhotoCredit(item.photoCredit || "TIMES CHICAGO FOR BILLIONAIRES");

    // From Editor & In Their Own Words
    setEditorLastUpdated(item.editorLastUpdated?.replace(/\s*EDT\s*/gi, "") || "Last Updated Sep 15, 2026, 6:30am");
    const bullets = (item.editorBulletPoints || []).map((b) => (b.startsWith("• ") ? b : `• ${b}`));
    setEditorBulletPointsText(bullets.join("\n"));
    setInTheirOwnWordsQuote(
      item.inTheirOwnWordsQuote ||
        `“I operate on the physics approach to analysis. You boil things down to the first principles in ${item.industry}.”`
    );
    setInTheirOwnWordsQuote2(
      item.inTheirOwnWordsQuote2 ||
        (item.inTheirOwnWordsQuotes && item.inTheirOwnWordsQuotes[1]) ||
        `“When something is important enough, you do it even if the odds are not in your favor.”`
    );

    // Personal Stats
    setSelfMadeScore(item.selfMadeScore !== undefined ? item.selfMadeScore : 8);
    setPhilanthropyScore(item.philanthropyScore !== undefined ? item.philanthropyScore : 1);
    setResidence(item.residence || `${item.country}`);
    setCitizenship(item.citizenship || item.country);
    setMaritalStatus(item.maritalStatus || "Married");
    setChildren(item.children !== undefined ? item.children : 3);
    setEducation(item.education || "Bachelor of Science, University");

    // Hints
    setDidYouKnowFactsText((item.didYouKnowFacts || []).join("\n"));

    const currentEndYear = item.endYear || (item.wealthHistory && item.wealthHistory.length > 0 ? Math.max(...item.wealthHistory.map(w => w.year)) : 2026);
    setEndYear(currentEndYear);

    const valMap: { [year: number]: number } = {};
    if (item.wealthHistory && item.wealthHistory.length > 0) {
      item.wealthHistory.forEach((wh) => {
        valMap[wh.year] = wh.value;
      });
    }

    const years = Array.from({ length: 10 }, (_, i) => currentEndYear - 9 + i);
    years.forEach((yr, idx) => {
      if (valMap[yr] === undefined) {
        valMap[yr] = (idx + 1) * 30;
      }
    });

    setHistoryValues(valMap);
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please select a valid image file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        headers: getAuthHeaders(),
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.url) {
          setPhotoUrl(data.url);
          setErrorMsg("");
          return;
        }
      }
    } catch (err) {
      console.warn("Direct upload error, falling back to base64 reader:", err);
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setPhotoUrl(event.target.result as string);
        setErrorMsg("");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleEndYearChange = (newEndYear: number) => {
    setEndYear(newEndYear);
    const newYears = Array.from({ length: 10 }, (_, i) => newEndYear - 9 + i);
    setHistoryValues((prev) => {
      const updated = { ...prev };
      newYears.forEach((yr, idx) => {
        if (updated[yr] === undefined) {
          const rawPrev = updated[yr - 1];
          const numPrev = typeof rawPrev === "number" ? rawPrev : Number(rawPrev);
          updated[yr] = !isNaN(numPrev) && numPrev > 0 ? Math.round(numPrev * 1.1) : (idx + 1) * 30;
        }
      });
      return updated;
    });
  };

  const handleEditorBulletsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let val = e.target.value;
    if (val && !val.startsWith("• ")) {
      val = "• " + val;
    }
    setEditorBulletPointsText(val);
  };

  const handleEditorBulletsKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const val = textarea.value;
      const newText = val.substring(0, start) + "\n• " + val.substring(end);
      setEditorBulletPointsText(newText);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 3;
      }, 0);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg("Billionaire name is required.");
      return;
    }

    const rawDigits = netWorth.replace(/[^0-9.]/g, "");
    if (!rawDigits) {
      setErrorMsg("List Net Worth must contain numbers (e.g. 839).");
      return;
    }
    const finalFormattedNetWorth = autoFormatNetWorth(netWorth);

    if (age && /\D/.test(age.toString().trim())) {
      setErrorMsg("Age must contain numbers only.");
      return;
    }

    if (selfMadeScore && (isNaN(Number(selfMadeScore)) || Number(selfMadeScore) < 1 || Number(selfMadeScore) > 10)) {
      setErrorMsg("Self-Made Score must be a number between 1 and 10.");
      return;
    }

    if (philanthropyScore && (isNaN(Number(philanthropyScore)) || Number(philanthropyScore) < 1 || Number(philanthropyScore) > 5)) {
      setErrorMsg("Philanthropy Score must be a number between 1 and 5.");
      return;
    }

    if (children && /\D/.test(children.toString().trim())) {
      setErrorMsg("Children count must contain numbers only.");
      return;
    }

    const wealthHistoryPoints: WealthPoint[] = yearsWindow.map((yr) => ({
      year: yr,
      value: Number(historyValues[yr]) || 0,
    }));

    const parsedBullets = editorBulletPointsText
      .split("\n")
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .map((s) => (s.startsWith("• ") ? s.substring(2).trim() : s.replace(/^[•\-\*]\s*/, "")));

    const parsedFacts = didYouKnowFactsText
      .split("\n")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const now = new Date();
    const autoLastUpdated = `Last Updated ${now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}, ${now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}`;

    let updated: BillionaireItem[] = [...billionaires];

    if (editingItem) {
      updated = updated.map((b) =>
        b.id === editingItem.id
          ? {
              ...b,
              name: name.trim(),
              netWorth: finalFormattedNetWorth,
              changeStatus,
              age: age || "",
              country: country.trim() || "United States",
              source: source.trim() || "Investments",
              industry: industry || "Technology",
              photoUrl: photoUrl.trim(),
              highlightText: highlightText.trim(),
              endYear,
              wealthHistory: wealthHistoryPoints,
              titleRole: titleRole.trim(),
              realTimeNetWorth: autoFormatNetWorth(realTimeNetWorth || finalFormattedNetWorth),
              realTimeChange: realTimeChange.trim(),
              realTimeAsOf: realTimeAsOf.trim(),
              listNetWorthAsOf: listNetWorthAsOf.trim(),
              photoCredit: photoCredit.trim(),
              editorLastUpdated: autoLastUpdated,
              editorBulletPoints: parsedBullets,
              inTheirOwnWordsQuote: inTheirOwnWordsQuote.trim(),
              inTheirOwnWordsQuote2: inTheirOwnWordsQuote2.trim(),
              inTheirOwnWordsQuotes: [inTheirOwnWordsQuote.trim(), inTheirOwnWordsQuote2.trim()].filter(Boolean),
              selfMadeScore: selfMadeScore || 8,
              philanthropyScore: philanthropyScore || 1,
              residence: residence.trim(),
              citizenship: citizenship.trim(),
              maritalStatus: maritalStatus.trim(),
              children: children || 0,
              education: education.trim(),
              didYouKnowFacts: parsedFacts,
            }
          : b
      );
    } else {
      const newItem: BillionaireItem = {
        id: Date.now().toString(),
        rank: updated.length + 1,
        name: name.trim(),
        netWorth: finalFormattedNetWorth,
        changeStatus,
        age: age || "",
        country: country.trim() || "United States",
        source: source.trim() || "Investments",
        industry: industry || "Technology",
        photoUrl: photoUrl.trim(),
        highlightText: highlightText.trim(),
        endYear,
        wealthHistory: wealthHistoryPoints,
        titleRole: titleRole.trim(),
        realTimeNetWorth: autoFormatNetWorth(realTimeNetWorth || finalFormattedNetWorth),
        realTimeChange: realTimeChange.trim(),
        realTimeAsOf: realTimeAsOf.trim(),
        listNetWorthAsOf: listNetWorthAsOf.trim(),
        photoCredit: photoCredit.trim(),
        editorLastUpdated: autoLastUpdated,
        editorBulletPoints: parsedBullets,
        inTheirOwnWordsQuote: inTheirOwnWordsQuote.trim(),
        inTheirOwnWordsQuote2: inTheirOwnWordsQuote2.trim(),
        inTheirOwnWordsQuotes: [inTheirOwnWordsQuote.trim(), inTheirOwnWordsQuote2.trim()].filter(Boolean),
        selfMadeScore: selfMadeScore || 8,
        philanthropyScore: philanthropyScore || 1,
        residence: residence.trim(),
        citizenship: citizenship.trim(),
        maritalStatus: maritalStatus.trim(),
        children: children || 0,
        education: education.trim(),
        didYouKnowFacts: parsedFacts,
      };
      updated.push(newItem);
    }

    saveBillionairesList(updated);
    setBillionaires(updated);
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to remove this billionaire from the list?")) {
      const filtered = billionaires.filter((b) => b.id !== id);
      saveBillionairesList(filtered);
      setBillionaires(filtered);
    }
  };

  const handleMove = (index: number, direction: "UP" | "DOWN") => {
    if (direction === "UP" && index === 0) return;
    if (direction === "DOWN" && index === billionaires.length - 1) return;

    const targetIndex = direction === "UP" ? index - 1 : index + 1;
    const reordered = [...billionaires];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;

    saveBillionairesList(reordered);
    setBillionaires(reordered);
  };

  return (
    <div className="space-y-6 ">
      {/* Header Bar */}
      <div className="bg-white border border-[#e5e7eb] rounded-3xl p-6 sm:p-8 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h2 className="font-bold text-xl sm:text-2xl text-[#0f172a] tracking-tight">
              World Billionaires Management
            </h2>
          </div>
          <p className="text-xs text-[#64748b] mt-1 max-w-2xl">
            Configure billionaire profile details (From the Editor bullets, Wealth History graph, Personal Stats, Did You Know quotes, and In Their Own Words quote block).
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="px-5 py-2.5 rounded-xl bg-[#111111] hover:bg-[#333333] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-2xs flex items-center space-x-2 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span>Add Billionaire</span>
        </button>
      </div>

      {/* Billionaires Data Table */}
      <div className="bg-white border border-[#e5e7eb] rounded-3xl overflow-hidden shadow-2xs">
        <div className="p-6 border-b border-[#f1f5f9] flex items-center justify-between">
          <h3 className="font-bold text-sm text-[#0f172a] uppercase tracking-wider">
            Current World Billionaires ({billionaires.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8fafc] border-b border-[#e2e8f0] text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                <th className="py-3 px-4 w-16 text-center">Rank</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Net Worth</th>
                <th className="py-3 px-4 text-center">Wealth Change</th>
                <th className="py-3 px-4 text-center">Age</th>
                <th className="py-3 px-4">Country</th>
                <th className="py-3 px-4">Source</th>
                <th className="py-3 px-4">Industry</th>
                <th className="py-3 px-4 text-center w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9] text-xs text-[#1e293b]">
              {billionaires.map((item, idx) => (
                <tr key={item.id} className="hover:bg-[#f8fafc] transition-colors">
                  <td className="py-3.5 px-4 font-extrabold text-center text-[#475569]">
                    {idx + 1}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#0f172a]">
                    <div className="flex items-center space-x-2.5">
                      {item.photoUrl && (
                        <img
                          src={item.photoUrl}
                          alt=""
                          className="w-7 h-7 rounded-full object-cover shrink-0 border border-gray-200"
                        />
                      )}
                      <span>{item.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-[#0f172a] whitespace-nowrap">
                    {item.netWorth}
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold">
                    {item.changeStatus === "UP" && <span className="text-[#10b981] bg-[#ecfdf5] px-2 py-0.5 rounded text-[10px]">▲ UP</span>}
                    {item.changeStatus === "DOWN" && <span className="text-[#ef4444] bg-[#fef2f2] px-2 py-0.5 rounded text-[10px]">▼ DOWN</span>}
                    {item.changeStatus === "UNCHANGED" && <span className="text-[#64748b] bg-[#f1f5f9] px-2 py-0.5 rounded text-[10px]">- UNCHANGED</span>}
                    {item.changeStatus === "NEW" && <span className="text-[#0f172a] bg-[#f8fafc] px-2 py-0.5 rounded text-[10px] border border-[#cbd5e1]">+ NEW</span>}
                    {item.changeStatus === "RETURNEE" && <span className="text-[#0f172a] bg-[#f8fafc] px-2 py-0.5 rounded text-[10px] border border-[#cbd5e1]">↺ RETURNEE</span>}
                  </td>
                  <td className="py-3.5 px-4 text-center text-[#64748b]">
                    {item.age || "-"}
                  </td>
                  <td className="py-3.5 px-4 text-[#475569]">
                    {item.country}
                  </td>
                  <td className="py-3.5 px-4 text-[#475569]">
                    {item.source}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-[#475569]">
                    {item.industry}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(item)}
                        className="p-1 text-[#2563eb] hover:text-[#1d4ed8] font-bold cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        className="p-1 text-[#ef4444] hover:text-[#dc2626] font-bold cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal Dialog with Perfect Internal Scrolling */}
      {isModalOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-[#e2e8f0]">
            {/* Fixed Modal Header */}
            <div className="shrink-0 p-5 sm:p-6 border-b border-[#f1f5f9] flex items-center justify-between bg-white z-10">
              <h3 className="font-bold text-lg text-[#0f172a]">
                {editingItem ? `Edit Billionaire: ${editingItem.name}` : "Add New Billionaire (Max 20)"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#64748b] hover:text-[#0f172a] font-bold text-sm flex items-center justify-center cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form id="billionaire-form" onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-xs font-medium text-[#1e293b]">
              {errorMsg && (
                <div className="bg-[#fef2f2] border border-[#fca5a5] text-[#dc2626] px-4 py-2.5 rounded-xl text-xs font-medium">
                  {errorMsg}
                </div>
              )}

              {/* Section 1: Billionaire Profile */}
              <div className="border-b border-[#f1f5f9] pb-5 space-y-3.5">
                <div className="bg-[#f8fafc] border border-[#e2e8f0] px-3.5 py-2 rounded-xl">
                  <span className="text-[12px] font-extrabold uppercase text-[#0f172a] tracking-wider block">
                    1. Billionaire Profile
                  </span>
                  <p className="text-[11px] text-[#64748b]">
                    Main profile attributes, net worth metrics, headshot photo, title/role, and personal stats table fields.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#64748b] font-bold uppercase tracking-wider mb-1">
                      Billionaire Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Elon Musk"
                      className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl px-3.5 py-2 text-xs text-[#0f172a] focus:outline-none focus:border-black"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[#64748b] font-bold uppercase tracking-wider mb-1 whitespace-nowrap">
                      List Net Worth (Enter numbers, e.g. 839) *
                    </label>
                    <input
                      type="text"
                      value={netWorth}
                      onChange={(e) => setNetWorth(cleanNumberOnly(e.target.value))}
                      placeholder="e.g. 839 (System auto-adds $ & B)"
                      className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl px-3.5 py-2 text-xs text-[#0f172a] focus:outline-none focus:border-black"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[#64748b] font-bold uppercase tracking-wider mb-1">
                      Wealth Status
                    </label>
                    <select
                      value={changeStatus}
                      onChange={(e) => setChangeStatus(e.target.value as any)}
                      className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl px-3 py-2 text-xs text-[#0f172a] focus:outline-none focus:border-black cursor-pointer"
                    >
                      <option value="UP">▲ UP</option>
                      <option value="DOWN">▼ DOWN</option>
                      <option value="UNCHANGED">- UNCHANGED</option>
                      <option value="NEW">+ NEW</option>
                      <option value="RETURNEE">↺ RETURNEE</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#64748b] font-bold uppercase tracking-wider mb-1">
                      Age (Numbers Only)
                    </label>
                    <input
                      type="text"
                      value={age}
                      onChange={(e) => setAge(e.target.value.replace(/\D/g, ""))}
                      placeholder="e.g. 54"
                      className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl px-3.5 py-2 text-xs text-[#0f172a] focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-[#64748b] font-bold uppercase tracking-wider mb-1">
                      Country / Territory
                    </label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="e.g. United States"
                      className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl px-3.5 py-2 text-xs text-[#0f172a] focus:outline-none focus:border-black"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#64748b] font-bold uppercase tracking-wider mb-1">
                      Source of Wealth
                    </label>
                    <input
                      type="text"
                      value={source}
                      onChange={(e) => setSource(e.target.value)}
                      placeholder="e.g. Tesla, SpaceX"
                      className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl px-3.5 py-2 text-xs text-[#0f172a] focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-[#64748b] font-bold uppercase tracking-wider mb-1">
                      Industry (Select from List)
                    </label>
                    <select
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl px-3 py-2 text-xs text-[#0f172a] focus:outline-none focus:border-black cursor-pointer"
                    >
                      <option value="">Select Industry...</option>
                      {INDUSTRY_OPTIONS.map((ind) => (
                        <option key={ind} value={ind}>
                          {ind}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[#64748b] font-bold uppercase tracking-wider mb-1">
                    Billionaire Headshot Photo
                  </label>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <input
                      type="text"
                      value={photoUrl}
                      onChange={(e) => setPhotoUrl(e.target.value)}
                      placeholder="Paste image URL (https://...)"
                      className="flex-1 bg-[#f8fafc] border border-[#cbd5e1] rounded-xl px-3.5 py-2 text-xs text-[#0f172a] focus:outline-none focus:border-black"
                    />
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#0f172a] border border-[#cbd5e1] font-bold px-3.5 py-2 rounded-xl cursor-pointer transition-colors whitespace-nowrap flex items-center justify-center space-x-1.5"
                    >
                      <svg className="w-4 h-4 text-[#475569]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                      </svg>
                      <span>Upload Image</span>
                    </button>
                  </div>

                  {photoUrl && (
                    <div className="mt-2.5 flex items-center space-x-3 p-2 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl">
                      <img
                        src={photoUrl}
                        alt="Preview"
                        className="w-12 h-12 rounded-lg object-cover border border-[#cbd5e1]"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-bold text-[#0f172a] truncate">Image Attached</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPhotoUrl("")}
                        className="text-[#ef4444] hover:text-[#dc2626] font-bold text-xs cursor-pointer px-2 py-1"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[#64748b] font-bold uppercase tracking-wider mb-1">
                    Highlight Bio Text
                  </label>
                  <textarea
                    rows={2}
                    value={highlightText}
                    onChange={(e) => setHighlightText(e.target.value)}
                    placeholder="e.g. Elon Musk became the world's first trillionaire on June 12 when SpaceX went public."
                    className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl px-3.5 py-2 text-xs text-[#0f172a] focus:outline-none focus:border-black"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[#64748b] font-bold uppercase tracking-wider mb-1">
                      Title & Role
                    </label>
                    <input
                      type="text"
                      value={titleRole}
                      onChange={(e) => setTitleRole(e.target.value)}
                      placeholder="e.g. CEO, Tesla, SpaceX"
                      className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl px-3.5 py-2 text-xs text-[#0f172a] focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-[#64748b] font-bold uppercase tracking-wider mb-1">
                      Real Time Net Worth (Numbers Only)
                    </label>
                    <input
                      type="text"
                      value={realTimeNetWorth}
                      onChange={(e) => setRealTimeNetWorth(cleanNumberOnly(e.target.value))}
                      placeholder="e.g. 1.028 (Auto-adds $ & T)"
                      className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl px-3.5 py-2 text-xs text-[#0f172a] focus:outline-none focus:border-black"
                    />
                  </div>

                <div className="bg-[#f8fafc] border border-[#cbd5e1] p-3 rounded-xl space-y-2 mt-1 col-span-1 sm:col-span-3">
                  <span className="block text-[11px] font-extrabold text-[#0f172a] uppercase tracking-wider">
                    Real Time Change Helper
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[#64748b] font-bold text-[10px] uppercase mb-1">
                        Direction
                      </label>
                      <select
                        value={realTimeChangeDir}
                        onChange={(e) => updateRealTimeChangeHelper(e.target.value as any, realTimeChangeAmount, realTimeChangePercent)}
                        className="w-full bg-white border border-[#cbd5e1] rounded-lg px-2.5 py-1.5 text-xs text-[#0f172a] focus:outline-none focus:border-black cursor-pointer font-bold"
                      >
                        <option value="DOWN">▼ DOWN (Red)</option>
                        <option value="UP">▲ UP (Green)</option>
                        <option value="UNCHANGED">- UNCHANGED</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[#64748b] font-bold text-[10px] uppercase mb-1">
                        Change Amount (Numbers Only)
                      </label>
                      <input
                        type="text"
                        value={realTimeChangeAmount}
                        onChange={(e) => updateRealTimeChangeHelper(realTimeChangeDir, e.target.value, realTimeChangePercent)}
                        placeholder="e.g. 23.2"
                        className="w-full bg-white border border-[#cbd5e1] rounded-lg px-2.5 py-1.5 text-xs text-[#0f172a] focus:outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-[#64748b] font-bold text-[10px] uppercase mb-1">
                        Change % (Numbers Only)
                      </label>
                      <input
                        type="text"
                        value={realTimeChangePercent}
                        onChange={(e) => updateRealTimeChangeHelper(realTimeChangeDir, realTimeChangeAmount, e.target.value)}
                        placeholder="e.g. 2.21"
                        className="w-full bg-white border border-[#cbd5e1] rounded-lg px-2.5 py-1.5 text-xs text-[#0f172a] focus:outline-none focus:border-black"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#64748b] font-bold text-[10px] uppercase mb-1">
                      Assembled Result (Editable)
                    </label>
                    <input
                      type="text"
                      value={realTimeChange}
                      onChange={(e) => setRealTimeChange(e.target.value)}
                      placeholder="e.g. ▼ $23.2B (2.21%)"
                      className="w-full bg-white border border-[#cbd5e1] rounded-lg px-2.5 py-1.5 text-xs text-[#0f172a] font-bold focus:outline-none focus:border-black"
                    />
                  </div>
                </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[#64748b] font-bold uppercase tracking-wider mb-1">
                      Real Time As Of Date
                    </label>
                    <input
                      type="text"
                      value={realTimeAsOf}
                      onChange={(e) => setRealTimeAsOf(e.target.value)}
                      placeholder="e.g. 10/7/26"
                      className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl px-3.5 py-2 text-xs text-[#0f172a] focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-[#64748b] font-bold uppercase tracking-wider mb-1">
                      Self-Made Score (1-10)
                    </label>
                    <input
                      type="text"
                      value={selfMadeScore}
                      onChange={(e) => setSelfMadeScore(e.target.value.replace(/\D/g, ""))}
                      placeholder="8"
                      className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl px-3.5 py-2 text-xs text-[#0f172a] focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-[#64748b] font-bold uppercase tracking-wider mb-1">
                      Philanthropy Score (1-5)
                    </label>
                    <input
                      type="text"
                      value={philanthropyScore}
                      onChange={(e) => setPhilanthropyScore(e.target.value.replace(/\D/g, ""))}
                      placeholder="1"
                      className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl px-3.5 py-2 text-xs text-[#0f172a] focus:outline-none focus:border-black"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[#64748b] font-bold uppercase tracking-wider mb-1">
                      Residence
                    </label>
                    <input
                      type="text"
                      value={residence}
                      onChange={(e) => setResidence(e.target.value)}
                      placeholder="e.g. Austin, Texas"
                      className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl px-3.5 py-2 text-xs text-[#0f172a] focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-[#64748b] font-bold uppercase tracking-wider mb-1">
                      Citizenship
                    </label>
                    <input
                      type="text"
                      value={citizenship}
                      onChange={(e) => setCitizenship(e.target.value)}
                      placeholder="e.g. United States"
                      className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl px-3.5 py-2 text-xs text-[#0f172a] focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-[#64748b] font-bold uppercase tracking-wider mb-1">
                      Marital Status
                    </label>
                    <input
                      type="text"
                      value={maritalStatus}
                      onChange={(e) => setMaritalStatus(e.target.value)}
                      placeholder="e.g. Divorced"
                      className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl px-3.5 py-2 text-xs text-[#0f172a] focus:outline-none focus:border-black"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#64748b] font-bold uppercase tracking-wider mb-1">
                      Children Count (Numbers Only)
                    </label>
                    <input
                      type="text"
                      value={children}
                      onChange={(e) => setChildren(e.target.value.replace(/\D/g, ""))}
                      placeholder="14"
                      className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl px-3.5 py-2 text-xs text-[#0f172a] focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-[#64748b] font-bold uppercase tracking-wider mb-1">
                      Education
                    </label>
                    <input
                      type="text"
                      value={education}
                      onChange={(e) => setEducation(e.target.value)}
                      placeholder="e.g. University of Pennsylvania"
                      className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl px-3.5 py-2 text-xs text-[#0f172a] focus:outline-none focus:border-black"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Editor Overview & Key Takeaways */}
              <div className="border-b border-[#f1f5f9] pb-5 space-y-3">
                <div className="bg-[#f8fafc] border border-[#e2e8f0] px-3.5 py-2 rounded-xl">
                  <span className="text-[12px] font-extrabold uppercase text-[#0f172a] tracking-wider block">
                    2. Editor Overview & Key Takeaways
                  </span>
                  <p className="text-[11px] text-[#64748b]">
                    Provide key points about this billionaire. Type text and press Enter — bullet points (•) will be generated automatically!
                  </p>
                </div>

                <div>
                  <label className="block text-[#64748b] font-bold uppercase tracking-wider mb-1">
                    Key Bullet Points (Auto-bulleted on Enter — Min 5 points)
                  </label>
                  <textarea
                    rows={5}
                    value={editorBulletPointsText}
                    onChange={handleEditorBulletsChange}
                    onKeyDown={handleEditorBulletsKeyDown}
                    placeholder="• Point 1: Became world's first trillionaire when SpaceX went public&#10;• Point 2: SpaceX valuation reached nearly $2 trillion&#10;• Point 3: Cofounder of seven major global enterprises"
                    className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl px-3.5 py-2.5 text-xs text-[#0f172a] focus:outline-none focus:border-black font-sans"
                  />
                </div>
              </div>

              {/* Section 3: Famous Quotes & Personal Statements */}
              <div className="border-b border-[#f1f5f9] pb-5 space-y-3">
                <div className="bg-[#f8fafc] border border-[#e2e8f0] px-3.5 py-2 rounded-xl">
                  <span className="text-[12px] font-extrabold uppercase text-[#0f172a] tracking-wider block">
                    3. Famous Quotes & Personal Statements (2 Quotes for Slider)
                  </span>
                  <p className="text-[11px] text-[#64748b]">
                    Famous quotes or core statements made by this billionaire rendered in the "In Their Own Words" quote block slider.
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[#64748b] font-bold uppercase tracking-wider mb-1">
                      Quote 1 (Slide 1)
                    </label>
                    <textarea
                      rows={3}
                      value={inTheirOwnWordsQuote}
                      onChange={(e) => setInTheirOwnWordsQuote(e.target.value)}
                      placeholder="e.g. “I operate on the physics approach to analysis. You boil things down to the first principles or fundamental truths in a particular area and then you reason up from there.”"
                      className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl px-3.5 py-2.5 text-xs text-[#0f172a] focus:outline-none focus:border-black font-serif italic"
                    />
                  </div>

                  <div>
                    <label className="block text-[#64748b] font-bold uppercase tracking-wider mb-1">
                      Quote 2 (Slide 2)
                    </label>
                    <textarea
                      rows={3}
                      value={inTheirOwnWordsQuote2}
                      onChange={(e) => setInTheirOwnWordsQuote2(e.target.value)}
                      placeholder="e.g. “When something is important enough, you do it even if the odds are not in your favor.”"
                      className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl px-3.5 py-2.5 text-xs text-[#0f172a] focus:outline-none focus:border-black font-serif italic"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Billionaire Hints Carousel */}
              <div className="border-b border-[#f1f5f9] pb-5 space-y-3">
                <div className="bg-[#f8fafc] border border-[#e2e8f0] px-3.5 py-2 rounded-xl">
                  <span className="text-[12px] font-extrabold uppercase text-[#0f172a] tracking-wider block">
                    4. Billionaire Hints Carousel
                  </span>
                  <p className="text-[11px] text-[#64748b]">
                    Includes hints for people who don't know about this billionaire. Rendered in the "Did You Know" carousel slider.
                  </p>
                </div>

                <div>
                  <label className="block text-[#64748b] font-bold uppercase tracking-wider mb-1">
                    Slider Hints (Enter 1 hint per line)
                  </label>
                  <textarea
                    rows={4}
                    value={didYouKnowFactsText}
                    onChange={(e) => setDidYouKnowFactsText(e.target.value)}
                    placeholder="Hint 1: Slept on factory floor at Tesla during Model 3 production ramping in 2018.&#10;Hint 2: Co-founded PayPal before selling to eBay for $1.5 billion in 2002."
                    className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl px-3.5 py-2.5 text-xs text-[#0f172a] focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              {/* Section 5: Wealth History & 10-Year Trend Data */}
              <div className="space-y-3">
                <div className="bg-[#f8fafc] border border-[#e2e8f0] px-3.5 py-2 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[12px] font-extrabold uppercase text-[#0f172a] tracking-wider block">
                      5. Wealth History & 10-Year Trend Data
                    </span>
                    <p className="text-[11px] text-[#64748b]">
                      Interactive line graph values for 10-year net worth history ($B).
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <label className="text-[11px] font-bold text-[#475569] uppercase">End Year:</label>
                    <select
                      value={endYear}
                      onChange={(e) => handleEndYearChange(Number(e.target.value))}
                      className="bg-white border border-[#cbd5e1] text-[#0f172a] font-bold rounded-lg px-2.5 py-1 text-xs focus:outline-none cursor-pointer"
                    >
                      {[2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035].map((yr) => (
                        <option key={yr} value={yr}>
                          {yr}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <p className="text-[11px] text-[#64748b]">
                  Showing 10 years ending in <span className="font-bold text-[#0f172a]">{endYear}</span> ({yearsWindow[0]}–{endYear}).
                </p>

                <div className="grid grid-cols-5 gap-2 pt-1">
                  {yearsWindow.map((yr) => (
                    <div key={yr}>
                      <label className="block text-[10px] font-extrabold text-center text-[#475569] uppercase mb-1">
                        {yr} ($B)
                      </label>
                      <input
                        type="text"
                        value={historyValues[yr] !== undefined ? historyValues[yr] : ""}
                        onChange={(e) => {
                          const val = cleanNumberOnly(e.target.value);
                          setHistoryValues((prev) => ({ ...prev, [yr]: val }));
                        }}
                        placeholder="0"
                        className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-lg px-2 py-1.5 text-center text-xs font-bold text-[#0f172a] focus:outline-none focus:border-black"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </form>

            {/* Fixed Modal Footer */}
            <div className="shrink-0 p-4 sm:p-5 border-t border-[#f1f5f9] bg-[#f8fafc] flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-[#cbd5e1] font-bold text-xs text-[#64748b] hover:bg-white cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="billionaire-form"
                className="px-6 py-2.5 rounded-xl bg-[#111111] hover:bg-[#333333] text-white font-bold text-xs uppercase tracking-wider cursor-pointer transition-colors shadow-2xs"
              >
                {editingItem ? "Save Changes" : "Add Billionaire"}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* 20 Billionaires Limit Warning Popup Modal */}
      {showLimitAlert && mounted && createPortal(
        <div className="fixed inset-0 z-[999999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150 font-sans">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-sm w-full shadow-2xl border border-[#e2e8f0] text-center space-y-4 relative">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-1 shrink-0">
              <svg className="w-6 h-6 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0f172a]">Maximum Limit Reached</h3>
              <p className="text-xs text-[#64748b] mt-1.5 leading-relaxed">
                Only 20 billionaires can be added to the list. Please edit or delete an existing billionaire before adding a new one.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowLimitAlert(false)}
              className="w-full bg-[#0f172a] hover:bg-[#1e293b] text-white font-bold py-2.5 px-4 rounded-xl transition-all cursor-pointer text-xs uppercase tracking-wider font-sans shadow-xs mt-2"
            >
              Understood
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
