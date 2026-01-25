import OpportunityForm from "@/components/modules/admin/OpportunityForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Edit Opportunity | Admin | MyArk",
    description: "Edit opportunity details.",
};

export default function EditOpportunityPage() {
    return <OpportunityForm />;
}
