"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function VerifyPage() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const router = useRouter();

  useEffect(() => {
    handleSendCode(true);
  }, []);

  const handleSendCode = async (isSilent = false) => {
    setResending(true);
    const email = localStorage.getItem("user_email_for_verify");
    const res = await fetch("/api/auth/send-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setResending(false);
    if (res.ok) {
      if (!isSilent) {
        alert("Verification code has been resent to your email.");
      }
    } else {
      const data = await res.json();
      if (!isSilent) {
        alert(data.error || "Failed to resend code.");
      }
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const email = localStorage.getItem("user_email_for_verify");
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp: code, email }),
      });
      if (response.ok) {
        window.location.replace("/dashboard");
      } else {
        const data = await response.json();
        alert(data.error || "Invalid verification code");
      }
    } catch (e) {
      alert("Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-apple-bg dark:bg-black">
      <div className="w-full max-w-[400px] p-8 glass rounded-[24px] shadow-apple text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-4">
          Verify Your Email
        </h1>
        <p className="text-apple-gray text-sm mb-8">
          We've sent a verification code to your email. Please enter it below.
        </p>

        <form onSubmit={handleVerify} className="space-y-6">
          <div className="flex justify-center">
            <Input
              placeholder="000000"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="text-center text-4xl tracking-[0.2em] font-mono h-20 border-2 border-white/20 focus:border-apple-blue"
              required
              maxLength={6}
              autoFocus
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="apple-button-primary w-full"
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        <button
          onClick={() => handleSendCode(false)}
          disabled={resending}
          className="mt-6 text-apple-blue text-sm hover:underline"
        >
          {resending ? "Sending..." : "Didn't get a code? Resend"}
        </button>
      </div>
    </div>
  );
}
