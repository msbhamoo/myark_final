import AdminLogin from "@/components/modules/admin/AdminLogin";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Admin Login | MyArk",
    description: "Sign in to access the admin panel.",
};

export default function AdminLoginPage() {
    return <AdminLogin />;
}
