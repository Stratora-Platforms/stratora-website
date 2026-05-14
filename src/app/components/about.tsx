export function About() {
  return (
    <section id="about" className="relative py-24 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-purple-950/5 to-background pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="mb-12 text-center">
            <h2 className="text-3xl md:text-5xl mb-4">
              About Stratora
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Monitoring that works out of the box — no specialists required.
            </p>
          </div>

          {/* Content */}
          <div className="space-y-6 text-muted-foreground leading-relaxed text-center">
            <p>
              Stratora was built by engineers who have lived through the pain of fragmented monitoring stacks, noisy alerts, and dashboards that look impressive but answer nothing when things break.
            </p>

            <p>
              Modern infrastructure moves fast — faster than legacy tools were ever designed to handle. Metrics, alerts, topology, and inventory shouldn't live in silos, and neither should the teams responsible for uptime.
            </p>

            <p>
              Stratora brings infrastructure monitoring together into a single, cohesive platform. One place to see what's happening, understand why it's happening, and act before users ever notice.
            </p>

            <p>
              We focus on clarity over clutter, signal over noise, and speed over complexity — so teams can spend less time fighting tools and more time building reliable systems.
            </p>

            <p>
              Whether you're monitoring a single environment or a global, mission-critical platform, Stratora scales with you — without the friction.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}