import React from "react";

export default function FilterPanel({
  meta,
  filters,
  setFilters,
  onRun,
  loading = false,
  mode = "trend", // "trend" | "outliers" | "compare"
}) {
  const years = buildYears(meta?.year_min, meta?.year_max);

  const set = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));

  return (
    <div style={panelStyle}>
      <h3 style={{ marginTop: 0, color: "#374151", fontSize: 18, fontWeight: 600 }}>
        Filters
      </h3>

      <div style={gridStyle}>
        {/* Common fields */}
        <Field label="Age Group">
          <select
            style={selectStyle}
            value={filters.age || ""}
            onChange={(e) => set("age", e.target.value)}
          >
            {(meta?.age || []).map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Facility Type">
          <select
            style={selectStyle}
            value={filters.facility_type || ""}
            onChange={(e) => set("facility_type", e.target.value)}
          >
            {(meta?.facility_type || []).map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Year Start">
          <select
            style={selectStyle}
            value={filters.year_start || ""}
            onChange={(e) => set("year_start", e.target.value)}
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Year End">
          <select
            style={selectStyle}
            value={filters.year_end || ""}
            onChange={(e) => set("year_end", e.target.value)}
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </Field>

        {/* Mode-specific fields */}
        {mode === "trend" && (
          <Field label="Sex">
            <select
              style={selectStyle}
              value={filters.sex || ""}
              onChange={(e) => set("sex", e.target.value)}
            >
              {(meta?.sex || []).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
        )}

        {mode === "outliers" && (
          <>
            <Field label="Sex">
              <select
                style={selectStyle}
                value={filters.sex || ""}
                onChange={(e) => set("sex", e.target.value)}
              >
                {(meta?.sex || []).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Z Threshold">
              <input
                style={inputStyle}
                type="number"
                step="0.1"
                value={filters.z_threshold ?? 2.0}
                onChange={(e) => set("z_threshold", e.target.value)}
              />
              <small style={{ color: "#6b7280", fontSize: 12, marginTop: 4 }}>
                Common: 2.0 (moderate), 2.5 (stricter), 3.0 (very strict)
              </small>
            </Field>
          </>
        )}

        {mode === "compare" && (
          <>
            <Field label="Group A (Sex)">
              <select
                style={selectStyle}
                value={filters.groupA_sex || ""}
                onChange={(e) => set("groupA_sex", e.target.value)}
              >
                {(meta?.sex || []).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Group B (Sex)">
              <select
                style={selectStyle}
                value={filters.groupB_sex || ""}
                onChange={(e) => set("groupB_sex", e.target.value)}
              >
                {(meta?.sex || []).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>
          </>
        )}
      </div>

      <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
        <button onClick={onRun} disabled={loading} style={btnStyle}>
          {loading ? "Running..." : "Run Analysis"}
        </button>

        <button
          onClick={() =>
            setFilters((prev) => ({
              ...prev,
              year_start: meta?.year_min ?? prev.year_start,
              year_end: meta?.year_max ?? prev.year_end,
            }))
          }
          disabled={loading}
          style={btnSecondaryStyle}
        >
          Reset Years
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={fieldStyle}>
      <div
        style={{
          fontSize: 13,
          color: "#374151",
          marginBottom: 4,
          fontWeight: 600,
        }}
      >
        {label}
      </div>
      {children}
    </div>
  );
}

function buildYears(min, max) {
  if (min == null || max == null) return [];
  const out = [];
  for (let y = Number(min); y <= Number(max); y++) out.push(y);
  return out;
}

const panelStyle = {
  border: "1px solid #e0e0e0",
  borderRadius: 8,
  padding: 24,
  background: "#fafafa",
  marginTop: 20,
  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: 16,
  marginTop: 16,
};

const fieldStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 8,
};

const selectStyle = {
  padding: "10px 12px",
  borderRadius: 6,
  border: "1px solid #d0d0d0",
  background: "white",
  fontSize: 14,
  color: "#333",
  cursor: "pointer",
  transition: "all 0.2s ease",
};

const inputStyle = {
  padding: "10px 12px",
  borderRadius: 6,
  border: "1px solid #d0d0d0",
  background: "white",
  fontSize: 14,
  color: "#333",
  transition: "all 0.2s ease",
};

const btnStyle = {
  padding: "12px 24px",
  borderRadius: 6,
  border: "none",
  background: "#2c3e50",
  color: "white",
  cursor: "pointer",
  fontWeight: 600,
  fontSize: 14,
  transition: "all 0.2s ease",
};

const btnSecondaryStyle = {
  padding: "12px 24px",
  borderRadius: 6,
  border: "1px solid #d0d0d0",
  background: "white",
  color: "#555",
  cursor: "pointer",
  fontWeight: 500,
  fontSize: 14,
  transition: "all 0.2s ease",
};
