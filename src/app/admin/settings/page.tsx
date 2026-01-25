import Settings from "@/components/modules/admin/Settings";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Settings | Admin | MyArk",
    description: "Admin settings.",
};

export default function AdminSettingsPage() {
    return <Settings />;
}
