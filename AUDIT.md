# Stratora Website Audit

## Framework & Router

| Item | Detail |
|------|--------|
| Framework | React 18.3.1 (peer dep) |
| Bundler | Vite 6.3.5 |
| Styling | Tailwind CSS 4.1.12 + Radix UI primitives + shadcn/ui components |
| Animation | Motion (Framer Motion) 12.23.24 |
| Router | **No router library.** Manual SPA routing via `window.history.pushState` / `popstate` in `App.tsx`. GitHub Pages 404 handled by `public/404.html` which stores the path in `sessionStorage` and redirects to `/`. |

## Routes Inventory

| Route | Source File | Status |
|-------|-------------|--------|
| `/` | `src/app/App.tsx` → `LandingPage` (Hero, DashboardPreview, Stats, Features, Pricing, Downloads, About) | OK |
| `/billing` | `src/app/App.tsx` → `Billing` component | OK |
| `/#features` | `src/app/components/features.tsx` (`id="features"`) | OK — anchor scroll |
| `/#pricing` | `src/app/components/pricing.tsx` (`id="pricing"`) | OK — anchor scroll |
| `/#downloads` | `src/app/components/downloads.tsx` (`id="downloads"`) | OK — anchor scroll |
| `/#about` | `src/app/components/about.tsx` (`id="about"`) | OK — anchor scroll |

**Any path not matching `/billing` renders the landing page** (no 404 page component exists).

## Dead Links (`href="#"`)

### Navigation bar (`navigation.tsx`)
| Label | href | Issue |
|-------|------|-------|
| Contact | `#` | Dead link — no contact section or page exists |
| Sign In | `#` | Dead link — no sign-in URL configured |
| Get Started (button, desktop) | none (`<button>`, no href) | Does nothing — no `onClick` handler |
| Get Started (button, mobile) | none (`<button>`, no href) | Closes the mobile drawer only — no navigation |

### Footer (`footer.tsx`) — Product column
| Label | href |
|-------|------|
| Security | `#` |
| Roadmap | `#` |
| Changelog | `#` |

### Footer — Company column
| Label | href |
|-------|------|
| About | `#` (should be `#about`) |
| Blog | `#` |
| Careers | `#` |
| Press | `#` |
| Partners | `#` |

### Footer — Resources column
| Label | href |
|-------|------|
| Documentation | `#` (should be `https://docs.stratora.io`) |
| API Reference | `#` |
| Community | `#` |
| Support | `#` |
| Status | `#` |

### Footer — Legal column
| Label | href |
|-------|------|
| Privacy Policy | `#` |
| Terms of Service | `#` |
| Cookie Policy | `#` |
| GDPR | `#` |
| Compliance | `#` |

### Footer — Bottom bar
| Label | href |
|-------|------|
| Privacy | `#` |
| Terms | `#` |
| Cookies | `#` |

### Footer — Social icons
| Label | href |
|-------|------|
| Twitter | `#` |
| GitHub | `#` |
| LinkedIn | `#` |
| Email (Mail icon) | `#` |

**Total dead links: 24**

## Footer Issues

- **Current tagline:** "Next-generation observability & infrastructure monitoring platform for modern cloud-native applications."
  - Note: The tagline says "cloud-native applications" but the product is positioned as IT/OT infrastructure monitoring (switches, firewalls, APs, servers, SAN/NAS, UPS). This is a mismatch with the rest of the site's messaging.
- **Dead footer links:** 22 out of 24 footer links point to `#` (see list above).
- **"About" footer link** points to `#` but should point to `#about` (the section exists on the landing page).
- **"Documentation" footer link** points to `#` but should point to `https://docs.stratora.io` (already linked in the Hero section).
- **Missing legal pages:**
  - Privacy Policy — no page or route exists
  - Terms of Service — no page or route exists
  - Cookie Policy — no page or route exists
  - GDPR — no page or route exists
  - Compliance — no page or route exists
- **Social links** all point to `#` — no real social media URLs configured.

## Feature Copy Gaps

