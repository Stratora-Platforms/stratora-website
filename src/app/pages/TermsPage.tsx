export function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-3xl mx-auto px-6 py-24">
        <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
        <p className="text-muted-foreground mb-6">Last updated: March 25, 2026</p>
        <p className="text-foreground">
          Full terms of service are being finalized and will be published shortly.
          For questions, contact{' '}
          <a href="mailto:support@stratora.io" className="underline">
            support@stratora.io
          </a>
          .
        </p>
        <button
          onClick={() => { window.history.pushState({}, '', '/'); window.dispatchEvent(new PopStateEvent('popstate')); }}
          className="inline-block mt-8 text-sm underline text-muted-foreground"
        >
          &larr; Back to home
        </button>
      </main>
    </div>
  );
}
