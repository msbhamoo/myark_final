import Opportunities from "@/components/modules/admin/Opportunities";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Opportunities | Admin | MyArk",
    description: "Manage opportunities.",
};

export default function OpportunitiesPage() {
    return <Opportunities />;
}
