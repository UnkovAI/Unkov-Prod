import { Component, ReactNode } from "react";

interface Props  { children: ReactNode; }
interface State  { hasError: boolean; error: Error | null; }

// Uses ONLY inline styles — no Tailwind, no CSS vars, no external deps.
// This ensures the error UI always renders visibly even if CSS fails to load.
export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    // Log to console so it shows in browser devtools
    console.error("[Unkov] React Error:", error);
    console.error("[Unkov] Component stack:", info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: "100vh",
          backgroundColor: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, -apple-system, sans-serif",
          padding: "2rem",
        }}>
          <div style={{ maxWidth: 640, width: "100%" }}>
            <div style={{
              background: "#fef2f2",
              border: "1px solid #fca5a5",
              borderRadius: 8,
              padding: "1.5rem",
              marginBottom: "1rem",
            }}>
              <h2 style={{ color: "#b91c1c", fontWeight: 700, fontSize: "1.1rem", marginBottom: "0.5rem" }}>
                Something went wrong
              </h2>
              <p style={{ color: "#7f1d1d", fontSize: "0.875rem", marginBottom: "1rem" }}>
                Open browser DevTools (F12 → Console) to see the full error.
              </p>
              <pre style={{
                background: "#1e293b",
                color: "#f8fafc",
                borderRadius: 6,
                padding: "1rem",
                fontSize: "0.75rem",
                overflowX: "auto",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                maxHeight: 300,
                overflowY: "auto",
              }}>
                {this.state.error?.message}
                {"\n\n"}
                {this.state.error?.stack}
              </pre>
            </div>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: "0.5rem 1.25rem",
                background: "#0061d4",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
                fontSize: "0.875rem",
                fontWeight: 600,
              }}
            >
              Reload page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
