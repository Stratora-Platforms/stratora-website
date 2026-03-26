export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center px-6">
        <p className="text-sm font-medium text-muted-foreground mb-2 uppercase tracking-widest">404</p>
        <h1 className="text-4xl font-bold mb-4">Page not found</h1>
        <p className="text-muted-foreground mb-8">This page doesn't exist or has been moved.</p>
        <button
          onClick={() => { window.history.pushState({}, '', '/'); window.dispatchEvent(new PopStateEvent('popstate')); }}
          className="underline text-sm text-muted-foreground"
        >
          &larr; Back to home
        </button>
      </div>
    </div>
  );
}
