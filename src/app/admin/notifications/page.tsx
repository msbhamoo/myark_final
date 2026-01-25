import Notifications from "@/components/modules/admin/Notifications";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Notifications | Admin | MyArk",
    description: "Manage notifications.",
};

export default function AdminNotificationsPage() {
    return <Notifications />;
}
