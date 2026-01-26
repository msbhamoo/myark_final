import Opportunities from "@/components/modules/admin/Opportunities";

import type { Metadata } from "next";



export const metadata: Metadata = {

    title: "Opportunities | Admin | My Ark",

    description: "Manage opportunities.",

};



export default function OpportunitiesPage() {

    return <Opportunities />;

}

