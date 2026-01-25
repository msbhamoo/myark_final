import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Bell,
    Zap,
    Medal,
    Ticket,
    Star,
    Users,
    TrendingUp,
    Heart
} from "lucide-react";
import {
    collection,
    query,
    orderBy,
    limit,
    onSnapshot,
    Timestamp
} from "firebase/firestore";
import { db } from "@/lib/firestore";
import { cn } from "@/lib/utils";

interface Signal {
    id: string;
    type: 'badge' | 'xp' | 'redemption' | 'hype';
    studentName: string;
    studentAvatar?: string;
    content: string;
    timestamp: Timestamp;
    metadata?: any;
}

const CommunitySignals = ({ className }: { className?: string }) => {
    const [signals, setSignals] = useState<Signal[]>([]);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const signalsRef = collection(db, "community_signals");
        const q = query(signalsRef, orderBy("timestamp", "desc"), limit(5));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Signal));
            setSignals(data);
        });

        return () => unsubscribe();
    }, []);

    const getIcon = (type: Signal['type']) => {
        switch (type) {
            case 'badge': return <Medal className="w-4 h-4 text-yellow-500" />;
            case 'xp': return <Zap className="w-4 h-4 text-primary" />;
            case 'redemption': return <Ticket className="w-4 h-4 text-secondary" />;
            case 'hype': return <Heart className="w-4 h-4 text-rose-500 fill-current" />;
            default: return <Star className="w-4 h-4 text-primary" />;
        }
    };

    if (signals.length === 0) return null;

    return (
        <div className={cn("fixed bottom-6 right-6 z-50 w-80 space-y-2 pointer-events-none", className)}>
            <AnimatePresence initial={false}>
                {signals.map((signal, index) => (
                    <motion.div
                        key={signal.id}
                        initial={{ opacity: 0, x: 50, scale: 0.8 }}
                        animate={{ opacity: 1 - index * 0.2, x: 0, scale: 1 - index * 0.05 }}
                        exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                        layout
                        className={cn(
                            "bg-card/80 backdrop-blur-md border border-white/10 p-3 rounded-2xl shadow-2xl flex items-center gap-3 pointer-events-auto",
                            index === 0 ? " ring-1 ring-primary/30 ring-inset" : ""
                        )}
                    >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shrink-0 border border-white/5">
                            {signal.studentAvatar ? (
                                <img src={signal.studentAvatar} alt="" className="w-full h-full rounded-full object-cover" />
                            ) : (
                                <div className="text-xs font-bold text-primary">{signal.studentName[0]}</div>
                            )}
                            <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-1 shadow-sm border border-white/5">
                                {getIcon(signal.type)}
                            </div>
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold truncate">
                                <span className="text-primary">{signal.studentName}</span>
                            </p>
                            <p className="text-[10px] text-muted-foreground line-clamp-1 italic">
                                {signal.content}
                            </p>
                        </div>
                        <div className="text-[8px] text-muted-foreground whitespace-nowrap opacity-50">
                            Just now
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>

            <div className="flex items-center justify-center gap-2 pt-2 opacity-50">
                <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                <span className="text-[8px] font-black uppercase tracking-widest">Live Signals</span>
            </div>
        </div>
    );
};

export default CommunitySignals;
