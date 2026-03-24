import { useState } from "react";
import { Loader2 } from "lucide-react";
import { motion } from "motion/react";

const PORTAL_ENDPOINT =
  "https://stratora-licensing-production.stratora.workers.dev/api/v1/portal";

export function Billing() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(PORTAL_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });

      if (res.ok) {
        const data = await res.json();
        window.location.href = data.url;
        return;
      }

      if (res.status === 404) {
        setError(
          "No subscription found for this email. If you believe this is an error, contact support@stratora.io"
        );
      } else if (res.status === 429) {
        setError(
          "Too many attempts. Please wait a few minutes and try again."
        );
      } else {
        setError(
          "Something went wrong. Please try again or contact support@stratora.io"
        );
      }
    } catch {
      setError(
        "Something went wrong. Please try again or contact support@stratora.io"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="relative px-6 py-20 min-h-[calc(100vh-80px)] flex items-center">
      <div className="container mx-auto max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-3xl md:text-4xl mb-4">
            Manage Your Subscription
          </h1>
          <p className="text-muted-foreground mb-8">
            Enter the email address you used when purchasing Stratora to access
            your billing portal.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full rounded-lg border border-border/50 bg-card/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-purple-500/50 transition-colors"
              disabled={loading}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-3 text-sm text-white hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg shadow-purple-500/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Connecting..." : "Continue"}
            </button>
          </form>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 text-sm text-red-400"
            >
              {error}
            </motion.p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
