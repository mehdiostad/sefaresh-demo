export const dynamic = "force-dynamic";
import { LoadingSpinner } from "./loading";
import Link from "next/link";
import { HeroSection } from "@/components/Layout/sections/hero";
import { SponsorsSection } from "@/components/Layout/sections/sponsors";
import { BenefitsSection } from "@/components/Layout/sections/benefits";
import { FeaturesSection } from "@/components/Layout/sections/features";
import { ServicesSection } from "@/components/Layout/sections/services";
// import { TestimonialSection } from "@/components/Layout/sections/testimonial";
// import { TeamSection } from "@/components/Layout/sections/team";
import { CommunitySection } from "@/components/Layout/sections/community";
import { PricingSection } from "@/components/Layout/sections/pricing";
import { ContactSection } from "@/components/Layout/sections/contact";
// import { FAQSection } from "@/components/Layout/sections/faq";
import { FooterSection } from "@/components/Layout/sections/footer";
import { ThemeProvider } from "@/components/Providers/ThemeProvider";
import { Navbar } from "@/components/Layout/navbar";
const page = async () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen landing-dark p-4 md:p-0 font-yekan">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />

       
        {/* todo: this page will be landing! */}
        <HeroSection />
        {/* <SponsorsSection /> */}
        {/* <BenefitsSection /> */}
        <FeaturesSection />
        {/* <ServicesSection /> */}
        {/* <TestimonialSection /> */}
        {/* <TeamSection /> */}
        {/* <CommunitySection /> */}
        <PricingSection />
        {/* <ContactSection /> */}
        {/* <FAQSection /> */}
        <FooterSection />
    </ThemeProvider>
      </div>
  );
};
export default page;
