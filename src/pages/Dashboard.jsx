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
    <div style={{ padding: 20 }}>
      <h2>MOH Hospital Admissions DAaaS</h2>
      <p>
        Dashboard overview. Shows dataset coverage and a default trend chart.
      </p>

      {loadingMeta && <p>Loading dataset metadata...</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {meta && (
        <div style={{ marginTop: 12 }}>
          <h3>Dataset Coverage</h3>
          <ul>
            <li>Year range: {meta.year_min} to {meta.year_max}</li>
            <li>Age groups: {meta.age?.length || 0}</li>
            <li>Sex: {meta.sex?.join(", ")}</li>
            <li>Facility types: {meta.facility_type?.join(", ")}</li>
          </ul>
        </div>
      )}

      <div style={{ marginTop: 20 }}>
        <h3>Default Trend</h3>
        {loadingTrend && <p>Loading trend...</p>}

        {trendData && !trendData.error && (
          <>
            <StatCards
              title="Trend Summary"
              stats={[
                { label: "Mean", value: trendData.summary?.mean },
                { label: "Std Dev", value: trendData.summary?.stdev },
                { label: "Min", value: trendData.summary?.min },
                { label: "Max", value: trendData.summary?.max },
              ]}
            />

            <LineChart
              title="Admission Rate Over Time"
              data={trendData.series || []}
              xKey="year"
              yKey="rate"
            />
          </>
        )}

        {trendData?.error && <p style={{ color: "crimson" }}>{trendData.error}</p>}
      </div>
    </div>
  );
}
