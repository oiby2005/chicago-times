"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import Container from "@/components/layout/Container";
import WSJLogo from "@/components/ui/WSJLogo";

interface TokenVerificationState {
  isVerifying: boolean;
  isValid: boolean;
  maskedEmail: string;
  errorMessage: string;
}

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [verification, setVerification] = useState<TokenVerificationState>({
    isVerifying: true,
    isValid: false,
    maskedEmail: "",
    errorMessage: "",
  });

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Verify token on mount
  useEffect(() => {
    if (!token) {
      setVerification({
        isVerifying: false,
        isValid: false,
        maskedEmail: "",
        errorMessage: "No password reset token was provided in the link.",
      });
      return;
    }

    const verifyToken = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const response = await fetch(`${apiUrl}/api/auth/verify-reset-token?token=${encodeURIComponent(token)}`);
        const data = await response.json();

        if (response.ok && data.success && data.valid) {
          setVerification({
            isVerifying: false,
            isValid: true,
            maskedEmail: data.email || "",
            errorMessage: "",
          });
        } else {
          setVerification({
            isVerifying: false,
            isValid: false,
            maskedEmail: "",
            errorMessage: data.message || "This password reset link is invalid or has expired.",
          });
        }
      } catch (err: unknown) {
        setVerification({
          isVerifying: false,
          isValid: false,
          maskedEmail: "",
          errorMessage: "Failed to connect to the authentication server.",
        });
      }
    };

    verifyToken();
  }, [token]);

  // Real-time strength criteria checks
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;
  const isFormValid = hasMinLength && hasUppercase && hasNumber && hasSpecialChar && passwordsMatch;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!isFormValid) {
      if (!passwordsMatch) {
        setError("Passwords do not match.");
      } else {
        setError("Please satisfy all password security requirements.");
      }
      return;
    }

    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password.");
      }

      setIsSuccess(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred while resetting your password.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white border border-[#e2e2e2] rounded-xl shadow-lg p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
      {/* State 1: Verifying Token */}
      {verification.isVerifying && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-[#00558c] border-t-transparent mb-4"></div>
          <p className="text-sm font-sans font-medium text-[#555555]">
            Verifying your password reset link...
          </p>
        </div>
      )}

      {/* State 2: Token is Invalid or Expired */}
      {!verification.isVerifying && !verification.isValid && (
        <div className="text-center py-4">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 text-red-600 rounded-full mb-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#111111] mb-2">
            Link Invalid or Expired
          </h2>
          <p className="text-xs sm:text-sm text-[#555555] leading-relaxed mb-6">
            {verification.errorMessage}
          </p>
          <div className="space-y-3">
            <Link
              href="/forgot-password"
              className="block w-full bg-[#00558c] hover:bg-[#00426d] text-white font-sans text-xs sm:text-sm font-bold uppercase tracking-wider py-2.5 sm:py-3 rounded-lg transition-colors text-center shadow-xs"
            >
              Request New Reset Link
            </Link>
            <Link
              href="/signin"
              className="block w-full bg-white hover:bg-gray-50 border border-[#cccccc] text-[#333333] font-sans text-xs sm:text-sm font-semibold py-2.5 rounded-lg transition-colors text-center"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      )}

      {/* State 3: Token is Valid & Password Successfully Reset */}
      {!verification.isVerifying && verification.isValid && isSuccess && (
        <div className="text-center py-4 animate-in fade-in">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 text-green-700 rounded-full mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#111111] mb-2">
            Password Reset Successful!
          </h2>
          <p className="text-xs sm:text-sm text-[#555555] leading-relaxed mb-6">
            Your Times Chicago account password has been updated. You can now securely sign in with your new password.
          </p>
          <Link
            href="/signin"
            className="block w-full bg-[#00558c] hover:bg-[#00426d] text-white font-sans text-xs sm:text-sm font-bold uppercase tracking-wider py-3 rounded-lg transition-colors text-center shadow-xs"
          >
            Sign In Now
          </Link>
        </div>
      )}

      {/* State 4: Token is Valid -> Show Reset Password Form */}
      {!verification.isVerifying && verification.isValid && !isSuccess && (
        <>
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 text-[#00558c] rounded-full mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#111111] tracking-tight">
              Create New Password
            </h1>
            {verification.maskedEmail && (
              <p className="mt-1 text-xs text-[#666666]">
                Account: <span className="font-mono font-semibold text-[#111111]">{verification.maskedEmail}</span>
              </p>
            )}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm rounded-lg flex items-start space-x-2 animate-in fade-in">
              <svg className="w-4 h-4 text-red-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* New Password */}
            <div>
              <label
                htmlFor="new-password"
                className="block text-[10px] sm:text-[11px] font-sans font-bold text-[#555555] uppercase tracking-wider mb-1"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  disabled={loading}
                  autoComplete="new-password"
                  className="w-full bg-white border border-[#cccccc] focus:border-[#00558c] text-xs sm:text-sm pl-3 pr-10 py-2.5 rounded-lg focus:outline-none transition-all placeholder:text-gray-400 disabled:bg-gray-100 shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirm-password"
                className="block text-[10px] sm:text-[11px] font-sans font-bold text-[#555555] uppercase tracking-wider mb-1"
              >
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  disabled={loading}
                  autoComplete="new-password"
                  className="w-full bg-white border border-[#cccccc] focus:border-[#00558c] text-xs sm:text-sm pl-3 pr-10 py-2.5 rounded-lg focus:outline-none transition-all placeholder:text-gray-400 disabled:bg-gray-100 shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                  tabIndex={-1}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Real-time Security Requirements Checklist */}
            <div className="bg-[#f8f9fa] border border-[#e9ecef] rounded-lg p-3 text-xs space-y-1.5">
              <p className="font-semibold text-[#444444] mb-1">Password Requirements:</p>
              <div className={`flex items-center space-x-1.5 ${hasMinLength ? "text-green-700" : "text-[#777777]"}`}>
                <span className="text-sm">{hasMinLength ? "✓" : "○"}</span>
                <span>At least 8 characters</span>
              </div>
              <div className={`flex items-center space-x-1.5 ${hasUppercase ? "text-green-700" : "text-[#777777]"}`}>
                <span className="text-sm">{hasUppercase ? "✓" : "○"}</span>
                <span>At least 1 uppercase letter (A-Z)</span>
              </div>
              <div className={`flex items-center space-x-1.5 ${hasNumber ? "text-green-700" : "text-[#777777]"}`}>
                <span className="text-sm">{hasNumber ? "✓" : "○"}</span>
                <span>At least 1 number (0-9)</span>
              </div>
              <div className={`flex items-center space-x-1.5 ${hasSpecialChar ? "text-green-700" : "text-[#777777]"}`}>
                <span className="text-sm">{hasSpecialChar ? "✓" : "○"}</span>
                <span>At least 1 special character (!@#$%^&*)</span>
              </div>
              {confirmPassword.length > 0 && (
                <div className={`flex items-center space-x-1.5 ${passwordsMatch ? "text-green-700" : "text-red-600 font-medium"}`}>
                  <span className="text-sm">{passwordsMatch ? "✓" : "✕"}</span>
                  <span>{passwordsMatch ? "Passwords match" : "Passwords do not match"}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !isFormValid}
              className="w-full bg-[#00558c] hover:bg-[#00426d] text-white font-sans text-xs sm:text-sm font-bold uppercase tracking-wider py-2.5 sm:py-3 rounded-lg transition-colors shadow-xs flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  <span>SAVING PASSWORD...</span>
                </>
              ) : (
                <span>SET NEW PASSWORD</span>
              )}
            </button>
          </form>
        </>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
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

      {/* Main Centerpiece wrapped in Suspense for useSearchParams */}
      <div className="flex-1 flex items-center justify-center py-10 px-4 sm:px-6">
        <Suspense
          fallback={
            <div className="w-full max-w-md bg-white border border-[#e2e2e2] rounded-xl shadow-lg p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-[#00558c] border-t-transparent mb-4"></div>
              <p className="text-sm font-sans font-medium text-[#555555]">Loading reset interface...</p>
            </div>
          }
        >
          <ResetPasswordContent />
        </Suspense>
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
