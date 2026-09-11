import { useEffect, useState, useCallback } from "react";
import FilterSidebar from "./components/FilterSidebar";
import KpiStrip from "./components/KpiStrip";
import DataTable from "./components/DataTable";
import {
  TopicIntensityPanel,
  CountryIntensityPanel,
  RegionPanel,
  YearTrendPanel,
  SectorPanel,
  PestlePanel,
  SourcePanel,
  ScatterPanel,
} from "./components/Panels";
import { getFilterOptions, getStats, getData } from "./api/client";

export default function App() {
  const [options, setOptions] = useState({});
  const [filters, setFilters] = useState({});
  const [stats, setStats] = useState(null);
  const [tableResult, setTableResult] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load filter dropdown options once on mount
  useEffect(() => {
    getFilterOptions()
      .then(setOptions)
      .catch((err) => setError(err.message));
  }, []);

  // Reload stats + table whenever filters or page change
  const loadData = useCallback(() => {
    setLoading(true);
    setError(null);
    Promise.all([getStats(filters), getData({ ...filters, page, limit: 20 })])
      .then(([statsRes, dataRes]) => {
        setStats(statsRes);
        setTableResult(dataRes);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [filters, page]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleFilterChange = (key, value) => {
    setPage(1);
    setFilters((prev) => {
      const next = { ...prev };
      if (value === "" || value === "0") {
        delete next[key];
      } else {
        next[key] = value;
      }
      return next;
    });
  };

  const handleReset = () => {
    setPage(1);
    setFilters({});
  };

  if (error) {
    return (
      <div className="error-screen">
        <div className="error-screen__box">
          Couldn't reach the API.
          <code>{error}</code>
          <p style={{ fontFamily: "IBM Plex Sans", fontSize: 13, marginTop: 10 }}>
            Make sure the backend is running on the URL set in VITE_API_URL (see .env).
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="shell">
      <FilterSidebar
        options={options}
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleReset}
        totalRecords={tableResult?.total}
      />

      <main className="main">
        <div className="main__header">
          <h2 className="main__heading">Data visualization dashboard</h2>
          <span className="main__meta">{loading ? "refreshing…" : "live from MongoDB"}</span>
        </div>

        <KpiStrip kpis={stats?.kpis} />

        <div className="grid">
          <TopicIntensityPanel data={stats?.intensityByTopic} />
          <CountryIntensityPanel data={stats?.countryIntensity} />
          <RegionPanel data={stats?.regionDistribution} />
          <SectorPanel data={stats?.sectorDistribution} />
          <PestlePanel data={stats?.pestleDistribution} />
          <SourcePanel data={stats?.sourceDistribution} />
          <YearTrendPanel data={stats?.yearTrend} />
          <ScatterPanel data={stats?.likelihoodVsRelevance} />
          <DataTable result={tableResult} page={page} onPageChange={setPage} />
        </div>
      </main>
    </div>
  );
}
