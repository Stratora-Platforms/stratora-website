import { useEffect, useRef, useState } from "react";
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
  /** Set once the reader picks a paragraph, so scrolling stops overriding them. */
  const pickedRef = useRef(false);
  const paraRefs = useRef<(HTMLButtonElement | null)[]>([]);

  /* Scroll drives the active paragraph: whichever one is crossing the middle
     band of the viewport wins. The margins leave a ~10% band so exactly one
     paragraph qualifies at a time. */
  useEffect(() => {
    const nodes = paraRefs.current.filter(Boolean) as HTMLButtonElement[];
    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (pickedRef.current) return;
        const hit = entries.find((entry) => entry.isIntersecting);
        if (!hit) return;
        const index = nodes.indexOf(hit.target as HTMLButtonElement);
        if (index >= 0) setActive(index);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  const Visual = STORY_VISUALS[active];

  return (
    <section id="why-stratora" className="st-scope relative px-6 py-20">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mb-14"
        >
          <h2 className="text-3xl md:text-5xl mb-4 tracking-tight">
            From detection to escalation to resolution — in one system.
          </h2>
          <p className="text-lg text-muted-foreground">
            Monitoring, alerting, escalation, topology, and audit forwarding —
            built as a single platform, deployed on your network.
          </p>
        </motion.div>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,660px)_minmax(0,1fr)] lg:gap-16 lg:items-start">
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

          <div className="flex flex-col gap-1">
            {PARAS.map((para, i) => (
              <div key={para.body}>
                {/* Mobile: the visual sits above the paragraph it belongs to. */}
                <div className="lg:hidden mb-3">
                  <ScaledStage
                    width={STORY_STAGE.width}
                    height={STORY_STAGE.height}
                    className="st-stage"
                  >
                    {(() => {
                      const Inline = STORY_VISUALS[i];
                      return <Inline />;
                    })()}
                  </ScaledStage>
                </div>

                <button
                  type="button"
                  ref={(el) => {
                    paraRefs.current[i] = el;
                  }}
                  onClick={() => {
                    pickedRef.current = true;
                    setActive(i);
                  }}
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
