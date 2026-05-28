// Shared client-side navigation helper for the hand-rolled SPA router.
//
// Emits a custom "app:navigate" event (NOT a synthetic popstate) so that
// Cloudflare Web Analytics — which independently hooks history.pushState and
// the popstate event — counts exactly one pageview per programmatic nav. App's
// route effect listens for both "app:navigate" (programmatic) and "popstate"
// (browser back/forward).
export function navigate(href: string) {
  window.history.pushState(null, "", href);
  window.dispatchEvent(new Event("app:navigate"));
}
