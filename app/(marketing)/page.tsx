import { HeroSection } from "@/components/marketing/hero-section";
import { BeforeAfterGallery } from "@/components/marketing/before-after-gallery";
import { FeaturesSection } from "@/components/marketing/features-section";
import { HowItWorksSection } from "@/components/marketing/how-it-works-section";
import { PricingPreviewSection } from "@/components/marketing/pricing-preview-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <BeforeAfterGallery />
      <FeaturesSection />
      <HowItWorksSection />
      <PricingPreviewSection />
    </>
  );
}
