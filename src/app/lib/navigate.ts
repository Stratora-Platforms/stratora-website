// Shared client-side navigation helper for the hand-rolled SPA router.
//
// Emits a custom "app:navigate" event (NOT a synthetic popstate) so that
// Cloudflare Web Analytics — which independently hooks history.pushState and
// the popstate event — counts exactly one pageview per programmatic nav. App's
// route effect listens for both "app:navigate" (programmatic) and "popstate"
// (browser back/forward).
export function navigate(href: string) {
  // Measured before pushState, which rewrites location.pathname.
  const samePath =
    window.location.pathname === new URL(href, window.location.origin).pathname;

  window.history.pushState(null, "", href);
  window.dispatchEvent(new Event("app:navigate"));

  /* pushState never moves the viewport, and React re-renders in place, so
     without this a route click leaves you at whatever scroll offset you were
     already at. Clicking "Home" from halfway down the landing page was the
     visible case: the path is already "/", so the same tree re-rendered and
     the click appeared to do nothing at all.

     Smooth only when the path didn't change — that is the in-page case, and
     it matches the nav's "#section" links, which smooth-scroll. An actual
     route change is a new page and should start at the top immediately;
     it also lets Navigation's "#..." handler scroll to its section straight
     afterwards without fighting a running animation. */
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: (samePath && !reduced ? "smooth" : "instant") as ScrollBehavior,
  });
}
