import { HeroSection } from "@/components/public/landing/hero-section"
import { ServicesSection } from "@/components/public/landing/services-section"
import { WhyUsSection } from "@/components/public/landing/why-us-section"
import { FAQSection } from "@/components/public/landing/faq-section"
import { CTASection } from "@/components/public/landing/cta-section"

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <WhyUsSection />
      <FAQSection />
      <CTASection />
    </>
  )
}