import SiteNav from "@/components/nav/SiteNav";
import CustomCursor from "@/components/ui/CustomCursor";
import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import Services from "@/components/sections/Services";
import Pricing from "@/components/sections/Pricing";
import FitList from "@/components/sections/FitList";
import WorkShowcase from "@/components/sections/WorkShowcase";
import VideoCarousel from "@/components/sections/VideoCarousel";
import AICommercials from "@/components/sections/AICommercials";
import ProcessTimeline from "@/components/sections/ProcessTimeline";
import QuoteBox from "@/components/sections/QuoteBox";
import Faq from "@/components/sections/Faq";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <div className="grain-overlay" aria-hidden="true"></div>
      <CustomCursor />
      <SiteNav />
      <main id="top">
        <Hero />
        <Marquee />
        <Services />
        <Pricing />
        <FitList />
        <WorkShowcase />
        <VideoCarousel />
        <AICommercials />
        <ProcessTimeline />
        <QuoteBox />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