| Feature mentioned on site | Appears to be real | Notes |
|---------------------------|-------------------|-------|
| Visualization-first dashboards | Yes | Described in Features section |
| Template-driven monitoring (50+ vendors) | Yes | Described in Features section |
| Distributed collectors | Yes | Described in Features section |
| Windows & Linux agents | Yes | Described in Features + Downloads |
| Alerting + maintenance mode (email, Teams, Slack) | Yes | Described in Features section |
| RBAC + LDAP/OAuth SSO | Yes | Described in Features section |
| SMS alerting | Unclear | Hero says "SMS" but Features section only lists email, Teams, Slack |
| Phone alerting | Unclear | Hero says "phone" but Features section only lists email, Teams, Slack |
| "API Reference" (footer) | Unknown | No docs or API reference page exists on the site |
| "Status" page (footer) | Unknown | No status page exists |
| "Community" (footer) | Unknown | No community page/forum linked |

## Content Issues

1. **Tagline mismatch:** Footer says "cloud-native applications" but the product monitors traditional IT/OT infrastructure (switches, firewalls, UPS, servers). The Hero and Features sections are consistent with IT/OT; the footer tagline is the outlier.

2. **Hero vs. Features channel mismatch:** Hero mentions alerting via "chat, email, SMS, and phone." Features section only mentions "email, Microsoft Teams, and Slack." Either the Hero overpromises or the Features section is incomplete.

3. **No Contact page or section:** Nav has a "Contact" link pointing to `#`. The only contact mechanism is `mailto:sales@stratora.io` on the Enterprise pricing card and `support@stratora.io` in billing error messages.

4. **"Get Started" buttons do nothing:** Both desktop and mobile "Get Started" buttons in the nav have no `href` or meaningful `onClick` — they are non-functional.

5. **No 404 page component:** Any unrecognized path (e.g., `/foo`) silently renders the landing page instead of showing a 404 message.

6. **`<title>` tag:** Currently just "Stratora.io" — no meta description or OpenGraph tags for SEO/social sharing.

7. **Download is Windows-only:** The Downloads section only offers a `.msi` installer. No Linux download link despite the site advertising Linux agents. The description says "Includes ... Linux Agent (.deb / .rpm)" but there's only one download button pointing to the `.msi`.

## Missing Pages

Pages/destinations linked in nav or footer that have **no corresponding route or content**:

| Linked page | Where linked |
|-------------|-------------|
| Contact | Nav bar |
| Security | Footer → Product |
| Roadmap | Footer → Product |
| Changelog | Footer → Product |
| Blog | Footer → Company |
| Careers | Footer → Company |
| Press | Footer → Company |
| Partners | Footer → Company |
| API Reference | Footer → Resources |
| Community | Footer → Resources |
| Support | Footer → Resources |
| Status | Footer → Resources |
| Privacy Policy | Footer → Legal |
| Terms of Service | Footer → Legal |
| Cookie Policy | Footer → Legal |
| GDPR | Footer → Legal |
| Compliance | Footer → Legal |

## Unused UI Components

The `src/app/components/ui/` directory contains **40+ shadcn/ui components** (accordion, alert-dialog, avatar, breadcrumb, calendar, carousel, chart, checkbox, collapsible, command, context-menu, dialog, drawer, dropdown-menu, form, hover-card, input-otp, input, label, menubar, navigation-menu, pagination, popover, progress, radio-group, resizable, scroll-area, select, separator, sheet, sidebar, skeleton, slider, sonner, switch, table, tabs, textarea, toggle-group, toggle, tooltip). None of these appear to be used by any page-level component. They were likely scaffolded by shadcn/ui init and represent dead weight in the bundle.

Also present: `src/app/components/figma/ImageWithFallback.tsx` — not imported by any visible component.

## Summary

- **2 routes** exist (`/` and `/billing`); everything else is anchor scrolls on the landing page.
- **24 dead `href="#"` links** across navigation and footer.
- **17 missing pages** referenced in the footer/nav with no content.
- **5 missing legal pages** (Privacy, Terms, Cookies, GDPR, Compliance).
- **All 4 social links** are placeholder `#`.
- **"Get Started" buttons** in the nav are non-functional.
- **Footer tagline** misrepresents the product as "cloud-native."
- **Hero copy** promises SMS + phone alerting not mentioned elsewhere.
- **40+ unused UI components** shipped in source.
