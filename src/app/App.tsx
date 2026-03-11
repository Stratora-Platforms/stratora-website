import { Navigation } from "./components/navigation";
import { Hero } from "./components/hero";
import { DashboardPreview } from "./components/dashboard-preview";
import { Stats } from "./components/stats";
import { Features } from "./components/features";
import { Pricing } from "./components/pricing";
import { Downloads } from "./components/downloads";
import { About } from "./components/about";
import { Footer } from "./components/footer";

export default function App() {
  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <Navigation />
      <main>
        <Hero />
        <DashboardPreview />
        <Stats />
        <Features />
        <Pricing />
        <Downloads />
        <About />
      </main>
      <Footer />
    </div>
  );
}