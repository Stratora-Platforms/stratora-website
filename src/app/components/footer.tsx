import { Github, Mail } from "lucide-react";

function navigate(href: string) {
  window.history.pushState(null, "", href);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

export function Footer() {
  const footerLinks = {
    Product: [
      { name: "Features", href: "/#features" },
      { name: "Pricing", href: "/#pricing" },
      { name: "Downloads", href: "/#downloads" },
      { name: "Changelog", href: "https://github.com/Stratora-Platforms/stratora/releases", external: true },
    ],
    Company: [
      { name: "About", href: "/#about" },
      { name: "GitHub", href: "https://github.com/Stratora-Platforms/stratora", external: true },
    ],
    Resources: [
      { name: "Documentation", href: "https://docs.stratora.io", external: true },
      { name: "Release Notes", href: "https://github.com/Stratora-Platforms/stratora/releases", external: true },
    ],
    Legal: [
      { name: "Privacy Policy", href: "/privacy-policy", internal: true },
      { name: "Terms of Service", href: "/terms", internal: true },
    ],
  };

  const socialLinks = [
    { icon: Github, href: "https://github.com/Stratora-Platforms/stratora", label: "GitHub" },
    { icon: Mail, href: "mailto:support@stratora.io", label: "Email" },
  ];

  return (
    <footer className="relative border-t border-border/40 bg-card/30 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-16">
        {/* Top Section */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/stratora-logo-transparent.png"
                alt="Stratora logo"
                className="h-10 md:h-12 w-auto"
              />
            </div>

            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              On-premises network and infrastructure monitoring built for IT and
              OT environments. No cloud dependency required.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/50 text-muted-foreground hover:border-purple-500/50 hover:text-purple-400 transition-all"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="mb-4 text-sm">{category}</h4>
              <ul className="space-y-3">
                {links.map((link, index) => (
                  <li key={index}>
                    {"internal" in link && link.internal ? (
                      <a
                        href={link.href}
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(link.href);
                        }}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.name}
                      </a>
                    ) : "external" in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.name}
                      </a>
                    ) : (
                      <a
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.name}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-border/40">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Stratora. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="/privacy-policy"
              onClick={(e) => {
                e.preventDefault();
                navigate("/privacy-policy");
              }}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy
            </a>
            <a
              href="/terms"
              onClick={(e) => {
                e.preventDefault();
                navigate("/terms");
              }}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms
            </a>
          </div>
        </div>
      </div>

      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-purple-500/5 to-transparent pointer-events-none -z-10" />
    </footer>
  );
}
