import Careers from "@/components/modules/Careers";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Explore Careers | MyArk",
    description: "Discover your dream career path.",
};

export default function CareersPage() {
    return <Careers />;
}
