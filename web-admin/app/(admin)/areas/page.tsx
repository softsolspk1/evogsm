"use client";

import { useEffect, useState } from "react";
import { Plus, Grid2X2, Search, Loader2, MapPin } from "lucide-react";

export default function AreasPage() {
    const [areas, setAreas] = useState<any[]>([]);
    const [cities, setCities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [cityNameIdFilter, setCityNameIdFilter] = useState("all");

    const [newArea, setNewArea] = useState({ name: "", cityId: "" });
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");

    const fetchData = async () => {
        try {
            const [citiesRes, areasRes] = await Promise.all([
                fetch("/api/cities"),
                fetch("/api/areas")
            ]);
            const citiesData = await citiesRes.json();
            const areasData = await areasRes.json();
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

    const handleAddArea = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newArea.name.trim() || !newArea.cityId) return;

        setIsSaving(true);
        setError("");
        try {
            const res = await fetch("/api/areas", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newArea),
            });

            if (res.ok) {
                setNewArea({ name: "", cityId: newArea.cityId });
                fetchData();
            } else {
                const data = await res.json();
                setError(data.error || "Failed to add area");
            }
        } catch (err) {
            setError("Error connecting to server");
        } finally {
            setIsSaving(false);
        }
    };

    const filteredAreas = cityNameIdFilter === "all"
        ? areas
        : areas.filter(a => a.cityId === cityNameIdFilter);

    return (
        <div className="p-10 max-w-6xl mx-auto">
            <header className="flex justify-between items-end mb-12">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-[#1D1D1F]">Areas</h1>
                    <p className="text-[#1D1D1F] mt-1 text-lg font-medium">Assign areas under operational cities</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-2xl border border-[#D2D2D7] shadow-sm">
                        <Search size={18} className="text-[#86868B]" />
                        <select
                            value={cityNameIdFilter}
                            onChange={(e) => setCityNameIdFilter(e.target.value)}
                            className="bg-transparent outline-none text-sm font-bold text-[#1D1D1F] w-48 appearance-none"
                        >
                            <option value="all">All Cities</option>
                            {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
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
                            <h2 className="text-xl font-bold">Add New Area</h2>
                        </div>

                        <form onSubmit={handleAddArea} className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-[#1D1D1F] uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <select
                                        value={newArea.cityId}
                                        onChange={(e) => setNewArea({ ...newArea, cityId: e.target.value })}
                                        className="w-full px-5 py-4 bg-white border border-[#D2D2D7] rounded-2xl focus:ring-2 focus:ring-[#0071E3] focus:border-transparent outline-none transition-all font-bold text-[#1D1D1F] appearance-none"
                                    >
                                        <option value="">Select City</option>
                                        {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-[#1D1D1F] uppercase tracking-wider mb-2">Area Name</label>
                                <input
                                    type="text"
                                    value={newArea.name}
                                    onChange={(e) => setNewArea({ ...newArea, name: e.target.value })}
                                    placeholder="e.g. Saddar"
                                    className="w-full px-5 py-4 bg-white border border-[#D2D2D7] rounded-2xl focus:ring-2 focus:ring-[#0071E3] focus:border-transparent outline-none transition-all font-medium text-[#1D1D1F] placeholder:text-[#86868B]"
                                />
                                {error && <p className="text-red-500 text-xs mt-2 font-medium">{error}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={isSaving || !newArea.name || !newArea.cityId}
                                className="w-full py-4 bg-[#0071E3] text-white rounded-2xl font-bold text-lg shadow-lg shadow-blue-100 hover:bg-[#0077ED] transition-all disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
                            >
                                {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
                                Add Area
                            </button>
                        </form>
                    </div>
                </div>

                {/* List Side */}
                <div className="lg:col-span-2 space-y-4">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-white/50 rounded-[32px] border border-dashed border-[#D2D2D7]">
                            <Loader2 className="animate-spin text-[#0071E3] mb-4" size={40} />
                            <p className="text-[#86868B] font-medium">Loading areas...</p>
                        </div>
                    ) : (
                        filteredAreas.map((area) => (
                            <div key={area.id} className="group bg-white p-6 rounded-[24px] border border-[#D2D2D7] hover:border-[#0071E3] hover:shadow-xl transition-all duration-300 flex items-center justify-between">
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 bg-[#F5F5F7] rounded-2xl flex items-center justify-center text-[#86868B] group-hover:bg-[#0071E3]/10 group-hover:text-[#0071E3] transition-colors">
                                        <Grid2X2 size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-black">{area.name}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <MapPin size={12} className="text-pharmevo-blue" />
                                            <p className="text-[#86868B] text-sm font-bold">{area.city?.name}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}

                    {!loading && filteredAreas.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 bg-white/50 rounded-[32px] border border-dashed border-[#D2D2D7]">
                            <Grid2X2 className="text-[#D2D2D7] mb-4" size={48} />
                            <p className="text-[#1D1D1F] font-medium mb-8">Create new operational zone.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
