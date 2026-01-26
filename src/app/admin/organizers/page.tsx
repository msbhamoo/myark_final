import Organizers from "@/components/modules/admin/Organizers";

import type { Metadata } from "next";



export const metadata: Metadata = {

    title: "Organizers | Admin | Myark",

    description: "Manage opportunity organizers.",

};



export default function OrganizersPage() {

    return <Organizers />;

}