function navigate(path: string) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

function ExtLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-purple-400 hover:text-purple-300 underline transition-colors"
    >
      {children}
    </a>
  );
}

export function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-3xl mx-auto px-6 py-24">
        <h1 className="text-3xl font-bold mb-4">Stratora Privacy Policy</h1>
        <p className="text-muted-foreground mb-10">
          <strong>Last updated:</strong> March 25, 2026
        </p>

        {/* Intro */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3">Privacy Policy</h2>
          <p className="text-foreground mb-4">
            Stratora ("Stratora," "we," "our," or "us") provides a commercial
            infrastructure monitoring and observability platform.
          </p>
          <p className="text-foreground mb-3">
            This Privacy Policy describes how we collect, use, and protect
            information in connection with:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-foreground">
            <li>
              Our website (<ExtLink href="https://stratora.io">https://stratora.io</ExtLink>)
            </li>
            <li>
              Our documentation site (<ExtLink href="https://docs.stratora.io">https://docs.stratora.io</ExtLink>)
            </li>
            <li>Our licensing and billing systems</li>
          </ul>
        </section>

        <hr className="border-border/40 mb-10" />

        {/* Scope Clarification */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3">Important Scope Clarification</h2>
          <p className="text-foreground mb-4">
            This Privacy Policy <strong>does not apply</strong> to data processed by the Stratora
            software deployed within your own infrastructure.
          </p>
          <p className="text-foreground mb-3">
            All telemetry, metrics, logs, alert data, and operational information
            collected by your Stratora deployment:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-foreground mb-4">
            <li>Remain fully within your environment</li>
            <li>Are not transmitted to Stratora by default</li>
            <li>Are not accessible to Stratora</li>
          </ul>
          <p className="text-foreground">
            Stratora operates as a self-hosted, customer-controlled platform, and we
            do not collect or process your monitored infrastructure data.
          </p>
        </section>

        <hr className="border-border/40 mb-10" />

        {/* 1. Information We Collect */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>

          <h3 className="text-lg font-medium mt-6 mb-2">1.1 Information You Provide</h3>
          <p className="text-foreground mb-3">
            We may collect the following information when you interact with our
            services:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-foreground mb-4">
            <li>Name</li>
            <li>Email address</li>
            <li>Company name</li>
            <li>Billing and purchase information</li>
          </ul>
          <p className="text-foreground">
            Payment processing is handled by{" "}
            <ExtLink href="https://stripe.com">Stripe</ExtLink>. We do not store or
            process full payment card details.
          </p>
        </section>

        <hr className="border-border/40 mb-10" />

        <section className="mb-10">
          <h3 className="text-lg font-medium mb-2">1.2 Information Collected Automatically</h3>
          <p className="text-foreground mb-3">
            When you access our website or documentation, we may collect:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-foreground mb-4">
            <li>IP address</li>
            <li>Browser type and version</li>
            <li>Operating system</li>
            <li>Pages visited</li>
            <li>Referring URLs</li>
          </ul>
          <p className="text-foreground">
            We do not use advertising trackers or behavioral profiling technologies.
          </p>
        </section>

        <hr className="border-border/40 mb-10" />

        <section className="mb-10">
          <h3 className="text-lg font-medium mb-2">1.3 License Activation Data</h3>
          <p className="text-foreground mb-3">We may process:</p>
          <ul className="list-disc pl-6 space-y-1 text-foreground mb-4">
            <li>License identifier</li>
            <li>Activation timestamp</li>
            <li>License tier</li>
            <li>Non-reversible machine identifier hash</li>
          </ul>
          <p className="text-foreground">
            Used only for licensing and fraud prevention.
          </p>
        </section>

        <hr className="border-border/40 mb-10" />

        {/* 2. How We Use Your Information */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-1 text-foreground mb-4">
            <li>License management</li>
            <li>Payment processing</li>
            <li>Transactional emails</li>
            <li>Customer support</li>
            <li>Product improvement</li>
            <li>Fraud prevention</li>
            <li>Legal compliance</li>
          </ul>
          <p className="text-foreground">
            We do not sell or use data for advertising.
          </p>
        </section>

        <hr className="border-border/40 mb-10" />

        {/* 3. Third-Party Services */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3">3. Third-Party Services</h2>
          <ul className="list-disc pl-6 space-y-1 text-foreground">
            <li>
              <ExtLink href="https://stripe.com">Stripe</ExtLink> — payments
            </li>
            <li>
              <ExtLink href="https://resend.com">Resend</ExtLink> — email delivery
            </li>
            <li>
              <ExtLink href="https://www.twilio.com">Twilio</ExtLink> — SMS/voice (customer-configured)
            </li>
            <li>
              <ExtLink href="https://www.cloudflare.com">Cloudflare</ExtLink> — infrastructure
            </li>
            <li>
              <ExtLink href="https://github.com">GitHub</ExtLink> — software distribution
            </li>
          </ul>
        </section>

        <hr className="border-border/40 mb-10" />

        {/* 4. Data Retention */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3">4. Data Retention</h2>
          <p className="text-foreground mb-3">Data is retained:</p>
          <ul className="list-disc pl-6 space-y-1 text-foreground mb-4">
            <li>During active relationship</li>
            <li>For legal compliance</li>
            <li>For licensing validation</li>
          </ul>
          <p className="text-foreground">
            Deletion requests:{" "}
            <a href="mailto:support@stratora.io" className="text-purple-400 hover:text-purple-300 underline transition-colors">
              support@stratora.io
            </a>{" "}
            (within 30 days)
          </p>
        </section>

        <hr className="border-border/40 mb-10" />

        {/* 5. Your Rights */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3">5. Your Rights</h2>
          <ul className="list-disc pl-6 space-y-1 text-foreground mb-4">
            <li>Access</li>
            <li>Correction</li>
            <li>Deletion</li>
            <li>Restriction</li>
            <li>Portability</li>
          </ul>
          <p className="text-foreground">
            Contact:{" "}
            <a href="mailto:support@stratora.io" className="text-purple-400 hover:text-purple-300 underline transition-colors">
              support@stratora.io
            </a>
          </p>
        </section>

        <hr className="border-border/40 mb-10" />

        {/* 6. Security */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3">6. Security</h2>
          <ul className="list-disc pl-6 space-y-1 text-foreground mb-4">
            <li>Ed25519 license signing</li>
            <li>HTTPS transport</li>
            <li>Stripe PCI compliance</li>
          </ul>
          <p className="text-foreground">No card data stored.</p>
        </section>

        <hr className="border-border/40 mb-10" />

        {/* 7. Cookies */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3">7. Cookies</h2>
          <p className="text-foreground">
            Only essential session cookies are used.
          </p>
        </section>

        <hr className="border-border/40 mb-10" />

        {/* 8. Children's Privacy */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3">8. Children's Privacy</h2>
          <p className="text-foreground">
            Not intended for users under 16.
          </p>
        </section>

        <hr className="border-border/40 mb-10" />

        {/* 9. Changes */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3">9. Changes</h2>
          <p className="text-foreground">
            Policy may be updated. Users notified of material changes.
          </p>
        </section>

        <hr className="border-border/40 mb-10" />

        {/* 10. Contact */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3">10. Contact</h2>
          <p className="text-foreground mb-1">
            <a href="mailto:support@stratora.io" className="text-purple-400 hover:text-purple-300 underline transition-colors">
              support@stratora.io
            </a>
          </p>
          <p className="text-foreground">
            <ExtLink href="https://stratora.io">https://stratora.io</ExtLink>
          </p>
        </section>

        {/* Back to home */}
        <button
          onClick={() => navigate("/")}
          className="inline-block mt-4 text-sm underline text-muted-foreground"
        >
          &larr; Back to home
        </button>
      </main>
    </div>
  );
}
