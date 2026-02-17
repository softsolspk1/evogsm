"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { UserPlus, Users, Mail, Shield, Trash2, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Navigation } from "@/components/Navigation";

export default function UserManagementPage() {
    const { data: session, isPending } = useSession();
    const router = useRouter();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        name: "",
        role: "KAM", // Default
        employeeCode: "",
    });

    useEffect(() => {
        if (!isPending && session?.user.role !== "ADMIN") {
            router.push("/dashboard");
        }
    }, [session, isPending, router]);

    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/users");
            const data = await res.json();
            setUsers(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                setShowAddForm(false);
                fetchUsers();
                setFormData({ email: "", name: "", role: "KAM", employeeCode: "" });
            } else {
                alert("Failed to create user");
            }
        } catch (e) {
            console.error(e);
            alert("Error occurred");
        } finally {
            setLoading(false);
        }
    };

    if (isPending || loading) return <div className="p-8 text-center text-apple-gray font-medium">Loading User Management...</div>;

    return (
        <div className="min-h-screen p-8 bg-apple-bg dark:bg-black">
            <header className="flex items-center justify-between mb-12">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight">User Management</h1>
                    <p className="text-apple-gray mt-1">Manage system access for KAMs, Distributors, and Admins</p>
                </div>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="apple-button-primary bg-pharmevo-dark hover:bg-pharmevo-dark/90 text-white flex items-center gap-2"
                >
                    {showAddForm ? "Cancel" : <><UserPlus size={20} /> Create New User</>}
                </button>
            </header>

            {showAddForm && (
                <div className="glass p-8 rounded-[32px] shadow-apple mb-12 max-w-2xl mx-auto">
                    <h2 className="text-xl font-bold mb-6">Account Details</h2>
                    <form onSubmit={handleAddUser} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium pr-2">Full Name</label>
                                <Input
                                    placeholder="e.g. Ali Khan"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium pr-2">Role</label>
                                <select
                                    className="w-full px-4 py-3 bg-[#f5f5f7] rounded-xl outline-none focus:ring-2 focus:ring-pharmevo-blue transition-all"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                >
                                    <option value="KAM">KAM (Key Account Manager)</option>
                                    <option value="DISTRIBUTOR">Distributor</option>
                                    <option value="SUB_ADMIN">Sub Admin (Marketing/Coordination)</option>
                                    <option value="ADMIN">Super Admin</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium pr-2">Email Address</label>
                            <Input
                                type="email"
                                placeholder="email@pharmevo.biz"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium pr-2">Employee / Distributor Code</label>
                            <Input
                                placeholder="e.g. KAM-102 or DIST-55"
                                value={formData.employeeCode}
                                onChange={(e) => setFormData({ ...formData, employeeCode: e.target.value })}
                                required
                            />
                        </div>

                        <button type="submit" className="apple-button-primary w-full bg-pharmevo-blue text-white font-bold py-4 mt-4">
                            Provision Access
                        </button>
                    </form>
                </div>
            )}

            <div className="glass rounded-[32px] overflow-hidden shadow-apple">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-apple-gray">User</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-apple-gray">Role</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-apple-gray">Code</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-apple-gray">Status</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-apple-gray"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-apple-gray/5">
                            {users.map((u) => (
                                <tr key={u.id} className="hover:bg-white/30 transition-all group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-pharmevo-dark/5 text-pharmevo-dark flex items-center justify-center font-bold">
                                                {u.name?.[0] || u.email?.[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-bold">{u.name || 'User'}</p>
                                                <p className="text-sm text-apple-gray">{u.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-zinc-100 rounded-lg text-[10px] font-black tracking-tighter uppercase">
                                            <Shield size={10} /> {u.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-sm text-apple-gray">{u.employeeCode}</td>
                                    <td className="px-6 py-4">
                                        <span className="flex items-center gap-1 text-xs font-bold text-green-500">
                                            <CheckCircle size={14} /> Active
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 text-apple-gray hover:text-red-500 transition-all group-hover:opacity-100 opacity-0">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-apple-gray">No users provisioned yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <Navigation />
        </div>
    );
}
