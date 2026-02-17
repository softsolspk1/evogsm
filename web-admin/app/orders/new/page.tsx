"use client";

import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function NewOrderPage() {
    const { data: session, isPending } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        patientName: "",
        patientPhone: "",
        patientCity: "",
        homeAddress: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    subAdminId: session?.user.id,
                }),
            });
            if (res.ok) {
                router.push("/orders");
            } else {
                alert("Failed to create order");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    if (isPending) return <div>Loading...</div>;

    return (
        <div className="min-h-screen p-8 bg-apple-bg dark:bg-black">
            <header className="max-w-2xl mx-auto mb-12">
                <button onClick={() => router.back()} className="flex items-center gap-2 text-apple-gray hover:text-black mb-6 transition-all">
                    <ArrowLeft size={20} /> Back to Orders
                </button>
                <h1 className="text-4xl font-bold tracking-tight">Create New Order</h1>
                <p className="text-apple-gray mt-1">Fill in the patient details to place a CGM requirement</p>
            </header>

            <div className="max-w-2xl mx-auto glass p-10 rounded-[40px] shadow-apple">
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold border-b border-apple-gray/10 pb-2">Patient Information</h2>

                        <div className="space-y-2">
                            <label className="text-sm font-medium px-1 underline decoration-pharmevo-blue decoration-2 underline-offset-4">Patient Name</label>
                            <Input
                                placeholder="Full Name"
                                value={formData.patientName}
                                onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                                required
                                className="bg-white/50"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium px-1">Phone Number</label>
                            <Input
                                placeholder="03xx-xxxxxxx"
                                value={formData.patientPhone}
                                onChange={(e) => setFormData({ ...formData, patientPhone: e.target.value })}
                                required
                                className="bg-white/50"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-lg font-bold border-b border-apple-gray/10 pb-2">Location Details</h2>

                        <div className="space-y-2">
                            <label className="text-sm font-medium px-1">Patient City</label>
                            <Input
                                placeholder="e.g. Karachi, Lahore, Islamabad"
                                value={formData.patientCity}
                                onChange={(e) => setFormData({ ...formData, patientCity: e.target.value })}
                                required
                                className="bg-white/50"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium px-1">Home Address</label>
                            <textarea
                                className="w-full h-32 p-4 bg-white/50 rounded-2xl outline-none focus:ring-2 focus:ring-pharmevo-blue transition-all"
                                placeholder="Complete street address for device installation"
                                value={formData.homeAddress}
                                onChange={(e) => setFormData({ ...formData, homeAddress: e.target.value })}
                                required
                            ></textarea>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="apple-button-primary w-full py-4 bg-pharmevo-dark hover:bg-pharmevo-dark/90 text-white flex items-center justify-center gap-2"
                    >
                        {loading ? "Placing Order..." : <><Send size={20} /> Place CGM Order</>}
                    </button>
                </form>
            </div>
        </div>
    );
}
