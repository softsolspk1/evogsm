"use client";

import { useEffect, useState } from "react";
import { Loader2, TrendingUp, TrendingDown, MapPin, Truck, Briefcase, FileText, Download } from "lucide-react";

export default function ReportsPage() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

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
        fetchStats();
    }, []);

    if (loading) return <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-[#0071E3]" size={40} /></div>;

    const MetricCard = ({ label, value, subtext, trend }: any) => (
        <div className="bg-white p-8 rounded-[32px] border border-[#D2D2D7] shadow-sm relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-2 h-full bg-[#0071E3]/10`}></div>
            <p className="text-[#1D1D1F] text-xs font-black uppercase tracking-widest mb-1">{label}</p>
            <h3 className="text-4xl font-bold tracking-tight text-[#1D1D1F]">{value}</h3>
            <div className="flex items-center gap-2 mt-4">
                {trend === "up" ? <TrendingUp size={16} className="text-green-500" /> : <TrendingDown size={16} className="text-red-500" />}
                <span className={`text-sm font-bold ${trend === "up" ? "text-green-600" : "text-red-600"}`}>{subtext}</span>
            </div>
        </div>
    );

    return (
        <div className="p-10 max-w-7xl mx-auto pb-24">
            <header className="flex justify-between items-end mb-16">
                <div>
                    <h1 className="text-5xl font-black tracking-tight text-[#1D1D1F]">Insights</h1>
                    <p className="text-[#1D1D1F] mt-2 text-xl font-medium">Platform-wide operational analytics</p>
                </div>
                <button className="flex items-center gap-3 px-6 py-4 bg-[#F5F5F7] hover:bg-[#E8E8ED] text-[#1D1D1F] rounded-2xl font-bold transition-all">
                    <Download size={20} />
                    Export PDF
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <MetricCard label="Conversion Rate" value="84%" subtext="+2.4% vs last month" trend="up" />
                <MetricCard label="Avg Fulfillment" value="2.8 days" subtext="-0.5 days faster" trend="up" />
                <MetricCard label="Region Coverage" value="14 Cities" subtext="New city added: Multan" trend="up" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* City Breakdown */}
                <div className="bg-white p-10 rounded-[40px] border border-[#D2D2D7] shadow-sm">
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-2xl font-bold flex items-center gap-3 text-[#1D1D1F]">
                            <MapPin className="text-[#0071E3]" /> City Wise Distribution
                        </h2>
                    </div>
                    <div className="space-y-6">
                        {(stats?.cityReports || []).map((report: any) => (
                            <div key={report.patientCity} className="group cursor-default">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-bold text-lg">{report.patientCity}</span>
                                    <span className="text-[#1D1D1F] font-bold">{report._count._all} Orders</span>
                                </div>
                                <div className="w-full h-3 bg-[#F5F5F7] rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-[#0071E3] transition-all duration-1000 group-hover:bg-[#005AB3]"
                                        style={{ width: `${Math.min((report._count._all / 100) * 100, 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Distributor & KAM Summary */}
                <div className="space-y-10">
                    <div className="bg-[#1D1D1F] p-10 rounded-[40px] text-white">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                            <Briefcase className="text-[#0071E3]" /> Top KAM Performance
                        </h2>
                        <div className="space-y-4">
                            {(stats?.kamPerformance || []).slice().sort((a: any, b: any) => b._count.orders - a._count.orders).map((kam: any) => (
                                <div key={kam.id} className="flex items-center justify-between p-5 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors">
                                    <span className="font-bold">{kam.name}</span>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs text-[#D2D2D7] font-bold uppercase">Converted</span>
                                        <span className="text-[#0071E3] font-black text-xl">{kam._count.orders}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white p-10 rounded-[40px] border border-[#D2D2D7] shadow-sm">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-[#1D1D1F]">
                            <Truck className="text-green-500" /> Distributor Coverage
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-6 bg-[#F5F5F7] rounded-3xl">
                                <p className="text-xs font-bold text-[#1D1D1F] uppercase mb-1">Total Network</p>
                                <p className="text-3xl font-black text-black">24</p>
                            </div>
                            <div className="p-6 bg-[#F5F5F7] rounded-3xl">
                                <p className="text-xs font-bold text-[#1D1D1F] uppercase mb-1">Avg Lead Time</p>
                                <p className="text-3xl font-black text-black">4.2h</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
