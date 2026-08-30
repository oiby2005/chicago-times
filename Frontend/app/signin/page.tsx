"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Container from "@/components/layout/Container";
import WSJLogo from "@/components/ui/WSJLogo";

export default function SignInPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false); // default to Login mode
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Failed attempts & lockout state
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  useEffect(() => {
    document.body.classList.add("signin-page");
    return () => {
      document.body.classList.remove("signin-page");
    };
  }, []);

  // Lockout countdown timer & persistence check
  useEffect(() => {
    const checkLockoutState = () => {
      if (typeof window === "undefined") return;

      const storedLockout = localStorage.getItem("wsj_lockout_until");
      if (storedLockout) {
        const lockoutTime = parseInt(storedLockout, 10);
        const now = Date.now();
        if (lockoutTime > now) {
          const diffSec = Math.ceil((lockoutTime - now) / 1000);
          setRemainingSeconds(diffSec);
          return;
        } else {
          // Lockout expired
          localStorage.removeItem("wsj_lockout_until");
          localStorage.removeItem("wsj_failed_attempts");
          setRemainingSeconds(0);
          setFailedAttempts(0);
        }
      } else {
        const storedAttempts = localStorage.getItem("wsj_failed_attempts");
        if (storedAttempts) {
          setFailedAttempts(parseInt(storedAttempts, 10));
        }
      }
    };

    checkLockoutState();
    const interval = setInterval(checkLockoutState, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatLockoutTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}m ${secs.toString().padStart(2, "0")}s`;
  };

  const handleFailedAttempt = () => {
    const newCount = failedAttempts + 1;
    setFailedAttempts(newCount);

    if (typeof window !== "undefined") {
      localStorage.setItem("wsj_failed_attempts", newCount.toString());
    }

    if (newCount >= 5) {
      const lockoutUntil = Date.now() + 15 * 60 * 1000; // 15 minutes
      if (typeof window !== "undefined") {
        localStorage.setItem("wsj_lockout_until", lockoutUntil.toString());
      }
      setRemainingSeconds(15 * 60);
      setError("Invalid email or password");
    } else {
      setError("Invalid email or password");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (remainingSeconds > 0) {
      return;
    }

    if (!email.trim() || !password.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    if (isSignUp && (!fullName.trim() || !confirmPassword.trim())) {
      setError("Please fill in all required fields.");
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (isSignUp) {
      setSubmitted(true);
      return;
    }

    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // 1. Try Backend Express API Login
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fullName: fullName || "User", email: cleanEmail, password: cleanPassword }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const data = await res.json();

      if (res.ok && data.success) {
        if (typeof window !== "undefined") {
          const userStr = JSON.stringify(data.user);
          sessionStorage.setItem("wsj_session_active", "true");
          sessionStorage.setItem("wsj_user", userStr);
          localStorage.removeItem("wsj_logged_out");
          localStorage.removeItem("wsj_failed_attempts");
          localStorage.removeItem("wsj_lockout_until");
          localStorage.setItem("wsj_token", data.token || "dummy_token");
          localStorage.setItem("wsj_user", userStr);

          const role = (data.user?.role || "").toLowerCase();
          if (role === "writer") {
            localStorage.setItem("wsj_writer_user", userStr);
          } else if (role === "admin") {
            localStorage.setItem("wsj_admin_user", userStr);
          } else if (role === "reader") {
            localStorage.setItem("wsj_reader_user", userStr);
          }

          window.dispatchEvent(new Event("wsj_user_updated"));
        }

        setLoading(false);
        router.push("/");
        return;
      }
    } catch (err: any) {
      if (err?.name === "AbortError") {
        console.warn("Backend Express login request timed out after 8s");
      } else {
        console.warn("Backend Express server fetch error:", err?.message || err);
      }
    }

    // 2. Strict static credentials check - accepts common password variations!
    const ALLOWED_ACCOUNTS = [
      {
        email: "admin@gmail.com",
        passwords: ["admin123", "123456", "admin"],
        role: "admin",
        full_name: "Admin User",
        route: "/",
      },
      {
        email: "writer@gmail.com",
        passwords: ["writer123", "123456", "writer"],
        role: "writer",
        full_name: "Writer User",
        bio: "Journalist & Columnist",
        linkedin: "https://www.linkedin.com/in/your-profile",
        avatar_url: "",
        route: "/",
      },
      {
        email: "reader@gmail.com",
        passwords: ["reader123", "123456", "reader"],
        role: "reader",
        full_name: "Reader User",
        route: "/",
      },
    ];

    const matchedAccount = ALLOWED_ACCOUNTS.find(
      (acc) => acc.email === cleanEmail && acc.passwords.includes(cleanPassword)
    );

    if (matchedAccount) {
      let userData: any = {
        id: "usr_" + matchedAccount.role + "_" + Date.now(),
        full_name: matchedAccount.full_name,
        email: matchedAccount.email,
        role: matchedAccount.role,
        bio: (matchedAccount as any).bio || "",
        linkedin: (matchedAccount as any).linkedin || "",
        avatar_url: (matchedAccount as any).avatar_url || "",
      };

      if (typeof window !== "undefined") {
        const existingStr = localStorage.getItem("wsj_user");
        if (existingStr) {
          try {
            const existing = JSON.parse(existingStr);
            if (existing.email === matchedAccount.email) {
              userData = {
                ...userData,
                ...existing,
                role: matchedAccount.role,
              };
            }
          } catch (e) {}
        }

        const userStr = JSON.stringify(userData);
        sessionStorage.setItem("wsj_session_active", "true");
        sessionStorage.setItem("wsj_user", userStr);
        localStorage.removeItem("wsj_logged_out");
        localStorage.removeItem("wsj_failed_attempts");
        localStorage.removeItem("wsj_lockout_until");
        localStorage.setItem("wsj_token", `dummy_token_${matchedAccount.role}_2026`);
        localStorage.setItem("wsj_user", userStr);

        if (matchedAccount.role === "writer") {
          localStorage.setItem("wsj_writer_user", userStr);
        } else if (matchedAccount.role === "admin") {
          localStorage.setItem("wsj_admin_user", userStr);
        } else if (matchedAccount.role === "reader") {
          localStorage.setItem("wsj_reader_user", userStr);
        }

        window.dispatchEvent(new Event("wsj_user_updated"));
      }

      setLoading(false);
      router.push(matchedAccount.route);
      return;
    }

    // 3. ANY other email/password (e.g. qwerty@gmail.com) MUST BE REJECTED & COUNTED AS FAILED ATTEMPT!
    setLoading(false);
    handleFailedAttempt();
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError("");
    setSubmitted(false);
  };

  const isLockedOut = remainingSeconds > 0;

  return (
    <main className="signin-page min-h-screen bg-white text-[#111111] font-sans flex flex-col" suppressHydrationWarning>
      {/* Minimal Centered WSJ Logo Navbar */}
      <header className="w-full bg-white border-b border-[#e2e2e2] py-2 sm:py-3 text-center shrink-0">
        <Link href="/" className="inline-block focus:outline-none focus:ring-2 focus:ring-[#00558c] rounded-md">
          <WSJLogo className="w-full max-w-[220px] xs:max-w-[260px] sm:max-w-[360px] h-[26px] xs:h-[30px] sm:h-[40px] mx-auto block select-none" />
        </Link>
      </header>

      {/* Main Sign In / Sign Up Form Card - Fully Visible & Scrollable on Mobile */}
      <div className="flex-1 flex flex-col justify-start sm:justify-center items-center py-3 sm:py-6 px-3 sm:px-4 md:px-6">
        <Container className="flex justify-center items-center w-full">
          <div className="signin-wrapper w-full max-w-md bg-white border border-[#e2e2e2] rounded-xl p-3.5 xs:p-4 sm:p-6 shadow-sm space-y-2.5 sm:space-y-4" suppressHydrationWarning>
            {/* Header Row */}
            <div className="flex items-center justify-between pb-2 sm:pb-2.5 border-b border-[#f0f0f0]">
              <div>
                <h2 className="text-lg sm:text-2xl font-serif font-bold text-[#111111] leading-tight">
                  {isSignUp ? "Sign Up" : "Login"}
                </h2>
                <p className="text-[9px] sm:text-[10px] md:text-[10.5px] font-sans font-bold text-[#999999] tracking-widest uppercase mt-0.5">
                  {isSignUp ? "CREATE YOUR ACCOUNT" : "SIGN IN TO YOUR ACCOUNT"}
                </p>
              </div>
              <Link
                href="/"
                className="p-1 -mr-1 text-gray-400 hover:text-black text-lg sm:text-xl font-light focus:outline-none focus:ring-2 focus:ring-gray-300 rounded"
                aria-label="Close"
              >
                ✕
              </Link>
            </div>

            {submitted ? (
              <div className="bg-gray-50 border border-gray-200 p-4 sm:p-5 rounded-lg text-center space-y-2 my-2">
                <h3 className="text-sm sm:text-base font-serif font-bold text-gray-900">
                  {isSignUp ? "Account Created Successfully!" : "Signed In Successfully!"}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 font-sans">
                  Welcome to WSJ{fullName ? `, ${fullName}` : ""}.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-xs sm:text-sm text-[#00558c] hover:underline pt-2 block mx-auto font-sans font-semibold cursor-pointer"
                >
                  {isSignUp ? "Register another account" : "Back to Sign In"}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-2.5 sm:space-y-3.5" noValidate suppressHydrationWarning>
                {error && (
                  <div className="text-xs font-sans text-red-600 text-center font-semibold mb-1">
                    {error}
                  </div>
                )}

                {/* Top Social Auth Button (Google) */}
                <button
                  type="button"
                  disabled={isLockedOut}
                  suppressHydrationWarning
                  className={`w-full bg-white hover:bg-gray-50 text-gray-800 border border-[#e2e2e2] rounded-lg font-sans text-xs sm:text-sm font-medium py-2 sm:py-2.5 px-3 flex items-center justify-center space-x-2 transition-colors shadow-2xs ${
                    isLockedOut ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                  }`}
                >
                  <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span className="text-[#333333] font-medium text-xs sm:text-[13px]">
                    Sign in with Google
                  </span>
                </button>

                {/* Or Email Credentials Divider */}
                <div className="relative flex items-center justify-center my-1.5 sm:my-2.5">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#e2e2e2]" />
                  </div>
                  <div className="relative bg-white px-2 text-[8.5px] sm:text-[10px] font-sans font-bold text-[#999999] tracking-widest uppercase">
                    OR EMAIL CREDENTIALS
                  </div>
                </div>

                {/* Field 1: FULL NAME (Sign Up only) */}
                {isSignUp && (
                  <div className="space-y-1">
                    <label
                      htmlFor="fullName"
                      className="block text-[9px] sm:text-[10px] font-sans font-bold text-[#666666] uppercase tracking-wider"
                    >
                      FULL NAME
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      disabled={isLockedOut}
                      suppressHydrationWarning
                      placeholder="e.g. Richard Hendricks"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-white border border-[#cccccc] focus:border-[#00558c] text-xs sm:text-sm px-2.5 sm:px-3 py-1.5 sm:py-2.5 rounded-lg focus:outline-none transition-all placeholder:text-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                )}

                {/* Field 2: EMAIL ADDRESS */}
                <div className="space-y-1">
                  <label
                    htmlFor="email"
                    className="block text-[9px] sm:text-[10px] font-sans font-bold text-[#666666] uppercase tracking-wider"
                  >
                    EMAIL ADDRESS
                  </label>
                  <input
                    id="email"
                    type="email"
                    disabled={isLockedOut}
                    suppressHydrationWarning
                    placeholder="e.g. richard@piedpiper.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-[#cccccc] focus:border-[#00558c] text-xs sm:text-sm px-2.5 sm:px-3 py-1.5 sm:py-2.5 rounded-lg focus:outline-none transition-all placeholder:text-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Field 3: PASSWORD */}
                <div className="space-y-1">
                  <label
                    htmlFor="password"
                    className="block text-[9px] sm:text-[10px] font-sans font-bold text-[#666666] uppercase tracking-wider"
                  >
                    PASSWORD
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      disabled={isLockedOut}
                      suppressHydrationWarning
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white border border-[#cccccc] focus:border-[#00558c] text-xs sm:text-sm pl-2.5 sm:pl-3 pr-8 sm:pr-9 py-1.5 sm:py-2.5 rounded-lg focus:outline-none transition-all placeholder:text-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                    <button
                      type="button"
                      disabled={isLockedOut}
                      suppressHydrationWarning
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-2 sm:pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none disabled:cursor-not-allowed"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Field 4: CONFIRM PASSWORD (Sign Up only) */}
                {isSignUp && (
                  <div className="space-y-1">
                    <label
                      htmlFor="confirmPassword"
                      className="block text-[9px] sm:text-[10px] font-sans font-bold text-[#666666] uppercase tracking-wider"
                    >
                      CONFIRM PASSWORD
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        disabled={isLockedOut}
                        suppressHydrationWarning
                        placeholder="Re-enter password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-white border border-[#cccccc] focus:border-[#00558c] text-xs sm:text-sm pl-2.5 sm:pl-3 pr-8 sm:pr-9 py-1.5 sm:py-2.5 rounded-lg focus:outline-none transition-all placeholder:text-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                      <button
                        type="button"
                        disabled={isLockedOut}
                        suppressHydrationWarning
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-2 sm:pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none disabled:cursor-not-allowed"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={1.5}
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}

                {/* Primary Action Button: SIGN IN or REGISTER ACCOUNT or LOCKED OUT COUNTDOWN */}
                <button
                  type="submit"
                  disabled={isLockedOut || loading}
                  suppressHydrationWarning
                  className={`w-full font-sans text-xs sm:text-sm font-bold uppercase tracking-wider py-2 sm:py-2.5 rounded-lg transition-colors shadow-xs my-1.5 sm:my-2 ${
                    isLockedOut
                      ? "bg-red-600 text-white cursor-not-allowed opacity-95"
                      : "bg-[#00558c] hover:bg-[#00426d] text-white cursor-pointer"
                  }`}
                >
                  {isLockedOut
                    ? `🔒 LOCKED OUT (${formatLockoutTime(remainingSeconds)} REMAINING)`
                    : loading
                    ? "SIGNING IN..."
                    : isSignUp
                    ? "REGISTER ACCOUNT"
                    : "SIGN IN"}
                </button>

                {/* Bottom Red Link to Toggle Mode */}
                <div className="text-center pt-0.5">
                  <button
                    type="button"
                    disabled={isLockedOut}
                    suppressHydrationWarning
                    onClick={toggleMode}
                    className="text-[11px] sm:text-sm font-sans font-bold text-[#8b0000] hover:underline cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSignUp
                      ? "Already registered? Sign in instead"
                      : "New to The Wall Street Journal? Create secure account"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </Container>
      </div>
    </main>
  );
}
