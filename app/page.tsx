import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { AudienceSection } from "@/components/landing/AudienceSection";
import { Footer } from "@/components/landing/Footer";
import TradeXMockup from "@/components/landing/Mockup";

export default function LandingPage() {
  return (
    <main className="relative overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <div className="  max-w-7xl mx-auto">
        <TradeXMockup />
      </div>
      <FeaturesSection />
      <HowItWorksSection />
      <AudienceSection />
      <Footer />
    </main>
  );
}
