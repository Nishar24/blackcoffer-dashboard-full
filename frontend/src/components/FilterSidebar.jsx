const CaretIcon = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
    <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.3" />
  </svg>
);

const FIELD_META = [
  { key: "end_year", label: "End year" },
  { key: "topic", label: "Topic" },
  { key: "sector", label: "Sector" },
  { key: "region", label: "Region" },
  { key: "pestle", label: "PEST category" },
  { key: "source", label: "Source" },
  { key: "country", label: "Country" },
];

export default function FilterSidebar({ options, filters, onChange, onReset, totalRecords }) {
  return (
    <aside className="rail">
      <h1 className="rail__title">Global Insight Atlas</h1>
      <p className="rail__subtitle">
        {totalRecords ?? "…"} research insights on intensity, likelihood &amp; relevance across
        sectors and regions worldwide.
      </p>

      <div className="rail__section">
        <p className="rail__label">Filter records</p>
        {FIELD_META.map(({ key, label }) => (
          <div className="field" key={key} style={{ marginBottom: 14 }}>
            <label className="field-arrow">
              <select value={filters[key] || ""} onChange={(e) => onChange(key, e.target.value)}>
                <option value="">{label} — All</option>
                {(options[key] || []).map((val) => (
                  <option key={val} value={val}>
                    {val}
                  </option>
                ))}
              </select>
              <CaretIcon />
            </label>
          </div>
        ))}
      </div>

      <div className="rail__section">
        <p className="rail__label">Minimum intensity</p>
        <div className="field" style={{ paddingBottom: 10 }}>
          <input
            type="range"
            min="0"
            max="10"
            step="1"
            value={filters.intensityMin || 0}
            onChange={(e) => onChange("intensityMin", e.target.value)}
            style={{ width: "100%" }}
          />
          <div style={{ fontSize: 12, color: "rgba(236,238,232,0.55)", marginTop: 4 }}>
            {filters.intensityMin || 0} and above
          </div>
        </div>
      </div>

      <button className="rail__reset" onClick={onReset}>
        Reset all filters
      </button>
    </aside>
  );
}
