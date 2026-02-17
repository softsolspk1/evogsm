"use client";

import { useEffect, useState } from "react";
import { Plus, Truck, Search, Loader2, MapPin, Grid2X2, Mail, ShieldCheck } from "lucide-react";

export default function DistributorsPage() {
    const [distributors, setDistributors] = useState<any[]>([]);
    const [cities, setCities] = useState<any[]>([]);
    const [areas, setAreas] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        employeeCode: "",
        cityId: "",
        areaId: "",
    });

    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");

    const fetchData = async () => {
        try {
            const [usersRes, citiesRes, areasRes] = await Promise.all([
                fetch("/api/admin/users?role=DISTRIBUTOR"),
                fetch("/api/cities"),
                fetch("/api/areas")
            ]);
            const usersData = await usersRes.json();
            const citiesData = await citiesRes.json();
            const areasData = await areasRes.json();

            setDistributors(Array.isArray(usersData) ? usersData : []);
            setCities(citiesData);
            setAreas(areasData);
        } catch (err) {
            console.error("Failed to fetch data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddDistributor = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.password || !formData.cityId) return;

        setIsSaving(true);
        setError("");
        try {
            const res = await fetch("/api/admin/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    role: "DISTRIBUTOR",
                }),
            });

            if (res.ok) {
                setFormData({ name: "", email: "", password: "", employeeCode: "", cityId: "", areaId: "" });
                fetchData();
            } else {
                const data = await res.json();
                setError(data.error || "Failed to create distributor");
            }
        } catch (err) {
            setError("Error connecting to server");
        } finally {
            setIsSaving(false);
        }
    };

    const filteredAreas = areas.filter(a => a.cityId === formData.cityId);

    return (
        <div className="p-10 max-w-7xl mx-auto">
            <header className="flex justify-between items-end mb-12">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-[#1D1D1F]">Distributors</h1>
                    <p className="text-[#86868B] mt-1 text-lg font-medium">Onboard and manage logistics partners</p>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-2xl border border-[#D2D2D7] shadow-sm">
                    <Search size={18} className="text-[#86868B]" />
                    <input
                        type="text"
                        placeholder="Search distributors..."
                        className="bg-transparent outline-none text-sm font-medium text-[#1D1D1F] placeholder:text-[#86868B] w-48"
                    />
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Form Side */}
                <div className="lg:col-span-1">
                    <div className="glass p-8 rounded-[32px] shadow-apple border border-white/40 sticky top-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-[#0071E3]/10 rounded-xl">
                                <Plus size={20} className="text-[#0071E3]" />
                            </div>
                            <h2 className="text-xl font-bold">New Distributor</h2>
                        </div>

                        <form onSubmit={handleAddDistributor} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-[#86868B] uppercase tracking-wider mb-2">Full Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-5 py-3 bg-white border border-[#D2D2D7] rounded-2xl focus:ring-2 focus:ring-[#0071E3] focus:border-transparent outline-none transition-all font-medium text-[#1D1D1F]"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-[#86868B] uppercase tracking-wider mb-2">Email</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-5 py-3 bg-white border border-[#D2D2D7] rounded-2xl focus:ring-2 focus:ring-[#0071E3] outline-none font-medium text-[#1D1D1F]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-[#86868B] uppercase tracking-wider mb-2">Employee Code</label>
                                    <input
                                        type="text"
                                        value={formData.employeeCode}
                                        onChange={(e) => setFormData({ ...formData, employeeCode: e.target.value })}
                                        className="w-full px-5 py-3 bg-white border border-[#D2D2D7] rounded-2xl focus:ring-2 focus:ring-[#0071E3] outline-none font-medium text-[#1D1D1F]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-[#86868B] uppercase tracking-wider mb-2">Password</label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full px-5 py-3 bg-white border border-[#D2D2D7] rounded-2xl focus:ring-2 focus:ring-[#0071E3] outline-none font-medium text-[#1D1D1F]"
                                />
                            </div>

                            <div className="p-4 bg-[#F5F5F7] rounded-2xl space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-[#86868B] uppercase tracking-wider mb-2">Assign City</label>
                                    <select
                                        value={formData.cityId}
                                        onChange={(e) => setFormData({ ...formData, cityId: e.target.value, areaId: "" })}
                                        className="w-full px-5 py-3 bg-white border border-[#D2D2D7] rounded-xl focus:ring-2 focus:ring-[#0071E3] outline-none font-bold text-[#1D1D1F]"
                                    >
                                        <option value="">Select City</option>
                                        {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-[#86868B] uppercase tracking-wider mb-2">Assign Area (Optional)</label>
                                    <select
                                        value={formData.areaId}
                                        onChange={(e) => setFormData({ ...formData, areaId: e.target.value })}
                                        disabled={!formData.cityId}
                                        className="w-full px-5 py-3 bg-white border border-[#D2D2D7] rounded-xl focus:ring-2 focus:ring-[#0071E3] outline-none font-bold disabled:opacity-50 text-[#1D1D1F]"
                                    >
                                        <option value="">Select Area</option>
                                        {filteredAreas.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            {error && <p className="text-red-500 text-xs font-medium">{error}</p>}

                            <button
                                type="submit"
                                disabled={isSaving || !formData.cityId}
                                className="w-full py-4 bg-[#0071E3] text-white rounded-2xl font-bold text-lg shadow-lg hover:bg-[#0077ED] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
                                Add Distributor
                            </button>
                        </form>
                    </div>
                </div>

                {/* List Side */}
                <div className="lg:col-span-2 space-y-4">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-white/50 rounded-[32px] border border-dashed border-[#D2D2D7]">
                            <Loader2 className="animate-spin text-[#0071E3] mb-4" size={40} />
                            <p className="text-[#86868B] font-medium">Loading distributors...</p>
                        </div>
                    ) : (
                        distributors.map((dist) => (
                            <div key={dist.id} className="bg-white p-6 rounded-[24px] border border-[#D2D2D7] hover:shadow-xl transition-all duration-300">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-[#0071E3]/10 text-[#0071E3] rounded-full flex items-center justify-center font-bold">
                                            {dist.name?.[0] || 'D'}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-black">{dist.name}</h3>
                                            <div className="flex items-center gap-2 text-[#86868B] text-xs font-semibold">
                                                <Mail size={12} /> {dist.email}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-bold uppercase tracking-wider rounded-full border border-green-100">
                                            Active
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4 border-t border-[#F5F5F7] pt-4">
                                    <div className="flex items-center gap-2">
                                        <MapPin size={14} className="text-[#86868B]" />
                                        <span className="text-sm font-bold">{dist.city?.name || "No City"}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Grid2X2 size={14} className="text-[#86868B]" />
                                        <span className="text-sm font-bold">{dist.area?.name || "All Areas"}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck size={14} className="text-[#86868B]" />
                                        <span className="text-xs font-bold text-[#86868B]">{dist.employeeCode || "N/A"}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}

                    {!loading && distributors.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 bg-white/50 rounded-[32px] border border-dashed border-[#D2D2D7]">
                            <Truck className="text-[#D2D2D7] mb-4" size={48} />
                            <p className="text-[#86868B] font-medium text-lg">No distributors found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
