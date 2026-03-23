import { useState, useEffect } from "react";
import { Navigation } from "./components/navigation";
import { Hero } from "./components/hero";
import { DashboardPreview } from "./components/dashboard-preview";
import { Stats } from "./components/stats";
import { Features } from "./components/features";
import { Pricing } from "./components/pricing";
import { Downloads } from "./components/downloads";
import { About } from "./components/about";
import { Footer } from "./components/footer";
import { Billing } from "./components/billing";

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
      <Stats />
      <Features />
      <Pricing />
      <Downloads />
      <About />
    </>
  );
}

export default function App() {
  const [path, setPath] = useState(getInitialPath);

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <Navigation />
      <main>
        {path === "/billing" ? <Billing /> : <LandingPage />}
      </main>
      <Footer />
    </div>
  );
}
