import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  ZAxis,
  Legend,
} from "recharts";

const COLORS = ["#b8842f", "#2e7d6b", "#a8482f", "#5b6b78", "#dcb875", "#263544", "#7a9e93", "#c97a5a"];

const AXIS_STYLE = { fontSize: 11.5, fill: "#5b6b78", fontFamily: "IBM Plex Sans" };

const TooltipBox = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "#16212c",
        color: "#eceee8",
        padding: "8px 12px",
        fontSize: 12.5,
        fontFamily: "IBM Plex Sans",
        border: "1px solid rgba(236,238,232,0.15)",
      }}
    >
      {label && <div style={{ marginBottom: 4, opacity: 0.7 }}>{label}</div>}
      {payload.map((p, i) => (
        <div key={i}>
          {p.name}: <strong>{typeof p.value === "number" ? p.value.toFixed(2) : p.value}</strong>
        </div>
      ))}
    </div>
  );
};

const Empty = () => <div className="panel__empty">No records match the current filters.</div>;

export function TopicIntensityPanel({ data }) {
  const chartData = (data || []).map((d) => ({ name: d._id, value: Number(d.avgIntensity.toFixed(2)) }));
  return (
    <div className="panel">
      <p className="panel__title">Intensity by topic</p>
      <p className="panel__caption">Average intensity score, top 15 topics</p>
      {chartData.length === 0 ? (
        <Empty />
      ) : (
        <ResponsiveContainer width="100%" height={340}>
          <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 16 }}>
            <CartesianGrid horizontal={false} stroke="rgba(22,33,44,0.1)" />
            <XAxis type="number" tick={AXIS_STYLE} axisLine={false} tickLine={false} />
            <YAxis
              type="category"
              dataKey="name"
              width={110}
              tick={AXIS_STYLE}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<TooltipBox />} cursor={{ fill: "rgba(184,132,47,0.08)" }} />
            <Bar dataKey="value" name="Avg intensity" fill="#b8842f" radius={[0, 2, 2, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export function CountryIntensityPanel({ data }) {
  const chartData = (data || []).map((d) => ({
    name: d._id,
    intensity: Number(d.avgIntensity.toFixed(2)),
    count: d.count,
  }));
  return (
    <div className="panel">
      <p className="panel__title">Top countries by volume</p>
      <p className="panel__caption">Insight count &amp; average intensity, top 15 countries</p>
      {chartData.length === 0 ? (
        <Empty />
      ) : (
        <ResponsiveContainer width="100%" height={340}>
          <BarChart data={chartData} margin={{ left: -20 }}>
            <CartesianGrid vertical={false} stroke="rgba(22,33,44,0.1)" />
            <XAxis dataKey="name" tick={{ ...AXIS_STYLE, fontSize: 10.5 }} interval={0} angle={-40} textAnchor="end" height={80} axisLine={false} tickLine={false} />
            <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} />
            <Tooltip content={<TooltipBox />} cursor={{ fill: "rgba(184,132,47,0.08)" }} />
            <Bar dataKey="count" name="Insight count" fill="#2e7d6b" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export function RegionPanel({ data }) {
  const chartData = (data || []).map((d) => ({ name: d._id, value: d.count }));
  return (
    <div className="panel">
      <p className="panel__title">Distribution by region</p>
      <p className="panel__caption">Share of insights across world regions</p>
      {chartData.length === 0 ? (
        <Empty />
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={100} paddingAngle={1}>
              {chartData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="var(--paper-raised)" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip content={<TooltipBox />} />
            <Legend
              layout="vertical"
              align="right"
              verticalAlign="middle"
              wrapperStyle={{ fontSize: 12, fontFamily: "IBM Plex Sans" }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export function YearTrendPanel({ data }) {
  const chartData = (data || []).map((d) => ({ year: d._id, count: d.count }));
  return (
    <div className="panel panel--wide">
      <p className="panel__title">Insights published by start year</p>
      <p className="panel__caption">Volume of research insights over time</p>
      {chartData.length === 0 ? (
        <Empty />
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={chartData} margin={{ left: -20 }}>
            <CartesianGrid vertical={false} stroke="rgba(22,33,44,0.1)" />
            <XAxis dataKey="year" tick={AXIS_STYLE} axisLine={false} tickLine={false} />
            <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} />
            <Tooltip content={<TooltipBox />} />
            <Line type="monotone" dataKey="count" name="Insights" stroke="#a8482f" strokeWidth={2} dot={{ r: 3, fill: "#a8482f" }} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export function SectorPanel({ data }) {
  const chartData = (data || []).slice(0, 12).map((d) => ({ name: d._id, value: d.count }));
  return (
    <div className="panel">
      <p className="panel__title">Insights by sector</p>
      <p className="panel__caption">Record count per sector</p>
      {chartData.length === 0 ? (
        <Empty />
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 16 }}>
            <CartesianGrid horizontal={false} stroke="rgba(22,33,44,0.1)" />
            <XAxis type="number" tick={AXIS_STYLE} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="name" width={100} tick={AXIS_STYLE} axisLine={false} tickLine={false} />
            <Tooltip content={<TooltipBox />} cursor={{ fill: "rgba(184,132,47,0.08)" }} />
            <Bar dataKey="value" name="Count" fill="#5b6b78" radius={[0, 2, 2, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export function PestlePanel({ data }) {
  const chartData = (data || []).map((d) => ({ name: d._id, value: d.count }));
  return (
    <div className="panel">
      <p className="panel__title">PEST category breakdown</p>
      <p className="panel__caption">Political, economic, social &amp; technological weighting</p>
      {chartData.length === 0 ? (
        <Empty />
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie data={chartData} dataKey="value" nameKey="name" outerRadius={100} paddingAngle={1}>
              {chartData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="var(--paper-raised)" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip content={<TooltipBox />} />
            <Legend
              layout="vertical"
              align="right"
              verticalAlign="middle"
              wrapperStyle={{ fontSize: 12, fontFamily: "IBM Plex Sans" }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export function SourcePanel({ data }) {
  const chartData = (data || []).map((d) => ({ name: d._id, value: d.count }));
  return (
    <div className="panel">
      <p className="panel__title">Top sources</p>
      <p className="panel__caption">Where these insights were published</p>
      {chartData.length === 0 ? (
        <Empty />
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 16 }}>
            <CartesianGrid horizontal={false} stroke="rgba(22,33,44,0.1)" />
            <XAxis type="number" tick={AXIS_STYLE} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="name" width={110} tick={AXIS_STYLE} axisLine={false} tickLine={false} />
            <Tooltip content={<TooltipBox />} cursor={{ fill: "rgba(184,132,47,0.08)" }} />
            <Bar dataKey="value" name="Count" fill="#dcb875" radius={[0, 2, 2, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export function ScatterPanel({ data }) {
  const chartData = (data || []).map((d) => ({
    likelihood: d.likelihood,
    relevance: d.relevance,
    intensity: d.intensity,
    topic: d.topic,
  }));
  return (
    <div className="panel panel--wide">
      <p className="panel__title">Likelihood vs. relevance</p>
      <p className="panel__caption">Each point is one insight; bubble size reflects intensity</p>
      {chartData.length === 0 ? (
        <Empty />
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <ScatterChart margin={{ left: -10, right: 20, top: 10 }}>
            <CartesianGrid stroke="rgba(22,33,44,0.1)" />
            <XAxis type="number" dataKey="likelihood" name="Likelihood" tick={AXIS_STYLE} axisLine={false} tickLine={false} />
            <YAxis type="number" dataKey="relevance" name="Relevance" tick={AXIS_STYLE} axisLine={false} tickLine={false} />
            <ZAxis type="number" dataKey="intensity" range={[30, 300]} name="Intensity" />
            <Tooltip content={<TooltipBox />} cursor={{ strokeDasharray: "3 3" }} />
            <Scatter data={chartData} fill="#a8482f" fillOpacity={0.55} />
          </ScatterChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
