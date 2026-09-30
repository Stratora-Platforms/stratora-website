import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { ScaledStage } from "./scaled-stage";
import { STORY_STAGE, STORY_VISUALS } from "./why-stratora-visuals";

/**
 * "From detection to escalation to resolution" as a sticky scroll story.
 *
 * Replaces the five icon-title-paragraph cards. The copy is unchanged apart
 * from the one approved edit ("every audit event" → "every Stratora event").
 *
 * The opening paragraph is the blockquote that used to sit above the bullets;
 * it leads the story, so the visual beside it is the fragmented-tools stack
 * the sentence describes. Each paragraph owns one visual, chosen by scroll
 * position and by clicking, and every visual shows a shipped capability.
 */

type Para = { lead: string; body: string };

/** How long each paragraph holds before the story advances on its own. */
const DWELL_MS = 5000;

const PARAS: Para[] = [
  {
    lead: "",
    body:
      "If your monitoring stack is a thing that polls switches, another thing that watches servers, a separate alerting layer that's never quite tuned, and dashboards that need a meeting to interpret — that's the stack Stratora was built to replace.",
  },
  {
    lead: "Stop paying for four tools that don't talk to each other.",
    body:
      "Stratora ships dashboards, alerting, topology, IPAM, and SIEM-bound audit forwarding as one platform — installed from a single MSI.",
  },
  {
    lead: "Runs entirely on your infrastructure.",
    body:
      "No SaaS tenant, no metric data leaving your network, no vendor outage that takes your monitoring with it.",
  },
  {
    lead: "License validation is fully offline.",
    body:
      "The Ed25519-signed license file is verified against a public key embedded in the binary — no internet connection, no version-check, no telemetry.",
  },
  {
    lead: "Built for the person on call at 2AM — not the person presenting dashboards in a meeting.",
    body: "Clarity over clutter, signal over noise, speed over complexity.",
  },
  {
    lead: "Procurement-ready out of the box.",
    body:
      "Full audit trail, real-time SIEM forwarding for every Stratora event, RBAC with LDAP/AD and OIDC SSO — without a separate compliance project.",
  },
];

