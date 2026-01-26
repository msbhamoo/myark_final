import OpportunityForm from "@/components/modules/admin/OpportunityForm";

import type { Metadata } from "next";



export const metadata: Metadata = {

    title: "New Opportunity | Admin | My Ark",

    description: "Create a new opportunity.",

};



export default function NewOpportunityPage() {

    return <OpportunityForm />;

}

