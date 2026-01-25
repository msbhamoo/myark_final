"use client";

import AdminLayout from "@/components/modules/admin/AdminLayout";

export default function AdminRootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <AdminLayout>{children}</AdminLayout>;
}
