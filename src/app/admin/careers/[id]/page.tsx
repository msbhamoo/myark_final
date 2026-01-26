import CareerForm from "@/components/modules/admin/CareerForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Edit Career | Admin | My Ark",
    description: "Edit career profile.",
};

export default function EditCareerPage() {
    return <CareerForm />;
}
