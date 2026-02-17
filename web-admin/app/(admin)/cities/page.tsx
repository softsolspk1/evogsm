"use client";

import { useEffect, useState } from "react";
import { Plus, MapPin, Search, Loader2, Grid2X2 } from "lucide-react";

export default function CitiesPage() {
    const [cities, setCities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [newCityName, setNewCityName] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");

    const fetchCities = async () => {
        try {
            const res = await fetch("/api/cities");
            const data = await res.json();
            setCities(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to fetch cities");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCities();
    }, []);

    const handleAddCity = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCityName.trim()) return;

        setIsSaving(true);
        setError("");
        try {
            const res = await fetch("/api/cities", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newCityName }),
            });

            if (res.ok) {
                setNewCityName("");
                fetchCities();
            } else {
                const data = await res.json();
                setError(data.error || "Failed to add city");
            }
        } catch (err) {
            setError("Error connecting to server");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="p-10 max-w-6xl mx-auto">
            <header className="flex justify-between items-end mb-12">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-[#1D1D1F]">Cities</h1>
                    <p className="text-[#1D1D1F] mt-1 text-lg font-medium">Manage operational cities and regions</p>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-2xl border border-[#D2D2D7] shadow-sm">
                    <Search size={18} className="text-[#86868B]" />
                    <input
                        type="text"
                        placeholder="Search cities..."
                        className="bg-transparent outline-none text-sm font-medium text-[#1D1D1F] placeholder:text-[#424245] w-48"
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
                            <h2 className="text-xl font-bold">Add New City</h2>
                        </div>

                        <form onSubmit={handleAddCity} className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-[#1D1D1F] uppercase tracking-wider mb-2">City Name</label>
                                <input
                                    type="text"
                                    value={newCityName}
                                    onChange={(e) => setNewCityName(e.target.value)}
                                    placeholder="e.g. Karachi"
                                    className="w-full px-5 py-4 bg-white border border-[#D2D2D7] rounded-2xl focus:ring-2 focus:ring-[#0071E3] focus:border-transparent outline-none transition-all font-medium text-[#1D1D1F] placeholder:text-[#424245]"
                                />
                                {error && <p className="text-red-500 text-xs mt-2 font-medium">{error}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={isSaving || !newCityName}
                                className="w-full py-4 bg-[#0071E3] text-white rounded-2xl font-bold text-lg shadow-lg shadow-blue-100 hover:bg-[#0077ED] transition-all disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
                            >
                                {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
                                Add City
                            </button>
                        </form>
                    </div>
                </div>

                {/* List Side */}
                <div className="lg:col-span-2 space-y-4">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-white/50 rounded-[32px] border border-dashed border-[#D2D2D7]">
                            <Loader2 className="animate-spin text-[#0071E3] mb-4" size={40} />
                            <p className="text-[#86868B] font-medium">Loading cities...</p>
                        </div>
                    ) : (
                        cities.map((city) => (
                            <div key={city.id} className="group bg-white p-6 rounded-[24px] border border-[#D2D2D7] hover:border-[#0071E3] hover:shadow-xl transition-all duration-300 flex items-center justify-between">
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 bg-[#F5F5F7] rounded-2xl flex items-center justify-center text-[#86868B] group-hover:bg-[#0071E3]/10 group-hover:text-[#0071E3] transition-colors">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-black">{city.name}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Grid2X2 size={12} className="text-[#86868B]" />
                                            <p className="text-[#86868B] text-sm font-medium">
                                                {city._count?.areas || 0} Areas Assigned
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <button className="opacity-0 group-hover:opacity-100 px-4 py-2 text-[#0071E3] font-bold text-sm bg-[#0071E3]/5 rounded-xl transition-all">
                                    View Details
                                </button>
                            </div>
                        ))
                    )}

                    {!loading && cities.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 bg-white/50 rounded-[32px] border border-dashed border-[#D2D2D7]">
                            <MapPin className="text-[#D2D2D7] mb-4" size={48} />
                            <p className="text-[#86868B] font-medium text-lg">No cities found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
