import { useState } from "react";
import { Menu, X } from "lucide-react";

function navigate(href: string) {
  window.history.pushState(null, "", href);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

export function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { label: "Home", href: "/" },
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Downloads", href: "#downloads" },
    { label: "About", href: "#about" },
    { label: "Billing", href: "/billing" },
    { label: "Contact", href: "mailto:support@stratora.io" },
  ];

  function handleClick(e: React.MouseEvent, href: string) {
    if (href.startsWith("/")) {
      e.preventDefault();
      navigate(href);
    }
    setMobileOpen(false);
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <a
              href="/"
              onClick={(e) => handleClick(e, "/")}
            >
              <img
                src="/stratora-logo-transparent.png"
                alt="Stratora logo"
                className="h-10 md:h-12 w-auto"
              />
            </a>
          </div>

          {/* Center Navigation (desktop) */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleClick(e, link.href)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hidden md:block rounded-full bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-2 text-sm text-white hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg shadow-purple-500/20"
            >
              Get Started
            </button>

            {/* Mobile hamburger */}
            <button
              className="md:hidden flex items-center justify-center"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="h-6 w-6 text-foreground" />
              ) : (
                <Menu className="h-6 w-6 text-foreground" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-lg">
          <div className="container mx-auto px-6 py-4 flex flex-col gap-4">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleClick(e, link.href)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={() => {
                setMobileOpen(false);
                document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="rounded-full bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-2 text-sm text-white hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg shadow-purple-500/20 mt-2"
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
