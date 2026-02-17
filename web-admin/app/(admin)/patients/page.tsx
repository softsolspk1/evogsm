"use client";

import { useEffect, useState } from "react";
import { Loader2, MapPin, Phone, User, Home } from "lucide-react";

interface Patient {
    id: string;
    patientName: string;
    patientPhone: string;
    patientCity: string;
    homeAddress: string;
    createdAt: string;
}

interface City {
    id: string;
    name: string;
}

interface Area {
    id: string;
    name: string;
    cityId: string;
}

export default function PatientsPage() {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [areas, setAreas] = useState<Area[]>([]);
    const [loading, setLoading] = useState(true);
    const [cityFilter, setCityFilter] = useState("");
    const [areaFilter, setAreaFilter] = useState("");

    useEffect(() => {
        fetchPatients();
        fetchCities();
        fetchAreas();
    }, []);

    const fetchPatients = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/orders");
            if (res.ok) {
                const orders = await res.json();
                // Extract unique patients from orders
                const uniquePatients = orders.reduce((acc: Patient[], order: any) => {
                    const exists = acc.find(p => p.patientPhone === order.patientPhone);
                    if (!exists) {
                        acc.push({
                            id: order.id,
                            patientName: order.patientName,
                            patientPhone: order.patientPhone,
                            patientCity: order.patientCity,
                            homeAddress: order.homeAddress,
                            createdAt: order.createdAt,
                        });
                    }
                    return acc;
                }, []);
                setPatients(uniquePatients);
            }
        } catch (error) {
            console.error("Failed to fetch patients:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCities = async () => {
        try {
            const res = await fetch("/api/cities");
            if (res.ok) {
                const data = await res.json();
                setCities(data);
            }
        } catch (error) {
            console.error("Failed to fetch cities:", error);
        }
    };

    const fetchAreas = async () => {
        try {
            const res = await fetch("/api/areas");
            if (res.ok) {
                const data = await res.json();
                setAreas(data);
            }
        } catch (error) {
            console.error("Failed to fetch areas:", error);
        }
    };

    const filteredPatients = patients.filter(patient => {
        if (cityFilter && patient.patientCity !== cityFilter) return false;
        // Note: We don't have area info in orders, so area filter won't work unless we add it
        return true;
    });

    if (loading) return <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-[#0071E3]" size={40} /></div>;

    return (
        <div className="p-10 max-w-7xl mx-auto">
            <header className="flex justify-between items-end mb-10">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-[#1D1D1F]">Patients</h1>
                    <p className="text-[#86868B] mt-1 text-lg font-medium">Patient records and contact information</p>
                </div>
            </header>

            {/* Filters */}
            <div className="bg-white p-6 rounded-[32px] shadow-apple border border-[#D2D2D7] mb-8 grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                    <label className="block text-xs font-bold text-[#86868B] uppercase tracking-wider mb-2 flex items-center gap-2">
                        <MapPin size={14} /> City
                    </label>
                    <select
                        value={cityFilter}
                        onChange={e => setCityFilter(e.target.value)}
                        className="w-full px-4 py-3 bg-[#F5F5F7] rounded-xl font-bold text-[#1D1D1F] outline-none focus:ring-2 focus:ring-[#0071E3] appearance-none"
                    >
                        <option value="">All Cities</option>
                        {cities.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold text-[#86868B] uppercase tracking-wider mb-2 flex items-center gap-2">
                        <MapPin size={14} /> Area
                    </label>
                    <select
                        value={areaFilter}
                        onChange={e => setAreaFilter(e.target.value)}
                        className="w-full px-4 py-3 bg-[#F5F5F7] rounded-xl font-bold text-[#1D1D1F] outline-none focus:ring-2 focus:ring-[#0071E3] appearance-none"
                        disabled
                    >
                        <option value="">All Areas</option>
                        {areas.filter(a => !cityFilter || a.cityId === cities.find(c => c.name === cityFilter)?.id).map(a => <option key={a.id} value={a.name}>{a.name}</option>)}
                    </select>
                </div>
                <button
                    onClick={() => { setCityFilter(""); setAreaFilter(""); }}
                    className="py-3 px-6 bg-[#F5F5F7] hover:bg-[#E8E8ED] text-[#1D1D1F] font-bold rounded-xl transition-all mt-auto"
                >
                    Reset Filters
                </button>
            </div>

            {/* Patients Table */}
            <div className="bg-white rounded-[40px] shadow-apple border border-[#D2D2D7] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#FAFAFA] border-b border-[#D2D2D7]">
                                <th className="px-8 py-5 text-[13px] font-bold text-[#86868B] uppercase tracking-widest">Patient</th>
                                <th className="px-8 py-5 text-[13px] font-bold text-[#86868B] uppercase tracking-widest">Contact</th>
                                <th className="px-8 py-5 text-[13px] font-bold text-[#86868B] uppercase tracking-widest">City</th>
                                <th className="px-8 py-5 text-[13px] font-bold text-[#86868B] uppercase tracking-widest">Address</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F5F5F7]">
                            {filteredPatients.length === 0 ? (
                                <tr><td colSpan={4} className="p-20 text-center text-[#86868B] font-medium text-lg">No patients found.</td></tr>
                            ) : (
                                filteredPatients.map((patient) => (
                                    <tr key={patient.id} className="group hover:bg-[#F5F5F7]/40 transition-colors">
                                        <td className="px-8 py-8">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-blue-50 text-[#0071E3] rounded-lg">
                                                    <User size={20} />
                                                </div>
                                                <div>
                                                    <span className="text-black font-bold text-lg">{patient.patientName}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8">
                                            <div className="flex items-center gap-2">
                                                <Phone size={16} className="text-[#86868B]" />
                                                <span className="text-[#1D1D1F] font-medium">{patient.patientPhone}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8">
                                            <div className="flex items-center gap-2">
                                                <MapPin size={16} className="text-[#86868B]" />
                                                <span className="text-[#1D1D1F] font-medium">{patient.patientCity}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8">
                                            <div className="flex items-center gap-2">
                                                <Home size={16} className="text-[#86868B]" />
                                                <span className="text-[#1D1D1F] font-medium text-sm">{patient.homeAddress}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
