import React from "react";

export default function StatCards({ title, stats = [] }) {
  return (
    <div style={cardStyle}>
      {title && <h3 style={{ margin: 0, marginBottom: 12 }}>{title}</h3>}

      <div style={gridStyle}>
        {stats.map((s, idx) => (
          <div key={idx} style={statCardStyle}>
            <div style={{ fontSize: 12, color: "#6b7280" }}>{s.label}</div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>
              {formatValue(s.value)}
            </div>
          </div>
        ))}
      </div>

      {(!stats || stats.length === 0) && (
        <p style={{ marginTop: 10, color: "#666" }}>No stats to display.</p>
      )}
    </div>
  );
}

function formatValue(v) {
  if (v === null || v === undefined) return "-";
  if (typeof v === "number") {
    // pretty rounding for charts/stats
    return Number.isInteger(v) ? v : v.toFixed(3);
  }
  return String(v);
}

const cardStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: 16,
  background: "white",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
  gap: 12,
};

const statCardStyle = {
  border: "1px solid #f3f4f6",
  borderRadius: 10,
  padding: 12,
  background: "#fafafa",
};
