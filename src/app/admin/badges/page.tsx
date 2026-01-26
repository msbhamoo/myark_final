import Badges from "@/components/modules/admin/Badges";

import type { Metadata } from "next";



export const metadata: Metadata = {

    title: "Badges | Admin | Myark",

    description: "Manage gamification badges.",

};



export default function BadgesPage() {

    return <Badges />;

}