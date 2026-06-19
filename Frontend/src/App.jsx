import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const today = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date()).replace(/-/g, "");

  useEffect(() => {
    load(today);
  }, [today]);

  const load = async (date) => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`https://dailyreadingsbackend.onrender.com/api/liturgy?date=${date}`);
      if (!res.ok) throw new Error("Failed request");
      const json = await res.json();

      const wikiName = json.saint.name.split('(')[0].trim();
      const wikiRes = await fetch(`https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrsearch=Saint%20${encodeURIComponent(wikiName)}&gsrlimit=1&prop=pageimages|extracts&piprop=original&exintro=1&explaintext=1&redirects=1`);
      const wikiJson = await wikiRes.json();
      const pages = wikiJson.query?.pages;
      const imageUrl = pages ? Object.values(pages)[0]?.original?.source : null;

      const finalizedData = { ...json, saint: { ...json.saint, image: imageUrl } };
      localStorage.setItem(`liturgy-${date}`, JSON.stringify(finalizedData));
      setData(finalizedData);
    } catch (err) {
      console.error(err);
      setError(true);
      toast.error("Connectivity issue");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div style={styles.loader}>
      <div style={styles.loaderIcon}>✝</div>
      <h2 style={styles.loaderText}>Gathering Today's Readings…</h2>
    </div>
  );

  if (error) return (
    <div style={styles.loader}>
      <h2 style={styles.loaderText}>Failed to load</h2>
      <button onClick={() => load(today)} style={styles.retryBtn}>Retry</button>
    </div>
  );

  const badgeBg = data.color === "White" ? "#e5e7eb" : "#059669";
  const badgeColor = data.color === "White" ? "#374151" : "#ffffff";

  return (
    <div style={styles.container}>
      <Toaster position="top-center" />

      {/* HERO HEADER */}
      <header style={styles.header}>
        <p style={styles.dateLabel}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
        <h1 style={styles.title}>{data.title}</h1>
        <div style={{ ...styles.badge, backgroundColor: badgeBg, color: badgeColor }}>
          {data.color?.toUpperCase() || "ORDINARY"}
        </div>
      </header>

      {/* SAINT SECTION */}
      <section style={styles.saintCard}>
        <div style={styles.label}>Saint of the Day</div>
        {data.saint.image && (
          <img src={data.saint.image} style={styles.saintImg} alt={data.saint.name} />
        )}
        <h2 style={styles.saintName}>{data.saint.name}</h2>
        <a
          href={`https://catholic.org/search/?q=${encodeURIComponent(data.saint.name)}`}
          target="_blank"
          rel="noreferrer"
          style={styles.link}
        >
          Learn more on Catholic Online →
        </a>
      </section>

      {/* READINGS SECTION */}
      <section style={styles.readingsColumn}>
        {data.readings.map((r, i) => (
          <div key={i} style={styles.readingCard}>
            <div style={styles.label}>{r.label}</div>
            <h3 style={styles.readingRef}>{r.title}</h3>
            <div style={styles.readingText}>{r.text}</div>
          </div>
        ))}
      </section>
    </div>
  );
}

// ---------------- STYLES ----------------
const styles = {
  container: {
    backgroundColor: "#f9fafb",
    minHeight: "100vh",
    padding: "24px 16px 48px",
    fontFamily: "'Inter', system-ui, sans-serif",
    boxSizing: "border-box",
  },
  loader: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    color: "#6b7280",
    gap: "16px",
  },
  loaderIcon: {
    fontSize: "2.5rem",
    color: "#9ca3af",
  },
  loaderText: {
    fontSize: "1.1rem",
    fontWeight: "500",
    color: "#6b7280",
    margin: 0,
  },
  retryBtn: {
    marginTop: "8px",
    padding: "10px 24px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    background: "white",
    color: "#374151",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },
  header: {
    textAlign: "center",
    marginBottom: "28px",
    maxWidth: "680px",
    marginLeft: "auto",
    marginRight: "auto",
  },
  dateLabel: {
    textTransform: "uppercase",
    letterSpacing: "1.5px",
    fontSize: "11px",
    fontWeight: "700",
    color: "#9ca3af",
    marginBottom: "8px",
    margin: "0 0 8px",
  },
  title: {
    fontSize: "clamp(1.4rem, 5vw, 2.2rem)",
    color: "#111827",
    marginBottom: "14px",
    lineHeight: "1.25",
    margin: "0 0 14px",
  },
  badge: {
    display: "inline-block",
    padding: "4px 14px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "0.5px",
  },
  saintCard: {
    background: "white",
    padding: "24px",
    borderRadius: "16px",
    boxShadow: "0 4px 16px -4px rgba(0,0,0,0.08)",
    marginBottom: "20px",
    maxWidth: "680px",
    marginLeft: "auto",
    marginRight: "auto",
  },
  saintImg: {
    width: "100%",
    height: "220px",
    objectFit: "cover",
    objectPosition: "top center",
    borderRadius: "10px",
    marginBottom: "16px",
    display: "block",
  },
  saintName: {
    fontSize: "1.3rem",
    color: "#1f2937",
    margin: "0 0 12px",
  },
  readingsColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    maxWidth: "680px",
    marginLeft: "auto",
    marginRight: "auto",
  },
  readingCard: {
    background: "white",
    padding: "24px",
    borderRadius: "16px",
    boxShadow: "0 4px 6px -2px rgba(0,0,0,0.05)",
  },
  label: {
    color: "#3b82f6",
    fontWeight: "800",
    fontSize: "11px",
    textTransform: "uppercase",
    marginBottom: "10px",
    letterSpacing: "1px",
  },
  readingRef: {
    fontSize: "1.1rem",
    color: "#111827",
    margin: "0 0 16px",
    borderLeft: "3px solid #3b82f6",
    paddingLeft: "12px",
    lineHeight: "1.4",
  },
  readingText: {
    fontSize: "1rem",
    lineHeight: "1.85",
    color: "#4b5563",
    whiteSpace: "pre-line",
  },
  link: {
    color: "#3b82f6",
    textDecoration: "none",
    fontSize: "13px",
    fontWeight: "600",
  },
};