export function WhyStratora() {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const [onScreen, setOnScreen] = useState(false);
  const [reduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  /* The sticky stage this drives is `hidden lg:block`. Without the breakpoint
     check a phone would still remount a full story visual every 5s behind
     display:none. */
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches,
  );
  /* Mobile only, and deliberately separate from `active`: the accordion is
     driven by taps, not by scroll position. Index 1 — the first of the five
     states — starts open so the pattern is legible without a tap. */
  const [open, setOpen] = useState(1);
  const headerRefs = useRef<(HTMLButtonElement | null)[]>([]);
  /** Header to hold still across a toggle, captured before the state change. */
  const anchorRef = useRef<{ index: number; top: number } | null>(null);

  const toggle = (i: number) => {
    const top = headerRefs.current[i]?.getBoundingClientRect().top;
    if (top !== undefined) anchorRef.current = { index: i, top };
    setOpen((current) => (current === i ? -1 : i));
  };

  /* Closing a taller panel above the one being tapped drops everything below
     it by the panel's height — enough to throw the header out from under the
     reader's thumb. Pin the tapped header to the viewport offset it had before
     the toggle.
     A single frame isn't enough: the visual inside the opening panel is a
     ScaledStage, which measures itself and sets the wrapper height from a
     ResizeObserver callback, so the layout keeps settling for several frames.
     Re-correct across a short window, and stop the moment the reader scrolls
     themselves so we never fight a deliberate gesture. */
  useLayoutEffect(() => {
    const anchor = anchorRef.current;
    if (!anchor) return;
    anchorRef.current = null;

    let frame = 0;
    let raf = 0;
    let cancelled = false;

    const stop = () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchstart", stop);
      window.removeEventListener("keydown", stop);
    };

    const correct = () => {
      if (cancelled) return;
      const node = headerRefs.current[anchor.index];
      if (node) {
        const drift = node.getBoundingClientRect().top - anchor.top;
        if (Math.abs(drift) > 1) {
          window.scrollBy({ top: drift, behavior: "instant" as ScrollBehavior });
        }
      }
      if (++frame < 12) raf = requestAnimationFrame(correct);
      else stop();
    };

    window.addEventListener("wheel", stop, { passive: true });
    window.addEventListener("touchstart", stop, { passive: true });
    window.addEventListener("keydown", stop);
    raf = requestAnimationFrame(correct);

    return stop;
  }, [open]);

  /* The active paragraph used to be chosen by scroll position — whichever one
     crossed the middle band of the viewport won. That's gone: it advances on
     its own every 5s instead, and a click still picks one directly. */
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => setOnScreen(entries.some((e) => e.isIntersecting)),
      { threshold: 0.2 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setIsDesktop(mq.matches);
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  /* One self-scheduling timeout keyed on `active`, so a click restarts the
     dwell from that instant rather than leaving a partly-elapsed timer to fire
     early. Paused off screen, and off entirely under reduced motion — content
     that swaps itself every 5s is exactly what that preference asks to stop. */
  useEffect(() => {
    if (reduced || !onScreen || !isDesktop) return;
    const id = window.setTimeout(
      () => setActive((prev) => (prev + 1) % PARAS.length),
      DWELL_MS,
    );
    return () => window.clearTimeout(id);
  }, [active, onScreen, isDesktop, reduced]);

  const Visual = STORY_VISUALS[active];

  return (
    <section id="why-stratora" ref={sectionRef} className="st-scope relative px-6 py-20">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px 15% 0px" }}
          transition={{ duration: 0.32, ease: "easeOut" }}
          className="max-w-3xl mx-auto mb-14 text-center"
        >
          <h2 className="text-3xl md:text-5xl mb-4 tracking-tight">
            From detection to escalation to resolution — in one system.
          </h2>
          <p className="text-lg text-muted-foreground">
            Monitoring, alerting, escalation, topology, and audit forwarding —
            built as a single platform, deployed on your network.
          </p>
        </motion.div>

        <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,660px)_minmax(0,1fr)] lg:gap-16 lg:items-start">
          {/* Sticky stage — desktop only. Below lg each paragraph carries its
              own visual inline instead, so nothing is pinned on a phone. */}
          <div className="hidden lg:block lg:sticky lg:top-28">
            <ScaledStage
              width={STORY_STAGE.width}
              height={STORY_STAGE.height}
              className="st-stage"
            >
              <Visual key={active} />
            </ScaledStage>
          </div>

          {/* Desktop rail — unchanged. */}
          <div className="hidden min-w-0 lg:flex lg:flex-col lg:gap-1">
            {PARAS.map((para, i) => (
              <button
                key={para.body}
                type="button"
                onClick={() => setActive(i)}
                aria-current={i === active}
                className={`st-para${i === active ? " is-on" : ""}`}
              >
                <span className="st-para-bar" />
                <span className="st-para-text">
                  {para.lead ? <span className="st-para-lead">{para.lead}</span> : null}
                  {para.lead ? " " : null}
                  {para.body}
                </span>
              </button>
            ))}
          </div>

          {/* Mobile — an accordion. Every paragraph previously carried its own
              full-size visual inline, so the section ran to six stacked stages
              and the reader had to scroll past all of them to see what the
              story covered. The five state names are now always on screen and
              one body is open at a time. */}
          <div className="st-acc lg:hidden">
            {/* PARAS[0] is the blockquote that opens the story rather than one
                of the five states, so it stays open and uncollapsed. */}
            <div className="st-acc-lead">
              <ScaledStage
                width={STORY_STAGE.width}
                height={STORY_STAGE.height}
                className="st-stage"
              >
                {(() => {
                  const Opening = STORY_VISUALS[0];
                  return <Opening />;
                })()}
              </ScaledStage>
              <p className="st-acc-lead-text">{PARAS[0].body}</p>
            </div>

            {PARAS.slice(1).map((para, n) => {
              const i = n + 1;
              const isOpen = i === open;
              const Panel = STORY_VISUALS[i];
              return (
                <div key={para.body} className="st-acc-item" data-on={isOpen ? "true" : "false"}>
                  <h3 className="st-acc-h">
                    <button
                      type="button"
                      id={`story-acc-${i}`}
                      ref={(el) => {
                        headerRefs.current[i] = el;
                      }}
                      aria-expanded={isOpen}
                      aria-controls={`story-panel-${i}`}
                      onClick={() => toggle(i)}
                      className="st-acc-btn"
                    >
                      <span className="st-acc-title">{para.lead}</span>
                      <svg
                        className="st-acc-chev"
                        aria-hidden="true"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </button>
                  </h3>
                  <div
                    id={`story-panel-${i}`}
                    role="region"
                    aria-labelledby={`story-acc-${i}`}
                    hidden={!isOpen}
                    className="st-acc-panel"
                  >
                    {/* Only the open panel mounts a stage — six live visuals on
                        a phone is six animation loops nobody is watching. */}
                    {isOpen ? (
                      <ScaledStage
                        width={STORY_STAGE.width}
                        height={STORY_STAGE.height}
                        className="st-stage"
                      >
                        <Panel />
                      </ScaledStage>
                    ) : null}
                    <p className="st-acc-body">{para.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
