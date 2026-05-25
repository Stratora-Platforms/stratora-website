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

      {/* How It Works */}
      <section className="relative px-6 py-20">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Up and running in three steps</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              No consultants. No weeks-long rollout. No cloud dependency.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: '01',
                title: 'Install',
                body: 'Run the MSI on Windows Server 2022. Stratora is fully operational in minutes — server, collector, and agent support included in a single installer.',
              },
              {
                step: '02',
                title: 'Discover',
                body: 'Point Stratora at your network. SNMP polling, agent registration, and ping monitoring begin automatically. Templates match your devices and apply configuration immediately.',
              },
              {
                step: '03',
                title: 'Monitor',
                body: 'Dashboards, network topology maps, and alert routing are live from the start. See what\'s happening, get notified when it matters, and act before users notice.',
              },
            ].map((item) => (
              <div key={item.step} className="relative p-6 rounded-xl border border-border/50 bg-card/30">
                <div className="text-4xl font-bold text-purple-500/30 mb-4 leading-none">{item.step}</div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

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
        {path === "/billing" ? <Billing /> :
         path === "/privacy-policy" ? <PrivacyPolicyPage /> :
         path === "/terms" ? <TermsPage /> :
         path === "/" ? <LandingPage /> :
         <NotFoundPage />}
      </main>
      <Footer />
    </div>
  );
}
