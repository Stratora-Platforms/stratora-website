import { Download, ExternalLink } from "lucide-react";
import { motion } from "motion/react";

const RELEASE_VERSION = "2.1.0";
const MSI_URL = `https://github.com/Stratora-Platforms/stratora/releases/download/v${RELEASE_VERSION}/Stratora-Server-${RELEASE_VERSION}.msi`;
const RELEASE_NOTES_URL = `https://github.com/Stratora-Platforms/stratora/releases/tag/v${RELEASE_VERSION}`;

export function Downloads() {
  return (
    <section id="downloads" className="relative px-6 py-20">
      <div className="container mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl mb-4">Download Stratora</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Free forever for up to 100 nodes. No account required.
          </p>
        </motion.div>

        {/* Release Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-2xl mx-auto"
        >
          <div className="rounded-2xl border border-border/50 bg-card/50 p-8 hover:border-purple-500/30 transition-all">
            <h3 className="text-xl mb-3">
              Stratora Server v{RELEASE_VERSION}
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Includes Stratora Server, Windows Agent, Linux Agent (.deb /
              .rpm), and Collector. Installs as Community Edition — apply a Pro
              license key to unlock additional nodes and priority support.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
              <a
                href={MSI_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-2.5 text-sm text-white hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg shadow-purple-500/20"
              >
                <Download className="h-4 w-4" />
                Download for Windows (.msi)
              </a>

              <a
                href={RELEASE_NOTES_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-2.5 text-sm text-foreground hover:bg-secondary transition-all"
              >
                <Download className="h-4 w-4" />
                Download for Linux (.deb / .rpm)
              </a>

              <a
                href={RELEASE_NOTES_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-purple-400 hover:text-purple-300 transition-colors"
              >
                View release notes on GitHub
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>

            <p className="text-xs text-muted-foreground">
              Requires Windows Server 2022. SHA-256 checksum available on the
              GitHub release page.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
