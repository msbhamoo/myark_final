import Dashboard from "@/components/modules/admin/Dashboard";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Admin Dashboard | MyArk",
    description: "View admin dashboard and analytics.",
};

export default function AdminDashboardPage() {
    return <Dashboard />;
}
