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
import { AppPreview, type ViewId } from "./app-preview/app-preview";

type Slide = {
  id: ViewId;
  title: string;
  caption: string;
  /** Short label for the selector strip. */
  short: string;
};

const SLIDES: Slide[] = [
  {
    id: "dashboard",
    title: "Global NOC dashboard",
    caption: "Build custom command-center views from drag-and-drop panels.",
    short: "NOC dashboard",
  },
  {
    id: "world-map",
    title: "Multi-site visibility",
    caption: "Monitor distributed sites on a live geographic map.",
    short: "World map",
  },
  {
    id: "topology",
    title: "Visual network topology",
    caption: "Auto-discovered maps you can arrange, group, and annotate.",
    short: "Topology",
  },
  {
    id: "alerts",
    title: "Alerting that scales",
    caption: "Severity-ranked alerts with acknowledge and escalate inline.",
    short: "Alerts",
  },
  {
    id: "escalation",
    title: "On-call escalation",
    caption: "Time-based schedules, rotations, and multi-channel routing.",
    short: "Escalation",
  },
  {
    id: "site-overview",
    title: "Site health at a glance",
    caption: "Health history, networks, and device breakdown per site.",
    short: "Site health",
  },
  {
    id: "ipam",
    title: "Built-in IPAM",
    caption: "Track subnets, VLANs, and utilization across every site.",
    short: "IPAM",
  },
  {
    id: "rack",
    title: "Rack visualization",
    caption: "Map physical placement and U-height across your racks.",
    short: "Racks",
  },
];

export function ScreenshotGallery() {
  const [api, setApi] = useState<CarouselApi>();
  const [selected, setSelected] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

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

  /* Each slide is a full app view — roughly 300 elements and its own render
     pass. Mounting all eight up front costs ~600ms of main-thread time for
     seven views nobody is looking at, so they wait until the gallery is near
     the viewport, and then only the current slide and its neighbours mount.
     Unmounted slides keep a 16:9 spacer so the carousel's layout never
     shifts. */
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const scrollTo = useCallback((index: number) => api?.scrollTo(index), [api]);

  const count = SLIDES.length;
  const isMounted = (i: number) =>
    inView &&
    (i === selected || i === (selected + 1) % count || i === (selected - 1 + count) % count);

  const active = SLIDES[selected];

  return (
    <section id="screenshots" ref={sectionRef} className="relative px-6 py-20">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px 15% 0px" }}
          transition={{ duration: 0.32, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl mb-4">See Stratora in action</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From the NOC dashboard to rack-level detail — explore the platform.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px 15% 0px" }}
          transition={{ duration: 0.32, ease: "easeOut" }}
          // Full container width. max-w-6xl held this to 1152 while every
          // other section ran to 1280, which read as the carousel being
          // inset from the rest of the page.
          className="mx-auto"
        >
          <Carousel setApi={setApi} opts={{ loop: true }}>
            {/* Picker — above the view, so the control that names the slides
                comes before the thing it controls. One responsive row rather
                than a desktop strip plus a mobile dot rail: the dots never
                named the view, and with the per-slide <h3> gone that left
                phones with no way to tell which view they were looking at.
                Scrolls horizontally below md, wraps and centres from md up. */}
            <div
              className="mb-8 flex gap-2 overflow-x-auto pb-2 md:flex-wrap md:items-center md:justify-center md:overflow-visible md:pb-0"
              role="group"
              aria-label="Choose a view"
            >
              {SLIDES.map((slide, i) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => scrollTo(i)}
                  aria-label={`View ${slide.title}`}
                  aria-current={i === selected}
                  className={cn(
                    "shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm transition-all",
                    i === selected
                      ? "border-orange-accent text-foreground shadow-[0_0_16px_rgba(255,152,24,0.35)]"
                      : "border-border/50 text-muted-foreground hover:text-foreground hover:border-orange-bright",
                  )}
                >
                  {slide.short}
                </button>
              ))}
            </div>

            {/* Main viewer. Each slide renders the app view live rather than as
                an image, so it stays sharp at any size — the frame is a fixed
                16:9 because that is the app's 1920x1080 layout. */}
            <div className="relative rounded-2xl border border-purple-500/20 overflow-hidden shadow-2xl shadow-purple-900/20">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-purple-800/20 rounded-2xl blur-xl -z-10" />
              <CarouselContent className="ml-0">
                {SLIDES.map((slide, i) => (
                  /* The title is no longer shown — aria-label keeps it as the
                     slide's accessible name for screen readers and the copy
                     check, which reads aria-labels as well as text. */
                  <CarouselItem key={slide.id} className="pl-0" aria-label={slide.title}>
                    {isMounted(i) ? (
                      /* Animation is gated on the active slide too: embla lays
                         every slide out in one track, so a mounted neighbour
                         would otherwise animate off-screen. */
                      <AppPreview view={slide.id} active={i === selected} />
                    ) : (
                      <div style={{ aspectRatio: "1920 / 1080" }} />
                    )}
                  </CarouselItem>
                ))}
              </CarouselContent>

              <CarouselPrevious className="left-4 bg-background/60 backdrop-blur-sm border-orange-accent/40 dark:border-orange-accent/60 dark:bg-background/60 text-foreground shadow-[0_0_14px_rgba(255,152,24,0.35)] hover:bg-orange-accent/20" />
              <CarouselNext className="right-4 bg-background/60 backdrop-blur-sm border-orange-accent/40 dark:border-orange-accent/60 dark:bg-background/60 text-foreground shadow-[0_0_14px_rgba(255,152,24,0.35)] hover:bg-orange-accent/20" />
            </div>

            {/* Caption — below the view, swapping with the slide. The title
                that used to sit above it is gone: the picker already names
                the view, so the heading only repeated it.

                Height is reserved rather than letting the block grow and
                shrink, because captions wrap to different line counts and the
                page would jog on every switch. Only the active caption is
                rendered — stacking all eight in one grid cell would size to
                the tallest automatically, but it would also put every caption
                in the section's textContent at once, and the copy check
                proves the tabs work by watching that text change per slide. */}
            <div className="mt-8 flex items-start justify-center min-h-[72px] sm:min-h-[48px] md:min-h-[24px]">
              <p className="text-muted-foreground max-w-2xl text-center">{active.caption}</p>
            </div>
          </Carousel>
        </motion.div>
      </div>
    </section>
  );
}
