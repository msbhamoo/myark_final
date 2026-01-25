import Students from "@/components/modules/admin/Students";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Students | Admin | MyArk",
    description: "Manage student accounts.",
};

export default function AdminStudentsPage() {
    return <Students />;
}
