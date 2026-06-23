import { useState } from "react";

const API = "https://dailyreadingsbackend.onrender.com";

export default function Admin() {
  const [password, setPassword] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [showImage, setShowImage] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [error, setError] = useState("");

  const unlock = async () => {
    setError("");
    const res = await fetch(`${API}/api/admin/image-toggle`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, showImage: true }),
    });

    if (res.status === 401) {
      setError("Incorrect password");
      return;
    }

    const data = await res.json();
    setShowImage(data.showImage);
    setUnlocked(true);
  };

  const save = async (value) => {
    setSaving(true);
    try {
      await fetch(`${API}/api/admin/image-toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, showImage: value }),
      });
      setLastSaved(new Date().toLocaleTimeString());
    } finally {
      setSaving(false);
    }
  };

  const toggle = () => {
    const next = !showImage;
    setShowImage(next);
    save(next);
  };

  // ── Password screen ────────────────────────────────────────────────────────
  if (!unlocked) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.cross}>✝</div>
          <h2 style={styles.heading}>Admin</h2>
          <p style={styles.sub}>Daily Readings</p>

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && unlock()}
            style={{
              ...styles.input,
              borderColor: error ? "#ef4444" : "#e5e7eb",
            }}
            autoFocus
          />

          {error && <p style={styles.errorMsg}>{error}</p>}

          <button onClick={unlock} style={styles.btn}>
            Unlock
          </button>
        </div>
      </div>
    );
  }

  // ── Admin panel ────────────────────────────────────────────────────────────
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.cross}>✝</div>
        <h2 style={styles.heading}>Image Settings</h2>
        <p style={styles.sub}>Changes broadcast to all users instantly</p>

        <div style={styles.toggleRow}>
          <div>
            <div style={styles.toggleLabel}>Saint Image</div>
            <div style={styles.toggleDesc}>
              {showImage ? "Visible to all users" : "Hidden for all users"}
            </div>
          </div>

          <button
            onClick={toggle}
            disabled={saving}
            style={{
              ...styles.toggle,
              background: showImage ? "#059669" : "#e5e7eb",
              opacity: saving ? 0.6 : 1,
            }}
            aria-label="Toggle saint image visibility"
          >
            <div
              style={{
                ...styles.toggleThumb,
                transform: showImage ? "translateX(24px)" : "translateX(2px)",
              }}
            />
          </button>
        </div>

        {lastSaved && (
          <p style={styles.savedNote}>✓ Saved at {lastSaved}</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f9fafb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Inter', system-ui, sans-serif",
    padding: "24px 16px",
  },
  card: {
    background: "white",
    borderRadius: "20px",
    padding: "40px 32px",
    boxShadow: "0 8px 32px -8px rgba(0,0,0,0.12)",
    width: "100%",
    maxWidth: "360px",
    textAlign: "center",
  },
  cross: {
    fontSize: "2rem",
    color: "#d1d5db",
    marginBottom: "12px",
  },
  heading: {
    fontSize: "1.4rem",
    color: "#111827",
    margin: "0 0 4px",
    fontWeight: "700",
  },
  sub: {
    fontSize: "13px",
    color: "#9ca3af",
    margin: "0 0 28px",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1.5px solid #e5e7eb",
    fontSize: "15px",
    color: "#111827",
    outline: "none",
    boxSizing: "border-box",
    marginBottom: "8px",
  },
  errorMsg: {
    fontSize: "12px",
    color: "#ef4444",
    margin: "0 0 12px",
  },
  btn: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    background: "#111827",
    color: "white",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "4px",
  },
  toggleRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "#f9fafb",
    borderRadius: "12px",
    padding: "16px 18px",
    marginBottom: "16px",
  },
  toggleLabel: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#111827",
    textAlign: "left",
    marginBottom: "2px",
  },
  toggleDesc: {
    fontSize: "12px",
    color: "#9ca3af",
    textAlign: "left",
  },
  toggle: {
    width: "52px",
    height: "28px",
    borderRadius: "999px",
    border: "none",
    cursor: "pointer",
    position: "relative",
    transition: "background 0.2s ease",
    flexShrink: 0,
    padding: 0,
  },
  toggleThumb: {
    position: "absolute",
    top: "3px",
    width: "22px",
    height: "22px",
    borderRadius: "50%",
    background: "white",
    boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
    transition: "transform 0.2s ease",
  },
  savedNote: {
    fontSize: "12px",
    color: "#059669",
    margin: 0,
  },
};
