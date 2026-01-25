import StudentProfile from "@/components/modules/StudentProfile";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "My Profile | MyArk",
    description: "View and manage your profile.",
};

export default function ProfilePage() {
    return <StudentProfile />;
}
