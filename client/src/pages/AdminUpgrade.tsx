import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { getRecentInvestorTokens } from "../lib/supabase";
import { Clock, ShieldCheck, ShieldAlert, History, Home } from "lucide-react";

export default function AdminUpgrade() {
  const [, navigate] = useLocation();
  const [recentTokens, setRecentTokens] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchTokens = async () => {
    setIsRefreshing(true);
    try {
      const data = await getRecentInvestorTokens();
      setRecentTokens(data || []);
    } catch (err) {
      console.error("Failed to fetch tokens:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => { fetchTokens(); }, []);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0a0f1e", color: "#e2e8f0", padding: "2rem" }}>

      {/* Top bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#e2e8f0" }}>Admin — Access Logs</h1>
        <button
          onClick={() => navigate("/")}
          style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.8125rem", color: "#64748b", background: "none", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, padding: "0.4rem 0.875rem", cursor: "pointer" }}
          onMouseEnter={e => (e.currentTarget.style.color = "#e2e8f0")}
          onMouseLeave={e => (e.currentTarget.style.color = "#64748b")}
        >
          <Home size={13} /> Home
        </button>
      </div>

      {/* Recent Tokens Table */}
      <div style={{
        backgroundColor: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 12,
      }}>
        <div style={{ padding: "1.25rem", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "space-between" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 700, display: "flex", alignItems: "center", gap: 8, color: "#e2e8f0" }}>
            <History size={18} color="#60a5fa" /> Recent Access Logs
          </h3>
          <button onClick={fetchTokens} style={{ fontSize: "0.75rem", color: "#60a5fa", cursor: "pointer", background: "none", border: "none" }}>
            {isRefreshing ? "Refreshing..." : "Refresh List"}
          </button>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
          <thead>
            <tr style={{ textAlign: "left", color: "#64748b", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <th style={{ padding: "1rem" }}>Investor</th>
              <th style={{ padding: "1rem" }}>Status</th>
              <th style={{ padding: "1rem" }}>Uses</th>
              <th style={{ padding: "1rem" }}>Expires</th>
            </tr>
          </thead>
          <tbody>
            {recentTokens.length === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: "2rem", textAlign: "center", color: "#64748b" }}>
                  No access logs yet.
                </td>
              </tr>
            )}
            {recentTokens.map((t) => (
              <tr key={t.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                <td style={{ padding: "1rem" }}>
                  <div style={{ fontWeight: 600 }}>{t.investor_name}</div>
                  <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{t.investor_email}</div>
                </td>
                <td style={{ padding: "1rem" }}>
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px", borderRadius: 999, fontSize: "0.7rem", fontWeight: 700,
                    backgroundColor: t.status === "active" ? "rgba(52,211,153,0.1)" : "rgba(239,68,68,0.1)",
                    color: t.status === "active" ? "#34d399" : "#f87171",
                  }}>
                    {t.status === "active" ? <ShieldCheck size={12} /> : <ShieldAlert size={12} />}
                    {t.status.toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: "1rem", color: "#94a3b8" }}>
                  {t.used_count} / {t.max_uses}
                </td>
                <td style={{ padding: "1rem", color: "#94a3b8" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <Clock size={12} /> {new Date(t.expires_at).toLocaleDateString()}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
