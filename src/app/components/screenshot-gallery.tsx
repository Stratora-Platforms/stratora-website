import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "motion/react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "./ui/carousel";
import { cn } from "./ui/utils";

type Screenshot = {
  file: string;
  title: string;
  caption: string;
};

const SCREENSHOTS: Screenshot[] = [
  {
    file: "dashboard.png",
    title: "Global NOC dashboard",
    caption: "Build custom command-center views from drag-and-drop panels.",
  },
  {
    file: "world-map.png",
    title: "Multi-site visibility",
    caption: "Monitor distributed sites on a live geographic map.",
  },
  {
    file: "topology.png",
    title: "Visual network topology",
    caption: "Auto-discovered maps you can arrange, group, and annotate.",
  },
  {
    file: "alerts.png",
    title: "Alerting that scales",
    caption: "Severity-ranked alerts with acknowledge and escalate inline.",
  },
  {
    file: "escalation.png",
    title: "On-call escalation",
    caption: "Time-based schedules, rotations, and multi-channel routing.",
  },
  {
    file: "site-overview.png",
    title: "Site health at a glance",
    caption: "Health history, networks, and device breakdown per site.",
  },
  {
    file: "ipam.png",
    title: "Built-in IPAM",
    caption: "Track subnets, VLANs, and utilization across every site.",
  },
  {
    file: "rack.png",
    title: "Rack visualization",
    caption: "Map physical placement and U-height across your racks.",
  },
];

// Match dashboard-preview.tsx: hide the image if the asset fails to load.
const hideOnError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  e.currentTarget.style.display = "none";
};

export function ScreenshotGallery() {
  const [api, setApi] = useState<CarouselApi>();
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setSelected(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  const scrollTo = useCallback((index: number) => api?.scrollTo(index), [api]);

  // Embla lays all slides in one flex track, so the viewport is as tall as the
  // tallest screenshot. Drive the frame height from the active image instead, so
  // the bordered frame hugs whichever screenshot is showing.
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const [frameHeight, setFrameHeight] = useState<number>();

  const measure = useCallback(() => {
    const height = imgRefs.current[selected]?.clientHeight;
    if (height) setFrameHeight(height);
  }, [selected]);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  const active = SCREENSHOTS[selected];

  return (
    <section id="screenshots" className="relative px-6 py-20">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl mb-4">See Stratora in action</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From the NOC dashboard to rack-level detail — explore the platform.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          <Carousel setApi={setApi} opts={{ loop: true }}>
            {/* Main viewer — framed to match dashboard-preview.tsx */}
            <div
              className="relative rounded-2xl border border-purple-500/20 overflow-hidden shadow-2xl shadow-purple-900/20 transition-[height] duration-300"
              style={frameHeight ? { height: frameHeight } : undefined}
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-purple-800/20 rounded-2xl blur-xl -z-10" />
              <CarouselContent className="ml-0">
                {SCREENSHOTS.map((shot, i) => (
                  <CarouselItem key={shot.file} className="pl-0">
                    <img
                      ref={(el) => {
                        imgRefs.current[i] = el;
                      }}
                      src={`/screenshots/${shot.file}`}
                      alt={`Stratora — ${shot.title}: ${shot.caption}`}
                      className="w-full h-auto block"
                      loading="lazy"
                      onLoad={() => {
                        if (i === selected) measure();
                      }}
                      onError={hideOnError}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>

              <CarouselPrevious className="left-4 bg-background/60 backdrop-blur-sm border-orange-accent/40 text-foreground shadow-[0_0_12px_rgba(255,152,24,0.25)] hover:bg-orange-accent/20" />
              <CarouselNext className="right-4 bg-background/60 backdrop-blur-sm border-orange-accent/40 text-foreground shadow-[0_0_12px_rgba(255,152,24,0.25)] hover:bg-orange-accent/20" />
            </div>

            {/* Active title + caption */}
            <div className="text-center mt-8">
              <h3 className="text-xl md:text-2xl font-semibold mb-2">{active.title}</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">{active.caption}</p>
            </div>

            {/* Thumbnail strip — desktop (md+) */}
            <div className="hidden md:grid grid-cols-8 gap-3 mt-8">
              {SCREENSHOTS.map((shot, i) => (
                <button
                  key={shot.file}
                  type="button"
                  onClick={() => scrollTo(i)}
                  aria-label={`View ${shot.title}`}
                  aria-current={i === selected}
                  className={cn(
                    "relative rounded-lg overflow-hidden border transition-all",
                    i === selected
                      ? "border-orange-accent opacity-100 shadow-[0_0_16px_rgba(255,152,24,0.35)]"
                      : "border-border/50 opacity-50 hover:opacity-100 hover:border-orange-bright",
                  )}
                >
                  <img
                    src={`/screenshots/${shot.file}`}
                    alt=""
                    className="block w-full aspect-video object-cover object-top"
                    loading="lazy"
                    onError={hideOnError}
                  />
                </button>
              ))}
            </div>

            {/* Dot indicators — mobile (<md) */}
            <div className="flex md:hidden items-center justify-center gap-2 mt-6">
              {SCREENSHOTS.map((shot, i) => (
                <button
                  key={shot.file}
                  type="button"
                  onClick={() => scrollTo(i)}
                  aria-label={`Go to ${shot.title}`}
                  aria-current={i === selected}
                  className={cn(
                    "h-2 rounded-full transition-all",
                    i === selected ? "w-6 bg-orange-accent" : "w-2 bg-muted-foreground/40",
                  )}
                />
              ))}
            </div>
          </Carousel>
        </motion.div>
      </div>
    </section>
  );
}
