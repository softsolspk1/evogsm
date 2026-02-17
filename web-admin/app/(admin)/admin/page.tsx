"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Plus, Search, Trash2, Mail, Shield, ShieldCheck } from "lucide-react";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  emailVerified: boolean;
  isVerified: boolean;
  banned: boolean | null;
}

export default function AdminPage() {
  const { data: session, isPending } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUser, setNewUser] = useState({
    email: "",
    name: "",
    password: "",
    role: "user",
  });
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const router = useRouter();

  useEffect(() => {
    if (!isPending && (!session || session.user.role !== "admin")) {
      router.push("/dashboard");
    } else if (!isPending && session?.user.role === "admin") {
      fetchUsers();
    }
  }, [session, isPending, router]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: string, updates: Partial<User>) => {
    setActionLoading(id);
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...updates }),
    });
    setEditingId(null);
    await fetchUsers();
    setActionLoading(null);
  };

  const handleCreateUser = async () => {
    setActionLoading("create");
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });
    if (res.ok) {
      setShowCreateModal(false);
      setNewUser({ email: "", name: "", password: "", role: "user" });
      await fetchUsers();
    } else {
      const data = await res.json();
      alert(data.error || "Failed to create user");
    }
    setActionLoading(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      setActionLoading(id);
      await fetch(`/api/admin/users?id=${id}`, { method: "DELETE" });
      await fetchUsers();
      setActionLoading(null);
    }
  };

  if (isPending || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8 text-[#0071E3]">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-10 max-w-7xl mx-auto">
      <header className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-[#1D1D1F]">Users</h1>
          <p className="text-[#1D1D1F] mt-1 text-lg font-medium">Manage accounts and platform access</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-[#0071E3] hover:bg-[#0077ED] text-white rounded-2xl font-bold transition-all active:scale-95 shadow-sm flex items-center gap-2"
          >
            <Plus size={20} />
            Add User
          </button>
        </div>
      </header>

      {/* Filters */}
      <div className="mb-8 bg-white p-6 rounded-[24px] border border-[#D2D2D7] shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-[#1D1D1F] mb-2 uppercase tracking-wider">Filter by Role</label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-4 py-3 bg-[#F5F5F7] rounded-[16px] text-[#1D1D1F] font-bold outline-none focus:ring-2 focus:ring-[#0071E3] appearance-none cursor-pointer"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="KAM">KAM</option>
              <option value="DISTRIBUTOR">Distributor</option>
              <option value="user">User</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-[#1D1D1F] mb-2 uppercase tracking-wider">Filter by Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-3 bg-[#F5F5F7] rounded-[16px] text-[#1D1D1F] font-bold outline-none focus:ring-2 focus:ring-[#0071E3] appearance-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="banned">Banned</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[32px] overflow-hidden shadow-apple border border-[#D2D2D7]">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#D2D2D7] bg-[#FAFAFA]">
                <th className="px-8 py-5 text-[13px] font-bold text-[#1D1D1F] uppercase tracking-widest leading-none">
                  User Details
                </th>
                <th className="px-8 py-5 text-[13px] font-bold text-[#1D1D1F] uppercase tracking-widest leading-none">
                  Access Role
                </th>
                <th className="px-8 py-5 text-[13px] font-bold text-[#1D1D1F] uppercase tracking-widest leading-none">
                  Account Status
                </th>
                <th className="px-8 py-5 text-[13px] font-bold text-[#1D1D1F] uppercase tracking-widest leading-none text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F5F7]">
              {Array.isArray(users) && users
                .filter(user => roleFilter === "all" || user.role === roleFilter)
                .filter(user => statusFilter === "all" || (statusFilter === "active" ? !user.banned : user.banned))
                .map((user) => (
                  <tr key={user.id} className="group hover:bg-[#F5F5F7]/40 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#0071E3]/10 text-[#0071E3] rounded-full flex items-center justify-center font-bold text-lg">
                          {user.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          {editingId === user.id ? (
                            <input
                              autoFocus
                              defaultValue={user.name}
                              onBlur={() => setEditingId(null)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter")
                                  handleUpdate(user.id, { name: e.currentTarget.value });
                                if (e.key === "Escape") setEditingId(null);
                              }}
                              className="border-b-2 border-[#0071E3] py-1 text-lg font-bold outline-none w-full bg-transparent text-[#1D1D1F]"
                            />
                          ) : (
                            <div onClick={() => setEditingId(user.id)} className="cursor-pointer">
                              <div className="text-lg font-bold text-[#1D1D1F] group-hover:text-[#0071E3] transition-colors">{user.name}</div>
                              <div className="text-sm text-[#86868B] font-medium flex items-center gap-1">
                                <Mail size={12} /> {user.email}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <Shield size={16} className="text-[#86868B]" />
                        <select
                          value={user.role}
                          onChange={(e) => handleUpdate(user.id, { role: e.target.value })}
                          className="bg-transparent text-[15px] font-bold text-[#1D1D1F] outline-none cursor-pointer hover:text-[#0071E3] transition-colors appearance-none pr-8 py-1"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                          <option value="KAM">KAM</option>
                          <option value="DISTRIBUTOR">Distributor</option>
                        </select>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <button
                        onClick={() => handleUpdate(user.id, { banned: !user.banned })}
                        className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[12px] font-bold uppercase tracking-wider transition-all active:scale-95 ${!user.banned
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : "bg-red-100 text-red-700 border border-red-200"
                          }`}
                      >
                        <div className={`w-2 h-2 rounded-full ${!user.banned ? "bg-green-500" : "bg-red-500"}`}></div>
                        {!user.banned ? "Active" : "Banned"}
                      </button>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button
                        disabled={actionLoading === user.id}
                        onClick={() => handleDelete(user.id)}
                        className="p-2 text-[#86868B] hover:text-red-600 hover:bg-red-50 rounded-xl transition-all disabled:opacity-50"
                        title="Delete User"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-xl flex items-center justify-center z-50 p-6 animate-in fade-in duration-200">
          <div className="bg-white p-10 rounded-[40px] w-full max-w-lg shadow-2xl border border-white/20">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">New User</h2>
              <p className="text-[#1D1D1F] font-medium">Create a new platform account.</p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-[#1D1D1F] uppercase tracking-wider mb-2">Full Name</label>
                <input
                  placeholder="e.g. John Doe"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full px-5 py-4 bg-[#F5F5F7] border-none rounded-[20px] text-base focus:ring-2 focus:ring-[#0071E3] outline-none transition-all font-bold text-[#1D1D1F] placeholder:text-[#424245]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#1D1D1F] uppercase tracking-wider mb-2">Email Address</label>
                <input
                  placeholder="john@example.com"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full px-5 py-4 bg-[#F5F5F7] border-none rounded-[20px] text-base focus:ring-2 focus:ring-[#0071E3] outline-none transition-all font-medium text-[#1D1D1F] placeholder:text-[#424245]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#1D1D1F] uppercase tracking-wider mb-2">Password</label>
                <input
                  placeholder="••••••••"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full px-5 py-4 bg-[#F5F5F7] border-none rounded-[20px] text-base focus:ring-2 focus:ring-[#0071E3] outline-none transition-all font-medium text-[#1D1D1F] placeholder:text-[#424245]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#1D1D1F] uppercase tracking-wider mb-2">Role</label>
                <div className="relative">
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    className="w-full px-5 py-4 bg-[#F5F5F7] border-none rounded-[20px] text-base focus:ring-2 focus:ring-[#0071E3] outline-none transition-all font-bold appearance-none text-[#1D1D1F]"
                  >
                    <option value="user">User Access</option>
                    <option value="admin">Admin Access</option>
                    <option value="KAM">KAM</option>
                    <option value="DISTRIBUTOR">Distributor</option>
                  </select>
                  <ShieldCheck className="absolute right-5 top-1/2 transform -translate-y-1/2 text-[#86868B] pointer-events-none" size={20} />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-10">
              <button
                disabled={actionLoading === "create"}
                onClick={handleCreateUser}
                className="w-full bg-[#0071E3] py-4 rounded-[20px] text-white font-bold text-lg hover:bg-[#0077ED] transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-blue-100"
              >
                {actionLoading === "create" ? "Creating..." : "Create Account"}
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="w-full py-4 text-[#0071E3] font-bold text-lg hover:underline transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
