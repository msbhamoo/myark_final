import UsersManager from "@/components/modules/admin/UsersManager";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "User Management | Admin | MyArk",
    description: "Technical management of student accounts.",
};

export default function adminUsersPage() {
    return <UsersManager />;
}
