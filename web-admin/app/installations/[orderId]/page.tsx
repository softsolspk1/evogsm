"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter, useParams } from "next/navigation";

export default function PostAdminForm() {
    const { data: session, isPending } = useSession();
    const { orderId } = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [order, setOrder] = useState<any>(null);

    const [form, setForm] = useState({
        region: "",
        city: "",
        area: "",
        referredBy: "",
        referralEmployeeCode: "",
        referralTeam: "",
        doctorName: "",
        doctorCode: "000000",
        distributorName: "",
        patientArea: "",
        sensorInstalledBy: "",
        visitDate: new Date().toISOString().split('T')[0],
        visitTime: "",
        numDevices: "1",
        patientEmail: "",
        patientWhatsApp: "",
        activationDate: "",
        comments: "",
        serialNumber: "",
        kamReminder: false,
    });

    useEffect(() => {
        if (!isPending && !session) {
            router.push("/");
        } else if (!isPending && session) {
            fetchOrder();
        }
    }, [session, isPending, orderId]);

    const fetchOrder = async () => {
        try {
            // We can use the orders API or create a specific one.
            // For now, I'll fetch all and filter or assume we need a GET by ID.
            // I'll implementation a simple GET /api/orders?id=... logic or similar.
            const res = await fetch("/api/orders");
            const data = await res.json();
            const target = data.find((o: any) => o.id === orderId);
            if (target) {
                setOrder(target);
                setForm(prev => ({
                    ...prev,
                    distributorName: target.distributor?.name || "",
                    patientEmail: target.patientPhone + "@placeholder.com", // Example
                }));
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch("/api/installations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, orderId }),
            });

            if (res.ok) {
                alert("Journey Completed Successfully!");
                router.push("/orders");
            } else {
                const err = await res.json();
                alert(err.error || "Submission failed");
            }
        } catch (error) {
            alert("Error submitting form");
        } finally {
            setSubmitting(false);
        }
    };

    if (isPending || loading) return <div className="p-8 text-center uppercase tracking-widest">Loading Journey Form...</div>;
    if (!order) return <div className="p-8 text-center">Order not found.</div>;

    return (
        <div className="min-h-screen bg-[#F5F5F7] py-12 px-6">
            <div className="max-w-3xl mx-auto bg-white rounded-[32px] p-10 shadow-xl border border-[#D2D2D7]">
                <header className="mb-10 text-center">
                    <h1 className="text-3xl font-bold mb-2">Post Administration Form</h1>
                    <p className="text-[#86868B] font-medium">Complete the installation journey for {order.patientName}</p>
                </header>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-[#86868B] uppercase ml-1">Region</label>
                        <input required value={form.region} onChange={e => setForm({ ...form, region: e.target.value })} className="w-full px-4 py-3 bg-[#F5F5F7] rounded-xl outline-none" placeholder="e.g. South" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-[#86868B] uppercase ml-1">City (Pakistan)</label>
                        <select required value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className="w-full px-4 py-3 bg-[#F5F5F7] rounded-xl outline-none">
                            <option value="">Select City</option>
                            <option value="Karachi">Karachi</option>
                            <option value="Lahore">Lahore</option>
                            <option value="Islamabad">Islamabad</option>
                            <option value="Peshawar">Peshawar</option>
                            <option value="Quetta">Quetta</option>
                            <option value="Faisalabad">Faisalabad</option>
                            <option value="Multan">Multan</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-[#86868B] uppercase ml-1">Area</label>
                        <input required value={form.area} onChange={e => setForm({ ...form, area: e.target.value })} className="w-full px-4 py-3 bg-[#F5F5F7] rounded-xl outline-none" placeholder="Specific Area" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-[#86868B] uppercase ml-1">Referred By</label>
                        <input value={form.referredBy} onChange={e => setForm({ ...form, referredBy: e.target.value })} className="w-full px-4 py-3 bg-[#F5F5F7] rounded-xl outline-none" placeholder="SM/RTL Name" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-[#86868B] uppercase ml-1">Doctor Name</label>
                        <input required value={form.doctorName} onChange={e => setForm({ ...form, doctorName: e.target.value })} className="w-full px-4 py-3 bg-[#F5F5F7] rounded-xl outline-none" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-[#86868B] uppercase ml-1">CGM Serial Number</label>
                        <input required value={form.serialNumber} onChange={e => setForm({ ...form, serialNumber: e.target.value })} className="w-full px-4 py-3 bg-[#F5F5F7] rounded-xl outline-none" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-[#86868B] uppercase ml-1">Visit Date</label>
                        <input type="date" required value={form.visitDate} onChange={e => setForm({ ...form, visitDate: e.target.value })} className="w-full px-4 py-3 bg-[#F5F5F7] rounded-xl outline-none" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-[#86868B] uppercase ml-1">Number of Devices</label>
                        <input type="number" required value={form.numDevices} onChange={e => setForm({ ...form, numDevices: e.target.value })} className="w-full px-4 py-3 bg-[#F5F5F7] rounded-xl outline-none" />
                    </div>

                    <div className="md:col-span-2 space-y-2">
                        <label className="text-xs font-bold text-[#86868B] uppercase ml-1">Comments/Feedback</label>
                        <textarea value={form.comments} onChange={e => setForm({ ...form, comments: e.target.value })} className="w-full px-4 py-3 bg-[#F5F5F7] rounded-xl outline-none h-24" />
                    </div>

                    <div className="md:col-span-2 mt-6">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full py-4 bg-[#0071E3] text-white font-bold rounded-2xl hover:bg-[#0077ED] transition-all disabled:opacity-50"
                        >
                            {submitting ? "Submitting Journey..." : "Complete Journey & Mark Installation"}
                        </button>
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="w-full py-4 text-[#86868B] font-medium mt-2 hover:underline"
                        >
                            Back
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
