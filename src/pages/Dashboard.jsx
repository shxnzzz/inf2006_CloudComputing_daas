import { useEffect, useState } from "react";
import { getMeta, postTrend } from "../api/mohService";
import LineChart from "../components/LineChart";
import StatCards from "../components/StatCards";

export default function Dashboard() {
  const [meta, setMeta] = useState(null);
  const [loadingMeta, setLoadingMeta] = useState(true);
  const [trendData, setTrendData] = useState(null);
  const [loadingTrend, setLoadingTrend] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoadingMeta(true);
        const m = await getMeta();
        setMeta(m?.valid_values || m);
      } catch (e) {
        setError(e?.message || "Failed to load meta.");
      } finally {
        setLoadingMeta(false);
      }
    };
    load();
  }, []);

  // Load a default trend once meta is available
  useEffect(() => {
    const loadDefaultTrend = async () => {
      if (!meta) return;
      try {
        setLoadingTrend(true);
        setError("");

        const payload = {
          age: meta.age?.[0],
          sex: meta.sex?.[0],
          facility_type: meta.facility_type?.[0],
          year_start: meta.year_min,
          year_end: meta.year_max,
        };

        const res = await postTrend(payload);
        if (res?.error) setError(res.error);
        setTrendData(res);
      } catch (e) {
        setError(e?.message || "Failed to load default trend.");
      } finally {
        setLoadingTrend(false);
      }
    };
    loadDefaultTrend();
  }, [meta]);

  return (
    <div className="page-container">
      <h2>MOH Hospital Admissions Dashboard</h2>
      <p>
        Welcome to the Ministry of Health Hospital Admissions Data Analytics as a Service platform. 
        This dashboard provides an overview of the dataset coverage and displays a default trend analysis.
      </p>

      {loadingMeta && <p className="loading-state">Loading dataset metadata...</p>}
      {error && <p className="error-state">{error}</p>}

      {meta && (
        <div style={{ marginTop: 24 }}>
          <h3>📊 Dataset Coverage</h3>
          <ul>
            <li>Year range: {meta.year_min} to {meta.year_max}</li>
            <li>Age groups: {meta.age?.length || 0} categories</li>
            <li>Sex: {meta.sex?.join(", ")}</li>
            <li>Facility types: {meta.facility_type?.join(", ")}</li>
          </ul>
        </div>
      )}

      <div style={{ marginTop: 32 }}>
        <h3>📈 Overview Trend</h3>
        {loadingTrend && <p className="loading-state">Loading trend data...</p>}

        {trendData && !trendData.error && (
          <div style={{ display: "grid", gap: 20, marginTop: 16 }}>
            <StatCards
              title="Summary Statistics"
              stats={[
                { label: "Mean Rate", value: trendData.summary?.mean },
                { label: "Std Deviation", value: trendData.summary?.stdev },
                { label: "Minimum", value: trendData.summary?.min },
                { label: "Maximum", value: trendData.summary?.max },
              ]}
            />

            <LineChart
              title="Hospital Admission Rate Over Time"
              data={trendData.series || []}
              xKey="year"
              yKey="rate"
            />
          </div>
        )}

        {trendData?.error && <p className="error-state">{trendData.error}</p>}
      </div>
    </div>
  );
}
