"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShoppingBag,
  Users,
  MapPin,
  TrendingUp,
  Package,
  Loader2,
  PlusCircle,
  UserPlus
} from "lucide-react";
import { Navigation } from "@/components/Navigation";

// StatCard Component
function StatCard({ title, value, icon: Icon, color }: { title: string; value: string | number; icon: any; color: string }) {
  return (
    <div className="bg-white p-8 rounded-[32px] border border-[#D2D2D7] shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-4 rounded-2xl ${color} bg-opacity-10`}>
          <Icon className={`${color.replace('bg-', 'text-')} w-8 h-8`} />
        </div>
      </div>
      <h3 className="text-4xl font-black text-[#1D1D1F] mb-2">{value}</h3>
      <p className="text-[#86868B] font-semibold text-sm uppercase tracking-wider">{title}</p>
    </div>
  );
}


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
          <p className="text-[#1D1D1F] mt-2 text-xl font-medium">{session?.user?.name || session?.user?.email}</p>
        </div>
        <div className="hidden md:block text-right">
          <p className="text-sm font-bold text-[#1D1D1F] uppercase tracking-widest bg-[#F5F5F7] px-4 py-2 rounded-full border border-[#D2D2D7]">
            {session?.user?.role} Control Center
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        <StatCard title="Orders Today" value={stats?.todayOrders || 0} icon={ShoppingBag} color="bg-blue-500" />
        <StatCard title="Active Users" value={stats?.totalUsers || 0} icon={Users} color="bg-green-500" />
        <StatCard title="Installations" value={stats?.installations || 0} icon={Package} color="bg-purple-500" />
        <StatCard title="Trend" value="+12%" icon={TrendingUp} color="bg-orange-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="bg-white p-10 rounded-[40px] border border-[#D2D2D7] shadow-sm">
          <h2 className="text-3xl font-bold mb-8 text-[#1D1D1F]">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-6">
            <Link href="/orders/new" className="flex flex-col items-center justify-center p-8 bg-[#F5F5F7] rounded-[32px] hover:bg-[#E8E8ED] transition-all group">
              <PlusCircle size={40} className="text-[#0071E3] mb-4 group-hover:scale-110 transition-transform" />
              <span className="font-semibold text-lg text-[#1D1D1F]">New Order</span>
            </Link>
            <Link href="/users" className="flex flex-col items-center justify-center p-8 bg-[#F5F5F7] rounded-[32px] hover:bg-[#E8E8ED] transition-all group">
              <UserPlus size={40} className="text-[#0071E3] mb-4 group-hover:scale-110 transition-transform" />
              <span className="font-semibold text-lg text-[#1D1D1F]">Add User</span>
            </Link>
          </div>
        </div>

        <div className="bg-[#1D1D1F] p-10 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-6">System Status</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/20 pb-4">
                <span className="text-lg font-medium text-gray-300">Database</span>
                <span className="flex items-center gap-2 text-green-400 font-bold bg-green-400/10 px-4 py-1 rounded-full"><div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div> Operational</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/20 pb-4">
                <span className="text-lg font-medium text-gray-300">API Gateway</span>
                <span className="flex items-center gap-2 text-green-400 font-bold bg-green-400/10 px-4 py-1 rounded-full"><div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div> Operational</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium text-gray-300">Last Sync</span>
                <span className="text-white font-mono">{new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2 bg-white p-10 rounded-[40px] border border-[#D2D2D7] shadow-sm relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-4 text-[#1D1D1F]">Operational Summary</h2>
            <p className="text-[#1D1D1F] font-bold mb-8 max-w-md">Overview of current system health and order fulfillment status across all active regions.</p>
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
