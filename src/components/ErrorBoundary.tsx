// src/components/ErrorBoundary.tsx
import React from "react";

type State = { hasError: boolean; err?: any };

export default class ErrorBoundary extends React.Component<
  React.PropsWithChildren,
  State
> {
  state: State = { hasError: false };

  static getDerivedStateFromError(err: any) {
    return { hasError: true, err };
  }

  componentDidCatch(err: any, info: any) {
    // eslint-disable-next-line no-console
    console.error("App crashed:", err, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
          <h1>Something went wrong.</h1>
          <p style={{ opacity: 0.7 }}>
            The UI failed to render. Check the console for details. We’ve
            disabled the broken widget so you can keep working.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}
