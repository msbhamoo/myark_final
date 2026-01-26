/**
 * StudentProfile - Gamified Profile Experience
 * "Profiles shouldn't feel like forms. They should feel like power-ups."
 */
"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy, Flame, Star, Target, Bookmark, Clock,
  Award, Zap, TrendingUp, Calendar, ChevronRight,
  Medal, Gift, Sparkles, Crown, Shield, Rocket,
  User, School, MapPin, Heart, Check, Plus, Users, Search,
  GraduationCap, Palette, Calculator, FlaskConical,
  Dumbbell, Music, Code, BookOpen, Globe, X,
  ChevronDown, Loader2, Camera, Edit3, ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Confetti from "@/components/Confetti";
import { useStudentAuth } from "@/lib/studentAuth";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { uploadImage } from "@/lib/imagekit";
import { opportunitiesService, badgesService, settingsService } from "@/lib/firestore";
import type { Opportunity, Badge as AdminBadge, Organizer } from "@/types/admin";

// ============================================
// INTEREST OPTIONS
// ============================================
const INTERESTS = [
  { id: "scholarships", label: "Scholarships", icon: GraduationCap, color: "from-green-500 to-emerald-500" },
  { id: "science", label: "Science", icon: FlaskConical, color: "from-cyan-500 to-blue-500" },
  { id: "math", label: "Mathematics", icon: Calculator, color: "from-purple-500 to-violet-500" },
  { id: "technology", label: "Technology", icon: Code, color: "from-orange-500 to-red-500" },
  { id: "arts", label: "Arts & Design", icon: Palette, color: "from-pink-500 to-rose-500" },
  { id: "sports", label: "Sports", icon: Dumbbell, color: "from-yellow-500 to-amber-500" },
  { id: "music", label: "Music", icon: Music, color: "from-indigo-500 to-purple-500" },
  { id: "literature", label: "Literature", icon: BookOpen, color: "from-teal-500 to-cyan-500" },
  { id: "languages", label: "Languages", icon: Globe, color: "from-blue-500 to-indigo-500" },
];

const GRADES = [4, 5, 6, 7, 8, 9, 10, 11, 12];
const GENDER_OPTIONS = [
  { id: "male", label: "Male" },
  { id: "female", label: "Female" },
  { id: "other", label: "Other" },
  { id: "prefer_not_to_say", label: "Prefer not to say" },
];

// ============================================
// MYRO MESSAGES
// ============================================
const getMyroMessage = (percent: number, streak: number = 0) => {
  // Priority 1: Streak encouragement
  if (streak > 0) {
    if (streak === 1) return { emoji: "🔥", message: "Streak started! Come back tomorrow to keep it lit!" };
    if (streak === 3) return { emoji: "⚡", message: "3-day streak! You're on fire! Keep it up!" };
    if (streak >= 7) return { emoji: "🏆", message: `${streak}-day streak! Absolute LEGEND! Don't stop now!` };
  }
  // Priority 2: Profile completion
  if (percent === 0) return { emoji: "👋", message: "Hey! Let's power up your profile!" };
  if (percent < 25) return { emoji: "✨", message: "Great start! Keep going for better matches!" };
  if (percent < 50) return { emoji: "🚀", message: "Nice! You're building momentum!" };
  if (percent < 75) return { emoji: "⭐", message: "Halfway there! You're doing great!" };
  if (percent < 100) return { emoji: "🔥", message: "Almost maxed out! One more step!" };
  // Default/Max
  return { emoji: "👑", message: "LEGENDARY! Your profile is fully powered!" };
};

// ============================================
// PROFILE POWER METER
// ============================================
const ProfileMeter = ({ percent }: { percent: number }) => {
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percent / 100) * circumference;
  return (
    <div className="relative w-32 h-32">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="64"
          cy="64"
          r="45"
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          className="text-muted/30"
        />
        <motion.circle
          cx="64"
          cy="64"
          r="45"
          stroke="url(#gradient)"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ strokeDasharray: circumference }}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--secondary))" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black">{percent}%</span>
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Power</span>
      </div>
    </div>
  );
};

