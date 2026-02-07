import { useEffect, useState } from "react";
import { getMeta, postTrend } from "../api/mohService";
import FilterPanel from "../components/FilterPanel";
import LineChart from "../components/LineChart";
import BarChart from "../components/BarChart";
import StatCards from "../components/StatCards";

export default function TrendPage() {
  const [meta, setMeta] = useState(null);
  const [filters, setFilters] = useState({
    age: "",
    sex: "",
    facility_type: "",
    year_start: "",
    year_end: "",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // load meta + set defaults
  useEffect(() => {
    const load = async () => {
      try {
        const m = await getMeta();
        const vv = m?.valid_values || m;
        setMeta(vv);

        setFilters({
          age: vv.age?.[0] || "",
          sex: vv.sex?.[0] || "",
          facility_type: vv.facility_type?.[0] || "",
          year_start: vv.year_min ?? "",
          year_end: vv.year_max ?? "",
        });
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
        ...filters,
        year_start: Number(filters.year_start),
        year_end: Number(filters.year_end),
      };

      const res = await postTrend(payload);
      setResult(res);
      if (res?.error) setError(res.error);
    } catch (e) {
      setError(e?.message || "Failed to run trend analysis.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h2>Trend Analysis</h2>
      <p>
        Explore yearly hospital admission rate trends with comprehensive summary statistics 
        and year-over-year percentage changes. Customize your analysis using the filters below.
      </p>

      {error && <p className="error-state">{error}</p>}

      {meta && (
        <FilterPanel
          meta={meta}
          filters={filters}
          setFilters={setFilters}
          onRun={run}
          loading={loading}
          mode="trend"
        />
      )}

      {loading && <p className="loading-state">Running trend analysis...</p>}

      {result && !result.error && (
        <div style={{ display: "grid", gap: 20, marginTop: 24 }}>
          <StatCards
            title="Summary Statistics"
            stats={[
              { label: "Mean Rate", value: result.summary?.mean },
              { label: "Std Deviation", value: result.summary?.stdev },
              { label: "Minimum", value: result.summary?.min },
              { label: "Maximum", value: result.summary?.max },
            ]}
          />

          <LineChart
            title="Hospital Admission Rate Over Time"
            data={result.series || []}
            xKey="year"
            yKey="rate"
          />

          <BarChart
            title="Year-on-Year Percentage Change"
            data={(result.yoy_change || []).map((d) => ({
              year: d.year,
              pct_change: d.pct_change,
            }))}
            xKey="year"
            yKey="pct_change"
          />
        </div>
      )}
    </div>
  );
}
