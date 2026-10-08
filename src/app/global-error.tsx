"use client";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "sans-serif", display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center", background: "#0a0a0b", color: "#f5f5f7", margin: 0 }}>
        <div style={{ textAlign: "center", padding: 24 }}>
          <h1 style={{ fontSize: 40, margin: 0 }}>Something went wrong</h1>
          <p style={{ opacity: 0.7 }}>A critical error occurred.</p>
          <button
            onClick={reset}
            style={{ marginTop: 16, padding: "10px 20px", borderRadius: 10, border: "none", background: "#6c5cff", color: "#fff", fontWeight: 600, cursor: "pointer" }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
