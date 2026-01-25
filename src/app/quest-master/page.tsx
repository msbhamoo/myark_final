import QuestMaster from "@/components/modules/QuestMaster";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Quest Master | MyArk",
    description: "Master your quests and earn XP.",
};

export default function QuestMasterPage() {
    return <QuestMaster />;
}
