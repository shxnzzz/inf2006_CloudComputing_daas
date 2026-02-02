import { useEffect, useState } from "react";
import { getMeta, postOutliers } from "../api/mohService";
import FilterPanel from "../components/FilterPanel";
import StatCards from "../components/StatCards";

export default function OutliersPage() {
  const [meta, setMeta] = useState(null);
  const [filters, setFilters] = useState({
    age: "",
    sex: "",
    facility_type: "",
    year_start: "",
    year_end: "",
    z_threshold: 2.0,
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const m = await getMeta();
        const vv = m?.valid_values || m;
        setMeta(vv);

        setFilters((prev) => ({
          ...prev,
          age: vv.age?.[0] || "",
          sex: vv.sex?.[0] || "",
          facility_type: vv.facility_type?.[0] || "",
          year_start: vv.year_min ?? "",
          year_end: vv.year_max ?? "",
        }));
      } catch (e) {
        setError(e?.message || "Failed to load metadata.");
      }
    };
    load();
  }, []);

  const run = async () => {
    try {
      setLoading(true);
      setError("");
      setResult(null);

      const payload = {
        age: filters.age,
        sex: filters.sex,
        facility_type: filters.facility_type,
        year_start: Number(filters.year_start),
        year_end: Number(filters.year_end),
        z_threshold: Number(filters.z_threshold),
      };

      const res = await postOutliers(payload);
      setResult(res);
      if (res?.error) setError(res.error);
    } catch (e) {
      setError(e?.message || "Failed to run outlier detection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Outlier Detection</h2>
      <p>Detect unusual years using z-score thresholding (classical statistics).</p>

      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {meta && (
        <FilterPanel
          meta={meta}
          filters={filters}
          setFilters={setFilters}
          onRun={run}
          loading={loading}
          mode="outliers"
        />
      )}

      {loading && <p>Running analysis...</p>}

      {result && !result.error && (
        <div style={{ marginTop: 16 }}>
          <StatCards
            title="Outlier Stats"
            stats={[
              { label: "Mean", value: result.mean },
              { label: "Std Dev", value: result.stdev },
              { label: "Z Threshold", value: result.z_threshold },
              { label: "Outliers Found", value: (result.outliers || []).length },
            ]}
          />

          <h3 style={{ marginTop: 16 }}>Outliers</h3>
          {(result.outliers || []).length === 0 ? (
            <p>No outliers detected for this configuration.</p>
          ) : (
            <table border="1" cellPadding="8" style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Rate</th>
                  <th>Z-Score</th>
                </tr>
              </thead>
              <tbody>
                {result.outliers.map((o) => (
                  <tr key={o.year}>
                    <td>{o.year}</td>
                    <td>{o.rate}</td>
                    <td>{o.z}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
