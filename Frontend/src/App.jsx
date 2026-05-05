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
      const res = await fetch(`http://localhost:5000/api/liturgy?date=${date}`);
      if (!res.ok) throw new Error("Failed request");
      const json = await res.json();

      // --- FIX 1: DEFINE wikiName HERE ---
      // We take the saint name from the backend and clean it for Wikipedia
      const wikiName = json.saint.name.split('(')[0].trim();
      // Fetch Saint Image from Wikipedia based on name from backend
      // Changed 'pithumbsize' to 'original' to match your URL params
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

  if (loading) return <div style={styles.loader}><h2>Gathering Today's Readings...</h2></div>;
  if (error) return <div style={styles.loader}><h2>Failed to load</h2><button onClick={() => load(today)}>Retry</button></div>;

  return (
    <div style={styles.container}>
      <Toaster position="top-center" />
      
      {/* HERO HEADER */}
      <header style={styles.header}>
        <p style={styles.dateLabel}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        <h1 style={styles.title}>{data.title}</h1>
        <div style={{ ...styles.badge, backgroundColor: data.color === "White" ? "#d1d5db" : "#059669", color: data.color === "White" ? "#374151" : "white" }}>
          {data.color?.toUpperCase() || "ORDINARY"}
        </div>
      </header>

      <div style={styles.mainGrid}>
        {/* SAINT SECTION */}
        <section style={styles.saintCard}>
          <div style={styles.label}>Saint of the Day</div>
          {data.saint.image && <img src={data.saint.image} style={styles.saintImg} alt="Saint" />}
          <h2 style={styles.saintName}>{data.saint.name}</h2>
          <a href={`https://catholic.org/search/?q=${encodeURIComponent(data.saint.name)}`} target="_blank" rel="noreferrer" style={styles.link}>Learn more on Catholic Online →</a>
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
    </div>
  );
}

// ---------------- STYLES ----------------
const styles = {
  container: { backgroundColor: "#f9fafb", minHeight: "100vh", padding: "40px 20px", fontFamily: "'Inter', system-ui, sans-serif" },
  loader: { display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100vh", color: "#6b7280" },
  header: { textAlign: "center", marginBottom: "50px", maxWidth: "800px", margin: "0 auto 50px" },
  dateLabel: { textTransform: "uppercase", letterSpacing: "1.5px", fontSize: "12px", fontWeight: "700", color: "#9ca3af", marginBottom: "8px" },
  title: { fontSize: "2.5rem", color: "#111827", marginBottom: "16px", lineHeight: "1.2" },
  badge: { display: "inline-block", padding: "4px 16px", borderRadius: "20px", fontSize: "11px", fontWeight: "800", letterSpacing: "0.5px" },
  mainGrid: { display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "30px", maxWidth: "1100px", margin: "0 auto", alignItems: "start" },
  saintCard: { position: "sticky", top: "20px", background: "white", padding: "30px", borderRadius: "20px", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)" },
  saintImg: { width: "100%", height: "300px", objectFit: "cover", borderRadius: "12px", marginBottom: "20px" },
  saintName: { fontSize: "1.5rem", color: "#1f2937", marginBottom: "15px" },
  readingsColumn: { display: "flex", flexDirection: "column", gap: "25px" },
  readingCard: { background: "white", padding: "35px", borderRadius: "20px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" },
  label: { color: "#3b82f6", fontWeight: "800", fontSize: "11px", textTransform: "uppercase", marginBottom: "12px", letterSpacing: "1px" },
  readingRef: { fontSize: "1.25rem", color: "#111827", marginBottom: "20px", borderLeft: "4px solid #3b82f6", paddingLeft: "15px" },
  readingText: { fontSize: "1.05rem", lineHeight: "1.8", color: "#4b5563", whiteSpace: "pre-line" },
  link: { color: "#3b82f6", textDecoration: "none", fontSize: "13px", fontWeight: "600" }
};
