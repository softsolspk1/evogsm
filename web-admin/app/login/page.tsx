"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
      });
      setLoading(false);
      if (error) {
        alert(error.message);
      } else {
        const { data: session } = await authClient.getSession();
        // Redirect based on role
        if (session?.user.role === "ADMIN") {
          router.push("/dashboard");
        } else if (session?.user.role === "SUB_ADMIN") {
          router.push("/orders/new");
        } else {
          router.push("/dashboard");
        }
      }
    } catch (err: any) {
      setLoading(false);
      alert("Login failed (Network or System Error): " + (err.message || "Unknown error"));
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-sky-50">
      {/* Left Side: Branding & Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-white flex-col items-center justify-center p-12 overflow-hidden border-r border-slate-200">
        <div className="relative z-10 w-full max-w-lg flex flex-col items-start mb-8">
          <Image src="/logo.png" alt="PharmEvo Logo" width={180} height={60} className="mb-8" />
          <h2 className="text-5xl font-bold text-[#1D1D1F] mb-6">CGM Device Management System</h2>
          <p className="text-xl text-[#424245] mb-10">Advanced tracking and analytics for PharmEvo CGM devices. Empowering KAMs and Distributors with real-time data.</p>
        </div>

        <div className="relative z-10 rounded-3xl overflow-hidden shadow-xl max-w-xs w-full ring-1 ring-slate-900/5 mt-8">
          <Image src="/product.jpg" alt="CGM Product" width={400} height={266} className="object-cover" />
        </div>

        {/* Background Decals */}
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-sky-100/50 rounded-full blur-3xl"></div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-50 rounded-full blur-3xl"></div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-sky-50">
        <div className="w-full max-w-[400px] bg-white p-10 rounded-3xl shadow-xl ring-1 ring-slate-900/5">
          <div className="lg:hidden mb-12 flex justify-center">
            <Image src="/logo.png" alt="PharmEvo Logo" width={160} height={53} />
          </div>

          <div className="mb-10 text-center">
            <h1 className="text-3xl font-bold tracking-tight mb-2 text-[#1D1D1F]">
              Sign In
            </h1>
            <p className="text-[#424245]">
              Enter your credentials to access the portal.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium px-1 text-[#1D1D1F]">Email Address</label>
              <Input
                type="email"
                placeholder="email@pharmevo.biz"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="apple-input !bg-white !text-black border-slate-200 focus:border-sky-500 placeholder:!text-gray-400"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium px-1 text-[#1D1D1F]">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="apple-input !bg-white !text-black border-slate-200 focus:border-sky-500 placeholder:!text-gray-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="apple-button-primary w-full py-4 text-base bg-sky-600 hover:bg-sky-700 text-white border-none shadow-md shadow-sky-200"
            >
              {loading ? "Authenticating..." : "Sign In to Portal"}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-400">
              Developed by Softsols - Digital AI Solutions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
