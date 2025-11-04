import React from "react";
import { Link } from "react-router-dom";

type Props = {
  children: React.ReactNode;
};

type State = {
  hasError: boolean;
  error?: Error;
};

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Log to your monitoring here (Sentry, LogRocket, etc.)
    // Example: window.Sentry?.captureException(error);
    // For now, just log:
    console.error("[ErrorBoundary] Caught error:", error, info);
  }

  handleRetry = () => {
    // Clear error and try to re-render
    this.setState({ hasError: false, error: undefined });
  };

  handleHardReload = () => {
    // If state is corrupt, a hard reload usually clears it
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6">
        <div className="max-w-lg w-full rounded-xl border border-border bg-card shadow p-6 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Something went wrong
          </h1>
          <p className="text-sm text-muted-foreground mb-4">
            The app hit an unexpected error. You can try again, reload the page,
            or head back to the home feed.
          </p>

          {/* Helpful diagnostic (hidden in production if you want) */}
          {process.env.NODE_ENV !== "production" && this.state.error && (
            <pre className="text-left text-xs bg-muted p-3 rounded overflow-auto mb-4 max-h-48">
              {this.state.error.message}
            </pre>
          )}

          <div className="flex gap-2 justify-center">
            <button
              onClick={this.handleRetry}
              className="px-4 py-2 rounded-md bg-[hsl(var(--primary))] text-white"
            >
              Try again
            </button>
            <button
              onClick={this.handleHardReload}
              className="px-4 py-2 rounded-md border border-border"
            >
              Reload
            </button>
            <Link
              to="/"
              className="px-4 py-2 rounded-md border border-border"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
