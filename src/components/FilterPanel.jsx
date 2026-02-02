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
      <h3 style={{ marginTop: 0 }}>Filters</h3>

      <div style={gridStyle}>
        {/* Common fields */}
        <Field label="Age Group">
          <select
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
                type="number"
                step="0.1"
                value={filters.z_threshold ?? 2.0}
                onChange={(e) => set("z_threshold", e.target.value)}
              />
              <small style={{ color: "#6b7280" }}>
                Common: 2.0 (moderate), 2.5 (stricter), 3.0 (very strict)
              </small>
            </Field>
          </>
        )}

        {mode === "compare" && (
          <>
            <Field label="Group A (Sex)">
              <select
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

      <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
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
      <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 6 }}>
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
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: 16,
  background: "white",
  marginTop: 12,
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 12,
};

const fieldStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
};

const btnStyle = {
  padding: "10px 14px",
  borderRadius: 10,
  border: "1px solid #111827",
  background: "#111827",
  color: "white",
  cursor: "pointer",
};

const btnSecondaryStyle = {
  padding: "10px 14px",
  borderRadius: 10,
  border: "1px solid #e5e7eb",
  background: "#f9fafb",
  cursor: "pointer",
};