// ============================================
// POWER-UP CARD
// ============================================
const PowerUpCard = ({
  title,
  description,
  xp,
  icon: Icon,
  isComplete,
  onClick,
  gradient,
}: {
  title: string;
  description: string;
  xp: number;
  icon: any;
  isComplete: boolean;
  onClick: () => void;
  gradient: string;
}) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={cn(
      "relative p-5 rounded-2xl border-2 transition-all cursor-pointer overflow-hidden",
      isComplete
        ? "border-emerald-500/30 bg-emerald-500/10"
        : "border-white/10 bg-white/5 hover:border-primary/50"
    )}
  >
    {/* Glow */}
    {!isComplete && (
      <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${gradient} blur-2xl opacity-20`} />
    )}
    <div className="relative flex items-start gap-4">
      <div className={cn(
        "w-12 h-12 rounded-xl flex items-center justify-center",
        isComplete ? "bg-emerald-500/20" : `bg-gradient-to-br ${gradient}`
      )}>
        {isComplete ? (
          <Check className="w-6 h-6 text-emerald-400" />
        ) : (
          <Icon className="w-6 h-6 text-white" />
        )}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <h4 className="font-bold">{title}</h4>
          <Badge className={cn(
            "text-xs font-black",
            isComplete ? "bg-emerald-500/20 text-emerald-400" : "bg-primary/20 text-primary"
          )}>
            {isComplete ? "✅ Done" : `+${xp} XP`}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  </motion.div>
);

// ============================================
// MODAL OVERLAYS
// ============================================
const ModalOverlay = ({ children, onClose }: { children: React.ReactNode; onClose: () => void }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
    onClick={onClose}
  >
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      onClick={(e) => e.stopPropagation()}
      className="w-full max-w-md glass-card p-6 rounded-3xl max-h-[80vh] overflow-auto"
    >
      {children}
    </motion.div>
  </motion.div >
);

// ============================================
// MAIN COMPONENT
// ============================================
const StudentProfilePage = () => {
  const router = useRouter();
  const { student, isAuthenticated, loading, updateStudent, addXPWithPersist } = useStudentAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "badges" | "saved" | "activity">("overview");
  const [showConfetti, setShowConfetti] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [savedOpportunities, setSavedOpportunities] = useState<Opportunity[]>([]);
  const [loadingSaved, setLoadingSaved] = useState(false);
  const [appliedOpportunities, setAppliedOpportunities] = useState<Opportunity[]>([]);
  const [loadingApplied, setLoadingApplied] = useState(false);
  const [editName, setEditName] = useState("");
  const [adminBadges, setAdminBadges] = useState<AdminBadge[]>([]);
  const [showPowerUps, setShowPowerUps] = useState(false);
  const [schools, setSchools] = useState<Organizer[]>([]);
  const [schoolSearch, setSchoolSearch] = useState("");

  // Form states
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  useEffect(() => {
    if (student) {
      setSelectedGrade(student.grade || null);
      setSelectedGender(student.gender || null);
      setSelectedCity(student.city || "");
      setSelectedSchool(student.school || "");
      setSelectedInterests(student?.interests || []);
      setEditName(student?.name || "");
    }
  }, [student]);

  // Load saved opportunities
  useEffect(() => {
    const loadSaved = async () => {
      if (student?.savedOpportunities?.length) {
        setLoadingSaved(true);
        try {
          const allOpps = await opportunitiesService.getAll();
          const saved = allOpps.filter(o => student.savedOpportunities.includes(o.id));
          setSavedOpportunities(saved);
        } catch (error) {
          console.error("Failed to load saved:", error);
        } finally {
          setLoadingSaved(false);
        }
      }
    };
    loadSaved();
  }, [student?.savedOpportunities]);

  // Load applied opportunities
  useEffect(() => {
    const loadApplied = async () => {
      if (student?.appliedOpportunities?.length) {
        setLoadingApplied(true);
        try {
          const allOpps = await opportunitiesService.getAll();
          const applied = allOpps.filter(o => student.appliedOpportunities.includes(o.id));
          setAppliedOpportunities(applied);
        } catch (error) {
          console.error("Failed to load applied:", error);
        } finally {
          setLoadingApplied(false);
        }
      }
    };
    loadApplied();
  }, [student?.appliedOpportunities]);

  // Load admin badges from Firebase
  useEffect(() => {
    const loadBadges = async () => {
      try {
        const fetchedBadges = await badgesService.getAll();
        setAdminBadges(fetchedBadges);
      } catch (error) {
        console.error("Failed to load badges:", error);
      }
    };
    loadBadges();
  }, []);

  // Load schools from organizers
  useEffect(() => {
    const loadSchools = async () => {
      try {
        const organizers = await settingsService.getOrganizers();
        const schoolList = organizers.filter(org => org.type === 'school');
        setSchools(schoolList);
      } catch (error) {
        console.error("Failed to load schools:", error);
      }
    };
    loadSchools();
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  // Calculate profile completion
  const calculateCompletion = () => {
    if (!student) return 0;
    let complete = 0;
    let total = 5;
    if (student?.grade) complete++;
    if (student?.school) complete++;
    if (student?.gender) complete++;
    if (student?.city) complete++;
    if (student?.interests && student?.interests.length >= 3) complete++;
    return Math.round((complete / total) * 100);
  };

  const profilePercent = calculateCompletion();
  const myroMessage = getMyroMessage(profilePercent, student?.streakDays || 0);

  // Photo upload handler
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      return;
    }
    setUploadingPhoto(true);
    try {
      const result: any = await uploadImage(file, `profile_${student?.id}`);
      const isFirstTime = !student?.profilePicture;
      await updateStudent({ profilePicture: result.url });
      if (isFirstTime) {
        await addXPWithPersist(25);
      } else {
      }
    } catch (error) {
    } finally {
      setUploadingPhoto(false);
    }
  };

  // Save name handler
  const handleSaveName = async () => {
    if (!editName.trim()) return;
    try {
      await updateStudent({ name: editName.trim() });
      setActiveModal(null);
    } catch (error) {
    }
  };

  // Activity data (generated from student actions)
  const generateActivityTimeline = () => {
    const activities: Array<{ action: string; item: string; time: string; xp: number }> = [];
    if (student?.lastLoginAt) {
      activities.push({ action: "Logged in", item: "Myark", time: "Today", xp: 10 });
    }
    if (student?.appliedOpportunities?.length) {
      activities.push({ action: "Applied to", item: `${student.appliedOpportunities.length} opportunities`, time: "Recently", xp: 50 });
    }
    if (student?.savedOpportunities?.length) {
      activities.push({ action: "Saved", item: `${student.savedOpportunities.length} opportunities`, time: "Recently", xp: 10 });
    }
    if (student?.badges?.length) {
      activities.push({ action: "Unlocked", item: `${student.badges.length} badges`, time: "Previously", xp: 100 });
    }
    if (profilePercent === 100) {
      activities.push({ action: "Completed", item: "Profile", time: "Previously", xp: 100 });
    }
    return activities.length ? activities : [
      { action: "Welcome to", item: "Myark!", time: "Just now", xp: 50 }
    ];
  };

  // Save handlers
  const handleSaveGrade = async () => {
    if (!selectedGrade) return;
    try {
      const isFirstTime = !student?.grade;
      await updateStudent({ grade: selectedGrade });
      if (isFirstTime) {
        await addXPWithPersist(50);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2000);
        toast({ title: "+50 XP 🎓", description: "Class saved!", className: "bg-primary text-primary-foreground border-none" });
      } else {
        toast({ title: "Class updated!", className: "bg-primary text-primary-foreground border-none" });
      }
      setActiveModal(null);
    } catch (error) {
      toast({ title: "Error", description: "Failed to save", variant: "destructive" });
    }
  };

  const handleSaveSchool = async () => {
    if (!selectedSchool) return;
    try {
      const isFirstTime = !student?.school;
      await updateStudent({ school: selectedSchool });
      if (isFirstTime) {
        await addXPWithPersist(50);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2000);
        toast({ title: "+50 XP 🏫", description: "School saved!", className: "bg-primary text-primary-foreground border-none" });
      } else {
        toast({ title: "School updated!", className: "bg-primary text-primary-foreground border-none" });
      }
      setActiveModal(null);
    } catch (error) {
      toast({ title: "Error", description: "Failed to save", variant: "destructive" });
    }
  };

  const handleSaveGender = async () => {
    if (!selectedGender) return;
    try {
      const isFirstTime = !student?.gender;
      await updateStudent({ gender: selectedGender as any });
      if (isFirstTime) {
        await addXPWithPersist(25);
        toast({ title: "+25 XP 👤", description: "Gender saved!", className: "bg-primary text-primary-foreground border-none" });
      } else {
        toast({ title: "Gender updated!", className: "bg-primary text-primary-foreground border-none" });
      }
      setActiveModal(null);
    } catch (error) {
      toast({ title: "Error", description: "Failed to save", variant: "destructive" });
    }
  };

  const handleSaveCity = async () => {
    if (!selectedCity) return;
    try {
      const isFirstTime = !student?.city;
      await updateStudent({ city: selectedCity });
      if (isFirstTime) {
        await addXPWithPersist(25);
        toast({ title: "+25 XP 🌍", description: "City saved!", className: "bg-primary text-primary-foreground border-none" });
      } else {
        toast({ title: "City updated!", className: "bg-primary text-primary-foreground border-none" });
      }
      setActiveModal(null);
    } catch (error) {
      toast({ title: "Error", description: "Failed to save", variant: "destructive" });
    }
  };

  const handleSaveInterests = async () => {
    if (selectedInterests.length < 3) {
      toast({ title: "Select at least 3", description: "Pick 3+ interests for XP", variant: "destructive" });
      return;
    }
    try {
      const isFirstTime = !student?.interests || student?.interests.length < 3;
      await updateStudent({ interests: selectedInterests });
      if (isFirstTime) {
        await addXPWithPersist(75);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2000);
        toast({ title: "+75 XP ❤️", description: "Interests saved!", className: "bg-primary text-primary-foreground border-none" });
      } else {
        toast({ title: "Interests updated!", className: "bg-primary text-primary-foreground border-none" });
      }
      setActiveModal(null);
    } catch (error) {
      toast({ title: "Error", description: "Failed to save", variant: "destructive" });
    }
  };

  const toggleInterest = (id: string) => {
    setSelectedInterests(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Show loading or redirecting state
  if (loading || !student) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary rounded-full p-2" />
        <p className="text-primary font-bold animate-pulse tracking-widest uppercase text-xs">
          {loading ? "Syncing Matrix..." : "Access Denied. Identity check failed."}
        </p>
      </div>
    );
  }

  // Icon resolver for admin badges
  const getBadgeIcon = (iconName: string) => {
    const Icons: Record<string, any> = {
      Star, Rocket, Target, Flame, Crown, Shield, Award, Medal, Trophy,
      Users, Zap, Heart, GraduationCap, School, MapPin, Search, Sparkles
    };
    return Icons[iconName] || Award;
  };

  interface BadgeDisplay {
    id: string | number;
    name: string;
    icon: any;
    unlocked: boolean;
    color: string;
    condition: string;
  }

  // Combined badges: core logic + admin badges
  let badges: BadgeDisplay[] = adminBadges.length > 0 ? adminBadges.map(b => ({
    id: b.id,
    name: b.name,
    icon: getBadgeIcon(b.icon),
    unlocked: !!(student?.badges?.includes(b.id) || student?.badges?.includes(b.name.toLowerCase().replace(/\s+/g, '_'))),
    color: b.color || "from-gray-400 to-gray-600",
    condition: b.xpRequirement ? `Reach ${b.xpRequirement} XP` : b.description
  })) : [
    { id: 1, name: "Early Bird", icon: Star, unlocked: !!student?.badges?.includes('early_bird'), color: "from-yellow-400 to-orange-500", condition: "Register on Myark" },
    { id: 2, name: "Explorer", icon: Rocket, unlocked: (student?.appliedOpportunities?.length || 0) >= 1, color: "from-primary to-secondary", condition: "Apply to 1 opportunity" },
    { id: 3, name: "Opportunity Hunter", icon: Target, unlocked: (student?.appliedOpportunities?.length || 0) >= 5, color: "from-green-400 to-emerald-500", condition: "Apply to 5 opportunities" },
    { id: 4, name: "Streak King", icon: Flame, unlocked: (student?.streakDays || 0) >= 7, color: "from-orange-400 to-red-500", condition: "Maintain 7-day login streak" },
    { id: 5, name: "Champion", icon: Crown, unlocked: (student?.xpPoints || 0) >= 1000, color: "from-purple-400 to-pink-500", condition: "Earn 1000 XP total" },
    { id: 6, name: "Profile Pro", icon: Shield, unlocked: profilePercent === 100, color: "from-blue-400 to-cyan-500", condition: "Complete your profile 100%" },
  ];

  // Force include Profile Pro if not in admin badges
  if (adminBadges.length > 0 && !badges.some(b => b.name === "Profile Pro")) {
    badges.push({
      id: "profile_pro_fixed",
      name: "Profile Pro",
      icon: Shield,
      unlocked: profilePercent === 100,
      color: "from-blue-400 to-cyan-500",
      condition: "Complete your profile 100%"
    });
  }

  return (
    <div className="min-h-screen bg-background">
      <Confetti isActive={showConfetti} />
      <Navbar />
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* ===== PROFILE HEADER ===== */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 md:p-8 mb-8"
          >
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Avatar + Power Meter */}
              <div className="flex flex-col items-center gap-4">
                <motion.div className="relative" whileHover={{ scale: 1.02 }}>
                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  {/* Avatar */}
                  <div
                    className="w-28 h-28 rounded-full bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center text-4xl font-bold text-primary-foreground overflow-hidden cursor-pointer group"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {uploadingPhoto ? (
                      <Loader2 className="w-8 h-8 animate-spin" />
                    ) : student?.profilePicture ? (
                      <img src={student?.profilePicture} alt={student?.name || "Profile"} className="w-full h-full object-cover" />
                    ) : (
                      student?.name?.[0] || "?"
                    )}
                    {/* Camera overlay */}
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                      <Camera className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  {/* Level badge */}
                  <motion.div
                    className="absolute -bottom-2 -right-2 bg-gradient-to-r from-primary to-secondary px-3 py-1 rounded-full text-xs font-bold"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Lvl {student.level || 1}
                  </motion.div>
                </motion.div>
                <ProfileMeter percent={profilePercent} />
              </div>
              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                  <h1 className="font-display text-3xl md:text-4xl font-bold">
                    {student?.name || "Student"}
                  </h1>
                  <button
                    onClick={() => setActiveModal("name")}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors"
                    title="Edit name"
                  >
                    <Edit3 className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
                <p className="text-muted-foreground mb-4">
                  {student?.grade ? `Class ${student?.grade}` : "Class not set"}
                  {student?.school && ` ⬢ ${student?.school}`}
                  {student?.city && ` ⬢ ${student?.city}`}
                </p>
                {/* XP Progress */}
                <div className="max-w-md mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Progress to Level {(student.level || 1) + 1}</span>
                    <span className="font-bold gradient-text-primary">
                      {student?.xpPoints?.toLocaleString() || 0} XP
                    </span>
                  </div>
                  <div className="relative h-4 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-secondary rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${((student?.xpPoints || 0) % 1000) / 10}%` }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                </div>
                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <motion.div className="text-center glass-card p-3 rounded-xl" whileHover={{ scale: 1.05 }}>
                    <Flame className="w-5 h-5 mx-auto mb-1 text-orange-500" />
                    <div className="text-xl font-bold">{student?.streakDays || 0}</div>
                    <div className="text-[10px] text-muted-foreground">Streak</div>
                  </motion.div>
                  <motion.div className="text-center glass-card p-3 rounded-xl" whileHover={{ scale: 1.05 }}>
                    <Medal className="w-5 h-5 mx-auto mb-1 text-accent" />
                    <div className="text-xl font-bold">{student?.badges?.length || 0}</div>
                    <div className="text-[10px] text-muted-foreground">Badges</div>
                  </motion.div>
                  <motion.div className="text-center glass-card p-3 rounded-xl" whileHover={{ scale: 1.05 }}>
                    <Target className="w-5 h-5 mx-auto mb-1 text-success" />
                    <div className="text-xl font-bold">{student?.appliedOpportunities?.length || 0}</div>
                    <div className="text-[10px] text-muted-foreground">Applied</div>
                  </motion.div>
                </div>
                <div className="mt-6 flex justify-center md:justify-start">
                  <Button
                    onClick={() => setShowPowerUps(!showPowerUps)}
                    variant={showPowerUps ? "secondary" : "default"}
                    size="sm"
                    className="gap-2 rounded-full px-6"
                  >
                    {showPowerUps ? <ChevronDown className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                    {showPowerUps ? "Hide Editor" : "Edit Profile"}
                  </Button>
                </div>
              </div>
              {/* Myro Message */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card p-4 rounded-2xl max-w-xs text-center relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-12 h-12 bg-primary/10 blur-xl rounded-full -mr-4 -mt-4" />
                <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center p-2 bg-primary/5 rounded-2xl">
                  <img src="/myro.png" alt="Myro" className="w-full h-full object-contain" />
                </div>
                <div className="flex items-center justify-center gap-1.5 mb-2">
                  <span className="text-2xl">{myroMessage.emoji}</span>
                  <p className="text-sm font-black uppercase tracking-widest text-primary/80">Myro Says</p>
                </div>
                <p className="text-sm font-medium leading-relaxed italic">"{myroMessage.message}"</p>
                {profilePercent < 100 && (
                  <p className="text-xs text-muted-foreground mt-2 border-t border-white/5 pt-2 font-medium">Complete your profile for better matches!</p>
                )}
              </motion.div>
            </div>
          </motion.div>
          {/* ===== POWER-UPS SECTION (Conditional) ===== */}
          <AnimatePresence>
            {showPowerUps && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden mb-8"
              >
                <div className="glass-card p-6 rounded-2xl border-primary/20 bg-primary/5">
                  <div className="flex items-center gap-3 mb-6">
                    <Zap className="w-6 h-6 text-primary" />
                    <h2 className="text-xl font-black uppercase tracking-tight">
                      Edit Your Profile
                    </h2>
                    {profilePercent < 100 && (
                      <Badge className="bg-primary/20 text-primary font-bold">
                        {5 - Math.round(profilePercent / 20)} left
                      </Badge>
                    )}
                    {profilePercent === 100 && (
                      <Badge className="bg-success/20 text-success font-bold">All Complete ✅</Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <PowerUpCard
                      title="What class are you in?"
                      description="Helps us find age-appropriate opportunities"
                      xp={50}
                      icon={GraduationCap}
                      isComplete={!!student?.grade}
                      onClick={() => setActiveModal("grade")}
                      gradient="from-blue-500 to-cyan-500"
                    />
                    <PowerUpCard
                      title="Where do you study?"
                      description="Connect with school-specific events"
                      xp={50}
                      icon={School}
                      isComplete={!!student?.school}
                      onClick={() => setActiveModal("school")}
                      gradient="from-purple-500 to-pink-500"
                    />
                    <PowerUpCard
                      title="How do you identify?"
                      description="Personalize your experience"
                      xp={25}
                      icon={User}
                      isComplete={!!student?.gender}
                      onClick={() => setActiveModal("gender")}
                      gradient="from-amber-500 to-orange-500"
                    />
                    <PowerUpCard
                      title="Where are you from?"
                      description="Find local opportunities near you"
                      xp={25}
                      icon={MapPin}
                      isComplete={!!student?.city}
                      onClick={() => setActiveModal("city")}
                      gradient="from-emerald-500 to-teal-500"
                    />
                    <PowerUpCard
                      title="What excites you?"
                      description="Get recommendations that match your interests"
                      xp={75}
                      icon={Heart}
                      isComplete={!!(student?.interests && student?.interests.length >= 3)}
                      onClick={() => setActiveModal("interests")}
                      gradient="from-rose-500 to-red-500"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {/* ===== TABS ===== */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {[
            { id: "overview", label: "Overview", icon: TrendingUp },
              { id: "applied", label: "Applied", icon: Target },
              { id: "badges", label: "Badges", icon: Medal },
              { id: "saved", label: "Saved", icon: Bookmark },
              { id: "activity", label: "Activity", icon: Clock },
            ].map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "glass"}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className="flex items-center gap-2 whitespace-nowrap"
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </Button>
            ))}
          </div>
          {/* ===== TAB CONTENT ===== */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {activeTab === "applied" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6 rounded-xl">
                  <h3 className="font-display text-xl font-bold mb-6 flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    Applied Opportunities
                  </h3>
                  {loadingApplied ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin" />
                    </div>
                  ) : appliedOpportunities.length > 0 ? (
                    <div className="space-y-4">
                      {appliedOpportunities.map((opp) => (
                        <motion.div
                          key={opp.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          onClick={() => router.push(`/opportunity/${opp.id}`)}
                          className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all cursor-pointer group"
                        >
                          <div className="flex items-center gap-3">
                            {opp.image && (
                              <img src={opp.image} alt={opp.title} className="w-12 h-12 rounded-lg object-cover" />
                            )}
                            <div>
                              <div className="font-bold group-hover:text-primary transition-colors">{opp.title}</div>
                              <div className="text-sm text-muted-foreground flex items-center gap-2">
                                <Badge className="bg-primary/20 text-primary text-xs">{opp.type}</Badge>
                                {opp.organizer && <span>⬢ {opp.organizer}</span>}
                                <span>⬢ Applied {new Date().toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Check className="w-5 h-5 text-success" />
                            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Target className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                      <p className="text-muted-foreground">No applications yet</p>
                      <Button className="mt-4" onClick={() => router.push("/")}>Explore Opportunities</Button>
                    </div>
                  )}
                </motion.div>
              )}
              {activeTab === "overview" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: "Total XP", value: student?.xpPoints?.toLocaleString() || "0", icon: Zap, color: "text-primary" },
                      { label: "Applications", value: student?.appliedOpportunities?.length || 0, icon: Target, color: "text-secondary" },
                      { label: "Badges", value: student?.badges?.length || 0, icon: Medal, color: "text-accent" },
                      { label: "Saved", value: student.savedOpportunities?.length || 0, icon: Bookmark, color: "text-success" },
                    ].map((stat) => (
                      <div key={stat.label} className="glass-card p-4 rounded-xl text-center">
                        <stat.icon className={`w-5 h-5 mx-auto mb-2 ${stat.color}`} />
                        <div className="text-xl font-bold">{stat.value}</div>
                        <div className="text-xs text-muted-foreground">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                  {/* Interests */}
                  {student?.interests && student?.interests.length > 0 && (
                    <div className="glass-card p-6 rounded-xl">
                      <h3 className="font-bold mb-4 flex items-center gap-2">
                        <Heart className="w-5 h-5 text-rose-500" />
                        Your Interests
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {student?.interests.map((interest) => {
                          const config = INTERESTS.find(i => i.id === interest);
                          return (
                            <Badge key={interest} className={`bg-gradient-to-r ${config?.color || 'from-gray-500 to-gray-600'} text-white border-none px-3 py-1`}>
                              {config?.label || interest}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
              {activeTab === "badges" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6 rounded-xl">
                  <h3 className="font-display text-xl font-bold mb-6">Your Badges</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {badges.map((badge) => (
                      <div
                        key={badge.id}
                        className={cn(
                          "p-6 rounded-xl text-center",
                          badge.unlocked ? "glass-card" : "bg-muted/20 opacity-50"
                        )}
                      >
                        <div className={cn(
                          "w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center",
                          badge.unlocked ? `bg-gradient-to-br ${badge.color}` : "bg-muted"
                        )}>
                          <badge.icon className={cn("w-8 h-8", badge.unlocked ? "text-white" : "text-muted-foreground")} />
                        </div>
                        <div className="font-bold">{badge.name}</div>
                        {!badge.unlocked && (
                          <div className="text-xs text-muted-foreground mt-1 text-center">
                            🎯 {badge.condition}
                          </div>
                        )}
                        {badge.unlocked && (
                          <div className="text-xs text-success mt-1">✅ Unlocked!</div>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
              {activeTab === "saved" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6 rounded-xl">
                  <h3 className="font-display text-xl font-bold mb-6">Saved Opportunities</h3>
                  {loadingSaved ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                  ) : savedOpportunities.length > 0 ? (
                    <div className="space-y-4">
                      {savedOpportunities.map((opp) => (
                        <div
                          key={opp.id}
                          onClick={() => router.push(`/opportunity/${opp.id}`)}
                          className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all cursor-pointer group"
                        >
                          <div className="flex items-center gap-3">
                            {opp.image && (
                              <img src={opp.image} alt={opp.title} className="w-12 h-12 rounded-lg object-cover" />
                            )}
                            <div>
                              <div className="font-bold group-hover:text-primary transition-colors">{opp.title}</div>
                              <div className="text-sm text-muted-foreground flex items-center gap-2">
                                <Badge className="bg-primary/20 text-primary text-xs">{opp.type}</Badge>
                                {opp.organizer && <span>⬢ {opp.organizer}</span>}
                              </div>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Bookmark className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                      <p className="text-muted-foreground">No saved opportunities yet</p>
                      <Button className="mt-4" onClick={() => router.push("/")}>Explore Now</Button>
                    </div>
                  )}
                </motion.div>
              )}
              {activeTab === "activity" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6 rounded-xl">
                  <h3 className="font-display text-xl font-bold mb-6 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Activity Timeline
                  </h3>
                  <div className="space-y-6">
                    {generateActivityTimeline().map((activity, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex gap-4"
                      >
                        <div className="flex flex-col items-center">
                          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-primary to-secondary" />
                          {index < generateActivityTimeline().length - 1 && (
                            <div className="w-0.5 h-full bg-muted mt-2" />
                          )}
                        </div>
                        <div className="flex-1 pb-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-muted-foreground">{activity.action}</span>{" "}
                              <span className="font-medium">{activity.item}</span>
                            </div>
                            <span className="text-sm font-bold text-success">+{activity.xp} XP</span>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">{activity.time}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
            {/* Sidebar */}
            <div className="space-y-6">
              {/* Daily Challenge */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-card p-6 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10"
              >
                <h3 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
                  <Gift className="w-5 h-5 text-secondary" />
                  Daily Challenge
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Complete your profile to earn bonus XP!
                </p>
                <div className="flex items-center gap-2 mb-4">
                  <Progress value={profilePercent} className="flex-1" />
                  <span className="text-sm font-bold">{profilePercent}%</span>
                </div>
                <Button className="w-full" variant="secondary" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                  Power Up Profile
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </main >
      {/* ===== MODALS ===== */}
      <AnimatePresence>
        {
          activeModal === "grade" && (
            <ModalOverlay onClose={() => setActiveModal(null)}>
              <h3 className="text-xl font-black mb-2">What class are you in? 🎓</h3>
              <p className="text-sm text-muted-foreground mb-6">This helps us find age-appropriate opportunities</p>
              <div className="grid grid-cols-3 gap-3 mb-6">
                {GRADES.map((grade) => (
                  <button
                    key={grade}
                    onClick={() => setSelectedGrade(grade)}
                    className={cn(
                      "p-4 rounded-xl text-lg font-bold transition-all",
                      selectedGrade === grade
                        ? "bg-primary text-primary-foreground"
                        : "bg-white/5 hover:bg-white/10"
                    )}
                  >
                    {grade}
                  </button>
                ))}
              </div>
              <Button className="w-full" onClick={handleSaveGrade} disabled={!selectedGrade}>
                Save & Earn +50 XP
              </Button>
            </ModalOverlay>
          )
        }
        {
          activeModal === "school" && (
            <ModalOverlay onClose={() => setActiveModal(null)}>
              <h3 className="text-xl font-black mb-2">Where do you study? 🏫</h3>
              <p className="text-sm text-muted-foreground mb-4">Connect with school-specific events</p>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search your school..."
                  value={schoolSearch}
                  onChange={(e) => setSchoolSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="max-h-[300px] overflow-y-auto pr-2 mb-6 space-y-2 thin-scrollbar">
                {schools
                  .filter(s => s.name.toLowerCase().includes(schoolSearch.toLowerCase()))
                  .map((school) => (
                    <button
                      key={school.id}
                      onClick={() => {
                        setSelectedSchool(school.name);
                        setSchoolSearch("");
                      }}
                      className={cn(
                        "w-full p-4 rounded-xl text-left font-medium transition-all",
                        selectedSchool === school.name
                          ? "bg-primary text-primary-foreground"
                          : "bg-white/5 hover:bg-white/10"
                      )}
                    >
                      {school.name}
                    </button>
                  ))}
                <div className="pt-4 border-t border-white/10">
                  <p className="text-xs text-muted-foreground mb-2 px-1">Can't find your school?</p>
                  <button
                    onClick={() => setSelectedSchool("other")}
                    className={cn(
                      "w-full p-4 rounded-xl text-left font-medium transition-all italic",
                      selectedSchool === "other"
                        ? "bg-primary text-primary-foreground"
                        : "bg-white/5 hover:bg-white/10"
                    )}
                  >
                    Enter school manually...
                  </button>
                </div>
                {selectedSchool === "other" && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pt-2">
                    <Input
                      placeholder="Type your school name..."
                      onChange={(e) => setSchoolSearch(e.target.value)}
                      onBlur={(e) => setSelectedSchool(e.target.value)}
                      className="mt-2"
                    />
                  </motion.div>
                )}
              </div>
              <Button
                className="w-full"
                onClick={handleSaveSchool}
                disabled={!selectedSchool || selectedSchool === "other"}
              >
                Save & Earn +50 XP
              </Button>
            </ModalOverlay>
          )
        }
        {
          activeModal === "gender" && (
            <ModalOverlay onClose={() => setActiveModal(null)}>
              <h3 className="text-xl font-black mb-2">How do you identify? 👤</h3>
              <p className="text-sm text-muted-foreground mb-6">Personalize your experience</p>
              <div className="space-y-3 mb-6">
                {GENDER_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedGender(option.id)}
                    className={cn(
                      "w-full p-4 rounded-xl text-left font-medium transition-all",
                      selectedGender === option.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-white/5 hover:bg-white/10"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <Button className="w-full" onClick={handleSaveGender} disabled={!selectedGender}>
                Save & Earn +25 XP
              </Button>
            </ModalOverlay>
          )
        }
        {
          activeModal === "city" && (
            <ModalOverlay onClose={() => setActiveModal(null)}>
              <h3 className="text-xl font-black mb-2">Where are you from? 🌍</h3>
              <p className="text-sm text-muted-foreground mb-6">Find local opportunities near you</p>
              <Input
                placeholder="Type your city..."
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="mb-6"
              />
              <Button className="w-full" onClick={handleSaveCity} disabled={!selectedCity}>
                Save & Earn +25 XP
              </Button>
            </ModalOverlay>
          )
        }
        {
          activeModal === "name" && (
            <ModalOverlay onClose={() => setActiveModal(null)}>
              <h3 className="text-xl font-black mb-2">What's your name? ✍️</h3>
              <p className="text-sm text-muted-foreground mb-6">How should we call you?</p>
              <Input
                placeholder="Your name..."
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="mb-6"
              />
              <Button className="w-full" onClick={handleSaveName} disabled={!editName.trim()}>
                Update Name
              </Button>
            </ModalOverlay>
          )
        }
        {
          activeModal === "interests" && (
            <ModalOverlay onClose={() => setActiveModal(null)}>
              <h3 className="text-xl font-black mb-2">What excites you? ❤️</h3>
              <p className="text-sm text-muted-foreground mb-4">Pick at least 3 interests</p>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {INTERESTS.map((interest) => (
                  <button
                    key={interest.id}
                    onClick={() => toggleInterest(interest.id)}
                    className={cn(
                      "p-3 rounded-xl flex items-center gap-2 transition-all",
                      selectedInterests.includes(interest.id)
                        ? `bg-gradient-to-r ${interest.color} text-white`
                        : "bg-white/5 hover:bg-white/10"
                    )}
                  >
                    <interest.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{interest.label}</span>
                  </button>
                ))}
              </div>
              <p className="text-sm text-center text-muted-foreground mb-4">
                {selectedInterests.length}/3 selected
              </p>
              <Button className="w-full" onClick={handleSaveInterests} disabled={selectedInterests.length < 3}>
                Save & Earn +75 XP
              </Button>
            </ModalOverlay>
          )
        }
      </AnimatePresence >
      <Footer />
    </div >
  );
};
export default StudentProfilePage;
