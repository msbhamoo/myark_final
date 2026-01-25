import Careers from "@/components/modules/admin/Careers";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Careers | Admin | MyArk",
    description: "Manage career profiles.",
};

export default function AdminCareersPage() {
    return <Careers />;
}
