import React from "react";

export default function StatCards({ title, stats = [] }) {
  return (
    <div style={containerStyle}>
      {title && <h3 style={titleStyle}>{title}</h3>}

      <div style={gridStyle}>
        {stats.map((s, idx) => (
          <div key={idx} style={statCardStyle}>
            <div style={labelStyle}>{s.label}</div>
            <div style={valueStyle}>
              {formatValue(s.value)}
            </div>
          </div>
        ))}
      </div>

      {(!stats || stats.length === 0) && (
        <p style={emptyStyle}>No statistics available.</p>
      )}
    </div>
  );
}

function formatValue(v) {
  if (v === null || v === undefined) return "—";
  if (typeof v === "number") {
    return Number.isInteger(v) ? v.toLocaleString() : v.toFixed(3);
  }
  return String(v);
}

const containerStyle = {
  border: "1px solid #e0e0e0",
  borderRadius: 8,
  padding: 20,
  background: "white",
  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
};

const titleStyle = {
  margin: 0,
  marginBottom: 16,
  color: "#2c3e50",
  fontSize: 17,
  fontWeight: 600,
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: 16,
};

const statCardStyle = {
  border: "1px solid #e8e8e8",
  borderRadius: 6,
  padding: 16,
  background: "#fafafa",
  transition: "all 0.2s ease",
};

const labelStyle = {
  fontSize: 12,
  color: "#666",
  marginBottom: 8,
  fontWeight: 500,
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

const valueStyle = {
  fontSize: 24,
  fontWeight: 600,
  color: "#1a1a1a",
  fontVariantNumeric: "tabular-nums",
};

const emptyStyle = {
  marginTop: 12,
  color: "#999",
  textAlign: "center",
  fontStyle: "italic",
  fontSize: 14,
};
