import { Download, ExternalLink } from "lucide-react";
import { motion } from "motion/react";
import { RELEASE_VERSION, MSI_DOWNLOAD_URL, RELEASE_NOTES_URL } from "../constants";
import { navigate } from "../lib/navigate";
import { subscribeHref } from "../lib/hubspot";

/**
 * Downloads — restyle only.
 *
 * Same text and the same constants: MSI_DOWNLOAD_URL, RELEASE_NOTES_URL and
 * RELEASE_VERSION. The approved look puts the heading and the two actions on
 * the left and the release contents on the right, with what ships listed as
 * chips rather than buried in the sentence — the sentence stays too.
 *
 * Approved copy change: the footnote now reads "Requires Windows Server."
 */

const CONTENTS = ["Stratora Server", "Windows Agent", "Linux Agent (.deb / .rpm)", "Collector"];

const SUBSCRIBE_HREF = subscribeHref("downloads");

export function Downloads() {
  return (
    <section id="downloads" className="st-scope relative px-6 py-20">
      <div className="container mx-auto">
        {/* Centred section header, matching every other section. It used to sit
            inside the left grid column, which left it hard against the page
            edge while its neighbours were centred. */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px 15% 0px" }}
          transition={{ duration: 0.32, ease: "easeOut" }}
          className="mx-auto mb-14 max-w-2xl text-center"
        >
          <h2 className="mb-4 text-3xl md:text-5xl tracking-tight">Download Stratora</h2>
          <p className="text-lg text-muted-foreground">
            Free forever for up to 100 nodes. No account required.
          </p>
        </motion.div>

        {/* One centred column rather than two. With the heading lifted out, the
            left column held only the two buttons and a footnote and sat half
            empty beside a tall card. */}
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px 15% 0px" }}
            transition={{ duration: 0.32, ease: "easeOut" }}
            className="text-center"
          >
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <a
                href={MSI_DOWNLOAD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-2.5 text-sm text-white shadow-lg shadow-purple-500/20 transition-all hover:from-purple-700 hover:to-purple-800"
              >
                <Download className="h-4 w-4" />
                Download for Windows (.msi)
              </a>

              <a
                href={RELEASE_NOTES_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-orange-accent/40 px-5 py-2.5 text-sm text-foreground transition-colors hover:border-orange-bright/60 hover:bg-orange-accent/10"
              >
                View release notes on GitHub
                <ExternalLink className="h-3.5 w-3.5 text-orange-accent" />
              </a>
            </div>

            <p className="mt-5 text-xs text-muted-foreground">
              Requires Windows Server. SHA-256 checksum available on the GitHub release page.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px 15% 0px" }}
            transition={{ duration: 0.32, ease: "easeOut", delay: 0.08 }}
            className="mt-12 rounded-2xl border border-border/50 bg-card/40 text-left"
          >
            <div className="flex items-center gap-3 border-b border-border/50 px-7 py-5">
              <h3 className="text-lg font-semibold">Stratora Server v{RELEASE_VERSION}</h3>
              <span className="st-mono ml-auto text-xs text-muted-foreground">.msi</span>
            </div>
            <div className="px-7 py-6">
              <div className="flex flex-wrap gap-2">
                {CONTENTS.map((item) => (
                  <span
                    key={item}
                    className="rounded-lg border border-border/60 bg-secondary/40 px-3 py-1.5 text-xs text-muted-foreground"
                  >
                    {item}
                  </span>
                ))}
              </div>
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                Includes Stratora Server, Windows Agent, Linux Agent (.deb / .rpm), and Collector.
                Installs as Community Edition — apply a Pro license key to unlock additional nodes
                and priority support.
              </p>
            </div>
          </motion.div>

          {/* Optional newsletter pointer. Deliberately quiet and below the
              release card: the download above never depends on it. */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px 15% 0px" }}
            transition={{ duration: 0.32, ease: "easeOut", delay: 0.12 }}
            className="mt-6 flex flex-col items-center justify-between gap-3 rounded-2xl border border-dashed border-border/60 px-7 py-5 text-center sm:flex-row sm:text-left"
          >
            <div>
              <h3 className="text-sm font-medium">Keep Up with Stratora</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Get notified about new releases, feature improvements, and platform updates.
              </p>
            </div>
            <a
              href={SUBSCRIBE_HREF}
              onClick={(e) => {
                e.preventDefault();
                navigate(SUBSCRIBE_HREF);
              }}
              className="shrink-0 text-sm text-purple-400 transition-colors hover:text-purple-300"
            >
              Subscribe to Updates &rarr;
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
