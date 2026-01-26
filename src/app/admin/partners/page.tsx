import Partners from "@/components/modules/admin/Partners";

import type { Metadata } from "next";



export const metadata: Metadata = {

    title: "Partners | Admin | Myark",

    description: "Manage redemption partners.",

};



export default function PartnersPage() {

    return <Partners />;

}