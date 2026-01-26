import Gamification from "@/components/modules/admin/Gamification";

import type { Metadata } from "next";



export const metadata: Metadata = {

    title: "Gamification | Admin | Myark",

    description: "Manage gamification settings and XP actions.",

};



export default function GamificationPage() {

    return <Gamification />;

}