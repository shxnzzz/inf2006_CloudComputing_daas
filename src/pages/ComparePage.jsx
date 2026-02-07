import { useEffect, useState } from "react";
import { getMeta, postCompare } from "../api/mohService";
import FilterPanel from "../components/FilterPanel";
import LineChart from "../components/LineChart";
import StatCards from "../components/StatCards";

export default function ComparePage() {
  const [meta, setMeta] = useState(null);
  const [filters, setFilters] = useState({
    age: "",
    facility_type: "",
    year_start: "",
    year_end: "",
    groupA_sex: "female",
    groupB_sex: "male",
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
          facility_type: vv.facility_type?.[0] || "",
          year_start: vv.year_min ?? "",
          year_end: vv.year_max ?? "",
          groupA_sex: vv.sex?.[0] || "female",
          groupB_sex: vv.sex?.[1] || "male",
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
        facility_type: filters.facility_type,
        year_start: Number(filters.year_start),
        year_end: Number(filters.year_end),
        groupA_sex: filters.groupA_sex,
        groupB_sex: filters.groupB_sex,
      };

      const res = await postCompare(payload);
      setResult(res);
      if (res?.error) setError(res.error);
    } catch (e) {
      setError(e?.message || "Failed to run comparison analysis.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h2>Comparison Analysis</h2>
      <p>
        Compare hospital admission rates between two demographic groups over the same time period. 
        This analysis reveals differences, ratios, and trends to identify disparities between groups.
      </p>

      {error && <p className="error-state">{error}</p>}

      {meta && (
        <FilterPanel
          meta={meta}
          filters={filters}
          setFilters={setFilters}
          onRun={run}
          loading={loading}
          mode="compare"
        />
      )}

      {loading && <p className="loading-state">Running comparison analysis...</p>}

      {result && !result.error && (
        <div style={{ display: "grid", gap: 20, marginTop: 24 }}>
          <StatCards
            title="Comparison Summary"
            stats={[
              { label: "Mean Difference", value: result.summary?.mean_diff },
              { label: "Max Gap Year", value: result.summary?.max_gap_year },
              { label: "Max Gap Value", value: result.summary?.max_gap_value },
            ]}
          />

          <LineChart
            title={`Difference (${filters.groupA_sex} - ${filters.groupB_sex})`}
            data={result.diff_series || []}
            xKey="year"
            yKey="diff"
          />

          <LineChart
            title={`Ratio (${filters.groupA_sex} / ${filters.groupB_sex})`}
            data={result.ratio_series || []}
            xKey="year"
            yKey="ratio"
          />
        </div>
      )}
    </div>
  );
}
