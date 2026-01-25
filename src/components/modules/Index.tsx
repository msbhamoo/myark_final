import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import StoriesCarousel from "@/components/StoriesCarousel";
import Categories from "@/components/Categories";
import FeaturedOpportunities from "@/components/FeaturedOpportunities";
import GameSection from "@/components/GameSection";
import BlogSection from "@/components/BlogSection";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-primary/20">
      <SEO
        title="Myark | Discover Amazing Opportunities & Level Up 🚀"
        description="The ultimate RPG for your real-life success. Find scholarships, competitions, olympiads, and careers tailored for ambitious students."
        url="https://myark.in"
      />
      <Navbar />
      <main>
        <Hero />
        <StoriesCarousel />
        <Categories />
        <FeaturedOpportunities />
        <GameSection />
        <BlogSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
