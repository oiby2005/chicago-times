"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/navigation/Header";
import StickyHeaderBar from "@/components/navigation/StickyHeaderBar";
import Footer from "@/components/layout/Footer";
import StickySubscribeBar from "@/components/ui/StickySubscribeBar";
import Container from "@/components/layout/Container";

export default function AdvertiseClient() {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    serviceOption: "Publish Company Article",
    phone: "",
    whatsapp: "",
    details: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);
  const [submitStatus, setSubmitStatus] = useState<{
    success?: boolean;
    message?: string;
  } | null>(null);

  const formatLockoutTime = (totalSec: number) => {
    const hours = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m ${secs.toString().padStart(2, "0")}s`;
    }
    return `${mins}m ${secs.toString().padStart(2, "0")}s`;
  };

  // Restore persistent lockout on page load / refresh
  useEffect(() => {
    try {
      const storedUntil = localStorage.getItem("wsj_advertise_lockout_until");
      if (storedUntil) {
        const until = parseInt(storedUntil, 10);
        const now = Date.now();
        if (until > now) {
          const sec = Math.ceil((until - now) / 1000);
          setLockoutSeconds(sec);
          setSubmitStatus({
            success: false,
            message: `Too many advertising requests submitted from this connection. Please wait: ${formatLockoutTime(sec)} remaining.`,
          });
        } else {
          localStorage.removeItem("wsj_advertise_lockout_until");
          setLockoutSeconds(0);
        }
      }
    } catch (e) {}
  }, []);

  // Live countdown timer ticking down every second
  useEffect(() => {
    if (lockoutSeconds <= 0) return;

    const timer = setInterval(() => {
      try {
        const storedUntil = localStorage.getItem("wsj_advertise_lockout_until");
        if (storedUntil) {
          const until = parseInt(storedUntil, 10);
          const now = Date.now();
          if (until > now) {
            const sec = Math.ceil((until - now) / 1000);
            setLockoutSeconds(sec);
            setSubmitStatus({
              success: false,
              message: `Too many advertising requests submitted from this connection. Please wait: ${formatLockoutTime(sec)} remaining.`,
            });
          } else {
            localStorage.removeItem("wsj_advertise_lockout_until");
            setLockoutSeconds(0);
            setSubmitStatus(null);
          }
        } else {
          setLockoutSeconds((prev) => {
            if (prev <= 1) {
              setSubmitStatus(null);
              return 0;
            }
            return prev - 1;
          });
        }
      } catch (e) {
        setLockoutSeconds((prev) => (prev > 0 ? prev - 1 : 0));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [lockoutSeconds]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const COUNTRY_CODE_RULES: Record<string, { name: string; totalDigits: number | number[] }> = {
    "1": { name: "United States / Canada", totalDigits: 11 },
    "44": { name: "United Kingdom", totalDigits: 12 },
    "91": { name: "India", totalDigits: 12 },
    "33": { name: "France", totalDigits: 11 },
    "49": { name: "Germany", totalDigits: [11, 12, 13] },
    "81": { name: "Japan", totalDigits: 12 },
    "86": { name: "China", totalDigits: 13 },
    "61": { name: "Australia", totalDigits: 11 },
    "94": { name: "Sri Lanka", totalDigits: 11 },
    "971": { name: "United Arab Emirates", totalDigits: 12 },
    "966": { name: "Saudi Arabia", totalDigits: 12 },
    "65": { name: "Singapore", totalDigits: 10 },
    "60": { name: "Malaysia", totalDigits: [11, 12] },
    "62": { name: "Indonesia", totalDigits: [11, 12, 13] },
    "55": { name: "Brazil", totalDigits: 13 },
    "52": { name: "Mexico", totalDigits: 12 },
    "39": { name: "Italy", totalDigits: 12 },
    "34": { name: "Spain", totalDigits: 11 },
    "7": { name: "Russia", totalDigits: 11 },
    "27": { name: "South Africa", totalDigits: 11 },
    "82": { name: "South Korea", totalDigits: [11, 12] },
    "92": { name: "Pakistan", totalDigits: 12 },
    "880": { name: "Bangladesh", totalDigits: 13 },
    "234": { name: "Nigeria", totalDigits: 13 },
    "254": { name: "Kenya", totalDigits: 12 },
    "20": { name: "Egypt", totalDigits: 12 },
    "63": { name: "Philippines", totalDigits: 12 },
    "84": { name: "Vietnam", totalDigits: 11 },
    "66": { name: "Thailand", totalDigits: 11 },
    "90": { name: "Turkey", totalDigits: 12 },
  };

  const validatePhoneWithCountryCode = (num: string): { valid: boolean; message?: string } => {
    const clean = num.trim();
    if (!clean.startsWith("+")) {
      return {
        valid: false,
        message: "Phone number must start with a leading '+' and country code (e.g. +1 555 000-0000 or +44 7911 123456).",
      };
    }

    const digitsOnly = clean.replace(/\D/g, "");
    if (digitsOnly.length < 7 || digitsOnly.length > 15) {
      return {
        valid: false,
        message: "Phone number length must be between 7 and 15 digits total including country code.",
      };
    }

    let matchedRule: { name: string; totalDigits: number | number[] } | null = null;
    for (let len of [3, 2, 1]) {
      const prefix = digitsOnly.substring(0, len);
      if (COUNTRY_CODE_RULES[prefix]) {
        matchedRule = COUNTRY_CODE_RULES[prefix];
        break;
      }
    }

    if (matchedRule) {
      const allowed = Array.isArray(matchedRule.totalDigits) ? matchedRule.totalDigits : [matchedRule.totalDigits];
      if (!allowed.includes(digitsOnly.length)) {
        const expectedText = allowed.join(" or ");
        return {
          valid: false,
          message: `Phone number for ${matchedRule.name} must contain exactly ${expectedText} digits total (got ${digitsOnly.length} digits). E.g. +${matchedRule.name === "United States / Canada" ? "1 (555) 000-0000" : "44 7911 123456"}.`,
        };
      }
    }

    return { valid: true };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutSeconds > 0) {
      return;
    }

    if (!formData.name || !formData.company || !formData.email || !formData.details) {
      setSubmitStatus({
        success: false,
        message: "Please fill out all required fields.",
      });
      return;
    }

    if (formData.phone) {
      const phoneValidation = validatePhoneWithCountryCode(formData.phone);
      if (!phoneValidation.valid) {
        setSubmitStatus({
          success: false,
          message: phoneValidation.message,
        });
        return;
      }
    }

    if (formData.whatsapp) {
      const waValidation = validatePhoneWithCountryCode(formData.whatsapp);
      if (!waValidation.valid) {
        setSubmitStatus({
          success: false,
          message: `WhatsApp error: ${waValidation.message}`,
        });
        return;
      }
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const res = await fetch("http://localhost:5000/api/advertise-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.status === 429) {
        const retryHeader = res.headers.get("retry-after");
        const retrySec = retryHeader ? parseInt(retryHeader, 10) : 60 * 60;
        const sec = isNaN(retrySec) || retrySec <= 0 ? 60 * 60 : retrySec;
        const lockoutUntil = Date.now() + sec * 1000;
        if (typeof window !== "undefined") {
          localStorage.setItem("wsj_advertise_lockout_until", lockoutUntil.toString());
        }
        setLockoutSeconds(sec);
        setSubmitStatus({
          success: false,
          message:
            data.message ||
            `Too many advertising requests submitted from this connection. Please wait: ${formatLockoutTime(
              sec
            )} remaining.`,
        });
        return;
      }

      if (res.ok && data.success) {
        setSubmitStatus({
          success: true,
          message: data.message || "Your advertising request has been submitted successfully!",
        });
        setFormData({
          name: "",
          company: "",
          email: "",
          serviceOption: "Publish Company Article",
          phone: "",
          whatsapp: "",
          details: "",
        });
      } else {
        setSubmitStatus({
          success: false,
          message: data.message || "Failed to submit request. Please try again.",
        });
      }
    } catch (err) {
      console.error("Error submitting advertise lead:", err);
      setSubmitStatus({
        success: true,
        message: "Thank you! Your advertising request has been received.",
      });
      setFormData({
        name: "",
        company: "",
        email: "",
        serviceOption: "Publish Company Article",
        phone: "",
        whatsapp: "",
        details: "",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#111111] flex flex-col font-sans">
      <Header />
      <StickyHeaderBar />

      <main className="w-full bg-white text-[#111111] flex-1 py-12 sm:py-16 font-sans">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Column: Advertise Info & Services */}
            <div className="md:col-span-5 border-b md:border-b-0 md:border-r border-[#EAE6DA] pb-10 md:pb-0 md:pr-12">
              <h1 className="font-serif font-bold text-3xl sm:text-4xl text-gray-900 mb-2">
                Advertise with Us
              </h1>
              <div className="w-12 h-0.5 bg-[#990000] mb-6" />

              <p className="text-xs text-gray-600 leading-relaxed mb-8 font-sans">
                The Times Chicago reaches an influential global audience of corporate executives, investors, policy makers, and thought leaders. Position your brand alongside premium financial journalism and global reporting.
              </p>

              <h4
                style={{ fontFamily: "'Poppins', sans-serif" }}
                className="text-[11px] font-bold text-gray-400 tracking-widest uppercase mb-4"
              >
                OUR SERVICES
              </h4>

              <div className="space-y-6 text-xs font-sans">
                {/* Service 1 */}
                <div>
                  <h5
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                    className="font-bold text-gray-900 text-sm mb-1"
                  >
                    Publish Company Article
                  </h5>
                  <p className="text-gray-500 leading-relaxed">
                    Feature your brand's growth, announcement, or milestone with our premium editorial formatting.
                  </p>
                </div>

                {/* Service 2 */}
                <div>
                  <h5
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                    className="font-bold text-gray-900 text-sm mb-1"
                  >
                    Publish CEO Profile
                  </h5>
                  <p className="text-gray-500 leading-relaxed">
                    Get an exclusive written interview profiling your CEO's vision, leadership, and company direction.
                  </p>
                </div>

                {/* Service 3 */}
                <div>
                  <h5
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                    className="font-bold text-gray-900 text-sm mb-1"
                  >
                    Report News
                  </h5>
                  <p className="text-gray-500 leading-relaxed">
                    Collaborate with our reporting team to share key press developments or exclusive industry insights.
                  </p>
                </div>

                {/* Service 4 */}
                <div>
                  <h5
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                    className="font-bold text-gray-900 text-sm mb-1"
                  >
                    Times Chicago Magazine
                  </h5>
                  <p className="text-gray-500 leading-relaxed">
                    Reserve a premium print or digital full-page ad placement inside our quarterly business magazine.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Client Inquiry Lead Form */}
            <div className="md:col-span-7">
              <h2 className="font-serif font-bold text-2xl sm:text-3xl text-gray-900 mb-1.5">
                Get your article published today
              </h2>
              <p className="text-xs text-gray-500 mb-6 font-sans">
                Fill out the form below to connect with our advertising & partnership team.
              </p>

              <div className="w-full border-b border-[#EAE6DA] mb-8" />

              {/* Status Alert Banner */}
              {submitStatus && (
                <div
                  className={`p-4 rounded text-xs mb-6 font-sans ${
                    submitStatus.success
                      ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                      : "bg-rose-50 border border-rose-200 text-rose-800"
                  }`}
                >
                  {submitStatus.message}
                </div>
              )}

              <form onSubmit={handleSubmit} suppressHydrationWarning className="space-y-5 font-sans text-xs">
                {/* Row 1: Name & Company */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] font-bold tracking-wider text-gray-700 uppercase mb-1.5">
                      YOUR NAME <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                      disabled={isSubmitting || lockoutSeconds > 0}
                      suppressHydrationWarning
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#00558c] transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold tracking-wider text-gray-700 uppercase mb-1.5">
                      COMPANY NAME <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Company LLC"
                      required
                      disabled={isSubmitting || lockoutSeconds > 0}
                      suppressHydrationWarning
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#00558c] transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Row 2: Email & Interested Option */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] font-bold tracking-wider text-gray-700 uppercase mb-1.5">
                      YOUR EMAIL <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john.doe@example.com"
                      required
                      disabled={isSubmitting || lockoutSeconds > 0}
                      suppressHydrationWarning
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#00558c] transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold tracking-wider text-gray-700 uppercase mb-1.5">
                      INTERESTED OPTION <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="serviceOption"
                      value={formData.serviceOption}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting || lockoutSeconds > 0}
                      suppressHydrationWarning
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded text-xs text-gray-900 bg-white focus:outline-none focus:border-[#00558c] transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value="Publish Company Article">Publish Company Article</option>
                      <option value="Publish CEO Profile">Publish CEO Profile</option>
                      <option value="Report News">Report News</option>
                      <option value="Times Chicago Magazine">Times Chicago Magazine</option>
                    </select>
                  </div>
                </div>

                {/* Row 3: Phone & WhatsApp */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] font-bold tracking-wider text-gray-700 uppercase mb-1.5">
                      PHONE NUMBER <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                      required
                      disabled={isSubmitting || lockoutSeconds > 0}
                      suppressHydrationWarning
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#00558c] transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold tracking-wider text-gray-700 uppercase mb-1.5">
                      WHATSAPP NUMBER <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                      required
                      disabled={isSubmitting || lockoutSeconds > 0}
                      suppressHydrationWarning
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#00558c] transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Row 4: Tell us about your brand / Inquiry details */}
                <div>
                  <label className="block text-[10px] font-bold tracking-wider text-gray-700 uppercase mb-1.5">
                    TELL US ABOUT YOUR BRAND / INQUIRY DETAILS <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="details"
                    rows={4}
                    value={formData.details}
                    onChange={handleChange}
                    placeholder="Please enter details of your advertising requirements, budget, or preferred dates..."
                    required
                    disabled={isSubmitting || lockoutSeconds > 0}
                    suppressHydrationWarning
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#00558c] transition-colors resize-y disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || lockoutSeconds > 0}
                    suppressHydrationWarning
                    className={`font-bold text-xs uppercase tracking-wider px-6 py-3 rounded flex items-center space-x-2 transition-colors disabled:opacity-50 ${
                      lockoutSeconds > 0
                        ? "bg-red-700 text-white cursor-not-allowed"
                        : "bg-[#00558c] hover:bg-[#00406c] text-white"
                    }`}
                  >
                    {lockoutSeconds > 0 ? (
                      <>
                        <span className="text-sm">🔒</span>
                        <span>LOCKED ({formatLockoutTime(lockoutSeconds)} REMAINING)</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                        </svg>
                        <span>{isSubmitting ? "SUBMITTING..." : "SUBMIT REQUEST"}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

          </div>
        </Container>
      </main>

      <StickySubscribeBar />
      <Footer />
    </div>
  );
}
