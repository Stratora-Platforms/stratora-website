// HubSpot newsletter form — public embed configuration and script loader.
//
// Everything here is the public embed snippet HubSpot hands out: portal and
// form IDs are not credentials. Submissions, consent records, contacts and
// unsubscribes all live in HubSpot; the site never sees subscriber data.
//
// Only the forms embed script is loaded, and only by pages that render the
// form. The HubSpot tracking code (hs-script-loader) is deliberately not
// used, so visitors who never open /subscribe make no request to HubSpot.

export const HUBSPOT_PORTAL_ID = "245390721";
export const HUBSPOT_REGION = "na2";
export const HUBSPOT_NEWSLETTER_FORM_ID = "d3d65d20-44ba-445b-939c-0d66705101d0";

const EMBED_SCRIPT_SRC = `https://js-${HUBSPOT_REGION}.hsforms.net/forms/embed/${HUBSPOT_PORTAL_ID}.js`;

// Where a /subscribe visit came from (?source=...). The value is not sent to
// HubSpot by the site; it stays in the page URL, which HubSpot records on each
// submission. Mapping it to a contact property needs a hidden field on the
// form in HubSpot (see SubscribePage).
export const SUBSCRIBE_SOURCES = ["website", "downloads", "documentation", "community"] as const;
export type SubscribeSource = (typeof SUBSCRIBE_SOURCES)[number];

export function subscribeHref(source: SubscribeSource) {
  return `/subscribe?source=${source}`;
}

let scriptPromise: Promise<void> | null = null;

/**
 * Injects the HubSpot forms embed script once per page load.
 *
 * The script scans for `.hs-form-frame` containers when it first runs and
 * then watches document.body for new ones, so a form mounted after a
 * client-side navigation renders without reloading or re-injecting it.
 * A failed load clears the cached promise so a later mount can retry.
 */
export function loadHubSpotFormsScript(): Promise<void> {
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<void>((resolve, reject) => {
    let script = document.querySelector<HTMLScriptElement>(`script[src="${EMBED_SCRIPT_SRC}"]`);

    const fail = () => {
      script?.remove();
      scriptPromise = null;
      reject(new Error("HubSpot forms script failed to load"));
    };

    if (script) {
      // Present already (e.g. a previous mount whose load is still in flight).
      if (script.dataset.loaded === "true") return resolve();
      script.addEventListener("load", () => resolve(), { once: true });
      script.addEventListener("error", fail, { once: true });
      return;
    }

    script = document.createElement("script");
    script.src = EMBED_SCRIPT_SRC;
    script.defer = true;
    script.addEventListener(
      "load",
      () => {
        script!.dataset.loaded = "true";
        resolve();
      },
      { once: true },
    );
    script.addEventListener("error", fail, { once: true });
    document.body.appendChild(script);
  });

  return scriptPromise;
}
