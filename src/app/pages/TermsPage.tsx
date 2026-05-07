export function TermsPage() {
return ( <div className="min-h-screen bg-background"> <main className="max-w-3xl mx-auto px-6 py-24"> <h1 className="text-3xl font-bold mb-4">Terms of Service</h1> <p className="text-muted-foreground mb-6">Last updated: May 2026</p>

```
    <section className="space-y-6 text-foreground">
      <p>
        Stratora provides infrastructure monitoring and alerting software used by organizations to monitor systems,
        networks, and applications.
      </p>

      <h2 className="text-xl font-semibold mt-6">Use of Service</h2>
      <p>
        Stratora is intended for use by authorized administrators and personnel responsible for managing IT
        infrastructure. Users agree to use the service only for legitimate operational and monitoring purposes.
      </p>

      <h2 className="text-xl font-semibold mt-6">Messaging & Notifications</h2>
      <p>
        Stratora may send SMS and voice notifications related to infrastructure monitoring, including outage alerts,
        system degradation, maintenance notifications, and recovery events.
      </p>
      <ul className="list-disc pl-6 space-y-2">
        <li>Message frequency varies based on system activity and alert conditions</li>
        <li>Message and data rates may apply</li>
        <li>Reply STOP to unsubscribe from SMS notifications</li>
        <li>Reply HELP for assistance</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6">User Responsibilities</h2>
      <p>
        Users are responsible for ensuring that notification recipients have consented to receive alerts and that
        contact information is accurate and maintained.
      </p>

      <h2 className="text-xl font-semibold mt-6">Privacy</h2>
      <p>
        Stratora collects and processes limited data necessary to deliver monitoring and alerting functionality. For
        more information, please refer to our{' '}
        <a href="/privacy-policy" className="underline">
          Privacy Policy
        </a>.
      </p>

      <h2 className="text-xl font-semibold mt-6">Availability</h2>
      <p>
        Stratora is provided as-is for monitoring purposes. While we strive for reliability, uninterrupted operation
        is not guaranteed.
      </p>

      <h2 className="text-xl font-semibold mt-6">Limitation of Liability</h2>
      <p>
        Stratora shall not be liable for any indirect, incidental, or consequential damages resulting from use of the
        service, including missed alerts or system outages.
      </p>

      <h2 className="text-xl font-semibold mt-6">Changes to Terms</h2>
      <p>
        These Terms may be updated from time to time. Continued use of Stratora constitutes acceptance of any
        changes.
      </p>

      <h2 className="text-xl font-semibold mt-6">Contact</h2>
      <p>
        For support or questions, contact{' '}
        <a href="mailto:support@stratora.io" className="underline">
          support@stratora.io
        </a>.
      </p>
    </section>

    <button
      onClick={() => {
        window.history.pushState({}, '', '/');
        window.dispatchEvent(new PopStateEvent('popstate'));
      }}
      className="inline-block mt-10 text-sm underline text-muted-foreground"
    >
      &larr; Back to home
    </button>
  </main>
</div>
```

);
}
