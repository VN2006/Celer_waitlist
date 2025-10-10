import Header from "@/components/Header";
import Hero from "@/components/Hero";
import AboutCeler from "@/components/AboutCeler";
import HowItWorks from "@/components/HowItWorks";
import MissionVision from "@/components/MissionVision";
import LogoMarquee from "@/components/LogoMarquee";
import WaitlistForm from "@/components/WaitlistForm";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <AboutCeler />
      <HowItWorks />
      <MissionVision />
      <LogoMarquee />
      <WaitlistForm />
      <Footer />
    </main>
  );
}
