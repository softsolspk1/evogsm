"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Users,
  MapPin,
  TrendingUp,
  Package,
  Loader2
} from "lucide-react";
import { Navigation } from "@/components/Navigation";

export default function DashboardPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/analytics");
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    }
    if (session) {
      fetchStats();
    }
  }, [session]);

  if (isPending || loading) {
    return <div className="flex h-[80vh] items-center justify-center"><Loader2 className="animate-spin text-[#0071E3]" size={40} /></div>;
  }

  return (
    <div className="p-10 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
        <div>
          <h1 className="text-5xl font-bold tracking-tight text-[#1D1D1F]">Welcome back,</h1>
          <p className="text-[#86868B] mt-2 text-xl font-medium">{session?.user?.name || session?.user?.email}</p>
        </div>
        <div className="hidden md:block text-right">
          <p className="text-sm font-bold text-[#1D1D1F] uppercase tracking-widest bg-[#F5F5F7] px-4 py-2 rounded-full border border-[#D2D2D7]">
            {session?.user?.role} Control Center
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        <div className="bg-white p-8 rounded-[32px] border border-[#D2D2D7] shadow-sm hover:shadow-xl transition-all group">
          <div className="flex items-center justify-between mb-6">
            <div className="p-4 rounded-2xl bg-[#eff6ff] text-[#0071E3] group-hover:scale-110 transition-transform">
              <ShoppingBag size={28} />
            </div>
          </div>
          <div>
            <p className="text-[#86868B] text-sm font-bold uppercase tracking-wider">Orders Today</p>
            <h3 className="text-4xl font-bold mt-2 tracking-tight text-[#1D1D1F]">{stats?.todayOrders || 0}</h3>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-[#D2D2D7] shadow-sm hover:shadow-xl transition-all group">
          <div className="flex items-center justify-between mb-6">
            <div className="p-4 rounded-2xl bg-[#f0fdf4] text-green-500 group-hover:scale-110 transition-transform">
              <Users size={28} />
            </div>
          </div>
          <div>
            <p className="text-[#86868B] text-sm font-bold uppercase tracking-wider">Active Users</p>
            <h3 className="text-4xl font-bold mt-2 tracking-tight text-[#1D1D1F]">{stats?.totalUsers || 0}</h3>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-[#D2D2D7] shadow-sm hover:shadow-xl transition-all group">
          <div className="flex items-center justify-between mb-6">
            <div className="p-4 rounded-2xl bg-[#faf5ff] text-purple-500 group-hover:scale-110 transition-transform">
              <Package size={28} />
            </div>
          </div>
          <div>
            <p className="text-[#86868B] text-sm font-bold uppercase tracking-wider">Installations</p>
            <h3 className="text-4xl font-bold mt-2 tracking-tight text-[#1D1D1F]">{stats?.installations || 0}</h3>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-[#D2D2D7] shadow-sm hover:shadow-xl transition-all group">
          <div className="flex items-center justify-between mb-6">
            <div className="p-4 rounded-2xl bg-[#fff7ed] text-orange-500 group-hover:scale-110 transition-transform">
              <TrendingUp size={28} />
            </div>
          </div>
          <div>
            <p className="text-[#86868B] text-sm font-bold uppercase tracking-wider">Trend</p>
            <h3 className="text-4xl font-bold mt-2 tracking-tight text-[#1D1D1F]">+12%</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-10 rounded-[40px] border border-[#D2D2D7] shadow-sm relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-4">Operational Summary</h2>
            <p className="text-[#86868B] font-medium mb-8 max-w-md">Overview of current system health and order fulfillment status across all active regions.</p>
            <button
              onClick={() => router.push("/orders")}
              className="px-8 py-4 bg-[#0071E3] text-white rounded-2xl font-bold text-lg shadow-lg hover:bg-[#0077ED] transition-all"
            >
              Manage Orders
            </button>
          </div>
          <div className="absolute right-0 bottom-0 opacity-10">
            <ShoppingBag size={300} strokeWidth={1} />
          </div>
        </div>

        <div className="bg-[#1D1D1F] p-10 rounded-[40px] text-white">
          <h2 className="text-2xl font-bold mb-2">City Stats</h2>
          <p className="text-[#86868B] text-sm font-medium mb-8">Quick regional breakdown</p>
          <div className="space-y-4">
            {stats?.cityReports?.slice(0, 3).map((report: any) => (
              <div key={report.patientCity} className="flex items-center justify-between p-4 bg-white/10 rounded-2xl">
                <span className="font-bold">{report.patientCity}</span>
                <span className="text-[#0071E3] font-black">{report._count._all}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => router.push("/reports")}
            className="w-full mt-8 py-4 bg-white/10 hover:bg-white/20 rounded-2xl font-bold transition-colors"
          >
            View Full Reports
          </button>
        </div>
      </div>
    </div>
  );
}
