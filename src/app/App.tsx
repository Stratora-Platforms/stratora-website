import { useState, useEffect } from "react";
import { MotionConfig } from "motion/react";
import { Navigation } from "./components/navigation";
import { Hero } from "./components/hero";
import { DashboardPreview } from "./components/dashboard-preview";
import { ProofStrip } from "./components/proof-strip";
import { ScreenshotGallery } from "./components/screenshot-gallery";
import { WhyStratora } from "./components/why-stratora";
import { HowItWorks } from "./components/how-it-works";
import { Stats } from "./components/stats";
import { Features } from "./components/features";
import { SecurityCompliance } from "./components/security-compliance";
import { Pricing } from "./components/pricing";
import { Downloads } from "./components/downloads";
import { About } from "./components/about";
import { Footer } from "./components/footer";
import { Billing } from "./components/billing";
import { PrivacyPolicyPage } from "./pages/PrivacyPolicyPage";
import { TermsPage } from "./pages/TermsPage";
import { NotFoundPage } from "./pages/NotFoundPage";

function getInitialPath(): string {
  const redirect = sessionStorage.getItem("redirect");
  if (redirect) {
    sessionStorage.removeItem("redirect");
    window.history.replaceState(null, "", redirect);
    return redirect;
  }
  return window.location.pathname;
}

function LandingPage() {
  return (
    <>
      <Hero />
      <DashboardPreview />
      <ProofStrip />
      <ScreenshotGallery />
      <WhyStratora />

      <HowItWorks />
      <Stats />
      <Features />
      <SecurityCompliance />
      <Pricing />
      <Downloads />
      <About />
    </>
  );
}

export default function App() {
  const [path, setPath] = useState(getInitialPath);

  useEffect(() => {
    const sync = () => setPath(window.location.pathname);
    window.addEventListener("popstate", sync);
    window.addEventListener("app:navigate", sync);
    return () => {
      window.removeEventListener("popstate", sync);
      window.removeEventListener("app:navigate", sync);
    };
  }, []);

  return (
    // reducedMotion="user" makes every motion component on the site honour
    // prefers-reduced-motion in one place: transforms are dropped and the
    // entrances resolve to a plain fade, rather than each section having to
    // opt in individually.
    <MotionConfig reducedMotion="user">
      <div className="dark min-h-screen bg-background text-foreground">
        <Navigation />
        <main>
          {path === "/billing" ? <Billing /> :
           path === "/privacy-policy" ? <PrivacyPolicyPage /> :
           path === "/terms" ? <TermsPage /> :
           path === "/" ? <LandingPage /> :
           <NotFoundPage />}
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
