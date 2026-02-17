"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    ShoppingCart,
    Users,
    LogOut,
    MapPin,
    Grid2X2,
    Truck,
    Briefcase,
    ChevronRight,
    History
} from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";

export function Navigation() {
    const pathname = usePathname();
    const { data: session } = useSession();

    const navItems = [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Orders", href: "/orders", icon: ShoppingCart },
        { name: "City", href: "/cities", icon: MapPin },
        { name: "Area", href: "/areas", icon: Grid2X2 },
        { name: "Distributor", href: "/distributors", icon: Truck },
        { name: "KAM", href: "/kams", icon: Briefcase },
        { name: "Reports", href: "/reports", icon: History },
        { name: "Users", href: "/admin", icon: Users },
    ];

    const userRole = session?.user.role?.toLowerCase();

    // In actual implementation, we'd filter by role. 
    // For now showing all for Admin, and restricted for others.
    const displayItems = userRole === "admin" ? navItems : navItems.filter(i => ["Dashboard", "Orders"].includes(i.name));

    return (
        <aside className="fixed left-0 top-0 h-screen w-72 bg-white border-r border-[#D2D2D7] z-40 transition-all duration-300 shadow-sm">
            <div className="p-8 pb-10">
                <div className="flex items-center gap-3 mb-10">
                    <div className="w-10 h-10 bg-[#0071E3] rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-blue-200 shadow-lg">
                        C
                    </div>
                    <div>
                        <h2 className="font-bold text-xl tracking-tight text-[#1D1D1F]">CGM Admin</h2>
                        <p className="text-xs text-[#86868B] font-medium uppercase tracking-widest">{userRole || "Guest"}</p>
                    </div>
                </div>

                <nav className="space-y-1">
                    {displayItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center justify-between group px-4 py-3 rounded-2xl transition-all duration-200 ${isActive
                                    ? "bg-[#0071E3] text-white shadow-md shadow-blue-100"
                                    : "text-[#1D1D1F] hover:bg-[#F5F5F7]"
                                    } font-semibold text-[15px]`}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon size={20} className={isActive ? "text-white" : "text-[#86868B] group-hover:text-[#0071E3]"} />
                                    <span>{item.name}</span>
                                </div>
                                {isActive && <ChevronRight size={16} />}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="absolute bottom-8 left-8 right-8">
                <div className="p-4 bg-[#F5F5F7] rounded-3xl mb-4">
                    <p className="text-xs font-bold text-[#86868B] uppercase tracking-wider mb-1">Account</p>
                    <p className="text-sm font-bold text-[#1D1D1F] truncate">{session?.user.email || "Not signed in"}</p>
                </div>
                <button
                    onClick={() => signOut({ fetchOptions: { onSuccess: () => { window.location.href = "/"; } } })}
                    className="flex items-center gap-3 w-full px-6 py-4 rounded-2xl text-red-500 hover:bg-red-50 transition-all font-bold text-sm bg-white border border-red-100 shadow-sm"
                >
                    <LogOut size={18} />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
}
