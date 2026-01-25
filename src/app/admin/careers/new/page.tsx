import CareerForm from "@/components/modules/admin/CareerForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "New Career | Admin | MyArk",
    description: "Create a new career profile.",
};

export default function NewCareerPage() {
    return <CareerForm />;
}
