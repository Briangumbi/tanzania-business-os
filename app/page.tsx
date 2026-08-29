import { LandingNav } from "@/components/landing/LandingNav";
import { Hero } from "@/components/landing/Hero";
import { Problem } from "@/components/landing/Problem";
import { Vision } from "@/components/landing/Vision";
import { WhatsBuilt } from "@/components/landing/WhatsBuilt";
import { DesignRationale } from "@/components/landing/DesignRationale";
import { ScreensDemo } from "@/components/landing/ScreensDemo";
import { WhatsNext } from "@/components/landing/WhatsNext";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <LandingNav />
      <Hero />
      <Problem />
      <Vision />
      <WhatsBuilt />
      <ScreensDemo />
      <DesignRationale />
      <WhatsNext />
      <LandingFooter />
    </div>
  );
}
