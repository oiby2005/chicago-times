"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import {
  EntrepreneurItem,
  CompanyShareholding,
  getEntrepreneursList,
  saveEntrepreneursList,
} from "@/data/entrepreneurs";
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

export const WORLD_COUNTRIES = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Japan",
  "China",
  "India",
  "Singapore",
  "Switzerland",
  "United Arab Emirates",
  "Saudi Arabia",
  "Israel",
  "South Korea",
  "Hong Kong",
  "Netherlands",
  "Sweden",
  "Spain",
  "Italy",
  "Brazil",
  "Mexico",
  "Ireland",
  "Norway",
  "Denmark",
  "Finland",
  "Belgium",
  "Austria",
  "New Zealand",
  "South Africa",
  "Indonesia",
  "Malaysia",
  "Turkey",
  "Poland",
  "Argentina",
  "Chile",
  "Colombia",
  "Egypt",
  "Greece",
  "Hungary",
  "Kenya",
  "Nigeria",
  "Pakistan",
  "Philippines",
  "Portugal",
  "Qatar",
  "Romania",
  "Thailand",
  "Vietnam"
];

export default function EntrepreneursAdminDesk() {
  const [mounted, setMounted] = useState(false);
  const [entrepreneurs, setEntrepreneurs] = useState<EntrepreneurItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showLimitAlert, setShowLimitAlert] = useState(false);
  const [editingItem, setEditingItem] = useState<EntrepreneurItem | null>(null);

  // Form State — Basic Information
  const [name, setName] = useState("");
  const [titleRole, setTitleRole] = useState("");
  const [bio, setBio] = useState("");
  const [website, setWebsite] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [age, setAge] = useState<string | number>("");
  const [country, setCountry] = useState("United States");
  const [source, setSource] = useState("");
  const [industry, setIndustry] = useState("Technology");
  const [gender, setGender] = useState("Male");
  const [rawValuationNumber, setRawValuationNumber] = useState("");
  const [netWorthMillions, setNetWorthMillions] = useState("");

  // Form State — Companies & Shareholdings (Image 1)
  const [companies, setCompanies] = useState<CompanyShareholding[]>([]);

  // Form State — Profile Details & Personal Stats
  const [highlightText, setHighlightText] = useState("");
  const [editorLastUpdated, setEditorLastUpdated] = useState("");
  const [editorBulletPointsText, setEditorBulletPointsText] = useState("");
  const [inTheirOwnWordsQuote, setInTheirOwnWordsQuote] = useState("");
  const [inTheirOwnWordsQuote2, setInTheirOwnWordsQuote2] = useState("");
  const [selfMadeScore, setSelfMadeScore] = useState<string | number>("");
  const [philanthropyScore, setPhilanthropyScore] = useState<string | number>("");
  const [maritalStatus, setMaritalStatus] = useState("Single");
  const [children, setChildren] = useState<string | number>("");
  const [residence, setResidence] = useState("");
  const [citizenship, setCitizenship] = useState("");
  const [education, setEducation] = useState("");
  const [fact1, setFact1] = useState("");
  const [fact2, setFact2] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const loadEntrepreneurs = useCallback(() => {
    let localItems: EntrepreneurItem[] = [];
    try {
      localItems = getEntrepreneursList();
    } catch (e) {}

    fetch("http://localhost:5000/api/entrepreneurs")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.success && Array.isArray(data.entrepreneurs) && data.entrepreneurs.length > 0) {
          setEntrepreneurs(data.entrepreneurs);
        } else if (localItems.length > 0) {
          setEntrepreneurs(localItems);
        }
      })
      .catch(() => {
        if (localItems.length > 0) {
          setEntrepreneurs(localItems);
        }
      });
  }, []);

  useEffect(() => {
    loadEntrepreneurs();
    window.addEventListener("wsj_entrepreneurs_updated", loadEntrepreneurs);
    return () => window.removeEventListener("wsj_entrepreneurs_updated", loadEntrepreneurs);
  }, [loadEntrepreneurs]);

  const openAddModal = () => {
    if (entrepreneurs.length >= 20) {
      setShowLimitAlert(true);
      return;
    }
    setEditingItem(null);
    setName("");
    setTitleRole("Founder & CEO");
    setBio("");
    setWebsite("");
    setPhotoUrl("");
    setAge(35);
    setCountry("United States");
    setSource("");
    setIndustry("Technology");
    setGender("Male");
    setRawValuationNumber("500");
    setNetWorthMillions("$500 M");
    setCompanies([
      { id: "c_new_1", name: "", role: "Founder & CEO", website: "", logoUrl: "" }
    ]);
    setHighlightText("");
    setEditorLastUpdated("Last Updated Oct 10, 2026, 9:00am");
    setEditorBulletPointsText("");
    setInTheirOwnWordsQuote("");
    setInTheirOwnWordsQuote2("");
    setSelfMadeScore(8);
    setPhilanthropyScore(2);
    setMaritalStatus("Single");
    setChildren(0);
    setResidence("");
    setCitizenship("United States");
    setEducation("");
    setFact1("");
    setFact2("");
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const openEditModal = (item: EntrepreneurItem) => {
    setEditingItem(item);
    setName(item.name || "");
    setTitleRole(item.titleRole || "Founder & CEO");
    setBio(item.bio || "");
    setWebsite(item.website || "");
    setPhotoUrl(item.photoUrl || "");
    setAge(item.age || 35);
    setCountry(item.country || "United States");
    setSource(item.source || "");
    setIndustry(item.industry || "Technology");
    setGender(item.gender || "Male");
    const parsedRawVal = item.netWorthMillions ? item.netWorthMillions.replace(/[^0-9.]/g, "") : "500";
    setRawValuationNumber(parsedRawVal);
    setNetWorthMillions(item.netWorthMillions || (parsedRawVal ? `$${parsedRawVal} M` : "$500 M"));

    setCompanies(
      Array.isArray(item.companies) && item.companies.length > 0
        ? item.companies.map((c) => ({ ...c }))
        : [{ id: "c_1", name: "", role: "Founder & CEO", website: "", logoUrl: "" }]
    );

    setHighlightText(item.highlightText || "");
    setEditorLastUpdated(item.editorLastUpdated?.replace(/\s*EDT\s*/gi, "") || "Last Updated Oct 10, 2026, 9:00am");

    const bullets = (item.editorBulletPoints || []).map((b) => (b.startsWith("• ") ? b : `• ${b}`));
    setEditorBulletPointsText(bullets.join("\n"));
    setInTheirOwnWordsQuote(item.inTheirOwnWordsQuote || "");
    setInTheirOwnWordsQuote2(
      item.inTheirOwnWordsQuote2 ||
      (item.inTheirOwnWordsQuotes && item.inTheirOwnWordsQuotes[1]) ||
      ""
    );
    setSelfMadeScore(item.selfMadeScore !== undefined ? item.selfMadeScore : 8);
    setPhilanthropyScore(item.philanthropyScore !== undefined ? item.philanthropyScore : 2);
    setMaritalStatus(item.maritalStatus || "Single");
    setChildren(item.children !== undefined ? item.children : 0);
    setResidence(item.residence || "");
    setCitizenship(item.citizenship || item.country || "United States");
    setEducation(item.education || "");
    setFact1(item.didYouKnowFacts?.[0] || "");
    setFact2(item.didYouKnowFacts?.[1] || "");

    setErrorMsg("");
    setIsModalOpen(true);
  };

  // Photo Upload Handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPhoto(true);
    const reader = new FileReader();
    reader.onload = async () => {
      if (typeof reader.result === "string") {
        const base64 = reader.result;
        setPhotoUrl(base64);

        try {
          const res = await fetch("http://localhost:5000/api/upload", {
            method: "POST",
            headers: getAuthHeaders({ "Content-Type": "application/json" }),
            body: JSON.stringify({
              imageBase64: base64,
              fileName: `entrepreneur_${Date.now()}.${file.name.split(".").pop() || "webp"}`,
              folder: "entrepreneurs",
            }),
          });
          const data = await res.json();
          if (data && data.success && data.url) {
            setPhotoUrl(data.url);
          }
        } catch (err) {
          console.warn("Backblaze upload error, keeping base64:", err);
        } finally {
          setIsUploadingPhoto(false);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  // Company management helpers
  const handleAddCompany = () => {
    if (companies.length >= 25) {
      alert("Maximum 25 companies can be added.");
      return;
    }
    setCompanies((prev) => [
      ...prev,
      { id: `c_${Date.now()}_${Math.random()}`, name: "", role: "Founder & CEO", website: "", logoUrl: "" }
    ]);
  };

  const handleUpdateCompany = (index: number, field: keyof CompanyShareholding, value: string) => {
    setCompanies((prev) => {
      const copy = [...prev];
      const updated = { ...copy[index], [field]: value };
      
      // When company website is typed, automatically fetch company logo
      if (field === "website" && value.trim()) {
        const cleanDomain = value.trim().replace(/^https?:\/\//i, "").replace(/^www\./i, "").split("/")[0];
        if (cleanDomain && (!copy[index].logoUrl || copy[index].logoUrl.includes("google.com/s2/favicons"))) {
          updated.logoUrl = `https://www.google.com/s2/favicons?domain=${cleanDomain}&sz=128`;
        }
      }
      copy[index] = updated;
      return copy;
    });
  };

  const handleCompanyLogoUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        if (typeof reader.result === "string") {
          const base64 = reader.result;
          handleUpdateCompany(index, "logoUrl", base64);
          try {
            const res = await fetch("http://localhost:5000/api/upload", {
              method: "POST",
              headers: getAuthHeaders({ "Content-Type": "application/json" }),
              body: JSON.stringify({
                imageBase64: base64,
                fileName: `company_${Date.now()}.${file.name.split('.').pop() || 'png'}`,
                folder: "company_logos",
              }),
            });
            const data = await res.json();
            if (data.success && data.url) {
              handleUpdateCompany(index, "logoUrl", data.url);
            }
          } catch (err) {
            console.log("Logo upload skipped:", err);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveCompany = (index: number) => {
    setCompanies((prev) => prev.filter((_, i) => i !== index));
  };

  // Save Modal
  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setErrorMsg("Please enter the entrepreneur's full name.");
      return;
    }

    const cleanedBullets = editorBulletPointsText
      .split("\n")
      .map((b) => b.trim().replace(/^[•\-*]\s*/, ""))
      .filter((b) => b.length > 0);

    const cleanedFacts = [fact1.trim(), fact2.trim()].filter(Boolean).slice(0, 2);

    const cleanedCompanies = companies
      .filter((c) => c.name && c.name.trim().length > 0)
      .map((c) => ({
        ...c,
        id: c.id || `c_${Date.now()}`,
        name: c.name.trim(),
        role: c.role.trim() || "Founder & CEO",
        website: c.website.trim(),
        logoUrl: c.logoUrl?.trim() || "",
      }));

    const effectiveNetWorth = rawValuationNumber.trim()
      ? `$${rawValuationNumber.trim()} M`
      : (netWorthMillions.trim() || "$500 M");

    const validatedAge = Math.max(1, typeof age === "number" ? age : parseInt(String(age) || "35", 10) || 35);

    if (editingItem) {
      // Update existing entrepreneur
      const updatedList = entrepreneurs.map((item) => {
        if (item.id === editingItem.id) {
          return {
            ...item,
            name: name.trim(),
            titleRole: titleRole.trim() || "Founder & CEO",
            bio: bio.trim(),
            website: website.trim(),
            photoUrl: photoUrl.trim() || item.photoUrl,
            age: validatedAge,
            country: country.trim() || item.country,
            source: source.trim() || item.source,
            industry: industry || item.industry,
            gender: gender || item.gender,
            netWorthMillions: effectiveNetWorth,
            companies: cleanedCompanies,
            highlightText: highlightText.trim(),
            editorLastUpdated: editorLastUpdated.trim(),
            editorBulletPoints: cleanedBullets,
            inTheirOwnWordsQuote: inTheirOwnWordsQuote.trim(),
            inTheirOwnWordsQuote2: inTheirOwnWordsQuote2.trim(),
            inTheirOwnWordsQuotes: [inTheirOwnWordsQuote.trim(), inTheirOwnWordsQuote2.trim()].filter(Boolean),
            selfMadeScore: selfMadeScore !== "" ? Number(selfMadeScore) : item.selfMadeScore,
            philanthropyScore: philanthropyScore !== "" ? Number(philanthropyScore) : item.philanthropyScore,
            maritalStatus: maritalStatus.trim() || item.maritalStatus,
            children: children !== "" ? Number(children) : item.children,
            residence: residence.trim(),
            citizenship: citizenship.trim() || country.trim(),
            education: education.trim(),
            didYouKnowFacts: cleanedFacts,
          };
        }
        return item;
      });

      setEntrepreneurs(updatedList);
      saveEntrepreneursList(updatedList);
    } else {
      // Add new entrepreneur
      const newItem: EntrepreneurItem = {
        id: `ent_${Date.now()}`,
        rank: entrepreneurs.length + 1,
        name: name.trim(),
        titleRole: titleRole.trim() || "Founder & CEO",
        bio: bio.trim(),
        website: website.trim(),
        photoUrl: photoUrl.trim() || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
        age: validatedAge,
        country: country.trim() || "United States",
        source: source.trim() || "CleanTech & Software",
        industry: industry || "Technology",
        gender: gender || "Male",
        netWorthMillions: effectiveNetWorth,
        companies: cleanedCompanies,
        highlightText: highlightText.trim(),
        editorLastUpdated: editorLastUpdated.trim() || "Last Updated Oct 10, 2026, 9:00am",
        editorBulletPoints: cleanedBullets.length > 0 ? cleanedBullets : [
          `${name.trim()} leads transformative ventures shaping international markets.`
        ],
        inTheirOwnWordsQuote: inTheirOwnWordsQuote.trim(),
        inTheirOwnWordsQuote2: inTheirOwnWordsQuote2.trim(),
        inTheirOwnWordsQuotes: [inTheirOwnWordsQuote.trim(), inTheirOwnWordsQuote2.trim()].filter(Boolean),
        selfMadeScore: selfMadeScore !== "" ? Number(selfMadeScore) : 8,
        philanthropyScore: philanthropyScore !== "" ? Number(philanthropyScore) : 2,
        maritalStatus: maritalStatus.trim() || "Single",
        children: children !== "" ? Number(children) : 0,
        residence: residence.trim(),
        citizenship: citizenship.trim() || country.trim() || "United States",
        education: education.trim(),
        didYouKnowFacts: cleanedFacts,
      };

      const updatedList = [...entrepreneurs, newItem].slice(0, 20).map((it, idx) => ({
        ...it,
        rank: idx + 1,
      }));

      setEntrepreneurs(updatedList);
      saveEntrepreneursList(updatedList);
    }

    setIsModalOpen(false);
  };

  // Reorder Handlers
  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    const copy = [...entrepreneurs];
    const temp = copy[index];
    copy[index] = copy[index - 1];
    copy[index - 1] = temp;
    const reRanked = copy.map((it, idx) => ({ ...it, rank: idx + 1 }));
    setEntrepreneurs(reRanked);
    saveEntrepreneursList(reRanked);
  };

  const handleMoveDown = (index: number) => {
    if (index >= entrepreneurs.length - 1) return;
    const copy = [...entrepreneurs];
    const temp = copy[index];
    copy[index] = copy[index + 1];
    copy[index + 1] = temp;
    const reRanked = copy.map((it, idx) => ({ ...it, rank: idx + 1 }));
    setEntrepreneurs(reRanked);
    saveEntrepreneursList(reRanked);
  };

  // Delete Handler
  const handleDelete = (id: string, entName: string) => {
    if (window.confirm(`Are you sure you want to delete "${entName}" from the Upcoming Top 20 Entrepreneurs list?`)) {
      const updatedList = entrepreneurs
        .filter((it) => it.id !== id)
        .map((it, idx) => ({ ...it, rank: idx + 1 }));
      setEntrepreneurs(updatedList);
      saveEntrepreneursList(updatedList);
    }
  };

  return (
    <div className="space-y-6 ">
      {/* Header Bar matching Billionaires Desk */}
      <div className="bg-white border border-[#e5e7eb] rounded-3xl p-6 sm:p-8 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h2 className="font-bold text-xl sm:text-2xl text-[#0f172a] tracking-tight">
              Entrepreneurs Management
            </h2>
          </div>
          <p className="text-xs text-[#64748b] mt-1 max-w-2xl">
            Configure entrepreneur profile details (From the Editor bullets, Companies & Shareholdings, Personal Stats, Did You Know quotes, and In Their Own Words quote block).
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          disabled={entrepreneurs.length >= 20}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-2xs flex items-center space-x-2 cursor-pointer ${
            entrepreneurs.length >= 20
              ? "bg-[#e2e8f0] text-[#94a3b8] cursor-not-allowed"
              : "bg-[#111111] hover:bg-[#333333] text-white"
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span>Add Entrepreneur</span>
        </button>
      </div>

      {/* Main Table Card matching Billionaires Desk */}
      <div className="bg-white border border-[#e5e7eb] rounded-3xl overflow-hidden shadow-2xs">
        <div className="p-6 border-b border-[#f1f5f9] flex items-center justify-between">
          <h3 className="font-bold text-sm text-[#0f172a] uppercase tracking-wider">
            Current Upcoming Entrepreneurs ({entrepreneurs.length})
          </h3>
          <span className="text-[11px] text-[#64748b] font-mono">
            {entrepreneurs.length} / 20 Ranked Profiles
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8fafc] border-b border-[#e2e8f0] text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                <th className="py-3 px-4 w-16 text-center">Rank</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Valuation</th>
                <th className="py-3 px-4 text-center">Age</th>
                <th className="py-3 px-4">Country</th>
                <th className="py-3 px-4">Industry</th>
                <th className="py-3 px-4">Companies</th>
                <th className="py-3 px-4 text-center w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9] text-xs text-[#1e293b]">
              {entrepreneurs.map((item, index) => (
                <tr key={item.id} className="hover:bg-[#f8fafc] transition-colors">
                  <td className="py-3.5 px-4 font-extrabold text-center text-[#475569]">
                    {item.rank}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#0f172a]">
                    <div className="flex items-center space-x-2.5">
                      <img
                        src={item.photoUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"}
                        alt={item.name}
                        className="w-7 h-7 rounded-full object-cover shrink-0 border border-gray-200"
                      />
                      <div className="min-w-0">
                        <span className="truncate block font-bold text-[#0f172a]">{item.name}</span>
                        {item.titleRole && (
                          <span className="block text-[11px] font-normal text-[#64748b] truncate">
                            {item.titleRole}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-[#0f172a] whitespace-nowrap">
                    {item.netWorthMillions || "$500 M"}
                  </td>
                  <td className="py-3.5 px-4 text-center text-[#64748b]">
                    {item.age || "-"}
                  </td>
                  <td className="py-3.5 px-4 text-[#475569]">
                    {item.country || "-"}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-[#475569]">
                    {item.industry || "-"}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1">
                      {(item.companies || []).slice(0, 3).map((c, ci) => (
                        <span
                          key={ci}
                          className="px-2 py-0.5 rounded-md bg-[#f8fafc] border border-[#cbd5e1] text-[10.5px] font-semibold text-[#0f172a]"
                        >
                          {c.name}
                        </span>
                      ))}
                      {(item.companies || []).length > 3 && (
                        <span className="px-1.5 py-0.5 text-[10px] text-[#64748b]">
                          +{(item.companies || []).length - 3}
                        </span>
                      )}
                    </div>
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
                        onClick={() => handleDelete(item.id, item.name)}
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

      {/* 20 Entrepreneurs Limit Warning Popup Modal */}
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
                Only 20 entrepreneurs can be added to the list. Please edit or delete an existing entrepreneur before adding a new one.
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

      {/* Add / Edit Entrepreneur Modal */}
      {isModalOpen && mounted &&
        createPortal(
          <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-hidden">
            <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-[#e2e8f0]">
              
              {/* Modal Header */}
              <div className="shrink-0 p-5 sm:p-6 border-b border-[#f1f5f9] flex items-center justify-between bg-white z-10">
                <h3 className="font-bold text-lg text-[#0f172a]">
                  {editingItem ? `Edit Entrepreneur: ${editingItem.name}` : "Add New Entrepreneur (Max 20)"}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#64748b] hover:text-[#0f172a] font-bold text-sm flex items-center justify-center cursor-pointer transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Modal Body / Scrollable Form */}
              <form id="entrepreneur-form" onSubmit={handleSaveModal} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-xs font-medium text-[#1e293b]">
                {errorMsg && (
                  <div className="bg-[#fef2f2] border border-[#fca5a5] text-[#dc2626] px-4 py-2.5 rounded-xl text-xs font-medium">
                    {errorMsg}
                  </div>
                )}

                {/* Section 1: Top Hero & Basic Identity */}
                <div className="border-b border-[#f1f5f9] pb-5 space-y-3.5">
                  <div className="bg-[#f8fafc] border border-[#e2e8f0] px-3.5 py-2 rounded-xl">
                    <span className="text-[12px] font-extrabold uppercase text-[#0f172a] tracking-wider block">
                      1. Founder Profile & Header Card
                    </span>
                    <p className="text-[11px] text-[#64748b]">
                      Main profile attributes, hero bio, personal website, portrait photograph, and valuation metric.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#64748b] font-bold uppercase tracking-wider mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Alex Morgan"
                        className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl px-3.5 py-2 text-xs text-[#0f172a] focus:bg-white focus:border-[#0f172a] focus:outline-none transition-all font-semibold"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[#64748b] font-bold uppercase tracking-wider mb-1">
                        Title / Role
                      </label>
                      <input
                        type="text"
                        value={titleRole}
                        onChange={(e) => setTitleRole(e.target.value)}
                        placeholder="e.g. Founder & CEO"
                        className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl px-3.5 py-2 text-xs text-[#0f172a] focus:bg-white focus:border-[#0f172a] focus:outline-none transition-all"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[#64748b] font-bold uppercase tracking-wider mb-1">
                        Hero Bio Description
                      </label>
                      <textarea
                        rows={3}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Alex Morgan is a visionary entrepreneur building innovative companies that create a more sustainable, connected and inclusive future."
                        className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl px-3.5 py-2 text-xs text-[#0f172a] focus:bg-white focus:border-[#0f172a] focus:outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[#64748b] font-bold uppercase tracking-wider mb-1">
                        Personal Website
                      </label>
                      <input
                        type="text"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="e.g. www.alexmorgan.com"
                        className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl px-3.5 py-2 text-xs text-[#0f172a] focus:bg-white focus:border-[#0f172a] focus:outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[#64748b] font-bold uppercase tracking-wider mb-1">
                        Valuation / Metric ($M) *
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3 text-xs font-bold text-[#64748b] font-mono">$</span>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={rawValuationNumber}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9.]/g, "");
                            setRawValuationNumber(val);
                            setNetWorthMillions(val ? `$${val} M` : "");
                          }}
                          placeholder="500"
                          className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl pl-7 pr-10 py-2 text-xs text-[#0f172a] focus:bg-white focus:border-[#0f172a] focus:outline-none transition-all font-mono font-bold"
                        />
                        <span className="absolute right-3 text-xs font-bold text-[#64748b] font-mono">M</span>
                      </div>
                      <p className="text-[10px] text-[#64748b] mt-1">Numbers only. Auto-formatted as ${rawValuationNumber || "0"} M</p>
                    </div>

                    {/* Photo Uploader */}
                    <div className="sm:col-span-2 pt-1">
                      <label className="block text-[#64748b] font-bold uppercase tracking-wider mb-1">
                        Portrait Photograph
                      </label>
                      <div className="flex items-center space-x-3.5">
                        <div className="w-14 h-16 rounded-xl overflow-hidden bg-[#f1f5f9] border border-[#cbd5e1] shrink-0">
                          {photoUrl ? (
                            <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#94a3b8] text-[10px]">
                              No photo
                            </div>
                          )}
                        </div>
                        <div className="flex-1 space-y-2">
                          <input
                            type="text"
                            value={photoUrl}
                            onChange={(e) => setPhotoUrl(e.target.value)}
                            placeholder="Paste image URL or choose file below"
                            className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl px-3.5 py-2 text-xs text-[#0f172a] focus:bg-white focus:border-[#0f172a] focus:outline-none transition-all"
                          />
                          <div className="flex items-center space-x-2">
                            <input
                              type="file"
                              ref={fileInputRef}
                              onChange={handlePhotoUpload}
                              accept="image/*"
                              className="hidden"
                            />
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              disabled={isUploadingPhoto}
                              className="px-3 py-1.5 rounded-xl border border-[#cbd5e1] hover:bg-[#f1f5f9] text-xs font-bold text-[#0f172a] cursor-pointer transition-colors"
                            >
                              {isUploadingPhoto ? "Uploading..." : "Upload Local Photo"}
                            </button>
                            <span className="text-[11px] text-[#64748b]">
                              Recommended portrait aspect ratio
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 2: Companies & Shareholdings */}
                <div className="border-b border-[#f1f5f9] pb-5 space-y-3.5">
                  <div className="bg-[#f8fafc] border border-[#e2e8f0] px-3.5 py-2 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-[12px] font-extrabold uppercase text-[#0f172a] tracking-wider block">
                        2. Companies & Shareholdings ({companies.length} / 25)
                      </span>
                      <p className="text-[11px] text-[#64748b]">
                        Type company website to auto-fetch logo. You can also upload a logo photo or enter a custom logo URL.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddCompany}
                      disabled={companies.length >= 25}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                        companies.length >= 25
                          ? "bg-[#e2e8f0] text-[#94a3b8] cursor-not-allowed"
                          : "bg-[#111111] hover:bg-[#333333] text-white"
                      }`}
                    >
                      + Add Company
                    </button>
                  </div>

                  <div className="space-y-3">
                    {companies.map((comp, idx) => (
                      <div
                        key={comp.id || idx}
                        className="p-3.5 rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] flex flex-col md:flex-row gap-3 items-center"
                      >
                        {/* Logo Preview */}
                        <div className="w-10 h-10 rounded-xl bg-white border border-[#cbd5e1] flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                          {comp.logoUrl ? (
                            <img
                              src={comp.logoUrl}
                              alt={comp.name || "Logo"}
                              className="w-8 h-8 object-contain"
                              onError={(e) => {
                                (e.currentTarget as HTMLElement).style.display = "none";
                              }}
                            />
                          ) : (
                            <span className="text-xs font-bold text-[#64748b]">
                              {comp.name ? comp.name.charAt(0) : "🏢"}
                            </span>
                          )}
                        </div>

                        {/* Company Name */}
                        <div className="flex-1 min-w-[130px] w-full">
                          <label className="block text-[10px] font-bold text-[#64748b] uppercase mb-0.5">
                            Company Name
                          </label>
                          <input
                            type="text"
                            value={comp.name}
                            onChange={(e) => handleUpdateCompany(idx, "name", e.target.value)}
                            placeholder="e.g. Tesla"
                            className="w-full bg-white border border-[#cbd5e1] rounded-xl px-2.5 py-1.5 text-xs text-[#0f172a] focus:outline-none focus:border-[#0f172a]"
                          />
                        </div>

                        {/* Role */}
                        <div className="w-full md:w-36 shrink-0">
                          <label className="block text-[10px] font-bold text-[#64748b] uppercase mb-0.5">
                            Role
                          </label>
                          <input
                            type="text"
                            value={comp.role}
                            onChange={(e) => handleUpdateCompany(idx, "role", e.target.value)}
                            placeholder="e.g. CEO"
                            className="w-full bg-white border border-[#cbd5e1] rounded-xl px-2.5 py-1.5 text-xs text-[#0f172a] focus:outline-none focus:border-[#0f172a]"
                          />
                        </div>

                        {/* Website (Auto-fetches logo) */}
                        <div className="flex-1 min-w-[160px] w-full">
                          <label className="block text-[10px] font-bold text-[#64748b] uppercase mb-0.5">
                            Website (Auto-fetches Logo)
                          </label>
                          <input
                            type="text"
                            value={comp.website}
                            onChange={(e) => handleUpdateCompany(idx, "website", e.target.value)}
                            placeholder="e.g. www.tesla.com"
                            className="w-full bg-white border border-[#cbd5e1] rounded-xl px-2.5 py-1.5 text-xs text-[#0f172a] focus:outline-none focus:border-[#0f172a]"
                          />
                        </div>

                        {/* Custom Logo Upload / URL */}
                        <div className="w-full md:w-48 shrink-0">
                          <label className="block text-[10px] font-bold text-[#64748b] uppercase mb-0.5">
                            Custom Logo / Photo
                          </label>
                          <div className="flex items-center space-x-1.5">
                            <input
                              type="text"
                              value={comp.logoUrl || ""}
                              onChange={(e) => handleUpdateCompany(idx, "logoUrl", e.target.value)}
                              placeholder="Logo URL"
                              className="flex-1 min-w-0 bg-white border border-[#cbd5e1] rounded-xl px-2 py-1.5 text-xs text-[#0f172a] focus:outline-none focus:border-[#0f172a]"
                            />
                            <label className="px-2 py-1.5 bg-[#e2e8f0] hover:bg-[#cbd5e1] text-[#0f172a] rounded-xl text-[10px] font-bold cursor-pointer shrink-0 transition-colors" title="Upload company logo image">
                              📁
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleCompanyLogoUpload(idx, e)}
                              />
                            </label>
                          </div>
                        </div>

                        {/* Remove */}
                        <div className="shrink-0 flex items-center justify-end pt-1 md:pt-4">
                          <button
                            type="button"
                            onClick={() => handleRemoveCompany(idx)}
                            className="text-[#ef4444] hover:text-[#dc2626] text-xs font-bold p-1 cursor-pointer"
                            title="Remove Company"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 3: Demographic & Listing Filters */}
                <div className="border-b border-[#f1f5f9] pb-5 space-y-3.5">
                  <div className="bg-[#f8fafc] border border-[#e2e8f0] px-3.5 py-2 rounded-xl">
                    <span className="text-[12px] font-extrabold uppercase text-[#0f172a] tracking-wider block">
                      3. Demographic & Listing Filters
                    </span>
                    <p className="text-[11px] text-[#64748b]">
                      Personal background, demographics, and metrics for the entrepreneur.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-[#64748b] font-bold uppercase tracking-wider mb-1">
                        Age * (Min 1)
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={age}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === "") {
                            setAge("");
                          } else {
                            const parsed = parseInt(val, 10);
                            setAge(isNaN(parsed) || parsed < 1 ? 1 : parsed);
                          }
                        }}
                        placeholder="e.g. 38"
                        className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl px-3.5 py-2 text-xs text-[#0f172a] focus:outline-none focus:border-black font-semibold"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[#64748b] font-bold uppercase tracking-wider mb-1">
                        Country / Territory *
                      </label>
                      <select
                        value={country}
                        onChange={(e) => {
                          setCountry(e.target.value);
                          if (!citizenship) setCitizenship(e.target.value);
                        }}
                        className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl px-3.5 py-2 text-xs text-[#0f172a] focus:outline-none focus:border-black cursor-pointer font-semibold"
                      >
                        {WORLD_COUNTRIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[#64748b] font-bold uppercase tracking-wider mb-1">
                        Citizenship
                      </label>
                      <select
                        value={citizenship}
                        onChange={(e) => setCitizenship(e.target.value)}
                        className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl px-3.5 py-2 text-xs text-[#0f172a] focus:outline-none focus:border-black cursor-pointer font-semibold"
                      >
                        {WORLD_COUNTRIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[#64748b] font-bold uppercase tracking-wider mb-1">
                        Industry
                      </label>
                      <select
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl px-3.5 py-2 text-xs text-[#0f172a] focus:outline-none focus:border-black cursor-pointer"
                      >
                        {INDUSTRY_OPTIONS.map((ind) => (
                          <option key={ind} value={ind}>
                            {ind}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[#64748b] font-bold uppercase tracking-wider mb-1">
                        Gender
                      </label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl px-3.5 py-2 text-xs text-[#0f172a] focus:outline-none focus:border-black cursor-pointer"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[#64748b] font-bold uppercase tracking-wider mb-1">
                        Self-Made Score (1-10)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={selfMadeScore}
                        onChange={(e) => setSelfMadeScore(e.target.value.replace(/\D/g, ""))}
                        placeholder="8"
                        className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl px-3.5 py-2 text-xs text-[#0f172a] focus:outline-none focus:border-black font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-[#64748b] font-bold uppercase tracking-wider mb-1">
                        Philanthropy Score (1-5)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={philanthropyScore}
                        onChange={(e) => setPhilanthropyScore(e.target.value.replace(/\D/g, ""))}
                        placeholder="2"
                        className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl px-3.5 py-2 text-xs text-[#0f172a] focus:outline-none focus:border-black font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-[#64748b] font-bold uppercase tracking-wider mb-1">
                        Marital Status
                      </label>
                      <select
                        value={maritalStatus}
                        onChange={(e) => setMaritalStatus(e.target.value)}
                        className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl px-3.5 py-2 text-xs text-[#0f172a] focus:outline-none focus:border-black cursor-pointer font-semibold"
                      >
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Widowed">Widowed</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[#64748b] font-bold uppercase tracking-wider mb-1">
                        Children
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={children}
                        onChange={(e) => setChildren(e.target.value.replace(/\D/g, ""))}
                        placeholder="0"
                        className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl px-3.5 py-2 text-xs text-[#0f172a] focus:outline-none focus:border-black font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-[#64748b] font-bold uppercase tracking-wider mb-1">
                        Residence
                      </label>
                      <input
                        type="text"
                        value={residence}
                        onChange={(e) => setResidence(e.target.value)}
                        placeholder="e.g. San Francisco, California"
                        className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl px-3.5 py-2 text-xs text-[#0f172a] focus:outline-none focus:border-black"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[#64748b] font-bold uppercase tracking-wider mb-1">
                        Source of Wealth / Sectors
                      </label>
                      <input
                        type="text"
                        value={source}
                        onChange={(e) => setSource(e.target.value)}
                        placeholder="e.g. CleanTech & Aerospace"
                        className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl px-3.5 py-2 text-xs text-[#0f172a] focus:outline-none focus:border-black"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[#64748b] font-bold uppercase tracking-wider mb-1">
                        Education
                      </label>
                      <input
                        type="text"
                        value={education}
                        onChange={(e) => setEducation(e.target.value)}
                        placeholder="e.g. Bachelor of Science, Stanford University"
                        className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl px-3.5 py-2 text-xs text-[#0f172a] focus:outline-none focus:border-black"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 4: Editorial Content & Facts */}
                <div className="space-y-3.5">
                  <div className="bg-[#f8fafc] border border-[#e2e8f0] px-3.5 py-2 rounded-xl">
                    <span className="text-[12px] font-extrabold uppercase text-[#0f172a] tracking-wider block">
                      4. Editorial Section & Quotes
                    </span>
                    <p className="text-[11px] text-[#64748b]">
                      Editorial bullet points, quotes, and Did You Know facts (max 2 facts).
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-[#64748b] font-bold uppercase tracking-wider mb-1">
                        From the Editor Bullet Points (One per line)
                      </label>
                      <textarea
                        rows={4}
                        value={editorBulletPointsText}
                        onChange={(e) => setEditorBulletPointsText(e.target.value)}
                        placeholder="• First editorial bullet point...&#10;• Second editorial bullet point..."
                        className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl px-3.5 py-2.5 text-xs text-[#0f172a] focus:outline-none focus:border-black font-sans leading-relaxed"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[#64748b] font-bold uppercase tracking-wider mb-1">
                        Editor Last Updated Text
                      </label>
                      <input
                        type="text"
                        value={editorLastUpdated}
                        onChange={(e) => setEditorLastUpdated(e.target.value)}
                        placeholder="Last Updated Oct 10, 2026, 9:00am"
                        className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl px-3.5 py-2 text-xs text-[#0f172a] focus:outline-none focus:border-black"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[#64748b] font-bold uppercase tracking-wider mb-1">
                        In Their Own Words Quote 1 (Slide 1)
                      </label>
                      <textarea
                        rows={2}
                        value={inTheirOwnWordsQuote}
                        onChange={(e) => setInTheirOwnWordsQuote(e.target.value)}
                        placeholder="“When tackling unprecedented problems in deep technology...”"
                        className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl px-3.5 py-2.5 text-xs text-[#0f172a] focus:outline-none focus:border-black font-serif italic"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[#64748b] font-bold uppercase tracking-wider mb-1">
                        In Their Own Words Quote 2 (Slide 2)
                      </label>
                      <textarea
                        rows={2}
                        value={inTheirOwnWordsQuote2}
                        onChange={(e) => setInTheirOwnWordsQuote2(e.target.value)}
                        placeholder="“Innovation distinguishes between a leader and a follower...”"
                        className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl px-3.5 py-2.5 text-xs text-[#0f172a] focus:outline-none focus:border-black font-serif italic"
                      />
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <label className="block text-[#64748b] font-bold uppercase tracking-wider mb-1">
                        Did You Know Facts (Maximum 2 facts)
                      </label>
                      <div className="space-y-2">
                        <div>
                          <span className="text-[10px] text-[#64748b] font-bold uppercase tracking-wider block mb-1">Fact 1</span>
                          <input
                            type="text"
                            value={fact1}
                            onChange={(e) => setFact1(e.target.value)}
                            placeholder="First interesting fact..."
                            className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl px-3.5 py-2 text-xs text-[#0f172a] focus:outline-none focus:border-black"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] text-[#64748b] font-bold uppercase tracking-wider block mb-1">Fact 2</span>
                          <input
                            type="text"
                            value={fact2}
                            onChange={(e) => setFact2(e.target.value)}
                            placeholder="Second interesting fact..."
                            className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl px-3.5 py-2 text-xs text-[#0f172a] focus:outline-none focus:border-black"
                          />
                        </div>
                      </div>
                    </div>
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
                  form="entrepreneur-form"
                  className="px-6 py-2.5 rounded-xl bg-[#111111] hover:bg-[#333333] text-white font-bold text-xs uppercase tracking-wider cursor-pointer transition-colors shadow-2xs"
                >
                  {editingItem ? "Save Changes" : "Add Entrepreneur"}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
