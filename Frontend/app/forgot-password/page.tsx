"use client";

import React, { useState } from "react";
import Link from "next/link";
import Container from "@/components/layout/Container";
import WSJLogo from "@/components/ui/WSJLogo";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [sentEmail, setSentEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setError("Please enter your email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to process password reset request.");
      }

      setSentEmail(cleanEmail);
      setSuccess(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#faf9f5] flex flex-col justify-between font-sans selection:bg-[#00558c] selection:text-white">
      {/* Top Header Bar */}
      <header className="border-b border-[#e2e2e2] bg-white py-4 shadow-2xs">
        <Container>
          <div className="flex items-center justify-between">
            <Link href="/" className="inline-block transition-opacity hover:opacity-85" aria-label="Times Chicago Homepage">
              <WSJLogo />
            </Link>
            <Link
              href="/signin"
              className="text-xs sm:text-sm font-sans font-bold text-[#00558c] hover:underline"
            >
              Back to Sign In
            </Link>
          </div>
        </Container>
      </header>

      {/* Main Form Centerpiece */}
      <div className="flex-1 flex items-center justify-center py-10 px-4 sm:px-6">
        <div className="w-full max-w-md bg-white border border-[#e2e2e2] rounded-xl shadow-lg p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
          {!success ? (
            <>
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 text-[#00558c] rounded-full mb-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                    />
                  </svg>
                </div>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#111111] tracking-tight">
                  Reset Password
                </h1>
                <p className="mt-2 text-xs sm:text-sm text-[#555555] leading-relaxed">
                  Enter your Times Chicago email address and we will send you a secure link to reset your password.
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm rounded-lg flex items-start space-x-2 animate-in fade-in">
                  <svg className="w-4 h-4 text-red-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <div>
                  <label
                    htmlFor="reset-email"
                    className="block text-[10px] sm:text-[11px] font-sans font-bold text-[#555555] uppercase tracking-wider mb-1.5"
                  >
                    Email Address
                  </label>
                  <input
                    id="reset-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. reader@timeschicago.com"
                    disabled={loading}
                    autoComplete="email"
                    className="w-full bg-white border border-[#cccccc] focus:border-[#00558c] text-xs sm:text-sm px-3.5 py-2.5 rounded-lg focus:outline-none transition-all placeholder:text-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed shadow-2xs"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#00558c] hover:bg-[#00426d] text-white font-sans text-xs sm:text-sm font-bold uppercase tracking-wider py-2.5 sm:py-3 rounded-lg transition-colors shadow-xs flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                      </svg>
                      <span>SENDING LINK...</span>
                    </>
                  ) : (
                    <span>SEND RESET LINK</span>
                  )}
                </button>

                <div className="text-center pt-2">
                  <Link
                    href="/signin"
                    className="text-xs sm:text-sm font-sans font-medium text-[#666666] hover:text-[#111111] transition-colors"
                  >
                    Remember your password? <span className="text-[#00558c] font-semibold hover:underline">Sign In</span>
                  </Link>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center py-4 animate-in fade-in">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 text-green-700 rounded-full mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h2 className="font-serif text-2xl font-bold text-[#111111] mb-2">
                Check Your Email
              </h2>

              <p className="text-xs sm:text-sm text-[#444444] leading-relaxed mb-6">
                If an account exists for <strong className="text-[#111111] font-semibold">{sentEmail}</strong>, we have dispatched a password reset link. Please check your inbox and spam folder.
              </p>

              <div className="bg-[#f8f9fa] border border-[#e9ecef] rounded-lg p-3.5 mb-6 text-left">
                <p className="text-xs text-[#666666] flex items-center space-x-2">
                  <svg className="w-4 h-4 text-amber-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span>This reset link will expire in <strong>1 hour</strong>.</span>
                </p>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    setSuccess(false);
                    setEmail("");
                  }}
                  className="w-full bg-white hover:bg-gray-50 border border-[#cccccc] text-[#333333] font-sans text-xs sm:text-sm font-semibold py-2.5 rounded-lg transition-colors cursor-pointer"
                >
                  Send to Another Email
                </button>

                <Link
                  href="/signin"
                  className="block w-full bg-[#00558c] hover:bg-[#00426d] text-white font-sans text-xs sm:text-sm font-bold uppercase tracking-wider py-2.5 rounded-lg transition-colors text-center shadow-xs"
                >
                  Return to Sign In
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#e2e2e2] bg-white py-4 text-center text-xs text-[#777777]">
        <Container>
          <p>&copy; {new Date().getFullYear()} Times Chicago Media Inc. All rights reserved.</p>
        </Container>
      </footer>
    </main>
  );
}
