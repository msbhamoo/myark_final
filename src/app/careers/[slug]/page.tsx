import CareerDetail from "@/components/modules/CareerDetail";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Career Detail | MyArk",
    description: "Explore this career path.",
};

export default function CareerDetailPage() {
    return <CareerDetail />;
}
