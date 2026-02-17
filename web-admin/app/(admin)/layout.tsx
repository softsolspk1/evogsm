import { Navigation } from "@/components/Navigation";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#F5F5F7]">
            <Navigation />
            <main className="ml-72 min-h-screen transition-all duration-300">
                {children}
            </main>
        </div>
    );
}
