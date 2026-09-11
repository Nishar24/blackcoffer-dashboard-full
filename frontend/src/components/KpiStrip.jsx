const fmt = (n) => (n === undefined || n === null || isNaN(n) ? "—" : Number(n).toFixed(1));

export default function KpiStrip({ kpis }) {
  const items = [
    { label: "Total insights", value: kpis?.totalRecords ?? 0, decimals: false },
    { label: "Avg. intensity", value: fmt(kpis?.avgIntensity) },
    { label: "Avg. likelihood", value: fmt(kpis?.avgLikelihood) },
    { label: "Avg. relevance", value: fmt(kpis?.avgRelevance) },
  ];

  return (
    <div className="kpis">
      {items.map((item) => (
        <div className="kpi" key={item.label}>
          <p className="kpi__label">{item.label}</p>
          <p className="kpi__value">
            {item.decimals === false ? kpis?.totalRecords ?? 0 : item.value}
          </p>
        </div>
      ))}
    </div>
  );
}
