import Rewards from "@/components/modules/admin/Rewards";

import type { Metadata } from "next";



export const metadata: Metadata = {

    title: "Rewards | Admin | Myark",

    description: "Manage redemption rewards.",

};



export default function RewardsPage() {

    return <Rewards />;

}