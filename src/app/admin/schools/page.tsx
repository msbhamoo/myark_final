import Schools from "@/components/modules/admin/Schools";

import type { Metadata } from "next";



export const metadata: Metadata = {

    title: "Schools | Admin | Myark",

    description: "Manage school partnerships.",

};



export default function SchoolsPage() {

    return <Schools />;

}