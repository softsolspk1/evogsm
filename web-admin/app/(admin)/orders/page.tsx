"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Search, Filter, Plus, MapPin, Truck, Briefcase, Loader2 } from "lucide-react";

interface Order {
    id: string;
    patientName: string;
    patientPhone: string;
    patientCity: string;
    homeAddress: string;
    status: string;
    kam?: { name: string; email: string };
    distributor?: { name: string; email: string };
    createdAt: string;
}

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    cityId?: string;
}

export default function OrdersPage() {
    const { data: session, isPending } = useSession();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Filters
    const [filters, setFilters] = useState({
        city: "",
        distributorId: "",
        kamId: "",
        status: ""
    });

    // Form State
    const [newOrder, setNewOrder] = useState({
        patientName: "",
        patientPhone: "",
        patientCity: "",
        homeAddress: "",
        doctorPrescribe: "",
        deviceQuantity: "1",
        kamId: "",
        distributorId: "",
    });

    const [kams, setKams] = useState<User[]>([]);
    const [distributors, setDistributors] = useState<User[]>([]);
    const [cities, setCities] = useState<any[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (!isPending && !session) {
            router.push("/");
        } else if (!isPending && session) {
            fetchOrders();
            fetchUsers("KAM");
            fetchUsers("DISTRIBUTOR");
            fetchCities();
        }
    }, [session, isPending, filters]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const query = new URLSearchParams(filters).toString();
            const res = await fetch(`/api/orders?${query}`);
            if (res.ok) {
                const data = await res.json();
                setOrders(data);
            }
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async (role: string) => {
        try {
            const res = await fetch(`/api/admin/users?role=${role}`);
            if (res.ok) {
                const data = await res.json();
                if (role === "KAM") setKams(data);
                if (role === "DISTRIBUTOR") setDistributors(data);
            }
        } catch (error) {
            console.error(`Failed to fetch ${role}s:`, error);
        }
    };

    const fetchCities = async () => {
        try {
            const res = await fetch("/api/cities");
            if (res.ok) {
                const data = await res.json();
                setCities(data);
            }
        } catch (err) { }
    };

    const handleCreateOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        const userRole = (session?.user as any).role;
        if ((userRole === "admin" || userRole === "sub_admin") && !newOrder.kamId) {
            alert("Please select a KAM");
            setSubmitting(false);
            return;
        }
        if (!newOrder.distributorId) {
            alert("Please select a Distributor");
            setSubmitting(false);
            return;
        }

        try {
            const payload = { ...newOrder };
            if (userRole === "KAM") delete (payload as any).kamId;

            const res = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                setShowCreateModal(false);
                setNewOrder({
                    patientName: "",
                    patientPhone: "",
                    patientCity: "",
                    homeAddress: "",
                    doctorPrescribe: "",
                    deviceQuantity: "1",
                    kamId: "",
                    distributorId: "",
                });
                fetchOrders();
            } else {
                const err = await res.json();
                alert(err.error || "Failed to create order");
            }
        } catch (error) {
            console.error("Error creating order:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        if (!confirm(`Are you sure you want to mark this order as ${newStatus}?`)) return;
        try {
            const res = await fetch(`/api/orders/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
            if (res.ok) {
                fetchOrders();
            }
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    if (isPending) return <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-[#0071E3]" size={40} /></div>;

    const userRole = (session?.user as any)?.role?.toUpperCase();

    return (
        <div className="p-10 max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-[#1D1D1F]">Orders</h1>
                    <p className="text-[#86868B] mt-1 text-lg font-medium">Track and coordinate device logistics</p>
                </div>
                <div className="flex gap-4">
                    {(userRole === "ADMIN" || userRole === "SUB_ADMIN" || userRole === "KAM") && (
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="px-8 py-4 bg-[#0071E3] text-white rounded-2xl font-bold text-lg shadow-lg hover:bg-[#0077ED] transition-all flex items-center gap-2"
                        >
                            <Plus size={20} />
                            New Order
                        </button>
                    )}
                </div>
            </header>

            {/* Filters Bar */}
            <div className="bg-white p-6 rounded-[32px] border border-[#D2D2D7] shadow-sm mb-10 grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                <div>
                    <label className="block text-xs font-bold text-[#86868B] uppercase tracking-wider mb-2 flex items-center gap-2">
                        <MapPin size={14} /> City Filter
                    </label>
                    <select
                        value={filters.city}
                        onChange={e => setFilters({ ...filters, city: e.target.value })}
                        className="w-full px-4 py-3 bg-[#F5F5F7] rounded-xl font-bold text-[#1D1D1F] outline-none focus:ring-2 focus:ring-[#0071E3] appearance-none"
                    >
                        <option value="">All Cities</option>
                        {cities.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold text-[#86868B] uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Truck size={14} /> Distributor
                    </label>
                    <select
                        value={filters.distributorId}
                        onChange={e => setFilters({ ...filters, distributorId: e.target.value })}
                        className="w-full px-4 py-3 bg-[#F5F5F7] rounded-xl font-bold text-[#1D1D1F] outline-none focus:ring-2 focus:ring-[#0071E3] appearance-none"
                    >
                        <option value="">All Distributors</option>
                        {distributors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold text-[#86868B] uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Briefcase size={14} /> KAM
                    </label>
                    <select
                        value={filters.kamId}
                        onChange={e => setFilters({ ...filters, kamId: e.target.value })}
                        className="w-full px-4 py-3 bg-[#F5F5F7] rounded-xl font-bold text-[#1D1D1F] outline-none focus:ring-2 focus:ring-[#0071E3] appearance-none"
                    >
                        <option value="">All KAMs</option>
                        {kams.map(k => <option key={k.id} value={k.id}>{k.name}</option>)}
                    </select>
                </div>
                <button
                    onClick={() => setFilters({ city: "", distributorId: "", kamId: "", status: "" })}
                    className="py-3 px-6 bg-[#F5F5F7] hover:bg-[#E8E8ED] text-[#1D1D1F] font-bold rounded-xl transition-all"
                >
                    Reset Filters
                </button>
            </div>

            <div className="bg-white rounded-[40px] shadow-apple border border-[#D2D2D7] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#FAFAFA] border-b border-[#D2D2D7]">
                                <th className="px-8 py-5 text-[13px] font-bold text-[#86868B] uppercase tracking-widest">Order / Patient</th>
                                <th className="px-8 py-5 text-[13px] font-bold text-[#86868B] uppercase tracking-widest">Region</th>
                                <th className="px-8 py-5 text-[13px] font-bold text-[#86868B] uppercase tracking-widest">Stakeholders</th>
                                <th className="px-8 py-5 text-[13px] font-bold text-[#86868B] uppercase tracking-widest">Status</th>
                                <th className="px-8 py-5 text-[13px] font-bold text-[#86868B] uppercase tracking-widest text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F5F5F7]">
                            {loading ? (
                                <tr><td colSpan={5} className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-[#0071E3]" size={32} /></td></tr>
                            ) : orders.length === 0 ? (
                                <tr><td colSpan={5} className="p-20 text-center text-[#86868B] font-medium text-lg">No orders matching your filters.</td></tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order.id} className="group hover:bg-[#F5F5F7]/40 transition-colors">
                                        <td className="px-8 py-8">
                                            <div className="flex flex-col">
                                                <span className="text-black font-bold text-lg mb-1">{order.patientName}</span>
                                                <span className="text-[#86868B] text-sm font-medium tracking-tight">ID: {order.id.slice(-8).toUpperCase()} • {order.patientPhone}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8">
                                            <div className="flex items-center gap-2">
                                                <div className="p-2 bg-blue-50 text-[#0071E3] rounded-lg">
                                                    <MapPin size={16} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-black">{order.patientCity}</p>
                                                    <p className="text-xs text-[#86868B] font-medium truncate max-w-[150px]">{order.homeAddress}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-xs font-bold text-[#1D1D1F]">
                                                    <Briefcase size={12} className="text-[#86868B]" />
                                                    <span>KAM: {order.kam?.name || "Unassigned"}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs font-bold text-[#1D1D1F]">
                                                    <Truck size={12} className="text-[#86868B]" />
                                                    <span>Dist: {order.distributor?.name || "Direct"}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8">
                                            <span className={`inline-flex items-center px-4 py-1 rounded-full text-[11px] font-black uppercase tracking-widest
                                                ${order.status === "PENDING" ? "bg-yellow-100 text-yellow-700 border border-yellow-200" :
                                                    order.status === "CONFIRMED" ? "bg-blue-100 text-blue-700 border border-blue-200" :
                                                        order.status === "COMPLETED" ? "bg-green-100 text-green-700 border border-green-200" : "bg-gray-100 text-gray-700"}
                                            `}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-8 text-right">
                                            {order.status === "PENDING" && userRole === "ADMIN" && (
                                                <button
                                                    onClick={() => handleStatusUpdate(order.id, "CONFIRMED")}
                                                    className="px-6 py-2 bg-[#0071E3] text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95"
                                                >
                                                    Approve
                                                </button>
                                            )}
                                            {order.status === "CONFIRMED" && userRole === "KAM" && (
                                                <button
                                                    onClick={() => router.push(`/installations/${order.id}`)}
                                                    className="px-6 py-2 bg-green-600 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95"
                                                >
                                                    Install
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal - Modernized */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-xl flex items-center justify-center z-50 p-6">
                    <div className="bg-white p-10 rounded-[40px] w-full max-w-xl shadow-2xl border border-white/20 animate-in fade-in slide-in-from-bottom-8 duration-500">
                        <h2 className="text-3xl font-bold mb-2 text-[#1D1D1F]">Initialize Order</h2>
                        <p className="text-[#86868B] font-medium mb-8">Deploy device for new clinical stability journey.</p>

                        <form onSubmit={handleCreateOrder} className="space-y-5">
                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-xs font-bold text-[#1D1D1F] uppercase tracking-wider mb-2">Patient Name</label>
                                    <input
                                        placeholder="Patient Name"
                                        className="w-full px-5 py-4 bg-[#F5F5F7] rounded-[20px] text-[#1D1D1F] placeholder:text-[#86868B] outline-none focus:ring-2 focus:ring-[#0071E3] font-medium"
                                        value={newOrder.patientName}
                                        onChange={e => setNewOrder({ ...newOrder, patientName: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-[#1D1D1F] uppercase tracking-wider mb-2">Phone Number</label>
                                    <input
                                        placeholder="Phone Number"
                                        className="w-full px-5 py-4 bg-[#F5F5F7] rounded-[20px] text-[#1D1D1F] placeholder:text-[#86868B] outline-none focus:ring-2 focus:ring-[#0071E3] font-medium"
                                        value={newOrder.patientPhone}
                                        onChange={e => setNewOrder({ ...newOrder, patientPhone: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-[#1D1D1F] uppercase tracking-wider mb-2">City</label>
                                <select
                                    className="w-full px-5 py-4 bg-[#F5F5F7] rounded-[20px] text-[#1D1D1F] outline-none focus:ring-2 focus:ring-[#0071E3] font-bold appearance-none"
                                    value={newOrder.patientCity}
                                    onChange={e => {
                                        const selectedCity = e.target.value;
                                        setNewOrder({ ...newOrder, patientCity: selectedCity });

                                        // Auto-select KAM and Distributor based on city
                                        if (selectedCity) {
                                            const cityKAMs = kams.filter(k => k.cityId === cities.find(c => c.name === selectedCity)?.id);
                                            const cityDistributors = distributors.filter(d => d.cityId === cities.find(c => c.name === selectedCity)?.id);

                                            if (cityKAMs.length > 0) {
                                                setNewOrder(prev => ({ ...prev, kamId: cityKAMs[0].id }));
                                            }
                                            if (cityDistributors.length > 0) {
                                                setNewOrder(prev => ({ ...prev, distributorId: cityDistributors[0].id }));
                                            }
                                        }
                                    }}
                                    required
                                >
                                    <option value="">City</option>
                                    {cities.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-[#1D1D1F] uppercase tracking-wider mb-2">Doctor Prescribe</label>
                                <input
                                    placeholder="Doctor Prescribe"
                                    className="w-full px-5 py-4 bg-[#F5F5F7] rounded-[20px] text-[#1D1D1F] placeholder:text-[#86868B] outline-none focus:ring-2 focus:ring-[#0071E3] font-medium"
                                    value={newOrder.doctorPrescribe}
                                    onChange={e => setNewOrder({ ...newOrder, doctorPrescribe: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-[#1D1D1F] uppercase tracking-wider mb-2">Device Quantity</label>
                                <select
                                    className="w-full px-5 py-4 bg-[#F5F5F7] rounded-[20px] text-[#1D1D1F] outline-none focus:ring-2 focus:ring-[#0071E3] font-bold appearance-none"
                                    value={newOrder.deviceQuantity}
                                    onChange={e => setNewOrder({ ...newOrder, deviceQuantity: e.target.value })}
                                    required
                                >
                                    <option value="">No. of Device Order</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-[#1D1D1F] uppercase tracking-wider mb-2">Home Delivery Address</label>
                                <textarea
                                    placeholder="Home Delivery Address"
                                    className="w-full px-5 py-4 bg-[#F5F5F7] rounded-[20px] text-[#1D1D1F] placeholder:text-[#86868B] outline-none focus:ring-2 focus:ring-[#0071E3] font-medium min-h-[100px]"
                                    value={newOrder.homeAddress}
                                    onChange={e => setNewOrder({ ...newOrder, homeAddress: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-5">
                                <select
                                    className="w-full px-5 py-4 bg-[#F5F5F7] rounded-[20px] text-[#1D1D1F] outline-none focus:ring-2 focus:ring-[#0071E3] font-bold appearance-none"
                                    value={newOrder.distributorId}
                                    onChange={e => setNewOrder({ ...newOrder, distributorId: e.target.value })}
                                    required
                                    disabled={!newOrder.patientCity}
                                >
                                    <option value="">Distributor (Auto)</option>
                                    {distributors
                                        .filter(d => !newOrder.patientCity || d.cityId === cities.find(c => c.name === newOrder.patientCity)?.id)
                                        .map(d => (
                                            <option key={d.id} value={d.id}>{d.name}</option>
                                        ))}
                                </select>

                                {(userRole === "ADMIN" || userRole === "SUB_ADMIN") && (
                                    <select
                                        className="w-full px-5 py-4 bg-[#F5F5F7] rounded-[20px] text-[#1D1D1F] outline-none focus:ring-2 focus:ring-[#0071E3] font-bold appearance-none"
                                        value={newOrder.kamId}
                                        onChange={e => setNewOrder({ ...newOrder, kamId: e.target.value })}
                                        required
                                        disabled={!newOrder.patientCity}
                                    >
                                        <option value="">KAM Lead (Auto)</option>
                                        {kams
                                            .filter(k => !newOrder.patientCity || k.cityId === cities.find(c => c.name === newOrder.patientCity)?.id)
                                            .map(k => (
                                                <option key={k.id} value={k.id}>{k.name}</option>
                                            ))}
                                    </select>
                                )}
                            </div>

                            <div className="flex flex-col gap-3 mt-8">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full px-5 py-4 bg-[#0071E3] text-white font-bold text-lg rounded-[20px] hover:bg-[#0077ED] transition-all active:scale-[0.98] shadow-lg disabled:opacity-50"
                                >
                                    {submitting ? "Processing..." : "Create Order"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="w-full py-4 text-[#0071E3] font-bold text-lg hover:underline"
                                >
                                    Dismiss
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
