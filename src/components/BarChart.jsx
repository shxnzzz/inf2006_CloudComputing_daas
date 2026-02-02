import React from "react";
import {
  ResponsiveContainer,
  BarChart as RBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export default function BarChart({
  title,
  data = [],
  xKey = "year",
  yKey = "value",
  height = 320,
}) {
  return (
    <div style={cardStyle}>
      {title && <h3 style={{ margin: 0, marginBottom: 12 }}>{title}</h3>}

      <div style={{ width: "100%", height }}>
        <ResponsiveContainer>
          <RBarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={yKey} />
          </RBarChart>
        </ResponsiveContainer>
      </div>

      {(!data || data.length === 0) && (
        <p style={{ marginTop: 10, color: "#666" }}>No data to display.</p>
      )}
    </div>
  );
}

const cardStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: 16,
  background: "white",
};
