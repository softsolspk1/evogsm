"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Users,
  MapPin,
  TrendingUp,
  Package,
  Loader2,
  PlusCircle,
  UserPlus,
  Truck,
  Briefcase
} from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Input } from "@/components/ui/input";

// StatCard Component
function StatCard({ title, value, icon: Icon, color }: { title: string; value: string | number; icon: any; color: string }) {
  return (
    <div className="bg-white p-8 rounded-[32px] border border-[#D2D2D7] shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-4 rounded-2xl ${color} bg-opacity-10`}>
          <Icon className={`${color.replace('bg-', 'text-')} w-8 h-8`} />
        </div>
      </div>
      <h3 className="text-4xl font-black text-[#1D1D1F] mb-2">{value}</h3>
      <p className="text-[#86868B] font-semibold text-sm uppercase tracking-wider">{title}</p>
    </div>
  );
}


export default function DashboardPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);

  // Order form state
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
  const [kams, setKams] = useState<any[]>([]);
  const [distributors, setDistributors] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [submittingOrder, setSubmittingOrder] = useState(false);

  // User form state
  const [userFormData, setUserFormData] = useState({
    email: "",
    name: "",
    role: "KAM",
    employeeCode: "",
  });
  const [submittingUser, setSubmittingUser] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

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
    if (session) {
      fetchStats();
    }
  }, [session]);

  // Fetch data for order form
  useEffect(() => {
    if (showOrderModal) {
      fetchKams();
      fetchDistributors();
      fetchCities();
    }
  }, [showOrderModal]);

  const fetchKams = async () => {
    try {
      const res = await fetch("/api/admin/users?role=KAM");
      if (res.ok) {
        const data = await res.json();
        setKams(data);
      }
    } catch (error) {
      console.error("Failed to fetch KAMs:", error);
    }
  };

  const fetchDistributors = async () => {
    try {
      const res = await fetch("/api/admin/users?role=DISTRIBUTOR");
      if (res.ok) {
        const data = await res.json();
        setDistributors(data);
      }
    } catch (error) {
      console.error("Failed to fetch distributors:", error);
    }
  };

  const fetchCities = async () => {
    try {
      const res = await fetch("/api/cities");
      if (res.ok) {
        const data = await res.json();
        setCities(data);
      }
    } catch (err) {
      console.error("Failed to fetch cities:", err);
    }
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingOrder(true);

    const userRole = (session?.user as any).role;
    if ((userRole === "admin" || userRole === "sub_admin") && !newOrder.kamId) {
      alert("Please select a KAM");
      setSubmittingOrder(false);
      return;
    }
    if (!newOrder.distributorId) {
      alert("Please select a Distributor");
      setSubmittingOrder(false);
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
        setShowOrderModal(false);
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
        alert("Order created successfully!");
      } else {
        const err = await res.json();
        alert(err.error || "Failed to create order");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Error creating order");
    } finally {
      setSubmittingOrder(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingUser(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userFormData),
      });
      if (res.ok) {
        setShowUserModal(false);
        setUserFormData({ email: "", name: "", role: "KAM", employeeCode: "" });
        alert("User created successfully!");
      } else {
        alert("Failed to create user");
      }
    } catch (e) {
      console.error(e);
      alert("Error occurred");
    } finally {
      setSubmittingUser(false);
    }
  };

  if (isPending || loading) {
    return <div className="flex h-[80vh] items-center justify-center"><Loader2 className="animate-spin text-[#0071E3]" size={40} /></div>;
  }

  const userRole = (session?.user as any)?.role?.toUpperCase();

  return (
    <div className="p-10 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
        <div>
          <h1 className="text-5xl font-bold tracking-tight text-[#1D1D1F]">Welcome back,</h1>
          <p className="text-[#1D1D1F] mt-2 text-xl font-medium">{session?.user?.name || session?.user?.email}</p>
        </div>
        <div className="hidden md:block text-right">
          <p className="text-sm font-bold text-[#1D1D1F] uppercase tracking-widest bg-[#F5F5F7] px-4 py-2 rounded-full border border-[#D2D2D7]">
            {session?.user?.role} Control Center
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        <StatCard title="Orders Today" value={stats?.todayOrders || 0} icon={ShoppingBag} color="bg-blue-500" />
        <StatCard title="Active Users" value={stats?.totalUsers || 0} icon={Users} color="bg-green-500" />
        <StatCard title="Installations" value={stats?.installations || 0} icon={Package} color="bg-purple-500" />
        <StatCard title="Trend" value="+12%" icon={TrendingUp} color="bg-orange-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="bg-white p-10 rounded-[40px] border border-[#D2D2D7] shadow-sm">
          <h2 className="text-3xl font-bold mb-8 text-[#1D1D1F]">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-6">
            {(userRole === "ADMIN" || userRole === "SUB_ADMIN" || userRole === "KAM") && (
              <button
                onClick={() => setShowOrderModal(true)}
                className="flex flex-col items-center justify-center p-8 bg-[#F5F5F7] rounded-[32px] hover:bg-[#E8E8ED] transition-all group"
              >
                <PlusCircle size={40} className="text-[#0071E3] mb-4 group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-lg text-[#1D1D1F]">New Order</span>
              </button>
            )}
            {userRole === "ADMIN" && (
              <button
                onClick={() => setShowUserModal(true)}
                className="flex flex-col items-center justify-center p-8 bg-[#F5F5F7] rounded-[32px] hover:bg-[#E8E8ED] transition-all group"
              >
                <UserPlus size={40} className="text-[#0071E3] mb-4 group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-lg text-[#1D1D1F]">Add User</span>
              </button>
            )}
          </div>
        </div>

        <div className="bg-[#1D1D1F] p-10 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-6">System Status</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/20 pb-4">
                <span className="text-lg font-medium text-gray-300">Database</span>
                <span className="flex items-center gap-2 text-green-400 font-bold bg-green-400/10 px-4 py-1 rounded-full"><div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div> Operational</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/20 pb-4">
                <span className="text-lg font-medium text-gray-300">API Gateway</span>
                <span className="flex items-center gap-2 text-green-400 font-bold bg-green-400/10 px-4 py-1 rounded-full"><div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div> Operational</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium text-gray-300">Last Sync</span>
                <span className="text-white font-mono">{new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2 bg-white p-10 rounded-[40px] border border-[#D2D2D7] shadow-sm relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-4 text-[#1D1D1F]">Operational Summary</h2>
            <p className="text-[#1D1D1F] font-bold mb-8 max-w-md">Overview of current system health and order fulfillment status across all active regions.</p>
            <button
              onClick={() => router.push("/orders")}
              className="px-8 py-4 bg-[#0071E3] text-white rounded-2xl font-bold text-lg shadow-lg hover:bg-[#0077ED] transition-all"
            >
              Manage Orders
            </button>
          </div>
          <div className="absolute right-0 bottom-0 opacity-10">
            <ShoppingBag size={300} strokeWidth={1} />
          </div>
        </div>

        <div className="bg-[#1D1D1F] p-10 rounded-[40px] text-white">
          <h2 className="text-2xl font-bold mb-2">City Stats</h2>
          <p className="text-[#86868B] text-sm font-medium mb-8">Quick regional breakdown</p>
          <div className="space-y-4">
            {stats?.cityReports?.slice(0, 3).map((report: any) => (
              <div key={report.patientCity} className="flex items-center justify-between p-4 bg-white/10 rounded-2xl">
                <span className="font-bold">{report.patientCity}</span>
                <span className="text-[#0071E3] font-black">{report._count._all}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => router.push("/reports")}
            className="w-full mt-8 py-4 bg-white/10 hover:bg-white/20 rounded-2xl font-bold transition-colors"
          >
            View Full Reports
          </button>
        </div>
      </div>

      {/* Order Creation Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-xl flex items-center justify-center z-50 p-6">
          <div className="bg-white p-10 rounded-[40px] w-full max-w-xl shadow-2xl border border-white/20 animate-in fade-in slide-in-from-bottom-8 duration-500 max-h-[90vh] overflow-y-auto">
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
                  disabled={submittingOrder}
                  className="w-full px-5 py-4 bg-[#0071E3] text-white font-bold text-lg rounded-[20px] hover:bg-[#0077ED] transition-all active:scale-[0.98] shadow-lg disabled:opacity-50"
                >
                  {submittingOrder ? "Processing..." : "Create Order"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowOrderModal(false)}
                  className="w-full py-4 text-[#0071E3] font-bold text-lg hover:underline"
                >
                  Dismiss
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Creation Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-xl flex items-center justify-center z-50 p-6">
          <div className="bg-white p-10 rounded-[40px] w-full max-w-2xl shadow-2xl border border-white/20 animate-in fade-in slide-in-from-bottom-8 duration-500">
            <h2 className="text-3xl font-bold mb-2 text-[#1D1D1F]">New User</h2>
            <p className="text-[#86868B] font-medium mb-8">Create a new user account</p>

            <form onSubmit={handleCreateUser} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium pr-2">Full Name</label>
                  <Input
                    placeholder="e.g. Ali Khan"
                    value={userFormData.name}
                    onChange={(e) => setUserFormData({ ...userFormData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium pr-2">Role</label>
                  <select
                    className="w-full px-4 py-3 bg-[#f5f5f7] rounded-xl outline-none focus:ring-2 focus:ring-pharmevo-blue transition-all"
                    value={userFormData.role}
                    onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value })}
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
                  value={userFormData.email}
                  onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium pr-2">Employee / Distributor Code</label>
                <Input
                  placeholder="e.g. KAM-102 or DIST-55"
                  value={userFormData.employeeCode}
                  onChange={(e) => setUserFormData({ ...userFormData, employeeCode: e.target.value })}
                  required
                />
              </div>

              <div className="flex flex-col gap-3 mt-8">
                <button
                  type="submit"
                  disabled={submittingUser}
                  className="w-full px-5 py-4 bg-[#0071E3] text-white font-bold text-lg rounded-[20px] hover:bg-[#0077ED] transition-all active:scale-[0.98] shadow-lg disabled:opacity-50"
                >
                  {submittingUser ? "Creating..." : "Provision Access"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowUserModal(false)}
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
