"use client";

import React, { useState } from "react";

interface TargetedEmailDistributionProps {
  emails: string[];
  onChangeEmails: (emails: string[]) => void;
  broadcastToSubscribers: boolean;
  onChangeBroadcast: (broadcast: boolean) => void;
}

export const TargetedEmailDistribution: React.FC<TargetedEmailDistributionProps> = ({
  emails,
  onChangeEmails,
  broadcastToSubscribers,
  onChangeBroadcast,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const [tempEmails, setTempEmails] = useState<string[]>(emails);
  const [tempBroadcast, setTempBroadcast] = useState<boolean>(broadcastToSubscribers);

  const handleOpenModal = () => {
    setTempEmails([...emails]);
    setTempBroadcast(broadcastToSubscribers);
    setInputVal("");
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const addEmailsFromInput = (rawText: string) => {
    if (!rawText.trim()) return;
    const items = rawText
      .split(/[,;\s]+/)
      .map((e) => e.trim().toLowerCase())
      .filter((e) => e.length > 0 && e.includes("@"));

    if (items.length === 0) return;

    setTempEmails((prev) => {
      const updated = [...prev];
      items.forEach((item) => {
        if (!updated.includes(item)) {
          updated.push(item);
        }
      });
      return updated;
    });
    setInputVal("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addEmailsFromInput(inputVal);
    }
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    setTempEmails((prev) => prev.filter((e) => e !== emailToRemove));
  };

  const handleSave = () => {
    if (inputVal.trim()) {
      addEmailsFromInput(inputVal);
    }
    onChangeEmails(tempEmails);
    onChangeBroadcast(tempBroadcast);
    setIsOpen(false);
  };

  return (
    <>
      {/* ========================================== */}
      {/* CARD CONTAINER MATCHING IMAGE 2 EXACTLY    */}
      {/* ========================================== */}
      <div className="bg-[#f0f7ff] border border-[#bfdbfe] rounded-2xl p-4 sm:p-4.5 space-y-3 text-left shadow-2xs" style={{ fontFamily: "'Poppins', sans-serif" }}>
        {/* Card Header with Icon */}
        <div className="flex items-center space-x-2">
          <svg className="w-4 h-4 text-[#2563eb] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <h4 className="text-[11.5px] font-bold text-[#1d4ed8] tracking-wider uppercase" style={{ fontFamily: "'Poppins', sans-serif" }}>
            TARGETED EMAIL DISTRIBUTION
          </h4>
        </div>

        {/* Card Description */}
        <p className="text-xs font-mono text-[#334155] leading-relaxed">
          Add specific VIP, partner, or client emails to receive this story upon publication.
        </p>

        {/* Mail Box Button - Exact single line matching Image 2 */}
        <button
          type="button"
          onClick={handleOpenModal}
          className="w-full bg-white hover:bg-blue-50/50 border border-[#93c5fd] hover:border-[#3b82f6] py-2.5 px-3 sm:px-4 rounded-xl flex items-center justify-center space-x-2 whitespace-nowrap transition-all cursor-pointer shadow-2xs"
        >
          <svg className="w-4 h-4 text-[#2563eb] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span className="font-mono text-xs font-bold text-[#1d4ed8]">Mail Box</span>
          <span className="font-mono text-xs text-[#60a5fa] font-normal">(Add Recipients)</span>
        </button>
      </div>

      {/* ========================================== */}
      {/* IMAGE 2: POPUP MODAL DIALOG                */}
      {/* ========================================== */}
      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-[510px] w-full p-5 sm:p-6 shadow-2xl space-y-4 font-sans text-left animate-in zoom-in-95 duration-150 border border-slate-100 overflow-hidden">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-xl bg-[#eff6ff] border border-[#dbeafe] flex items-center justify-center text-[#2563eb] shrink-0 mt-0.5">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base sm:text-[17px] font-extrabold text-[#0f172a] tracking-tight font-sans">
                    Article Mail Box & Targeted Distribution
                  </h3>
                  <p className="text-[11.5px] font-sans text-[#64748b] leading-tight mt-0.5">
                    Add specific emails (VIPs, clients, sponsors) to receive this article upon publication.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-slate-700 transition-colors p-1 rounded-lg shrink-0"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Input Section */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#0f172a] font-sans">
                Add Recipient Emails
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="e.g. client@company.com, editor@partner.com"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-white border border-[#cbd5e1] rounded-xl px-3.5 py-2.5 text-xs font-mono text-[#1e293b] placeholder-[#94a3b8] focus:outline-none focus:border-[#023e8a] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => addEmailsFromInput(inputVal)}
                  className="bg-[#023e8a] hover:bg-[#002855] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-xs shrink-0 flex items-center space-x-1 font-sans"
                >
                  <span>+ Add</span>
                </button>
              </div>
              <p className="text-[11px] font-sans text-[#64748b] mt-1.5 flex items-center space-x-1">
                <span>💡</span>
                <span>
                  Press <strong className="font-bold text-[#475569]">Enter</strong> or <strong className="font-bold text-[#475569]">comma (,)</strong> to add. You can also paste multiple comma-separated emails.
                </span>
              </p>
            </div>

            {/* Configured Recipients Section */}
            <div className="space-y-1.5 pt-1">
              <label className="block text-[10.5px] font-mono font-bold text-[#64748b] uppercase tracking-wider">
                CONFIGURED RECIPIENTS ({tempEmails.length})
              </label>
              <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl p-4 min-h-[90px] max-h-[160px] overflow-y-auto font-mono text-xs">
                {tempEmails.length === 0 ? (
                  <div className="text-center text-xs text-[#94a3b8] italic py-3 font-sans">
                    No custom emails added yet.
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {tempEmails.map((email) => (
                      <span
                        key={email}
                        className="bg-[#e0f2fe] border border-[#bae6fd] text-[#0369a1] text-xs font-mono font-semibold px-3 py-1.5 rounded-xl flex items-center space-x-2 shadow-2xs"
                      >
                        <span>{email}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveEmail(email)}
                          className="text-[#0369a1] hover:text-[#0284c7] font-bold text-xs p-0.5 leading-none"
                          title="Remove email"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Newsletter Broadcast Checkbox */}
            <div
              onClick={() => setTempBroadcast(!tempBroadcast)}
              className="bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl p-3.5 sm:p-4 flex items-start space-x-3 cursor-pointer select-none hover:border-slate-300 transition-colors"
            >
              <input
                type="checkbox"
                checked={tempBroadcast}
                onChange={(e) => setTempBroadcast(e.target.checked)}
                className="w-4 h-4 accent-[#0284c7] rounded border-gray-300 focus:ring-0 cursor-pointer mt-0.5 shrink-0"
              />
              <div>
                <span className="text-xs font-bold text-[#0f172a] block font-sans">
                  Broadcast to newsletter subscribers list
                </span>
                <span className="text-[11px] font-sans text-[#64748b] leading-normal block mt-0.5">
                  Send this article notification to all general newsletter subscribers matching this article category.
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-2.5 pt-2 font-sans">
              <button
                type="button"
                onClick={handleCloseModal}
                className="bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#475569] font-bold text-xs py-2.5 px-5 rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="bg-[#023e8a] hover:bg-[#002855] text-white font-bold text-xs py-2.5 px-5 rounded-xl transition-all cursor-pointer shadow-md flex items-center space-x-1.5"
              >
                <span>✓</span>
                <span>Save Recipients</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TargetedEmailDistribution;
