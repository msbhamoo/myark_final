import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Explore from "@/pages/Explore";
import OpportunityDetail from "@/pages/OpportunityDetail";
import StudentProfile from "@/pages/StudentProfile";
import ForSchools from "@/pages/ForSchools";
import PublicBlog from "@/pages/Blog";
import BlogDetail from "@/pages/BlogDetail";
import PublicCareers from "@/pages/Careers";
import CareerDetail from "@/pages/CareerDetail";
import QuestMaster from "@/pages/QuestMaster";
import About from "@/pages/About";
import HelpCenter from "@/pages/HelpCenter";
import Contact from "@/pages/Contact";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import Premium from "@/pages/Premium";
import Rewards from "@/pages/Rewards";
import NotFound from "@/pages/NotFound";
import { AuthProvider } from "./lib/auth";
import { StudentAuthProvider } from "./lib/studentAuth";
import { AuthModal } from "./components/auth";

// Admin imports
import {
  AdminLayout,
  AdminLogin,
  Dashboard,
  Opportunities,
  OpportunityForm,
  Blog,
  BlogForm,
  Careers,
  CareerForm,
  Students,
  Schools,
  Notifications,
  Settings,
  Organizers,
  Badges,
  GamificationSettings,
  Partners,
  Redemption,
  UsersManager,
} from "@/pages/admin";
import CommunitySignals from "./components/CommunitySignals";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <StudentAuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/opportunity/:id" element={<OpportunityDetail />} />
              <Route path="/profile" element={<StudentProfile />} />
              <Route path="/schools" element={<ForSchools />} />
              <Route path="/blog" element={<PublicBlog />} />
              <Route path="/blog/:slug" element={<BlogDetail />} />
              <Route path="/careers" element={<PublicCareers />} />
              <Route path="/careers/:slug" element={<CareerDetail />} />
              <Route path="/quest-master" element={<QuestMaster />} />
              <Route path="/about" element={<About />} />
              <Route path="/help" element={<HelpCenter />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/premium" element={<Premium />} />
              <Route path="/rewards" element={<Rewards />} />

              {/* Admin Login */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Admin Routes (Protected) */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="opportunities" element={<Opportunities />} />
                <Route path="opportunities/new" element={<OpportunityForm />} />
                <Route path="opportunities/:id" element={<OpportunityForm />} />
                <Route path="blog" element={<Blog />} />
                <Route path="blog/new" element={<BlogForm />} />
                <Route path="blog/:id" element={<BlogForm />} />
                <Route path="careers" element={<Careers />} />
                <Route path="careers/new" element={<CareerForm />} />
                <Route path="careers/:id" element={<CareerForm />} />
                <Route path="students" element={<Students />} />
                <Route path="schools" element={<Schools />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="settings" element={<Settings />} />
                <Route path="organizers" element={<Organizers />} />
                <Route path="badges" element={<Badges />} />
                <Route path="gamification" element={<GamificationSettings />} />
                <Route path="partners" element={<Partners />} />
                <Route path="rewards" element={<Redemption />} />
                <Route path="users" element={<UsersManager />} />
              </Route>

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <CommunitySignals />
          </BrowserRouter>
          <AuthModal />
        </TooltipProvider>
      </StudentAuthProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;



